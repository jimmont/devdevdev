var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { BufReader, BufWriter } from "../io/bufio.js";
import { assert } from "../testing/asserts.js";
import { deferred, MuxAsyncIterator } from "../util/async.js";
import { bodyReader, chunkedBodyReader, emptyReader, writeResponse, readRequest } from "./io.js";
import { encode } from "../strings/mod.js";
var listen = Deno.listen, listenTLS = Deno.listenTLS;
var ServerRequest = /** @class */ (function () {
    function ServerRequest() {
        this.done = deferred();
        this._contentLength = undefined;
        this._body = null;
        this.finalized = false;
    }
    Object.defineProperty(ServerRequest.prototype, "contentLength", {
        /**
         * Value of Content-Length header.
         * If null, then content length is invalid or not given (e.g. chunked encoding).
         */
        get: function () {
            // undefined means not cached.
            // null means invalid or not provided.
            if (this._contentLength === undefined) {
                var cl = this.headers.get("content-length");
                if (cl) {
                    this._contentLength = parseInt(cl);
                    // Convert NaN to null (as NaN harder to test)
                    if (Number.isNaN(this._contentLength)) {
                        this._contentLength = null;
                    }
                }
                else {
                    this._contentLength = null;
                }
            }
            return this._contentLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerRequest.prototype, "body", {
        /**
         * Body of the request.
         *
         *     const buf = new Uint8Array(req.contentLength);
         *     let bufSlice = buf;
         *     let totRead = 0;
         *     while (true) {
         *       const nread = await req.body.read(bufSlice);
         *       if (nread === Deno.EOF) break;
         *       totRead += nread;
         *       if (totRead >= req.contentLength) break;
         *       bufSlice = bufSlice.subarray(nread);
         *     }
         */
        get: function () {
            if (!this._body) {
                if (this.contentLength != null) {
                    this._body = bodyReader(this.contentLength, this.r);
                }
                else {
                    var transferEncoding = this.headers.get("transfer-encoding");
                    if (transferEncoding != null) {
                        var parts = transferEncoding
                            .split(",")
                            .map(function (e) { return e.trim().toLowerCase(); });
                        assert(parts.includes("chunked"), 'transfer-encoding must include "chunked" if content-length is not set');
                        this._body = chunkedBodyReader(this.headers, this.r);
                    }
                    else {
                        // Neither content-length nor transfer-encoding: chunked
                        this._body = emptyReader();
                    }
                }
            }
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    ServerRequest.prototype.respond = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var err, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Write our response!
                        return [4 /*yield*/, writeResponse(this.w, r)];
                    case 1:
                        // Write our response!
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        try {
                            // Eagerly close on error.
                            this.conn.close();
                        }
                        catch (_b) { }
                        err = e_1;
                        return [3 /*break*/, 3];
                    case 3:
                        // Signal that this request has been processed and the next pipelined
                        // request on the same connection can be accepted.
                        this.done.resolve(err);
                        if (err) {
                            // Error during responding, rethrow.
                            throw err;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ServerRequest.prototype.finalize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, buf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.finalized)
                            return [2 /*return*/];
                        body = this.body;
                        buf = new Uint8Array(1024);
                        _a.label = 1;
                    case 1: return [4 /*yield*/, body.read(buf)];
                    case 2:
                        if (!((_a.sent()) !== Deno.EOF)) return [3 /*break*/, 3];
                        return [3 /*break*/, 1];
                    case 3:
                        this.finalized = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    return ServerRequest;
}());
export { ServerRequest };
var Server = /** @class */ (function () {
    function Server(listener) {
        this.listener = listener;
        this.closing = false;
    }
    Server.prototype.close = function () {
        this.closing = true;
        this.listener.close();
    };
    // Yields all HTTP requests on a single TCP connection.
    Server.prototype.iterateHttpRequests = function (conn) {
        return __asyncGenerator(this, arguments, function iterateHttpRequests_1() {
            var bufr, w, req, err, e_2, procError, _1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bufr = new BufReader(conn);
                        w = new BufWriter(conn);
                        _a.label = 1;
                    case 1:
                        if (!!this.closing) return [3 /*break*/, 12];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, __await(readRequest(conn, bufr))];
                    case 3:
                        req = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        err = e_2;
                        return [3 /*break*/, 12];
                    case 5:
                        if (req === Deno.EOF) {
                            return [3 /*break*/, 12];
                        }
                        req.w = w;
                        return [4 /*yield*/, __await(req)];
                    case 6: return [4 /*yield*/, _a.sent()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, __await(req.done)];
                    case 8:
                        procError = _a.sent();
                        if (!procError) return [3 /*break*/, 10];
                        return [4 /*yield*/, __await(void 0)];
                    case 9: 
                    // Something bad happened during response.
                    // (likely other side closed during pipelined req)
                    // req.done implies this connection already closed, so we can just return.
                    return [2 /*return*/, _a.sent()];
                    case 10: 
                    // Consume unread body and trailers if receiver didn't consume those data
                    return [4 /*yield*/, __await(req.finalize())];
                    case 11:
                        // Consume unread body and trailers if receiver didn't consume those data
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 12:
                        if (!(req === Deno.EOF)) return [3 /*break*/, 13];
                        return [3 /*break*/, 19];
                    case 13:
                        if (!(err && req)) return [3 /*break*/, 18];
                        _a.label = 14;
                    case 14:
                        _a.trys.push([14, 16, , 17]);
                        return [4 /*yield*/, __await(writeResponse(req.w, {
                                status: 400,
                                body: encode(err.message + "\r\n\r\n")
                            }))];
                    case 15:
                        _a.sent();
                        return [3 /*break*/, 17];
                    case 16:
                        _1 = _a.sent();
                        return [3 /*break*/, 17];
                    case 17: return [3 /*break*/, 19];
                    case 18:
                        if (this.closing) {
                            // There are more requests incoming but the server is closing.
                            // TODO(ry): send a back a HTTP 503 Service Unavailable status.
                        }
                        _a.label = 19;
                    case 19:
                        conn.close();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Accepts a new TCP connection and yields all HTTP requests that arrive on
    // it. When a connection is accepted, it also creates a new iterator of the
    // same kind and adds it to the request multiplexer so that another TCP
    // connection can be accepted.
    Server.prototype.acceptConnAndIterateHttpRequests = function (mux) {
        return __asyncGenerator(this, arguments, function acceptConnAndIterateHttpRequests_1() {
            var _a, value, done, conn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.closing) return [3 /*break*/, 2];
                        return [4 /*yield*/, __await(void 0)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2: return [4 /*yield*/, __await(this.listener.next())];
                    case 3:
                        _a = _b.sent(), value = _a.value, done = _a.done;
                        if (!done) return [3 /*break*/, 5];
                        return [4 /*yield*/, __await(void 0)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5:
                        conn = value;
                        // Try to accept another connection and add it to the multiplexer.
                        mux.add(this.acceptConnAndIterateHttpRequests(mux));
                        // Yield the requests that arrive on the just-accepted connection.
                        return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(this.iterateHttpRequests(conn))))];
                    case 6: 
                    // Yield the requests that arrive on the just-accepted connection.
                    return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
                    case 7:
                        // Yield the requests that arrive on the just-accepted connection.
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype[Symbol.asyncIterator] = function () {
        var mux = new MuxAsyncIterator();
        mux.add(this.acceptConnAndIterateHttpRequests(mux));
        return mux.iterate();
    };
    return Server;
}());
export { Server };
/**
 * Start a HTTP server
 *
 *     import { serve } from "https://deno.land/std/http/server.js";
 *     const body = "Hello World\n";
 *     const s = serve({ port: 8000 });
 *     for await (const req of s) {
 *       req.respond({ body });
 *     }
 */
export function serve(addr) {
    if (typeof addr === "string") {
        var _a = addr.split(":"), hostname_1 = _a[0], port_1 = _a[1];
        addr = { hostname: hostname_1, port: Number(port_1) };
    }
    var listener = listen(addr);
    return new Server(listener);
}
export function listenAndServe(addr, handler) {
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function () {
        var server, server_1, server_1_1, request, e_3_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    server = serve(addr);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    server_1 = __asyncValues(server);
                    _b.label = 2;
                case 2: return [4 /*yield*/, server_1.next()];
                case 3:
                    if (!(server_1_1 = _b.sent(), !server_1_1.done)) return [3 /*break*/, 5];
                    request = server_1_1.value;
                    handler(request);
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_3_1 = _b.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(server_1_1 && !server_1_1.done && (_a = server_1["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(server_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_3) throw e_3.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create an HTTPS server with given options
 *
 *     const body = "Hello HTTPS";
 *     const options = {
 *       hostname: "localhost",
 *       port: 443,
 *       certFile: "./path/to/localhost.crt",
 *       keyFile: "./path/to/localhost.key",
 *     };
 *     for await (const req of serveTLS(options)) {
 *       req.respond({ body });
 *     }
 *
 * @param options Server configuration
 * @return Async iterable server instance for incoming requests
 */
export function serveTLS(options) {
    var tlsOptions = __assign(__assign({}, options), { transport: "tcp" });
    var listener = listenTLS(tlsOptions);
    return new Server(listener);
}
/**
 * Create an HTTPS server with given options and request handler
 *
 *     const body = "Hello HTTPS";
 *     const options = {
 *       hostname: "localhost",
 *       port: 443,
 *       certFile: "./path/to/localhost.crt",
 *       keyFile: "./path/to/localhost.key",
 *     };
 *     listenAndServeTLS(options, (req) => {
 *       req.respond({ body });
 *     });
 *
 * @param options Server configuration
 * @param handler Request handler
 */
export function listenAndServeTLS(options, handler) {
    var e_4, _a;
    return __awaiter(this, void 0, void 0, function () {
        var server, server_2, server_2_1, request, e_4_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    server = serveTLS(options);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    server_2 = __asyncValues(server);
                    _b.label = 2;
                case 2: return [4 /*yield*/, server_2.next()];
                case 3:
                    if (!(server_2_1 = _b.sent(), !server_2_1.done)) return [3 /*break*/, 5];
                    request = server_2_1.value;
                    handler(request);
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_4_1 = _b.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(server_2_1 && !server_2_1.done && (_a = server_2["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(server_2)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_4) throw e_4.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=server.js.map
