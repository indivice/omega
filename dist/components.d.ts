import { Dynamic, Component, Property, State, Store } from "./index.js";
import { AudioAttributes, DropdownAttributes, DropdownItemAttributes, IFrameAttributes, ImageAttributes, InputAttributes, LinkAttributes, MediaSourceAttributes, MultiMediaAttributes, Events, VideoAttributes, FormAttributes, LabelAttributes } from "./type";
type defaultPropertyType = Property & Events<Event>;
export declare function $text(states: (State<any> | Store<any>)[], builder: () => string): Dynamic<string>;
export declare function $node(states: (State<any> | Store<any>)[], builder: () => Component): Dynamic<Component>;
export declare function $property<T>(states: (State<any> | Store<any>)[], builder: () => T): Dynamic<T>;
export type When = {
    condition: () => boolean;
    execute: () => Component;
};
export declare function $switch(states: (State<any> | Store<any>)[], conditions: When[], fallback?: Component): Dynamic<Component>;
export declare function $when(condition: () => boolean, execute: () => Component): {
    condition: () => boolean;
    execute: () => Component;
};
export declare function $batch(batches: {
    state: State<any>;
    prev: any;
    newv: any;
}[]): void;
export declare const $ignore: {
    attribute(): string;
    style(): {};
};
export type Styles = {
    [P in keyof Partial<CSSStyleDeclaration & {
        "viewTransitionName": string;
    }>]: String | string;
};
declare function Column(properties?: defaultPropertyType): Component;
declare namespace Column {
    var $builder: <T>({ each, properties, builder, fallback }: {
        each: State<T[]>;
        properties?: defaultPropertyType;
        builder: (value: T, index: State<number>) => Component;
        fallback?: Component;
    }) => Dynamic<Component[]>;
}
declare function Row(properties?: defaultPropertyType): Component;
declare namespace Row {
    var $builder: <T>({ each, properties, builder, fallback }: {
        each: State<T[]>;
        properties?: defaultPropertyType;
        builder: (value: T, index: State<number>) => Component;
        fallback?: Component;
    }) => Dynamic<Component[]>;
}
declare function Grid(properties?: defaultPropertyType): Component;
declare namespace Grid {
    var $builder: <T>({ each, properties, builder, fallback }: {
        each: State<T[]>;
        properties?: defaultPropertyType;
        builder: (value: T, index: State<number>) => Component;
        fallback?: Component;
    }) => Dynamic<Component[]>;
}
declare function View(properties?: defaultPropertyType): Component;
declare namespace View {
    var $builder: <T>({ each, properties, builder, fallback }: {
        each: State<T[]>;
        properties?: defaultPropertyType;
        builder: (value: T, index: State<number>) => Component;
        fallback?: Component;
    }) => Dynamic<Component[]>;
}
declare function Form(prorperties?: defaultPropertyType & FormAttributes): Component;
declare namespace Form {
    var $builder: <T>({ each, properties, builder, fallback }: {
        each: State<T[]>;
        properties?: defaultPropertyType;
        builder: (value: T, index: State<number>) => Component;
        fallback?: Component;
    }) => Dynamic<Component[]>;
}
export declare const Layout: {
    Portal: ({ selector, component }: {
        selector: string;
        component: Component;
    }) => Component;
    Column: typeof Column;
    Row: typeof Row;
    Grid: typeof Grid;
    View: typeof View;
    Form: typeof Form;
    Empty: () => Component;
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
    Text: (text?: (String | string)) => Component;
    TextBox: (properties?: defaultPropertyType) => Component;
    InlineTextBox: (properties?: defaultPropertyType) => Component;
    Label: (properties?: defaultPropertyType & LabelAttributes) => Component;
    LineBreak: (properties?: defaultPropertyType) => Component;
    HorizontalRule: (properties?: defaultPropertyType) => Component;
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
