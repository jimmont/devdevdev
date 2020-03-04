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
var mkdir = Deno.mkdir, test = Deno.test;
import { assert, assertEquals } from "../testing/asserts.ts";
import { testWalk, touch, walkArray } from "../fs/walk_test.ts";
import { globToRegExp, isGlob, joinGlobs, normalizeGlob } from "./glob.ts";
import { SEP, join } from "./mod.ts";
test({
    name: "glob: glob to regex",
    fn: function () {
        assertEquals(globToRegExp("unicorn.*") instanceof RegExp, true);
        assertEquals(globToRegExp("unicorn.*").test("poney.ts"), false);
        assertEquals(globToRegExp("unicorn.*").test("unicorn.py"), true);
        assertEquals(globToRegExp("*.ts").test("poney.ts"), true);
        assertEquals(globToRegExp("*.ts").test("unicorn.js"), false);
        assertEquals(globToRegExp(join("unicorn", "**", "cathedral.ts")).test(join("unicorn", "in", "the", "cathedral.ts")), true);
        assertEquals(globToRegExp(join("unicorn", "**", "cathedral.ts")).test(join("unicorn", "in", "the", "kitchen.ts")), false);
        assertEquals(globToRegExp(join("unicorn", "**", "bathroom.*")).test(join("unicorn", "sleeping", "in", "bathroom.py")), true);
        assertEquals(globToRegExp(join("unicorn", "!(sleeping)", "bathroom.ts"), {
            extended: true
        }).test(join("unicorn", "flying", "bathroom.ts")), true);
        assertEquals(globToRegExp(join("unicorn", "(!sleeping)", "bathroom.ts"), {
            extended: true
        }).test(join("unicorn", "sleeping", "bathroom.ts")), false);
    }
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mkdir(d + "/a")];
            case 1:
                _a.sent();
                return [4 /*yield*/, mkdir(d + "/b")];
            case 2:
                _a.sent();
                return [4 /*yield*/, touch(d + "/a/x.ts")];
            case 3:
                _a.sent();
                return [4 /*yield*/, touch(d + "/b/z.ts")];
            case 4:
                _a.sent();
                return [4 /*yield*/, touch(d + "/b/z.js")];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function globInWalkWildcard() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, walkArray(".", {
                        match: [globToRegExp(join("*", "*.ts"))]
                    })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr.length, 2);
                    assertEquals(arr[0], "a/x.ts");
                    assertEquals(arr[1], "b/z.ts");
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mkdir(d + "/a")];
            case 1:
                _a.sent();
                return [4 /*yield*/, mkdir(d + "/a/yo")];
            case 2:
                _a.sent();
                return [4 /*yield*/, touch(d + "/a/yo/x.ts")];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function globInWalkFolderWildcard() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, walkArray(".", {
                        match: [
                            globToRegExp(join("a", "**", "*.ts"), {
                                flags: "g",
                                globstar: true
                            })
                        ]
                    })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr.length, 1);
                    assertEquals(arr[0], "a/yo/x.ts");
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mkdir(d + "/a")];
            case 1:
                _a.sent();
                return [4 /*yield*/, mkdir(d + "/a/unicorn")];
            case 2:
                _a.sent();
                return [4 /*yield*/, mkdir(d + "/a/deno")];
            case 3:
                _a.sent();
                return [4 /*yield*/, mkdir(d + "/a/raptor")];
            case 4:
                _a.sent();
                return [4 /*yield*/, touch(d + "/a/raptor/x.ts")];
            case 5:
                _a.sent();
                return [4 /*yield*/, touch(d + "/a/deno/x.ts")];
            case 6:
                _a.sent();
                return [4 /*yield*/, touch(d + "/a/unicorn/x.ts")];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function globInWalkFolderExtended() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, walkArray(".", {
                        match: [
                            globToRegExp(join("a", "+(raptor|deno)", "*.ts"), {
                                flags: "g",
                                extended: true
                            })
                        ]
                    })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr.length, 2);
                    assertEquals(arr[0], "a/deno/x.ts");
                    assertEquals(arr[1], "a/raptor/x.ts");
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/x.ts")];
            case 1:
                _a.sent();
                return [4 /*yield*/, touch(d + "/x.js")];
            case 2:
                _a.sent();
                return [4 /*yield*/, touch(d + "/b.js")];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function globInWalkWildcardExtension() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, walkArray(".", {
                        match: [globToRegExp("x.*", { flags: "g", globstar: true })]
                    })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr.length, 2);
                    assertEquals(arr[0], "x.js");
                    assertEquals(arr[1], "x.ts");
                    return [2 /*return*/];
            }
        });
    });
});
test({
    name: "isGlob: pattern to test",
    fn: function () {
        // should be true if valid glob pattern
        assert(isGlob("!foo.js"));
        assert(isGlob("*.js"));
        assert(isGlob("!*.js"));
        assert(isGlob("!foo"));
        assert(isGlob("!foo.js"));
        assert(isGlob("**/abc.js"));
        assert(isGlob("abc/*.js"));
        assert(isGlob("@.(?:abc)"));
        assert(isGlob("@.(?!abc)"));
        // should be false if invalid glob pattern
        assert(!isGlob(""));
        assert(!isGlob("~/abc"));
        assert(!isGlob("~/abc"));
        assert(!isGlob("~/(abc)"));
        assert(!isGlob("+~(abc)"));
        assert(!isGlob("."));
        assert(!isGlob("@.(abc)"));
        assert(!isGlob("aa"));
        assert(!isGlob("who?"));
        assert(!isGlob("why!?"));
        assert(!isGlob("where???"));
        assert(!isGlob("abc!/def/!ghi.js"));
        assert(!isGlob("abc.js"));
        assert(!isGlob("abc/def/!ghi.js"));
        assert(!isGlob("abc/def/ghi.js"));
        // Should be true if path has regex capture group
        assert(isGlob("abc/(?!foo).js"));
        assert(isGlob("abc/(?:foo).js"));
        assert(isGlob("abc/(?=foo).js"));
        assert(isGlob("abc/(a|b).js"));
        assert(isGlob("abc/(a|b|c).js"));
        assert(isGlob("abc/(foo bar)/*.js"));
        // Should be false if the path has parens but is not a valid capture group
        assert(!isGlob("abc/(?foo).js"));
        assert(!isGlob("abc/(a b c).js"));
        assert(!isGlob("abc/(ab).js"));
        assert(!isGlob("abc/(abc).js"));
        assert(!isGlob("abc/(foo bar).js"));
        // should be false if the capture group is imbalanced
        assert(!isGlob("abc/(?ab.js"));
        assert(!isGlob("abc/(ab.js"));
        assert(!isGlob("abc/(a|b.js"));
        assert(!isGlob("abc/(a|b|c.js"));
        // should be true if the path has a regex character class
        assert(isGlob("abc/[abc].js"));
        assert(isGlob("abc/[^abc].js"));
        assert(isGlob("abc/[1-3].js"));
        // should be false if the character class is not balanced
        assert(!isGlob("abc/[abc.js"));
        assert(!isGlob("abc/[^abc.js"));
        assert(!isGlob("abc/[1-3.js"));
        // should be false if the character class is escaped
        assert(!isGlob("abc/\\[abc].js"));
        assert(!isGlob("abc/\\[^abc].js"));
        assert(!isGlob("abc/\\[1-3].js"));
        // should be true if the path has brace characters
        assert(isGlob("abc/{a,b}.js"));
        assert(isGlob("abc/{a..z}.js"));
        assert(isGlob("abc/{a..z..2}.js"));
        // should be false if (basic) braces are not balanced
        assert(!isGlob("abc/\\{a,b}.js"));
        assert(!isGlob("abc/\\{a..z}.js"));
        assert(!isGlob("abc/\\{a..z..2}.js"));
        // should be true if the path has regex characters
        assert(isGlob("!&(abc)"));
        assert(isGlob("!*.js"));
        assert(isGlob("!foo"));
        assert(isGlob("!foo.js"));
        assert(isGlob("**/abc.js"));
        assert(isGlob("*.js"));
        assert(isGlob("*z(abc)"));
        assert(isGlob("[1-10].js"));
        assert(isGlob("[^abc].js"));
        assert(isGlob("[a-j]*[^c]b/c"));
        assert(isGlob("[abc].js"));
        assert(isGlob("a/b/c/[a-z].js"));
        assert(isGlob("abc/(aaa|bbb).js"));
        assert(isGlob("abc/*.js"));
        assert(isGlob("abc/{a,b}.js"));
        assert(isGlob("abc/{a..z..2}.js"));
        assert(isGlob("abc/{a..z}.js"));
        assert(!isGlob("$(abc)"));
        assert(!isGlob("&(abc)"));
        assert(!isGlob("Who?.js"));
        assert(!isGlob("? (abc)"));
        assert(!isGlob("?.js"));
        assert(!isGlob("abc/?.js"));
        // should be false if regex characters are escaped
        assert(!isGlob("\\?.js"));
        assert(!isGlob("\\[1-10\\].js"));
        assert(!isGlob("\\[^abc\\].js"));
        assert(!isGlob("\\[a-j\\]\\*\\[^c\\]b/c"));
        assert(!isGlob("\\[abc\\].js"));
        assert(!isGlob("\\a/b/c/\\[a-z\\].js"));
        assert(!isGlob("abc/\\(aaa|bbb).js"));
        assert(!isGlob("abc/\\?.js"));
    }
});
test(function normalizeGlobGlobstar() {
    assertEquals(normalizeGlob("**" + SEP + "..", { globstar: true }), "**" + SEP + "..");
});
test(function joinGlobsGlobstar() {
    assertEquals(joinGlobs(["**", ".."], { globstar: true }), "**" + SEP + "..");
});
//# sourceMappingURL=glob_test.js.map