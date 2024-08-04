import { HTML, ListView, ListViewEvent, Portal } from "./driver.js"
import { ChildDynamicProperty, Component, Properties, State } from "./index.js"
import {
    AudioAttributes, DropdownAttributes,
    DropdownItemAttributes, IFrameAttributes,
    ImageAttributes, InputAttributes,
    LinkAttributes, MediaSourceAttributes,
    MultiMediaAttributes, ComponentIndex,
    Events, VideoAttributes,
    FormAttributes, LabelAttributes,
    OmegaString,
}
    from "./type.js"

type defaultPropertyType = Properties & Events<Event>

export const Layout = {

    Portal: ({ selector, component }: { selector: string, component: () => Component }) => {

        return new Component(ComponentIndex.Portal, { __driver__: new Portal(selector, component) })

    },

    Column(properties: defaultPropertyType = {}) {
        return new Component(ComponentIndex.ColumnView, properties)
    },


    Row(properties: defaultPropertyType = {}) {

        return new Component(ComponentIndex.RowView, properties)

    },

    Grid(properties: defaultPropertyType = {}) {

        return new Component(ComponentIndex.GridView, properties)

    },

    View(properties: defaultPropertyType = {}) {

        return new Component(ComponentIndex.View, properties)

    },

    Form(prorperties: defaultPropertyType & FormAttributes = {}) {
        return new Component(ComponentIndex.Form, prorperties)
    },

    Empty: () => {

        return new Component(ComponentIndex.Empty, {})

    },

    ListView<T>(properties: { from: State<{ item: T }[]>, builder: (event: State<ListViewEvent<{ item: T }>>) => Component } & Omit<defaultPropertyType, 'child' | 'children'>) {

        return new Component(ComponentIndex.ListView, { __driver__: new ListView(properties.from, properties.builder) })

    },

    Ghost(children: (Component | OmegaString | ChildDynamicProperty)[]) {

        return Layout.View({
            style: {
                display: 'contents',
                all: 'unset',
                pointerEvents: 'none'
            },
            children
        })

    }

}

export const Input = {

    Link: (properties: defaultPropertyType & LinkAttributes = {}) => {

        return new Component(ComponentIndex.Link, properties)

    },

    Button: (prpoerties: defaultPropertyType & InputAttributes = {}) => {

        return new Component(ComponentIndex.Button, prpoerties)

    },

    Text: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.TextInput, properties)

    },

    TextArea: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.TextAreaInput, properties)

    },

    Numeric: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.NumberInput, properties)

    },

    Email: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.EmailInput, properties)

    },

    Password: (prorperties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.PasswordInput, prorperties)

    },

    ExternalFile: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.FileInput, properties)

    },

    Checkbox: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.Checkbox, properties)

    },

    Dropdown: (properties: defaultPropertyType & DropdownAttributes = {}) => {

        return new Component(ComponentIndex.Dropdown, properties)

    },

    DropdownItem: (properties: defaultPropertyType & DropdownItemAttributes = {}) => {

        return new Component(ComponentIndex.DropdownItem, properties)

    },

    Date: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.Date, properties)

    },

    Time: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.Time, properties)

    },

    DateTime: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.DateTime, properties)

    },

    Color: (properties: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.Color, properties)

    }

}

export const Content = {

    Icon(properties: defaultPropertyType = {}) {

        return new Component(ComponentIndex.Icon, properties)

    },

    Text: (properties: defaultPropertyType = {}) => {

        return new Component(ComponentIndex.TextBox, properties)

    },

    InlineText: (properties: defaultPropertyType = {}) => {

        return new Component(ComponentIndex.InlineText, properties)

    },

    Label: (properties: defaultPropertyType & LabelAttributes = {}) => {

        return new Component(ComponentIndex.Label, properties)

    },

    LineBreak: (properties: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.BreakLine, properties)

    },

    HorizontalRule: (properties: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.HorizontalRule, properties)

    },

    HTML(html: OmegaString) {

        return new Component(ComponentIndex.HTML, { __driver__: new HTML(html) })

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

    MediaSource: (properties: defaultPropertyType & MediaSourceAttributes & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.MediaSource, properties)

    },

    Canvas: (properties: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'> = {}) => {

        return new Component(ComponentIndex.Canvas, properties)

    }

}