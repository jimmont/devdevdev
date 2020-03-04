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
import { UnexpectedEOFError } from "./bufio.ts";
import { assert } from "../testing/asserts.ts";
/** copy N size at the most.
 *  If read size is lesser than N, then returns nread
 * */
export function copyN(dest, r, size) {
    return __awaiter(this, void 0, void 0, function () {
        var bytesRead, buf, result, nread, n;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bytesRead = 0;
                    buf = new Uint8Array(1024);
                    _a.label = 1;
                case 1:
                    if (!(bytesRead < size)) return [3 /*break*/, 5];
                    if (size - bytesRead < 1024) {
                        buf = new Uint8Array(size - bytesRead);
                    }
                    return [4 /*yield*/, r.read(buf)];
                case 2:
                    result = _a.sent();
                    nread = result === Deno.EOF ? 0 : result;
                    bytesRead += nread;
                    if (!(nread > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, dest.write(buf.slice(0, nread))];
                case 3:
                    n = _a.sent();
                    assert(n === nread, "could not write");
                    _a.label = 4;
                case 4:
                    if (result === Deno.EOF) {
                        return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, bytesRead];
            }
        });
    });
}
/** Read big endian 16bit short from BufReader */
export function readShort(buf) {
    return __awaiter(this, void 0, void 0, function () {
        var high, low;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, buf.readByte()];
                case 1:
                    high = _a.sent();
                    if (high === Deno.EOF)
                        return [2 /*return*/, Deno.EOF];
                    return [4 /*yield*/, buf.readByte()];
                case 2:
                    low = _a.sent();
                    if (low === Deno.EOF)
                        throw new UnexpectedEOFError();
                    return [2 /*return*/, (high << 8) | low];
            }
        });
    });
}
/** Read big endian 32bit integer from BufReader */
export function readInt(buf) {
    return __awaiter(this, void 0, void 0, function () {
        var high, low;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readShort(buf)];
                case 1:
                    high = _a.sent();
                    if (high === Deno.EOF)
                        return [2 /*return*/, Deno.EOF];
                    return [4 /*yield*/, readShort(buf)];
                case 2:
                    low = _a.sent();
                    if (low === Deno.EOF)
                        throw new UnexpectedEOFError();
                    return [2 /*return*/, (high << 16) | low];
            }
        });
    });
}
var MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
/** Read big endian 64bit long from BufReader */
export function readLong(buf) {
    return __awaiter(this, void 0, void 0, function () {
        var high, low, big;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readInt(buf)];
                case 1:
                    high = _a.sent();
                    if (high === Deno.EOF)
                        return [2 /*return*/, Deno.EOF];
                    return [4 /*yield*/, readInt(buf)];
                case 2:
                    low = _a.sent();
                    if (low === Deno.EOF)
                        throw new UnexpectedEOFError();
                    big = (BigInt(high) << 32n) | BigInt(low);
                    // We probably should provide a similar API that returns BigInt values.
                    if (big > MAX_SAFE_INTEGER) {
                        throw new RangeError("Long value too big to be represented as a Javascript number.");
                    }
                    return [2 /*return*/, Number(big)];
            }
        });
    });
}
/** Slice number into 64bit big endian byte array */
export function sliceLongToBytes(d, dest) {
    if (dest === void 0) { dest = new Array(8); }
    var big = BigInt(d);
    for (var i = 0; i < 8; i++) {
        dest[7 - i] = Number(big & 0xffn);
        big >>= 8n;
    }
    return dest;
}
//# sourceMappingURL=ioutil.js.map