import { Component, State } from "../index.js";
export declare class VirtualRouter {
    pointer: number;
    instance: State<{
        route: string;
        data: any;
    }>;
    histroy: State<{
        route: string;
        data: any;
    }[]>;
    constructor(initial: string, data: any);
    navigate(url: string, data: any): void;
    back(): void;
    forward(): void;
    Component({ middlewares, routes, errorPath, cachedRoutes }: {
        middlewares?: (<T>(route: String, data: T) => boolean)[];
        routes?: {
            [key: string]: <T>(data: T) => Component;
        };
        cachedRoutes?: {
            [key: string]: (data: State<{
                args: any;
                get: any;
            }>) => Component;
        };
        errorPath?: Component;
    }): import("../index.js").Dynamic<Component>;
}
export declare class BrowserRouter {
    instance: State<Location>;
    root: string;
    constructor(root?: string);
    navigate(url: string): void;
    Component({ middlewares, routes, errorPath, cachedRoutes }: {
        middlewares?: ((route: string, data: {
            args: any;
            get: any;
        }) => boolean)[];
        routes?: {
            [key: string]: (data: {
                args: any;
                get: any;
            }) => Component;
        };
        cachedRoutes?: {
            [key: string]: (data: State<{
                args: any;
                get: any;
            }>) => Component;
        };
        errorPath?: Component;
    }): import("../index.js").Dynamic<Component>;
}
