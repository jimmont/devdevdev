// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
// Copyright (c) 2019 Denolibs authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { validateIntegerRange } from "./util.ts";
import { assert } from "../testing/asserts.ts";
/**
 * See also https://nodejs.org/api/events.html
 */
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this._events = new Map();
    }
    EventEmitter.prototype._addListener = function (eventName, listener, prepend) {
        this.emit("newListener", eventName, listener);
        if (this._events.has(eventName)) {
            var listeners = this._events.get(eventName);
            if (prepend) {
                listeners.unshift(listener);
            }
            else {
                listeners.push(listener);
            }
        }
        else {
            this._events.set(eventName, [listener]);
        }
        var max = this.getMaxListeners();
        if (max > 0 && this.listenerCount(eventName) > max) {
            var warning = new Error("Possible EventEmitter memory leak detected.\n         " + this.listenerCount(eventName) + " " + eventName.toString() + " listeners.\n         Use emitter.setMaxListeners() to increase limit");
            warning.name = "MaxListenersExceededWarning";
            console.warn(warning);
        }
        return this;
    };
    /** Alias for emitter.on(eventName, listener). */
    EventEmitter.prototype.addListener = function (eventName, listener) {
        return this._addListener(eventName, listener, false);
    };
    /**
     * Synchronously calls each of the listeners registered for the event named
     * eventName, in the order they were registered, passing the supplied
     * arguments to each.
     * @return true if the event had listeners, false otherwise
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EventEmitter.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this._events.has(eventName)) {
            if (eventName === "error" &&
                this._events.get(EventEmitter.errorMonitor)) {
                this.emit.apply(this, __spreadArrays([EventEmitter.errorMonitor], args));
            }
            var listeners = this._events.get(eventName).slice(); // We copy with slice() so array is not mutated during emit
            for (var _a = 0, listeners_1 = listeners; _a < listeners_1.length; _a++) {
                var listener_1 = listeners_1[_a];
                try {
                    listener_1.apply(this, args);
                }
                catch (err) {
                    this.emit("error", err);
                }
            }
            return true;
        }
        else if (eventName === "error") {
            if (this._events.get(EventEmitter.errorMonitor)) {
                this.emit.apply(this, __spreadArrays([EventEmitter.errorMonitor], args));
            }
            var errMsg = args.length > 0 ? args[0] : Error("Unhandled error.");
            throw errMsg;
        }
        return false;
    };
    /**
     * Returns an array listing the events for which the emitter has
     * registered listeners.
     */
    EventEmitter.prototype.eventNames = function () {
        return Array.from(this._events.keys());
    };
    /**
     * Returns the current max listener value for the EventEmitter which is
     * either set by emitter.setMaxListeners(n) or defaults to
     * EventEmitter.defaultMaxListeners.
     */
    EventEmitter.prototype.getMaxListeners = function () {
        return this.maxListeners || EventEmitter.defaultMaxListeners;
    };
    /**
     * Returns the number of listeners listening to the event named
     * eventName.
     */
    EventEmitter.prototype.listenerCount = function (eventName) {
        if (this._events.has(eventName)) {
            return this._events.get(eventName).length;
        }
        else {
            return 0;
        }
    };
    EventEmitter.prototype._listeners = function (target, eventName, unwrap) {
        if (!target._events.has(eventName)) {
            return [];
        }
        var eventListeners = target._events.get(eventName);
        return unwrap
            ? this.unwrapListeners(eventListeners)
            : eventListeners.slice(0);
    };
    EventEmitter.prototype.unwrapListeners = function (arr) {
        var unwrappedListeners = new Array(arr.length);
        for (var i = 0; i < arr.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            unwrappedListeners[i] = arr[i]["listener"] || arr[i];
        }
        return unwrappedListeners;
    };
    /** Returns a copy of the array of listeners for the event named eventName.*/
    EventEmitter.prototype.listeners = function (eventName) {
        return this._listeners(this, eventName, true);
    };
    /**
     * Returns a copy of the array of listeners for the event named eventName,
     * including any wrappers (such as those created by .once()).
     */
    EventEmitter.prototype.rawListeners = function (eventName) {
        return this._listeners(this, eventName, false);
    };
    /** Alias for emitter.removeListener(). */
    EventEmitter.prototype.off = function (eventName, listener) {
        return this.removeListener(eventName, listener);
    };
    /**
     * Adds the listener function to the end of the listeners array for the event
     *  named eventName. No checks are made to see if the listener has already
     * been added. Multiple calls passing the same combination of eventName and
     * listener will result in the listener being added, and called, multiple
     * times.
     */
    EventEmitter.prototype.on = function (eventName, listener) {
        return this.addListener(eventName, listener);
    };
    /**
     * Adds a one-time listener function for the event named eventName. The next
     * time eventName is triggered, this listener is removed and then invoked.
     */
    EventEmitter.prototype.once = function (eventName, listener) {
        var wrapped = this.onceWrap(eventName, listener);
        this.on(eventName, wrapped);
        return this;
    };
    // Wrapped function that calls EventEmitter.removeListener(eventName, self) on execution.
    EventEmitter.prototype.onceWrap = function (eventName, listener) {
        var wrapper = function () {
            var args = []; // eslint-disable-line @typescript-eslint/no-explicit-any
            for (var _i = 0 // eslint-disable-line @typescript-eslint/no-explicit-any
            ; _i < arguments.length // eslint-disable-line @typescript-eslint/no-explicit-any
            ; _i++ // eslint-disable-line @typescript-eslint/no-explicit-any
            ) {
                args[_i] = arguments[_i]; // eslint-disable-line @typescript-eslint/no-explicit-any
            }
            this.context.removeListener(this.eventName, this.rawListener);
            this.listener.apply(this.context, args);
        };
        var wrapperContext = {
            eventName: eventName,
            listener: listener,
            rawListener: wrapper,
            context: this
        };
        var wrapped = wrapper.bind(wrapperContext);
        wrapperContext.rawListener = wrapped;
        wrapped.listener = listener;
        return wrapped;
    };
    /**
     * Adds the listener function to the beginning of the listeners array for the
     *  event named eventName. No checks are made to see if the listener has
     * already been added. Multiple calls passing the same combination of
     * eventName and listener will result in the listener being added, and
     * called, multiple times.
     */
    EventEmitter.prototype.prependListener = function (eventName, listener) {
        return this._addListener(eventName, listener, true);
    };
    /**
     * Adds a one-time listener function for the event named eventName to the
     * beginning of the listeners array. The next time eventName is triggered,
     * this listener is removed, and then invoked.
     */
    EventEmitter.prototype.prependOnceListener = function (eventName, listener) {
        var wrapped = this.onceWrap(eventName, listener);
        this.prependListener(eventName, wrapped);
        return this;
    };
    /** Removes all listeners, or those of the specified eventName. */
    EventEmitter.prototype.removeAllListeners = function (eventName) {
        var _this = this;
        if (this._events === undefined) {
            return this;
        }
        if (eventName && this._events.has(eventName)) {
            var listeners = this._events.get(eventName).slice(); // Create a copy; We use it AFTER it's deleted.
            this._events["delete"](eventName);
            for (var _i = 0, listeners_2 = listeners; _i < listeners_2.length; _i++) {
                var listener_2 = listeners_2[_i];
                this.emit("removeListener", eventName, listener_2);
            }
        }
        else {
            var eventList = this.eventNames();
            eventList.map(function (value) {
                _this.removeAllListeners(value);
            });
        }
        return this;
    };
    /**
     * Removes the specified listener from the listener array for the event
     * named eventName.
     */
    EventEmitter.prototype.removeListener = function (eventName, listener) {
        if (this._events.has(eventName)) {
            var arr = this._events.get(eventName);
            assert(arr);
            var listenerIndex = -1;
            for (var i = arr.length - 1; i >= 0; i--) {
                // arr[i]["listener"] is the reference to the listener inside a bound 'once' wrapper
                if (arr[i] == listener ||
                    (arr[i] && arr[i]["listener"] == listener)) {
                    listenerIndex = i;
                    break;
                }
            }
            if (listenerIndex >= 0) {
                arr.splice(listenerIndex, 1);
                this.emit("removeListener", eventName, listener);
                if (arr.length === 0) {
                    this._events["delete"](eventName);
                }
            }
        }
        return this;
    };
    /**
     * By default EventEmitters will print a warning if more than 10 listeners
     * are added for a particular event. This is a useful default that helps
     * finding memory leaks. Obviously, not all events should be limited to just
     * 10 listeners. The emitter.setMaxListeners() method allows the limit to be
     * modified for this specific EventEmitter instance. The value can be set to
     * Infinity (or 0) to indicate an unlimited number of listeners.
     */
    EventEmitter.prototype.setMaxListeners = function (n) {
        validateIntegerRange(n, "maxListeners", 0);
        this.maxListeners = n;
        return this;
    };
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.errorMonitor = Symbol("events.errorMonitor");
    return EventEmitter;
}());
export default EventEmitter;
export { EventEmitter };
/**
 * Creates a Promise that is fulfilled when the EventEmitter emits the given
 * event or that is rejected when the EventEmitter emits 'error'. The Promise
 * will resolve with an array of all the arguments emitted to the given event.
 */
export function once(emitter, name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
    return new Promise(function (resolve, reject) {
        if (emitter instanceof EventTarget) {
            // EventTarget does not have `error` event semantics like Node
            // EventEmitters, we do not listen to `error` events here.
            emitter.addEventListener(name, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                resolve(args);
            }, { once: true, passive: false, capture: false });
            return;
        }
        else if (emitter instanceof EventEmitter) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            var eventListener_1 = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (errorListener_1 !== undefined) {
                    emitter.removeListener("error", errorListener_1);
                }
                resolve(args);
            };
            var errorListener_1;
            // Adding an error listener is not optional because
            // if an error is thrown on an event emitter we cannot
            // guarantee that the actual event we are waiting will
            // be fired. The result could be a silent way to create
            // memory or file descriptor leaks, which is something
            // we should avoid.
            if (name !== "error") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                errorListener_1 = function (err) {
                    emitter.removeListener(name, eventListener_1);
                    reject(err);
                };
                emitter.once("error", errorListener_1);
            }
            emitter.once(name, eventListener_1);
            return;
        }
    });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createIterResult(value, done) {
    return { value: value, done: done };
}
/**
 * Returns an AsyncIterator that iterates eventName events. It will throw if
 * the EventEmitter emits 'error'. It removes all listeners when exiting the
 * loop. The value returned by each iteration is an array composed of the
 * emitted event arguments.
 */
export function on(emitter, event) {
    var _a;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var unconsumedEventValues = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var unconsumedPromises = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var error = null;
    var finished = false;
    var iterator = (_a = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            next: function () {
                // First, we consume all unread events
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                var value = unconsumedEventValues.shift();
                if (value) {
                    return Promise.resolve(createIterResult(value, false));
                }
                // Then we error, if an error happened
                // This happens one time if at all, because after 'error'
                // we stop listening
                if (error) {
                    var p = Promise.reject(error);
                    // Only the first element errors
                    error = null;
                    return p;
                }
                // If the iterator is finished, resolve to done
                if (finished) {
                    return Promise.resolve(createIterResult(undefined, true));
                }
                // Wait until an event happens
                return new Promise(function (resolve, reject) {
                    unconsumedPromises.push({ resolve: resolve, reject: reject });
                });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "return": function () {
                emitter.removeListener(event, eventHandler);
                emitter.removeListener("error", errorHandler);
                finished = true;
                for (var _i = 0, unconsumedPromises_1 = unconsumedPromises; _i < unconsumedPromises_1.length; _i++) {
                    var promise = unconsumedPromises_1[_i];
                    promise.resolve(createIterResult(undefined, true));
                }
                return Promise.resolve(createIterResult(undefined, true));
            },
            "throw": function (err) {
                error = err;
                emitter.removeListener(event, eventHandler);
                emitter.removeListener("error", errorHandler);
            }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _a[Symbol.asyncIterator] = function () {
            return this;
        },
        _a);
    emitter.on(event, eventHandler);
    emitter.on("error", errorHandler);
    return iterator;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function eventHandler() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var promise = unconsumedPromises.shift();
        if (promise) {
            promise.resolve(createIterResult(args, false));
        }
        else {
            unconsumedEventValues.push(args);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function errorHandler(err) {
        finished = true;
        var toError = unconsumedPromises.shift();
        if (toError) {
            toError.reject(err);
        }
        else {
            // The next time we call next()
            error = err;
        }
        iterator["return"]();
    }
}
//# sourceMappingURL=events.js.map