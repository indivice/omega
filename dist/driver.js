import{Component,Dynamic,State}from"./index.js";import{ComponentIndex}from"./type.js";export class ListView{from;builder;constructor(from,builder){this.from=from;this.builder=builder}}export class Portal{selector;component;constructor(selector,component){this.selector=selector;this.component=component}}export class HTML{content;constructor(content){this.content=content}}class RenderEngine{node;app;TrackDOMLife=new Set;constructor(node,app){this.node=node;this.app=app}DetectDOMChange(){const callback=()=>{let index=0;for(let context of this.TrackDOMLife){if(!context.element.isConnected){context.callback();this.TrackDOMLife.delete(context)}index++}window.requestAnimationFrame(callback)};callback()}HandleListView(listView,root){let IndexValueMap=[];let iterator=0;for(let value of listView.from.get()){if(typeof value!="object"){console.error("ListView cannot work with primitives. Please use Objects, or use the wrap function");return}const _state=new State({value:value,index:iterator});_state.listen((()=>{listView.from.value[_state.get().index]=_state.get().value}));IndexValueMap.push(_state);root.appendChild(this.BuildDOMTree(listView.builder(_state)));iterator++}const DetectChanges=event=>{let OldArray=event.event=="update"?event.value:event.value.get(listView.from);let NewArray=listView.from.get();if(OldArray.length==0&&NewArray.length==0){IndexValueMap=[];return}if(OldArray.length==0&&NewArray.length!=0){let iterator=0;for(let value of NewArray){if(typeof value!="object"){console.error("ListView cannot work with primitives. Please use Objects, or use the wrap function");return}const _state=new State({value:value,index:iterator});_state.listen((()=>{listView.from.value[_state.get().index]=_state.get().value}));IndexValueMap.push(_state);root.appendChild(this.BuildDOMTree(listView.builder(_state)));iterator++}return}if(OldArray.length!=0&&NewArray.length==0){IndexValueMap=[];for(let child of root.children){child.remove()}return}let OldArrayMap=new Map;let NewArrayMap=new Map;for(let index=0;index<Math.max(OldArray.length,NewArray.length);index++){if(typeof OldArray[index]!="object"&&OldArray[index]!=undefined){console.error("ListView cannot work with primitives. Please use Objects, or use primitive constructor");return}if(OldArray[index]!=undefined){OldArrayMap.set(OldArray[index],index)}if(typeof NewArray[index]!="object"&&NewArray[index]!=undefined){console.log(NewArray[index]);console.error("ListView cannot work with primitives. Please use Objects, or use primitive constructor");return}if(NewArray[index]!=undefined){NewArrayMap.set(NewArray[index],index)}}let padding=0;for(let value of OldArrayMap){if(typeof value!="object"){console.error("ListView cannot work with primitives. Please use Objects, or use primitive constructor");return}if(NewArrayMap.has(value[0])==false){root.children[value[1]+padding].remove();IndexValueMap.splice(value[1]+padding,1);padding--}}padding=0;for(let value of NewArrayMap){if(typeof value!="object"){console.error("ListView cannot work with primitives. Please use Objects, or use primitive constructor");return}if(OldArrayMap.has(value[0])==false){if(root.children[value[1]+padding]!=undefined){const _state=new State({value:value[0],index:value[1]+padding});_state.listen((()=>{listView.from.value[_state.get().index]=_state.get().value}));IndexValueMap.splice(value[1]+padding,0,_state);root.children[value[1]].before(this.BuildDOMTree(listView.builder(IndexValueMap[value[1]+padding])))}else{const _state=new State({value:value[0],index:value[1]+padding});_state.listen((()=>{listView.from.value[_state.get().index]=_state.get().value}));IndexValueMap.push(_state);root.appendChild(this.BuildDOMTree(listView.builder(IndexValueMap[value[1]+padding])))}padding++}}padding=0;for(let item of IndexValueMap){if(item.get().index!=padding){item.update((prev=>({...prev,index:padding})))}padding++}};listView.from.listen(DetectChanges)}BuildDOMTree(component){const HandleComponentChildren=(el,ch)=>{for(let child of ch){el.append(this.BuildDOMTree(child))}};const HandleComponentProperties=(el,properties)=>{for(let key of Object.keys(properties)){if(properties[key]=="__ignore__"||properties[key]==undefined)continue;if(key=="children"||key=="child"||key=="__driver__"||key=="reference"||key=="ondestroy"||key=="from"||key=="builder")continue;switch(key){case"style":if(properties.style instanceof Dynamic){let styleKeys=[];let prevCondition=properties.style.condition.get();function ListenStyleChange(){let newStyles=properties.style.callback();if(prevCondition!=properties.style.condition.get()){let prevMap=new Map(styleKeys.map((value=>[value,false])));styleKeys=Object.keys(newStyles);for(let style of styleKeys){prevMap.set(style,true)}prevMap.forEach(((value,styleName)=>{if(value==false){el.style[styleName]=""}else{el.style[styleName]=newStyles[styleName]}}));prevCondition=properties.style.condition.get()}else if(properties.style.condition.get()==null){let prevMap=new Map(styleKeys.map((value=>[value,false])));styleKeys=Object.keys(newStyles);for(let style of styleKeys){prevMap.set(style,true)}prevMap.forEach(((value,styleName)=>{if(value==false){el.style[styleName]=""}else{el.style[styleName]=newStyles[styleName]}}))}}properties.style.assign(ListenStyleChange)}else{for(let style of Object.keys(properties.style)){if(properties.style[style]==""||properties.style[style]==undefined)continue;if(typeof properties.style[style]=="string"){el.style[style]=properties.style[style]}else{let prevCondition=properties.style[style].condition.get();function CommonStateCallback(){const _style=properties.style[style].callback();if(prevCondition!=properties.style[style].condition.get()){el.style[style]=_style;prevCondition=properties.style[style].condition.get()}else if(properties.style[style].condition.get()==null){el.style[style]=_style}}properties.style[style].assign(CommonStateCallback)}}}break;default:if(key.at(0)=="o"&&key.at(1)=="n"){el[key]=properties[key]}else{if(typeof properties[key]=="string"){el.setAttribute(key,properties[key]);el[key]=properties[key]}else{let prevCondition=properties[key].condition.get();function CommonStateCallback(){let callback=properties[key].callback();if(prevCondition!=properties[key].condition.get()){if(callback==""){if(el.hasAttribute(key)){el.removeAttribute(key);delete el[key]}}else{el.setAttribute(key,callback);el[key]=callback}prevCondition=properties[key].condition.get()}else if(properties[key].condition.get()==null){if(callback==""){if(el.hasAttribute(key)){el.removeAttribute(key);delete el[key]}}else{el.setAttribute(key,callback);el[key]=callback}}}properties[key].assign(CommonStateCallback)}}}}};if(typeof component=="function"){const callback=component();if(callback instanceof Component||callback.constructor==String){return this.BuildDOMTree(callback)}else{console.error("Error: Dynamic Callback can only return another Component or a RAW String")}}else if(component instanceof Dynamic){let prevConditon=component.condition.get();let DynamicComponent=null;const DetectChanges=()=>{const callback=component.callback();if(DynamicComponent==null){const temp=this.BuildDOMTree(callback);DynamicComponent=temp;return}if(component.condition.get()!=prevConditon){const temp=this.BuildDOMTree(callback);DynamicComponent.replaceWith(temp);DynamicComponent=temp;prevConditon=component.condition.get()}else if(component.condition.get()==null){const temp=this.BuildDOMTree(callback);DynamicComponent.replaceWith(temp);DynamicComponent=temp}};component.assign(DetectChanges);return DynamicComponent}else if(component instanceof Component){const HandleComponentMetaData=(hasChild=true)=>{if(component.properties!=undefined){HandleComponentProperties(element,component.properties);if(hasChild!=false){if(component.properties.child!=undefined){HandleComponentChildren(element,[component.properties.child])}else if(component.properties.children!=undefined){HandleComponentChildren(element,component.properties.children)}}if(component.properties!=undefined){if(component.properties.reference!=undefined){component.properties.reference.set(element)}if(component.properties.ondestroy!=undefined){this.TrackDOMLife.add({element:element,callback:component.properties.ondestroy})}}}};let element;switch(component.name){case ComponentIndex.ListView:element=document.createElement("div");HandleComponentMetaData(false);this.HandleListView(component.properties.__driver__,element);return element;case ComponentIndex.Empty:return document.createComment("EM");case ComponentIndex.Form:element=document.createElement("form");HandleComponentMetaData();return element;case ComponentIndex.View:element=document.createElement("div");HandleComponentMetaData();return element;case ComponentIndex.ColumnView:element=document.createElement("div");element.style.display="flex";element.style.flexDirection="column";HandleComponentMetaData();return element;case ComponentIndex.RowView:element=document.createElement("div");element.style.display="flex";element.style.flexDirection="row";HandleComponentMetaData();return element;case ComponentIndex.GridView:element=document.createElement("div");element.style.display="grid";HandleComponentMetaData();return element;case ComponentIndex.HTML:const HTMLData=component.properties.__driver__;element=document.createElement("div");element.innerHTML=HTMLData.content.toString();if(element.children.length>1){return element}else{return element.children[0]}case ComponentIndex.TextInput:element=document.createElement("input");element.setAttribute("type","text");HandleComponentMetaData(false);return element;case ComponentIndex.TextAreaInput:element=document.createElement("textarea");HandleComponentMetaData(false);return element;case ComponentIndex.Link:element=document.createElement("a");HandleComponentMetaData();return element;case ComponentIndex.Button:element=document.createElement("button");HandleComponentMetaData();return element;case ComponentIndex.NumberInput:element=document.createElement("input");element.setAttribute("type","number");HandleComponentMetaData(false);return element;case ComponentIndex.EmailInput:element=document.createElement("input");element.setAttribute("type","email");HandleComponentMetaData(false);return element;case ComponentIndex.PasswordInput:element=document.createElement("input");element.setAttribute("type","password");HandleComponentMetaData(false);return element;case ComponentIndex.FileInput:element=document.createElement("input");element.setAttribute("type","file");HandleComponentMetaData(false);return element;case ComponentIndex.Color:element=document.createElement("input");element.setAttribute("type","color");HandleComponentMetaData(false);return element;case ComponentIndex.Checkbox:element=document.createElement("input");element.setAttribute("type","checkbox");HandleComponentMetaData(false);return element;case ComponentIndex.Dropdown:element=document.createElement("select");HandleComponentMetaData();return element;case ComponentIndex.DropdownItem:element=document.createElement("option");HandleComponentMetaData();return element;case ComponentIndex.Date:element=document.createElement("input");element.setAttribute("type","date");HandleComponentMetaData(false);return element;case ComponentIndex.Time:element=document.createElement("input");element.setAttribute("type","time");HandleComponentMetaData(false);return element;case ComponentIndex.DateTime:element=document.createElement("input");element.setAttribute("type","datetime-local");HandleComponentMetaData(false);return element;case ComponentIndex.InlineText:element=document.createElement("span");HandleComponentMetaData();return element;case ComponentIndex.Icon:element=document.createElement("i");HandleComponentMetaData();return element;case ComponentIndex.TextBox:element=document.createElement("p");HandleComponentMetaData();return element;case ComponentIndex.Label:element=document.createElement("label");HandleComponentMetaData();return element;case ComponentIndex.BreakLine:element=document.createElement("br");HandleComponentMetaData(false);return element;case ComponentIndex.HorizontalRule:element=document.createElement("hr");HandleComponentMetaData(false);return element;case ComponentIndex.Audio:element=document.createElement("audio");HandleComponentMetaData();return element;case ComponentIndex.Video:element=document.createElement("video");HandleComponentMetaData();return element;case ComponentIndex.Image:element=document.createElement("img");HandleComponentMetaData();return element;case ComponentIndex.IFrame:element=document.createElement("iframe");HandleComponentMetaData();return element;case ComponentIndex.MultiMedia:element=document.createElement("object");HandleComponentMetaData();return element;case ComponentIndex.MediaSource:element=document.createElement("source");HandleComponentMetaData(false);return element;case ComponentIndex.Canvas:element=document.createElement("canvas");HandleComponentMetaData(false);return element;default:throw`Invalid component request [ Unrecognized (Index ${component.name}) ]`}}else if(component.constructor==String){return document.createTextNode(component.valueOf())}else{throw"[Error] Unable to make component: Component is neither a string, nor a dynamic or a pure component."}}Render(){this.DetectDOMChange();this.node.replaceWith(this.BuildDOMTree(this.app()))}}export function RenderWebPlatform(args){const Engine=new RenderEngine(document.querySelector(args.selector),args.app);Engine.Render()}