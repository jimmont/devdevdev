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
import { assertEquals, assertThrows, assertThrowsAsync, assert } from "../testing/asserts.js";
import * as path from "../path/mod.js";
import { copy, copySync } from "./copy.js";
import { exists, existsSync } from "./exists.js";
import { ensureDir, ensureDirSync } from "./ensure_dir.js";
import { ensureFile, ensureFileSync } from "./ensure_file.js";
import { ensureSymlink, ensureSymlinkSync } from "./ensure_symlink.js";
var testdataDir = path.resolve("fs", "testdata");
// TODO(axetroy): Add test for Windows once symlink is implemented for Windows.
var isWindows = Deno.build.os === "win";
function testCopy(name, cb) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            Deno.test({
                name: name,
                fn: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var tempDir;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Deno.makeTempDir({
                                        prefix: "deno_std_copy_async_test_"
                                    })];
                                case 1:
                                    tempDir = _a.sent();
                                    return [4 /*yield*/, cb(tempDir)];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, Deno.remove(tempDir, { recursive: true })];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                }
            });
            return [2 /*return*/];
        });
    });
}
function testCopySync(name, cb) {
    Deno.test({
        name: name,
        fn: function () {
            var tempDir = Deno.makeTempDirSync({
                prefix: "deno_std_copy_sync_test_"
            });
            cb(tempDir);
            Deno.removeSync(tempDir, { recursive: true });
        }
    });
}
testCopy("[fs] copy file if it does no exist", function (tempDir) { return __awaiter(void 0, void 0, void 0, function () {
    var srcFile, destFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                srcFile = path.join(testdataDir, "copy_file_not_exists.txt");
                destFile = path.join(tempDir, "copy_file_not_exists_1.txt");
                return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, copy(srcFile, destFile)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
testCopy("[fs] copy if src and dest are the same paths", function (tempDir) { return __awaiter(void 0, void 0, void 0, function () {
    var srcFile, destFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                srcFile = path.join(tempDir, "copy_file_same.txt");
                destFile = path.join(tempDir, "copy_file_same.txt");
                return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, copy(srcFile, destFile)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, Error, "Source and destination cannot be the same.")];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
testCopy("[fs] copy file", function (tempDir) { return __awaiter(void 0, void 0, void 0, function () {
    var srcFile, destFile, srcContent, _a, _b, _c, _d, _e, _f, destContent, _g, _h, _j, _k, _l, _m, _o, _p;
    return __generator(this, function (_q) {
        switch (_q.label) {
            case 0:
                srcFile = path.join(testdataDir, "copy_file.txt");
                destFile = path.join(tempDir, "copy_file_copy.txt");
                _b = (_a = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(srcFile)];
            case 1:
                srcContent = _b.apply(_a, [_q.sent()]);
                _c = assertEquals;
                return [4 /*yield*/, exists(srcFile)];
            case 2:
                _c.apply(void 0, [_q.sent(),
                    true,
                    "source should exist before copy"]);
                _d = assertEquals;
                return [4 /*yield*/, exists(destFile)];
            case 3:
                _d.apply(void 0, [_q.sent(),
                    false,
                    "destination should not exist before copy"]);
                return [4 /*yield*/, copy(srcFile, destFile)];
            case 4:
                _q.sent();
                _e = assertEquals;
                return [4 /*yield*/, exists(srcFile)];
            case 5:
                _e.apply(void 0, [_q.sent(), true, "source should exist after copy"]);
                _f = assertEquals;
                return [4 /*yield*/, exists(destFile)];
            case 6:
                _f.apply(void 0, [_q.sent(),
                    true,
                    "destination should exist before copy"]);
                _h = (_g = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(destFile)];
            case 7:
                destContent = _h.apply(_g, [_q.sent()]);
                assertEquals(srcContent, destContent, "source and destination should have the same content");
                // Copy again and it should throw an error.
                return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, copy(srcFile, destFile)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, Error, "'" + destFile + "' already exists.")];
            case 8:
                // Copy again and it should throw an error.
                _q.sent();
                // Modify destination file.
                return [4 /*yield*/, Deno.writeFile(destFile, new TextEncoder().encode("txt copy"))];
            case 9:
                // Modify destination file.
                _q.sent();
                _j = assertEquals;
                _l = (_k = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(destFile)];
            case 10:
                _j.apply(void 0, [_l.apply(_k, [_q.sent()]),
                    "txt copy"]);
                // Copy again with overwrite option.
                return [4 /*yield*/, copy(srcFile, destFile, { overwrite: true })];
            case 11:
                // Copy again with overwrite option.
                _q.sent();
                // Make sure the file has been overwritten.
                _m = assertEquals;
                _p = (_o = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(destFile)];
            case 12:
                // Make sure the file has been overwritten.
                _m.apply(void 0, [_p.apply(_o, [_q.sent()]),
                    "txt"]);
                return [2 /*return*/];
        }
    });
}); });
testCopy("[fs] copy with preserve timestamps", function (tempDir) { return __awaiter(void 0, void 0, void 0, function () {
    var srcFile, destFile, srcStatInfo, destStatInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                srcFile = path.join(testdataDir, "copy_file.txt");
                destFile = path.join(tempDir, "copy_file_copy.txt");
                return [4 /*yield*/, Deno.stat(srcFile)];
            case 1:
                srcStatInfo = _a.sent();
                assert(typeof srcStatInfo.accessed === "number");
                assert(typeof srcStatInfo.modified === "number");
                // Copy with overwrite and preserve timestamps options.
                return [4 /*yield*/, copy(srcFile, destFile, {
                        overwrite: true,
                        preserveTimestamps: true
                    })];
            case 2:
                // Copy with overwrite and preserve timestamps options.
                _a.sent();
                return [4 /*yield*/, Deno.stat(destFile)];
            case 3:
                destStatInfo = _a.sent();
                assert(typeof destStatInfo.accessed === "number");
                assert(typeof destStatInfo.modified === "number");
                assertEquals(destStatInfo.accessed, srcStatInfo.accessed);
                assertEquals(destStatInfo.modified, srcStatInfo.modified);
                return [2 /*return*/];
        }
    });
}); });
testCopy("[fs] copy directory to its subdirectory", function (tempDir) { return __awaiter(void 0, void 0, void 0, function () {
    var srcDir, destDir;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                srcDir = path.join(tempDir, "parent");
                destDir = path.join(srcDir, "child");
                return [4 /*yield*/, ensureDir(srcDir)];
            case 1:
                _a.sent();
                return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, copy(srcDir, destDir)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, Error, "Cannot copy '" + srcDir + "' to a subdirectory of itself, '" + destDir + "'.")];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
testCopy("[fs] copy directory and destination exist and not a directory", function (tempDir) { return __awaiter(void 0, void 0, void 0, function () {
    var srcDir, destDir;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                srcDir = path.join(tempDir, "parent");
                destDir = path.join(tempDir, "child.txt");
                return [4 /*yield*/, ensureDir(srcDir)];
            case 1:
                _a.sent();
                return [4 /*yield*/, ensureFile(destDir)];
            case 2:
                _a.sent();
                return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, copy(srcDir, destDir)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, Error, "Cannot overwrite non-directory '" + destDir + "' with directory '" + srcDir + "'.")];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
testCopy("[fs] copy directory", function (tempDir) { return __awaiter(void 0, void 0, void 0, function () {
    var srcDir, destDir, srcFile, destFile, srcNestFile, destNestFile, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    return __generator(this, function (_w) {
        switch (_w.label) {
            case 0:
                srcDir = path.join(testdataDir, "copy_dir");
                destDir = path.join(tempDir, "copy_dir");
                srcFile = path.join(srcDir, "0.txt");
                destFile = path.join(destDir, "0.txt");
                srcNestFile = path.join(srcDir, "nest", "0.txt");
                destNestFile = path.join(destDir, "nest", "0.txt");
                return [4 /*yield*/, copy(srcDir, destDir)];
            case 1:
                _w.sent();
                _a = assertEquals;
                return [4 /*yield*/, exists(destFile)];
            case 2:
                _a.apply(void 0, [_w.sent(), true]);
                _b = assertEquals;
                return [4 /*yield*/, exists(destNestFile)];
            case 3:
                _b.apply(void 0, [_w.sent(), true]);
                // After copy. The source and destination should have the same content.
                _c = assertEquals;
                _e = (_d = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(srcFile)];
            case 4:
                _f = [_e.apply(_d, [_w.sent()])];
                _h = (_g = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(destFile)];
            case 5:
                // After copy. The source and destination should have the same content.
                _c.apply(void 0, _f.concat([_h.apply(_g, [_w.sent()])]));
                _j = assertEquals;
                _l = (_k = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(srcNestFile)];
            case 6:
                _m = [_l.apply(_k, [_w.sent()])];
                _p = (_o = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(destNestFile)];
            case 7:
                _j.apply(void 0, _m.concat([_p.apply(_o, [_w.sent()])]));
                // Copy again without overwrite option and it should throw an error.
                return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, copy(srcDir, destDir)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, Error, "'" + destDir + "' already exists.")];
            case 8:
                // Copy again without overwrite option and it should throw an error.
                _w.sent();
                // Modify the file in the destination directory.
                return [4 /*yield*/, Deno.writeFile(destNestFile, new TextEncoder().encode("nest copy"))];
            case 9:
                // Modify the file in the destination directory.
                _w.sent();
                _q = assertEquals;
                _s = (_r = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(destNestFile)];
            case 10:
                _q.apply(void 0, [_s.apply(_r, [_w.sent()]),
                    "nest copy"]);
                // Copy again with overwrite option.
                return [4 /*yield*/, copy(srcDir, destDir, { overwrite: true })];
            case 11:
                // Copy again with overwrite option.
                _w.sent();
                // Make sure the file has been overwritten.
                _t = assertEquals;
                _v = (_u = new TextDecoder()).decode;
                return [4 /*yield*/, Deno.readFile(destNestFile)];
            case 12:
                // Make sure the file has been overwritten.
                _t.apply(void 0, [_v.apply(_u, [_w.sent()]),
                    "nest"]);
                return [2 /*return*/];
        }
    });
}); });
testCopy("[fs] copy symlink file", function (tempDir) { return __awaiter(void 0, void 0, void 0, function () {
    var dir, srcLink, destLink, _a, statInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                dir = path.join(testdataDir, "copy_dir_link_file");
                srcLink = path.join(dir, "0.txt");
                destLink = path.join(tempDir, "0_copy.txt");
                if (!isWindows) return [3 /*break*/, 2];
                return [4 /*yield*/, assertThrowsAsync(
                    // (): Promise<void> => copy(srcLink, destLink),
                    function () { return ensureSymlink(srcLink, destLink); })];
            case 1:
                _b.sent();
                return [2 /*return*/];
            case 2:
                _a = assert;
                return [4 /*yield*/, Deno.lstat(srcLink)];
            case 3:
                _a.apply(void 0, [(_b.sent()).isSymlink(),
                    "'" + srcLink + "' should be symlink type"]);
                return [4 /*yield*/, copy(srcLink, destLink)];
            case 4:
                _b.sent();
                return [4 /*yield*/, Deno.lstat(destLink)];
            case 5:
                statInfo = _b.sent();
                assert(statInfo.isSymlink(), "'" + destLink + "' should be symlink type");
                return [2 /*return*/];
        }
    });
}); });
testCopy("[fs] copy symlink directory", function (tempDir) { return __awaiter(void 0, void 0, void 0, function () {
    var srcDir, srcLink, destLink, _a, statInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                srcDir = path.join(testdataDir, "copy_dir");
                srcLink = path.join(tempDir, "copy_dir_link");
                destLink = path.join(tempDir, "copy_dir_link_copy");
                if (!isWindows) return [3 /*break*/, 2];
                return [4 /*yield*/, assertThrowsAsync(
                    // (): Promise<void> => copy(srcLink, destLink),
                    function () { return ensureSymlink(srcLink, destLink); })];
            case 1:
                _b.sent();
                return [2 /*return*/];
            case 2: return [4 /*yield*/, ensureSymlink(srcDir, srcLink)];
            case 3:
                _b.sent();
                _a = assert;
                return [4 /*yield*/, Deno.lstat(srcLink)];
            case 4:
                _a.apply(void 0, [(_b.sent()).isSymlink(),
                    "'" + srcLink + "' should be symlink type"]);
                return [4 /*yield*/, copy(srcLink, destLink)];
            case 5:
                _b.sent();
                return [4 /*yield*/, Deno.lstat(destLink)];
            case 6:
                statInfo = _b.sent();
                assert(statInfo.isSymlink());
                return [2 /*return*/];
        }
    });
}); });
testCopySync("[fs] copy file synchronously if it does not exist", function (tempDir) {
    var srcFile = path.join(testdataDir, "copy_file_not_exists_sync.txt");
    var destFile = path.join(tempDir, "copy_file_not_exists_1_sync.txt");
    assertThrows(function () {
        copySync(srcFile, destFile);
    });
});
testCopySync("[fs] copy synchronously with preserve timestamps", function (tempDir) {
    var srcFile = path.join(testdataDir, "copy_file.txt");
    var destFile = path.join(tempDir, "copy_file_copy.txt");
    var srcStatInfo = Deno.statSync(srcFile);
    assert(typeof srcStatInfo.accessed === "number");
    assert(typeof srcStatInfo.modified === "number");
    // Copy with overwrite and preserve timestamps options.
    copySync(srcFile, destFile, {
        overwrite: true,
        preserveTimestamps: true
    });
    var destStatInfo = Deno.statSync(destFile);
    assert(typeof destStatInfo.accessed === "number");
    assert(typeof destStatInfo.modified === "number");
    // TODO: Activate test when https://github.com/denoland/deno/issues/2411
    // is fixed
    // assertEquals(destStatInfo.accessed, srcStatInfo.accessed);
    // assertEquals(destStatInfo.modified, srcStatInfo.modified);
});
testCopySync("[fs] copy synchronously if src and dest are the same paths", function () {
    var srcFile = path.join(testdataDir, "copy_file_same_sync.txt");
    assertThrows(function () {
        copySync(srcFile, srcFile);
    }, Error, "Source and destination cannot be the same.");
});
testCopySync("[fs] copy file synchronously", function (tempDir) {
    var srcFile = path.join(testdataDir, "copy_file.txt");
    var destFile = path.join(tempDir, "copy_file_copy_sync.txt");
    var srcContent = new TextDecoder().decode(Deno.readFileSync(srcFile));
    assertEquals(existsSync(srcFile), true);
    assertEquals(existsSync(destFile), false);
    copySync(srcFile, destFile);
    assertEquals(existsSync(srcFile), true);
    assertEquals(existsSync(destFile), true);
    var destContent = new TextDecoder().decode(Deno.readFileSync(destFile));
    assertEquals(srcContent, destContent);
    // Copy again without overwrite option and it should throw an error.
    assertThrows(function () {
        copySync(srcFile, destFile);
    }, Error, "'" + destFile + "' already exists.");
    // Modify destination file.
    Deno.writeFileSync(destFile, new TextEncoder().encode("txt copy"));
    assertEquals(new TextDecoder().decode(Deno.readFileSync(destFile)), "txt copy");
    // Copy again with overwrite option.
    copySync(srcFile, destFile, { overwrite: true });
    // Make sure the file has been overwritten.
    assertEquals(new TextDecoder().decode(Deno.readFileSync(destFile)), "txt");
});
testCopySync("[fs] copy directory synchronously to its subdirectory", function (tempDir) {
    var srcDir = path.join(tempDir, "parent");
    var destDir = path.join(srcDir, "child");
    ensureDirSync(srcDir);
    assertThrows(function () {
        copySync(srcDir, destDir);
    }, Error, "Cannot copy '" + srcDir + "' to a subdirectory of itself, '" + destDir + "'.");
});
testCopySync("[fs] copy directory synchronously, and destination exist and not a " +
    "directory", function (tempDir) {
    var srcDir = path.join(tempDir, "parent_sync");
    var destDir = path.join(tempDir, "child.txt");
    ensureDirSync(srcDir);
    ensureFileSync(destDir);
    assertThrows(function () {
        copySync(srcDir, destDir);
    }, Error, "Cannot overwrite non-directory '" + destDir + "' with directory '" + srcDir + "'.");
});
testCopySync("[fs] copy directory synchronously", function (tempDir) {
    var srcDir = path.join(testdataDir, "copy_dir");
    var destDir = path.join(tempDir, "copy_dir_copy_sync");
    var srcFile = path.join(srcDir, "0.txt");
    var destFile = path.join(destDir, "0.txt");
    var srcNestFile = path.join(srcDir, "nest", "0.txt");
    var destNestFile = path.join(destDir, "nest", "0.txt");
    copySync(srcDir, destDir);
    assertEquals(existsSync(destFile), true);
    assertEquals(existsSync(destNestFile), true);
    // After copy. The source and destination should have the same content.
    assertEquals(new TextDecoder().decode(Deno.readFileSync(srcFile)), new TextDecoder().decode(Deno.readFileSync(destFile)));
    assertEquals(new TextDecoder().decode(Deno.readFileSync(srcNestFile)), new TextDecoder().decode(Deno.readFileSync(destNestFile)));
    // Copy again without overwrite option and it should throw an error.
    assertThrows(function () {
        copySync(srcDir, destDir);
    }, Error, "'" + destDir + "' already exists.");
    // Modify the file in the destination directory.
    Deno.writeFileSync(destNestFile, new TextEncoder().encode("nest copy"));
    assertEquals(new TextDecoder().decode(Deno.readFileSync(destNestFile)), "nest copy");
    // Copy again with overwrite option.
    copySync(srcDir, destDir, { overwrite: true });
    // Make sure the file has been overwritten.
    assertEquals(new TextDecoder().decode(Deno.readFileSync(destNestFile)), "nest");
});
testCopySync("[fs] copy symlink file synchronously", function (tempDir) {
    var dir = path.join(testdataDir, "copy_dir_link_file");
    var srcLink = path.join(dir, "0.txt");
    var destLink = path.join(tempDir, "0_copy.txt");
    if (isWindows) {
        assertThrows(
        // (): void => copySync(srcLink, destLink),
        function () { return ensureSymlinkSync(srcLink, destLink); });
        return;
    }
    assert(Deno.lstatSync(srcLink).isSymlink(), "'" + srcLink + "' should be symlink type");
    copySync(srcLink, destLink);
    var statInfo = Deno.lstatSync(destLink);
    assert(statInfo.isSymlink(), "'" + destLink + "' should be symlink type");
});
testCopySync("[fs] copy symlink directory synchronously", function (tempDir) {
    var originDir = path.join(testdataDir, "copy_dir");
    var srcLink = path.join(tempDir, "copy_dir_link");
    var destLink = path.join(tempDir, "copy_dir_link_copy");
    if (isWindows) {
        assertThrows(
        // (): void => copySync(srcLink, destLink),
        function () { return ensureSymlinkSync(srcLink, destLink); });
        return;
    }
    ensureSymlinkSync(originDir, srcLink);
    assert(Deno.lstatSync(srcLink).isSymlink(), "'" + srcLink + "' should be symlink type");
    copySync(srcLink, destLink);
    var statInfo = Deno.lstatSync(destLink);
    assert(statInfo.isSymlink());
});
//# sourceMappingURL=copy_test.js.map
