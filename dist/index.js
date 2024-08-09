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
const DisposeMap = new Map();
export function disposeDetector(callback) {
    for (let state of DisposeMap.get(callback)) {
        state.subscribers.delete(callback);
        state.trackExternallyAssignedFunctions.delete(callback);
    }
    DisposeMap.delete(callback);
}
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
    static assign(callback) {
        DetectorStack.push(callback);
        let cbx = callback();
        DetectorStack.pop();
        return cbx;
    }
}
export class State {
    value;
    subscribers = new Set();
    trackExternallyAssignedFunctions = new Set();
    constructor(value = null) {
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
            this.trackExternallyAssignedFunctions.add(DetectorStack[DetectorStack.length - 1]);
            if (DisposeMap.has(DetectorStack[DetectorStack.length - 1])) {
                DisposeMap.set(DetectorStack[DetectorStack.length - 1], [
                    ...DisposeMap.get(DetectorStack[DetectorStack.length - 1]),
                    this
                ]);
            }
            else {
                DisposeMap.set(DetectorStack[DetectorStack.length - 1], [this]);
            }
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
            if (this.trackExternallyAssignedFunctions.has(subscriber)) {
                DetectorStack.push(subscriber);
                subscriber({ event: "update", value: temp });
                DetectorStack.pop();
            }
            else {
                subscriber({ event: "update", value: temp });
            }
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
            if (this.trackExternallyAssignedFunctions.has(subscriber)) {
                DetectorStack.push(subscriber);
                subscriber({ event: "update", value: temp });
                DetectorStack.pop();
            }
            else {
                subscriber({ event: "update", value: temp });
            }
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
export function listItem(value, item = null) {
    if (item != null) {
        item.item = value;
        return item;
    }
    else {
        return {
            item: value
        };
    }
}
export function manyListItems(value = []) {
    return value.map(v => listItem(v));
}
export function useListItem(state) {
    return [
        () => state.get().index,
        () => state.get().value.item,
        (callback, batch = false) => {
            state.update(p => ({
                ...p,
                value: {
                    item: callback(p.value.item)
                }
            }), batch);
        }
    ];
}
export class LazyComponent {
    _lazyConsumerState = new State();
    callback;
    error = new State(false);
    constructor(callback) {
        this.callback = callback;
    }
    load() {
        if (this._lazyConsumerState.get() == null) {
            this.callback().then(value => this._lazyConsumerState.set(value.default))
                .catch(reason => {
                console.log(reason),
                    this.error.set(true);
            });
        }
    }
}
export function useLazy({ consumer, onLoad, onError = "Failed to load dynamic component" }) {
    return $((_key) => {
        if (consumer._lazyConsumerState.get() != null) {
            _key("lazy loaded");
            return consumer._lazyConsumerState.get();
        }
        else if (consumer.error.get() == true) {
            _key("lazy error");
            return () => onError;
        }
        else {
            _key("lazy loading");
            return () => onLoad;
        }
    });
}
export function useMemo(callback) {
    const _state = new State();
    const memoizeChanges = () => {
        _state.set(callback());
    };
    const clearMemo = () => {
        disposeDetector(memoizeChanges);
    };
    Dynamic.assign(memoizeChanges);
    return [_state, clearMemo];
}
export function useInputBind(state) {
    const _properties = {
        value: $(() => `${state.get().valueOf()}`),
        oninput(e) {
            state.set(e.target.value);
        }
    };
    return _properties;
}
export function Render(properties) {
    RenderWebPlatform(properties);
}
