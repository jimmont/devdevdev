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
import * as path from "../path/mod.ts";
import { ensureDir, ensureDirSync } from "./ensure_dir.ts";
import { isSubdir, getFileInfoType } from "./utils.ts";
import { assert } from "../testing/asserts.ts";
function ensureValidCopy(src, dest, options, isCopyFolder) {
    if (isCopyFolder === void 0) { isCopyFolder = false; }
    return __awaiter(this, void 0, void 0, function () {
        var destStat, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Deno.lstat(dest)];
                case 1:
                    destStat = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    if (err_1 instanceof Deno.errors.NotFound) {
                        return [2 /*return*/];
                    }
                    throw err_1;
                case 3:
                    if (isCopyFolder && !destStat.isDirectory()) {
                        throw new Error("Cannot overwrite non-directory '" + dest + "' with directory '" + src + "'.");
                    }
                    if (!options.overwrite) {
                        throw new Error("'" + dest + "' already exists.");
                    }
                    return [2 /*return*/, destStat];
            }
        });
    });
}
function ensureValidCopySync(src, dest, options, isCopyFolder) {
    if (isCopyFolder === void 0) { isCopyFolder = false; }
    var destStat;
    try {
        destStat = Deno.lstatSync(dest);
    }
    catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return;
        }
        throw err;
    }
    if (isCopyFolder && !destStat.isDirectory()) {
        throw new Error("Cannot overwrite non-directory '" + dest + "' with directory '" + src + "'.");
    }
    if (!options.overwrite) {
        throw new Error("'" + dest + "' already exists.");
    }
    return destStat;
}
/* copy file to dest */
function copyFile(src, dest, options) {
    return __awaiter(this, void 0, void 0, function () {
        var statInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureValidCopy(src, dest, options)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Deno.copyFile(src, dest)];
                case 2:
                    _a.sent();
                    if (!options.preserveTimestamps) return [3 /*break*/, 5];
                    return [4 /*yield*/, Deno.stat(src)];
                case 3:
                    statInfo = _a.sent();
                    assert(statInfo.accessed != null, "statInfo.accessed is unavailable");
                    assert(statInfo.modified != null, "statInfo.modified is unavailable");
                    return [4 /*yield*/, Deno.utime(dest, statInfo.accessed, statInfo.modified)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/* copy file to dest synchronously */
function copyFileSync(src, dest, options) {
    ensureValidCopySync(src, dest, options);
    Deno.copyFileSync(src, dest);
    if (options.preserveTimestamps) {
        var statInfo = Deno.statSync(src);
        assert(statInfo.accessed != null, "statInfo.accessed is unavailable");
        assert(statInfo.modified != null, "statInfo.modified is unavailable");
        Deno.utimeSync(dest, statInfo.accessed, statInfo.modified);
    }
}
/* copy symlink to dest */
function copySymLink(src, dest, options) {
    return __awaiter(this, void 0, void 0, function () {
        var originSrcFilePath, type, _a, statInfo;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ensureValidCopy(src, dest, options)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, Deno.readlink(src)];
                case 2:
                    originSrcFilePath = _b.sent();
                    _a = getFileInfoType;
                    return [4 /*yield*/, Deno.lstat(src)];
                case 3:
                    type = _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, Deno.symlink(originSrcFilePath, dest, type)];
                case 4:
                    _b.sent();
                    if (!options.preserveTimestamps) return [3 /*break*/, 7];
                    return [4 /*yield*/, Deno.lstat(src)];
                case 5:
                    statInfo = _b.sent();
                    assert(statInfo.accessed != null, "statInfo.accessed is unavailable");
                    assert(statInfo.modified != null, "statInfo.modified is unavailable");
                    return [4 /*yield*/, Deno.utime(dest, statInfo.accessed, statInfo.modified)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
/* copy symlink to dest synchronously */
function copySymlinkSync(src, dest, options) {
    ensureValidCopySync(src, dest, options);
    var originSrcFilePath = Deno.readlinkSync(src);
    var type = getFileInfoType(Deno.lstatSync(src));
    Deno.symlinkSync(originSrcFilePath, dest, type);
    if (options.preserveTimestamps) {
        var statInfo = Deno.lstatSync(src);
        assert(statInfo.accessed != null, "statInfo.accessed is unavailable");
        assert(statInfo.modified != null, "statInfo.modified is unavailable");
        Deno.utimeSync(dest, statInfo.accessed, statInfo.modified);
    }
}
/* copy folder from src to dest. */
function copyDir(src, dest, options) {
    return __awaiter(this, void 0, void 0, function () {
        var destStat, srcStatInfo, files, _i, files_1, file, srcPath, destPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureValidCopy(src, dest, options, true)];
                case 1:
                    destStat = _a.sent();
                    if (!!destStat) return [3 /*break*/, 3];
                    return [4 /*yield*/, ensureDir(dest)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!options.preserveTimestamps) return [3 /*break*/, 6];
                    return [4 /*yield*/, Deno.stat(src)];
                case 4:
                    srcStatInfo = _a.sent();
                    assert(srcStatInfo.accessed != null, "statInfo.accessed is unavailable");
                    assert(srcStatInfo.modified != null, "statInfo.modified is unavailable");
                    return [4 /*yield*/, Deno.utime(dest, srcStatInfo.accessed, srcStatInfo.modified)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [4 /*yield*/, Deno.readDir(src)];
                case 7:
                    files = _a.sent();
                    _i = 0, files_1 = files;
                    _a.label = 8;
                case 8:
                    if (!(_i < files_1.length)) return [3 /*break*/, 15];
                    file = files_1[_i];
                    assert(file.name != null, "file.name must be set");
                    srcPath = path.join(src, file.name);
                    destPath = path.join(dest, path.basename(srcPath));
                    if (!file.isDirectory()) return [3 /*break*/, 10];
                    return [4 /*yield*/, copyDir(srcPath, destPath, options)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 10:
                    if (!file.isFile()) return [3 /*break*/, 12];
                    return [4 /*yield*/, copyFile(srcPath, destPath, options)];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 12:
                    if (!file.isSymlink()) return [3 /*break*/, 14];
                    return [4 /*yield*/, copySymLink(srcPath, destPath, options)];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 8];
                case 15: return [2 /*return*/];
            }
        });
    });
}
/* copy folder from src to dest synchronously */
function copyDirSync(src, dest, options) {
    var destStat = ensureValidCopySync(src, dest, options, true);
    if (!destStat) {
        ensureDirSync(dest);
    }
    if (options.preserveTimestamps) {
        var srcStatInfo = Deno.statSync(src);
        assert(srcStatInfo.accessed != null, "statInfo.accessed is unavailable");
        assert(srcStatInfo.modified != null, "statInfo.modified is unavailable");
        Deno.utimeSync(dest, srcStatInfo.accessed, srcStatInfo.modified);
    }
    var files = Deno.readDirSync(src);
    for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
        var file = files_2[_i];
        assert(file.name != null, "file.name must be set");
        var srcPath = path.join(src, file.name);
        var destPath = path.join(dest, path.basename(srcPath));
        if (file.isDirectory()) {
            copyDirSync(srcPath, destPath, options);
        }
        else if (file.isFile()) {
            copyFileSync(srcPath, destPath, options);
        }
        else if (file.isSymlink()) {
            copySymlinkSync(srcPath, destPath, options);
        }
    }
}
/**
 * Copy a file or directory. The directory can have contents. Like `cp -r`.
 * Requires the `--allow-read` and `--alow-write` flag.
 * @param src the file/directory path.
 *            Note that if `src` is a directory it will copy everything inside
 *            of this directory, not the entire directory itself
 * @param dest the destination path. Note that if `src` is a file, `dest` cannot
 *             be a directory
 * @param options
 */
export function copy(src, dest, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var srcStat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    src = path.resolve(src);
                    dest = path.resolve(dest);
                    if (src === dest) {
                        throw new Error("Source and destination cannot be the same.");
                    }
                    return [4 /*yield*/, Deno.lstat(src)];
                case 1:
                    srcStat = _a.sent();
                    if (srcStat.isDirectory() && isSubdir(src, dest)) {
                        throw new Error("Cannot copy '" + src + "' to a subdirectory of itself, '" + dest + "'.");
                    }
                    if (!srcStat.isDirectory()) return [3 /*break*/, 3];
                    return [4 /*yield*/, copyDir(src, dest, options)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!srcStat.isFile()) return [3 /*break*/, 5];
                    return [4 /*yield*/, copyFile(src, dest, options)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    if (!srcStat.isSymlink()) return [3 /*break*/, 7];
                    return [4 /*yield*/, copySymLink(src, dest, options)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Copy a file or directory. The directory can have contents. Like `cp -r`.
 * Requires the `--allow-read` and `--alow-write` flag.
 * @param src the file/directory path.
 *            Note that if `src` is a directory it will copy everything inside
 *            of this directory, not the entire directory itself
 * @param dest the destination path. Note that if `src` is a file, `dest` cannot
 *             be a directory
 * @param options
 */
export function copySync(src, dest, options) {
    if (options === void 0) { options = {}; }
    src = path.resolve(src);
    dest = path.resolve(dest);
    if (src === dest) {
        throw new Error("Source and destination cannot be the same.");
    }
    var srcStat = Deno.lstatSync(src);
    if (srcStat.isDirectory() && isSubdir(src, dest)) {
        throw new Error("Cannot copy '" + src + "' to a subdirectory of itself, '" + dest + "'.");
    }
    if (srcStat.isDirectory()) {
        copyDirSync(src, dest, options);
    }
    else if (srcStat.isFile()) {
        copyFileSync(src, dest, options);
    }
    else if (srcStat.isSymlink()) {
        copySymlinkSync(src, dest, options);
    }
}
//# sourceMappingURL=copy.js.map