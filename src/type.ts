//all the types for a component.

import { Dynamic } from "./index"

//enums for specific components
export enum ComponentIndex {
 
    //built-ins and must-defined
        __driver__,
        __text__,
        __dynamic__,

    //components
        //layouts
        Portal,
        ColumnView,
        RowView,
        GridView,
        View,
        __empty__,

        //inputs
        Link,
        Button,
        TextInput,
        TextAreaInput,
        NumberInput,
        EmailInput,
        PasswordInput,
        FileInput,
        Checkbox,
        Dropdown,
        DropdownItem,
        Date,
        Time,
        DateTime,
        Color,

        //content
        TextBox,
        InlineText,
        Icon,
        BreakLine,
        HorizontalRule,
        Label,

        //media
        Audio,
        Video,
        Image,
        IFrame,
        MultiMedia,
        MediaSource,

        //add new components here, so that the driver does not break.
        //It will be a nightmare to fix it.

        //new component
        //media type
        Canvas

}

//for everyone
export type GlobalAttributes = {
    accesskey: String | string | Dynamic<String | string>,
    autocapitalize: String | string | Dynamic<String | string>,
    autofocus: String | string | Dynamic<String | string>,
    class: String | string | Dynamic<String | string>,
    contenteditable: String | string | Dynamic<String | string>,
    data$: String | string | Dynamic<String | string>,
    dir: String | string | Dynamic<String | string>,
    draggable: String | string | Dynamic<String | string>,
    enterkeyhint: String | string | Dynamic<String | string>,
    exportparts: String | string | Dynamic<String | string>,
    hidden: String | string | Dynamic<String | string>,
    id: String | string | Dynamic<String | string>,
    inert: String | string | Dynamic<String | string>,
    inputmode: String | string | Dynamic<String | string>,
    is: String | string | Dynamic<String | string>,
    itemid: String | string | Dynamic<String | string>,
    itemprop: String | string | Dynamic<String | string>,
    itemref: String | string | Dynamic<String | string>,
    itemscope: String | string | Dynamic<String | string>,
    itemtype: String | string | Dynamic<String | string>,
    lang: String | string | Dynamic<String | string>,
    nonce: String | string | Dynamic<String | string>,
    part: String | string | Dynamic<String | string>,
    popover: String | string | Dynamic<String | string>,
    role: String | string | Dynamic<String | string>,
    slot: String | string | Dynamic<String | string>,
    spellcheck: String | string | Dynamic<String | string>,
    tabindex: String | string | Dynamic<String | string>,
    title: String | string | Dynamic<String | string>,
    translate: String | string | Dynamic<String | string>,
}

export type InputAttributes = Partial<{

    accept: String | string | Dynamic<String | string>,
    alt: String | string | Dynamic<String | string>,
    autocomplete: String | string | Dynamic<String | string>,
    autofocus: String | string | Dynamic<String | string>,
    checked: String | string | Dynamic<String | string>,
    dirname: String | string | Dynamic<String | string>,
    form: String | string | Dynamic<String | string>,
    formtarget: String | string | Dynamic<String | string>,
    list: String | string | Dynamic<String | string>,
    max: String | string | Dynamic<String | string>,
    maxlength: String | string | Dynamic<String | string>,
    min: String | string | Dynamic<String | string>,
    minlength: String | string | Dynamic<String | string>,
    multiple: String | string | Dynamic<String | string>,
    name: String | string | Dynamic<String | string>,
    pattern: String | string | Dynamic<String | string>,
    placeholder: String | string | Dynamic<String | string>,
    readonly: String | string | Dynamic<String | string>,
    required: String | string | Dynamic<String | string>,
    size: String | string | Dynamic<String | string>,
    step: String | string | Dynamic<String | string>,
    type: String | string | Dynamic<String | string>,
    value: String | string | Dynamic<String | string>

}>

export type LinkAttributes = Partial<{

    crossorigin: String | string | Dynamic<String | string>,
    href: String | string | Dynamic<String | string>,
    hreflang: String | string | Dynamic<String | string>,
    media: String | string | Dynamic<String | string>,
    referrerpolicy: String | string | Dynamic<String | string>,
    rel: String | string | Dynamic<String | string>,
    sizes: String | string | Dynamic<String | string>,
    title: String | string | Dynamic<String | string>,
    type: String | string | Dynamic<String | string>,
    
}>

export type ImageAttributes = Partial<{

    alt: String | string | Dynamic<String | string>,
    crossorigin: String | string | Dynamic<String | string>,
    ismap: String | string | Dynamic<String | string>,
    loading: String | string | Dynamic<String | string>,
    longdesc: String | string | Dynamic<String | string>,
    referrerpolicy: String | string | Dynamic<String | string>,
    src: String | string | Dynamic<String | string>,
    srcset: String | string | Dynamic<String | string>,
    usemap: String | string | Dynamic<String | string>

}>

export type AudioAttributes = Partial<{

    autoplay: String | string,
    controls: String | string,
    loop: String | string,
    muted: String | string,
    preload: String | string,
    src: String | string

}>

export type VideoAttributes = Partial<{

    autoplay: String | string | Dynamic<String | string>,
    controls: String | string | Dynamic<String | string>,
    loop: String | string | Dynamic<String | string>,
    muted: String | string | Dynamic<String | string>,
    poster: String | string | Dynamic<String | string>,
    preload: String | string | Dynamic<String | string>,
    src: String | string | Dynamic<String | string>

}>

export type MultiMediaAttributes = Partial<{

    data: String | string | Dynamic<String | string>,
    form: String | string | Dynamic<String | string>,
    type: String | string | Dynamic<String | string>,
    name: String | string | Dynamic<String | string>,
    typemustmatch: String | string | Dynamic<String | string>,
    usemap: String | string | Dynamic<String | string>

}>

export type MediaSourceAttributes = Partial<{

    media: String | string | Dynamic<String | string>,
    sizes: String | string | Dynamic<String | string>,
    src: String | string | Dynamic<String | string>,
    srcset: String | string | Dynamic<String | string>,
    type: String | string | Dynamic<String | string>

}>

export type IFrameAttributes = Partial<{

    allow: String | string | Dynamic<String | string>,
    allowfullscreen: String | string | Dynamic<String | string>,
    allowpaymentrequest: String | string | Dynamic<String | string>,
    loading: String | string | Dynamic<String | string>,
    name: String | string | Dynamic<String | string>,
    referrerpolicy: String | string | Dynamic<String | string>,
    sandbox: String | string | Dynamic<String | string>,
    src: String | string | Dynamic<String | string>,
    srcdoc: String | string | Dynamic<String | string>

}>

export type DropdownAttributes = Partial<{

    autofocus: String | string | Dynamic<String | string>,
    disabled: String | string | Dynamic<String | string>,
    form: String | string | Dynamic<String | string>,
    multiple: String | string | Dynamic<String | string>,
    name: String | string | Dynamic<String | string>,
    required: String | string | Dynamic<String | string>,
    size: String | string | Dynamic<String | string>

}>

export type DropdownItemAttributes = Partial<{

    disabled: String | string | Dynamic<String | string>,
    label: String | string | Dynamic<String | string>,
    selected: String | string | Dynamic<String | string>,
    value: String | string | Dynamic<String | string>

}>

export type Events<EventType> = {
    [P in keyof Partial<DocumentEventMap> as `on${P}`]: (event: EventType) => any | Dynamic<(event: EventType) => any>
}