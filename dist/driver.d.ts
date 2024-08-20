import { ChildDynamicProperty, Component, State } from "./index.js";
import { OmegaString } from "./type.js";
export declare class ListView<T> {
    from: State<T[]>;
    builder: (event: State<ListViewEvent<T>>) => Component;
    parent: Component;
    constructor(from: State<T[]>, builder: (event: State<ListViewEvent<T>>) => Component, parent?: Component);
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
export declare class RenderEngine {
    node: HTMLElement;
    app: () => Component;
    dynamicChangeDetectorStack: (() => void)[];
    TrackDOMLife: Set<{
        element: HTMLElement;
        callback: () => any;
    }>;
    constructor(node: HTMLElement, app: () => Component);
    DetectDOMChange(): void;
    HandleListView<T>(listView: ListView<T>, root: HTMLElement): void;
    BuildDOMTree(component: ChildDynamicProperty | OmegaString | Component | (() => Component | string), initialNodeStack?: (HTMLElement | Text | Comment)[], root?: number): any;
    Render(): void;
}
export declare function RenderWebPlatform(args: {
    selector: string;
    app: () => Component;
}): void;
