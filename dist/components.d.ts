import { ListViewEvent } from "./driver.js";
import { Component, Properties, State } from "./index.js";
import { AudioAttributes, DropdownAttributes, DropdownItemAttributes, IFrameAttributes, ImageAttributes, InputAttributes, LinkAttributes, MediaSourceAttributes, MultiMediaAttributes, Events, VideoAttributes, FormAttributes, LabelAttributes, OmegaString } from "./type.js";
type defaultPropertyType = Properties & Events<Event>;
export declare const Layout: {
    Portal: ({ selector, component }: {
        selector: string;
        component: () => Component;
    }) => Component;
    Column(properties?: defaultPropertyType): Component;
    Row(properties?: defaultPropertyType): Component;
    Grid(properties?: defaultPropertyType): Component;
    View(properties?: defaultPropertyType): Component;
    Form(prorperties?: defaultPropertyType & FormAttributes): Component;
    Empty: () => Component;
    ListView<T>(properties: {
        from: State<T[]>;
        builder: (event: State<ListViewEvent<T>>) => Component;
    } & Omit<defaultPropertyType, 'child' | 'children'>): Component;
};
export declare const Input: {
    Link: (properties?: defaultPropertyType & LinkAttributes) => Component;
    Button: (prpoerties?: defaultPropertyType & InputAttributes) => Component;
    Text: (properties?: defaultPropertyType & InputAttributes) => Component;
    TextArea: (properties?: defaultPropertyType & InputAttributes) => Component;
    Numeric: (properties?: defaultPropertyType & InputAttributes) => Component;
    Email: (properties?: defaultPropertyType & InputAttributes) => Component;
    Password: (prorperties?: defaultPropertyType & InputAttributes) => Component;
    ExternalFile: (properties?: defaultPropertyType & InputAttributes) => Component;
    Checkbox: (properties?: defaultPropertyType & InputAttributes) => Component;
    Dropdown: (properties?: defaultPropertyType & DropdownAttributes) => Component;
    DropdownItem: (properties?: defaultPropertyType & DropdownItemAttributes) => Component;
    Date: (properties?: defaultPropertyType & InputAttributes) => Component;
    Time: (properties?: defaultPropertyType & InputAttributes) => Component;
    DateTime: (properties?: defaultPropertyType & InputAttributes) => Component;
    Color: (properties?: defaultPropertyType & InputAttributes) => Component;
};
export declare const Content: {
    Icon(properties?: defaultPropertyType): Component;
    Text: (properties?: defaultPropertyType) => Component;
    InlineText: (properties?: defaultPropertyType) => Component;
    Label: (properties?: defaultPropertyType & LabelAttributes) => Component;
    LineBreak: (properties?: defaultPropertyType) => Component;
    HorizontalRule: (properties?: defaultPropertyType) => Component;
    HTML(html: OmegaString): Component;
};
export declare const Media: {
    Audio: (properties?: defaultPropertyType & AudioAttributes) => Component;
    Video: (properties?: defaultPropertyType & VideoAttributes) => Component;
    Image: (properties?: defaultPropertyType & ImageAttributes) => Component;
    WebView: (properties?: defaultPropertyType & IFrameAttributes) => Component;
    MultiMedia: (properties?: defaultPropertyType & MultiMediaAttributes) => Component;
    MediaSource: (properties?: defaultPropertyType & MediaSourceAttributes) => Component;
    Canvas: (properties?: defaultPropertyType) => Component;
};
export {};
