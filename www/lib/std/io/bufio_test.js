// Based on https://github.com/golang/go/blob/891682/src/bufio/bufio_test.go
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var Buffer = Deno.Buffer;
import { assert, assertEquals, fail, assertNotEOF } from "../testing/asserts.ts";
import { BufReader, BufWriter, BufferFullError, UnexpectedEOFError, readStringDelim, readLines } from "./bufio.ts";
import * as iotest from "./iotest.ts";
import { charCode, copyBytes, stringsReader } from "./util.ts";
var encoder = new TextEncoder();
function readBytes(buf) {
    return __awaiter(this, void 0, void 0, function () {
        var b, nb, c, decoder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    b = new Uint8Array(1000);
                    nb = 0;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, buf.readByte()];
                case 2:
                    c = _a.sent();
                    if (c === Deno.EOF) {
                        return [3 /*break*/, 3]; // EOF
                    }
                    b[nb] = c;
                    nb++;
                    return [3 /*break*/, 1];
                case 3:
                    decoder = new TextDecoder();
                    return [2 /*return*/, decoder.decode(b.subarray(0, nb))];
            }
        });
    });
}
Deno.test(function bufioReaderSimple() {
    return __awaiter(this, void 0, void 0, function () {
        var data, b, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = "hello world";
                    b = new BufReader(stringsReader(data));
                    return [4 /*yield*/, readBytes(b)];
                case 1:
                    s = _a.sent();
                    assertEquals(s, data);
                    return [2 /*return*/];
            }
        });
    });
});
var readMakers = [
    { name: "full", fn: function (r) { return r; } },
    {
        name: "byte",
        fn: function (r) { return new iotest.OneByteReader(r); }
    },
    { name: "half", fn: function (r) { return new iotest.HalfReader(r); } }
    // TODO { name: "data+err", r => new iotest.DataErrReader(r) },
    // { name: "timeout", fn: r => new iotest.TimeoutReader(r) },
];
// Call read to accumulate the text of a file
function reads(buf, m) {
    return __awaiter(this, void 0, void 0, function () {
        var b, nb, result, decoder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    b = new Uint8Array(1000);
                    nb = 0;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, buf.read(b.subarray(nb, nb + m))];
                case 2:
                    result = _a.sent();
                    if (result === Deno.EOF) {
                        return [3 /*break*/, 3];
                    }
                    nb += result;
                    return [3 /*break*/, 1];
                case 3:
                    decoder = new TextDecoder();
                    return [2 /*return*/, decoder.decode(b.subarray(0, nb))];
            }
        });
    });
}
var bufreaders = [
    { name: "1", fn: function (b) { return reads(b, 1); } },
    { name: "2", fn: function (b) { return reads(b, 2); } },
    { name: "3", fn: function (b) { return reads(b, 3); } },
    { name: "4", fn: function (b) { return reads(b, 4); } },
    { name: "5", fn: function (b) { return reads(b, 5); } },
    { name: "7", fn: function (b) { return reads(b, 7); } },
    { name: "bytes", fn: readBytes }
    // { name: "lines", fn: readLines },
];
var MIN_READ_BUFFER_SIZE = 16;
var bufsizes = [
    0,
    MIN_READ_BUFFER_SIZE,
    23,
    32,
    46,
    64,
    93,
    128,
    1024,
    4096
];
Deno.test(function bufioBufReader() {
    return __awaiter(this, void 0, void 0, function () {
        var texts, str, all, i, _i, texts_1, text, _a, readMakers_1, readmaker, _b, bufreaders_1, bufreader, _c, bufsizes_1, bufsize, read, buf, s, debugStr;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    texts = new Array(31);
                    str = "";
                    all = "";
                    for (i = 0; i < texts.length - 1; i++) {
                        texts[i] = str + "\n";
                        all += texts[i];
                        str += String.fromCharCode((i % 26) + 97);
                    }
                    texts[texts.length - 1] = all;
                    _i = 0, texts_1 = texts;
                    _d.label = 1;
                case 1:
                    if (!(_i < texts_1.length)) return [3 /*break*/, 10];
                    text = texts_1[_i];
                    _a = 0, readMakers_1 = readMakers;
                    _d.label = 2;
                case 2:
                    if (!(_a < readMakers_1.length)) return [3 /*break*/, 9];
                    readmaker = readMakers_1[_a];
                    _b = 0, bufreaders_1 = bufreaders;
                    _d.label = 3;
                case 3:
                    if (!(_b < bufreaders_1.length)) return [3 /*break*/, 8];
                    bufreader = bufreaders_1[_b];
                    _c = 0, bufsizes_1 = bufsizes;
                    _d.label = 4;
                case 4:
                    if (!(_c < bufsizes_1.length)) return [3 /*break*/, 7];
                    bufsize = bufsizes_1[_c];
                    read = readmaker.fn(stringsReader(text));
                    buf = new BufReader(read, bufsize);
                    return [4 /*yield*/, bufreader.fn(buf)];
                case 5:
                    s = _d.sent();
                    debugStr = "reader=" + readmaker.name + " " +
                        ("fn=" + bufreader.name + " bufsize=" + bufsize + " want=" + text + " got=" + s);
                    assertEquals(s, text, debugStr);
                    _d.label = 6;
                case 6:
                    _c++;
                    return [3 /*break*/, 4];
                case 7:
                    _b++;
                    return [3 /*break*/, 3];
                case 8:
                    _a++;
                    return [3 /*break*/, 2];
                case 9:
                    _i++;
                    return [3 /*break*/, 1];
                case 10: return [2 /*return*/];
            }
        });
    });
});
Deno.test(function bufioBufferFull() {
    return __awaiter(this, void 0, void 0, function () {
        var longString, buf, decoder, err_1, line, _a, actual;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    longString = "And now, hello, world! It is the time for all good men to come to the" +
                        " aid of their party";
                    buf = new BufReader(stringsReader(longString), MIN_READ_BUFFER_SIZE);
                    decoder = new TextDecoder();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, buf.readSlice(charCode("!"))];
                case 2:
                    _b.sent();
                    fail("readSlice should throw");
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    assert(err_1 instanceof BufferFullError);
                    assert(err_1.partial instanceof Uint8Array);
                    assertEquals(decoder.decode(err_1.partial), "And now, hello, ");
                    return [3 /*break*/, 4];
                case 4:
                    _a = assertNotEOF;
                    return [4 /*yield*/, buf.readSlice(charCode("!"))];
                case 5:
                    line = _a.apply(void 0, [_b.sent()]);
                    actual = decoder.decode(line);
                    assertEquals(actual, "world!");
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function bufioReadString() {
    return __awaiter(this, void 0, void 0, function () {
        var string, buf, line, _a, line2, _b, _c, err_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    string = "And now, hello world!";
                    buf = new BufReader(stringsReader(string), MIN_READ_BUFFER_SIZE);
                    _a = assertNotEOF;
                    return [4 /*yield*/, buf.readString(",")];
                case 1:
                    line = _a.apply(void 0, [_d.sent()]);
                    assertEquals(line, "And now,");
                    assertEquals(line.length, 8);
                    _b = assertNotEOF;
                    return [4 /*yield*/, buf.readString(",")];
                case 2:
                    line2 = _b.apply(void 0, [_d.sent()]);
                    assertEquals(line2, " hello world!");
                    _c = assertEquals;
                    return [4 /*yield*/, buf.readString(",")];
                case 3:
                    _c.apply(void 0, [_d.sent(), Deno.EOF]);
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, buf.readString("deno")];
                case 5:
                    _d.sent();
                    fail("should throw");
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _d.sent();
                    assert(err_2.message, "Delimiter should be a single character");
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
var testInput = encoder.encode("012\n345\n678\n9ab\ncde\nfgh\nijk\nlmn\nopq\nrst\nuvw\nxy");
var testInputrn = encoder.encode("012\r\n345\r\n678\r\n9ab\r\ncde\r\nfgh\r\nijk\r\nlmn\r\nopq\r\nrst\r\n" +
    "uvw\r\nxy\r\n\n\r\n");
var testOutput = encoder.encode("0123456789abcdefghijklmnopqrstuvwxy");
// TestReader wraps a Uint8Array and returns reads of a specific length.
var TestReader = /** @class */ (function () {
    function TestReader(data, stride) {
        this.data = data;
        this.stride = stride;
    }
    TestReader.prototype.read = function (buf) {
        return __awaiter(this, void 0, void 0, function () {
            var nread;
            return __generator(this, function (_a) {
                nread = this.stride;
                if (nread > this.data.byteLength) {
                    nread = this.data.byteLength;
                }
                if (nread > buf.byteLength) {
                    nread = buf.byteLength;
                }
                if (nread === 0) {
                    return [2 /*return*/, Deno.EOF];
                }
                copyBytes(buf, this.data);
                this.data = this.data.subarray(nread);
                return [2 /*return*/, nread];
            });
        });
    };
    return TestReader;
}());
function testReadLine(input) {
    return __awaiter(this, void 0, void 0, function () {
        var stride, done, reader, l, r, line, more, want;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stride = 1;
                    _a.label = 1;
                case 1:
                    if (!(stride < 2)) return [3 /*break*/, 6];
                    done = 0;
                    reader = new TestReader(input, stride);
                    l = new BufReader(reader, input.byteLength + 1);
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, l.readLine()];
                case 3:
                    r = _a.sent();
                    if (r === Deno.EOF) {
                        return [3 /*break*/, 4];
                    }
                    line = r.line, more = r.more;
                    assertEquals(more, false);
                    want = testOutput.subarray(done, done + line.byteLength);
                    assertEquals(line, want, "Bad line at stride " + stride + ": want: " + want + " got: " + line);
                    done += line.byteLength;
                    return [3 /*break*/, 2];
                case 4:
                    assertEquals(done, testOutput.byteLength, "readLine didn't return everything: got: " + done + ", " +
                        ("want: " + testOutput + " (stride: " + stride + ")"));
                    _a.label = 5;
                case 5:
                    stride++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
Deno.test(function bufioReadLine() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testReadLine(testInput)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testReadLine(testInputrn)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function bufioPeek() {
    return __awaiter(this, void 0, void 0, function () {
        var decoder, p, buf, actual, _a, _b, err_3, _c, _d, _e, _f, res, _g, _h, r;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    decoder = new TextDecoder();
                    p = new Uint8Array(10);
                    buf = new BufReader(stringsReader("abcdefghijklmnop"), MIN_READ_BUFFER_SIZE);
                    _a = assertNotEOF;
                    return [4 /*yield*/, buf.peek(1)];
                case 1:
                    actual = _a.apply(void 0, [_j.sent()]);
                    assertEquals(decoder.decode(actual), "a");
                    _b = assertNotEOF;
                    return [4 /*yield*/, buf.peek(4)];
                case 2:
                    actual = _b.apply(void 0, [_j.sent()]);
                    assertEquals(decoder.decode(actual), "abcd");
                    _j.label = 3;
                case 3:
                    _j.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, buf.peek(32)];
                case 4:
                    _j.sent();
                    fail("peek() should throw");
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _j.sent();
                    assert(err_3 instanceof BufferFullError);
                    assert(err_3.partial instanceof Uint8Array);
                    assertEquals(decoder.decode(err_3.partial), "abcdefghijklmnop");
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, buf.read(p.subarray(0, 3))];
                case 7:
                    _j.sent();
                    assertEquals(decoder.decode(p.subarray(0, 3)), "abc");
                    _c = assertNotEOF;
                    return [4 /*yield*/, buf.peek(1)];
                case 8:
                    actual = _c.apply(void 0, [_j.sent()]);
                    assertEquals(decoder.decode(actual), "d");
                    _d = assertNotEOF;
                    return [4 /*yield*/, buf.peek(1)];
                case 9:
                    actual = _d.apply(void 0, [_j.sent()]);
                    assertEquals(decoder.decode(actual), "d");
                    _e = assertNotEOF;
                    return [4 /*yield*/, buf.peek(1)];
                case 10:
                    actual = _e.apply(void 0, [_j.sent()]);
                    assertEquals(decoder.decode(actual), "d");
                    _f = assertNotEOF;
                    return [4 /*yield*/, buf.peek(2)];
                case 11:
                    actual = _f.apply(void 0, [_j.sent()]);
                    assertEquals(decoder.decode(actual), "de");
                    return [4 /*yield*/, buf.read(p.subarray(0, 3))];
                case 12:
                    res = _j.sent();
                    assertEquals(decoder.decode(p.subarray(0, 3)), "def");
                    assert(res !== Deno.EOF);
                    _g = assertNotEOF;
                    return [4 /*yield*/, buf.peek(4)];
                case 13:
                    actual = _g.apply(void 0, [_j.sent()]);
                    assertEquals(decoder.decode(actual), "ghij");
                    return [4 /*yield*/, buf.read(p)];
                case 14:
                    _j.sent();
                    assertEquals(decoder.decode(p), "ghijklmnop");
                    _h = assertNotEOF;
                    return [4 /*yield*/, buf.peek(0)];
                case 15:
                    actual = _h.apply(void 0, [_j.sent()]);
                    assertEquals(decoder.decode(actual), "");
                    return [4 /*yield*/, buf.peek(1)];
                case 16:
                    r = _j.sent();
                    assert(r === Deno.EOF);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function bufioWriter() {
    return __awaiter(this, void 0, void 0, function () {
        var data, i, w, _i, bufsizes_2, nwrite, _a, bufsizes_3, bs, buf, context, n, written, l;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    data = new Uint8Array(8192);
                    for (i = 0; i < data.byteLength; i++) {
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        data[i] = charCode(" ") + (i % (charCode("~") - charCode(" ")));
                    }
                    w = new Buffer();
                    _i = 0, bufsizes_2 = bufsizes;
                    _b.label = 1;
                case 1:
                    if (!(_i < bufsizes_2.length)) return [3 /*break*/, 7];
                    nwrite = bufsizes_2[_i];
                    _a = 0, bufsizes_3 = bufsizes;
                    _b.label = 2;
                case 2:
                    if (!(_a < bufsizes_3.length)) return [3 /*break*/, 6];
                    bs = bufsizes_3[_a];
                    // Write nwrite bytes using buffer size bs.
                    // Check that the right amount makes it out
                    // and that the data is correct.
                    w.reset();
                    buf = new BufWriter(w, bs);
                    context = "nwrite=" + nwrite + " bufsize=" + bs;
                    return [4 /*yield*/, buf.write(data.subarray(0, nwrite))];
                case 3:
                    n = _b.sent();
                    assertEquals(n, nwrite, context);
                    return [4 /*yield*/, buf.flush()];
                case 4:
                    _b.sent();
                    written = w.bytes();
                    assertEquals(written.byteLength, nwrite);
                    for (l = 0; l < written.byteLength; l++) {
                        assertEquals(written[l], data[l]);
                    }
                    _b.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 2];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
});
Deno.test(function bufReaderReadFull() {
    return __awaiter(this, void 0, void 0, function () {
        var enc, dec, text, data, bufr, buf, r, _a, buf, err_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    enc = new TextEncoder();
                    dec = new TextDecoder();
                    text = "Hello World";
                    data = new Buffer(enc.encode(text));
                    bufr = new BufReader(data, 3);
                    buf = new Uint8Array(6);
                    _a = assertNotEOF;
                    return [4 /*yield*/, bufr.readFull(buf)];
                case 1:
                    r = _a.apply(void 0, [_b.sent()]);
                    assertEquals(r, buf);
                    assertEquals(dec.decode(buf), "Hello ");
                    buf = new Uint8Array(6);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, bufr.readFull(buf)];
                case 3:
                    _b.sent();
                    fail("readFull() should throw");
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _b.sent();
                    assert(err_4 instanceof UnexpectedEOFError);
                    assert(err_4.partial instanceof Uint8Array);
                    assertEquals(err_4.partial.length, 5);
                    assertEquals(dec.decode(buf.subarray(0, 5)), "World");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
Deno.test(function readStringDelimAndLines() {
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function () {
        var enc, data, chunks_, _c, _d, c, e_1_1, linesData, lines_, _e, _f, l, e_2_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    enc = new TextEncoder();
                    data = new Buffer(enc.encode("Hello World\tHello World 2\tHello World 3"));
                    chunks_ = [];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 6, 7, 12]);
                    _c = __asyncValues(readStringDelim(data, "\t"));
                    _g.label = 2;
                case 2: return [4 /*yield*/, _c.next()];
                case 3:
                    if (!(_d = _g.sent(), !_d.done)) return [3 /*break*/, 5];
                    c = _d.value;
                    chunks_.push(c);
                    _g.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _g.trys.push([7, , 10, 11]);
                    if (!(_d && !_d.done && (_a = _c["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(_c)];
                case 8:
                    _g.sent();
                    _g.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    assertEquals(chunks_.length, 3);
                    assertEquals(chunks_, ["Hello World", "Hello World 2", "Hello World 3"]);
                    linesData = new Buffer(enc.encode("0\n1\n2\n3\n4\n5\n6\n7\n8\n9"));
                    lines_ = [];
                    _g.label = 13;
                case 13:
                    _g.trys.push([13, 18, 19, 24]);
                    _e = __asyncValues(readLines(linesData));
                    _g.label = 14;
                case 14: return [4 /*yield*/, _e.next()];
                case 15:
                    if (!(_f = _g.sent(), !_f.done)) return [3 /*break*/, 17];
                    l = _f.value;
                    lines_.push(l);
                    _g.label = 16;
                case 16: return [3 /*break*/, 14];
                case 17: return [3 /*break*/, 24];
                case 18:
                    e_2_1 = _g.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 24];
                case 19:
                    _g.trys.push([19, , 22, 23]);
                    if (!(_f && !_f.done && (_b = _e["return"]))) return [3 /*break*/, 21];
                    return [4 /*yield*/, _b.call(_e)];
                case 20:
                    _g.sent();
                    _g.label = 21;
                case 21: return [3 /*break*/, 23];
                case 22:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 23: return [7 /*endfinally*/];
                case 24:
                    assertEquals(lines_.length, 10);
                    assertEquals(lines_, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=bufio_test.js.map