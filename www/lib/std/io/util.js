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
var Buffer = Deno.Buffer, mkdir = Deno.mkdir, open = Deno.open;
import * as path from "../path/mod.ts";
import { encode } from "../strings/mod.ts";
// `off` is the offset into `dst` where it will at which to begin writing values
// from `src`.
// Returns the number of bytes copied.
export function copyBytes(dst, src, off) {
    if (off === void 0) { off = 0; }
    off = Math.max(0, Math.min(off, dst.byteLength));
    var r = dst.byteLength - off;
    if (src.byteLength > r) {
        src = src.subarray(0, r);
    }
    dst.set(src, off);
    return src.byteLength;
}
export function charCode(s) {
    return s.charCodeAt(0);
}
export function stringsReader(s) {
    return new Buffer(encode(s).buffer);
}
/** Create or open a temporal file at specified directory with prefix and
 *  postfix
 * */
export function tempFile(dir, opts) {
    if (opts === void 0) { opts = { prefix: "", postfix: "" }; }
    return __awaiter(this, void 0, void 0, function () {
        var r, filepath, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = Math.floor(Math.random() * 1000000);
                    filepath = path.resolve(dir + "/" + (opts.prefix || "") + r + (opts.postfix || ""));
                    return [4 /*yield*/, mkdir(path.dirname(filepath), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, open(filepath, "a")];
                case 2:
                    file = _a.sent();
                    return [2 /*return*/, { file: file, filepath: filepath }];
            }
        });
    });
}
//# sourceMappingURL=util.js.map