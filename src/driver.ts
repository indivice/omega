import { $, ChildDynamicProperty, Component, disposeDetector, Dynamic, Properties, State, StateEvent } from "./index.js"
import { OmegaString, ComponentIndex } from "./type.js"

export class ListView<T> {

    from: State<T[]>
    builder: (event: State<ListViewEvent<T>>) => Component

    constructor(from: State<T[]>, builder: (event: State<ListViewEvent<T>>) => Component) {

        this.from = from
        this.builder = builder

    }

}

export type ListViewEvent<T> = {
    value: T,
    index: number
}

export class Portal {

    selector: string
    component: () => Component

    constructor(selector: string, component: () => Component) {

        this.selector = selector
        this.component = component

    }

}

export class HTML {

    content: OmegaString

    constructor(content: OmegaString) {

        this.content = content

    }

}

//the main rendering logic for the web platform
class RenderEngine {

    node: HTMLElement
    app: () => Component
    dynamicChangeDetectorStack: (() => void)[] = []

    TrackDOMLife: Set<{ element: HTMLElement, callback: () => any }> = new Set()

    constructor(node: HTMLElement, app: () => Component) {
        this.node = node
        this.app = app
    }

    //detects changes in the dom at the refresh rate.
    DetectDOMChange() {

        const callback = () => {

            let index = 0
            for (let context of this.TrackDOMLife) {

                if (!context.element.isConnected) {

                    context.callback()
                    this.TrackDOMLife.delete(context) //auto-garbage collection

                }

                index++

            }


            window.requestAnimationFrame(callback)

        }

        callback()

    }

    HandleListView<T>(listView: ListView<T>, root: HTMLElement) {

        /**
         * For any developers working in this part of the code, I am trying to explain this method as best as
         * I could. This method takes the crazyness of javascript to the next level.
         * 
         * First of all, we will assume that the state we are listening to, has values which are OBJECT, and
         * not Primitives.
         * 
         * Secondly, Because of how javascript works, when we compare two objects, and their reference are
         * same, then only we will get true.
         * 
         * So, our second assumption, is whenever the array is updated, it is updated via array methods that
         * preserves the unchanged values, instead of creating all the items from scratch.
         */

        //our first task, is to build the children based on the initial values of the state
        //If the state changes, we will listen to it, but we will deal with changes, differently.

        //This map stores the index and their corresponding value, in a state to resolve synchronization
        //issues.
        let IndexValueMap: State<{ value: T, index: number }>[] = []

        let iterator = 0
        for (let value of listView.from.get()) {

            if (typeof (value) != 'object') {
                console.error('ListView cannot work with primitives. Please use Objects, or use the wrap function')
                return
            }

            const _state = new State({ value, index: iterator })
            _state.listen(() => {

                listView.from.value[_state.get().index] = _state.get().value

            })

            IndexValueMap.push(_state)

            root.appendChild(
                this.BuildDOMTree(
                    listView.builder(_state)
                )
            )

            iterator++
        }

        const DetectChanges = (event: StateEvent<T[]>) => {

            let OldArray: T[] = event.event == "update" ? event.value : event.value.get(listView.from)
            let NewArray: T[] = listView.from.get()

            //we will verify certain cases first.
            if (OldArray.length == 0 && NewArray.length == 0) {
                IndexValueMap = []
                return
            }

            //rebuild, because there is nothing present.
            if (OldArray.length == 0 && NewArray.length != 0) {

                let iterator = 0
                for (let value of NewArray) {

                    if (typeof (value) != 'object') {
                        console.error('ListView cannot work with primitives. Please use Objects, or use the wrap function')
                        return
                    }

                    const _state = new State({ value, index: iterator })
                    _state.listen(() => {

                        listView.from.value[_state.get().index] = _state.get().value

                    })

                    IndexValueMap.push(_state)

                    root.appendChild(
                        this.BuildDOMTree(
                            listView.builder(_state)
                        )
                    )

                    iterator++
                }

                return

            }

            if (OldArray.length != 0 && NewArray.length == 0) {

                IndexValueMap = []
                //everthing was removed
                for (let child of root.children) {
                    child.remove()
                }

                return

            }

            let OldArrayMap = new Map<T, number>()
            let NewArrayMap = new Map<T, number>()

            for (let index = 0; index < Math.max(OldArray.length, NewArray.length); index++) {

                if (typeof (OldArray[index]) != 'object' && OldArray[index] != undefined) {
                    console.error('ListView cannot work with primitives. Please use Objects, or use primitive constructor')
                    return
                }

                if (OldArray[index] != undefined) {
                    OldArrayMap.set(OldArray[index], index)
                }

                if (typeof (NewArray[index]) != 'object' && NewArray[index] != undefined) {
                    console.log(NewArray[index])
                    console.error('ListView cannot work with primitives. Please use Objects, or use primitive constructor')
                    return
                }

                if (NewArray[index] != undefined) {
                    NewArrayMap.set(NewArray[index], index)
                }

            }

            //first we will remove, then we will proceed to add each item.
            let padding = 0
            for (let value of OldArrayMap) {

                if (typeof (value) != 'object') {
                    console.error('ListView cannot work with primitives. Please use Objects, or use primitive constructor')
                    return
                }

                if (NewArrayMap.has(value[0]) == false) {
                    root.children[value[1] + padding].remove()
                    IndexValueMap.splice(value[1] + padding, 1)
                    padding--
                }

            }

            padding = 0
            //Now add the items
            for (let value of NewArrayMap) {

                if (typeof (value) != 'object') {
                    console.error('ListView cannot work with primitives. Please use Objects, or use primitive constructor')
                    return
                }

                if (OldArrayMap.has(value[0]) == false) {

                    if (root.children[value[1] + padding] != undefined) {

                        const _state = new State({ value: value[0], index: value[1] + padding })
                        _state.listen(() => {

                            listView.from.value[_state.get().index] = _state.get().value
                        })

                        IndexValueMap.splice(value[1] + padding, 0, _state)
                        root.children[value[1]].before(
                            this.BuildDOMTree(
                                listView.builder(
                                    IndexValueMap[value[1] + padding]
                                )
                            )
                        )

                    } else {

                        const _state = new State({ value: value[0], index: value[1] + padding })
                        _state.listen(() => {

                            listView.from.value[_state.get().index] = _state.get().value
                        })

                        IndexValueMap.push(_state)
                        root.appendChild(
                            this.BuildDOMTree(
                                listView.builder(
                                    IndexValueMap[value[1] + padding]
                                )
                            )
                        )

                    }

                    padding++

                }

            }

            padding = 0

            //now synchronize the IndexMap
            for (let item of IndexValueMap) {

                if (item.get().index != padding) {
                    item.update(prev => ({ ...prev, index: padding }))
                }

                padding++

            }

        }

        listView.from.listen(DetectChanges)

    }

    //Build the component tree based on the application schematics. Takes a raw component!
    BuildDOMTree(
        component: ChildDynamicProperty | OmegaString | Component | (() => Component | string),
        initialNodeStack: (HTMLElement | Text | Comment)[] = [],
        root: number = 0 //0 means root
    ) {

        const HandleComponentChildren = (el: HTMLElement, ch: (Component | OmegaString | ChildDynamicProperty)[]) => {

            //we already verified that the children exists. Our task is to simply add them.
            for (let child of ch) {

                el.append(
                    this.BuildDOMTree(child)
                )

            }

        } //handles the component children and appends them to the node.

        const HandleComponentProperties = (el: HTMLElement, properties: Properties) => {

            //it is already verified, properties exists. We just need to work around it now
            for (let key of Object.keys(properties)) {

                if (properties[key] == "__ignore__" || properties[key] == undefined) continue //ignore the said property.
                if (key == "children" || key == "child" || key == "__driver__" || key == "reference" || key == "ondestroy" || key == "from" || key == "builder") continue //they are not to be used here.

                switch (key) {

                    case "style":
                        //either is an object or dynamic object
                        if (properties.style instanceof Dynamic) {

                            //is a dynamic styling
                            //will do a tree-diff. Make sure no 'properties' are added already.

                            //we will assume no nested $property<Attributes> because top-level $property<Styles> are already in use.

                            let styleKeys = []
                            let prevCondition = properties.style.condition.get()

                            function ListenStyleChange() {

                                let newStyles = (properties.style as Dynamic<any>).callback()
                                if (prevCondition != (properties.style as Dynamic<any>).condition.get()) {
                                    let prevMap = new Map<string, boolean>(
                                        styleKeys.map(value => [value, false])
                                    )

                                    styleKeys = Object.keys(newStyles)

                                    for (let style of styleKeys) {
                                        prevMap.set(style, true)
                                    }

                                    prevMap.forEach((value, styleName) => {

                                        if (value == false) {
                                            el.style[styleName] = ""
                                        } else {
                                            el.style[styleName] = newStyles[styleName]
                                        }

                                    })

                                    prevCondition = (properties.style as Dynamic<any>).condition.get()

                                } else if ((properties.style as Dynamic<any>).condition.get() == null) {

                                    let prevMap = new Map<string, boolean>(
                                        styleKeys.map(value => [value, false])
                                    )

                                    styleKeys = Object.keys(newStyles)

                                    for (let style of styleKeys) {
                                        prevMap.set(style, true)
                                    }

                                    prevMap.forEach((value, styleName) => {

                                        if (value == false) {
                                            el.style[styleName] = ""
                                        } else {
                                            el.style[styleName] = newStyles[styleName]
                                        }

                                    })

                                }

                            }

                            //it will automatically assign it to whom it may concern.
                            Dynamic.assign(ListenStyleChange)

                        } else {

                            for (let style of Object.keys(properties.style)) {

                                if (properties.style[style] == "" || properties.style[style] == undefined) continue

                                if (typeof (properties.style[style]) == "string") {

                                    el.style[style] = properties.style[style]

                                } else {

                                    let prevCondition = properties.style[style].condition.get()
                                    function CommonStateCallback() {

                                        const _style = properties.style[style].callback()

                                        if (prevCondition != properties.style[style].condition.get()) {

                                            el.style[style] = _style
                                            prevCondition = properties.style[style].condition.get()

                                        } else if (properties.style[style].condition.get() == null) {

                                            el.style[style] = _style

                                        }

                                    }

                                    properties.style[style].assign(CommonStateCallback)

                                }

                            }

                        }

                        break

                    default:
                        //now the strings could be either -> 1. string or 2. events.
                        if (key.at(0) == 'o' && key.at(1) == 'n') {

                            //is an event. MUST be a function. We used clever tactic lol
                            el[key] = properties[key]

                        } else {

                            //now we will use for types. The type must be either string, or that. We will
                            //also batch updates if no. of state > 1
                            if (typeof (properties[key]) == "string") {

                                el.setAttribute(key, properties[key])
                                el[key] = properties[key]

                            } else {

                                let prevCondition = properties[key].condition.get()
                                function CommonStateCallback() {

                                    let callback = properties[key].callback()

                                    if (prevCondition != properties[key].condition.get()) {

                                        if (callback == "") {

                                            if (el.hasAttribute(key)) {
                                                el.removeAttribute(key)
                                                delete el[key]
                                            }

                                        } else {

                                            el.setAttribute(key, callback)
                                            el[key] = callback

                                        }

                                        prevCondition = properties[key].condition.get()

                                    } else if (properties[key].condition.get() == null) {
                                        if (callback == "") {

                                            if (el.hasAttribute(key)) {
                                                el.removeAttribute(key)
                                                delete el[key]
                                            }

                                        } else {

                                            el.setAttribute(key, callback)
                                            el[key] = callback

                                        }
                                    }

                                }

                                Dynamic.assign(CommonStateCallback)

                            }

                        }
                }
            }
        }

        if (typeof (component) == "function") {

            const callback = component()

            if (callback instanceof Component || callback.constructor == String) {

                return this.BuildDOMTree(callback)

            } else {

                console.error("Error: Dynamic Callback can only return another Component or a RAW String")

            }

        }
        //first let's determine the type of component we are dealing with.
        else if (component instanceof Dynamic) {

            //we will proceed differently. Here are conditions and all that things will
            //be involved
            let prevConditon = component.condition.get()
            let NodeStack: (HTMLElement | Text | Comment)[] = initialNodeStack

            const DetectChanges = () => {

                const callback = component.callback()

                if (NodeStack.length == 0) {

                    const temp: HTMLElement | Text | Comment = this.BuildDOMTree(callback, NodeStack, root + 1)
                    NodeStack.push(temp)
                    return

                }

                if (component.condition.get() != prevConditon) {

                    for (; this.dynamicChangeDetectorStack.length != root;) {
                        disposeDetector(this.dynamicChangeDetectorStack.pop())
                    }

                    const temp: HTMLElement | Text | Comment = this.BuildDOMTree(callback, NodeStack, root + 1)
                    NodeStack.pop().replaceWith(temp)
                    NodeStack.push(temp)
                    prevConditon = component.condition.get()

                } else if (component.condition.get() == null) {

                    for (; this.dynamicChangeDetectorStack.length != root;) {
                        disposeDetector(this.dynamicChangeDetectorStack.pop())
                    }    

                    const temp: HTMLElement | Text | Comment = this.BuildDOMTree(callback, NodeStack, root + 1)
                    NodeStack.pop().replaceWith(temp)
                    NodeStack.push(temp)

                }

            }

            if (root != 0) {
                this.dynamicChangeDetectorStack.push(DetectChanges)
            }
            
            Dynamic.assign(DetectChanges)

            return NodeStack[0]


        } else if (component instanceof Component) {

            const HandleComponentMetaData = (hasChild = true) => {

                if (component.properties != undefined) {

                    HandleComponentProperties(element, component.properties)

                    if (hasChild != false) { //short-circuit logic

                        if (component.properties.child != undefined) {

                            HandleComponentChildren(element, [component.properties.child])

                        }

                        else if (component.properties.children != undefined) {

                            HandleComponentChildren(element, component.properties.children)

                        }
                    }

                    if (component.properties != undefined) {
                        if (component.properties.reference != undefined) {
                            component.properties.reference.set(element)
                        }

                        if (component.properties.ondestroy != undefined) {
                            this.TrackDOMLife.add({
                                element, callback: component.properties.ondestroy
                            })
                        }
                    }

                }
            }

            let element: HTMLElement
            //for pure components, that are useful for describing user interfaces
            switch (component.name) {

                //----------------------Layout Components----------------------//

                case ComponentIndex.Portal:
                    element = document.querySelector((component.properties.__driver__ as Portal).selector),
                        element.replaceWith(this.BuildDOMTree((component.properties.__driver__ as Portal).component))

                    return document.createComment("PE")

                case ComponentIndex.ListView:
                    element = document.createElement('div')
                    
                    //@ts-ignore
                    delete component.properties.from
                    //@ts-ignore
                    delete component.properties.builder
                    HandleComponentMetaData(false)

                    this.HandleListView((component.properties.__driver__ as ListView<any>), element)

                    return element

                case ComponentIndex.Empty:
                    return document.createComment('EM')

                case ComponentIndex.Form:
                    element = document.createElement('form')

                    HandleComponentMetaData()
                    return element

                case ComponentIndex.View:
                    element = document.createElement('div')

                    HandleComponentMetaData()
                    return element

                case ComponentIndex.ColumnView:
                    element = document.createElement('div')
                    element.style.display = "flex"
                    element.style.flexDirection = "column"

                    HandleComponentMetaData()
                    return element

                case ComponentIndex.RowView:
                    element = document.createElement("div")
                    element.style.display = "flex"
                    element.style.flexDirection = "row"

                    HandleComponentMetaData()
                    return element

                case ComponentIndex.GridView:
                    element = document.createElement('div')
                    element.style.display = "grid"

                    HandleComponentMetaData()
                    return element

                case ComponentIndex.HTML:
                    const HTMLData = component.properties.__driver__ as HTML
                    element = document.createElement('div')
                    element.innerHTML = HTMLData.content.toString()

                    if (element.children.length > 1) {
                        return element
                    } else {
                        return element.children[0]
                    }

                //----------------------End----------------------//

                //----------------------Input Components----------------------//

                case ComponentIndex.TextInput:
                    element = document.createElement('input')

                    element.setAttribute('type', 'text')
                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.TextAreaInput:
                    element = document.createElement('textarea')

                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.Link:
                    element = document.createElement('a')

                    HandleComponentMetaData()
                    return element

                case ComponentIndex.Button:
                    element = document.createElement('button')

                    HandleComponentMetaData()
                    return element

                case ComponentIndex.NumberInput:
                    element = document.createElement('input')

                    element.setAttribute('type', 'number')

                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.EmailInput:
                    element = document.createElement('input')

                    element.setAttribute('type', 'email')

                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.PasswordInput:
                    element = document.createElement('input')

                    element.setAttribute('type', 'password')

                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.FileInput:
                    element = document.createElement('input')

                    element.setAttribute('type', 'file')

                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.Color:
                    element = document.createElement('input')

                    element.setAttribute('type', 'color')

                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.Checkbox:
                    element = document.createElement('input')

                    element.setAttribute('type', 'checkbox')

                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.Dropdown:
                    element = document.createElement('select')

                    HandleComponentMetaData()
                    return element

                case ComponentIndex.DropdownItem:
                    element = document.createElement('option')

                    HandleComponentMetaData()
                    return element

                case ComponentIndex.Date:
                    element = document.createElement('input')

                    element.setAttribute('type', 'date')

                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.Time:
                    element = document.createElement('input')
                    element.setAttribute('type', 'time')

                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.DateTime:
                    element = document.createElement('input')
                    element.setAttribute('type', 'datetime-local')

                    HandleComponentMetaData(false)
                    return element

                //----------------------End----------------------//

                //----------------------Content Components----------------------//

                case ComponentIndex.InlineText:
                    element = document.createElement('span')
                    HandleComponentMetaData()
                    return element

                case ComponentIndex.Icon:
                    element = document.createElement('i')
                    HandleComponentMetaData()
                    return element

                case ComponentIndex.TextBox:
                    element = document.createElement('p')
                    HandleComponentMetaData()
                    return element

                case ComponentIndex.Label:
                    element = document.createElement('label')
                    HandleComponentMetaData()
                    return element

                case ComponentIndex.BreakLine:
                    element = document.createElement('br')
                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.HorizontalRule:
                    element = document.createElement('hr')
                    HandleComponentMetaData(false)
                    return element

                //----------------------End----------------------//

                //----------------------Media Components----------------------//

                case ComponentIndex.Audio:
                    element = document.createElement('audio')
                    HandleComponentMetaData()
                    return element

                case ComponentIndex.Video:
                    element = document.createElement('video')
                    HandleComponentMetaData()
                    return element

                case ComponentIndex.Image:
                    element = document.createElement('img')
                    HandleComponentMetaData()
                    return element

                case ComponentIndex.IFrame:
                    element = document.createElement('iframe')
                    HandleComponentMetaData()
                    return element

                case ComponentIndex.MultiMedia:
                    element = document.createElement('object')
                    HandleComponentMetaData()
                    return element

                case ComponentIndex.MediaSource:
                    element = document.createElement('source')
                    HandleComponentMetaData(false)
                    return element

                case ComponentIndex.Canvas:
                    element = document.createElement('canvas')
                    HandleComponentMetaData(false)
                    return element

                //----------------------End----------------------//

                default:
                    //@ts-ignore
                    throw `Invalid component request [ Unrecognized (Index ${component.name}) ]`

            }

        } else if (component.constructor == String) {

            //a raw string to say out loud!
            return document.createTextNode(component.valueOf())

        } else {

            throw "[Error] Unable to make component: Component is neither a string, nor a dynamic or a pure component."

        }

    }

    Render() {

        this.DetectDOMChange()
        this.node.replaceWith(
            this.BuildDOMTree(this.app())
        )

    }

}

export function RenderWebPlatform(args: { selector: string, app: () => Component }) {

    const Engine = new RenderEngine(
        document.querySelector(args.selector),
        args.app
    )

    Engine.Render()

}