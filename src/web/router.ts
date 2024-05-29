import { $switch, $when, Content, Layout } from "../components"
import { Component, State } from "../index"

const Utility = {

    //Does not require any complex REGEX pattern matching
    //because uses loops to compare simple statements.
    /**
     * NOTE: Make sure URL is well formed, and not worse.
     */
    doesPathnameMatch(pathname, pattern) {
        // Split the pathname and pattern into segments
        const pathSegments = pathname.split('/');
        const patternSegments = pattern.split('/');

        // Check if the number of segments is less than or equal to pattern segments (considering optional segments)
        if (pathSegments.length < patternSegments.length) {
            return false; // Not enough segments
        }

        // Loop through each segment pair (pathname and pattern)
        for (let i = 0; i < patternSegments.length; i++) {
            const pathSegment = pathSegments[i];
            const patternSegment = patternSegments[i];

            // Check for variable pattern
            if (patternSegment.startsWith('$')) {
                // Optional variable segment, skip comparison
                continue;
            } else if (pathSegment !== patternSegment) {
                return false; // No match
            }
        }

        // All segments matched (including optional ones)
        return true;
    },

    matchPathname(pathname, pattern) {
        // Split the pathname and pattern into segments
        const pathSegments = pathname.split('/');
        const patternSegments = pattern.split('/');

        // Check if the number of segments is less than or equal to pattern segments
        if (pathSegments.length < patternSegments.length) {
            return null; // Not enough segments
        }

        // Create an object to store captured variables
        const variables = {};

        // Loop through each segment
        for (let i = 0; i < patternSegments.length; i++) {
            const pathSegment = pathSegments[i];
            const patternSegment = patternSegments[i];

            // Check for variable pattern
            if (patternSegment.startsWith('$')) {
                const variableName = patternSegment.slice(1);
                variables[variableName] = pathSegment;
            } else if (pathSegment !== patternSegment) {
                return null; // No match
            }
        }

        // Return the callback arguments with captured variables
        return variables; // Modify based on your actual callback arguments
    },

    parseSearchParams(url: string, route: string) {

        const obj = {
            args: {},
            get: {}
        }
        const URLObj = new URL(url)

        URLObj.searchParams.forEach((v, k) => {

            obj.get[k] = v

        })

        obj.args = Utility.matchPathname(URLObj.pathname, route)

        return obj

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
                    child:
                        Content.Text("404 : Route not found")
                }),
                Content.Text("If you wish a custom error route, provide an errorPath: Component")
            ]
        })

    }

}

export class VirtualRouter {

    pointer = 0
    instance: State<{ route: string, data: any }>
    histroy: State<{ route: string, data: any }[]> = new State<{ route: string, data: any }[]>([])

    constructor(initial: string, data: any) {
        this.instance = new State({ route: initial, data })
        this.histroy.update(routes => [...routes, { route: initial, data }])
    }

    navigate(url: string, data: any) {
        this.pointer++
        this.instance.set({ route: url, data })
        this.histroy.update(routes => [...routes, { route: url, data }])
    }

    back() {
        let latest = this.histroy.get()
        if (latest[--this.pointer] != undefined) {

            this.instance.set(
                latest[this.pointer]
            )

        }
    }

    forward() {
        let latest = this.histroy.get()
        if (latest[++this.pointer] != undefined) {

            this.instance.set(
                latest[this.pointer]
            )

        }
    }
    
    Component({ middlewares, routes = {}, errorPath = Utility.defaultErrorPath(), cachedRoutes = {} }: 
    { 
        middlewares?: (<T>(route: String, data: T) => boolean)[]
        routes?: { [key: string]: <T>(data: T) => Component },
        cachedRoutes?: { [key: string]: (data: State<{ args: any, get: any }>) => Component },
        errorPath?: Component 

    }) {

        //the router state works as history.
        //we will just pick the last item from the stack and that's it!.
        const cache = new Map<string, { component: Component, data: State<any> }>()

        return $switch([this.instance], [

            ...Object.keys(routes).map((route) => {

                return $when(() => Utility.doesPathnameMatch(this.instance.get(), route), () => {

                    const instanceData = this.instance.get().data

                    for ( let fx of middlewares ) {
                        const status = fx( route, instanceData )
                        if ( status != true ) break
                    }

                    return routes[route](instanceData)

                })

            }),

            ...Object.keys(cachedRoutes).map((route) => {

                return $when(() => Utility.doesPathnameMatch(this.instance.get(), route), () => {

                    if ( cache.has(route) ) {

                        const cachedData = cache.get(route)
                        cachedData.data.set(
                            this.instance.get().data
                        )
                        return cachedData.component

                    }

                    //if cache does not have the route
                    const data = this.instance.get().data
                    cache.set(route, {
                        component: cachedRoutes[route](data),
                        data
                    })

                    return cache.get(route).component

                })

            })

        ], errorPath)

    }
}

export class BrowserRouter {

    instance: State<Location> = new State<Location>(window.location)

    constructor() {
        window.onpopstate = () => {
            this.instance.set(window.location)
        }
    }

    navigate(url: string) {
        window.history.pushState(undefined, undefined, url)
        this.instance.set(window.location)
    }


    Component({ middlewares = [], routes = {}, errorPath = Utility.defaultErrorPath(), cachedRoutes = {} }: 
    { 
        middlewares?: ((route: string, data: { args: any, get: any }) => boolean)[],
        routes?: { [key: string]: (data: { args: any, get: any }) => Component },
        cachedRoutes?: { [key: string]: (data: State<{ args: any, get: any }>) => Component },
        errorPath?: Component,
    
    }) {

        const cache = new Map<string, { component: Component, data: State<{ args: any, get: any }> }>()

        return $switch([this.instance], [

            ...Object.keys(routes).map(route => {

                return $when(() => Utility.doesPathnameMatch(this.instance.get().pathname, route), () => {

                    const data = Utility.parseSearchParams(this.instance.get().toString(), route)

                    //middlewares to be executed before all routes.
                    for ( let fx of middlewares ) {
                        const status = fx( route, data )
                        if ( status != true ) break
                    }

                    return routes[route](data)
                })

            }),

            //It caches the function, then uses state to update the get and args instead of
            //recalling with new values.
            ...Object.keys(cachedRoutes).map(route => {

                return $when(() => Utility.doesPathnameMatch(this.instance.get().pathname, route), () => {

                    if ( cache.has(route) ) {

                        const cachedData = cache.get(route)
                        cachedData.data.set(
                            Utility.parseSearchParams(this.instance.get().toString(), route)
                        )
                        return cachedData.component

                    }

                    //if cache does not have the route
                    const data = new State(Utility.parseSearchParams(this.instance.get().toString(), route))
                    cache.set(route, {
                        component: cachedRoutes[route](data),
                        data
                    })

                    return cache.get(route).component

                })

            })

        ], errorPath)

    }

}