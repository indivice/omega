//The most fundamental definitions are stored here. All the basic definition required to build
//an application using omega

import { $batch, $node, $property, $text } from "./components"
import { GlobalAttributes, ComponentIndex } from "./type"

/**
 * This part defines the application-specific properties, some of which are global
 * and some of which are not. Generally speaking, a component here takes this property
 */
export type Property = {

    __driver__?: any,
    ondestroy?: () => any,
    children?: Component[],
    child?: Component,
    style?: {
        [P in keyof Partial<CSSStyleDeclaration & {"viewTransitionName": string}>]: String | string | Dynamic<String | string>
    } | Dynamic<{
        [P in keyof Partial<CSSStyleDeclaration & {"viewTransitionName": string}>]: String | string
    }>,
    reference?: State<any>,

} & Partial<GlobalAttributes>

export class Component {

    name: ComponentIndex
    properties: Property

    /**
     * The constructor will accept all sorts of properties, but it is the responsibility of the
     * components to actually implement certail attributes to only certain elements
     */
    constructor(name: ComponentIndex, properties: Property = {}) {

        this.name = name
        this.properties = properties

    }

}

//recursive typing for children updater. Infact, I believe I will need a recursive typing for 
//the normal one as well.
export type StoreUpdater<T> = { [ P in keyof T ]: T[P] extends object ? Partial<StoreUpdater<T[P]>> : T[P] }

export type Store<T extends object> = {
    update: (updater: ( prev: { [ P in keyof T ]: T[P] } ) => Partial<StoreUpdater<T>>) => void,
    listen: (fx: (prev: T, newv: T, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any) => Function,
    removeListener: (fx: (prev: T, newv: T, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any) => Map<State<any> | Store<any>, boolean>,
    get: () => { [ P in keyof T ]: T[P] }
} & { [ P in keyof T ]: T[P] extends object ? Store<T[P]> & { [ N in keyof T[P] ]: T[P][N] extends object ? Store<T[P][N]> : State<T[P][N]> } : State<T[P]> }

export function Store<T extends object>(initial: T): Store<T> {

    //@ts-ignore
    let $: { [ P in keyof T ]: T[P] extends object ? Store<T[P]> & { [ N in keyof T[P] ]: T[P][N] extends object ? Store<T[P][N]> : State<T[P][N]> } : State<T[P]> } = {}
    let keys: string[] = [];

    for ( let key of Object.keys(initial) ) {

        if ( key === "update" || key === "listen" || key === "get" || key === "removeListener" ) {
            throw "Cannot name object to the built-ins. Please make sure you name them differently."
        }

        if ( (typeof(initial[key])) == "object" ) {

            $[key] = Store(initial[key])

        } else {

            $[key] = new State(initial[key])

        }

        keys.push(key)

    }

    return {
        ...$,
        update(updater: ( prev: { [ P in keyof T ]: T[P] } ) => Partial<StoreUpdater<T>>) {

            //update based on states or Store.
            const batches = []
            const _update = updater(this.get())
    
            for ( let _state of Object.keys(_update) ) {
    
                if ( $[_state].update != undefined ) {
    
                    //it is a Store
                    $[_state].update(() => _update[_state])
    
                } else {
    
                    batches.push(
                        $[_state].batch(() => _update[_state])
                    )
    
                }
    
            }
    
        },

        listen(fx: (prev: T, newv: T, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any) {

            console.log(this)
            for ( let item of keys ) {
                $[item].listen(fx)
            }
    
            return fx
    
        },

        removeListener(fx: (prev: T, newv: T, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any) {

            const status = new Map<State<any> | Store<any>, boolean>()
    
            for ( let item of keys ) {
    
                status[$[item]] = $[item].removeListener(fx)
    
            }
    
            return status
    
        },

        get(): { [ P in keyof T ]: T[P] } {

            //@ts-ignore
            const ret: { [ P in keyof T ]: T[P] } = {}
            for ( let item of keys ) {
    
                ret[item] = $[item].get()
    
            }
    
            return ret
    
        }
    
    }

}

export class State<T> {

    private value: T
    updateList = new Set<(prev: T, newv: T, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any>()

    constructor(initial: T) {

        this.value = initial

    }

    batch(callback: (prev: T) => T): { state: State<T>, prev: T, newv: T } {

        const prev = this.value
        this.value = callback(this.value)
        return {
            state: this,
            prev,
            newv: this.value
        }

    }

    $text(builder: (value: T) => string = () => `${this.get()}`) {

        return $text([this], () => builder(this.value))

    }

    $node(builder: (value: T) => Component) {

        return $node([this], () => builder(this.value))

    }

    $property<P>(builder: (value: T) => P) {

        return $property<P>([this], () => builder(this.value))

    }

    get(): T {

        return this.value

    }

    set(value: T) {

        const prev = this.value
        this.value = value
        this.updateList.forEach(fx => fx(prev, value, undefined))

    }

    update(callback: (prev: T) => T) {

        const prev = this.value
        this.value = callback(this.value)

        this.updateList.forEach(fx => fx(prev, this.value, undefined))

    }

    //basic listener
    listen(fx: (prev: T, newv: T, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any): Function {

        this.updateList.add(fx)
        return fx

    }

    removeListener(fx: (prev: T, newv: T, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any): boolean {

        return this.updateList.delete(fx)

    }

}

/**
 * Scopes are used to track any function outside the scope of the
 * region dynamics. Useful for optimized checks.
 */
export class Dynamic<T> extends Component {

    dynamic: {
        callback: () => T,
        states: (State<any> | Store<any>)[]
    }

    constructor(callback: () => T, states: (State<any> | Store<any>)[], __driver__: object = {}) {

        super(ComponentIndex.__dynamic__, {})
        this.dynamic = {
            callback,
            states,
        }

        this.properties.__driver__ = __driver__
    }

}