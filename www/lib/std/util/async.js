// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
/** Creates a Promise with the `reject` and `resolve` functions
 * placed as methods on the promise object itself. It allows you to do:
 *
 *     const p = deferred<number>();
 *     // ...
 *     p.resolve(42);
 */
export function deferred() {
    var methods;
    var promise = new Promise(function (resolve, reject) {
        methods = { resolve: resolve, reject: reject };
    });
    return Object.assign(promise, methods);
}
/** The MuxAsyncIterator class multiplexes multiple async iterators into a
 * single stream. It currently makes a few assumptions:
 * - The iterators do not throw.
 * - The final result (the value returned and not yielded from the iterator)
 *   does not matter; if there is any, it is discarded.
 */
var MuxAsyncIterator = /** @class */ (function () {
    function MuxAsyncIterator() {
        this.iteratorCount = 0;
        this.yields = [];
        this.signal = deferred();
    }
    MuxAsyncIterator.prototype.add = function (iterator) {
        ++this.iteratorCount;
        this.callIteratorNext(iterator);
    };
    MuxAsyncIterator.prototype.callIteratorNext = function (iterator) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, value, done;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, iterator.next()];
                    case 1:
                        _a = _b.sent(), value = _a.value, done = _a.done;
                        if (done) {
                            --this.iteratorCount;
                        }
                        else {
                            this.yields.push({ iterator: iterator, value: value });
                        }
                        this.signal.resolve();
                        return [2 /*return*/];
                }
            });
        });
    };
    MuxAsyncIterator.prototype.iterate = function () {
        return __asyncGenerator(this, arguments, function iterate_1() {
            var i, _a, iterator, value;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.iteratorCount > 0)) return [3 /*break*/, 7];
                        // Sleep until any of the wrapped iterators yields.
                        return [4 /*yield*/, __await(this.signal)];
                    case 1:
                        // Sleep until any of the wrapped iterators yields.
                        _b.sent();
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < this.yields.length)) return [3 /*break*/, 6];
                        _a = this.yields[i], iterator = _a.iterator, value = _a.value;
                        return [4 /*yield*/, __await(value)];
                    case 3: return [4 /*yield*/, _b.sent()];
                    case 4:
                        _b.sent();
                        this.callIteratorNext(iterator);
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6:
                        // Clear the `yields` list and reset the `signal` promise.
                        this.yields.length = 0;
                        this.signal = deferred();
                        return [3 /*break*/, 0];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MuxAsyncIterator.prototype[Symbol.asyncIterator] = function () {
        return this.iterate();
    };
    return MuxAsyncIterator;
}());
export { MuxAsyncIterator };
/** Collects all Uint8Arrays from an AsyncIterable and retuns a single
 * Uint8Array with the concatenated contents of all the collected arrays.
 */
export function collectUint8Arrays(it) {
    var it_1, it_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var chunks, length, chunk, e_1_1, collected, offset, _i, chunks_1, chunk;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    chunks = [];
                    length = 0;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    it_1 = __asyncValues(it);
                    _b.label = 2;
                case 2: return [4 /*yield*/, it_1.next()];
                case 3:
                    if (!(it_1_1 = _b.sent(), !it_1_1.done)) return [3 /*break*/, 5];
                    chunk = it_1_1.value;
                    chunks.push(chunk);
                    length += chunk.length;
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(it_1_1 && !it_1_1.done && (_a = it_1["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(it_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    if (chunks.length === 1) {
                        // No need to copy.
                        return [2 /*return*/, chunks[0]];
                    }
                    collected = new Uint8Array(length);
                    offset = 0;
                    for (_i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
                        chunk = chunks_1[_i];
                        collected.set(chunk, offset);
                        offset += chunk.length;
                    }
                    return [2 /*return*/, collected];
            }
        });
    });
}
// Delays the given milliseconds and resolves.
export function delay(ms) {
    return new Promise(function (res) {
        return setTimeout(function () {
            res();
        }, ms);
    });
}
//# sourceMappingURL=async.js.map
