import { $switch, $when, Content, Layout } from "../components"
import { Component, State } from "../index"

export class $virtualRouter {

    pointer = 0
    instance: State<{route: string, data: any}>
    histroy: State<{route: string, data: any}[]> = new State<{route: string, data: any}[]>([])

    constructor(initial: string, data: any) {
        this.instance = new State({ route: initial, data })
        this.histroy.update(routes => [ ...routes, { route: initial, data } ])
    }

    navigate(url: string, data: any) {
        this.pointer++
        this.instance.set({ route: url, data })
        this.histroy.update(routes => [ ...routes, { route: url, data } ]) 
    }

    back() {
        let latest = this.histroy.get()
        if ( latest[--this.pointer] != undefined ) {

            this.instance.set(
                latest[this.pointer]
            )

        }
    }

    forward() {
        let latest = this.histroy.get()
        if ( latest[++this.pointer] != undefined ) {

            this.instance.set(
                latest[this.pointer]
            )

        }
    }

}

export class $browserRouter {

    instance: State<Location> = new State<Location>(window.location)

    constructor() {

        this.instance.listen(() => {

            const data = new URL(window.location.toString())

                data.searchParams.values().next()

        })

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

    parseSearchParams(url: string) {

        const obj = {}
        const URLObj = new URL(url)

        URLObj.searchParams.forEach((v, k) => {

            obj[k] = v

        })

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

export const Router = {

    Virtual({ routerState, routes, errorPath = Utility.defaultErrorPath() }: { routerState: State<{ route: string, data: any }>, routes: { [key: string]: <T>(data: T) => Component }, errorPath?: Component }) {

        //the router state works as history.
        //we will just pick the last item from the stack and that's it!.

        return $switch([routerState], [

            ...Object.keys(routes).map((route) => {

                return $when(() => routerState.get().route === route, () => routes[route]( routerState.get().data ))

            })

        ], errorPath)

    },

    Browser({ routerState, routes, errorPath = Utility.defaultErrorPath() }: { routerState: State<Location>, routes: { [key: string]: <T>(data: T) => Component }, errorPath?: Component }) {

        return $switch([routerState], [

            ...Object.keys(routes).map(route => {

                return $when(() => routerState.get().pathname == route, () => routes[route](Utility.parseSearchParams(routerState.get().toString())))

            })

        ], errorPath)

    }

}