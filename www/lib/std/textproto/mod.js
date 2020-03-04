// Based on https://github.com/golang/go/blob/891682/src/net/textproto/
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { UnexpectedEOFError } from "../io/bufio.ts";
import { charCode } from "../io/util.ts";
var asciiDecoder = new TextDecoder();
function str(buf) {
    if (buf == null) {
        return "";
    }
    else {
        return asciiDecoder.decode(buf);
    }
}
var ProtocolError = /** @class */ (function (_super) {
    __extends(ProtocolError, _super);
    function ProtocolError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = "ProtocolError";
        return _this;
    }
    return ProtocolError;
}(Error));
export { ProtocolError };
export function append(a, b) {
    if (a == null) {
        return b;
    }
    else {
        var output = new Uint8Array(a.length + b.length);
        output.set(a, 0);
        output.set(b, a.length);
        return output;
    }
}
var TextProtoReader = /** @class */ (function () {
    function TextProtoReader(r) {
        this.r = r;
    }
    /** readLine() reads a single line from the TextProtoReader,
     * eliding the final \n or \r\n from the returned string.
     */
    TextProtoReader.prototype.readLine = function () {
        return __awaiter(this, void 0, void 0, function () {
            var s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readLineSlice()];
                    case 1:
                        s = _a.sent();
                        if (s === Deno.EOF)
                            return [2 /*return*/, Deno.EOF];
                        return [2 /*return*/, str(s)];
                }
            });
        });
    };
    /** ReadMIMEHeader reads a MIME-style header from r.
     * The header is a sequence of possibly continued Key: Value lines
     * ending in a blank line.
     * The returned map m maps CanonicalMIMEHeaderKey(key) to a
     * sequence of values in the same order encountered in the input.
     *
     * For example, consider this input:
     *
     *	My-Key: Value 1
     *	Long-Key: Even
     *	       Longer Value
     *	My-Key: Value 2
     *
     * Given that input, ReadMIMEHeader returns the map:
     *
     *	map[string][]string{
     *		"My-Key": {"Value 1", "Value 2"},
     *		"Long-Key": {"Even Longer Value"},
     *	}
     */
    TextProtoReader.prototype.readMIMEHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var m, line, buf, kv, i, endKey, key, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        m = new Headers();
                        return [4 /*yield*/, this.r.peek(1)];
                    case 1:
                        buf = _a.sent();
                        if (!(buf === Deno.EOF)) return [3 /*break*/, 2];
                        return [2 /*return*/, Deno.EOF];
                    case 2:
                        if (!(buf[0] == charCode(" ") || buf[0] == charCode("\t"))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.readLineSlice()];
                    case 3:
                        line = (_a.sent());
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.r.peek(1)];
                    case 5:
                        buf = _a.sent();
                        if (buf === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        else if (buf[0] == charCode(" ") || buf[0] == charCode("\t")) {
                            throw new ProtocolError("malformed MIME header initial line: " + str(line));
                        }
                        _a.label = 6;
                    case 6:
                        if (!true) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.readLineSlice()];
                    case 7:
                        kv = _a.sent();
                        if (kv === Deno.EOF)
                            throw new UnexpectedEOFError();
                        if (kv.byteLength === 0)
                            return [2 /*return*/, m];
                        i = kv.indexOf(charCode(":"));
                        if (i < 0) {
                            throw new ProtocolError("malformed MIME header line: " + str(kv));
                        }
                        endKey = i;
                        while (endKey > 0 && kv[endKey - 1] == charCode(" ")) {
                            endKey--;
                        }
                        key = str(kv.subarray(0, endKey));
                        // As per RFC 7230 field-name is a token,
                        // tokens consist of one or more chars.
                        // We could return a ProtocolError here,
                        // but better to be liberal in what we
                        // accept, so if we get an empty key, skip it.
                        if (key == "") {
                            return [3 /*break*/, 6];
                        }
                        // Skip initial spaces in value.
                        i++; // skip colon
                        while (i < kv.byteLength &&
                            (kv[i] == charCode(" ") || kv[i] == charCode("\t"))) {
                            i++;
                        }
                        value = str(kv.subarray(i));
                        // In case of invalid header we swallow the error
                        // example: "Audio Mode" => invalid due to space in the key
                        try {
                            m.append(key, value);
                        }
                        catch (_b) { }
                        return [3 /*break*/, 6];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    TextProtoReader.prototype.readLineSlice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var line, r, l, more;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.r.readLine()];
                    case 1:
                        r = _a.sent();
                        if (r === Deno.EOF)
                            return [2 /*return*/, Deno.EOF];
                        l = r.line, more = r.more;
                        // Avoid the copy if the first call produced a full line.
                        if (!line && !more) {
                            // TODO(ry):
                            // This skipSpace() is definitely misplaced, but I don't know where it
                            // comes from nor how to fix it.
                            if (this.skipSpace(l) === 0) {
                                return [2 /*return*/, new Uint8Array(0)];
                            }
                            return [2 /*return*/, l];
                        }
                        // @ts-ignore
                        line = append(line, l);
                        if (!more) {
                            return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/, line];
                }
            });
        });
    };
    TextProtoReader.prototype.skipSpace = function (l) {
        var n = 0;
        for (var i = 0; i < l.length; i++) {
            if (l[i] === charCode(" ") || l[i] === charCode("\t")) {
                continue;
            }
            n++;
        }
        return n;
    };
    return TextProtoReader;
}());
export { TextProtoReader };
//# sourceMappingURL=mod.js.map