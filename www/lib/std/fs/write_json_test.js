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
import { assertEquals, assertThrowsAsync, assertThrows } from "../testing/asserts.js";
import * as path from "../path/mod.js";
import { writeJson, writeJsonSync } from "./write_json.js";
var testdataDir = path.resolve("fs", "testdata");
Deno.test(function writeJsonIfNotExists() {
    return __awaiter(this, void 0, void 0, function () {
        var notExistsJsonFile, content;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notExistsJsonFile = path.join(testdataDir, "file_not_exists.json");
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, writeJson(notExistsJsonFile, { a: "1" })];
                                    case 1:
                                        _a.sent();
                                        throw new Error("should write success");
                                }
                            });
                        }); }, Error, "should write success")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Deno.readFile(notExistsJsonFile)];
                case 2:
                    content = _a.sent();
                    return [4 /*yield*/, Deno.remove(notExistsJsonFile)];
                case 3:
                    _a.sent();
                    assertEquals(new TextDecoder().decode(content), "{\"a\":\"1\"}");
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function writeJsonIfExists() {
    return __awaiter(this, void 0, void 0, function () {
        var existsJsonFile, content;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existsJsonFile = path.join(testdataDir, "file_write_exists.json");
                    return [4 /*yield*/, Deno.writeFile(existsJsonFile, new Uint8Array())];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, writeJson(existsJsonFile, { a: "1" })];
                                    case 1:
                                        _a.sent();
                                        throw new Error("should write success");
                                }
                            });
                        }); }, Error, "should write success")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Deno.readFile(existsJsonFile)];
                case 3:
                    content = _a.sent();
                    return [4 /*yield*/, Deno.remove(existsJsonFile)];
                case 4:
                    _a.sent();
                    assertEquals(new TextDecoder().decode(content), "{\"a\":\"1\"}");
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function writeJsonIfExistsAnInvalidJson() {
    return __awaiter(this, void 0, void 0, function () {
        var existsInvalidJsonFile, invalidJsonContent, content;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existsInvalidJsonFile = path.join(testdataDir, "file_write_invalid.json");
                    invalidJsonContent = new TextEncoder().encode("[123}");
                    return [4 /*yield*/, Deno.writeFile(existsInvalidJsonFile, invalidJsonContent)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, writeJson(existsInvalidJsonFile, { a: "1" })];
                                    case 1:
                                        _a.sent();
                                        throw new Error("should write success");
                                }
                            });
                        }); }, Error, "should write success")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Deno.readFile(existsInvalidJsonFile)];
                case 3:
                    content = _a.sent();
                    return [4 /*yield*/, Deno.remove(existsInvalidJsonFile)];
                case 4:
                    _a.sent();
                    assertEquals(new TextDecoder().decode(content), "{\"a\":\"1\"}");
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function writeJsonWithSpaces() {
    return __awaiter(this, void 0, void 0, function () {
        var existsJsonFile, invalidJsonContent, content;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existsJsonFile = path.join(testdataDir, "file_write_spaces.json");
                    invalidJsonContent = new TextEncoder().encode();
                    return [4 /*yield*/, Deno.writeFile(existsJsonFile, invalidJsonContent)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, writeJson(existsJsonFile, { a: "1" }, { spaces: 2 })];
                                    case 1:
                                        _a.sent();
                                        throw new Error("should write success");
                                }
                            });
                        }); }, Error, "should write success")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Deno.readFile(existsJsonFile)];
                case 3:
                    content = _a.sent();
                    return [4 /*yield*/, Deno.remove(existsJsonFile)];
                case 4:
                    _a.sent();
                    assertEquals(new TextDecoder().decode(content), "{\n  \"a\": \"1\"\n}");
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function writeJsonWithReplacer() {
    return __awaiter(this, void 0, void 0, function () {
        var existsJsonFile, invalidJsonContent, content;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existsJsonFile = path.join(testdataDir, "file_write_replacer.json");
                    invalidJsonContent = new TextEncoder().encode();
                    return [4 /*yield*/, Deno.writeFile(existsJsonFile, invalidJsonContent)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, writeJson(existsJsonFile, { a: "1", b: "2", c: "3" }, {
                                            replacer: ["a"]
                                        })];
                                    case 1:
                                        _a.sent();
                                        throw new Error("should write success");
                                }
                            });
                        }); }, Error, "should write success")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Deno.readFile(existsJsonFile)];
                case 3:
                    content = _a.sent();
                    return [4 /*yield*/, Deno.remove(existsJsonFile)];
                case 4:
                    _a.sent();
                    assertEquals(new TextDecoder().decode(content), "{\"a\":\"1\"}");
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function writeJsonSyncIfNotExists() {
    var notExistsJsonFile = path.join(testdataDir, "file_not_exists_sync.json");
    assertThrows(function () {
        writeJsonSync(notExistsJsonFile, { a: "1" });
        throw new Error("should write success");
    }, Error, "should write success");
    var content = Deno.readFileSync(notExistsJsonFile);
    Deno.removeSync(notExistsJsonFile);
    assertEquals(new TextDecoder().decode(content), "{\"a\":\"1\"}");
});
Deno.test(function writeJsonSyncIfExists() {
    var existsJsonFile = path.join(testdataDir, "file_write_exists_sync.json");
    Deno.writeFileSync(existsJsonFile, new Uint8Array());
    assertThrows(function () {
        writeJsonSync(existsJsonFile, { a: "1" });
        throw new Error("should write success");
    }, Error, "should write success");
    var content = Deno.readFileSync(existsJsonFile);
    Deno.removeSync(existsJsonFile);
    assertEquals(new TextDecoder().decode(content), "{\"a\":\"1\"}");
});
Deno.test(function writeJsonSyncIfExistsAnInvalidJson() {
    var existsInvalidJsonFile = path.join(testdataDir, "file_write_invalid_sync.json");
    var invalidJsonContent = new TextEncoder().encode("[123}");
    Deno.writeFileSync(existsInvalidJsonFile, invalidJsonContent);
    assertThrows(function () {
        writeJsonSync(existsInvalidJsonFile, { a: "1" });
        throw new Error("should write success");
    }, Error, "should write success");
    var content = Deno.readFileSync(existsInvalidJsonFile);
    Deno.removeSync(existsInvalidJsonFile);
    assertEquals(new TextDecoder().decode(content), "{\"a\":\"1\"}");
});
Deno.test(function writeJsonWithSpaces() {
    var existsJsonFile = path.join(testdataDir, "file_write_spaces_sync.json");
    var invalidJsonContent = new TextEncoder().encode();
    Deno.writeFileSync(existsJsonFile, invalidJsonContent);
    assertThrows(function () {
        writeJsonSync(existsJsonFile, { a: "1" }, { spaces: 2 });
        throw new Error("should write success");
    }, Error, "should write success");
    var content = Deno.readFileSync(existsJsonFile);
    Deno.removeSync(existsJsonFile);
    assertEquals(new TextDecoder().decode(content), "{\n  \"a\": \"1\"\n}");
});
Deno.test(function writeJsonWithReplacer() {
    var existsJsonFile = path.join(testdataDir, "file_write_replacer_sync.json");
    var invalidJsonContent = new TextEncoder().encode();
    Deno.writeFileSync(existsJsonFile, invalidJsonContent);
    assertThrows(function () {
        writeJsonSync(existsJsonFile, { a: "1", b: "2", c: "3" }, {
            replacer: ["a"]
        });
        throw new Error("should write success");
    }, Error, "should write success");
    var content = Deno.readFileSync(existsJsonFile);
    Deno.removeSync(existsJsonFile);
    assertEquals(new TextDecoder().decode(content), "{\"a\":\"1\"}");
});
//# sourceMappingURL=write_json_test.js.map
