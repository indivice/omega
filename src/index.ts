import { HTML, ListView, ListViewEvent, Portal, RenderEngine, RenderWebPlatform } from "./driver.js"
import { GlobalAttributes, OmegaString } from "./type.js"

export type ChildDynamicProperty = Dynamic<string | String | Component | (() => Component | string) | ChildDynamicProperty>

export type Properties = {

    __driver__?: object,
    ondestroy?: () => any,
    children?: (Component | OmegaString | ChildDynamicProperty)[], //verify both using instanceof, very handy.
    child?: Component | OmegaString | ChildDynamicProperty,
    style?: {
        [P in keyof Partial<CSSStyleDeclaration & { "viewTransitionName": string }>]: string | String | Dynamic<string | String>
    } | Dynamic<{
        [P in keyof Partial<CSSStyleDeclaration & { "viewTransitionName": string }>]: string | String | Dynamic<string | String>
    }>,
    reference?: State<any>

} & Partial<GlobalAttributes>


export type Component = {
    name: string,
    properties: Properties,
    hasChild: boolean,
}



export function Component(name: string, properties: Properties = {}, hasChild = true): Component {

    return {
        name,
        properties,
        hasChild,
    }

}

// export class Component {

//     name: string
//     properties: Properties
//     hasChild: boolean

//     constructor(name: string, properties: Properties = {}, hasChild = true) {
//         this.name = name
//         this.properties = properties
//         this.hasChild = hasChild
//     }

//     build(engine: RenderEngine) {

//         if ( this.name != "portal" && this.name != "html" && this.name != "empty" && this.name != "listview") {
//             const el = document.createElement(this.name)
//             return el
//         } else {
//             return lookupTable[this.name](engine, this)
//         }

//     }

// }
/**
 * The idea is, whenever the $-directive is called, the callback is added to this set.
 * Then, the callback is called. If the callback has any stateful usage, it will then automatically fetch\
 * the last one here.
 * 
 * Then the callback is removed from the detector stack to make sure there is no unwanted listening happening.
 */
const DetectorStack: ((...args: any[]) => any)[] = []
const DisposeMap: Map<(...args: any[]) => any, State<any>[]> = new Map()

export function disposeDetector( callback: (...args: any[]) => any ) {

    for ( let state of DisposeMap.get(callback) ) {
        state.subscribers.delete(callback)
        state.trackExternallyAssignedFunctions.delete(callback)
    }

    DisposeMap.delete(callback)

}

function SimpleConditionState() {

    let condition: string = null

    const set = (cond: string) => {
        condition = cond
    }

    const get = () => condition

    return {
        set, get
    }

}

export class Dynamic<T> {

    condition: {
        set: (cond: string) => void;
        get: () => string;
    }

    callback: () => T

    constructor(callback: (condition: (cond: string) => void) => T, condition: {
        set: (cond: string) => void;
        get: () => string;
    }) {

        this.condition = condition
        this.callback = () => callback(condition.set)
    }

    static assign(callback: () => any) {

        DetectorStack.push(callback)
        let cbx = callback()
        DetectorStack.pop()
        return cbx

    }

}

export type StateEvent<T> = {
    event: "update"
    value: T
} | {
    event: "batch",
    value: Map<State<any>, any>
}

export class State<T> {

    value: T
    subscribers: Set<(event: StateEvent<T>) => any> = new Set()
    trackExternallyAssignedFunctions: Set<(event: StateEvent<T>) => any> = new Set()

    constructor(value: T = null) {
        this.value = value
    }

    static batch(...batches: { state: State<any>, value: any }[]) {

        let callbackPool = new Set<(event: StateEvent<any>) => any>()
        let statePool = new Map<State<any>, any>

        for (let _batch of batches) {

            //because union is not supported everywhere
            for (let subscriber of _batch.state.subscribers) {
                callbackPool.add(subscriber)
            }

            statePool.set(_batch.state, _batch.value)
            _batch.state.value = _batch.value

        }

        for (let callback of callbackPool) {

            callback({ event: "batch", value: statePool })

        }

    }

    get() {
        if (DetectorStack.length != 0) {
            this.subscribers.add(DetectorStack[DetectorStack.length - 1]) //add the last element.
            this.trackExternallyAssignedFunctions.add(DetectorStack[DetectorStack.length - 1])
            
            if ( DisposeMap.has( DetectorStack[DetectorStack.length - 1] ) ) {
                DisposeMap.set(
                    DetectorStack[DetectorStack.length - 1], [
                        ...DisposeMap.get(DetectorStack[DetectorStack.length - 1]),
                        this
                    ]
                )
            } else {
                DisposeMap.set(
                    DetectorStack[DetectorStack.length - 1],
                    [this]
                )
            }
        }
        return this.value
    }

    set(value: T, batch: boolean = false): { state: State<T>, value: T } {

        if (batch == true) {
            return {
                state: this,
                value
            }
        }

        let temp = this.value
        this.value = value
        for (let subscriber of this.subscribers) {
            if (this.trackExternallyAssignedFunctions.has(subscriber)) {
                DetectorStack.push(subscriber)
                subscriber({ event: "update", value: temp })
                DetectorStack.pop()
            } else {
                subscriber({ event: "update", value: temp })
            }
        }

    }

    update(callback: (prev: T) => T, batch: boolean = false): { state: State<T>, value: T } {

        if (batch == true) {
            return {
                state: this,
                value: callback(this.value)
            }
        }

        let temp = this.value
        this.value = callback(this.value)

        for (let subscriber of this.subscribers) {
            if (this.trackExternallyAssignedFunctions.has(subscriber)) {
                DetectorStack.push(subscriber)
                subscriber({ event: "update", value: temp })
                DetectorStack.pop()
            } else {
                subscriber({ event: "update", value: temp })
            }
        }
    }

    listen(callback: (event: StateEvent<T>) => any) {
        this.subscribers.add(callback)
        return callback
    }

}

/**
 * System of conditions: This is useful for avoiding re-rendering of content.
 * 
 * For example, when we are using if-else loop, and want to return something,
 * the condition is checked on the dynamic instance
 * 
 * If the condition is null, conditional cases are ignored.
 * Now, conditions are primitive string ids.
 * 
 * The driver will store the condition of a given dynamic callback. If the condition, is same as before,
 * then no re-rendering will happen.
 * 
 * If the condition is different, then the new condition is stored, and the corresponding element is
 * replaced by the new one.
 * 
 * Any property that might depend on this callback, will have to cache the condition to compare
 * it with. This is especially useful to reduce unecessary code calls.
 */
export function $<T>(callback: (setKey: (key: string) => void) => T) {

    const condition = SimpleConditionState()
    return new Dynamic<T>(callback, condition)

}

export function listItem<T>(value: T, item: { item: T } = null) {
    if (item != null) {
        item.item = value
        return item
    } else {
        return {
            item: value
        }
    }
}

export function manyListItems<T>(value: T[] = []) {
    return value.map(v => listItem(v))
}

export function useListItem<T>(state: State<ListViewEvent<{ item: T }>>): [
    () => number,
    () => T,
    (callback: (value: T) => T, batch?: boolean) => void
] {

    return [
        () => state.get().index,
        () => state.get().value.item,
        (callback: (value: T) => T, batch: boolean = false) => {
            state.update(p => ({
                ...p,
                value: {
                    item: callback(p.value.item)
                }
            }), batch)
        }
    ]

}

export class LazyComponent {

    _lazyConsumerState = new State<() => Component>()
    callback: () => Promise<{ default: () => Component }>
    error = new State<boolean>(false)

    constructor(callback: () => Promise<{ default: () => Component }>) {

        this.callback = callback

    }

    load() {

        if (this._lazyConsumerState.get() == null) {
            this.callback().then(value => this._lazyConsumerState.set(value.default))
                .catch(reason => {
                    console.log(reason),
                    this.error.set(true)
                })
        }
    }

}

export function useLazy({ consumer, onLoad, onError = "Failed to load dynamic component" } : {
    consumer: LazyComponent, 
    onLoad: Component | OmegaString | ChildDynamicProperty, 
    onError?: Component | OmegaString | ChildDynamicProperty}): ChildDynamicProperty {

    //@ts-ignore
    return $((_key) => {

        if (consumer._lazyConsumerState.get() != null) {

            _key("lazy loaded")
            return consumer._lazyConsumerState.get()

        } else if (consumer.error.get() == true) {

            _key("lazy error")
            return () => onError

        } else {

            _key("lazy loading")
            return () => onLoad

        }

    })

}

export function useMemo<T>(callback: () => T): [ State<T>, () => void ] {

    const _state = new State<T>()

    const memoizeChanges = () => {
        _state.set( callback() )
    }

    const clearMemo = () => {
        disposeDetector(memoizeChanges)
    }

    Dynamic.assign(memoizeChanges)
    return [_state, clearMemo]

}

export function useCallback(callback: () => void) {

    const clearCallback = () => {
        disposeDetector(callback)
    }

    Dynamic.assign(callback)
    return clearCallback

}

export function useInputBind(state: State<string> | State<String>) {

    const _properties = {
        value: $(() => `${ state.get().valueOf() }`),
        oninput(e) {
            state.set((e.target as HTMLInputElement).value)
        }
    }

    return _properties

}

export function Render(properties: { selector: string, app: () => Component }) {

    //renders for the web platform
    RenderWebPlatform(properties)

}