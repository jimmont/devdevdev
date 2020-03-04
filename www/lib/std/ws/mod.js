// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { decode, encode } from "../strings/mod.js";
import { hasOwnProperty } from "../util/has_own_property.js";
import { BufReader, BufWriter, UnexpectedEOFError } from "../io/bufio.js";
import { readLong, readShort, sliceLongToBytes } from "../io/ioutil.js";
import { Sha1 } from "./sha1.js";
import { writeResponse } from "../http/io.js";
import { TextProtoReader } from "../textproto/mod.js";
import { deferred } from "../util/async.js";
import { assertNotEOF } from "../testing/asserts.js";
export var OpCode;
(function (OpCode) {
    OpCode[OpCode["Continue"] = 0] = "Continue";
    OpCode[OpCode["TextFrame"] = 1] = "TextFrame";
    OpCode[OpCode["BinaryFrame"] = 2] = "BinaryFrame";
    OpCode[OpCode["Close"] = 8] = "Close";
    OpCode[OpCode["Ping"] = 9] = "Ping";
    OpCode[OpCode["Pong"] = 10] = "Pong";
})(OpCode || (OpCode = {}));
export function isWebSocketCloseEvent(a) {
    return hasOwnProperty(a, "code");
}
export function isWebSocketPingEvent(a) {
    return Array.isArray(a) && a[0] === "ping" && a[1] instanceof Uint8Array;
}
export function isWebSocketPongEvent(a) {
    return Array.isArray(a) && a[0] === "pong" && a[1] instanceof Uint8Array;
}
// TODO move this to common/util module
export function append(a, b) {
    if (a == null || !a.length) {
        return b;
    }
    if (b == null || !b.length) {
        return a;
    }
    var output = new Uint8Array(a.length + b.length);
    output.set(a, 0);
    output.set(b, a.length);
    return output;
}
var SocketClosedError = /** @class */ (function (_super) {
    __extends(SocketClosedError, _super);
    function SocketClosedError(msg) {
        if (msg === void 0) { msg = "Socket has already been closed"; }
        return _super.call(this, msg) || this;
    }
    return SocketClosedError;
}(Error));
export { SocketClosedError };
/** Unmask masked websocket payload */
export function unmask(payload, mask) {
    if (mask) {
        for (var i = 0, len = payload.length; i < len; i++) {
            payload[i] ^= mask[i & 3];
        }
    }
}
/** Write websocket frame to given writer */
export function writeFrame(frame, writer) {
    return __awaiter(this, void 0, void 0, function () {
        var payloadLength, header, hasMask, w;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payloadLength = frame.payload.byteLength;
                    hasMask = frame.mask ? 0x80 : 0;
                    if (frame.mask && frame.mask.byteLength !== 4) {
                        throw new Error("invalid mask. mask must be 4 bytes: length=" + frame.mask.byteLength);
                    }
                    if (payloadLength < 126) {
                        header = new Uint8Array([0x80 | frame.opcode, hasMask | payloadLength]);
                    }
                    else if (payloadLength < 0xffff) {
                        header = new Uint8Array([
                            0x80 | frame.opcode,
                            hasMask | 126,
                            payloadLength >>> 8,
                            payloadLength & 0x00ff
                        ]);
                    }
                    else {
                        header = new Uint8Array(__spreadArrays([
                            0x80 | frame.opcode,
                            hasMask | 127
                        ], sliceLongToBytes(payloadLength)));
                    }
                    if (frame.mask) {
                        header = append(header, frame.mask);
                    }
                    unmask(frame.payload, frame.mask);
                    header = append(header, frame.payload);
                    w = BufWriter.create(writer);
                    return [4 /*yield*/, w.write(header)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, w.flush()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/** Read websocket frame from given BufReader
 * @throws UnexpectedEOFError When peer closed connection without close frame
 * @throws Error Frame is invalid
 */
export function readFrame(buf) {
    return __awaiter(this, void 0, void 0, function () {
        var b, _a, isLastFrame, opcode, _b, hasMask, payloadLength, l, _c, l, _d, mask, _e, payload, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = assertNotEOF;
                    return [4 /*yield*/, buf.readByte()];
                case 1:
                    b = _a.apply(void 0, [_g.sent()]);
                    isLastFrame = false;
                    switch (b >>> 4) {
                        case 8:
                            isLastFrame = true;
                            break;
                        case 0:
                            isLastFrame = false;
                            break;
                        default:
                            throw new Error("invalid signature");
                    }
                    opcode = b & 0x0f;
                    _b = assertNotEOF;
                    return [4 /*yield*/, buf.readByte()];
                case 2:
                    // has_mask & payload
                    b = _b.apply(void 0, [_g.sent()]);
                    hasMask = b >>> 7;
                    payloadLength = b & 127;
                    if (!(payloadLength === 126)) return [3 /*break*/, 4];
                    _c = assertNotEOF;
                    return [4 /*yield*/, readShort(buf)];
                case 3:
                    l = _c.apply(void 0, [_g.sent()]);
                    payloadLength = l;
                    return [3 /*break*/, 6];
                case 4:
                    if (!(payloadLength === 127)) return [3 /*break*/, 6];
                    _d = assertNotEOF;
                    return [4 /*yield*/, readLong(buf)];
                case 5:
                    l = _d.apply(void 0, [_g.sent()]);
                    payloadLength = Number(l);
                    _g.label = 6;
                case 6:
                    if (!hasMask) return [3 /*break*/, 8];
                    mask = new Uint8Array(4);
                    _e = assertNotEOF;
                    return [4 /*yield*/, buf.readFull(mask)];
                case 7:
                    _e.apply(void 0, [_g.sent()]);
                    _g.label = 8;
                case 8:
                    payload = new Uint8Array(payloadLength);
                    _f = assertNotEOF;
                    return [4 /*yield*/, buf.readFull(payload)];
                case 9:
                    _f.apply(void 0, [_g.sent()]);
                    return [2 /*return*/, {
                            isLastFrame: isLastFrame,
                            opcode: opcode,
                            mask: mask,
                            payload: payload
                        }];
            }
        });
    });
}
// Create client-to-server mask, random 32bit number
function createMask() {
    return crypto.getRandomValues(new Uint8Array(4));
}
var WebSocketImpl = /** @class */ (function () {
    function WebSocketImpl(_a) {
        var conn = _a.conn, bufReader = _a.bufReader, bufWriter = _a.bufWriter, mask = _a.mask;
        this.sendQueue = [];
        this._isClosed = false;
        this.conn = conn;
        this.mask = mask;
        this.bufReader = bufReader || new BufReader(conn);
        this.bufWriter = bufWriter || new BufWriter(conn);
    }
    WebSocketImpl.prototype.receive = function () {
        return __asyncGenerator(this, arguments, function receive_1() {
            var frames, payloadsLength, frame, e_1, _a, concat, offs, _i, frames_1, frame_1, code, reason;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        frames = [];
                        payloadsLength = 0;
                        _b.label = 1;
                    case 1:
                        if (!!this._isClosed) return [3 /*break*/, 27];
                        frame = void 0;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, __await(readFrame(this.bufReader))];
                    case 3:
                        frame = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        this.ensureSocketClosed();
                        return [3 /*break*/, 27];
                    case 5:
                        unmask(frame.payload, frame.mask);
                        _a = frame.opcode;
                        switch (_a) {
                            case OpCode.TextFrame: return [3 /*break*/, 6];
                            case OpCode.BinaryFrame: return [3 /*break*/, 6];
                            case OpCode.Continue: return [3 /*break*/, 6];
                            case OpCode.Close: return [3 /*break*/, 14];
                            case OpCode.Ping: return [3 /*break*/, 19];
                            case OpCode.Pong: return [3 /*break*/, 23];
                        }
                        return [3 /*break*/, 26];
                    case 6:
                        frames.push(frame);
                        payloadsLength += frame.payload.length;
                        if (!frame.isLastFrame) return [3 /*break*/, 13];
                        concat = new Uint8Array(payloadsLength);
                        offs = 0;
                        for (_i = 0, frames_1 = frames; _i < frames_1.length; _i++) {
                            frame_1 = frames_1[_i];
                            concat.set(frame_1.payload, offs);
                            offs += frame_1.payload.length;
                        }
                        if (!(frames[0].opcode === OpCode.TextFrame)) return [3 /*break*/, 9];
                        return [4 /*yield*/, __await(decode(concat))];
                    case 7: 
                    // text
                    return [4 /*yield*/, _b.sent()];
                    case 8:
                        // text
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 9: return [4 /*yield*/, __await(concat)];
                    case 10: 
                    // binary
                    return [4 /*yield*/, _b.sent()];
                    case 11:
                        // binary
                        _b.sent();
                        _b.label = 12;
                    case 12:
                        frames = [];
                        payloadsLength = 0;
                        _b.label = 13;
                    case 13: return [3 /*break*/, 26];
                    case 14:
                        code = (frame.payload[0] << 8) | frame.payload[1];
                        reason = decode(frame.payload.subarray(2, frame.payload.length));
                        return [4 /*yield*/, __await(this.close(code, reason))];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, __await({ code: code, reason: reason })];
                    case 16: return [4 /*yield*/, _b.sent()];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, __await(void 0)];
                    case 18: return [2 /*return*/, _b.sent()];
                    case 19: return [4 /*yield*/, __await(this.enqueue({
                            opcode: OpCode.Pong,
                            payload: frame.payload,
                            isLastFrame: true
                        }))];
                    case 20:
                        _b.sent();
                        return [4 /*yield*/, __await(["ping", frame.payload])];
                    case 21: return [4 /*yield*/, _b.sent()];
                    case 22:
                        _b.sent();
                        return [3 /*break*/, 26];
                    case 23: return [4 /*yield*/, __await(["pong", frame.payload])];
                    case 24: return [4 /*yield*/, _b.sent()];
                    case 25:
                        _b.sent();
                        return [3 /*break*/, 26];
                    case 26: return [3 /*break*/, 1];
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    WebSocketImpl.prototype.dequeue = function () {
        var _this = this;
        var entry = this.sendQueue[0];
        if (!entry)
            return;
        if (this._isClosed)
            return;
        var d = entry.d, frame = entry.frame;
        writeFrame(frame, this.bufWriter)
            .then(function () { return d.resolve(); })["catch"](function (e) { return d.reject(e); })["finally"](function () {
            _this.sendQueue.shift();
            _this.dequeue();
        });
    };
    WebSocketImpl.prototype.enqueue = function (frame) {
        if (this._isClosed) {
            throw new SocketClosedError();
        }
        var d = deferred();
        this.sendQueue.push({ d: d, frame: frame });
        if (this.sendQueue.length === 1) {
            this.dequeue();
        }
        return d;
    };
    WebSocketImpl.prototype.send = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var opcode, payload, isLastFrame, frame;
            return __generator(this, function (_a) {
                opcode = typeof data === "string" ? OpCode.TextFrame : OpCode.BinaryFrame;
                payload = typeof data === "string" ? encode(data) : data;
                isLastFrame = true;
                frame = {
                    isLastFrame: isLastFrame,
                    opcode: opcode,
                    payload: payload,
                    mask: this.mask
                };
                return [2 /*return*/, this.enqueue(frame)];
            });
        });
    };
    WebSocketImpl.prototype.ping = function (data) {
        if (data === void 0) { data = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, frame;
            return __generator(this, function (_a) {
                payload = typeof data === "string" ? encode(data) : data;
                frame = {
                    isLastFrame: true,
                    opcode: OpCode.Ping,
                    mask: this.mask,
                    payload: payload
                };
                return [2 /*return*/, this.enqueue(frame)];
            });
        });
    };
    Object.defineProperty(WebSocketImpl.prototype, "isClosed", {
        get: function () {
            return this._isClosed;
        },
        enumerable: true,
        configurable: true
    });
    WebSocketImpl.prototype.close = function (code, reason) {
        if (code === void 0) { code = 1000; }
        return __awaiter(this, void 0, void 0, function () {
            var header, payload, reasonBytes, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        header = [code >>> 8, code & 0x00ff];
                        payload = void 0;
                        if (reason) {
                            reasonBytes = encode(reason);
                            payload = new Uint8Array(2 + reasonBytes.byteLength);
                            payload.set(header);
                            payload.set(reasonBytes, 2);
                        }
                        else {
                            payload = new Uint8Array(header);
                        }
                        return [4 /*yield*/, this.enqueue({
                                isLastFrame: true,
                                opcode: OpCode.Close,
                                mask: this.mask,
                                payload: payload
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        e_2 = _a.sent();
                        throw e_2;
                    case 3:
                        this.ensureSocketClosed();
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WebSocketImpl.prototype.closeForce = function () {
        this.ensureSocketClosed();
    };
    WebSocketImpl.prototype.ensureSocketClosed = function () {
        if (this.isClosed)
            return;
        try {
            this.conn.close();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            this._isClosed = true;
            var rest = this.sendQueue;
            this.sendQueue = [];
            rest.forEach(function (e) { return e.d.reject(new SocketClosedError()); });
        }
    };
    return WebSocketImpl;
}());
/** Return whether given headers is acceptable for websocket  */
export function acceptable(req) {
    var upgrade = req.headers.get("upgrade");
    if (!upgrade || upgrade.toLowerCase() !== "websocket") {
        return false;
    }
    var secKey = req.headers.get("sec-websocket-key");
    return (req.headers.has("sec-websocket-key") &&
        typeof secKey === "string" &&
        secKey.length > 0);
}
var kGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
/** Create sec-websocket-accept header value with given nonce */
export function createSecAccept(nonce) {
    var sha1 = new Sha1();
    sha1.update(nonce + kGUID);
    var bytes = sha1.digest();
    return btoa(String.fromCharCode.apply(String, bytes));
}
/** Upgrade given TCP connection into websocket connection */
export function acceptWebSocket(req) {
    return __awaiter(this, void 0, void 0, function () {
        var conn, headers, bufReader, bufWriter, sock, secKey, secAccept;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conn = req.conn, headers = req.headers, bufReader = req.bufReader, bufWriter = req.bufWriter;
                    if (!acceptable(req)) return [3 /*break*/, 2];
                    sock = new WebSocketImpl({ conn: conn, bufReader: bufReader, bufWriter: bufWriter });
                    secKey = headers.get("sec-websocket-key");
                    if (typeof secKey !== "string") {
                        throw new Error("sec-websocket-key is not provided");
                    }
                    secAccept = createSecAccept(secKey);
                    return [4 /*yield*/, writeResponse(bufWriter, {
                            status: 101,
                            headers: new Headers({
                                Upgrade: "websocket",
                                Connection: "Upgrade",
                                "Sec-WebSocket-Accept": secAccept
                            })
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, sock];
                case 2: throw new Error("request is not acceptable");
            }
        });
    });
}
var kSecChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.~_";
/** Create WebSocket-Sec-Key. Base64 encoded 16 bytes string */
export function createSecKey() {
    var key = "";
    for (var i = 0; i < 16; i++) {
        var j = Math.floor(Math.random() * kSecChars.length);
        key += kSecChars[j];
    }
    return btoa(key);
}
export function handshake(url, headers, bufReader, bufWriter) {
    return __awaiter(this, void 0, void 0, function () {
        var hostname, pathname, search, key, headerStr, _i, headers_1, _a, key_1, value, tpReader, statusLine, m, _b, version, statusCode, responseHeaders, expectedSecAccept, secAccept;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    hostname = url.hostname, pathname = url.pathname, search = url.search;
                    key = createSecKey();
                    if (!headers.has("host")) {
                        headers.set("host", hostname);
                    }
                    headers.set("upgrade", "websocket");
                    headers.set("connection", "upgrade");
                    headers.set("sec-websocket-key", key);
                    headers.set("sec-websocket-version", "13");
                    headerStr = "GET " + pathname + search + " HTTP/1.1\r\n";
                    for (_i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
                        _a = headers_1[_i], key_1 = _a[0], value = _a[1];
                        headerStr += key_1 + ": " + value + "\r\n";
                    }
                    headerStr += "\r\n";
                    return [4 /*yield*/, bufWriter.write(encode(headerStr))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, bufWriter.flush()];
                case 2:
                    _c.sent();
                    tpReader = new TextProtoReader(bufReader);
                    return [4 /*yield*/, tpReader.readLine()];
                case 3:
                    statusLine = _c.sent();
                    if (statusLine === Deno.EOF) {
                        throw new UnexpectedEOFError();
                    }
                    m = statusLine.match(/^(?<version>\S+) (?<statusCode>\S+) /);
                    if (!m) {
                        throw new Error("ws: invalid status line: " + statusLine);
                    }
                    _b = m.groups, version = _b.version, statusCode = _b.statusCode;
                    if (version !== "HTTP/1.1" || statusCode !== "101") {
                        throw new Error("ws: server didn't accept handshake: " +
                            ("version=" + version + ", statusCode=" + statusCode));
                    }
                    return [4 /*yield*/, tpReader.readMIMEHeader()];
                case 4:
                    responseHeaders = _c.sent();
                    if (responseHeaders === Deno.EOF) {
                        throw new UnexpectedEOFError();
                    }
                    expectedSecAccept = createSecAccept(key);
                    secAccept = responseHeaders.get("sec-websocket-accept");
                    if (secAccept !== expectedSecAccept) {
                        throw new Error("ws: unexpected sec-websocket-accept header: " +
                            ("expected=" + expectedSecAccept + ", actual=" + secAccept));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Connect to given websocket endpoint url.
 * Endpoint must be acceptable for URL.
 */
export function connectWebSocket(endpoint, headers) {
    if (headers === void 0) { headers = new Headers(); }
    return __awaiter(this, void 0, void 0, function () {
        var url, hostname, conn, port_1, port_2, bufWriter, bufReader, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = new URL(endpoint);
                    hostname = url.hostname;
                    if (!(url.protocol === "http:" || url.protocol === "ws:")) return [3 /*break*/, 2];
                    port_1 = parseInt(url.port || "80");
                    return [4 /*yield*/, Deno.connect({ hostname: hostname, port: port_1 })];
                case 1:
                    conn = _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    if (!(url.protocol === "https:" || url.protocol === "wss:")) return [3 /*break*/, 4];
                    port_2 = parseInt(url.port || "443");
                    return [4 /*yield*/, Deno.connectTLS({ hostname: hostname, port: port_2 })];
                case 3:
                    conn = _a.sent();
                    return [3 /*break*/, 5];
                case 4: throw new Error("ws: unsupported protocol: " + url.protocol);
                case 5:
                    bufWriter = new BufWriter(conn);
                    bufReader = new BufReader(conn);
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, handshake(url, headers, bufReader, bufWriter)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    conn.close();
                    throw err_1;
                case 9: return [2 /*return*/, new WebSocketImpl({
                        conn: conn,
                        bufWriter: bufWriter,
                        bufReader: bufReader,
                        mask: createMask()
                    })];
            }
        });
    });
}
export function createWebSocket(params) {
    return new WebSocketImpl(params);
}
//# sourceMappingURL=mod.js.map
