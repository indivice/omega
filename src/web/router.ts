import { $switch, $when, Layout } from "../components"
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

export const Router = {

    Virtual({ routerState, routes }: { routerState: State<{ route: string, data: any }>, routes: { [key: string]: <T>(data: T) => Component } }) {

        //the router state works as history.
        //we will just pick the last item from the stack and that's it!.
        let lastItem = routerState.get()

        return $switch([routerState], [

            ...Object.keys(routes).map((route) => {

                return $when(() => lastItem.route === route, () => routes[route]( lastItem.data ))

            })

        ])

    },

    Browser() {

    }

}

