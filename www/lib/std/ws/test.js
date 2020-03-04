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
import { BufReader, BufWriter } from "../io/bufio.ts";
import { assert, assertEquals, assertThrowsAsync } from "../testing/asserts.ts";
var test = Deno.test;
import { TextProtoReader } from "../textproto/mod.ts";
import * as bytes from "../bytes/mod.ts";
import { acceptable, connectWebSocket, createSecAccept, createSecKey, handshake, OpCode, readFrame, unmask, writeFrame, createWebSocket, SocketClosedError } from "./mod.ts";
import { encode, decode } from "../strings/mod.ts";
var Buffer = Deno.Buffer;
test("[ws] read unmasked text frame", function () { return __awaiter(void 0, void 0, void 0, function () {
    var buf, frame;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buf = new BufReader(new Buffer(new Uint8Array([0x81, 0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f])));
                return [4 /*yield*/, readFrame(buf)];
            case 1:
                frame = _a.sent();
                assertEquals(frame.opcode, OpCode.TextFrame);
                assertEquals(frame.mask, undefined);
                assertEquals(new Buffer(frame.payload).toString(), "Hello");
                assertEquals(frame.isLastFrame, true);
                return [2 /*return*/];
        }
    });
}); });
test("[ws] read masked text frame", function () { return __awaiter(void 0, void 0, void 0, function () {
    var buf, frame;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buf = new BufReader(new Buffer(new Uint8Array([
                    0x81,
                    0x85,
                    0x37,
                    0xfa,
                    0x21,
                    0x3d,
                    0x7f,
                    0x9f,
                    0x4d,
                    0x51,
                    0x58
                ])));
                return [4 /*yield*/, readFrame(buf)];
            case 1:
                frame = _a.sent();
                assertEquals(frame.opcode, OpCode.TextFrame);
                unmask(frame.payload, frame.mask);
                assertEquals(new Buffer(frame.payload).toString(), "Hello");
                assertEquals(frame.isLastFrame, true);
                return [2 /*return*/];
        }
    });
}); });
test("[ws] read unmasked split text frames", function () { return __awaiter(void 0, void 0, void 0, function () {
    var buf1, buf2, _a, f1, f2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                buf1 = new BufReader(new Buffer(new Uint8Array([0x01, 0x03, 0x48, 0x65, 0x6c])));
                buf2 = new BufReader(new Buffer(new Uint8Array([0x80, 0x02, 0x6c, 0x6f])));
                return [4 /*yield*/, Promise.all([readFrame(buf1), readFrame(buf2)])];
            case 1:
                _a = _b.sent(), f1 = _a[0], f2 = _a[1];
                assertEquals(f1.isLastFrame, false);
                assertEquals(f1.mask, undefined);
                assertEquals(f1.opcode, OpCode.TextFrame);
                assertEquals(new Buffer(f1.payload).toString(), "Hel");
                assertEquals(f2.isLastFrame, true);
                assertEquals(f2.mask, undefined);
                assertEquals(f2.opcode, OpCode.Continue);
                assertEquals(new Buffer(f2.payload).toString(), "lo");
                return [2 /*return*/];
        }
    });
}); });
test("[ws] read unmasked ping / pong frame", function () { return __awaiter(void 0, void 0, void 0, function () {
    var buf, ping, pongFrame, buf2, pong;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buf = new BufReader(new Buffer(new Uint8Array([0x89, 0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f])));
                return [4 /*yield*/, readFrame(buf)];
            case 1:
                ping = _a.sent();
                assertEquals(ping.opcode, OpCode.Ping);
                assertEquals(new Buffer(ping.payload).toString(), "Hello");
                pongFrame = [0x8a, 0x85, 0x37, 0xfa, 0x21, 0x3d, 0x7f, 0x9f, 0x4d, 0x51, 0x58];
                buf2 = new BufReader(new Buffer(new Uint8Array(pongFrame)));
                return [4 /*yield*/, readFrame(buf2)];
            case 2:
                pong = _a.sent();
                assertEquals(pong.opcode, OpCode.Pong);
                assert(pong.mask !== undefined);
                unmask(pong.payload, pong.mask);
                assertEquals(new Buffer(pong.payload).toString(), "Hello");
                return [2 /*return*/];
        }
    });
}); });
test("[ws] read unmasked big binary frame", function () { return __awaiter(void 0, void 0, void 0, function () {
    var payloadLength, a, i, buf, bin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payloadLength = 0x100;
                a = [0x82, 0x7e, 0x01, 0x00];
                for (i = 0; i < payloadLength; i++) {
                    a.push(i);
                }
                buf = new BufReader(new Buffer(new Uint8Array(a)));
                return [4 /*yield*/, readFrame(buf)];
            case 1:
                bin = _a.sent();
                assertEquals(bin.opcode, OpCode.BinaryFrame);
                assertEquals(bin.isLastFrame, true);
                assertEquals(bin.mask, undefined);
                assertEquals(bin.payload.length, payloadLength);
                return [2 /*return*/];
        }
    });
}); });
test("[ws] read unmasked bigger binary frame", function () { return __awaiter(void 0, void 0, void 0, function () {
    var payloadLength, a, i, buf, bin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payloadLength = 0x10000;
                a = [0x82, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00];
                for (i = 0; i < payloadLength; i++) {
                    a.push(i);
                }
                buf = new BufReader(new Buffer(new Uint8Array(a)));
                return [4 /*yield*/, readFrame(buf)];
            case 1:
                bin = _a.sent();
                assertEquals(bin.opcode, OpCode.BinaryFrame);
                assertEquals(bin.isLastFrame, true);
                assertEquals(bin.mask, undefined);
                assertEquals(bin.payload.length, payloadLength);
                return [2 /*return*/];
        }
    });
}); });
test("[ws] createSecAccept", function () { return __awaiter(void 0, void 0, void 0, function () {
    var nonce, d;
    return __generator(this, function (_a) {
        nonce = "dGhlIHNhbXBsZSBub25jZQ==";
        d = createSecAccept(nonce);
        assertEquals(d, "s3pPLMBiTxaQ9kYGzzhZRbK+xOo=");
        return [2 /*return*/];
    });
}); });
test("[ws] acceptable", function () {
    var ret = acceptable({
        headers: new Headers({
            upgrade: "websocket",
            "sec-websocket-key": "aaa"
        })
    });
    assertEquals(ret, true);
    assert(acceptable({
        headers: new Headers([
            ["connection", "Upgrade"],
            ["host", "127.0.0.1:9229"],
            [
                "sec-websocket-extensions",
                "permessage-deflate; client_max_window_bits"
            ],
            ["sec-websocket-key", "dGhlIHNhbXBsZSBub25jZQ=="],
            ["sec-websocket-version", "13"],
            ["upgrade", "WebSocket"]
        ])
    }));
});
test("[ws] acceptable should return false when headers invalid", function () {
    assertEquals(acceptable({
        headers: new Headers({ "sec-websocket-key": "aaa" })
    }), false);
    assertEquals(acceptable({
        headers: new Headers({ upgrade: "websocket" })
    }), false);
    assertEquals(acceptable({
        headers: new Headers({ upgrade: "invalid", "sec-websocket-key": "aaa" })
    }), false);
    assertEquals(acceptable({
        headers: new Headers({ upgrade: "websocket", "sec-websocket-ky": "" })
    }), false);
});
test("[ws] connectWebSocket should throw invalid scheme of url", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, connectWebSocket("file://hoge/hoge")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test("[ws] write and read masked frame", function () { return __awaiter(void 0, void 0, void 0, function () {
    var mask, msg, buf, r, frame;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mask = new Uint8Array([0, 1, 2, 3]);
                msg = "hello";
                buf = new Buffer();
                r = new BufReader(buf);
                return [4 /*yield*/, writeFrame({
                        isLastFrame: true,
                        mask: mask,
                        opcode: OpCode.TextFrame,
                        payload: encode(msg)
                    }, buf)];
            case 1:
                _a.sent();
                return [4 /*yield*/, readFrame(r)];
            case 2:
                frame = _a.sent();
                assertEquals(frame.opcode, OpCode.TextFrame);
                assertEquals(frame.isLastFrame, true);
                assertEquals(frame.mask, mask);
                unmask(frame.payload, frame.mask);
                assertEquals(frame.payload, encode(msg));
                return [2 /*return*/];
        }
    });
}); });
test("[ws] handshake should not send search when it's empty", function () { return __awaiter(void 0, void 0, void 0, function () {
    var writer, reader, tpReader, statusLine;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                writer = new Buffer();
                reader = new Buffer(encode("HTTP/1.1 400\r\n"));
                return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, handshake(new URL("ws://example.com"), new Headers(), new BufReader(reader), new BufWriter(writer))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                tpReader = new TextProtoReader(new BufReader(writer));
                return [4 /*yield*/, tpReader.readLine()];
            case 2:
                statusLine = _a.sent();
                assertEquals(statusLine, "GET / HTTP/1.1");
                return [2 /*return*/];
        }
    });
}); });
test("[ws] handshake should send search correctly", function wsHandshakeWithSearch() {
    return __awaiter(this, void 0, void 0, function () {
        var writer, reader, tpReader, statusLine;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    writer = new Buffer();
                    reader = new Buffer(encode("HTTP/1.1 400\r\n"));
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, handshake(new URL("ws://example.com?a=1"), new Headers(), new BufReader(reader), new BufWriter(writer))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    tpReader = new TextProtoReader(new BufReader(writer));
                    return [4 /*yield*/, tpReader.readLine()];
                case 2:
                    statusLine = _a.sent();
                    assertEquals(statusLine, "GET /?a=1 HTTP/1.1");
                    return [2 /*return*/];
            }
        });
    });
});
test("[ws] ws.close() should use 1000 as close code", function () { return __awaiter(void 0, void 0, void 0, function () {
    var buf, bufr, conn, ws, frame, code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buf = new Buffer();
                bufr = new BufReader(buf);
                conn = dummyConn(buf, buf);
                ws = createWebSocket({ conn: conn });
                return [4 /*yield*/, ws.close()];
            case 1:
                _a.sent();
                return [4 /*yield*/, readFrame(bufr)];
            case 2:
                frame = _a.sent();
                assertEquals(frame.opcode, OpCode.Close);
                code = (frame.payload[0] << 8) | frame.payload[1];
                assertEquals(code, 1000);
                return [2 /*return*/];
        }
    });
}); });
function dummyConn(r, w) {
    return {
        rid: -1,
        closeRead: function () { },
        closeWrite: function () { },
        read: function (x) { return r.read(x); },
        write: function (x) { return w.write(x); },
        close: function () { },
        localAddr: { transport: "tcp", hostname: "0.0.0.0", port: 0 },
        remoteAddr: { transport: "tcp", hostname: "0.0.0.0", port: 0 }
    };
}
function delayedWriter(ms, dest) {
    return {
        write: function (p) {
            var _this = this;
            return new Promise(function (resolve) {
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = resolve;
                                return [4 /*yield*/, dest.write(p)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); }, ms);
            });
        }
    };
}
test("[ws] WebSocket.send(), WebSocket.ping() should be exclusive", function () { return __awaiter(void 0, void 0, void 0, function () {
    var buf, conn, sock, bufr, first, second, ping, third;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buf = new Buffer();
                conn = dummyConn(new Buffer(), delayedWriter(1, buf));
                sock = createWebSocket({ conn: conn });
                // Ensure send call
                return [4 /*yield*/, Promise.all([
                        sock.send("first"),
                        sock.send("second"),
                        sock.ping(),
                        sock.send(new Uint8Array([3]))
                    ])];
            case 1:
                // Ensure send call
                _a.sent();
                bufr = new BufReader(buf);
                return [4 /*yield*/, readFrame(bufr)];
            case 2:
                first = _a.sent();
                return [4 /*yield*/, readFrame(bufr)];
            case 3:
                second = _a.sent();
                return [4 /*yield*/, readFrame(bufr)];
            case 4:
                ping = _a.sent();
                return [4 /*yield*/, readFrame(bufr)];
            case 5:
                third = _a.sent();
                assertEquals(first.opcode, OpCode.TextFrame);
                assertEquals(decode(first.payload), "first");
                assertEquals(first.opcode, OpCode.TextFrame);
                assertEquals(decode(second.payload), "second");
                assertEquals(ping.opcode, OpCode.Ping);
                assertEquals(third.opcode, OpCode.BinaryFrame);
                assertEquals(bytes.equal(third.payload, new Uint8Array([3])), true);
                return [2 /*return*/];
        }
    });
}); });
test("[ws] createSecKeyHasCorrectLength", function () {
    // Note: relies on --seed=86 being passed to deno to reproduce failure in
    // #4063.
    var secKey = createSecKey();
    assertEquals(atob(secKey).length, 16);
});
test("[ws] WebSocket should throw SocketClosedError when peer closed connection without close frame", function () { return __awaiter(void 0, void 0, void 0, function () {
    var buf, eofReader, conn, sock;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                buf = new Buffer();
                eofReader = {
                    read: function (_) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, Deno.EOF];
                            });
                        });
                    }
                };
                conn = dummyConn(eofReader, buf);
                sock = createWebSocket({ conn: conn });
                sock.closeForce();
                return [4 /*yield*/, assertThrowsAsync(function () { return sock.send("hello"); }, SocketClosedError)];
            case 1:
                _a.sent();
                return [4 /*yield*/, assertThrowsAsync(function () { return sock.ping(); }, SocketClosedError)];
            case 2:
                _a.sent();
                return [4 /*yield*/, assertThrowsAsync(function () { return sock.close(0); }, SocketClosedError)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test("[ws] WebSocket shouldn't throw UnexpectedEOFError on recive()", function () { return __awaiter(void 0, void 0, void 0, function () {
    var buf, eofReader, conn, sock, it, _a, value, done;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                buf = new Buffer();
                eofReader = {
                    read: function (_) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, Deno.EOF];
                            });
                        });
                    }
                };
                conn = dummyConn(eofReader, buf);
                sock = createWebSocket({ conn: conn });
                it = sock.receive();
                return [4 /*yield*/, it.next()];
            case 1:
                _a = _b.sent(), value = _a.value, done = _a.done;
                assertEquals(value, undefined);
                assertEquals(done, true);
                return [2 /*return*/];
        }
    });
}); });
test("[ws] WebSocket should reject sending promise when connection reset forcely", function () { return __awaiter(void 0, void 0, void 0, function () {
    var buf, timer, lazyWriter, conn, sock, onError, p, _a, a, b, c;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                buf = new Buffer();
                lazyWriter = {
                    write: function (_) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (resolve) {
                                        timer = setTimeout(function () { return resolve(0); }, 1000);
                                    })];
                            });
                        });
                    }
                };
                conn = dummyConn(buf, lazyWriter);
                sock = createWebSocket({ conn: conn });
                onError = function (e) { return e; };
                p = Promise.all([
                    sock.send("hello")["catch"](onError),
                    sock.send(new Uint8Array([1, 2]))["catch"](onError),
                    sock.ping()["catch"](onError)
                ]);
                sock.closeForce();
                assertEquals(sock.isClosed, true);
                return [4 /*yield*/, p];
            case 1:
                _a = _b.sent(), a = _a[0], b = _a[1], c = _a[2];
                assert(a instanceof SocketClosedError);
                assert(b instanceof SocketClosedError);
                assert(c instanceof SocketClosedError);
                clearTimeout(timer);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=test.js.map