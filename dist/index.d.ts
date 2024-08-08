import { ListViewEvent } from "./driver.js";
import { ComponentIndex, GlobalAttributes, OmegaString } from "./type.js";
export type ChildDynamicProperty = Dynamic<string | String | Component | (() => Component | string) | ChildDynamicProperty>;
export type Properties = {
    __driver__?: object;
    ondestroy?: () => any;
    children?: (Component | OmegaString | ChildDynamicProperty)[];
    child?: Component | OmegaString | ChildDynamicProperty;
    style?: {
        [P in keyof Partial<CSSStyleDeclaration & {
            "viewTransitionName": string;
        }>]: string | String | Dynamic<string | String>;
    } | Dynamic<{
        [P in keyof Partial<CSSStyleDeclaration & {
            "viewTransitionName": string;
        }>]: string | String | Dynamic<string | String>;
    }>;
    reference?: State<any>;
} & Partial<GlobalAttributes>;
export declare class Component {
    name: ComponentIndex;
    properties: Properties;
    constructor(name: ComponentIndex, properties?: Properties);
}
export declare function disposeDetector(callback: (...args: any[]) => any): void;
export declare class Dynamic<T> {
    condition: {
        set: (cond: string) => void;
        get: () => string;
    };
    callback: () => T;
    constructor(callback: (condition: (cond: string) => void) => T, condition: {
        set: (cond: string) => void;
        get: () => string;
    });
    static assign(callback: () => any): any;
}
export type StateEvent<T> = {
    event: "update";
    value: T;
} | {
    event: "batch";
    value: Map<State<any>, any>;
};
export declare class State<T> {
    value: T;
    subscribers: Set<(event: StateEvent<T>) => any>;
    trackExternallyAssignedFunctions: Set<(event: StateEvent<T>) => any>;
    constructor(value?: T);
    static batch(...batches: {
        state: State<any>;
        value: any;
    }[]): void;
    get(): T;
    set(value: T, batch?: boolean): {
        state: State<T>;
        value: T;
    };
    update(callback: (prev: T) => T, batch?: boolean): {
        state: State<T>;
        value: T;
    };
    listen(callback: (event: StateEvent<T>) => any): (event: StateEvent<T>) => any;
}
export declare function $<T>(callback: (setKey: (key: string) => void) => T): Dynamic<T>;
export declare function listItem<T>(value: T, item?: {
    item: T;
}): {
    item: T;
};
export declare function manyListItems<T>(value?: T[]): {
    item: T;
}[];
export declare function useListItem<T>(state: State<ListViewEvent<{
    item: T;
}>>): [
    () => number,
    () => T,
    (callback: (value: T) => T, batch?: boolean) => void
];
export declare class LazyComponent {
    _lazyConsumerState: State<() => Component>;
    callback: () => Promise<{
        default: () => Component;
    }>;
    error: State<boolean>;
    constructor(callback: () => Promise<{
        default: () => Component;
    }>);
    load(): void;
}
export declare function useLazy({ consumer, onLoad, onError }: {
    consumer: LazyComponent;
    onLoad: Component | OmegaString | ChildDynamicProperty;
    onError?: Component | OmegaString | ChildDynamicProperty;
}): ChildDynamicProperty;
export declare function useMemo<T>(callback: () => T): [State<T>, () => void];
export declare function useInputBind(state: State<string> | State<String>): {
    value: Dynamic<string>;
    oninput(e: any): void;
};
export declare function Render(properties: {
    selector: string;
    app: () => Component;
}): void;
