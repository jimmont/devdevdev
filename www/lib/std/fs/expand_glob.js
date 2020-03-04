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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
import { SEP_PATTERN, globToRegExp, isAbsolute, isGlob, isWindows, joinGlobs, normalize } from "../path/mod.ts";
import { walk, walkSync } from "./walk.ts";
import { assert } from "../testing/asserts.ts";
var cwd = Deno.cwd, stat = Deno.stat, statSync = Deno.statSync;
// TODO: Maybe make this public somewhere.
function split(path) {
    var s = SEP_PATTERN.source;
    var segments = path
        .replace(new RegExp("^" + s + "|" + s + "$", "g"), "")
        .split(SEP_PATTERN);
    var isAbsolute_ = isAbsolute(path);
    return {
        segments: segments,
        isAbsolute: isAbsolute_,
        hasTrailingSep: !!path.match(new RegExp(s + "$")),
        winRoot: isWindows && isAbsolute_ ? segments.shift() : undefined
    };
}
function throwUnlessNotFound(error) {
    if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
    }
}
/**
 * Expand the glob string from the specified `root` directory and yield each
 * result as a `WalkInfo` object.
 */
export function expandGlob(glob, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.root, root = _c === void 0 ? cwd() : _c, _d = _b.exclude, exclude = _d === void 0 ? [] : _d, _e = _b.includeDirs, includeDirs = _e === void 0 ? true : _e, _f = _b.extended, extended = _f === void 0 ? false : _f, _g = _b.globstar, globstar = _g === void 0 ? false : _g;
    return __asyncGenerator(this, arguments, function expandGlob_1() {
        function advanceMatch(walkInfo, globSegment) {
            return __asyncGenerator(this, arguments, function advanceMatch_1() {
                var parentPath, _a, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!!walkInfo.info.isDirectory()) return [3 /*break*/, 2];
                            return [4 /*yield*/, __await(void 0)];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            if (!(globSegment == "..")) return [3 /*break*/, 12];
                            parentPath = joinGlobs([walkInfo.filename, ".."], globOptions);
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 9, , 10]);
                            if (!shouldInclude(parentPath)) return [3 /*break*/, 8];
                            _a = { filename: parentPath };
                            return [4 /*yield*/, __await(stat(parentPath))];
                        case 4: return [4 /*yield*/, __await.apply(void 0, [(_a.info = _b.sent(), _a)])];
                        case 5: return [4 /*yield*/, _b.sent()];
                        case 6: return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
                        case 7: return [2 /*return*/, _b.sent()];
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            error_2 = _b.sent();
                            throwUnlessNotFound(error_2);
                            return [3 /*break*/, 10];
                        case 10: return [4 /*yield*/, __await(void 0)];
                        case 11: return [2 /*return*/, _b.sent()];
                        case 12:
                            if (!(globSegment == "**")) return [3 /*break*/, 16];
                            return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(walk(walkInfo.filename, {
                                    includeFiles: false,
                                    skip: excludePatterns
                                }))))];
                        case 13: return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
                        case 14: return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
                        case 15: return [2 /*return*/, _b.sent()];
                        case 16: return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(walk(walkInfo.filename, {
                                maxDepth: 1,
                                match: [
                                    globToRegExp(joinGlobs([walkInfo.filename, globSegment], globOptions), globOptions)
                                ],
                                skip: excludePatterns
                            }))))];
                        case 17: return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
                        case 18:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        var globOptions, absRoot, resolveFromRoot, excludePatterns, shouldInclude, _a, segments, hasTrailingSep, winRoot, fixedRoot, seg, fixedRootInfo, _b, error_1, currentMatches, _i, segments_1, segment, nextMatchMap, _c, currentMatches_1, currentMatch, _d, _e, nextMatch, e_1_1;
        var e_1, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    globOptions = { extended: extended, globstar: globstar };
                    absRoot = isAbsolute(root)
                        ? normalize(root)
                        : joinGlobs([cwd(), root], globOptions);
                    resolveFromRoot = function (path) {
                        return isAbsolute(path)
                            ? normalize(path)
                            : joinGlobs([absRoot, path], globOptions);
                    };
                    excludePatterns = exclude
                        .map(resolveFromRoot)
                        .map(function (s) { return globToRegExp(s, globOptions); });
                    shouldInclude = function (filename) {
                        return !excludePatterns.some(function (p) { return !!filename.match(p); });
                    };
                    _a = split(resolveFromRoot(glob)), segments = _a.segments, hasTrailingSep = _a.hasTrailingSep, winRoot = _a.winRoot;
                    fixedRoot = winRoot != undefined ? winRoot : "/";
                    while (segments.length > 0 && !isGlob(segments[0])) {
                        seg = segments.shift();
                        assert(seg != null);
                        fixedRoot = joinGlobs([fixedRoot, seg], globOptions);
                    }
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, , 5]);
                    _b = { filename: fixedRoot };
                    return [4 /*yield*/, __await(stat(fixedRoot))];
                case 2:
                    fixedRootInfo = (_b.info = _g.sent(), _b);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _g.sent();
                    return [4 /*yield*/, __await(throwUnlessNotFound(error_1))];
                case 4: return [2 /*return*/, _g.sent()];
                case 5:
                    currentMatches = [fixedRootInfo];
                    _i = 0, segments_1 = segments;
                    _g.label = 6;
                case 6:
                    if (!(_i < segments_1.length)) return [3 /*break*/, 22];
                    segment = segments_1[_i];
                    nextMatchMap = new Map();
                    _c = 0, currentMatches_1 = currentMatches;
                    _g.label = 7;
                case 7:
                    if (!(_c < currentMatches_1.length)) return [3 /*break*/, 20];
                    currentMatch = currentMatches_1[_c];
                    _g.label = 8;
                case 8:
                    _g.trys.push([8, 13, 14, 19]);
                    _d = __asyncValues(advanceMatch(currentMatch, segment));
                    _g.label = 9;
                case 9: return [4 /*yield*/, __await(_d.next())];
                case 10:
                    if (!(_e = _g.sent(), !_e.done)) return [3 /*break*/, 12];
                    nextMatch = _e.value;
                    nextMatchMap.set(nextMatch.filename, nextMatch.info);
                    _g.label = 11;
                case 11: return [3 /*break*/, 9];
                case 12: return [3 /*break*/, 19];
                case 13:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 19];
                case 14:
                    _g.trys.push([14, , 17, 18]);
                    if (!(_e && !_e.done && (_f = _d["return"]))) return [3 /*break*/, 16];
                    return [4 /*yield*/, __await(_f.call(_d))];
                case 15:
                    _g.sent();
                    _g.label = 16;
                case 16: return [3 /*break*/, 18];
                case 17:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 18: return [7 /*endfinally*/];
                case 19:
                    _c++;
                    return [3 /*break*/, 7];
                case 20:
                    currentMatches = __spreadArrays(nextMatchMap).sort().map(function (_a) {
                        var filename = _a[0], info = _a[1];
                        return ({
                            filename: filename,
                            info: info
                        });
                    });
                    _g.label = 21;
                case 21:
                    _i++;
                    return [3 /*break*/, 6];
                case 22:
                    if (hasTrailingSep) {
                        currentMatches = currentMatches.filter(function (_a) {
                            var info = _a.info;
                            return info.isDirectory();
                        });
                    }
                    if (!includeDirs) {
                        currentMatches = currentMatches.filter(function (_a) {
                            var info = _a.info;
                            return !info.isDirectory();
                        });
                    }
                    return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(currentMatches)))];
                case 23: return [4 /*yield*/, __await.apply(void 0, [_g.sent()])];
                case 24:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/** Synchronous version of `expandGlob()`. */
export function expandGlobSync(glob, _a) {
    function advanceMatch(walkInfo, globSegment) {
        var parentPath, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!walkInfo.info.isDirectory()) return [3 /*break*/, 1];
                    return [2 /*return*/];
                case 1:
                    if (!(globSegment == "..")) return [3 /*break*/, 7];
                    parentPath = joinGlobs([walkInfo.filename, ".."], globOptions);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    if (!shouldInclude(parentPath)) return [3 /*break*/, 4];
                    return [4 /*yield*/, { filename: parentPath, info: statSync(parentPath) }];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    throwUnlessNotFound(error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
                case 7:
                    if (!(globSegment == "**")) return [3 /*break*/, 9];
                    return [5 /*yield**/, __values(walkSync(walkInfo.filename, {
                            includeFiles: false,
                            skip: excludePatterns
                        }))];
                case 8: return [2 /*return*/, _a.sent()];
                case 9: return [5 /*yield**/, __values(walkSync(walkInfo.filename, {
                        maxDepth: 1,
                        match: [
                            globToRegExp(joinGlobs([walkInfo.filename, globSegment], globOptions), globOptions)
                        ],
                        skip: excludePatterns
                    }))];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }
    var globOptions, absRoot, resolveFromRoot, excludePatterns, shouldInclude, _b, segments, hasTrailingSep, winRoot, fixedRoot, seg, fixedRootInfo, currentMatches, _i, segments_2, segment, nextMatchMap, _c, currentMatches_2, currentMatch, _d, _e, nextMatch;
    var _f = _a === void 0 ? {} : _a, _g = _f.root, root = _g === void 0 ? cwd() : _g, _h = _f.exclude, exclude = _h === void 0 ? [] : _h, _j = _f.includeDirs, includeDirs = _j === void 0 ? true : _j, _k = _f.extended, extended = _k === void 0 ? false : _k, _l = _f.globstar, globstar = _l === void 0 ? false : _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                globOptions = { extended: extended, globstar: globstar };
                absRoot = isAbsolute(root)
                    ? normalize(root)
                    : joinGlobs([cwd(), root], globOptions);
                resolveFromRoot = function (path) {
                    return isAbsolute(path)
                        ? normalize(path)
                        : joinGlobs([absRoot, path], globOptions);
                };
                excludePatterns = exclude
                    .map(resolveFromRoot)
                    .map(function (s) { return globToRegExp(s, globOptions); });
                shouldInclude = function (filename) {
                    return !excludePatterns.some(function (p) { return !!filename.match(p); });
                };
                _b = split(resolveFromRoot(glob)), segments = _b.segments, hasTrailingSep = _b.hasTrailingSep, winRoot = _b.winRoot;
                fixedRoot = winRoot != undefined ? winRoot : "/";
                while (segments.length > 0 && !isGlob(segments[0])) {
                    seg = segments.shift();
                    assert(seg != null);
                    fixedRoot = joinGlobs([fixedRoot, seg], globOptions);
                }
                try {
                    fixedRootInfo = { filename: fixedRoot, info: statSync(fixedRoot) };
                }
                catch (error) {
                    return [2 /*return*/, throwUnlessNotFound(error)];
                }
                currentMatches = [fixedRootInfo];
                for (_i = 0, segments_2 = segments; _i < segments_2.length; _i++) {
                    segment = segments_2[_i];
                    nextMatchMap = new Map();
                    for (_c = 0, currentMatches_2 = currentMatches; _c < currentMatches_2.length; _c++) {
                        currentMatch = currentMatches_2[_c];
                        for (_d = 0, _e = advanceMatch(currentMatch, segment); _d < _e.length; _d++) {
                            nextMatch = _e[_d];
                            nextMatchMap.set(nextMatch.filename, nextMatch.info);
                        }
                    }
                    currentMatches = __spreadArrays(nextMatchMap).sort().map(function (_a) {
                        var filename = _a[0], info = _a[1];
                        return ({
                            filename: filename,
                            info: info
                        });
                    });
                }
                if (hasTrailingSep) {
                    currentMatches = currentMatches.filter(function (_a) {
                        var info = _a.info;
                        return info.isDirectory();
                    });
                }
                if (!includeDirs) {
                    currentMatches = currentMatches.filter(function (_a) {
                        var info = _a.info;
                        return !info.isDirectory();
                    });
                }
                return [5 /*yield**/, __values(currentMatches)];
            case 1:
                _m.sent();
                return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=expand_glob.js.map