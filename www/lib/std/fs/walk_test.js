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
var cwd = Deno.cwd, chdir = Deno.chdir, makeTempDir = Deno.makeTempDir, mkdir = Deno.mkdir, open = Deno.open;
var remove = Deno.remove;
import { walk, walkSync } from "./walk.js";
import { assertEquals, assertThrowsAsync } from "../testing/asserts.js";
export function testWalk(setup, t) {
    return __awaiter(this, void 0, void 0, function () {
        function fn() {
            return __awaiter(this, void 0, void 0, function () {
                var origCwd, d;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            origCwd = cwd();
                            return [4 /*yield*/, makeTempDir()];
                        case 1:
                            d = _a.sent();
                            chdir(d);
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, , 5, 6]);
                            return [4 /*yield*/, setup(d)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, t()];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            chdir(origCwd);
                            remove(d, { recursive: true });
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
        var name;
        return __generator(this, function (_a) {
            name = t.name;
            Deno.test({ name: name, fn: fn });
            return [2 /*return*/];
        });
    });
}
function normalize(_a) {
    var filename = _a.filename;
    return filename.replace(/\\/g, "/");
}
export function walkArray(root, options) {
    if (options === void 0) { options = {}; }
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var arr, _b, _c, w, e_1_1, arrSync;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    arr = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 12]);
                    _b = __asyncValues(walk(root, __assign({}, options)));
                    _e.label = 2;
                case 2: return [4 /*yield*/, _b.next()];
                case 3:
                    if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 5];
                    w = _c.value;
                    arr.push(normalize(w));
                    _e.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _e.trys.push([7, , 10, 11]);
                    if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(_b)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    arr.sort(); // TODO(ry) Remove sort. The order should be deterministic.
                    arrSync = Array.from(walkSync(root, options), normalize);
                    arrSync.sort(); // TODO(ry) Remove sort. The order should be deterministic.
                    assertEquals(arr, arrSync);
                    return [2 /*return*/, arr];
            }
        });
    });
}
export function touch(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(path, "w")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function assertReady(expectedLength) {
    var arr = Array.from(walkSync("."), normalize);
    assertEquals(arr.length, expectedLength);
}
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mkdir(d + "/empty")];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function emptyDir() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, walkArray(".")];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, [".", "empty"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/x")];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function singleFile() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, walkArray(".")];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, [".", "x"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/x")];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function iteratable() {
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function () {
        var count, _i, _b, _, _c, _e, _, e_2_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    count = 0;
                    for (_i = 0, _b = walkSync("."); _i < _b.length; _i++) {
                        _ = _b[_i];
                        count += 1;
                    }
                    assertEquals(count, 2);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 6, 7, 12]);
                    _c = __asyncValues(walk("."));
                    _f.label = 2;
                case 2: return [4 /*yield*/, _c.next()];
                case 3:
                    if (!(_e = _f.sent(), !_e.done)) return [3 /*break*/, 5];
                    _ = _e.value;
                    count += 1;
                    _f.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_2_1 = _f.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _f.trys.push([7, , 10, 11]);
                    if (!(_e && !_e.done && (_a = _c["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(_c)];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    assertEquals(count, 4);
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
                return [4 /*yield*/, touch(d + "/a/x")];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function nestedSingleFile() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, walkArray(".")];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, [".", "a", "a/x"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mkdir(d + "/a/b/c/d", { recursive: true })];
            case 1:
                _a.sent();
                return [4 /*yield*/, touch(d + "/a/b/c/d/x")];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function depth() {
    return __awaiter(this, void 0, void 0, function () {
        var arr3, arr5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(6);
                    return [4 /*yield*/, walkArray(".", { maxDepth: 3 })];
                case 1:
                    arr3 = _a.sent();
                    assertEquals(arr3, [".", "a", "a/b", "a/b/c"]);
                    return [4 /*yield*/, walkArray(".", { maxDepth: 5 })];
                case 2:
                    arr5 = _a.sent();
                    assertEquals(arr5, [".", "a", "a/b", "a/b/c", "a/b/c/d", "a/b/c/d/x"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/a")];
            case 1:
                _a.sent();
                return [4 /*yield*/, mkdir(d + "/b")];
            case 2:
                _a.sent();
                return [4 /*yield*/, touch(d + "/b/c")];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function includeDirs() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(4);
                    return [4 /*yield*/, walkArray(".", { includeDirs: false })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, ["a", "b/c"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/a")];
            case 1:
                _a.sent();
                return [4 /*yield*/, mkdir(d + "/b")];
            case 2:
                _a.sent();
                return [4 /*yield*/, touch(d + "/b/c")];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function includeFiles() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(4);
                    return [4 /*yield*/, walkArray(".", { includeFiles: false })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, [".", "b"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/x.js")];
            case 1:
                _a.sent();
                return [4 /*yield*/, touch(d + "/y.rs")];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function ext() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(3);
                    return [4 /*yield*/, walkArray(".", { exts: [".js"] })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, ["x.js"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/x.js")];
            case 1:
                _a.sent();
                return [4 /*yield*/, touch(d + "/y.rs")];
            case 2:
                _a.sent();
                return [4 /*yield*/, touch(d + "/z.py")];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function extAny() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(4);
                    return [4 /*yield*/, walkArray(".", { exts: [".rs", ".js"] })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, ["x.js", "y.rs"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/x")];
            case 1:
                _a.sent();
                return [4 /*yield*/, touch(d + "/y")];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function match() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(3);
                    return [4 /*yield*/, walkArray(".", { match: [/x/] })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, ["x"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/x")];
            case 1:
                _a.sent();
                return [4 /*yield*/, touch(d + "/y")];
            case 2:
                _a.sent();
                return [4 /*yield*/, touch(d + "/z")];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function matchAny() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(4);
                    return [4 /*yield*/, walkArray(".", { match: [/x/, /y/] })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, ["x", "y"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/x")];
            case 1:
                _a.sent();
                return [4 /*yield*/, touch(d + "/y")];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function skip() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(3);
                    return [4 /*yield*/, walkArray(".", { skip: [/x/] })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, [".", "y"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (d) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, touch(d + "/x")];
            case 1:
                _a.sent();
                return [4 /*yield*/, touch(d + "/y")];
            case 2:
                _a.sent();
                return [4 /*yield*/, touch(d + "/z")];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function skipAny() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(4);
                    return [4 /*yield*/, walkArray(".", { skip: [/x/, /y/] })];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, [".", "z"]);
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
                return [4 /*yield*/, mkdir(d + "/b")];
            case 2:
                _a.sent();
                return [4 /*yield*/, touch(d + "/a/x")];
            case 3:
                _a.sent();
                return [4 /*yield*/, touch(d + "/a/y")];
            case 4:
                _a.sent();
                return [4 /*yield*/, touch(d + "/b/z")];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }, function subDir() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertReady(6);
                    return [4 /*yield*/, walkArray("b")];
                case 1:
                    arr = _a.sent();
                    assertEquals(arr, ["b", "b/z"]);
                    return [2 /*return*/];
            }
        });
    });
});
testWalk(function (_d) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); }, function nonexistentRoot() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, walkArray("nonexistent")];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, Deno.errors.NotFound)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
/* TODO(ry) Re-enable followSymlinks
testWalk(
  async (d: string): Promise<void> => {
    await mkdir(d + "/a");
    await mkdir(d + "/b");
    await touch(d + "/a/x");
    await touch(d + "/a/y");
    await touch(d + "/b/z");
    try {
      await symlink(d + "/b", d + "/a/bb");
    } catch (err) {
      assert(isWindows);
      assert(err.message, "Not implemented");
    }
  },
  async function symlink(): Promise<void> {
    // symlink is not yet implemented on Windows.
    if (isWindows) {
      return;
    }

    assertReady(6);
    const files = await walkArray("a");
    assertEquals(files.length, 2);
    assert(!files.includes("a/bb/z"));

    const arr = await walkArray("a", { followSymlinks: true });
    assertEquals(arr.length, 3);
    assert(arr.some((f): boolean => f.endsWith("/b/z")));
  }
);
*/
//# sourceMappingURL=walk_test.js.map
