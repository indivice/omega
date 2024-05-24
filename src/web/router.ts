import { $switch, $when, Content, Layout } from "../components"
import { Component, State } from "../index"

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

}

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

//conditionals are safe to be used in routes, because re-routing causes the entire
//funtion to run.

//Hence, also make sure that your function does proper cleanup if there is any to be cleaned.

export const Router = {

    Virtual({ routerState, routes, errorPath = Utility.defaultErrorPath() }: { routerState: State<{ route: string, data: any }>, routes: { [key: string]: <T>(data: T) => Component }, errorPath?: Component }) {

        //the router state works as history.
        //we will just pick the last item from the stack and that's it!.

        return $switch([routerState], [

            ...Object.keys(routes).map((route) => {

                return $when(() => routerState.get().route === route, () => routes[route](routerState.get().data))

            })

        ], errorPath)

    },

    Browser({ middlewires = [], routerState, routes, errorPath = Utility.defaultErrorPath() }: { middlewires?: ((route: string, data: { args: any, get: any }) => boolean)[], routerState: State<Location>, routes: { [key: string]: (data: { args: any, get: any }) => Component }, errorPath?: Component }) {

        return $switch([routerState], [

            ...Object.keys(routes).map(route => {

                return $when(() => Utility.doesPathnameMatch(routerState.get().pathname, route), () => {

                    const data = Utility.parseSearchParams(routerState.get().toString(), route)

                    //middlewires to be executed before all routes.
                    for ( let fx of middlewires ) {
                        const status = fx( route, data )
                        if ( status != true ) break
                    }

                    return routes[route](data)
                })

            })

        ], errorPath)

    }
}