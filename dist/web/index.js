import{Component,State}from"../index.js";import{ComponentIndex}from"../type.js";class WebRenderEngine{node;app;renderContext=[];constructor(node,app){this.node=node;this.app=app}detectNodalChanges(){const callback=()=>{let index=0;for(let context of this.renderContext){if(!context.element.isConnected){context.callback();this.renderContext.splice(index,1)}index++}window.requestAnimationFrame(callback)};callback()}HandleComponentChildren(element,children){for(let child of children){element.append(this.BuildComponentTree(child))}}HandleComponentProperties(element,properties){for(let key of Object.keys(properties)){if(properties[key]=="__ignore__"||properties[key]==undefined)continue;if(key=="children"||key=="child"||key=="__driver__"||key=="reference"||key=="ondestroy")continue;switch(key){case"style":if(properties.style.dynamic!=undefined){let initialStyles=properties.style.dynamic.callback();let styleKeys=Object.keys(initialStyles);for(let style of styleKeys){element.style[style]=initialStyles[style]}function ListenStyleChange(){let newStyles=properties.style.dynamic.callback();let prevMap=new Map(styleKeys.map((value=>[value,false])));styleKeys=Object.keys(newStyles);for(let style of styleKeys){prevMap.set(style,true)}prevMap.forEach(((value,styleName)=>{if(value==false){element.style[styleName]=""}else{element.style[styleName]=newStyles[styleName]}}));initialStyles=newStyles}for(let state of properties.style.dynamic.states){state.listen(ListenStyleChange)}}else{for(let style of Object.keys(properties.style)){if(properties.style[style]=="__ignore__"||properties.style[style]==undefined)continue;if(typeof properties.style[style]=="string"){element.style[style]=properties.style[style]}else{let callback=properties.style[style].dynamic.callback();if(callback!="__ignore__"){element.style[style]=callback}function CommonStateCallback(){callback=properties.style[style].dynamic.callback();if(callback=="__ignore__"){element.style[style]=""}else{element.style[style]=callback}}for(let state of properties.style[style].dynamic.states){state.listen(CommonStateCallback)}}}}break;default:if(key.at(0)=="o"&&key.at(1)=="n"){element[key]=properties[key]}else{if(typeof properties[key]=="string"){element.setAttribute(key,properties[key]);element[key]=properties[key]}else{let callback=properties[key].dynamic.callback();if(callback!="__ignore__"){element.setAttribute(key,callback);element[key]=callback}function CommonStateCallback(){callback=properties[key].dynamic.callback();if(callback=="__ignore__"){if(element.hasAttribute(key)){element.removeAttribute(key);delete element[key]}}else{element.setAttribute(key,callback);element[key]=callback}}for(let state of properties[key].dynamic.states){state.listen(CommonStateCallback)}}}}}}HandleLoop(component){const state=component.dynamic.states[0].get();let root=this.BuildComponentTree(component.properties.__driver__.root);let addressLookup=[];let outerIndex=0;for(let item of state){addressLookup.push(new State(outerIndex));root.appendChild(this.BuildComponentTree(component.dynamic.callback(item,addressLookup[outerIndex])));outerIndex++}if(state.length==0){root.appendChild(this.BuildComponentTree(component.properties.__driver__.fallback))}const HandleLoopStateChange=(prev,newv,batch)=>{if(batch!=undefined){prev=batch.get(component.dynamic.states[0]).prev;newv=batch.get(component.dynamic.states[0]).newv}if(newv.length==0&&prev.length!=0){for(let child of root.childNodes){child.remove()}const fallback=this.BuildComponentTree(component.properties.__driver__.fallback);root.appendChild(fallback);addressLookup=[];return}else if(prev.length==0&&newv.length!=0){root.firstChild.remove()}const lengthCache=Math.max(prev.length,newv.length);const removeCache=new Map;const createCache=new Map;for(let index=0;index<lengthCache;index++){if(prev[index]!==newv[index]){if(createCache.has(prev[index])){const prevIndex0=createCache.get(prev[index]);addressLookup[index].set(prevIndex0.pop());if(prevIndex0.length==0){createCache.delete(prev[index])}else{createCache.set(prev[index],prevIndex0)}}else{removeCache.set(prev[index],[...removeCache.get(prev[index])||[],index])}if(removeCache.has(newv[index])){const prevIndex=removeCache.get(newv[index]);addressLookup[prevIndex.pop()].set(index);if(prevIndex.length==0){removeCache.delete(newv[index])}else{removeCache.set(newv[index],prevIndex)}}else{createCache.set(newv[index],[...createCache.get(newv[index])||[],index])}}}let removalSortedIndex=[];for(let item of removeCache){if(item[0]==undefined)continue;for(let ix of item[1]){removalSortedIndex[ix]=ix}}let indexPadding=0;for(let ix of removalSortedIndex){if(ix==undefined){continue}addressLookup.splice(ix-indexPadding,1);root.childNodes[ix-indexPadding].remove();indexPadding++}let createSortedIndex=[];let creationLookup={};for(let item of createCache){if(item[0]==undefined)continue;for(let ix of item[1]){creationLookup[ix]=item[0];createSortedIndex[ix]=ix}}for(let pos of createSortedIndex){if(pos==undefined)continue;if(root.childNodes[pos]==undefined){addressLookup.push(new State(pos));root.appendChild(this.BuildComponentTree(component.dynamic.callback(creationLookup[pos],addressLookup[addressLookup.length-1])))}else{addressLookup[pos]=new State(pos);root.childNodes[pos].before(this.BuildComponentTree(component.dynamic.callback(creationLookup[pos],addressLookup[pos])))}}};component.dynamic.states[0].listen(HandleLoopStateChange);return root}HandleSwitch(component){let node=null;let currentConditionIndex=-1;let index=0;for(let condition of component.properties.__driver__.conditions){if(condition.condition()==true){node=this.BuildComponentTree(condition.execute());currentConditionIndex=index;break}index++}index=0;if(node==null){node=this.BuildComponentTree(component.properties.__driver__.fallback)}const ListenSwitch=()=>{index=0;let gotMatch=false;for(let condition of component.properties.__driver__.conditions){if(condition.condition()==true){if(currentConditionIndex!=index){const newNode=this.BuildComponentTree(condition.execute());node.replaceWith(newNode);node=newNode;currentConditionIndex=index}gotMatch=true;break}index++}index=0;if(gotMatch==false){const fallback=this.BuildComponentTree(component.properties.__driver__.fallback);node.replaceWith(fallback);node=fallback;currentConditionIndex=-1}};ListenSwitch();for(let state of component.dynamic.states){state.listen(ListenSwitch)}return node}HandleDynamicTextNodes(component){let prev=component.dynamic.callback();let node=document.createTextNode(prev);const HandleTextNodeChange=()=>{let newCall=component.dynamic.callback();if(newCall!==prev){let nxNode=document.createTextNode(newCall);node.replaceWith(nxNode);node=nxNode;prev=newCall}};HandleTextNodeChange();for(let state of component.dynamic.states){state.listen(HandleTextNodeChange)}return node}HandleDynamicNodes(component){let node=this.BuildComponentTree(component.dynamic.callback());const HandleNodeChange=()=>{let newCall=component.dynamic.callback();let nxNode=this.BuildComponentTree(newCall);node.replaceWith(nxNode);node=nxNode};HandleNodeChange();for(let state of component.dynamic.states){state.listen(HandleNodeChange)}return node}BuildComponentTree(component){let element;const handleComponentMetaData=(checkChild=true)=>{if(component.properties!=undefined){this.HandleComponentProperties(element,component.properties);if(checkChild!=false){if(component.properties.child!=undefined){this.HandleComponentChildren(element,[component.properties.child])}else if(component.properties.children!=undefined){this.HandleComponentChildren(element,component.properties.children)}}if(component.properties!=undefined){if(component.properties.reference!=undefined){component.properties.reference.set(element)}if(component.properties.ondestroy!=undefined){this.renderContext.push({element:element,callback:component.properties.ondestroy})}}}};switch(component.name){case ComponentIndex.Portal:try{element=document.querySelector(component.properties.__driver__.__portal__.selector);element.append(this.BuildComponentTree(component.properties.__driver__.__portal__.app))}catch(e){console.warn("Invalid Portal Configurations. Please use the Layout.Portal component")}return document.createComment("portal");case ComponentIndex.__driver__:if(component.properties.__driver__.context!=undefined){switch(component.properties.__driver__.context){case"pure_html":if(component.properties.__driver__.html!=undefined){return component.properties.__driver__.html}}}else{console.warn(`Component __driver__ (Index ${component.name})\ndoes not have any use in context of omegaUI official web driver`);return document.createComment("unsupported")}case ComponentIndex.__dynamic__:if(component.properties.__driver__.context!=undefined){switch(component.properties.__driver__.context){case"text":return this.HandleDynamicTextNodes(component);case"node":return this.HandleDynamicNodes(component);case"loop":return this.HandleLoop(component);case"switch":return this.HandleSwitch(component);default:throw`__dynamic__ unrecognized context error`}}else{throw`__dynamic__ undefined context error`}case ComponentIndex.__empty__:return document.createComment("EM");case ComponentIndex.Form:element=document.createElement("form");handleComponentMetaData();return element;case ComponentIndex.View:element=document.createElement("div");handleComponentMetaData();return element;case ComponentIndex.ColumnView:element=document.createElement("div");handleComponentMetaData();element.style.display="flex";element.style.flexDirection="column";return element;case ComponentIndex.RowView:element=document.createElement("div");handleComponentMetaData();element.style.display="flex";element.style.flexDirection="row";return element;case ComponentIndex.GridView:element=document.createElement("div");handleComponentMetaData();element.style.display="grid";return element;case ComponentIndex.TextInput:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","text");return element;case ComponentIndex.TextAreaInput:element=document.createElement("textarea");handleComponentMetaData(false);return element;case ComponentIndex.Link:element=document.createElement("a");handleComponentMetaData();return element;case ComponentIndex.Button:element=document.createElement("button");handleComponentMetaData();return element;case ComponentIndex.NumberInput:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","number");return element;case ComponentIndex.EmailInput:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","email");return element;case ComponentIndex.PasswordInput:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","password");return element;case ComponentIndex.FileInput:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","file");return element;case ComponentIndex.Color:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","color");return element;case ComponentIndex.Checkbox:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","checkbox");return element;case ComponentIndex.Dropdown:element=document.createElement("select");handleComponentMetaData();return element;case ComponentIndex.DropdownItem:element=document.createElement("option");handleComponentMetaData();return element;case ComponentIndex.Date:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","date");return element;case ComponentIndex.Time:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","time");return element;case ComponentIndex.DateTime:element=document.createElement("input");handleComponentMetaData(false);element.setAttribute("type","datetime-local");return element;case ComponentIndex.InlineText:element=document.createElement("span");handleComponentMetaData();return element;case ComponentIndex.__text__:return document.createTextNode(component.properties.__driver__.__text__.text);case ComponentIndex.Icon:element=document.createElement("i");handleComponentMetaData();return element;case ComponentIndex.TextBox:element=document.createElement("p");handleComponentMetaData();return element;case ComponentIndex.Label:element=document.createElement("label");handleComponentMetaData();return element;case ComponentIndex.BreakLine:element=document.createElement("br");handleComponentMetaData(false);return element;case ComponentIndex.HorizontalRule:element=document.createElement("hr");handleComponentMetaData(false);return element;case ComponentIndex.Audio:element=document.createElement("audio");handleComponentMetaData();return element;case ComponentIndex.Video:element=document.createElement("video");handleComponentMetaData();return element;case ComponentIndex.Image:element=document.createElement("img");handleComponentMetaData();return element;case ComponentIndex.IFrame:element=document.createElement("iframe");handleComponentMetaData();return element;case ComponentIndex.MultiMedia:element=document.createElement("object");handleComponentMetaData();return element;case ComponentIndex.MediaSource:element=document.createElement("source");handleComponentMetaData(false);return element;case ComponentIndex.Canvas:element=document.createElement("canvas");handleComponentMetaData(false);return element;default:throw`Invalid component request [ Unrecognized (Index ${component.name}) ]`}}render(){this.detectNodalChanges();this.node.append(this.BuildComponentTree(this.app()))}}export function RenderWeb({selector:selector,app:app}){new WebRenderEngine(document.querySelector(selector),app).render()}export function $html(html){return new Component(ComponentIndex.__driver__,{__driver__:{context:"pure_html",html:html}})}