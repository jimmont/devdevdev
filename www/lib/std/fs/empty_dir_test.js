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
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assert, assertEquals, assertStrContains, assertThrows, assertThrowsAsync } from "../testing/asserts.js";
import * as path from "../path/mod.js";
import { emptyDir, emptyDirSync } from "./empty_dir.js";
var testdataDir = path.resolve("fs", "testdata");
Deno.test(function emptyDirIfItNotExist() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir, testNestDir, stat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testDir = path.join(testdataDir, "empty_dir_test_1");
                    testNestDir = path.join(testDir, "nest");
                    // empty a dir which not exist. then it will create new one
                    return [4 /*yield*/, emptyDir(testNestDir)];
                case 1:
                    // empty a dir which not exist. then it will create new one
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, Deno.stat(testNestDir)];
                case 3:
                    stat = _a.sent();
                    assertEquals(stat.isDirectory(), true);
                    return [3 /*break*/, 5];
                case 4:
                    // remove the test dir
                    Deno.remove(testDir, { recursive: true });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
});
Deno.test(function emptyDirSyncIfItNotExist() {
    var testDir = path.join(testdataDir, "empty_dir_test_2");
    var testNestDir = path.join(testDir, "nest");
    // empty a dir which not exist. then it will create new one
    emptyDirSync(testNestDir);
    try {
        // check the dir
        var stat = Deno.statSync(testNestDir);
        assertEquals(stat.isDirectory(), true);
    }
    finally {
        // remove the test dir
        Deno.remove(testDir, { recursive: true });
    }
});
Deno.test(function emptyDirIfItExist() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir, testNestDir, testDirFile, beforeFileStat, beforeDirStat, stat;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testDir = path.join(testdataDir, "empty_dir_test_3");
                    testNestDir = path.join(testDir, "nest");
                    // create test dir
                    return [4 /*yield*/, emptyDir(testNestDir)];
                case 1:
                    // create test dir
                    _a.sent();
                    testDirFile = path.join(testNestDir, "test.js");
                    // create test file in test dir
                    return [4 /*yield*/, Deno.writeFile(testDirFile, new Uint8Array())];
                case 2:
                    // create test file in test dir
                    _a.sent();
                    return [4 /*yield*/, Deno.stat(testDirFile)];
                case 3:
                    beforeFileStat = _a.sent();
                    assertEquals(beforeFileStat.isFile(), true);
                    return [4 /*yield*/, Deno.stat(testNestDir)];
                case 4:
                    beforeDirStat = _a.sent();
                    assertEquals(beforeDirStat.isDirectory(), true);
                    return [4 /*yield*/, emptyDir(testDir)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, , 10, 12]);
                    return [4 /*yield*/, Deno.stat(testDir)];
                case 7:
                    stat = _a.sent();
                    assertEquals(stat.isDirectory(), true);
                    // nest directory have been remove
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Deno.stat(testNestDir)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 8:
                    // nest directory have been remove
                    _a.sent();
                    // test file have been remove
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Deno.stat(testDirFile)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 9:
                    // test file have been remove
                    _a.sent();
                    return [3 /*break*/, 12];
                case 10: 
                // remote test dir
                return [4 /*yield*/, Deno.remove(testDir, { recursive: true })];
                case 11:
                    // remote test dir
                    _a.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
});
Deno.test(function emptyDirSyncIfItExist() {
    var testDir = path.join(testdataDir, "empty_dir_test_4");
    var testNestDir = path.join(testDir, "nest");
    // create test dir
    emptyDirSync(testNestDir);
    var testDirFile = path.join(testNestDir, "test.js");
    // create test file in test dir
    Deno.writeFileSync(testDirFile, new Uint8Array());
    // before empty: make sure file/directory exist
    var beforeFileStat = Deno.statSync(testDirFile);
    assertEquals(beforeFileStat.isFile(), true);
    var beforeDirStat = Deno.statSync(testNestDir);
    assertEquals(beforeDirStat.isDirectory(), true);
    emptyDirSync(testDir);
    // after empty: file/directory have already remove
    try {
        // test dir still there
        var stat = Deno.statSync(testDir);
        assertEquals(stat.isDirectory(), true);
        // nest directory have been remove
        assertThrows(function () {
            Deno.statSync(testNestDir);
        });
        // test file have been remove
        assertThrows(function () {
            Deno.statSync(testDirFile);
        });
    }
    finally {
        // remote test dir
        Deno.removeSync(testDir, { recursive: true });
    }
});
var scenes = [
    // 1
    {
        read: false,
        write: false,
        async: true,
        output: "run again with the --allow-read flag"
    },
    {
        read: false,
        write: false,
        async: false,
        output: "run again with the --allow-read flag"
    },
    // 2
    {
        read: true,
        write: false,
        async: true,
        output: "run again with the --allow-write flag"
    },
    {
        read: true,
        write: false,
        async: false,
        output: "run again with the --allow-write flag"
    },
    // 3
    {
        read: false,
        write: true,
        async: true,
        output: "run again with the --allow-read flag"
    },
    {
        read: false,
        write: true,
        async: false,
        output: "run again with the --allow-read flag"
    },
    // 4
    {
        read: true,
        write: true,
        async: true,
        output: "success"
    },
    {
        read: true,
        write: true,
        async: false,
        output: "success"
    }
];
var _loop_1 = function (s) {
    var title = "test " + (s.async ? "emptyDir" : "emptyDirSync");
    title += "(\"testdata/testfolder\") " + (s.read ? "with" : "without");
    title += " --allow-read & " + (s.write ? "with" : "without") + " --allow-write";
    Deno.test("[fs] emptyDirPermission " + title, function () {
        return __awaiter(this, void 0, void 0, function () {
            var testfolder, args, stdout, output, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testfolder = path.join(testdataDir, "testfolder");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 9, 11]);
                        return [4 /*yield*/, Deno.mkdir(testfolder)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Deno.writeFile(path.join(testfolder, "child.txt"), new TextEncoder().encode("hello world"))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 8]);
                        args = [Deno.execPath(), "run"];
                        if (s.read) {
                            args.push("--allow-read");
                        }
                        if (s.write) {
                            args.push("--allow-write");
                        }
                        args.push(path.join(testdataDir, s.async ? "empty_dir.js" : "empty_dir_sync.js"));
                        args.push("testfolder");
                        stdout = Deno.run({
                            stdout: "piped",
                            cwd: testdataDir,
                            args: args
                        }).stdout;
                        assert(stdout);
                        return [4 /*yield*/, Deno.readAll(stdout)];
                    case 5:
                        output = _a.sent();
                        assertStrContains(new TextDecoder().decode(output), s.output);
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        return [4 /*yield*/, Deno.remove(testfolder, { recursive: true })];
                    case 7:
                        _a.sent();
                        throw err_1;
                    case 8: return [3 /*break*/, 11];
                    case 9: 
                    // Make the test rerunnable
                    // Otherwise would throw error due to mkdir fail.
                    return [4 /*yield*/, Deno.remove(testfolder, { recursive: true })];
                    case 10:
                        // Make the test rerunnable
                        // Otherwise would throw error due to mkdir fail.
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    });
};
for (var _i = 0, scenes_1 = scenes; _i < scenes_1.length; _i++) {
    var s = scenes_1[_i];
    _loop_1(s);
}
//# sourceMappingURL=empty_dir_test.js.map
