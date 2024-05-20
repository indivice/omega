import { Component, Dynamic, Property, State } from '../index'
import { ComponentIndex } from '../type'

class WebRenderEngine {

    node: HTMLElement
    app: () => Component
    renderContext: { element: HTMLElement, callback: () => any }[] = []

    /**
     * Priority order of processing childrens in omega web driver
     * 
     * 1. single childs ( child: Component ) -> always most priority
     * 2. multiple childs ( children: [ ...Components ] )
     */

    constructor(node: HTMLElement, app: () => Component) {

        this.node = node; this.app = app

    }

    detectNodalChanges() {

        const callback = () => {
            let index = 0
            for (let context of this.renderContext) {

                if (!context.element.isConnected) {

                    context.callback()

                    //clear the said context element to garbage collect the node.
                    this.renderContext.splice(index, 1)

                }

                index++

            }


            window.requestAnimationFrame(callback)

        }

        callback()

    }

    HandleComponentChildren(element: HTMLElement, children: Component[]) {

        //we already verified that the children exists. Our task is to simply add them.
        for (let child of children) {

            element.append(
                this.BuildComponentTree(child)
            )

        }

    } //handles the component children and appends them to the node.

    HandleComponentProperties(element: HTMLElement, properties: Property) {

        //it is already verified, properties exists. We just need to work around it now
        for (let key of Object.keys(properties)) {

            if (properties[key] == "__ignore__" || properties[key] == undefined) continue //ignore the said property.
            if (key == "children" || key == "child" || key == "__driver__" || key == "reference" || key == "ondestroy") continue //they are not to be used here.

            switch (key) {

                case "style":
                    //either is an object or dynamic object
                    //@ts-ignore
                    if (properties.style.dynamic != undefined) {

                        //is a dynamic styling
                        //will do a tree-diff. Make sure no 'properties' are added already.

                        //we will assume no nested $property<Attributes> because top-level $property<Styles> are already in use.

                        //@ts-ignore
                        let initialStyles = properties.style.dynamic.callback()
                        let styleKeys = Object.keys(initialStyles)

                        for (let style of styleKeys) {
                            element.style[style] = initialStyles[style]
                        }

                        function ListenStyleChange() {

                            //@ts-ignore
                            let newStyles = properties.style.dynamic.callback()
                            let prevMap = new Map<string, boolean>(
                                styleKeys.map(value => [value, false])
                            )

                            styleKeys = Object.keys(newStyles)

                            for (let style of styleKeys) {
                                prevMap.set(style, true)
                            }

                            prevMap.forEach((value, styleName) => {

                                if (value == false) {
                                    element.style[styleName] = ""
                                } else {
                                    element.style[styleName] = newStyles[styleName]
                                }

                            })

                            initialStyles = newStyles

                        }

                        //@ts-ignore
                        for (let state of properties.style.dynamic.states) {

                            state.listen(ListenStyleChange)

                        }

                    } else {

                        for (let style of Object.keys(properties.style)) {

                            if (properties.style[style] == "__ignore__" || properties.style[style] == undefined) continue

                            if (typeof (properties.style[style]) == "string") {

                                element.style[style] = properties.style[style]

                            } else {

                                //default assumption is dynamic property
                                let callback = properties.style[style].dynamic.callback()

                                if (callback != "__ignore__") {
                                    element.style[style] = callback
                                }

                                function CommonStateCallback() {

                                    callback = properties.style[style].dynamic.callback()

                                    if (callback == "__ignore__") {
                                        element.style[style] = ""
                                    } else {
                                        element.style[style] = callback
                                    }
                                }

                                for (let state of properties.style[style].dynamic.states) {

                                    state.listen(CommonStateCallback)

                                }

                            }

                        }

                    }

                    break

                default:
                    //now the strings could be either -> 1. string or 2. events.
                    if (key.at(0) == 'o' && key.at(1) == 'n') {

                        //is an event. MUST be a function. We used clever tactic lol
                        element[key] = properties[key]

                    } else {

                        //now we will use for types. The type must be either string, or that. We will
                        //also batch updates if no. of state > 1
                        if (typeof (properties[key]) == "string") {

                            element.setAttribute(key, properties[key])
                            element[key] = properties[key]

                        } else {
                            //assume it is a dynamic property.  
                            let callback = properties[key].dynamic.callback()

                            if (callback != "__ignore__") {

                                element.setAttribute(key, callback)
                                element[key] = callback

                            }

                            function CommonStateCallback() {
                                callback = properties[key].dynamic.callback()

                                if (callback == "__ignore__") {

                                    if (element.hasAttribute(key)) {
                                        element.removeAttribute(key)
                                        delete element[key]
                                    }

                                } else {

                                    element.setAttribute(key, callback)
                                    element[key] = callback

                                }
                            }

                            for (let state of properties[key].dynamic.states) {

                                state.listen(CommonStateCallback)

                            }

                        }

                    }
            }
        }
    } //handles the component properties and transfers them to node. Here we need to take care of $property as well.

    HandleLoop(component: Dynamic<Component[]>): HTMLElement {

        const state = component.dynamic.states[0].get()
        let root = this.BuildComponentTree(component.properties.__driver__.root)

        let addressLookup = []

        let outerIndex = 0

        for (let item of state) {

            addressLookup.push(new State(outerIndex))

            root.appendChild(
                this.BuildComponentTree(
                    //@ts-ignore
                    component.dynamic.callback(item, addressLookup[outerIndex])
                )
            )

            outerIndex++

        } //initial build

        if (state.length == 0) {

            root.appendChild(
                this.BuildComponentTree(
                    component.properties.__driver__.fallback
                )
            )

        }

        const HandleLoopStateChange = (prev, newv, batch) => {

            if (batch != undefined) {

                prev = batch.get(component.dynamic.states[0]).prev
                newv = batch.get(component.dynamic.states[0]).newv

            }

            if (newv.length == 0 && prev.length != 0) {

                for (let child of root.childNodes) {
                    child.remove()
                }

                const fallback = this.BuildComponentTree(component.properties.__driver__.fallback)
                root.appendChild(fallback)
                addressLookup = []

                return

            } else if (prev.length == 0 && newv.length != 0) {

                root.firstChild.remove()

            }

            //compare here.
            const lengthCache = Math.max(prev.length, newv.length)
            const removeCache = new Map()
            const createCache = new Map()

            for (let index = 0; index < lengthCache; index++) {

                if (prev[index] !== newv[index]) {

                    if (createCache.has(prev[index])) {

                        const prevIndex0 = createCache.get(prev[index])
                        //get the last item and assign that. (for duplicates)
                        addressLookup[index].set(prevIndex0.pop())

                        if (prevIndex0.length == 0) {
                            createCache.delete(prev[index])
                        } else {
                            createCache.set(prev[index], prevIndex0)
                        }

                    } else {

                        removeCache.set(prev[index], [...(removeCache.get(prev[index]) || []), index])

                    }

                    if (removeCache.has(newv[index])) {

                        const prevIndex = removeCache.get(newv[index])
                        addressLookup[prevIndex.pop()].set(index)

                        if (prevIndex.length == 0) {
                            removeCache.delete(newv[index])
                        } else {
                            removeCache.set(newv[index], prevIndex)
                        }

                    } else {

                        createCache.set(newv[index], [...(createCache.get(newv[index]) || []), index])

                    }

                }

            }

            let removalSortedIndex = []
            for (let item of removeCache) {

                if (item[0] == undefined) continue

                for (let ix of item[1]) {

                    removalSortedIndex[ix] = ix

                }

            }

            let indexPadding = 0
            for (let ix of removalSortedIndex) {

                if (ix == undefined) {
                    continue
                }

                addressLookup.splice(ix - indexPadding, 1)
                root.childNodes[ix - indexPadding].remove()
                indexPadding++

            }

            let createSortedIndex = []
            let creationLookup = {} //has table construct (ofc)
            for (let item of createCache) {

                if (item[0] == undefined) continue
                for (let ix of item[1]) {

                    creationLookup[ix] = item[0]
                    createSortedIndex[ix] = ix

                }

            }

            for (let pos of createSortedIndex) {

                if (pos == undefined) continue

                if (root.childNodes[pos] == undefined) {

                    addressLookup.push(new State(pos))

                    root.appendChild(
                        this.BuildComponentTree(
                            //@ts-ignore
                            component.dynamic.callback(creationLookup[pos], addressLookup[addressLookup.length - 1])
                        )
                    )

                } else {

                    addressLookup[pos] = new State(pos)

                    root.childNodes[pos].before(
                        this.BuildComponentTree(
                            //@ts-ignore
                            component.dynamic.callback(creationLookup[pos], addressLookup[pos])
                        )
                    )

                }
            }

        }

        component.dynamic.states[0].listen(HandleLoopStateChange)
        //@ts-ignore
        return root

    }

    HandleSwitch(component: Dynamic<Component>): HTMLElement {

        let node = null
        let currentConditionIndex: number = -1

        let index = 0
        for (let condition of component.properties.__driver__.conditions) {

            if (condition.condition() == true) {

                node = this.BuildComponentTree(
                    condition.execute()
                )

                currentConditionIndex = index
                break

            }

            index++

        }

        index = 0

        if (node == null) {
            node = this.BuildComponentTree(component.properties.__driver__.fallback)
        }

        const ListenSwitch = () => {

            //after the dependencies have been updated,
            index = 0
            let gotMatch = false

            for (let condition of component.properties.__driver__.conditions) {

                if (condition.condition() == true) {

                    if (currentConditionIndex != index) {

                        const newNode = this.BuildComponentTree(
                            condition.execute()
                        )

                        node.replaceWith(newNode)
                        node = newNode

                        currentConditionIndex = index

                    }

                    gotMatch = true
                    break

                }

                index++

            }

            index = 0

            if (gotMatch == false) {

                const fallback = this.BuildComponentTree(component.properties.__driver__.fallback)

                node.replaceWith(fallback)
                node = fallback

                currentConditionIndex = -1

            }

        }

        //call it once, to make sure the conditions have not changed before the state was updated to
        //recieve listener
        ListenSwitch()

        for (let state of component.dynamic.states) {

            state.listen(ListenSwitch)

        }

        return node

    }

    HandleDynamicTextNodes(component: Dynamic<string>) {

        let prev = component.dynamic.callback()
        let node = document.createTextNode(prev)

        const HandleTextNodeChange = () => {

            let newCall = component.dynamic.callback()
            if (newCall !== prev) {

                let nxNode = document.createTextNode(newCall)
                node.replaceWith(nxNode)
                node = nxNode
                prev = newCall

            }

        }

        //if it has state changes, it won't be able to detect it immediatly.
        HandleTextNodeChange()

        for (let state of component.dynamic.states) {
            state.listen(HandleTextNodeChange)
        }

        return node

    }

    HandleDynamicNodes(component: Dynamic<Component>): HTMLElement {

        let node = this.BuildComponentTree(component.dynamic.callback())

        const HandleNodeChange = () => {

            let newCall = component.dynamic.callback()
            let nxNode = this.BuildComponentTree(newCall)
            node.replaceWith(nxNode)
            node = nxNode

        }

        //this is because if the root level contains state change, it will not be able to detect that
        //immediately
        HandleNodeChange()

        for (let state of component.dynamic.states) {
            state.listen(HandleNodeChange)
        }

        //@ts-ignore
        return node

    }

    BuildComponentTree(component: Component) {

        let element: HTMLElement

        const handleComponentMetaData = (checkChild = true) => {

            if (component.properties != undefined) {

                this.HandleComponentProperties(element, component.properties)
                if (checkChild != false) { //short-circuit logic

                    if (component.properties.child != undefined) {

                        this.HandleComponentChildren(element, [component.properties.child])

                    }

                    else if (component.properties.children != undefined) {

                        this.HandleComponentChildren(element, component.properties.children)

                    }
                }

                if (component.properties != undefined) {
                    if (component.properties.reference != undefined) {
                        component.properties.reference.set(element)
                    }

                    if (component.properties.ondestroy != undefined) {
                        this.renderContext.push({
                            element, callback: component.properties.ondestroy
                        })
                    }
                }

            }
        }

        switch (component.name) {

            //----------------------System Components----------------------//

            case ComponentIndex.Portal:
                try {

                    element = document.querySelector(component.properties.__driver__.__portal__.selector)
                    element.appendChild(
                        this.BuildComponentTree(component.properties.__driver__.__portal__.app)
                    )
                    
                } catch(e) {

                    console.warn("Invalid Portal Configurations. Please use the Layout.Portal component")

                }

                return document.createComment('portal')

            case ComponentIndex.__driver__:
                console.warn(`Component __driver__ (Index ${component.name})\ndoes not have any use in context of omegaUI official web driver`)
                return document.createComment("unsupported")

            case ComponentIndex.__dynamic__:

                if (component.properties.__driver__.context != undefined) {

                    switch (component.properties.__driver__.context) {

                        case "text":
                            //@ts-ignore
                            return this.HandleDynamicTextNodes(component)

                        case "node":
                            //@ts-ignore
                            return this.HandleDynamicNodes(component)

                        case "loop":
                            //@ts-ignore
                            return this.HandleLoop(component)

                        case "switch":
                            //@ts-ignore
                            return this.HandleSwitch(component)

                        default:
                            throw `__dynamic__ unrecognized context error`
                    }

                } else {
                    throw `__dynamic__ undefined context error`
                }

            //----------------------End----------------------//

            //----------------------Layout Components----------------------//

            case ComponentIndex.__empty__:
                return document.createComment('EM')

            case ComponentIndex.View:
                element = document.createElement('div')
                handleComponentMetaData()

                return element

            case ComponentIndex.ColumnView:
                element = document.createElement('div')
                handleComponentMetaData()

                element.style.display = "flex"
                element.style.flexDirection = "column"

                return element

            case ComponentIndex.RowView:
                element = document.createElement("div")
                handleComponentMetaData()

                element.style.display = "flex"
                element.style.flexDirection = "row"

                return element

            case ComponentIndex.GridView:
                element = document.createElement('div')
                handleComponentMetaData()

                element.style.display = "grid"

                return element

            //----------------------End----------------------//

            //----------------------Input Components----------------------//

            case ComponentIndex.TextInput:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'text')
                return element

            case ComponentIndex.TextAreaInput:
                element = document.createElement('textarea')
                handleComponentMetaData(false)

                return element

            case ComponentIndex.Link:
                element = document.createElement('a')
                handleComponentMetaData()

                return element

            case ComponentIndex.Button:
                element = document.createElement('button')
                handleComponentMetaData()

                return element

            case ComponentIndex.NumberInput:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'number')
                return element

            case ComponentIndex.EmailInput:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'email')
                return element

            case ComponentIndex.PasswordInput:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'password')
                return element

            case ComponentIndex.FileInput:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'file')
                return element

            case ComponentIndex.Color:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'color')
                return element

            case ComponentIndex.Checkbox:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'checkbox')
                return element

            case ComponentIndex.Dropdown:
                element = document.createElement('select')
                handleComponentMetaData()
                return element

            case ComponentIndex.DropdownItem:
                element = document.createElement('option')
                handleComponentMetaData()
                return element

            case ComponentIndex.Date:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'date')
                return element

            case ComponentIndex.Time:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'time')
                return element

            case ComponentIndex.DateTime:
                element = document.createElement('input')
                handleComponentMetaData(false)

                element.setAttribute('type', 'datetime-local')
                return element

            //----------------------End----------------------//

            //----------------------Content Components----------------------//

            case ComponentIndex.InlineText:
                element = document.createElement('span')
                handleComponentMetaData()
                return element

            case ComponentIndex.__text__:

                return document.createTextNode(
                    component.properties.__driver__.__text__.text
                )

            case ComponentIndex.Icon:
                element = document.createElement('i')
                handleComponentMetaData()
                return element

            case ComponentIndex.TextBox:
                element = document.createElement('p')
                handleComponentMetaData()
                return element

            case ComponentIndex.Label:
                element = document.createElement('label')
                handleComponentMetaData()
                return element

            case ComponentIndex.BreakLine:
                element = document.createElement('br')
                handleComponentMetaData(false)
                return element

            case ComponentIndex.HorizontalRule:
                element = document.createElement('hr')
                handleComponentMetaData(false)
                return element

            //----------------------End----------------------//

            //----------------------Media Components----------------------//

            case ComponentIndex.Audio:
                element = document.createElement('audio')
                handleComponentMetaData()
                return element

            case ComponentIndex.Video:
                element = document.createElement('video')
                handleComponentMetaData()
                return element

            case ComponentIndex.Image:
                element = document.createElement('img')
                handleComponentMetaData()
                return element

            case ComponentIndex.IFrame:
                element = document.createElement('iframe')
                handleComponentMetaData()
                return element

            case ComponentIndex.MultiMedia:
                element = document.createElement('object')
                handleComponentMetaData()
                return element

            case ComponentIndex.MediaSource:
                element = document.createElement('source')
                handleComponentMetaData(false)
                return element

            case ComponentIndex.Canvas:
                element = document.createElement('canvas')
                handleComponentMetaData(false)
                return element

            //----------------------End----------------------//

            default:
                throw `Invalid component request [ Unrecognized (Index ${component.name}) ]`

        }

    } //responsible for building a tree

    render() {

        this.detectNodalChanges()

        this.node.append(
            this.BuildComponentTree(this.app())
        )

    } //the final renderer

}

export function RenderWeb({ selector, app }: {

    selector: string,
    app: () => Component

}) {

    new WebRenderEngine(document.querySelector(selector), app).render()

}