import { Dynamic, Component, Property, State } from "./index"
import { DriverUtility } from "./driver"
import {
    AudioAttributes, DropdownAttributes,
    DropdownItemAttributes, IFrameAttributes,
    ImageAttributes, InputAttributes,
    LinkAttributes, MediaSourceAttributes,
    MultiMediaAttributes, ComponentIndex,
    Events, VideoAttributes
}
    from "./type"

type defaultPropertyType = Property & Events<Event>

/**
 * Special directives: $<directive>
 */

/**
 * This part implements, what we call a "sub-tree". Basically it is a VDOM approach for complex application states.
 * Use this if requires complex logic, or simple data-replacements. Anyhow, it is still a vdom.
 * 
 * This is where Omega gets intresting. V-Dom component is actually made in mind to work with
 * the web driver. Generally we would like to create a generic platform independet ones.
 * 
 * In any case, $component produces dynamic callbacks for back-to back two trees.
 */

export function $text(states: State<any>[], builder: () => string) {

    return new Dynamic<string>(builder, states, { context: "text" })

}

export function $node(states: State<any>[], builder: () => Component) { //replaces node when dependency updates. To be used SURGICALLY.

    return new Dynamic<Component>(builder, states, { context: "node" })

}

export function $property<T>(states: State<any>[], builder: () => T) {

    return new Dynamic<T>(builder, states, { context: "property" })

}

export type When = {
    condition: () => boolean
    execute: () => Component
}

export function $switch(states: State<any>[], conditions: When[], fallback: Component = Layout.Empty()) {

    //@ts-ignore
    return new Dynamic<Component>(() => { }, states, { context: 'switch', conditions, fallback })

}

export function $when(condition: () => boolean, execute: () => Component) {

    return {
        condition, execute
    }

}

export function $batch(batches: { state: State<any>, prev: any, newv: any }[]) {

    /**
     * Batching is a concept where some of the states are updated at once, and all the listeners
     * are called exactly once.
     * 
     * But if multiple states has the same set of callbacks, it becomes difficult.
     * To fix this problem, we will use set, and if you are listening to multiple states at once,
     * don't:
     * 
     * state.listen(() => {}) [wrong]
     * 
     * function listener() { ... }
     * state.listen(listener) [correct]
     * 
     * This is because the later one preserves the function address, making comparing them easier
     * in set, so that the same function is not called multiple times, because their respective callbacks
     * are called once. It is always a best practice to call once.
     * 
     * When doing a batch update, the states can have multiple same-function states across
     * so it does not know which value to send, so we send a map to the said states linked with the previous and next items.
     * 
     * Those maps are very precise, and the states can be compared to see if the state was indeed the state I am looking for.
     * 
     * generally it is better to derive a new state from multiple state!
     */

    const batchMap = new Map<State<any>, { prev: any, newv: any }>()

    const callbacks = new Set<(prev: any, newv: any, batch: undefined | Map<State<any>, { prev: any, newv: any }>) => any>([

        ...batches.reduce((prev, item) => {

            batchMap.set(item.state, { prev: item.prev, newv: item.newv })
            return [...prev, ...item.state.updateList]

        }, [])

    ])

    callbacks.forEach(fx => fx(null, null, batchMap))

}

//to tell the driver to not use those properties.
export const $ignore = {

    attribute() {
        return "__ignore__"
    },

    style() {
        return {}
    }

}

export type Styles = {
    [P in keyof Partial<CSSStyleDeclaration & "viewTransitionName">]: String | string
}

function Column(properties: defaultPropertyType = {}) {
    return new Component(ComponentIndex.ColumnView, properties)
}


Column.$builder = <T>({ each, properties = {}, builder, fallback = Layout.Empty() }: {each: State<T[]>, properties?: defaultPropertyType, builder: (value: T, index: State<number>) => Component, fallback?: Component}) => {

    //@ts-ignore
    return new Dynamic<Component[]>(builder, [each], { context: 'loop', root: Column(properties), fallback })

}


function Row(properties: defaultPropertyType = {}) {

    return new Component(ComponentIndex.RowView, properties)

}

Row.$builder = <T>({ each, properties = {}, builder, fallback = Layout.Empty() }: {each: State<T[]>, properties?: defaultPropertyType, builder: (value: T, index: State<number>) => Component, fallback?: Component}) => {
    //@ts-ignore
    return new Dynamic<Component[]>(builder, [each], { context: 'loop', root: Row(properties), fallback })

}

function Grid(properties: defaultPropertyType = {}) {

    return new Component(ComponentIndex.GridView, properties)

}

Grid.$builder = <T>({ each, properties = {}, builder, fallback = Layout.Empty() }: {each: State<T[]>, properties?: defaultPropertyType, builder: (value: T, index: State<number>) => Component, fallback?: Component}) => {

    //@ts-ignore
    return new Dynamic<Component[]>(builder, [each], { context: 'loop', root: Grid(properties), fallback })

}

function View(properties: defaultPropertyType = {}) {

    return new Component(ComponentIndex.View, properties)

}

View.$builder = <T>({ each, properties = {}, builder, fallback = Layout.Empty() }: {each: State<T[]>, properties?: defaultPropertyType, builder: (value: T, index: State<number>) => Component, fallback?: Component}) => {

    //@ts-ignore
    return new Dynamic<Component[]>(builder, [each], { context: 'loop', root: View(properties), fallback })

}

export const Layout = {

    Portal: ({ selector, component }: { selector: string, component: () => Component }) => {

        return new Component(ComponentIndex.Portal, DriverUtility.createPortal(selector, component))

    },

    Column,
    Row,
    Grid,
    View,

    Empty: () => {

        return new Component(ComponentIndex.__empty__, {})

    }

}

export const Input = {

    Link: (properties: defaultPropertyType & LinkAttributes = {}) => {

        return new Component(ComponentIndex.Link, properties)

    },

    Button: (prpoerties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.Button, prpoerties)

    },

    Text: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.TextInput, properties)

    },

    TextArea: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.TextAreaInput, properties)

    },

    Numeric: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.NumberInput, properties)

    },

    Email: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.EmailInput, properties)

    },

    Password: (prorperties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.PasswordInput, prorperties)

    },

    ExternalFile: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.FileInput, properties)

    },

    Checkbox: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.Checkbox, properties)

    },

    Dropdown: (properties: defaultPropertyType & DropdownAttributes = {}) => {

        return new Component(ComponentIndex.Dropdown, properties)

    },

    DropdownItem: (properties: defaultPropertyType & DropdownItemAttributes = {}) => {

        return new Component(ComponentIndex.DropdownItem, properties)

    },

    Date: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.Date, properties)

    },

    Time: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.Time, properties)

    },

    DateTime: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.DateTime, properties)

    },

    Color: (properties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.Color, properties)

    }

}

export const Content = {

    Icon(properties: defaultPropertyType = {}) {

        return new Component(ComponentIndex.Icon, properties)

    },

    Text: (text: (String | string) = "") => {

        return new Component(ComponentIndex.__text__, DriverUtility.createText(text, {}))

    },

    TextBox: (properties: defaultPropertyType = {}) => {

        return new Component(ComponentIndex.TextBox, properties)

    },

    InlineTextBox: (properties: defaultPropertyType = {}) => {

        return new Component(ComponentIndex.InlineText, properties)

    },

    Label: (properties: defaultPropertyType = {}) => {

        return new Component(ComponentIndex.Label, properties)

    },

    LineBreak: (properties: defaultPropertyType = {}) => {

        return new Component(ComponentIndex.BreakLine, properties)

    },

    HorizontalRule: (properties: defaultPropertyType = {}) => {

        return new Component(ComponentIndex.HorizontalRule, properties)

    }

}

export const Media = {

    Audio: (properties: defaultPropertyType & AudioAttributes = {}) => {

        return new Component(ComponentIndex.Audio, properties)

    },

    Video: (properties: defaultPropertyType & VideoAttributes = {}) => {

        return new Component(ComponentIndex.Video, properties)

    },

    Image: (properties: defaultPropertyType & ImageAttributes = {}) => {

        return new Component(ComponentIndex.Image, properties)

    },

    WebView: (properties: defaultPropertyType & IFrameAttributes = {}) => {

        return new Component(ComponentIndex.IFrame, properties)

    },

    MultiMedia: (properties: defaultPropertyType & MultiMediaAttributes = {}) => {

        return new Component(ComponentIndex.MultiMedia, properties)

    },

    MediaSource: (properties: defaultPropertyType & MediaSourceAttributes = {}) => {

        return new Component(ComponentIndex.MediaSource, properties)

    },

    Canvas: (properties: defaultPropertyType = {}) => {

        return new Component(ComponentIndex.Canvas, properties)

    }

}