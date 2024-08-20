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

        return new Component("portal", { __driver__: new Portal(selector, component) }, false)

    },

    Column(properties: defaultPropertyType = {}) {
        return new Component("div", {...properties, style: {
            display: 'flex', flexDirection: 'column'
        }})
    },


    Row(properties: defaultPropertyType = {}) {

        return new Component("div", {...properties, style: {
            display: 'flex', flexDirection: 'row'
        }})

    },

    Grid(properties: defaultPropertyType = {}) {

        return new Component("div", {...properties, style: {
            display: 'flex', flexDirection: 'grid'
        }})

    },

    View(properties: defaultPropertyType = {}) {

        return new Component("div", properties)

    },

    Form(prorperties: defaultPropertyType & FormAttributes = {}) {
        return new Component("form", prorperties)
    },

    Empty: () => {
        return new Component("empty", {}, false)
    },

    ListView<T>(properties: { from: State<{ item: T }[]>, builder: (event: State<ListViewEvent<{ item: T }>>) => Component, parent?: Component } & Omit<defaultPropertyType, 'child' | 'children'>) {
        return new Component("listview", { parent: null, ...properties, __driver__: new ListView(properties.from, properties.builder, properties.parent) })
    },

    Table(properties: defaultPropertyType = {}) {
        return new Component("table", properties)
    },

    TableRow(properties: defaultPropertyType = {}) {
        return new Component("tr", properties)
    },

    TableHead(properties: defaultPropertyType = {}) {
        return new Component("th", properties)
    },

    TableBody(properties: defaultPropertyType = {}) {
        return new Component("tbody", properties)
    }
}

export const Input = {

    Link: (properties: defaultPropertyType & LinkAttributes = {}) => {

        return new Component("a", properties)

    },

    Button: (prpoerties: defaultPropertyType & InputAttributes = {}) => {

        return new Component("button", prpoerties)

    },

    Text: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input", {...properties, type: 'text'}, false)

    },

    TextArea: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("textarea", properties, false)

    },

    Numeric: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input", {...properties, type: 'number'}, false)

    },

    Email: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input", {...properties, type: 'email'}, false)

    },

    Password: (prorperties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input",  {...properties, type: 'password'}, false)

    },

    ExternalFile: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input",  {...properties, type: 'file'}, false)

    },

    Checkbox: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input",  {...properties, type: 'checkbox'}, false)

    },

    Dropdown: (properties: defaultPropertyType & DropdownAttributes = {}) => {

        return new Component("select", properties)

    },

    DropdownItem: (properties: defaultPropertyType & DropdownItemAttributes = {}) => {

        return new Component("option", properties)

    },

    Date: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input", properties,  {...properties, type: 'date'}, false)

    },

    Time: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input",  {...properties, type: 'time'}, false)

    },

    DateTime: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input", {...properties, type: 'datetime-local'}, false)

    },

    Color: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        //@ts-ignore
        return new Component("input",  {...properties, type: 'color'}, false)

    }

}

export const Content = {

    Icon(properties: defaultPropertyType = {}) {

        return new Component("i", properties)

    },

    Text: (properties: defaultPropertyType = {}) => {

        return new Component("p", properties)

    },

    InlineText: (properties: defaultPropertyType = {}) => {

        return new Component("span", properties)

    },

    Label: (properties: defaultPropertyType & LabelAttributes = {}) => {

        return new Component("label", properties)

    },

    LineBreak: (properties: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component("br", properties, false)

    },

    HorizontalRule: (properties: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component("hr", properties, false)

    },

    HTML(html: OmegaString) {

        return new Component("html", { __driver__: new HTML(html) }, false)

    },

    TableData(properties: defaultPropertyType = {}) {
        return new Component("td", properties)
    }

}

export const Media = {

    Audio: (properties: defaultPropertyType & AudioAttributes = {}) => {

        return new Component("audio", properties)

    },

    Video: (properties: defaultPropertyType & VideoAttributes = {}) => {

        return new Component("video", properties)

    },

    Image: (properties: defaultPropertyType & ImageAttributes = {}) => {

        return new Component("img", properties)

    },

    WebView: (properties: defaultPropertyType & IFrameAttributes = {}) => {

        return new Component("iframe", properties)

    },

    MultiMedia: (properties: defaultPropertyType & MultiMediaAttributes = {}) => {

        return new Component("object", properties)

    },

    MediaSource: (properties: defaultPropertyType & MediaSourceAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component("source", properties)

    },

    Canvas: (properties: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component("canvas", properties)

    }

}