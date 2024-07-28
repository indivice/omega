import { RenderWebPlatform } from "./driver.js";
export class Component {
    name;
    properties;
    constructor(name, properties = {}) {
        this.name = name;
        this.properties = properties;
    }
}
const DetectorStack = [];
function SimpleConditionState() {
    let condition = null;
    const set = (cond) => {
        condition = cond;
    };
    const get = () => condition;
    return {
        set, get
    };
}
export class Dynamic {
    condition;
    callback;
    constructor(callback, condition) {
        this.condition = condition;
        this.callback = () => callback(condition.set);
    }
    assign(callback) {
        DetectorStack.push(callback);
        let cbx = callback();
        DetectorStack.pop();
        return cbx;
    }
}
export class State {
    value;
    subscribers = new Set();
    constructor(value) {
        this.value = value;
    }
    static batch(...batches) {
        let callbackPool = new Set();
        let statePool = new Map;
        for (let _batch of batches) {
            for (let subscriber of _batch.state.subscribers) {
                callbackPool.add(subscriber);
            }
            statePool.set(_batch.state, _batch.value);
            _batch.state.value = _batch.value;
        }
        for (let callback of callbackPool) {
            callback({ event: "batch", value: statePool });
        }
    }
    get() {
        if (DetectorStack.length != 0) {
            this.subscribers.add(DetectorStack[DetectorStack.length - 1]);
        }
        return this.value;
    }
    set(value, batch = false) {
        if (batch == true) {
            return {
                state: this,
                value
            };
        }
        let temp = this.value;
        this.value = value;
        for (let subscriber of this.subscribers) {
            subscriber({ event: "update", value: temp });
        }
    }
    update(callback, batch = false) {
        if (batch == true) {
            return {
                state: this,
                value: callback(this.value)
            };
        }
        let temp = this.value;
        this.value = callback(this.value);
        for (let subscriber of this.subscribers) {
            subscriber({ event: "update", value: temp });
        }
    }
    listen(callback) {
        this.subscribers.add(callback);
        return callback;
    }
}
export function $(callback) {
    const condition = SimpleConditionState();
    return new Dynamic(callback, condition);
}
export function Render(properties) {
    RenderWebPlatform(properties);
}
