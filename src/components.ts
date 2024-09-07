import { HTML, ListView, ListViewEvent, Portal } from "./driver.js"
import { Component, Properties, State } from "./index.js"
import {
    AudioAttributes, DropdownAttributes,
    DropdownItemAttributes, IFrameAttributes,
    ImageAttributes, InputAttributes,
    LinkAttributes, MediaSourceAttributes,
    MultiMediaAttributes,
    Events, VideoAttributes,
    FormAttributes, LabelAttributes,
    OmegaString,
}
    from "./type.js"

type defaultPropertyType = Properties & Events<Event>

export const Layout = {

    Portal: ({ selector, component }: { selector: string, component: () => Component }) => {

        return Component("portal", { __driver__: new Portal(selector, component) }, false)

    },

    Column(properties: defaultPropertyType = {}) {
        return Component("div", {...properties, style: {
            display: 'flex', flexDirection: 'column'
        }})
    },


    Row(properties: defaultPropertyType = {}) {

        return Component("div", {...properties, style: {
            display: 'flex', flexDirection: 'row'
        }})

    },

    Grid(properties: defaultPropertyType = {}) {

        return Component("div", {...properties, style: {
            display: 'flex', flexDirection: 'grid'
        }})

    },

    View(properties: defaultPropertyType = {}) {

        return Component("div", properties)

    },

    Form(prorperties: defaultPropertyType & FormAttributes = {}) {
        return Component("form", prorperties)
    },

    Empty: () => {
        return Component("empty", {}, false)
    },

    ListView<T>(properties: { from: State<{ item: T }[]>, builder: (event: State<ListViewEvent<{ item: T }>>) => Component, parent?: Component } & Omit<defaultPropertyType, 'child' | 'children'>) {
        return Component("listview", { parent: null, ...properties, __driver__: new ListView(properties.from, properties.builder, properties.parent) })
    },

    Table(properties: defaultPropertyType = {}) {
        return Component("table", properties)
    },

    TableRow(properties: defaultPropertyType = {}) {
        return Component("tr", properties)
    },

    TableHead(properties: defaultPropertyType = {}) {
        return Component("th", properties)
    },

    TableBody(properties: defaultPropertyType = {}) {
        return Component("tbody", properties)
    }
}

export const Input = {

    Link: (properties: defaultPropertyType & LinkAttributes = {}) => {

        return Component("a", properties)

    },

    Button: (prpoerties: defaultPropertyType & InputAttributes = {}) => {

        return Component("button", prpoerties)

    },

    Text: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input", {...properties, type: 'text'}, false)

    },

    TextArea: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("textarea", properties, false)

    },

    Numeric: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input", {...properties, type: 'number'}, false)

    },

    Email: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input", {...properties, type: 'email'}, false)

    },

    Password: (prorperties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input",  {...properties, type: 'password'}, false)

    },

    ExternalFile: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input",  {...properties, type: 'file'}, false)

    },

    Checkbox: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input",  {...properties, type: 'checkbox'}, false)

    },

    Dropdown: (properties: defaultPropertyType & DropdownAttributes = {}) => {

        return Component("select", properties)

    },

    DropdownItem: (properties: defaultPropertyType & DropdownItemAttributes = {}) => {

        return Component("option", properties)

    },

    Date: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input", properties,  {...properties, type: 'date'}, false)

    },

    Time: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input",  {...properties, type: 'time'}, false)

    },

    DateTime: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input", {...properties, type: 'datetime-local'}, false)

    },

    Color: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return Component("input",  {...properties, type: 'color'}, false)

    }

}

export const Content = {

    Icon(properties: defaultPropertyType = {}) {

        return Component("i", properties)

    },

    Text: (properties: defaultPropertyType = {}) => {

        return Component("p", properties)

    },

    InlineText: (properties: defaultPropertyType = {}) => {

        return Component("span", properties)

    },

    Label: (properties: defaultPropertyType & LabelAttributes = {}) => {

        return Component("label", properties)

    },

    LineBreak: (properties: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return Component("br", properties, false)

    },

    HorizontalRule: (properties: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return Component("hr", properties, false)

    },

    HTML(html: OmegaString) {

        return Component("html", { __driver__: new HTML(html) }, false)

    },

    TableData(properties: defaultPropertyType = {}) {
        return Component("td", properties)
    }

}

export const Media = {

    Audio: (properties: defaultPropertyType & AudioAttributes = {}) => {

        return Component("audio", properties)

    },

    Video: (properties: defaultPropertyType & VideoAttributes = {}) => {

        return Component("video", properties)

    },

    Image: (properties: defaultPropertyType & ImageAttributes = {}) => {

        return Component("img", properties)

    },

    WebView: (properties: defaultPropertyType & IFrameAttributes = {}) => {

        return Component("iframe", properties)

    },

    MultiMedia: (properties: defaultPropertyType & MultiMediaAttributes = {}) => {

        return Component("object", properties)

    },

    MediaSource: (properties: defaultPropertyType & MediaSourceAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return Component("source", properties)

    },

    Canvas: (properties: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return Component("canvas", properties)

    }

}