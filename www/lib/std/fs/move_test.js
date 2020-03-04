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
import { assertEquals, assertThrows, assertThrowsAsync } from "../testing/asserts.js";
import * as path from "../path/mod.js";
import { move, moveSync } from "./move.js";
import { ensureFile, ensureFileSync } from "./ensure_file.js";
import { ensureDir, ensureDirSync } from "./ensure_dir.js";
import { exists, existsSync } from "./exists.js";
var testdataDir = path.resolve("fs", "testdata");
Deno.test(function moveDirectoryIfSrcNotExists() {
    return __awaiter(this, void 0, void 0, function () {
        var srcDir, destDir;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    srcDir = path.join(testdataDir, "move_test_src_1");
                    destDir = path.join(testdataDir, "move_test_dest_1");
                    // if src directory not exist
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, move(srcDir, destDir)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    // if src directory not exist
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function moveDirectoryIfDestNotExists() {
    return __awaiter(this, void 0, void 0, function () {
        var srcDir, destDir;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    srcDir = path.join(testdataDir, "move_test_src_2");
                    destDir = path.join(testdataDir, "move_test_dest_2");
                    return [4 /*yield*/, Deno.mkdir(srcDir, { recursive: true })];
                case 1:
                    _a.sent();
                    // if dest directory not exist
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, move(srcDir, destDir)];
                                    case 1:
                                        _a.sent();
                                        throw new Error("should not throw error");
                                }
                            });
                        }); }, Error, "should not throw error")];
                case 2:
                    // if dest directory not exist
                    _a.sent();
                    return [4 /*yield*/, Deno.remove(destDir)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function moveFileIfSrcNotExists() {
    return __awaiter(this, void 0, void 0, function () {
        var srcFile, destFile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    srcFile = path.join(testdataDir, "move_test_src_3", "test.txt");
                    destFile = path.join(testdataDir, "move_test_dest_3", "test.txt");
                    // if src directory not exist
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, move(srcFile, destFile)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    // if src directory not exist
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function moveFileIfDestExists() {
    return __awaiter(this, void 0, void 0, function () {
        var srcDir, destDir, srcFile, destFile, srcContent, destContent, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var _this = this;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    srcDir = path.join(testdataDir, "move_test_src_4");
                    destDir = path.join(testdataDir, "move_test_dest_4");
                    srcFile = path.join(srcDir, "test.txt");
                    destFile = path.join(destDir, "test.txt");
                    srcContent = new TextEncoder().encode("src");
                    destContent = new TextEncoder().encode("dest");
                    // make sure files exists
                    return [4 /*yield*/, Promise.all([ensureFile(srcFile), ensureFile(destFile)])];
                case 1:
                    // make sure files exists
                    _l.sent();
                    // write file content
                    return [4 /*yield*/, Promise.all([
                            Deno.writeFile(srcFile, srcContent),
                            Deno.writeFile(destFile, destContent)
                        ])];
                case 2:
                    // write file content
                    _l.sent();
                    // make sure the test file have been created
                    _a = assertEquals;
                    _c = (_b = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile(srcFile)];
                case 3:
                    // make sure the test file have been created
                    _a.apply(void 0, [_c.apply(_b, [_l.sent()]), "src"]);
                    _d = assertEquals;
                    _f = (_e = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile(destFile)];
                case 4:
                    _d.apply(void 0, [_f.apply(_e, [_l.sent()]), "dest"]);
                    // move it without override
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, move(srcFile, destFile)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, Error, "dest already exists")];
                case 5:
                    // move it without override
                    _l.sent();
                    // move again with overwrite
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, move(srcFile, destFile, { overwrite: true })];
                                    case 1:
                                        _a.sent();
                                        throw new Error("should not throw error");
                                }
                            });
                        }); }, Error, "should not throw error")];
                case 6:
                    // move again with overwrite
                    _l.sent();
                    _g = assertEquals;
                    return [4 /*yield*/, exists(srcFile)];
                case 7:
                    _g.apply(void 0, [_l.sent(), false]);
                    _h = assertEquals;
                    _k = (_j = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile(destFile)];
                case 8:
                    _h.apply(void 0, [_k.apply(_j, [_l.sent()]), "src"]);
                    // clean up
                    return [4 /*yield*/, Promise.all([
                            Deno.remove(srcDir, { recursive: true }),
                            Deno.remove(destDir, { recursive: true })
                        ])];
                case 9:
                    // clean up
                    _l.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function moveDirectory() {
    return __awaiter(this, void 0, void 0, function () {
        var srcDir, destDir, srcFile, destFile, srcContent, _a, _b, _c, _d, destFileContent, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    srcDir = path.join(testdataDir, "move_test_src_5");
                    destDir = path.join(testdataDir, "move_test_dest_5");
                    srcFile = path.join(srcDir, "test.txt");
                    destFile = path.join(destDir, "test.txt");
                    srcContent = new TextEncoder().encode("src");
                    return [4 /*yield*/, Deno.mkdir(srcDir, { recursive: true })];
                case 1:
                    _g.sent();
                    _a = assertEquals;
                    return [4 /*yield*/, exists(srcDir)];
                case 2:
                    _a.apply(void 0, [_g.sent(), true]);
                    return [4 /*yield*/, Deno.writeFile(srcFile, srcContent)];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, move(srcDir, destDir)];
                case 4:
                    _g.sent();
                    _b = assertEquals;
                    return [4 /*yield*/, exists(srcDir)];
                case 5:
                    _b.apply(void 0, [_g.sent(), false]);
                    _c = assertEquals;
                    return [4 /*yield*/, exists(destDir)];
                case 6:
                    _c.apply(void 0, [_g.sent(), true]);
                    _d = assertEquals;
                    return [4 /*yield*/, exists(destFile)];
                case 7:
                    _d.apply(void 0, [_g.sent(), true]);
                    _f = (_e = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile(destFile)];
                case 8:
                    destFileContent = _f.apply(_e, [_g.sent()]);
                    assertEquals(destFileContent, "src");
                    return [4 /*yield*/, Deno.remove(destDir, { recursive: true })];
                case 9:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function moveIfSrcAndDestDirectoryExistsAndOverwrite() {
    return __awaiter(this, void 0, void 0, function () {
        var srcDir, destDir, srcFile, destFile, srcContent, destContent, _a, _b, _c, _d, _e, destFileContent, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    srcDir = path.join(testdataDir, "move_test_src_6");
                    destDir = path.join(testdataDir, "move_test_dest_6");
                    srcFile = path.join(srcDir, "test.txt");
                    destFile = path.join(destDir, "test.txt");
                    srcContent = new TextEncoder().encode("src");
                    destContent = new TextEncoder().encode("dest");
                    return [4 /*yield*/, Promise.all([
                            Deno.mkdir(srcDir, { recursive: true }),
                            Deno.mkdir(destDir, { recursive: true })
                        ])];
                case 1:
                    _h.sent();
                    _a = assertEquals;
                    return [4 /*yield*/, exists(srcDir)];
                case 2:
                    _a.apply(void 0, [_h.sent(), true]);
                    _b = assertEquals;
                    return [4 /*yield*/, exists(destDir)];
                case 3:
                    _b.apply(void 0, [_h.sent(), true]);
                    return [4 /*yield*/, Promise.all([
                            Deno.writeFile(srcFile, srcContent),
                            Deno.writeFile(destFile, destContent)
                        ])];
                case 4:
                    _h.sent();
                    return [4 /*yield*/, move(srcDir, destDir, { overwrite: true })];
                case 5:
                    _h.sent();
                    _c = assertEquals;
                    return [4 /*yield*/, exists(srcDir)];
                case 6:
                    _c.apply(void 0, [_h.sent(), false]);
                    _d = assertEquals;
                    return [4 /*yield*/, exists(destDir)];
                case 7:
                    _d.apply(void 0, [_h.sent(), true]);
                    _e = assertEquals;
                    return [4 /*yield*/, exists(destFile)];
                case 8:
                    _e.apply(void 0, [_h.sent(), true]);
                    _g = (_f = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile(destFile)];
                case 9:
                    destFileContent = _g.apply(_f, [_h.sent()]);
                    assertEquals(destFileContent, "src");
                    return [4 /*yield*/, Deno.remove(destDir, { recursive: true })];
                case 10:
                    _h.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function moveIntoSubDir() {
    return __awaiter(this, void 0, void 0, function () {
        var srcDir, destDir;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    srcDir = path.join(testdataDir, "move_test_src_7");
                    destDir = path.join(srcDir, "nest");
                    return [4 /*yield*/, ensureDir(destDir)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, move(srcDir, destDir)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, Error, "Cannot move '" + srcDir + "' to a subdirectory of itself, '" + destDir + "'.")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Deno.remove(srcDir, { recursive: true })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function moveSyncDirectoryIfSrcNotExists() {
    var srcDir = path.join(testdataDir, "move_sync_test_src_1");
    var destDir = path.join(testdataDir, "move_sync_test_dest_1");
    // if src directory not exist
    assertThrows(function () {
        moveSync(srcDir, destDir);
    });
});
Deno.test(function moveSyncDirectoryIfDestNotExists() {
    var srcDir = path.join(testdataDir, "move_sync_test_src_2");
    var destDir = path.join(testdataDir, "move_sync_test_dest_2");
    Deno.mkdirSync(srcDir, { recursive: true });
    // if dest directory not exist
    assertThrows(function () {
        moveSync(srcDir, destDir);
        throw new Error("should not throw error");
    }, Error, "should not throw error");
    Deno.removeSync(destDir);
});
Deno.test(function moveSyncFileIfSrcNotExists() {
    var srcFile = path.join(testdataDir, "move_sync_test_src_3", "test.txt");
    var destFile = path.join(testdataDir, "move_sync_test_dest_3", "test.txt");
    // if src directory not exist
    assertThrows(function () {
        moveSync(srcFile, destFile);
    });
});
Deno.test(function moveSyncFileIfDestExists() {
    var srcDir = path.join(testdataDir, "move_sync_test_src_4");
    var destDir = path.join(testdataDir, "move_sync_test_dest_4");
    var srcFile = path.join(srcDir, "test.txt");
    var destFile = path.join(destDir, "test.txt");
    var srcContent = new TextEncoder().encode("src");
    var destContent = new TextEncoder().encode("dest");
    // make sure files exists
    ensureFileSync(srcFile);
    ensureFileSync(destFile);
    // write file content
    Deno.writeFileSync(srcFile, srcContent);
    Deno.writeFileSync(destFile, destContent);
    // make sure the test file have been created
    assertEquals(new TextDecoder().decode(Deno.readFileSync(srcFile)), "src");
    assertEquals(new TextDecoder().decode(Deno.readFileSync(destFile)), "dest");
    // move it without override
    assertThrows(function () {
        moveSync(srcFile, destFile);
    }, Error, "dest already exists");
    // move again with overwrite
    assertThrows(function () {
        moveSync(srcFile, destFile, { overwrite: true });
        throw new Error("should not throw error");
    }, Error, "should not throw error");
    assertEquals(existsSync(srcFile), false);
    assertEquals(new TextDecoder().decode(Deno.readFileSync(destFile)), "src");
    // clean up
    Deno.removeSync(srcDir, { recursive: true });
    Deno.removeSync(destDir, { recursive: true });
});
Deno.test(function moveSyncDirectory() {
    var srcDir = path.join(testdataDir, "move_sync_test_src_5");
    var destDir = path.join(testdataDir, "move_sync_test_dest_5");
    var srcFile = path.join(srcDir, "test.txt");
    var destFile = path.join(destDir, "test.txt");
    var srcContent = new TextEncoder().encode("src");
    Deno.mkdirSync(srcDir, { recursive: true });
    assertEquals(existsSync(srcDir), true);
    Deno.writeFileSync(srcFile, srcContent);
    moveSync(srcDir, destDir);
    assertEquals(existsSync(srcDir), false);
    assertEquals(existsSync(destDir), true);
    assertEquals(existsSync(destFile), true);
    var destFileContent = new TextDecoder().decode(Deno.readFileSync(destFile));
    assertEquals(destFileContent, "src");
    Deno.removeSync(destDir, { recursive: true });
});
Deno.test(function moveSyncIfSrcAndDestDirectoryExistsAndOverwrite() {
    var srcDir = path.join(testdataDir, "move_sync_test_src_6");
    var destDir = path.join(testdataDir, "move_sync_test_dest_6");
    var srcFile = path.join(srcDir, "test.txt");
    var destFile = path.join(destDir, "test.txt");
    var srcContent = new TextEncoder().encode("src");
    var destContent = new TextEncoder().encode("dest");
    Deno.mkdirSync(srcDir, { recursive: true });
    Deno.mkdirSync(destDir, { recursive: true });
    assertEquals(existsSync(srcDir), true);
    assertEquals(existsSync(destDir), true);
    Deno.writeFileSync(srcFile, srcContent);
    Deno.writeFileSync(destFile, destContent);
    moveSync(srcDir, destDir, { overwrite: true });
    assertEquals(existsSync(srcDir), false);
    assertEquals(existsSync(destDir), true);
    assertEquals(existsSync(destFile), true);
    var destFileContent = new TextDecoder().decode(Deno.readFileSync(destFile));
    assertEquals(destFileContent, "src");
    Deno.removeSync(destDir, { recursive: true });
});
Deno.test(function moveSyncIntoSubDir() {
    var srcDir = path.join(testdataDir, "move_sync_test_src_7");
    var destDir = path.join(srcDir, "nest");
    ensureDirSync(destDir);
    assertThrows(function () {
        moveSync(srcDir, destDir);
    }, Error, "Cannot move '" + srcDir + "' to a subdirectory of itself, '" + destDir + "'.");
    Deno.removeSync(srcDir, { recursive: true });
});
//# sourceMappingURL=move_test.js.map
