import { ListViewEvent, RenderWebPlatform } from "./driver.js"
import { ComponentIndex, GlobalAttributes, OmegaString } from "./type.js"

export type ChildDynamicProperty = Dynamic<string | String | Component | (() => Component | string)>

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

export class Component {

    name: ComponentIndex
    properties: Properties

    constructor(name: ComponentIndex, properties: Properties = {}) {
        this.name = name
        this.properties = properties
    }

}
/**
 * The idea is, whenever the $-directive is called, the callback is added to this set.
 * Then, the callback is called. If the callback has any stateful usage, it will then automatically fetch\
 * the last one here.
 * 
 * Then the callback is removed from the detector stack to make sure there is no unwanted listening happening.
 */
const DetectorStack: (() => any)[] = []

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
        this.callback = () => callback( condition.set )
    }

    assign(callback: () => any) {

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

    constructor(value: T) {
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
            subscriber({ event: "update", value: temp })
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
            subscriber({ event: "update", value: temp })
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
export function $<T>(callback: (setKey: ( key: string ) => void) => T) {    

    const condition = SimpleConditionState()
    return new Dynamic<T>(callback, condition)

}

export function listItem<T>(value: T) {
    return {
        item: value
    }
}

export function getListItem<T>(state: State<ListViewEvent<{ item: T }>>) {

    return state.get().value.item

}

export function updateListItem<T>(state: State<ListViewEvent<{ item: T }>>, callback: ( value: T ) => T, batch: boolean = false) {

    state.update(p => ({
        ...p,
        value: {
            item: callback(p.value.item)
        }
    }), batch)

}

/**
 * The wrap function is to be used whenever we are dealing with unique values.
 * 
 * To use for ListView generation -> Especially useful since without it, we will
 * not be able to differentiate between two values of the array.
 */

export function Render(properties: { selector: string, app: () => Component }) {

    //renders for the web platform
    RenderWebPlatform(properties)

}