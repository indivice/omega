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
    children?: Component[],
    child?: Component,
    style?: {
        [P in keyof Partial<CSSStyleDeclaration>]: String | string | Dynamic<String | string>
    } | Dynamic<{
        [P in keyof Partial<CSSStyleDeclaration>]: String | string
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

export type Store<StoreType extends object> = {
    spread: State<any>[],
    update: ( updateList: Partial<{ [P in keyof StoreType]: (prev: StoreType[P]) => StoreType[P] }>  ) => void,
} & { [P in keyof StoreType]: State<StoreType[P]> }

export class State<T> {

    value: T
    updateList = new Set<(prev: T, newv: T, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any>()

    constructor(initial: T) {

        this.value = initial

    }

    static Store<StoreType extends object>(input: StoreType) {

        //@ts-ignore (we can do nothing here, it needs to be like this )
        const storeData: { [P in keyof StoreType]: State<StoreType[P]> } = {}
        const spread = []

        Object.keys(input).forEach((key) => {

            storeData[key] = new State(input[key])
            spread.push(storeData[key])

        })

        return {

            ...storeData,
            spread, //helps spreading the entire store for regions, or even advanced array operators to spread some parts (if wished)

            update(updateList: Partial<{ [P in keyof StoreType]: (prev: StoreType[P]) => StoreType[P] }>) {

                let batches = []
                for (let state of Object.keys(updateList)) {

                    batches.push(
                        storeData[state].batch(updateList[state])
                    )

                }

                $batch(batches)

            }

        }

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

    $text(builder: (value: T) => string = (value) => `${this.get()}`) {

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
    listen(fx: (prev: T, newv: T, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any): number {

        this.updateList.add(fx)
        return this.updateList.size - 1

    }

}

/**
 * Scopes are used to track any function outside the scope of the
 * region dynamics. Useful for optimized checks.
 */
export class Dynamic<T> extends Component {

    dynamic: {
        callback: () => T,
        states: State<any>[]
    }

    constructor(callback: () => T, states: State<any>[], __driver__: object = {}) {

        super(ComponentIndex.__dynamic__, {})
        this.dynamic = {
            callback,
            states,
        }

        this.properties.__driver__ = __driver__
    }

}