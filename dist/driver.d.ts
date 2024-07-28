import { Component, State } from "./index.js";
import { OmegaString } from "./type.js";
export declare class ListView<T> {
    from: State<T[]>;
    builder: (event: State<ListViewEvent<T>>) => Component;
    constructor(from: State<T[]>, builder: (event: State<ListViewEvent<T>>) => Component);
}
export type ListViewEvent<T> = {
    value: T;
    index: number;
};
export declare class Portal {
    selector: string;
    component: () => Component;
    constructor(selector: string, component: () => Component);
}
export declare class HTML {
    content: OmegaString;
    constructor(content: OmegaString);
}
export declare function RenderWebPlatform(args: {
    selector: string;
    app: () => Component;
}): void;
