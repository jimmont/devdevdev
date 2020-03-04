// Copyright 2010 The Go Authors. All rights reserved.
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
// Ported from
// https://github.com/golang/go/blob/master/src/net/http/responsewrite_test.go
import { TextProtoReader } from "../textproto/mod.ts";
import { assert, assertEquals, assertNotEOF } from "../testing/asserts.ts";
import { ServerRequest, serve } from "./server.ts";
import { BufReader, BufWriter } from "../io/bufio.ts";
import { delay, deferred } from "../util/async.ts";
import { encode, decode } from "../strings/mod.ts";
import { mockConn } from "./mock.ts";
var Buffer = Deno.Buffer, test = Deno.test;
var responseTests = [
    // Default response
    {
        response: {},
        raw: "HTTP/1.1 200 OK\r\n" + "content-length: 0" + "\r\n\r\n"
    },
    // Empty body with status
    {
        response: {
            status: 404
        },
        raw: "HTTP/1.1 404 Not Found\r\n" + "content-length: 0" + "\r\n\r\n"
    },
    // HTTP/1.1, chunked coding; empty trailer; close
    {
        response: {
            status: 200,
            body: new Buffer(new TextEncoder().encode("abcdef"))
        },
        raw: "HTTP/1.1 200 OK\r\n" +
            "transfer-encoding: chunked\r\n\r\n" +
            "6\r\nabcdef\r\n0\r\n\r\n"
    }
];
test(function responseWrite() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, responseTests_1, testCase, buf, bufw, request;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, responseTests_1 = responseTests;
                    _a.label = 1;
                case 1:
                    if (!(_i < responseTests_1.length)) return [3 /*break*/, 5];
                    testCase = responseTests_1[_i];
                    buf = new Buffer();
                    bufw = new BufWriter(buf);
                    request = new ServerRequest();
                    request.w = bufw;
                    request.conn = mockConn();
                    return [4 /*yield*/, request.respond(testCase.response)];
                case 2:
                    _a.sent();
                    assertEquals(buf.toString(), testCase.raw);
                    return [4 /*yield*/, request.done];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
});
test(function requestContentLength() {
    return __awaiter(this, void 0, void 0, function () {
        var req, buf, shortText, req, chunksData, chunkOffset, maxChunkSize, chunkSize, buf;
        return __generator(this, function (_a) {
            // Has content length
            {
                req = new ServerRequest();
                req.headers = new Headers();
                req.headers.set("content-length", "5");
                buf = new Buffer(encode("Hello"));
                req.r = new BufReader(buf);
                assertEquals(req.contentLength, 5);
            }
            // No content length
            {
                shortText = "Hello";
                req = new ServerRequest();
                req.headers = new Headers();
                req.headers.set("transfer-encoding", "chunked");
                chunksData = "";
                chunkOffset = 0;
                maxChunkSize = 70;
                while (chunkOffset < shortText.length) {
                    chunkSize = Math.min(maxChunkSize, shortText.length - chunkOffset);
                    chunksData += chunkSize.toString(16) + "\r\n" + shortText.substr(chunkOffset, chunkSize) + "\r\n";
                    chunkOffset += chunkSize;
                }
                chunksData += "0\r\n\r\n";
                buf = new Buffer(encode(chunksData));
                req.r = new BufReader(buf);
                assertEquals(req.contentLength, null);
            }
            return [2 /*return*/];
        });
    });
});
function totalReader(r) {
    var _total = 0;
    function read(p) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, r.read(p)];
                    case 1:
                        result = _a.sent();
                        if (typeof result === "number") {
                            _total += result;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    }
    return {
        read: read,
        get total() {
            return _total;
        }
    };
}
test(function requestBodyWithContentLength() {
    return __awaiter(this, void 0, void 0, function () {
        var req, buf, body, _a, longText, req, buf, body, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    req = new ServerRequest();
                    req.headers = new Headers();
                    req.headers.set("content-length", "5");
                    buf = new Buffer(encode("Hello"));
                    req.r = new BufReader(buf);
                    _a = decode;
                    return [4 /*yield*/, Deno.readAll(req.body)];
                case 1:
                    body = _a.apply(void 0, [_c.sent()]);
                    assertEquals(body, "Hello");
                    longText = "1234\n".repeat(1000);
                    req = new ServerRequest();
                    req.headers = new Headers();
                    req.headers.set("Content-Length", "5000");
                    buf = new Buffer(encode(longText));
                    req.r = new BufReader(buf);
                    _b = decode;
                    return [4 /*yield*/, Deno.readAll(req.body)];
                case 2:
                    body = _b.apply(void 0, [_c.sent()]);
                    assertEquals(body, longText);
                    return [2 /*return*/];
            }
        });
    });
});
test("ServerRequest.finalize() should consume unread body / content-length", function () { return __awaiter(void 0, void 0, void 0, function () {
    var text, req, tr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = "deno.land";
                req = new ServerRequest();
                req.headers = new Headers();
                req.headers.set("content-length", "" + text.length);
                tr = totalReader(new Buffer(encode(text)));
                req.r = new BufReader(tr);
                req.w = new BufWriter(new Buffer());
                return [4 /*yield*/, req.respond({ status: 200, body: "ok" })];
            case 1:
                _a.sent();
                assertEquals(tr.total, 0);
                return [4 /*yield*/, req.finalize()];
            case 2:
                _a.sent();
                assertEquals(tr.total, text.length);
                return [2 /*return*/];
        }
    });
}); });
test("ServerRequest.finalize() should consume unread body / chunked, trailers", function () { return __awaiter(void 0, void 0, void 0, function () {
    var text, req, body, tr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = [
                    "5",
                    "Hello",
                    "4",
                    "Deno",
                    "0",
                    "",
                    "deno: land",
                    "node: js",
                    "",
                    ""
                ].join("\r\n");
                req = new ServerRequest();
                req.headers = new Headers();
                req.headers.set("transfer-encoding", "chunked");
                req.headers.set("trailer", "deno,node");
                body = encode(text);
                tr = totalReader(new Buffer(body));
                req.r = new BufReader(tr);
                req.w = new BufWriter(new Buffer());
                return [4 /*yield*/, req.respond({ status: 200, body: "ok" })];
            case 1:
                _a.sent();
                assertEquals(tr.total, 0);
                assertEquals(req.headers.has("trailer"), true);
                assertEquals(req.headers.has("deno"), false);
                assertEquals(req.headers.has("node"), false);
                return [4 /*yield*/, req.finalize()];
            case 2:
                _a.sent();
                assertEquals(tr.total, body.byteLength);
                assertEquals(req.headers.has("trailer"), false);
                assertEquals(req.headers.get("deno"), "land");
                assertEquals(req.headers.get("node"), "js");
                return [2 /*return*/];
        }
    });
}); });
test(function requestBodyWithTransferEncoding() {
    return __awaiter(this, void 0, void 0, function () {
        var shortText, req, chunksData, chunkOffset, maxChunkSize, chunkSize, buf, body, _a, longText, req, chunksData, chunkOffset, maxChunkSize, chunkSize, buf, body, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    shortText = "Hello";
                    req = new ServerRequest();
                    req.headers = new Headers();
                    req.headers.set("transfer-encoding", "chunked");
                    chunksData = "";
                    chunkOffset = 0;
                    maxChunkSize = 70;
                    while (chunkOffset < shortText.length) {
                        chunkSize = Math.min(maxChunkSize, shortText.length - chunkOffset);
                        chunksData += chunkSize.toString(16) + "\r\n" + shortText.substr(chunkOffset, chunkSize) + "\r\n";
                        chunkOffset += chunkSize;
                    }
                    chunksData += "0\r\n\r\n";
                    buf = new Buffer(encode(chunksData));
                    req.r = new BufReader(buf);
                    _a = decode;
                    return [4 /*yield*/, Deno.readAll(req.body)];
                case 1:
                    body = _a.apply(void 0, [_c.sent()]);
                    assertEquals(body, shortText);
                    longText = "1234\n".repeat(1000);
                    req = new ServerRequest();
                    req.headers = new Headers();
                    req.headers.set("transfer-encoding", "chunked");
                    chunksData = "";
                    chunkOffset = 0;
                    maxChunkSize = 70;
                    while (chunkOffset < longText.length) {
                        chunkSize = Math.min(maxChunkSize, longText.length - chunkOffset);
                        chunksData += chunkSize.toString(16) + "\r\n" + longText.substr(chunkOffset, chunkSize) + "\r\n";
                        chunkOffset += chunkSize;
                    }
                    chunksData += "0\r\n\r\n";
                    buf = new Buffer(encode(chunksData));
                    req.r = new BufReader(buf);
                    _b = decode;
                    return [4 /*yield*/, Deno.readAll(req.body)];
                case 2:
                    body = _b.apply(void 0, [_c.sent()]);
                    assertEquals(body, longText);
                    return [2 /*return*/];
            }
        });
    });
});
test(function requestBodyReaderWithContentLength() {
    return __awaiter(this, void 0, void 0, function () {
        var shortText, req, buf, readBuf, offset, nread_1, s, nread, longText, req, buf, readBuf, offset, nread_2, s, nread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shortText = "Hello";
                    req = new ServerRequest();
                    req.headers = new Headers();
                    req.headers.set("content-length", "" + shortText.length);
                    buf = new Buffer(encode(shortText));
                    req.r = new BufReader(buf);
                    readBuf = new Uint8Array(6);
                    offset = 0;
                    _a.label = 1;
                case 1:
                    if (!(offset < shortText.length)) return [3 /*break*/, 3];
                    return [4 /*yield*/, req.body.read(readBuf)];
                case 2:
                    nread_1 = _a.sent();
                    assertNotEOF(nread_1);
                    s = decode(readBuf.subarray(0, nread_1));
                    assertEquals(shortText.substr(offset, nread_1), s);
                    offset += nread_1;
                    return [3 /*break*/, 1];
                case 3: return [4 /*yield*/, req.body.read(readBuf)];
                case 4:
                    nread = _a.sent();
                    assertEquals(nread, Deno.EOF);
                    longText = "1234\n".repeat(1000);
                    req = new ServerRequest();
                    req.headers = new Headers();
                    req.headers.set("Content-Length", "5000");
                    buf = new Buffer(encode(longText));
                    req.r = new BufReader(buf);
                    readBuf = new Uint8Array(1000);
                    offset = 0;
                    _a.label = 5;
                case 5:
                    if (!(offset < longText.length)) return [3 /*break*/, 7];
                    return [4 /*yield*/, req.body.read(readBuf)];
                case 6:
                    nread_2 = _a.sent();
                    assertNotEOF(nread_2);
                    s = decode(readBuf.subarray(0, nread_2));
                    assertEquals(longText.substr(offset, nread_2), s);
                    offset += nread_2;
                    return [3 /*break*/, 5];
                case 7: return [4 /*yield*/, req.body.read(readBuf)];
                case 8:
                    nread = _a.sent();
                    assertEquals(nread, Deno.EOF);
                    return [2 /*return*/];
            }
        });
    });
});
test(function requestBodyReaderWithTransferEncoding() {
    return __awaiter(this, void 0, void 0, function () {
        var shortText, req, chunksData, chunkOffset, maxChunkSize, chunkSize, buf, readBuf, offset, nread_3, s, nread, longText, req, chunksData, chunkOffset, maxChunkSize, chunkSize, buf, readBuf, offset, nread_4, s, nread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shortText = "Hello";
                    req = new ServerRequest();
                    req.headers = new Headers();
                    req.headers.set("transfer-encoding", "chunked");
                    chunksData = "";
                    chunkOffset = 0;
                    maxChunkSize = 70;
                    while (chunkOffset < shortText.length) {
                        chunkSize = Math.min(maxChunkSize, shortText.length - chunkOffset);
                        chunksData += chunkSize.toString(16) + "\r\n" + shortText.substr(chunkOffset, chunkSize) + "\r\n";
                        chunkOffset += chunkSize;
                    }
                    chunksData += "0\r\n\r\n";
                    buf = new Buffer(encode(chunksData));
                    req.r = new BufReader(buf);
                    readBuf = new Uint8Array(6);
                    offset = 0;
                    _a.label = 1;
                case 1:
                    if (!(offset < shortText.length)) return [3 /*break*/, 3];
                    return [4 /*yield*/, req.body.read(readBuf)];
                case 2:
                    nread_3 = _a.sent();
                    assertNotEOF(nread_3);
                    s = decode(readBuf.subarray(0, nread_3));
                    assertEquals(shortText.substr(offset, nread_3), s);
                    offset += nread_3;
                    return [3 /*break*/, 1];
                case 3: return [4 /*yield*/, req.body.read(readBuf)];
                case 4:
                    nread = _a.sent();
                    assertEquals(nread, Deno.EOF);
                    longText = "1234\n".repeat(1000);
                    req = new ServerRequest();
                    req.headers = new Headers();
                    req.headers.set("transfer-encoding", "chunked");
                    chunksData = "";
                    chunkOffset = 0;
                    maxChunkSize = 70;
                    while (chunkOffset < longText.length) {
                        chunkSize = Math.min(maxChunkSize, longText.length - chunkOffset);
                        chunksData += chunkSize.toString(16) + "\r\n" + longText.substr(chunkOffset, chunkSize) + "\r\n";
                        chunkOffset += chunkSize;
                    }
                    chunksData += "0\r\n\r\n";
                    buf = new Buffer(encode(chunksData));
                    req.r = new BufReader(buf);
                    readBuf = new Uint8Array(1000);
                    offset = 0;
                    _a.label = 5;
                case 5:
                    if (!(offset < longText.length)) return [3 /*break*/, 7];
                    return [4 /*yield*/, req.body.read(readBuf)];
                case 6:
                    nread_4 = _a.sent();
                    assertNotEOF(nread_4);
                    s = decode(readBuf.subarray(0, nread_4));
                    assertEquals(longText.substr(offset, nread_4), s);
                    offset += nread_4;
                    return [3 /*break*/, 5];
                case 7: return [4 /*yield*/, req.body.read(readBuf)];
                case 8:
                    nread = _a.sent();
                    assertEquals(nread, Deno.EOF);
                    return [2 /*return*/];
            }
        });
    });
});
test("destroyed connection", function () { return __awaiter(void 0, void 0, void 0, function () {
    var p, r, s, serverIsRunning_1, conn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                p = Deno.run({
                    args: [Deno.execPath(), "--allow-net", "http/testdata/simple_server.ts"],
                    stdout: "piped"
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, , 7, 8]);
                r = new TextProtoReader(new BufReader(p.stdout));
                return [4 /*yield*/, r.readLine()];
            case 2:
                s = _a.sent();
                assert(s !== Deno.EOF && s.includes("server listening"));
                serverIsRunning_1 = true;
                p.status()
                    .then(function () {
                    serverIsRunning_1 = false;
                })["catch"](function (_) { }); // Ignores the error when closing the process.
                return [4 /*yield*/, delay(100)];
            case 3:
                _a.sent();
                return [4 /*yield*/, Deno.connect({ port: 4502 })];
            case 4:
                conn = _a.sent();
                return [4 /*yield*/, conn.write(new TextEncoder().encode("GET / HTTP/1.0\n\n"))];
            case 5:
                _a.sent();
                conn.close();
                // Waits for the server to handle the above (broken) request
                return [4 /*yield*/, delay(100)];
            case 6:
                // Waits for the server to handle the above (broken) request
                _a.sent();
                assert(serverIsRunning_1);
                return [3 /*break*/, 8];
            case 7:
                // Stops the sever.
                p.close();
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); });
test("serveTLS", function () { return __awaiter(void 0, void 0, void 0, function () {
    var p, r, s, serverIsRunning_2, conn, res_1, nread, _a, resStr;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                p = Deno.run({
                    args: [
                        Deno.execPath(),
                        "--allow-net",
                        "--allow-read",
                        "http/testdata/simple_https_server.ts"
                    ],
                    stdout: "piped"
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, , 6, 7]);
                r = new TextProtoReader(new BufReader(p.stdout));
                return [4 /*yield*/, r.readLine()];
            case 2:
                s = _b.sent();
                assert(s !== Deno.EOF && s.includes("server listening"), "server must be started");
                serverIsRunning_2 = true;
                p.status()
                    .then(function () {
                    serverIsRunning_2 = false;
                })["catch"](function (_) { }); // Ignores the error when closing the process.
                return [4 /*yield*/, Deno.connectTLS({
                        hostname: "localhost",
                        port: 4503,
                        certFile: "http/testdata/tls/RootCA.pem"
                    })];
            case 3:
                conn = _b.sent();
                return [4 /*yield*/, Deno.writeAll(conn, new TextEncoder().encode("GET / HTTP/1.0\r\n\r\n"))];
            case 4:
                _b.sent();
                res_1 = new Uint8Array(100);
                _a = assertNotEOF;
                return [4 /*yield*/, conn.read(res_1)];
            case 5:
                nread = _a.apply(void 0, [_b.sent()]);
                conn.close();
                resStr = new TextDecoder().decode(res_1.subarray(0, nread));
                assert(resStr.includes("Hello HTTPS"));
                assert(serverIsRunning_2);
                return [3 /*break*/, 7];
            case 6:
                // Stops the sever.
                p.close();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); });
test("close server while iterating", function () { return __awaiter(void 0, void 0, void 0, function () {
    var server, nextWhileClosing, _a, nextAfterClosing, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                server = serve(":8123");
                nextWhileClosing = server[Symbol.asyncIterator]().next();
                server.close();
                _a = assertEquals;
                return [4 /*yield*/, nextWhileClosing];
            case 1:
                _a.apply(void 0, [_c.sent(), { value: undefined, done: true }]);
                nextAfterClosing = server[Symbol.asyncIterator]().next();
                _b = assertEquals;
                return [4 /*yield*/, nextAfterClosing];
            case 2:
                _b.apply(void 0, [_c.sent(), { value: undefined, done: true }]);
                return [2 /*return*/];
        }
    });
}); });
// TODO(kevinkassimo): create a test that works on Windows.
// The following test is to ensure that if an error occurs during respond
// would result in connection closed. (such that fd/resource is freed).
// On *nix, a delayed second attempt to write to a CLOSE_WAIT connection would
// receive a RST and thus trigger an error during response for us to test.
// We need to find a way to similarly trigger an error on Windows so that
// we can test if connection is closed.
if (Deno.build.os !== "win") {
    test("respond error handling", function () { return __awaiter(void 0, void 0, void 0, function () {
        var connClosedPromise, serverRoutine, p, conn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connClosedPromise = deferred();
                    serverRoutine = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var reqCount, server, serverRid, connRid, server_1, server_1_1, req, _a, e_1_1, resources;
                        var e_1, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    reqCount = 0;
                                    server = serve(":8124");
                                    serverRid = server.listener["rid"];
                                    connRid = -1;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 13, 14, 19]);
                                    server_1 = __asyncValues(server);
                                    _c.label = 2;
                                case 2: return [4 /*yield*/, server_1.next()];
                                case 3:
                                    if (!(server_1_1 = _c.sent(), !server_1_1.done)) return [3 /*break*/, 12];
                                    req = server_1_1.value;
                                    connRid = req.conn.rid;
                                    reqCount++;
                                    return [4 /*yield*/, Deno.readAll(req.body)];
                                case 4:
                                    _c.sent();
                                    return [4 /*yield*/, connClosedPromise];
                                case 5:
                                    _c.sent();
                                    _c.label = 6;
                                case 6:
                                    _c.trys.push([6, 10, , 11]);
                                    return [4 /*yield*/, req.respond({
                                            body: new TextEncoder().encode("Hello World")
                                        })];
                                case 7:
                                    _c.sent();
                                    return [4 /*yield*/, delay(100)];
                                case 8:
                                    _c.sent();
                                    req.done = deferred();
                                    // This duplicate respond is to ensure we get a write failure from the
                                    // other side. Our client would enter CLOSE_WAIT stage after close(),
                                    // meaning first server .send (.respond) after close would still work.
                                    // However, a second send would fail under RST, which is similar
                                    // to the scenario where a failure happens during .respond
                                    return [4 /*yield*/, req.respond({
                                            body: new TextEncoder().encode("Hello World")
                                        })];
                                case 9:
                                    // This duplicate respond is to ensure we get a write failure from the
                                    // other side. Our client would enter CLOSE_WAIT stage after close(),
                                    // meaning first server .send (.respond) after close would still work.
                                    // However, a second send would fail under RST, which is similar
                                    // to the scenario where a failure happens during .respond
                                    _c.sent();
                                    return [3 /*break*/, 11];
                                case 10:
                                    _a = _c.sent();
                                    return [3 /*break*/, 12];
                                case 11: return [3 /*break*/, 2];
                                case 12: return [3 /*break*/, 19];
                                case 13:
                                    e_1_1 = _c.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 19];
                                case 14:
                                    _c.trys.push([14, , 17, 18]);
                                    if (!(server_1_1 && !server_1_1.done && (_b = server_1["return"]))) return [3 /*break*/, 16];
                                    return [4 /*yield*/, _b.call(server_1)];
                                case 15:
                                    _c.sent();
                                    _c.label = 16;
                                case 16: return [3 /*break*/, 18];
                                case 17:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 18: return [7 /*endfinally*/];
                                case 19:
                                    server.close();
                                    resources = Deno.resources();
                                    assert(reqCount === 1);
                                    // Server should be gone
                                    assert(!(serverRid in resources));
                                    // The connection should be destroyed
                                    assert(!(connRid in resources));
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    p = serverRoutine();
                    return [4 /*yield*/, Deno.connect({
                            hostname: "127.0.0.1",
                            port: 8124
                        })];
                case 1:
                    conn = _a.sent();
                    return [4 /*yield*/, Deno.writeAll(conn, new TextEncoder().encode("GET / HTTP/1.1\r\n\r\n"))];
                case 2:
                    _a.sent();
                    conn.close(); // abruptly closing connection before response.
                    // conn on server side enters CLOSE_WAIT state.
                    connClosedPromise.resolve();
                    return [4 /*yield*/, p];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
//# sourceMappingURL=server_test.js.map