export const DriverUtility={createText(text,properties){return{...properties,__driver__:{...properties.__driver__,__text__:{text:text}}}},createPortal(selector,app){return{__driver__:{__portal__:{selector:selector,app:app}}}}};