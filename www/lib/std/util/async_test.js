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
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var test = Deno.test;
import { assert, assertEquals, assertStrictEq } from "../testing/asserts.ts";
import { collectUint8Arrays, deferred, MuxAsyncIterator } from "./async.ts";
test(function asyncDeferred() {
    return __awaiter(this, void 0, void 0, function () {
        var d;
        return __generator(this, function (_a) {
            d = deferred();
            d.resolve(12);
            return [2 /*return*/];
        });
    });
});
function gen123() {
    return __asyncGenerator(this, arguments, function gen123_1() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __await(1)];
                case 1: return [4 /*yield*/, _a.sent()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, __await(2)];
                case 3: return [4 /*yield*/, _a.sent()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, __await(3)];
                case 5: return [4 /*yield*/, _a.sent()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function gen456() {
    return __asyncGenerator(this, arguments, function gen456_1() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __await(4)];
                case 1: return [4 /*yield*/, _a.sent()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, __await(5)];
                case 3: return [4 /*yield*/, _a.sent()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, __await(6)];
                case 5: return [4 /*yield*/, _a.sent()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
test(function asyncMuxAsyncIterator() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var mux, results, mux_1, mux_1_1, value, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    mux = new MuxAsyncIterator();
                    mux.add(gen123());
                    mux.add(gen456());
                    results = new Set();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    mux_1 = __asyncValues(mux);
                    _b.label = 2;
                case 2: return [4 /*yield*/, mux_1.next()];
                case 3:
                    if (!(mux_1_1 = _b.sent(), !mux_1_1.done)) return [3 /*break*/, 5];
                    value = mux_1_1.value;
                    results.add(value);
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(mux_1_1 && !mux_1_1.done && (_a = mux_1["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(mux_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    assertEquals(results.size, 6);
                    return [2 /*return*/];
            }
        });
    });
});
test(function collectUint8Arrays0() {
    return __awaiter(this, void 0, void 0, function () {
        function gen() { return __asyncGenerator(this, arguments, function gen_1() { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); }
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, collectUint8Arrays(gen())];
                case 1:
                    result = _a.sent();
                    assert(result instanceof Uint8Array);
                    assertEquals(result.length, 0);
                    return [2 /*return*/];
            }
        });
    });
});
test(function collectUint8Arrays0() {
    return __awaiter(this, void 0, void 0, function () {
        function gen() { return __asyncGenerator(this, arguments, function gen_2() { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); }
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, collectUint8Arrays(gen())];
                case 1:
                    result = _a.sent();
                    assert(result instanceof Uint8Array);
                    assertStrictEq(result.length, 0);
                    return [2 /*return*/];
            }
        });
    });
});
test(function collectUint8Arrays1() {
    return __awaiter(this, void 0, void 0, function () {
        function gen() {
            return __asyncGenerator(this, arguments, function gen_3() {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, __await(buf)];
                        case 1: return [4 /*yield*/, _a.sent()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var buf, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = new Uint8Array([1, 2, 3]);
                    return [4 /*yield*/, collectUint8Arrays(gen())];
                case 1:
                    result = _a.sent();
                    assertStrictEq(result, buf);
                    assertStrictEq(result.length, 3);
                    return [2 /*return*/];
            }
        });
    });
});
test(function collectUint8Arrays4() {
    return __awaiter(this, void 0, void 0, function () {
        function gen() {
            return __asyncGenerator(this, arguments, function gen_4() {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, __await(new Uint8Array([1, 2, 3]))];
                        case 1: return [4 /*yield*/, _a.sent()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, __await(new Uint8Array([]))];
                        case 3: return [4 /*yield*/, _a.sent()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, __await(new Uint8Array([4, 5]))];
                        case 5: return [4 /*yield*/, _a.sent()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, __await(new Uint8Array([6]))];
                        case 7: return [4 /*yield*/, _a.sent()];
                        case 8:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var result, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, collectUint8Arrays(gen())];
                case 1:
                    result = _a.sent();
                    assert(result instanceof Uint8Array);
                    assertStrictEq(result.length, 6);
                    for (i = 0; i < 6; i++) {
                        assertStrictEq(result[i], i + 1);
                    }
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=async_test.js.map