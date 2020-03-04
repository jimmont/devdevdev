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
import { join } from "../path/mod.ts";
var readDir = Deno.readDir, readDirSync = Deno.readDirSync, mkdir = Deno.mkdir, mkdirSync = Deno.mkdirSync, remove = Deno.remove, removeSync = Deno.removeSync;
/**
 * Ensures that a directory is empty.
 * Deletes directory contents if the directory is not empty.
 * If the directory does not exist, it is created.
 * The directory itself is not deleted.
 * Requires the `--allow-read` and `--alow-write` flag.
 */
export function emptyDir(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var items, item, filepath, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 8]);
                    return [4 /*yield*/, readDir(dir)];
                case 1:
                    items = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!items.length) return [3 /*break*/, 5];
                    item = items.shift();
                    if (!(item && item.name)) return [3 /*break*/, 4];
                    filepath = join(dir, item.name);
                    return [4 /*yield*/, remove(filepath, { recursive: true })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    if (!(err_1 instanceof Deno.errors.NotFound)) {
                        throw err_1;
                    }
                    // if not exist. then create it
                    return [4 /*yield*/, mkdir(dir, { recursive: true })];
                case 7:
                    // if not exist. then create it
                    _a.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Ensures that a directory is empty.
 * Deletes directory contents if the directory is not empty.
 * If the directory does not exist, it is created.
 * The directory itself is not deleted.
 * Requires the `--allow-read` and `--alow-write` flag.
 */
export function emptyDirSync(dir) {
    try {
        var items = readDirSync(dir);
        // if directory already exist. then remove it's child item.
        while (items.length) {
            var item = items.shift();
            if (item && item.name) {
                var filepath = join(dir, item.name);
                removeSync(filepath, { recursive: true });
            }
        }
    }
    catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }
        // if not exist. then create it
        mkdirSync(dir, { recursive: true });
        return;
    }
}
//# sourceMappingURL=empty_dir.js.map