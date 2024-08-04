import { Dynamic } from "./index.js";
export declare enum ComponentIndex {
    Portal = 0,
    ColumnView = 1,
    RowView = 2,
    GridView = 3,
    View = 4,
    Empty = 5,
    Form = 6,
    ListView = 7,
    Ghost = 8,
    Link = 9,
    Button = 10,
    TextInput = 11,
    TextAreaInput = 12,
    NumberInput = 13,
    EmailInput = 14,
    PasswordInput = 15,
    FileInput = 16,
    Checkbox = 17,
    Dropdown = 18,
    DropdownItem = 19,
    Date = 20,
    Time = 21,
    DateTime = 22,
    Color = 23,
    TextBox = 24,
    InlineText = 25,
    Icon = 26,
    BreakLine = 27,
    HorizontalRule = 28,
    Label = 29,
    HTML = 30,
    Audio = 31,
    Video = 32,
    Image = 33,
    IFrame = 34,
    MultiMedia = 35,
    MediaSource = 36,
    Canvas = 37
}
export type OmegaString = String | string | Dynamic<String | string>;
export type GlobalAttributes = {
    accesskey: OmegaString;
    autocapitalize: OmegaString;
    autofocus: OmegaString;
    class: OmegaString;
    contenteditable: OmegaString;
    "data-*": OmegaString;
    dir: OmegaString;
    draggable: OmegaString;
    enterkeyhint: OmegaString;
    exportparts: OmegaString;
    hidden: OmegaString;
    id: OmegaString;
    inert: OmegaString;
    inputmode: OmegaString;
    is: OmegaString;
    itemid: OmegaString;
    itemprop: OmegaString;
    itemref: OmegaString;
    itemscope: OmegaString;
    itemtype: OmegaString;
    lang: OmegaString;
    nonce: OmegaString;
    part: OmegaString;
    popover: OmegaString;
    role: OmegaString;
    slot: OmegaString;
    spellcheck: OmegaString;
    tabindex: OmegaString;
    title: OmegaString;
    translate: OmegaString;
};
export type InputAttributes = Partial<{
    accept: OmegaString;
    alt: OmegaString;
    autocomplete: OmegaString;
    autofocus: OmegaString;
    checked: OmegaString;
    dirname: OmegaString;
    form: OmegaString;
    formtarget: OmegaString;
    list: OmegaString;
    max: OmegaString;
    maxlength: OmegaString;
    min: OmegaString;
    minlength: OmegaString;
    multiple: OmegaString;
    name: OmegaString;
    pattern: OmegaString;
    placeholder: OmegaString;
    readonly: OmegaString;
    required: OmegaString;
    size: OmegaString;
    step: OmegaString;
    type: OmegaString;
    value: OmegaString;
}>;
export type LinkAttributes = Partial<{
    crossorigin: OmegaString;
    href: OmegaString;
    hreflang: OmegaString;
    media: OmegaString;
    referrerpolicy: OmegaString;
    rel: OmegaString;
    sizes: OmegaString;
    title: OmegaString;
    type: OmegaString;
}>;
export type ImageAttributes = Partial<{
    alt: OmegaString;
    crossorigin: OmegaString;
    ismap: OmegaString;
    loading: OmegaString;
    longdesc: OmegaString;
    referrerpolicy: OmegaString;
    src: OmegaString;
    srcset: OmegaString;
    usemap: OmegaString;
}>;
export type AudioAttributes = Partial<{
    autoplay: String | string;
    controls: String | string;
    loop: String | string;
    muted: String | string;
    preload: String | string;
    src: String | string;
}>;
export type VideoAttributes = Partial<{
    autoplay: OmegaString;
    controls: OmegaString;
    loop: OmegaString;
    muted: OmegaString;
    poster: OmegaString;
    preload: OmegaString;
    src: OmegaString;
    playsinline: OmegaString;
}>;
export type MultiMediaAttributes = Partial<{
    data: OmegaString;
    form: OmegaString;
    type: OmegaString;
    name: OmegaString;
    typemustmatch: OmegaString;
    usemap: OmegaString;
}>;
export type MediaSourceAttributes = Partial<{
    media: OmegaString;
    sizes: OmegaString;
    src: OmegaString;
    srcset: OmegaString;
    type: OmegaString;
}>;
export type IFrameAttributes = Partial<{
    allow: OmegaString;
    allowfullscreen: OmegaString;
    allowpaymentrequest: OmegaString;
    loading: OmegaString;
    name: OmegaString;
    referrerpolicy: OmegaString;
    sandbox: OmegaString;
    src: OmegaString;
    srcdoc: OmegaString;
}>;
export type DropdownAttributes = Partial<{
    autofocus: OmegaString;
    disabled: OmegaString;
    form: OmegaString;
    multiple: OmegaString;
    name: OmegaString;
    required: OmegaString;
    size: OmegaString;
}>;
export type DropdownItemAttributes = Partial<{
    disabled: OmegaString;
    label: OmegaString;
    selected: OmegaString;
    value: OmegaString;
}>;
export type LabelAttributes = Partial<{
    for: OmegaString;
}>;
export type FormAttributes = Partial<{
    accept: OmegaString;
    acceptcharset: OmegaString;
    autocapitalize: OmegaString;
    autocomplete: OmegaString;
    name: OmegaString;
    rel: OmegaString;
    action: OmegaString;
    enctype: OmegaString;
    method: OmegaString;
    novalidate: OmegaString;
    target: OmegaString;
}>;
export type Events<EventType> = {
    [P in keyof Partial<DocumentEventMap> as `on${P}`]: (event: EventType) => any | Dynamic<(event: EventType) => any>;
};
