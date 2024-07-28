import { HTML, ListView, Portal } from "./driver.js";
import { Component } from "./index.js";
import { ComponentIndex, } from "./type.js";
export const Layout = {
    Portal: ({ selector, component }) => {
        return new Component(ComponentIndex.Portal, { __driver__: new Portal(selector, component) });
    },
    Column(properties = {}) {
        return new Component(ComponentIndex.ColumnView, properties);
    },
    Row(properties = {}) {
        return new Component(ComponentIndex.RowView, properties);
    },
    Grid(properties = {}) {
        return new Component(ComponentIndex.GridView, properties);
    },
    View(properties = {}) {
        return new Component(ComponentIndex.View, properties);
    },
    Form(prorperties = {}) {
        return new Component(ComponentIndex.Form, prorperties);
    },
    Empty: () => {
        return new Component(ComponentIndex.Empty, {});
    },
    ListView(properties) {
        return new Component(ComponentIndex.ListView, { __driver__: new ListView(properties.from, properties.builder) });
    }
};
export const Input = {
    Link: (properties = {}) => {
        return new Component(ComponentIndex.Link, properties);
    },
    Button: (prpoerties = {}) => {
        return new Component(ComponentIndex.Button, prpoerties);
    },
    Text: (properties = {}) => {
        return new Component(ComponentIndex.TextInput, properties);
    },
    TextArea: (properties = {}) => {
        return new Component(ComponentIndex.TextAreaInput, properties);
    },
    Numeric: (properties = {}) => {
        return new Component(ComponentIndex.NumberInput, properties);
    },
    Email: (properties = {}) => {
        return new Component(ComponentIndex.EmailInput, properties);
    },
    Password: (prorperties = {}) => {
        return new Component(ComponentIndex.PasswordInput, prorperties);
    },
    ExternalFile: (properties = {}) => {
        return new Component(ComponentIndex.FileInput, properties);
    },
    Checkbox: (properties = {}) => {
        return new Component(ComponentIndex.Checkbox, properties);
    },
    Dropdown: (properties = {}) => {
        return new Component(ComponentIndex.Dropdown, properties);
    },
    DropdownItem: (properties = {}) => {
        return new Component(ComponentIndex.DropdownItem, properties);
    },
    Date: (properties = {}) => {
        return new Component(ComponentIndex.Date, properties);
    },
    Time: (properties = {}) => {
        return new Component(ComponentIndex.Time, properties);
    },
    DateTime: (properties = {}) => {
        return new Component(ComponentIndex.DateTime, properties);
    },
    Color: (properties = {}) => {
        return new Component(ComponentIndex.Color, properties);
    }
};
export const Content = {
    Icon(properties = {}) {
        return new Component(ComponentIndex.Icon, properties);
    },
    Text: (properties = {}) => {
        return new Component(ComponentIndex.TextBox, properties);
    },
    InlineText: (properties = {}) => {
        return new Component(ComponentIndex.InlineText, properties);
    },
    Label: (properties = {}) => {
        return new Component(ComponentIndex.Label, properties);
    },
    LineBreak: (properties = {}) => {
        return new Component(ComponentIndex.BreakLine, properties);
    },
    HorizontalRule: (properties = {}) => {
        return new Component(ComponentIndex.HorizontalRule, properties);
    },
    HTML(html) {
        return new Component(ComponentIndex.HTML, { __driver__: new HTML(html) });
    }
};
export const Media = {
    Audio: (properties = {}) => {
        return new Component(ComponentIndex.Audio, properties);
    },
    Video: (properties = {}) => {
        return new Component(ComponentIndex.Video, properties);
    },
    Image: (properties = {}) => {
        return new Component(ComponentIndex.Image, properties);
    },
    WebView: (properties = {}) => {
        return new Component(ComponentIndex.IFrame, properties);
    },
    MultiMedia: (properties = {}) => {
        return new Component(ComponentIndex.MultiMedia, properties);
    },
    MediaSource: (properties = {}) => {
        return new Component(ComponentIndex.MediaSource, properties);
    },
    Canvas: (properties = {}) => {
        return new Component(ComponentIndex.Canvas, properties);
    }
};
