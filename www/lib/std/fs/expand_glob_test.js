var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var cwd = Deno.cwd, execPath = Deno.execPath, run = Deno.run;
import { decode } from "../strings/mod.ts";
import { assert, assertEquals, assertStrContains } from "../testing/asserts.ts";
import { isWindows, join, joinGlobs, normalize, relative } from "../path/mod.ts";
import { expandGlob, expandGlobSync } from "./expand_glob.ts";
function expandGlobArray(globString, options) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var paths, _b, _c, filename, e_1_1, pathsSync, root, _i, paths_1, path, relativePaths;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    paths = [];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 12]);
                    _b = __asyncValues(expandGlob(globString, options));
                    _d.label = 2;
                case 2: return [4 /*yield*/, _b.next()];
                case 3:
                    if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                    filename = _c.value.filename;
                    paths.push(filename);
                    _d.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _d.trys.push([7, , 10, 11]);
                    if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(_b)];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    paths.sort();
                    pathsSync = __spreadArrays(expandGlobSync(globString, options)).map(function (_a) {
                        var filename = _a.filename;
                        return filename;
                    });
                    pathsSync.sort();
                    assertEquals(paths, pathsSync);
                    root = normalize(options.root || cwd());
                    for (_i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                        path = paths_1[_i];
                        assert(path.startsWith(root));
                    }
                    relativePaths = paths.map(function (path) { return relative(root, path) || "."; });
                    relativePaths.sort();
                    return [2 /*return*/, relativePaths];
            }
        });
    });
}
function urlToFilePath(url) {
    // Since `new URL('file:///C:/a').pathname` is `/C:/a`, remove leading slash.
    return url.pathname.slice(url.protocol == "file:" && isWindows ? 1 : 0);
}
var EG_OPTIONS = {
    root: urlToFilePath(new URL(join("testdata", "glob"), import.meta.url)),
    includeDirs: true,
    extended: false,
    globstar: false
};
Deno.test(function expandGlobWildcard() {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = EG_OPTIONS;
                    _a = assertEquals;
                    return [4 /*yield*/, expandGlobArray("*", options)];
                case 1:
                    _a.apply(void 0, [_b.sent(), [
                            "abc",
                            "abcdef",
                            "abcdefghi",
                            "subdir"
                        ]]);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function expandGlobTrailingSeparator() {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = EG_OPTIONS;
                    _a = assertEquals;
                    return [4 /*yield*/, expandGlobArray("*/", options)];
                case 1:
                    _a.apply(void 0, [_b.sent(), ["subdir"]]);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function expandGlobParent() {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = EG_OPTIONS;
                    _a = assertEquals;
                    return [4 /*yield*/, expandGlobArray("subdir/../*", options)];
                case 1:
                    _a.apply(void 0, [_b.sent(), [
                            "abc",
                            "abcdef",
                            "abcdefghi",
                            "subdir"
                        ]]);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function expandGlobExt() {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    options = __assign(__assign({}, EG_OPTIONS), { extended: true });
                    _a = assertEquals;
                    return [4 /*yield*/, expandGlobArray("abc?(def|ghi)", options)];
                case 1:
                    _a.apply(void 0, [_g.sent(), [
                            "abc",
                            "abcdef"
                        ]]);
                    _b = assertEquals;
                    return [4 /*yield*/, expandGlobArray("abc*(def|ghi)", options)];
                case 2:
                    _b.apply(void 0, [_g.sent(), [
                            "abc",
                            "abcdef",
                            "abcdefghi"
                        ]]);
                    _c = assertEquals;
                    return [4 /*yield*/, expandGlobArray("abc+(def|ghi)", options)];
                case 3:
                    _c.apply(void 0, [_g.sent(), [
                            "abcdef",
                            "abcdefghi"
                        ]]);
                    _d = assertEquals;
                    return [4 /*yield*/, expandGlobArray("abc@(def|ghi)", options)];
                case 4:
                    _d.apply(void 0, [_g.sent(), ["abcdef"]]);
                    _e = assertEquals;
                    return [4 /*yield*/, expandGlobArray("abc{def,ghi}", options)];
                case 5:
                    _e.apply(void 0, [_g.sent(), ["abcdef"]]);
                    _f = assertEquals;
                    return [4 /*yield*/, expandGlobArray("abc!(def|ghi)", options)];
                case 6:
                    _f.apply(void 0, [_g.sent(), ["abc"]]);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function expandGlobGlobstar() {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = __assign(__assign({}, EG_OPTIONS), { globstar: true });
                    _a = assertEquals;
                    return [4 /*yield*/, expandGlobArray(joinGlobs(["**", "abc"], options), options)];
                case 1:
                    _a.apply(void 0, [_b.sent(),
                        ["abc", join("subdir", "abc")]]);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function expandGlobGlobstarParent() {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = __assign(__assign({}, EG_OPTIONS), { globstar: true });
                    _a = assertEquals;
                    return [4 /*yield*/, expandGlobArray(joinGlobs(["subdir", "**", ".."], options), options)];
                case 1:
                    _a.apply(void 0, [_b.sent(),
                        ["."]]);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function expandGlobIncludeDirs() {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = __assign(__assign({}, EG_OPTIONS), { includeDirs: false });
                    _a = assertEquals;
                    return [4 /*yield*/, expandGlobArray("subdir", options)];
                case 1:
                    _a.apply(void 0, [_b.sent(), []]);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function expandGlobPermError() {
    return __awaiter(this, void 0, void 0, function () {
        var exampleUrl, p, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    exampleUrl = new URL("testdata/expand_wildcard.js", import.meta.url);
                    p = run({
                        args: [execPath(), exampleUrl.toString()],
                        stdin: "null",
                        stdout: "piped",
                        stderr: "piped"
                    });
                    _a = assertEquals;
                    return [4 /*yield*/, p.status()];
                case 1:
                    _a.apply(void 0, [_f.sent(), { code: 1, success: false }]);
                    _b = assertEquals;
                    _c = decode;
                    return [4 /*yield*/, p.output()];
                case 2:
                    _b.apply(void 0, [_c.apply(void 0, [_f.sent()]), ""]);
                    _d = assertStrContains;
                    _e = decode;
                    return [4 /*yield*/, p.stderrOutput()];
                case 3:
                    _d.apply(void 0, [_e.apply(void 0, [_f.sent()]),
                        "Uncaught PermissionDenied"]);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=expand_glob_test.js.map