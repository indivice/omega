import { ListViewEvent } from "./driver.js";
import { ChildDynamicProperty, Component, Properties, State } from "./index.js";
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
        from: State<{
            item: T;
        }[]>;
        builder: (event: State<ListViewEvent<{
            item: T;
        }>>) => Component;
    } & Omit<defaultPropertyType, 'child' | 'children'>): Component;
    Ghost(children: (Component | OmegaString | ChildDynamicProperty)[]): Component;
};
export declare const Input: {
    Link: (properties?: defaultPropertyType & LinkAttributes) => Component;
    Button: (prpoerties?: defaultPropertyType & InputAttributes) => Component;
    Text: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    TextArea: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    Numeric: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    Email: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    Password: (prorperties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    ExternalFile: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    Checkbox: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    Dropdown: (properties?: defaultPropertyType & DropdownAttributes) => Component;
    DropdownItem: (properties?: defaultPropertyType & DropdownItemAttributes) => Component;
    Date: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    Time: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    DateTime: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    Color: (properties?: defaultPropertyType & InputAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
};
export declare const Content: {
    Icon(properties?: defaultPropertyType): Component;
    Text: (properties?: defaultPropertyType) => Component;
    InlineText: (properties?: defaultPropertyType) => Component;
    Label: (properties?: defaultPropertyType & LabelAttributes) => Component;
    LineBreak: (properties?: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    HorizontalRule: (properties?: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    HTML(html: OmegaString): Component;
};
export declare const Media: {
    Audio: (properties?: defaultPropertyType & AudioAttributes) => Component;
    Video: (properties?: defaultPropertyType & VideoAttributes) => Component;
    Image: (properties?: defaultPropertyType & ImageAttributes) => Component;
    WebView: (properties?: defaultPropertyType & IFrameAttributes) => Component;
    MultiMedia: (properties?: defaultPropertyType & MultiMediaAttributes) => Component;
    MediaSource: (properties?: defaultPropertyType & MediaSourceAttributes & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
    Canvas: (properties?: defaultPropertyType & Omit<defaultPropertyType, 'child' | 'children'>) => Component;
};
export {};
