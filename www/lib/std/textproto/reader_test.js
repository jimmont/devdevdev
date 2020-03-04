// Based on https://github.com/golang/go/blob/master/src/net/textproto/reader_test.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
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
import { BufReader } from "../io/bufio.ts";
import { TextProtoReader, ProtocolError } from "./mod.ts";
import { stringsReader } from "../io/util.ts";
import { assert, assertEquals, assertThrows, assertNotEOF } from "../testing/asserts.ts";
var test = Deno.test;
function reader(s) {
    return new TextProtoReader(new BufReader(stringsReader(s)));
}
// test({
//   name: "[textproto] Reader : DotBytes",
//   async fn(): Promise<void> {
//     const input =
//       "dotlines\r\n.foo\r\n..bar\n...baz\nquux\r\n\r\n.\r\nanot.her\r\n";
//   }
// });
test(function textprotoReadEmpty() {
    return __awaiter(this, void 0, void 0, function () {
        var r, m;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = reader("");
                    return [4 /*yield*/, r.readMIMEHeader()];
                case 1:
                    m = _a.sent();
                    assertEquals(m, Deno.EOF);
                    return [2 /*return*/];
            }
        });
    });
});
test(function textprotoReader() {
    return __awaiter(this, void 0, void 0, function () {
        var r, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = reader("line1\nline2\n");
                    return [4 /*yield*/, r.readLine()];
                case 1:
                    s = _a.sent();
                    assertEquals(s, "line1");
                    return [4 /*yield*/, r.readLine()];
                case 2:
                    s = _a.sent();
                    assertEquals(s, "line2");
                    return [4 /*yield*/, r.readLine()];
                case 3:
                    s = _a.sent();
                    assert(s === Deno.EOF);
                    return [2 /*return*/];
            }
        });
    });
});
test({
    name: "[textproto] Reader : MIME Header",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, r, m, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        input = "my-key: Value 1  \r\nLong-key: Even Longer Value\r\nmy-Key: " +
                            "Value 2\r\n\n";
                        r = reader(input);
                        _a = assertNotEOF;
                        return [4 /*yield*/, r.readMIMEHeader()];
                    case 1:
                        m = _a.apply(void 0, [_b.sent()]);
                        assertEquals(m.get("My-Key"), "Value 1, Value 2");
                        assertEquals(m.get("Long-key"), "Even Longer Value");
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "[textproto] Reader : MIME Header Single",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, r, m, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        input = "Foo: bar\n\n";
                        r = reader(input);
                        _a = assertNotEOF;
                        return [4 /*yield*/, r.readMIMEHeader()];
                    case 1:
                        m = _a.apply(void 0, [_b.sent()]);
                        assertEquals(m.get("Foo"), "bar");
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "[textproto] Reader : MIME Header No Key",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, r, m, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        input = ": bar\ntest-1: 1\n\n";
                        r = reader(input);
                        _a = assertNotEOF;
                        return [4 /*yield*/, r.readMIMEHeader()];
                    case 1:
                        m = _a.apply(void 0, [_b.sent()]);
                        assertEquals(m.get("Test-1"), "1");
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "[textproto] Reader : Large MIME Header",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, i, sdata, r, m, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = [];
                        // Go test is 16*1024. But seems it can't handle more
                        for (i = 0; i < 1024; i++) {
                            data.push("x");
                        }
                        sdata = data.join("");
                        r = reader("Cookie: " + sdata + "\r\n\r\n");
                        _a = assertNotEOF;
                        return [4 /*yield*/, r.readMIMEHeader()];
                    case 1:
                        m = _a.apply(void 0, [_b.sent()]);
                        assertEquals(m.get("Cookie"), sdata);
                        return [2 /*return*/];
                }
            });
        });
    }
});
// Test that we read slightly-bogus MIME headers seen in the wild,
// with spaces before colons, and spaces in keys.
test({
    name: "[textproto] Reader : MIME Header Non compliant",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, r, m, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        input = "Foo: bar\r\n" +
                            "Content-Language: en\r\n" +
                            "SID : 0\r\n" +
                            "Audio Mode : None\r\n" +
                            "Privilege : 127\r\n\r\n";
                        r = reader(input);
                        _a = assertNotEOF;
                        return [4 /*yield*/, r.readMIMEHeader()];
                    case 1:
                        m = _a.apply(void 0, [_b.sent()]);
                        assertEquals(m.get("Foo"), "bar");
                        assertEquals(m.get("Content-Language"), "en");
                        assertEquals(m.get("SID"), "0");
                        assertEquals(m.get("Privilege"), "127");
                        // Not a legal http header
                        assertThrows(function () {
                            assertEquals(m.get("Audio Mode"), "None");
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "[textproto] Reader : MIME Header Malformed",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, r, err, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = [
                            "No colon first line\r\nFoo: foo\r\n\r\n",
                            " No colon first line with leading space\r\nFoo: foo\r\n\r\n",
                            "\tNo colon first line with leading tab\r\nFoo: foo\r\n\r\n",
                            " First: line with leading space\r\nFoo: foo\r\n\r\n",
                            "\tFirst: line with leading tab\r\nFoo: foo\r\n\r\n",
                            "Foo: foo\r\nNo colon second line\r\n\r\n"
                        ];
                        r = reader(input.join(""));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, r.readMIMEHeader()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        err = e_1;
                        return [3 /*break*/, 4];
                    case 4:
                        assert(err instanceof ProtocolError);
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "[textproto] Reader : MIME Header Trim Continued",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, r, err, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = "" + // for code formatting purpose.
                            "a:\n" +
                            " 0 \r\n" +
                            "b:1 \t\r\n" +
                            "c: 2\r\n" +
                            " 3\t\n" +
                            "  \t 4  \r\n\n";
                        r = reader(input);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, r.readMIMEHeader()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        err = e_2;
                        return [3 /*break*/, 4];
                    case 4:
                        assert(err instanceof ProtocolError);
                        return [2 /*return*/];
                }
            });
        });
    }
});
test({
    name: "[textproto] #409 issue : multipart form boundary",
    fn: function () {
        return __awaiter(this, void 0, void 0, function () {
            var input, r, m, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        input = [
                            "Accept: */*\r\n",
                            'Content-Disposition: form-data; name="test"\r\n',
                            " \r\n",
                            "------WebKitFormBoundaryimeZ2Le9LjohiUiG--\r\n\n"
                        ];
                        r = reader(input.join(""));
                        _a = assertNotEOF;
                        return [4 /*yield*/, r.readMIMEHeader()];
                    case 1:
                        m = _a.apply(void 0, [_b.sent()]);
                        assertEquals(m.get("Accept"), "*/*");
                        assertEquals(m.get("Content-Disposition"), 'form-data; name="test"');
                        return [2 /*return*/];
                }
            });
        });
    }
});
//# sourceMappingURL=reader_test.js.map