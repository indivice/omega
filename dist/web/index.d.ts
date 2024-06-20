import { Component } from '../index.js';
export declare function RenderWeb({ selector, app }: {
    selector: string;
    app: () => Component;
}): void;
export declare function $html(html: string): Component;
