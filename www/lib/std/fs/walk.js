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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
// Documentation and interface for walk were adapted from Go
// https://golang.org/pkg/path/filepath/#Walk
// Copyright 2009 The Go Authors. All rights reserved. BSD license.
import { unimplemented, assert } from "../testing/asserts.js";
import { join } from "../path/mod.js";
var readDir = Deno.readDir, readDirSync = Deno.readDirSync, stat = Deno.stat, statSync = Deno.statSync;
function include(filename, exts, match, skip) {
    if (exts && !exts.some(function (ext) { return filename.endsWith(ext); })) {
        return false;
    }
    if (match && !match.some(function (pattern) { return !!filename.match(pattern); })) {
        return false;
    }
    if (skip && skip.some(function (pattern) { return !!filename.match(pattern); })) {
        return false;
    }
    return true;
}
/** Walks the file tree rooted at root, yielding each file or directory in the
 * tree filtered according to the given options. The files are walked in lexical
 * order, which makes the output deterministic but means that for very large
 * directories walk() can be inefficient.
 *
 * Options:
 * - maxDepth?: number = Infinity;
 * - includeFiles?: boolean = true;
 * - includeDirs?: boolean = true;
 * - followSymlinks?: boolean = false;
 * - exts?: string[];
 * - match?: RegExp[];
 * - skip?: RegExp[];
 *
 *      for await (const { filename, info } of walk(".")) {
 *        console.log(filename);
 *        assert(info.isFile());
 *      };
 */
export function walk(root, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.maxDepth, maxDepth = _c === void 0 ? Infinity : _c, _d = _b.includeFiles, includeFiles = _d === void 0 ? true : _d, _e = _b.includeDirs, includeDirs = _e === void 0 ? true : _e, _f = _b.followSymlinks, followSymlinks = _f === void 0 ? false : _f, _g = _b.exts, exts = _g === void 0 ? undefined : _g, _h = _b.match, match = _h === void 0 ? undefined : _h, _j = _b.skip, skip = _j === void 0 ? undefined : _j;
    return __asyncGenerator(this, arguments, function walk_1() {
        var _a, ls, _i, ls_1, info, filename;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(maxDepth < 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, __await(void 0)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    if (!(includeDirs && include(root, exts, match, skip))) return [3 /*break*/, 6];
                    _a = { filename: root };
                    return [4 /*yield*/, __await(stat(root))];
                case 3: return [4 /*yield*/, __await.apply(void 0, [(_a.info = _b.sent(), _a)])];
                case 4: return [4 /*yield*/, _b.sent()];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    if (!(maxDepth < 1 || !include(root, undefined, undefined, skip))) return [3 /*break*/, 8];
                    return [4 /*yield*/, __await(void 0)];
                case 7: return [2 /*return*/, _b.sent()];
                case 8: return [4 /*yield*/, __await(readDir(root))];
                case 9:
                    ls = _b.sent();
                    _i = 0, ls_1 = ls;
                    _b.label = 10;
                case 10:
                    if (!(_i < ls_1.length)) return [3 /*break*/, 18];
                    info = ls_1[_i];
                    if (info.isSymlink()) {
                        if (followSymlinks) {
                            // TODO(ry) Re-enable followSymlinks.
                            unimplemented();
                        }
                        else {
                            return [3 /*break*/, 17];
                        }
                    }
                    assert(info.name != null);
                    filename = join(root, info.name);
                    if (!info.isFile()) return [3 /*break*/, 14];
                    if (!(includeFiles && include(filename, exts, match, skip))) return [3 /*break*/, 13];
                    return [4 /*yield*/, __await({ filename: filename, info: info })];
                case 11: return [4 /*yield*/, _b.sent()];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13: return [3 /*break*/, 17];
                case 14: return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(walk(filename, {
                        maxDepth: maxDepth - 1,
                        includeFiles: includeFiles,
                        includeDirs: includeDirs,
                        followSymlinks: followSymlinks,
                        exts: exts,
                        match: match,
                        skip: skip
                    }))))];
                case 15: return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
                case 16:
                    _b.sent();
                    _b.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 10];
                case 18: return [2 /*return*/];
            }
        });
    });
}
/** Same as walk() but uses synchronous ops */
export function walkSync(root, _a) {
    var ls, _i, ls_2, info, filename;
    var _b = _a === void 0 ? {} : _a, _c = _b.maxDepth, maxDepth = _c === void 0 ? Infinity : _c, _d = _b.includeFiles, includeFiles = _d === void 0 ? true : _d, _e = _b.includeDirs, includeDirs = _e === void 0 ? true : _e, _f = _b.followSymlinks, followSymlinks = _f === void 0 ? false : _f, _g = _b.exts, exts = _g === void 0 ? undefined : _g, _h = _b.match, match = _h === void 0 ? undefined : _h, _j = _b.skip, skip = _j === void 0 ? undefined : _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                if (maxDepth < 0) {
                    return [2 /*return*/];
                }
                if (!(includeDirs && include(root, exts, match, skip))) return [3 /*break*/, 2];
                return [4 /*yield*/, { filename: root, info: statSync(root) }];
            case 1:
                _k.sent();
                _k.label = 2;
            case 2:
                if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
                    return [2 /*return*/];
                }
                ls = readDirSync(root);
                _i = 0, ls_2 = ls;
                _k.label = 3;
            case 3:
                if (!(_i < ls_2.length)) return [3 /*break*/, 9];
                info = ls_2[_i];
                if (info.isSymlink()) {
                    if (followSymlinks) {
                        unimplemented();
                    }
                    else {
                        return [3 /*break*/, 8];
                    }
                }
                assert(info.name != null);
                filename = join(root, info.name);
                if (!info.isFile()) return [3 /*break*/, 6];
                if (!(includeFiles && include(filename, exts, match, skip))) return [3 /*break*/, 5];
                return [4 /*yield*/, { filename: filename, info: info }];
            case 4:
                _k.sent();
                _k.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6: return [5 /*yield**/, __values(walkSync(filename, {
                    maxDepth: maxDepth - 1,
                    includeFiles: includeFiles,
                    includeDirs: includeDirs,
                    followSymlinks: followSymlinks,
                    exts: exts,
                    match: match,
                    skip: skip
                }))];
            case 7:
                _k.sent();
                _k.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 3];
            case 9: return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=walk.js.map
