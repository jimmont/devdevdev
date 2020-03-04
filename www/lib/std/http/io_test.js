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
import { AssertionError, assertThrowsAsync, assertEquals, assert, assertNotEOF, assertNotEquals } from "../testing/asserts.js";
import { bodyReader, writeTrailers, readTrailers, parseHTTPVersion, readRequest, writeResponse } from "./io.js";
import { encode, decode } from "../strings/mod.js";
import { BufReader, UnexpectedEOFError } from "../io/bufio.js";
import { chunkedBodyReader } from "./io.js";
import { ServerRequest } from "./server.js";
import { StringReader } from "../io/readers.js";
import { mockConn } from "./mock.js";
var Buffer = Deno.Buffer, test = Deno.test;
test("bodyReader", function () { return __awaiter(void 0, void 0, void 0, function () {
    var text, r, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                text = "Hello, Deno";
                r = bodyReader(text.length, new BufReader(new Buffer(encode(text))));
                _a = assertEquals;
                _b = decode;
                return [4 /*yield*/, Deno.readAll(r)];
            case 1:
                _a.apply(void 0, [_b.apply(void 0, [_c.sent()]), text]);
                return [2 /*return*/];
        }
    });
}); });
function chunkify(n, char) {
    var v = Array.from({ length: n })
        .map(function () { return "" + char; })
        .join("");
    return n.toString(16) + "\r\n" + v + "\r\n";
}
test("chunkedBodyReader", function () { return __awaiter(void 0, void 0, void 0, function () {
    var body, h, r, result, buf, dest, len, exp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = [
                    chunkify(3, "a"),
                    chunkify(5, "b"),
                    chunkify(11, "c"),
                    chunkify(22, "d"),
                    chunkify(0, "")
                ].join("");
                h = new Headers();
                r = chunkedBodyReader(h, new BufReader(new Buffer(encode(body))));
                buf = new Uint8Array(5);
                dest = new Buffer();
                _a.label = 1;
            case 1: return [4 /*yield*/, r.read(buf)];
            case 2:
                if (!((result = _a.sent()) !== Deno.EOF)) return [3 /*break*/, 4];
                len = Math.min(buf.byteLength, result);
                return [4 /*yield*/, dest.write(buf.subarray(0, len))];
            case 3:
                _a.sent();
                return [3 /*break*/, 1];
            case 4:
                exp = "aaabbbbbcccccccccccdddddddddddddddddddddd";
                assertEquals(dest.toString(), exp);
                return [2 /*return*/];
        }
    });
}); });
test("chunkedBodyReader with trailers", function () { return __awaiter(void 0, void 0, void 0, function () {
    var body, h, r, act, _a, exp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                body = [
                    chunkify(3, "a"),
                    chunkify(5, "b"),
                    chunkify(11, "c"),
                    chunkify(22, "d"),
                    chunkify(0, ""),
                    "deno: land\r\n",
                    "node: js\r\n",
                    "\r\n"
                ].join("");
                h = new Headers({
                    trailer: "deno,node"
                });
                r = chunkedBodyReader(h, new BufReader(new Buffer(encode(body))));
                assertEquals(h.has("trailer"), true);
                assertEquals(h.has("deno"), false);
                assertEquals(h.has("node"), false);
                _a = decode;
                return [4 /*yield*/, Deno.readAll(r)];
            case 1:
                act = _a.apply(void 0, [_b.sent()]);
                exp = "aaabbbbbcccccccccccdddddddddddddddddddddd";
                assertEquals(act, exp);
                assertEquals(h.has("trailer"), false);
                assertEquals(h.get("deno"), "land");
                assertEquals(h.get("node"), "js");
                return [2 /*return*/];
        }
    });
}); });
test("readTrailers", function () { return __awaiter(void 0, void 0, void 0, function () {
    var h, trailer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                h = new Headers({
                    trailer: "deno,node"
                });
                trailer = ["deno: land", "node: js", "", ""].join("\r\n");
                return [4 /*yield*/, readTrailers(h, new BufReader(new Buffer(encode(trailer))))];
            case 1:
                _a.sent();
                assertEquals(h.has("trailer"), false);
                assertEquals(h.get("deno"), "land");
                assertEquals(h.get("node"), "js");
                return [2 /*return*/];
        }
    });
}); });
test("readTrailer should throw if undeclared headers found in trailer", function () { return __awaiter(void 0, void 0, void 0, function () {
    var patterns, _loop_1, _i, patterns_1, _a, header, trailer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                patterns = [
                    ["deno,node", "deno: land\r\nnode: js\r\ngo: lang\r\n\r\n"],
                    ["deno", "node: js\r\n\r\n"],
                    ["deno", "node:js\r\ngo: lang\r\n\r\n"]
                ];
                _loop_1 = function (header, trailer) {
                    var h;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                h = new Headers({
                                    trailer: header
                                });
                                return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, readTrailers(h, new BufReader(new Buffer(encode(trailer))))];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, Error, "Undeclared trailer field")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, patterns_1 = patterns;
                _b.label = 1;
            case 1:
                if (!(_i < patterns_1.length)) return [3 /*break*/, 4];
                _a = patterns_1[_i], header = _a[0], trailer = _a[1];
                return [5 /*yield**/, _loop_1(header, trailer)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
test("readTrailer should throw if trailer contains prohibited fields", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_2, _i, _a, f;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _loop_2 = function (f) {
                    var h;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                h = new Headers({
                                    trailer: f
                                });
                                return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, readTrailers(h, new BufReader(new Buffer()))];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, Error, "Prohibited field for trailer")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = ["content-length", "trailer", "transfer-encoding"];
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                f = _a[_i];
                return [5 /*yield**/, _loop_2(f)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
test("writeTrailer", function () { return __awaiter(void 0, void 0, void 0, function () {
    var w;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                w = new Buffer();
                return [4 /*yield*/, writeTrailers(w, new Headers({ "transfer-encoding": "chunked", trailer: "deno,node" }), new Headers({ deno: "land", node: "js" }))];
            case 1:
                _a.sent();
                assertEquals(w.toString(), "deno: land\r\nnode: js\r\n\r\n");
                return [2 /*return*/];
        }
    });
}); });
test("writeTrailer should throw", function () { return __awaiter(void 0, void 0, void 0, function () {
    var w, _loop_3, _i, _a, f;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                w = new Buffer();
                return [4 /*yield*/, assertThrowsAsync(function () {
                        return writeTrailers(w, new Headers(), new Headers());
                    }, Error, 'must have "trailer"')];
            case 1:
                _b.sent();
                return [4 /*yield*/, assertThrowsAsync(function () {
                        return writeTrailers(w, new Headers({ trailer: "deno" }), new Headers());
                    }, Error, "only allowed")];
            case 2:
                _b.sent();
                _loop_3 = function (f) {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, assertThrowsAsync(function () {
                                    var _a;
                                    return writeTrailers(w, new Headers({ "transfer-encoding": "chunked", trailer: f }), new Headers((_a = {}, _a[f] = "1", _a)));
                                }, AssertionError, "prohibited")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = ["content-length", "trailer", "transfer-encoding"];
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                f = _a[_i];
                return [5 /*yield**/, _loop_3(f)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, assertThrowsAsync(function () {
                    return writeTrailers(w, new Headers({ "transfer-encoding": "chunked", trailer: "deno" }), new Headers({ node: "js" }));
                }, AssertionError, "Not trailer")];
            case 7:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
// Ported from https://github.com/golang/go/blob/f5c43b9/src/net/http/request_test.go#L535-L565
test("parseHttpVersion", function () {
    var testCases = [
        { "in": "HTTP/0.9", want: [0, 9] },
        { "in": "HTTP/1.0", want: [1, 0] },
        { "in": "HTTP/1.1", want: [1, 1] },
        { "in": "HTTP/3.14", want: [3, 14] },
        { "in": "HTTP", err: true },
        { "in": "HTTP/one.one", err: true },
        { "in": "HTTP/1.1/", err: true },
        { "in": "HTTP/-1.0", err: true },
        { "in": "HTTP/0.-1", err: true },
        { "in": "HTTP/", err: true },
        { "in": "HTTP/1,0", err: true }
    ];
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        var r = void 0, err = void 0;
        try {
            r = parseHTTPVersion(t["in"]);
        }
        catch (e) {
            err = e;
        }
        if (t.err) {
            assert(err instanceof Error, t["in"]);
        }
        else {
            assertEquals(err, undefined);
            assertEquals(r, t.want, t["in"]);
        }
    }
});
test(function writeUint8ArrayResponse() {
    return __awaiter(this, void 0, void 0, function () {
        var shortText, body, res, buf, decoder, reader, r, _a, _b, _c, _d, eof;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    shortText = "Hello";
                    body = new TextEncoder().encode(shortText);
                    res = { body: body };
                    buf = new Deno.Buffer();
                    return [4 /*yield*/, writeResponse(buf, res)];
                case 1:
                    _e.sent();
                    decoder = new TextDecoder("utf-8");
                    reader = new BufReader(buf);
                    _a = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 2:
                    r = _a.apply(void 0, [_e.sent()]);
                    assertEquals(decoder.decode(r.line), "HTTP/1.1 200 OK");
                    assertEquals(r.more, false);
                    _b = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 3:
                    r = _b.apply(void 0, [_e.sent()]);
                    assertEquals(decoder.decode(r.line), "content-length: " + shortText.length);
                    assertEquals(r.more, false);
                    _c = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 4:
                    r = _c.apply(void 0, [_e.sent()]);
                    assertEquals(r.line.byteLength, 0);
                    assertEquals(r.more, false);
                    _d = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 5:
                    r = _d.apply(void 0, [_e.sent()]);
                    assertEquals(decoder.decode(r.line), shortText);
                    assertEquals(r.more, false);
                    return [4 /*yield*/, reader.readLine()];
                case 6:
                    eof = _e.sent();
                    assertEquals(eof, Deno.EOF);
                    return [2 /*return*/];
            }
        });
    });
});
test(function writeStringResponse() {
    return __awaiter(this, void 0, void 0, function () {
        var body, res, buf, decoder, reader, r, _a, _b, _c, _d, eof;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    body = "Hello";
                    res = { body: body };
                    buf = new Deno.Buffer();
                    return [4 /*yield*/, writeResponse(buf, res)];
                case 1:
                    _e.sent();
                    decoder = new TextDecoder("utf-8");
                    reader = new BufReader(buf);
                    _a = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 2:
                    r = _a.apply(void 0, [_e.sent()]);
                    assertEquals(decoder.decode(r.line), "HTTP/1.1 200 OK");
                    assertEquals(r.more, false);
                    _b = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 3:
                    r = _b.apply(void 0, [_e.sent()]);
                    assertEquals(decoder.decode(r.line), "content-length: " + body.length);
                    assertEquals(r.more, false);
                    _c = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 4:
                    r = _c.apply(void 0, [_e.sent()]);
                    assertEquals(r.line.byteLength, 0);
                    assertEquals(r.more, false);
                    _d = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 5:
                    r = _d.apply(void 0, [_e.sent()]);
                    assertEquals(decoder.decode(r.line), body);
                    assertEquals(r.more, false);
                    return [4 /*yield*/, reader.readLine()];
                case 6:
                    eof = _e.sent();
                    assertEquals(eof, Deno.EOF);
                    return [2 /*return*/];
            }
        });
    });
});
test(function writeStringReaderResponse() {
    return __awaiter(this, void 0, void 0, function () {
        var shortText, body, res, buf, decoder, reader, r, _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    shortText = "Hello";
                    body = new StringReader(shortText);
                    res = { body: body };
                    buf = new Deno.Buffer();
                    return [4 /*yield*/, writeResponse(buf, res)];
                case 1:
                    _g.sent();
                    decoder = new TextDecoder("utf-8");
                    reader = new BufReader(buf);
                    _a = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 2:
                    r = _a.apply(void 0, [_g.sent()]);
                    assertEquals(decoder.decode(r.line), "HTTP/1.1 200 OK");
                    assertEquals(r.more, false);
                    _b = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 3:
                    r = _b.apply(void 0, [_g.sent()]);
                    assertEquals(decoder.decode(r.line), "transfer-encoding: chunked");
                    assertEquals(r.more, false);
                    _c = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 4:
                    r = _c.apply(void 0, [_g.sent()]);
                    assertEquals(r.line.byteLength, 0);
                    assertEquals(r.more, false);
                    _d = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 5:
                    r = _d.apply(void 0, [_g.sent()]);
                    assertEquals(decoder.decode(r.line), shortText.length.toString());
                    assertEquals(r.more, false);
                    _e = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 6:
                    r = _e.apply(void 0, [_g.sent()]);
                    assertEquals(decoder.decode(r.line), shortText);
                    assertEquals(r.more, false);
                    _f = assertNotEOF;
                    return [4 /*yield*/, reader.readLine()];
                case 7:
                    r = _f.apply(void 0, [_g.sent()]);
                    assertEquals(decoder.decode(r.line), "0");
                    assertEquals(r.more, false);
                    return [2 /*return*/];
            }
        });
    });
});
test("writeResponse with trailer", function () { return __awaiter(void 0, void 0, void 0, function () {
    var w, body, ret, exp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                w = new Buffer();
                body = new StringReader("Hello");
                return [4 /*yield*/, writeResponse(w, {
                        status: 200,
                        headers: new Headers({
                            "transfer-encoding": "chunked",
                            trailer: "deno,node"
                        }),
                        body: body,
                        trailers: function () { return new Headers({ deno: "land", node: "js" }); }
                    })];
            case 1:
                _a.sent();
                ret = w.toString();
                exp = [
                    "HTTP/1.1 200 OK",
                    "transfer-encoding: chunked",
                    "trailer: deno,node",
                    "",
                    "5",
                    "Hello",
                    "0",
                    "",
                    "deno: land",
                    "node: js",
                    "",
                    ""
                ].join("\r\n");
                assertEquals(ret, exp);
                return [2 /*return*/];
        }
    });
}); });
test(function readRequestError() {
    return __awaiter(this, void 0, void 0, function () {
        var input, reader, err, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = "GET / HTTP/1.1\nmalformedHeader\n";
                    reader = new BufReader(new StringReader(input));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readRequest(mockConn(), reader)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    err = e_1;
                    return [3 /*break*/, 4];
                case 4:
                    assert(err instanceof Error);
                    assertEquals(err.message, "malformed MIME header line: malformedHeader");
                    return [2 /*return*/];
            }
        });
    });
});
// Ported from Go
// https://github.com/golang/go/blob/go1.12.5/src/net/http/request_test.go#L377-L443
// TODO(zekth) fix tests
test(function testReadRequestError() {
    return __awaiter(this, void 0, void 0, function () {
        var testCases, _i, testCases_2, test_1, reader, err, req, e_2, _a, _b, h;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    testCases = [
                        {
                            "in": "GET / HTTP/1.1\r\nheader: foo\r\n\r\n",
                            headers: [{ key: "header", value: "foo" }]
                        },
                        {
                            "in": "GET / HTTP/1.1\r\nheader:foo\r\n",
                            err: UnexpectedEOFError
                        },
                        { "in": "", err: Deno.EOF },
                        {
                            "in": "HEAD / HTTP/1.1\r\nContent-Length:4\r\n\r\n",
                            err: "http: method cannot contain a Content-Length"
                        },
                        {
                            "in": "HEAD / HTTP/1.1\r\n\r\n",
                            headers: []
                        },
                        // Multiple Content-Length values should either be
                        // deduplicated if same or reject otherwise
                        // See Issue 16490.
                        {
                            "in": "POST / HTTP/1.1\r\nContent-Length: 10\r\nContent-Length: 0\r\n\r\n" +
                                "Gopher hey\r\n",
                            err: "cannot contain multiple Content-Length headers"
                        },
                        {
                            "in": "POST / HTTP/1.1\r\nContent-Length: 10\r\nContent-Length: 6\r\n\r\n" +
                                "Gopher\r\n",
                            err: "cannot contain multiple Content-Length headers"
                        },
                        {
                            "in": "PUT / HTTP/1.1\r\nContent-Length: 6 \r\nContent-Length: 6\r\n" +
                                "Content-Length:6\r\n\r\nGopher\r\n",
                            headers: [{ key: "Content-Length", value: "6" }]
                        },
                        {
                            "in": "PUT / HTTP/1.1\r\nContent-Length: 1\r\nContent-Length: 6 \r\n\r\n",
                            err: "cannot contain multiple Content-Length headers"
                        },
                        // Setting an empty header is swallowed by textproto
                        // see: readMIMEHeader()
                        // {
                        //   in: "POST / HTTP/1.1\r\nContent-Length:\r\nContent-Length: 3\r\n\r\n",
                        //   err: "cannot contain multiple Content-Length headers"
                        // },
                        {
                            "in": "HEAD / HTTP/1.1\r\nContent-Length:0\r\nContent-Length: 0\r\n\r\n",
                            headers: [{ key: "Content-Length", value: "0" }]
                        },
                        {
                            "in": "POST / HTTP/1.1\r\nContent-Length:0\r\ntransfer-encoding: " +
                                "chunked\r\n\r\n",
                            headers: [],
                            err: "http: Transfer-Encoding and Content-Length cannot be send together"
                        }
                    ];
                    _i = 0, testCases_2 = testCases;
                    _c.label = 1;
                case 1:
                    if (!(_i < testCases_2.length)) return [3 /*break*/, 7];
                    test_1 = testCases_2[_i];
                    reader = new BufReader(new StringReader(test_1["in"]));
                    err = void 0;
                    req = void 0;
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, readRequest(mockConn(), reader)];
                case 3:
                    req = _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _c.sent();
                    err = e_2;
                    return [3 /*break*/, 5];
                case 5:
                    if (test_1.err === Deno.EOF) {
                        assertEquals(req, Deno.EOF);
                    }
                    else if (typeof test_1.err === "string") {
                        assertEquals(err.message, test_1.err);
                    }
                    else if (test_1.err) {
                        assert(err instanceof test_1.err);
                    }
                    else {
                        assert(req instanceof ServerRequest);
                        assert(test_1.headers);
                        assertEquals(err, undefined);
                        assertNotEquals(req, Deno.EOF);
                        for (_a = 0, _b = test_1.headers; _a < _b.length; _a++) {
                            h = _b[_a];
                            assertEquals(req.headers.get(h.key), h.value);
                        }
                    }
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=io_test.js.map
