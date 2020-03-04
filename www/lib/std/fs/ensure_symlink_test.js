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
// TODO(axetroy): Add test for Windows once symlink is implemented for Windows.
import { assertEquals, assertThrows, assertThrowsAsync } from "../testing/asserts.js";
import * as path from "../path/mod.js";
import { ensureSymlink, ensureSymlinkSync } from "./ensure_symlink.js";
var testdataDir = path.resolve("fs", "testdata");
var isWindows = Deno.build.os === "win";
Deno.test(function ensureSymlinkIfItNotExist() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir, testFile;
        var _this = this;
        return __generator(this, function (_a) {
            testDir = path.join(testdataDir, "link_file_1");
            testFile = path.join(testDir, "test.txt");
            assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ensureSymlink(testFile, path.join(testDir, "test1.txt"))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Deno.stat(testFile).then(function () {
                                throw new Error("test file should exists.");
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
});
Deno.test(function ensureSymlinkSyncIfItNotExist() {
    var testDir = path.join(testdataDir, "link_file_2");
    var testFile = path.join(testDir, "test.txt");
    assertThrows(function () {
        ensureSymlinkSync(testFile, path.join(testDir, "test1.txt"));
    });
    assertThrows(function () {
        Deno.statSync(testFile);
        throw new Error("test file should exists.");
    });
});
Deno.test(function ensureSymlinkIfItExist() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir, testFile, linkFile, srcStat, linkStat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testDir = path.join(testdataDir, "link_file_3");
                    testFile = path.join(testDir, "test.txt");
                    linkFile = path.join(testDir, "link.txt");
                    return [4 /*yield*/, Deno.mkdir(testDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Deno.writeFile(testFile, new Uint8Array())];
                case 2:
                    _a.sent();
                    if (!isWindows) return [3 /*break*/, 5];
                    return [4 /*yield*/, assertThrowsAsync(function () { return ensureSymlink(testFile, linkFile); }, Error, "Not implemented")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, Deno.remove(testDir, { recursive: true })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, ensureSymlink(testFile, linkFile)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [4 /*yield*/, Deno.lstat(testFile)];
                case 8:
                    srcStat = _a.sent();
                    return [4 /*yield*/, Deno.lstat(linkFile)];
                case 9:
                    linkStat = _a.sent();
                    assertEquals(srcStat.isFile(), true);
                    assertEquals(linkStat.isSymlink(), true);
                    return [4 /*yield*/, Deno.remove(testDir, { recursive: true })];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function ensureSymlinkSyncIfItExist() {
    var testDir = path.join(testdataDir, "link_file_4");
    var testFile = path.join(testDir, "test.txt");
    var linkFile = path.join(testDir, "link.txt");
    Deno.mkdirSync(testDir, { recursive: true });
    Deno.writeFileSync(testFile, new Uint8Array());
    if (isWindows) {
        assertThrows(function () { return ensureSymlinkSync(testFile, linkFile); }, Error, "Not implemented");
        Deno.removeSync(testDir, { recursive: true });
        return;
    }
    else {
        ensureSymlinkSync(testFile, linkFile);
    }
    var srcStat = Deno.lstatSync(testFile);
    var linkStat = Deno.lstatSync(linkFile);
    assertEquals(srcStat.isFile(), true);
    assertEquals(linkStat.isSymlink(), true);
    Deno.removeSync(testDir, { recursive: true });
});
Deno.test(function ensureSymlinkDirectoryIfItExist() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir, linkDir, testFile, testDirStat, linkDirStat, testFileStat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testDir = path.join(testdataDir, "link_file_origin_3");
                    linkDir = path.join(testdataDir, "link_file_link_3");
                    testFile = path.join(testDir, "test.txt");
                    return [4 /*yield*/, Deno.mkdir(testDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Deno.writeFile(testFile, new Uint8Array())];
                case 2:
                    _a.sent();
                    if (!isWindows) return [3 /*break*/, 5];
                    return [4 /*yield*/, assertThrowsAsync(function () { return ensureSymlink(testDir, linkDir); }, Error, "Not implemented")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, Deno.remove(testDir, { recursive: true })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, ensureSymlink(testDir, linkDir)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [4 /*yield*/, Deno.lstat(testDir)];
                case 8:
                    testDirStat = _a.sent();
                    return [4 /*yield*/, Deno.lstat(linkDir)];
                case 9:
                    linkDirStat = _a.sent();
                    return [4 /*yield*/, Deno.lstat(testFile)];
                case 10:
                    testFileStat = _a.sent();
                    assertEquals(testFileStat.isFile(), true);
                    assertEquals(testDirStat.isDirectory(), true);
                    assertEquals(linkDirStat.isSymlink(), true);
                    return [4 /*yield*/, Deno.remove(linkDir, { recursive: true })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, Deno.remove(testDir, { recursive: true })];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function ensureSymlinkSyncDirectoryIfItExist() {
    var testDir = path.join(testdataDir, "link_file_origin_3");
    var linkDir = path.join(testdataDir, "link_file_link_3");
    var testFile = path.join(testDir, "test.txt");
    Deno.mkdirSync(testDir, { recursive: true });
    Deno.writeFileSync(testFile, new Uint8Array());
    if (isWindows) {
        assertThrows(function () { return ensureSymlinkSync(testDir, linkDir); }, Error, "Not implemented");
        Deno.removeSync(testDir, { recursive: true });
        return;
    }
    else {
        ensureSymlinkSync(testDir, linkDir);
    }
    var testDirStat = Deno.lstatSync(testDir);
    var linkDirStat = Deno.lstatSync(linkDir);
    var testFileStat = Deno.lstatSync(testFile);
    assertEquals(testFileStat.isFile(), true);
    assertEquals(testDirStat.isDirectory(), true);
    assertEquals(linkDirStat.isSymlink(), true);
    Deno.removeSync(linkDir, { recursive: true });
    Deno.removeSync(testDir, { recursive: true });
});
//# sourceMappingURL=ensure_symlink_test.js.map
