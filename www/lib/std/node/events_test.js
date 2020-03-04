var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var test = Deno.test;
import { assert, assertEquals, fail, assertThrows } from "../testing/asserts.js";
import EventEmitter, { once, on } from "./events.js";
var shouldNeverBeEmitted = function () {
    fail("Should never be called");
};
test({
    name: 'When adding a new event, "eventListener" event is fired before adding the listener',
    fn: function () {
        var eventsFired = [];
        var testEmitter = new EventEmitter();
        testEmitter.on("newListener", function (event) {
            if (event !== "newListener") {
                eventsFired.push("newListener");
            }
        });
        testEmitter.on("event", function () {
            eventsFired.push("event");
        });
        assertEquals(eventsFired, ["newListener"]);
        eventsFired = [];
        testEmitter.emit("event");
        assertEquals(eventsFired, ["event"]);
    }
});
test({
    name: 'When removing a listenert, "removeListener" event is fired after removal',
    fn: function () {
        var eventsFired = [];
        var testEmitter = new EventEmitter();
        testEmitter.on("removeListener", function () {
            eventsFired.push("removeListener");
        });
        var eventFunction = function () {
            eventsFired.push("event");
        };
        testEmitter.on("event", eventFunction);
        assertEquals(eventsFired, []);
        testEmitter.removeListener("event", eventFunction);
        assertEquals(eventsFired, ["removeListener"]);
    }
});
test({
    name: "Default max listeners is 10, but can be changed by direct assignment only",
    fn: function () {
        assertEquals(EventEmitter.defaultMaxListeners, 10);
        new EventEmitter().setMaxListeners(20);
        assertEquals(EventEmitter.defaultMaxListeners, 10);
        EventEmitter.defaultMaxListeners = 20;
        assertEquals(EventEmitter.defaultMaxListeners, 20);
        EventEmitter.defaultMaxListeners = 10; //reset back to original value
    }
});
test({
    name: "addListener adds a listener, and listener count is correct",
    fn: function () {
        var testEmitter = new EventEmitter();
        testEmitter.on("event", shouldNeverBeEmitted);
        assertEquals(1, testEmitter.listenerCount("event"));
        testEmitter.on("event", shouldNeverBeEmitted);
        assertEquals(2, testEmitter.listenerCount("event"));
    }
});
test({
    name: "Emitted events are called synchronously in the order they were added",
    fn: function () {
        var testEmitter = new EventEmitter();
        var eventsFired = [];
        testEmitter.on("event", function (oneArg) {
            eventsFired.push("event(" + oneArg + ")");
        });
        testEmitter.on("event", function (oneArg, twoArg) {
            eventsFired.push("event(" + oneArg + ", " + twoArg + ")");
        });
        testEmitter.on("non-event", shouldNeverBeEmitted);
        testEmitter.on("event", function (oneArg, twoArg, threeArg) {
            eventsFired.push("event(" + oneArg + ", " + twoArg + ", " + threeArg + ")");
        });
        testEmitter.emit("event", 1, 2, 3);
        assertEquals(eventsFired, ["event(1)", "event(1, 2)", "event(1, 2, 3)"]);
    }
});
test({
    name: "Registered event names are returned as strings or Sybols",
    fn: function () {
        var testEmitter = new EventEmitter();
        testEmitter.on("event", shouldNeverBeEmitted);
        testEmitter.on("event", shouldNeverBeEmitted);
        var sym = Symbol("symbol");
        testEmitter.on(sym, shouldNeverBeEmitted);
        assertEquals(testEmitter.eventNames(), ["event", sym]);
    }
});
test({
    name: "You can set and get max listeners",
    fn: function () {
        var testEmitter = new EventEmitter();
        assertEquals(testEmitter.getMaxListeners(), 10);
        testEmitter.setMaxListeners(20);
        assertEquals(testEmitter.getMaxListeners(), 20);
    }
});
test({
    name: "You can retrieve registered functions for an event",
    fn: function () {
        var testEmitter = new EventEmitter();
        testEmitter.on("someOtherEvent", shouldNeverBeEmitted);
        testEmitter.on("event", shouldNeverBeEmitted);
        var testFunction = function () { };
        testEmitter.on("event", testFunction);
        assertEquals(testEmitter.listeners("event"), [
            shouldNeverBeEmitted,
            testFunction
        ]);
    }
});
test({
    name: "Off is alias for removeListener",
    fn: function () {
        var testEmitter = new EventEmitter();
        testEmitter.on("event", shouldNeverBeEmitted);
        assertEquals(testEmitter.listenerCount("event"), 1);
        testEmitter.off("event", shouldNeverBeEmitted);
        assertEquals(testEmitter.listenerCount("event"), 0);
    }
});
test({
    name: "Event registration can be chained",
    fn: function () {
        var testEmitter = new EventEmitter();
        testEmitter
            .on("event", shouldNeverBeEmitted)
            .on("event", shouldNeverBeEmitted);
        assertEquals(testEmitter.listenerCount("event"), 2);
    }
});
test({
    name: "Events can be registered to only fire once",
    fn: function () {
        var eventsFired = [];
        var testEmitter = new EventEmitter();
        //prove multiple emits on same event first (when registered with 'on')
        testEmitter.on("multiple event", function () {
            eventsFired.push("multiple event");
        });
        testEmitter.emit("multiple event");
        testEmitter.emit("multiple event");
        assertEquals(eventsFired, ["multiple event", "multiple event"]);
        //now prove multiple events registered via 'once' only emit once
        eventsFired = [];
        testEmitter.once("single event", function () {
            eventsFired.push("single event");
        });
        testEmitter.emit("single event");
        testEmitter.emit("single event");
        assertEquals(eventsFired, ["single event"]);
    }
});
test({
    name: "You can inject a listener into the start of the stack, rather than at the end",
    fn: function () {
        var eventsFired = [];
        var testEmitter = new EventEmitter();
        testEmitter.on("event", function () {
            eventsFired.push("first");
        });
        testEmitter.on("event", function () {
            eventsFired.push("second");
        });
        testEmitter.prependListener("event", function () {
            eventsFired.push("third");
        });
        testEmitter.emit("event");
        assertEquals(eventsFired, ["third", "first", "second"]);
    }
});
test({
    name: 'You can prepend a "once" listener',
    fn: function () {
        var eventsFired = [];
        var testEmitter = new EventEmitter();
        testEmitter.on("event", function () {
            eventsFired.push("first");
        });
        testEmitter.on("event", function () {
            eventsFired.push("second");
        });
        testEmitter.prependOnceListener("event", function () {
            eventsFired.push("third");
        });
        testEmitter.emit("event");
        testEmitter.emit("event");
        assertEquals(eventsFired, ["third", "first", "second", "first", "second"]);
    }
});
test({
    name: "Remove all listeners, which can also be chained",
    fn: function () {
        var testEmitter = new EventEmitter();
        testEmitter.on("event", shouldNeverBeEmitted);
        testEmitter.on("event", shouldNeverBeEmitted);
        testEmitter.on("other event", shouldNeverBeEmitted);
        testEmitter.on("other event", shouldNeverBeEmitted);
        testEmitter.once("other event", shouldNeverBeEmitted);
        assertEquals(testEmitter.listenerCount("event"), 2);
        assertEquals(testEmitter.listenerCount("other event"), 3);
        testEmitter.removeAllListeners("event").removeAllListeners("other event");
        assertEquals(testEmitter.listenerCount("event"), 0);
        assertEquals(testEmitter.listenerCount("other event"), 0);
    }
});
test({
    name: "Remove individual listeners, which can also be chained",
    fn: function () {
        var testEmitter = new EventEmitter();
        testEmitter.on("event", shouldNeverBeEmitted);
        testEmitter.on("event", shouldNeverBeEmitted);
        testEmitter.once("other event", shouldNeverBeEmitted);
        assertEquals(testEmitter.listenerCount("event"), 2);
        assertEquals(testEmitter.listenerCount("other event"), 1);
        testEmitter.removeListener("other event", shouldNeverBeEmitted);
        assertEquals(testEmitter.listenerCount("event"), 2);
        assertEquals(testEmitter.listenerCount("other event"), 0);
        testEmitter
            .removeListener("event", shouldNeverBeEmitted)
            .removeListener("event", shouldNeverBeEmitted);
        assertEquals(testEmitter.listenerCount("event"), 0);
        assertEquals(testEmitter.listenerCount("other event"), 0);
    }
});
test({
    name: "It is OK to try to remove non-existant listener",
    fn: function () {
        var testEmitter = new EventEmitter();
        var madeUpEvent = function () {
            fail("Should never be called");
        };
        testEmitter.on("event", shouldNeverBeEmitted);
        assertEquals(testEmitter.listenerCount("event"), 1);
        testEmitter.removeListener("event", madeUpEvent);
        testEmitter.removeListener("non-existant event", madeUpEvent);
        assertEquals(testEmitter.listenerCount("event"), 1);
    }
});
test({
    name: "all listeners complete execution even if removed before execution",
    fn: function () {
        var testEmitter = new EventEmitter();
        var eventsProcessed = [];
        var listenerB = function () { return eventsProcessed.push("B"); };
        var listenerA = function () {
            eventsProcessed.push("A");
            testEmitter.removeListener("event", listenerB);
        };
        testEmitter.on("event", listenerA);
        testEmitter.on("event", listenerB);
        testEmitter.emit("event");
        assertEquals(eventsProcessed, ["A", "B"]);
        eventsProcessed = [];
        testEmitter.emit("event");
        assertEquals(eventsProcessed, ["A"]);
    }
});
test({
    name: 'Raw listener will return event listener or wrapped "once" function',
    fn: function () {
        var testEmitter = new EventEmitter();
        var eventsProcessed = [];
        var listenerA = function () { return eventsProcessed.push("A"); };
        var listenerB = function () { return eventsProcessed.push("B"); };
        testEmitter.on("event", listenerA);
        testEmitter.once("once-event", listenerB);
        var rawListenersForEvent = testEmitter.rawListeners("event");
        var rawListenersForOnceEvent = testEmitter.rawListeners("once-event");
        assertEquals(rawListenersForEvent.length, 1);
        assertEquals(rawListenersForOnceEvent.length, 1);
        assertEquals(rawListenersForEvent[0], listenerA);
        assertEquals(rawListenersForOnceEvent[0].listener, listenerB);
    }
});
test({
    name: "Once wrapped raw listeners may be executed multiple times, until the wrapper is executed",
    fn: function () {
        var testEmitter = new EventEmitter();
        var eventsProcessed = [];
        var listenerA = function () { return eventsProcessed.push("A"); };
        testEmitter.once("once-event", listenerA);
        var rawListenersForOnceEvent = testEmitter.rawListeners("once-event");
        var wrappedFn = rawListenersForOnceEvent[0];
        wrappedFn.listener();
        wrappedFn.listener();
        wrappedFn.listener();
        assertEquals(eventsProcessed, ["A", "A", "A"]);
        eventsProcessed = [];
        wrappedFn(); // executing the wrapped listener function will remove it from the event
        assertEquals(eventsProcessed, ["A"]);
        assertEquals(testEmitter.listeners("once-event").length, 0);
    }
});
test({
    name: "Can add once event listener to EventEmitter via standalone function",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var ee, valueArr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ee = new EventEmitter();
                        setTimeout(function () {
                            ee.emit("event", 42, "foo");
                        }, 0);
                        return [4 /*yield*/, once(ee, "event")];
                    case 1:
                        valueArr = _a.sent();
                        assertEquals(valueArr, [42, "foo"]);
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "Can add once event listener to EventTarget via standalone function",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var et, eventObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        et = new EventTarget();
                        setTimeout(function () {
                            var event = new Event("event", { composed: true });
                            et.dispatchEvent(event);
                        }, 0);
                        return [4 /*yield*/, once(et, "event")];
                    case 1:
                        eventObj = _a.sent();
                        assert(!eventObj[0].isTrusted);
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "Only valid integers are allowed for max listeners",
    fn: function () {
        var ee = new EventEmitter();
        ee.setMaxListeners(0);
        assertThrows(function () {
            ee.setMaxListeners(-1);
        }, Error, "must be >= 0");
        assertThrows(function () {
            ee.setMaxListeners(3.45);
        }, Error, "must be 'an integer'");
    }
});
test({
    name: "ErrorMonitor can spy on error events without consuming them",
    fn: function () {
        var ee = new EventEmitter();
        var events = [];
        //unhandled error scenario should throw
        assertThrows(function () {
            ee.emit("error");
        }, Error, "Unhandled error");
        ee.on(EventEmitter.errorMonitor, function () {
            events.push("errorMonitor event");
        });
        //error is still unhandled but also intercepted by error monitor
        assertThrows(function () {
            ee.emit("error");
        }, Error, "Unhandled error");
        assertEquals(events, ["errorMonitor event"]);
        //A registered error handler won't throw, but still be monitored
        events = [];
        ee.on("error", function () {
            events.push("error");
        });
        ee.emit("error");
        assertEquals(events, ["errorMonitor event", "error"]);
    }
});
test({
    name: "asyncronous iteration of events are handled as expected",
    fn: function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var ee, iterable, expected, iterable_1, iterable_1_1, event, current, e_1_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ee = new EventEmitter();
                        setTimeout(function () {
                            ee.emit("foo", "bar");
                            ee.emit("bar", 24);
                            ee.emit("foo", 42);
                        }, 0);
                        iterable = on(ee, "foo");
                        expected = [["bar"], [42]];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        iterable_1 = __asyncValues(iterable);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, iterable_1.next()];
                    case 3:
                        if (!(iterable_1_1 = _b.sent(), !iterable_1_1.done)) return [3 /*break*/, 5];
                        event = iterable_1_1.value;
                        current = expected.shift();
                        assertEquals(current, event);
                        if (expected.length === 0) {
                            return [3 /*break*/, 5];
                        }
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(iterable_1_1 && !iterable_1_1.done && (_a = iterable_1["return"]))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(iterable_1)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        assertEquals(ee.listenerCount("foo"), 0);
                        assertEquals(ee.listenerCount("error"), 0);
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "asyncronous error handling of emitted events works as expected",
    fn: function () {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var ee, _err, iterable, thrown, iterable_2, iterable_2_1, event, e_2_1, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ee = new EventEmitter();
                        _err = new Error("kaboom");
                        setTimeout(function () {
                            ee.emit("error", _err);
                        }, 0);
                        iterable = on(ee, "foo");
                        thrown = false;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 14, , 15]);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        iterable_2 = __asyncValues(iterable);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, iterable_2.next()];
                    case 4:
                        if (!(iterable_2_1 = _b.sent(), !iterable_2_1.done)) return [3 /*break*/, 6];
                        event = iterable_2_1.value;
                        fail("no events should be processed due to the error thrown");
                        _b.label = 5;
                    case 5: return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(iterable_2_1 && !iterable_2_1.done && (_a = iterable_2["return"]))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(iterable_2)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        err_1 = _b.sent();
                        thrown = true;
                        assertEquals(err_1, _err);
                        return [3 /*break*/, 15];
                    case 15:
                        assertEquals(thrown, true);
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "error thrown during asyncronous processing of events is handled",
    fn: function () {
        var e_3, _a;
        return __awaiter(this, void 0, void 0, function () {
            var ee, _err, iterable, expected, thrown, iterable_3, iterable_3_1, event, current, e_3_1, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ee = new EventEmitter();
                        _err = new Error("kaboom");
                        setTimeout(function () {
                            ee.emit("foo", 42);
                            ee.emit("error", _err);
                        }, 0);
                        iterable = on(ee, "foo");
                        expected = [[42]];
                        thrown = false;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 14, , 15]);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        iterable_3 = __asyncValues(iterable);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, iterable_3.next()];
                    case 4:
                        if (!(iterable_3_1 = _b.sent(), !iterable_3_1.done)) return [3 /*break*/, 6];
                        event = iterable_3_1.value;
                        current = expected.shift();
                        assertEquals(current, event);
                        _b.label = 5;
                    case 5: return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(iterable_3_1 && !iterable_3_1.done && (_a = iterable_3["return"]))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(iterable_3)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_3) throw e_3.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        err_2 = _b.sent();
                        thrown = true;
                        assertEquals(err_2, _err);
                        return [3 /*break*/, 15];
                    case 15:
                        assertEquals(thrown, true);
                        assertEquals(ee.listenerCount("foo"), 0);
                        assertEquals(ee.listenerCount("error"), 0);
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "error thrown in processing loop of asyncronous event prevents processing of additional events",
    fn: function () {
        var e_4, _a;
        return __awaiter(this, void 0, void 0, function () {
            var ee, _err, _b, _c, event, e_4_1, err_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        ee = new EventEmitter();
                        _err = new Error("kaboom");
                        setTimeout(function () {
                            ee.emit("foo", 42);
                            ee.emit("foo", 999);
                        }, 0);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 14, , 15]);
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 7, 8, 13]);
                        _b = __asyncValues(on(ee, "foo"));
                        _d.label = 3;
                    case 3: return [4 /*yield*/, _b.next()];
                    case 4:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 6];
                        event = _c.value;
                        assertEquals(event, [42]);
                        throw _err;
                    case 5: return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _d.trys.push([8, , 11, 12]);
                        if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(_b)];
                    case 9:
                        _d.sent();
                        _d.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_4) throw e_4.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        err_3 = _d.sent();
                        assertEquals(err_3, _err);
                        return [3 /*break*/, 15];
                    case 15:
                        assertEquals(ee.listenerCount("foo"), 0);
                        assertEquals(ee.listenerCount("error"), 0);
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "asyncronous iterator next() works as expected",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var ee, iterable, results, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ee = new EventEmitter();
                        iterable = on(ee, "foo");
                        setTimeout(function () {
                            ee.emit("foo", "bar");
                            ee.emit("foo", 42);
                            iterable["return"]();
                        }, 0);
                        return [4 /*yield*/, Promise.all([
                                iterable.next(),
                                iterable.next(),
                                iterable.next()
                            ])];
                    case 1:
                        results = _b.sent();
                        assertEquals(results, [
                            {
                                value: ["bar"],
                                done: false
                            },
                            {
                                value: [42],
                                done: false
                            },
                            {
                                value: undefined,
                                done: true
                            }
                        ]);
                        _a = assertEquals;
                        return [4 /*yield*/, iterable.next()];
                    case 2:
                        _a.apply(void 0, [_b.sent(), {
                                value: undefined,
                                done: true
                            }]);
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "async iterable throw handles various scenarios",
    fn: function () {
        var e_5, _a;
        return __awaiter(this, void 0, void 0, function () {
            var ee, iterable, _err, thrown, expected, iterable_4, iterable_4_1, event, e_5_1, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ee = new EventEmitter();
                        iterable = on(ee, "foo");
                        setTimeout(function () {
                            ee.emit("foo", "bar");
                            ee.emit("foo", 42); // lost in the queue
                            iterable["throw"](_err);
                        }, 0);
                        _err = new Error("kaboom");
                        thrown = false;
                        expected = [["bar"], [42]];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 14, , 15]);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        iterable_4 = __asyncValues(iterable);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, iterable_4.next()];
                    case 4:
                        if (!(iterable_4_1 = _b.sent(), !iterable_4_1.done)) return [3 /*break*/, 6];
                        event = iterable_4_1.value;
                        assertEquals(event, expected.shift());
                        _b.label = 5;
                    case 5: return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_5_1 = _b.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(iterable_4_1 && !iterable_4_1.done && (_a = iterable_4["return"]))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(iterable_4)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_5) throw e_5.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        err_4 = _b.sent();
                        thrown = true;
                        assertEquals(err_4, _err);
                        return [3 /*break*/, 15];
                    case 15:
                        assertEquals(thrown, true);
                        assertEquals(expected.length, 0);
                        assertEquals(ee.listenerCount("foo"), 0);
                        assertEquals(ee.listenerCount("error"), 0);
                        return [2 /*return*/];
                }
            });
        });
    }
});
//# sourceMappingURL=events_test.js.map
