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
import { assertEquals, assertThrows, assertThrowsAsync } from "../testing/asserts.ts";
import * as path from "../path/mod.ts";
import { ensureLink, ensureLinkSync } from "./ensure_link.ts";
var testdataDir = path.resolve("fs", "testdata");
Deno.test(function ensureLinkIfItNotExist() {
    return __awaiter(this, void 0, void 0, function () {
        var srcDir, destDir, testFile, linkFile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    srcDir = path.join(testdataDir, "ensure_link_1");
                    destDir = path.join(testdataDir, "ensure_link_1_2");
                    testFile = path.join(srcDir, "test.txt");
                    linkFile = path.join(destDir, "link.txt");
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ensureLink(testFile, linkFile)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Deno.remove(destDir, { recursive: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function ensureLinkSyncIfItNotExist() {
    var testDir = path.join(testdataDir, "ensure_link_2");
    var testFile = path.join(testDir, "test.txt");
    var linkFile = path.join(testDir, "link.txt");
    assertThrows(function () {
        ensureLinkSync(testFile, linkFile);
    });
    Deno.removeSync(testDir, { recursive: true });
});
Deno.test(function ensureLinkIfItExist() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir, testFile, linkFile, srcStat, linkStat, testFileContent1, _a, _b, linkFileContent1, _c, _d, testFileContent2, _e, _f, linkFileContent2, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    testDir = path.join(testdataDir, "ensure_link_3");
                    testFile = path.join(testDir, "test.txt");
                    linkFile = path.join(testDir, "link.txt");
                    return [4 /*yield*/, Deno.mkdir(testDir, { recursive: true })];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, Deno.writeFile(testFile, new Uint8Array())];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, ensureLink(testFile, linkFile)];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, Deno.lstat(testFile)];
                case 4:
                    srcStat = _j.sent();
                    return [4 /*yield*/, Deno.lstat(linkFile)];
                case 5:
                    linkStat = _j.sent();
                    assertEquals(srcStat.isFile(), true);
                    assertEquals(linkStat.isFile(), true);
                    // har link success. try to change one of them. they should be change both.
                    // let's change origin file.
                    return [4 /*yield*/, Deno.writeFile(testFile, new TextEncoder().encode("123"))];
                case 6:
                    // har link success. try to change one of them. they should be change both.
                    // let's change origin file.
                    _j.sent();
                    _b = (_a = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile(testFile)];
                case 7:
                    testFileContent1 = _b.apply(_a, [_j.sent()]);
                    _d = (_c = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile(testFile)];
                case 8:
                    linkFileContent1 = _d.apply(_c, [_j.sent()]);
                    assertEquals(testFileContent1, "123");
                    assertEquals(testFileContent1, linkFileContent1);
                    // let's change link file.
                    return [4 /*yield*/, Deno.writeFile(testFile, new TextEncoder().encode("abc"))];
                case 9:
                    // let's change link file.
                    _j.sent();
                    _f = (_e = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile(testFile)];
                case 10:
                    testFileContent2 = _f.apply(_e, [_j.sent()]);
                    _h = (_g = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile(testFile)];
                case 11:
                    linkFileContent2 = _h.apply(_g, [_j.sent()]);
                    assertEquals(testFileContent2, "abc");
                    assertEquals(testFileContent2, linkFileContent2);
                    return [4 /*yield*/, Deno.remove(testDir, { recursive: true })];
                case 12:
                    _j.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function ensureLinkSyncIfItExist() {
    var testDir = path.join(testdataDir, "ensure_link_4");
    var testFile = path.join(testDir, "test.txt");
    var linkFile = path.join(testDir, "link.txt");
    Deno.mkdirSync(testDir, { recursive: true });
    Deno.writeFileSync(testFile, new Uint8Array());
    ensureLinkSync(testFile, linkFile);
    var srcStat = Deno.lstatSync(testFile);
    var linkStat = Deno.lstatSync(linkFile);
    assertEquals(srcStat.isFile(), true);
    assertEquals(linkStat.isFile(), true);
    // har link success. try to change one of them. they should be change both.
    // let's change origin file.
    Deno.writeFileSync(testFile, new TextEncoder().encode("123"));
    var testFileContent1 = new TextDecoder().decode(Deno.readFileSync(testFile));
    var linkFileContent1 = new TextDecoder().decode(Deno.readFileSync(testFile));
    assertEquals(testFileContent1, "123");
    assertEquals(testFileContent1, linkFileContent1);
    // let's change link file.
    Deno.writeFileSync(testFile, new TextEncoder().encode("abc"));
    var testFileContent2 = new TextDecoder().decode(Deno.readFileSync(testFile));
    var linkFileContent2 = new TextDecoder().decode(Deno.readFileSync(testFile));
    assertEquals(testFileContent2, "abc");
    assertEquals(testFileContent2, linkFileContent2);
    Deno.removeSync(testDir, { recursive: true });
});
Deno.test(function ensureLinkDirectoryIfItExist() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir, linkDir, testFile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testDir = path.join(testdataDir, "ensure_link_origin_3");
                    linkDir = path.join(testdataDir, "ensure_link_link_3");
                    testFile = path.join(testDir, "test.txt");
                    return [4 /*yield*/, Deno.mkdir(testDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Deno.writeFile(testFile, new Uint8Array())];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ensureLink(testDir, linkDir)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }
                        // "Operation not permitted (os error 1)" // throw an local matching test
                        // "Access is denied. (os error 5)" // throw in CI
                        )];
                case 3:
                    _a.sent();
                    Deno.removeSync(testDir, { recursive: true });
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function ensureLinkSyncDirectoryIfItExist() {
    var testDir = path.join(testdataDir, "ensure_link_origin_3");
    var linkDir = path.join(testdataDir, "ensure_link_link_3");
    var testFile = path.join(testDir, "test.txt");
    Deno.mkdirSync(testDir, { recursive: true });
    Deno.writeFileSync(testFile, new Uint8Array());
    assertThrows(function () {
        ensureLinkSync(testDir, linkDir);
    }
    // "Operation not permitted (os error 1)" // throw an local matching test
    // "Access is denied. (os error 5)" // throw in CI
    );
    Deno.removeSync(testDir, { recursive: true });
});
//# sourceMappingURL=ensure_link_test.js.map