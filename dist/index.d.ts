import { GlobalAttributes, ComponentIndex } from "./type.js";
export type Property = {
    __driver__?: any;
    ondestroy?: () => any;
    children?: Component[];
    child?: Component;
    style?: {
        [P in keyof Partial<CSSStyleDeclaration & {
            "viewTransitionName": string;
        }>]: String | string | Dynamic<String | string>;
    } | Dynamic<{
        [P in keyof Partial<CSSStyleDeclaration & {
            "viewTransitionName": string;
        }>]: String | string;
    }>;
    reference?: State<any>;
} & Partial<GlobalAttributes>;
export declare class Component {
    name: ComponentIndex;
    properties: Property;
    constructor(name: ComponentIndex, properties?: Property);
}
export type StoreUpdater<T> = {
    [P in keyof T]: T[P] extends object ? Partial<StoreUpdater<T[P]>> : T[P];
};
export type Store<T extends object> = {
    __is__store__: boolean;
    update: (updater: (prev: {
        [P in keyof T]: T[P];
    }) => Partial<StoreUpdater<T>>) => void;
    listen: (fx: (prev: T, newv: T, batch: undefined | Map<State<any>, {
        prev: any;
        newv: any;
    }>) => any) => Function;
    removeListener: (fx: (prev: T, newv: T, batch: undefined | Map<State<any>, {
        prev: any;
        newv: any;
    }>) => any) => Map<State<any> | Store<any>, boolean>;
    get: () => {
        [P in keyof T]: T[P];
    };
} & {
    [P in keyof T]: T[P] extends object ? Store<T[P]> & {
        [N in keyof T[P]]: T[P][N] extends object ? Store<T[P][N]> : State<T[P][N]>;
    } : State<T[P]>;
};
export declare function Store<T extends object>(initial: T): Store<T>;
export declare class State<T> {
    private value;
    updateList: Set<(prev: T, newv: T, batch: undefined | Map<State<any>, {
        prev: any;
        newv: any;
    }>) => any>;
    constructor(initial: T);
    batch(callback: (prev: T) => T): {
        state: State<T>;
        prev: T;
        newv: T;
    };
    $text(builder?: (value: T) => string): Dynamic<string>;
    $node(builder: (value: T) => Component): Dynamic<Component>;
    $property<P>(builder: (value: T) => P): Dynamic<P>;
    get(): T;
    set(value: T): void;
    update(callback: (prev: T) => T): void;
    listen(fx: (prev: T, newv: T, batch: undefined | Map<State<any>, {
        prev: any;
        newv: any;
    }>) => any): Function;
    removeListener(fx: (prev: T, newv: T, batch: undefined | Map<State<any>, {
        prev: any;
        newv: any;
    }>) => any): boolean;
}
export declare class Dynamic<T> extends Component {
    dynamic: {
        callback: () => T;
        states: (State<any> | Store<any>)[];
    };
    constructor(callback: () => T, states: (State<any> | Store<any>)[], __driver__?: object);
}
