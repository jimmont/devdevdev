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
var Buffer = Deno.Buffer;
import { assertEquals } from "../testing/asserts.ts";
import { copyN, readInt, readLong, readShort, sliceLongToBytes } from "./ioutil.ts";
import { BufReader } from "./bufio.ts";
import { stringsReader } from "./util.ts";
var BinaryReader = /** @class */ (function () {
    function BinaryReader(bytes) {
        if (bytes === void 0) { bytes = new Uint8Array(0); }
        this.bytes = bytes;
        this.index = 0;
    }
    BinaryReader.prototype.read = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                p.set(this.bytes.subarray(this.index, p.byteLength));
                this.index += p.byteLength;
                return [2 /*return*/, p.byteLength];
            });
        });
    };
    return BinaryReader;
}());
Deno.test(function testReadShort() {
    return __awaiter(this, void 0, void 0, function () {
        var r, short;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = new BinaryReader(new Uint8Array([0x12, 0x34]));
                    return [4 /*yield*/, readShort(new BufReader(r))];
                case 1:
                    short = _a.sent();
                    assertEquals(short, 0x1234);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function testReadInt() {
    return __awaiter(this, void 0, void 0, function () {
        var r, int;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = new BinaryReader(new Uint8Array([0x12, 0x34, 0x56, 0x78]));
                    return [4 /*yield*/, readInt(new BufReader(r))];
                case 1:
                    int = _a.sent();
                    assertEquals(int, 0x12345678);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function testReadLong() {
    return __awaiter(this, void 0, void 0, function () {
        var r, long;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = new BinaryReader(new Uint8Array([0x00, 0x00, 0x00, 0x78, 0x12, 0x34, 0x56, 0x78]));
                    return [4 /*yield*/, readLong(new BufReader(r))];
                case 1:
                    long = _a.sent();
                    assertEquals(long, 0x7812345678);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function testReadLong2() {
    return __awaiter(this, void 0, void 0, function () {
        var r, long;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = new BinaryReader(new Uint8Array([0, 0, 0, 0, 0x12, 0x34, 0x56, 0x78]));
                    return [4 /*yield*/, readLong(new BufReader(r))];
                case 1:
                    long = _a.sent();
                    assertEquals(long, 0x12345678);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function testSliceLongToBytes() {
    return __awaiter(this, void 0, void 0, function () {
        var arr, actual, expected;
        return __generator(this, function (_a) {
            arr = sliceLongToBytes(0x1234567890abcdef);
            actual = readLong(new BufReader(new BinaryReader(new Uint8Array(arr))));
            expected = readLong(new BufReader(new BinaryReader(new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x90, 0xab, 0xcd, 0xef]))));
            assertEquals(actual, expected);
            return [2 /*return*/];
        });
    });
});
Deno.test(function testSliceLongToBytes2() {
    return __awaiter(this, void 0, void 0, function () {
        var arr;
        return __generator(this, function (_a) {
            arr = sliceLongToBytes(0x12345678);
            assertEquals(arr, [0, 0, 0, 0, 0x12, 0x34, 0x56, 0x78]);
            return [2 /*return*/];
        });
    });
});
Deno.test(function testCopyN1() {
    return __awaiter(this, void 0, void 0, function () {
        var w, r, n;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    w = new Buffer();
                    r = stringsReader("abcdefghij");
                    return [4 /*yield*/, copyN(w, r, 3)];
                case 1:
                    n = _a.sent();
                    assertEquals(n, 3);
                    assertEquals(w.toString(), "abc");
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function testCopyN2() {
    return __awaiter(this, void 0, void 0, function () {
        var w, r, n;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    w = new Buffer();
                    r = stringsReader("abcdefghij");
                    return [4 /*yield*/, copyN(w, r, 11)];
                case 1:
                    n = _a.sent();
                    assertEquals(n, 10);
                    assertEquals(w.toString(), "abcdefghij");
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=ioutil_test.js.map