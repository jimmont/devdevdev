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
import { assertThrows, assertThrowsAsync } from "../testing/asserts.ts";
import * as path from "../path/mod.ts";
import { ensureFile, ensureFileSync } from "./ensure_file.ts";
var testdataDir = path.resolve("fs", "testdata");
Deno.test(function ensureFileIfItNotExist() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir, testFile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testDir = path.join(testdataDir, "ensure_file_1");
                    testFile = path.join(testDir, "test.txt");
                    return [4 /*yield*/, ensureFile(testFile)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
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
                        }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Deno.remove(testDir, { recursive: true })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function ensureFileSyncIfItNotExist() {
    var testDir = path.join(testdataDir, "ensure_file_2");
    var testFile = path.join(testDir, "test.txt");
    ensureFileSync(testFile);
    assertThrows(function () {
        Deno.statSync(testFile);
        throw new Error("test file should exists.");
    });
    Deno.removeSync(testDir, { recursive: true });
});
Deno.test(function ensureFileIfItExist() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir, testFile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testDir = path.join(testdataDir, "ensure_file_3");
                    testFile = path.join(testDir, "test.txt");
                    return [4 /*yield*/, Deno.mkdir(testDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Deno.writeFile(testFile, new Uint8Array())];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, ensureFile(testFile)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
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
                        }); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, Deno.remove(testDir, { recursive: true })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function ensureFileSyncIfItExist() {
    var testDir = path.join(testdataDir, "ensure_file_4");
    var testFile = path.join(testDir, "test.txt");
    Deno.mkdirSync(testDir, { recursive: true });
    Deno.writeFileSync(testFile, new Uint8Array());
    ensureFileSync(testFile);
    assertThrows(function () {
        Deno.statSync(testFile);
        throw new Error("test file should exists.");
    });
    Deno.removeSync(testDir, { recursive: true });
});
Deno.test(function ensureFileIfItExistAsDir() {
    return __awaiter(this, void 0, void 0, function () {
        var testDir;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testDir = path.join(testdataDir, "ensure_file_5");
                    return [4 /*yield*/, Deno.mkdir(testDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ensureFile(testDir)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, Error, "Ensure path exists, expected 'file', got 'dir'")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Deno.remove(testDir, { recursive: true })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function ensureFileSyncIfItExistAsDir() {
    var testDir = path.join(testdataDir, "ensure_file_6");
    Deno.mkdirSync(testDir, { recursive: true });
    assertThrows(function () {
        ensureFileSync(testDir);
    }, Error, "Ensure path exists, expected 'file', got 'dir'");
    Deno.removeSync(testDir, { recursive: true });
});
//# sourceMappingURL=ensure_file_test.js.map