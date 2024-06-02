import { $switch, $when, Content, Layout } from "../components.js";
import { State } from "../index.js";
const Utility = {
    doesPathnameMatch(pathname, pattern) {
        const pathSegments = pathname.split('/');
        const patternSegments = pattern.split('/');
        if (pathSegments.length < patternSegments.length) {
            return false;
        }
        for (let i = 0; i < patternSegments.length; i++) {
            const pathSegment = pathSegments[i];
            const patternSegment = patternSegments[i];
            if (patternSegment.startsWith('$')) {
                continue;
            }
            else if (pathSegment !== patternSegment) {
                return false;
            }
        }
        return true;
    },
    matchPathname(pathname, pattern) {
        const pathSegments = pathname.split('/');
        const patternSegments = pattern.split('/');
        if (pathSegments.length < patternSegments.length) {
            return null;
        }
        const variables = {};
        for (let i = 0; i < patternSegments.length; i++) {
            const pathSegment = pathSegments[i];
            const patternSegment = patternSegments[i];
            if (patternSegment.startsWith('$')) {
                const variableName = patternSegment.slice(1);
                variables[variableName] = pathSegment;
            }
            else if (pathSegment !== patternSegment) {
                return null;
            }
        }
        return variables;
    },
    parseSearchParams(url, route) {
        const obj = {
            args: {},
            get: {}
        };
        const URLObj = new URL(url);
        URLObj.searchParams.forEach((v, k) => {
            obj.get[k] = v;
        });
        obj.args = Utility.matchPathname(URLObj.pathname, route);
        return obj;
    },
    defaultErrorPath() {
        return Layout.Column({
            style: {
                padding: "10px",
                gap: "5px",
            },
            children: [
                Content.TextBox({
                    style: {
                        fontSize: "24px",
                        fontWeight: "bold",
                    },
                    child: Content.Text("404 : Route not found")
                }),
                Content.Text("If you wish a custom error route, provide an errorPath: Component")
            ]
        });
    }
};
export class VirtualRouter {
    pointer = 0;
    instance;
    histroy = new State([]);
    constructor(initial, data) {
        this.instance = new State({ route: initial, data });
        this.histroy.update(routes => [...routes, { route: initial, data }]);
    }
    navigate(url, data) {
        this.pointer++;
        this.instance.set({ route: url, data });
        this.histroy.update(routes => [...routes, { route: url, data }]);
    }
    back() {
        let latest = this.histroy.get();
        if (latest[--this.pointer] != undefined) {
            this.instance.set(latest[this.pointer]);
        }
    }
    forward() {
        let latest = this.histroy.get();
        if (latest[++this.pointer] != undefined) {
            this.instance.set(latest[this.pointer]);
        }
    }
    Component({ middlewares, routes = {}, errorPath = Utility.defaultErrorPath(), cachedRoutes = {} }) {
        const cache = new Map();
        return $switch([this.instance], [
            ...Object.keys(routes).map((route) => {
                return $when(() => Utility.doesPathnameMatch(this.instance.get(), route), () => {
                    const instanceData = this.instance.get().data;
                    for (let fx of middlewares) {
                        const status = fx(route, instanceData);
                        if (status != true)
                            break;
                    }
                    return routes[route](instanceData);
                });
            }),
            ...Object.keys(cachedRoutes).map((route) => {
                return $when(() => Utility.doesPathnameMatch(this.instance.get(), route), () => {
                    if (cache.has(route)) {
                        const cachedData = cache.get(route);
                        cachedData.data.set(this.instance.get().data);
                        return cachedData.component;
                    }
                    const data = this.instance.get().data;
                    cache.set(route, {
                        component: cachedRoutes[route](data),
                        data
                    });
                    return cache.get(route).component;
                });
            })
        ], errorPath);
    }
}
export class BrowserRouter {
    instance = new State(window.location);
    root = null;
    constructor(root = null) {
        window.onpopstate = () => {
            this.instance.set(window.location);
        };
        this.root = root;
    }
    navigate(url) {
        window.history.pushState(undefined, undefined, url);
        this.instance.set(window.location);
    }
    Component({ middlewares = [], routes = {}, errorPath = Utility.defaultErrorPath(), cachedRoutes = {} }) {
        const cache = new Map();
        return $switch([this.instance], [
            ...Object.keys(routes).map(route => {
                if (this.root != null) {
                    route = `${this.root}/${route}`;
                }
                return $when(() => Utility.doesPathnameMatch(this.instance.get().pathname, route), () => {
                    const data = Utility.parseSearchParams(this.instance.get().toString(), route);
                    for (let fx of middlewares) {
                        const status = fx(route, data);
                        if (status != true)
                            break;
                    }
                    return routes[route](data);
                });
            }),
            ...Object.keys(cachedRoutes).map(route => {
                if (this.root != null) {
                    route = `${this.root}/${route}`;
                }
                return $when(() => Utility.doesPathnameMatch(this.instance.get().pathname, route), () => {
                    if (cache.has(route)) {
                        const cachedData = cache.get(route);
                        cachedData.data.set(Utility.parseSearchParams(this.instance.get().toString(), route));
                        return cachedData.component;
                    }
                    const data = new State(Utility.parseSearchParams(this.instance.get().toString(), route));
                    cache.set(route, {
                        component: cachedRoutes[route](data),
                        data
                    });
                    return cache.get(route).component;
                });
            })
        ], errorPath);
    }
}
