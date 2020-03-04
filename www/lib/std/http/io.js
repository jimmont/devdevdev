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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { UnexpectedEOFError, BufWriter } from "../io/bufio.ts";
import { TextProtoReader } from "../textproto/mod.ts";
import { assert } from "../testing/asserts.ts";
import { encoder } from "../strings/mod.ts";
import { ServerRequest } from "./server.ts";
import { STATUS_TEXT } from "./http_status.ts";
export function emptyReader() {
    return {
        read: function (_) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, Deno.EOF];
                });
            });
        }
    };
}
export function bodyReader(contentLength, r) {
    var totalRead = 0;
    var finished = false;
    function read(buf) {
        return __awaiter(this, void 0, void 0, function () {
            var result, remaining, readBuf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (finished)
                            return [2 /*return*/, Deno.EOF];
                        remaining = contentLength - totalRead;
                        if (!(remaining >= buf.byteLength)) return [3 /*break*/, 2];
                        return [4 /*yield*/, r.read(buf)];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        readBuf = buf.subarray(0, remaining);
                        return [4 /*yield*/, r.read(readBuf)];
                    case 3:
                        result = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (result !== Deno.EOF) {
                            totalRead += result;
                        }
                        finished = totalRead === contentLength;
                        return [2 /*return*/, result];
                }
            });
        });
    }
    return { read: read };
}
export function chunkedBodyReader(h, r) {
    // Based on https://tools.ietf.org/html/rfc2616#section-19.4.6
    var tp = new TextProtoReader(r);
    var finished = false;
    var chunks = [];
    function read(buf) {
        return __awaiter(this, void 0, void 0, function () {
            var chunk, chunkRemaining, readLength, i, line, chunkSizeString, chunkSize, eof, restChunk, bufToFill, eof;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (finished)
                            return [2 /*return*/, Deno.EOF];
                        chunk = chunks[0];
                        if (!chunk) return [3 /*break*/, 3];
                        chunkRemaining = chunk.data.byteLength - chunk.offset;
                        readLength = Math.min(chunkRemaining, buf.byteLength);
                        for (i = 0; i < readLength; i++) {
                            buf[i] = chunk.data[chunk.offset + i];
                        }
                        chunk.offset += readLength;
                        if (!(chunk.offset === chunk.data.byteLength)) return [3 /*break*/, 2];
                        chunks.shift();
                        return [4 /*yield*/, tp.readLine()];
                    case 1:
                        // Consume \r\n;
                        if ((_a.sent()) === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, readLength];
                    case 3: return [4 /*yield*/, tp.readLine()];
                    case 4:
                        line = _a.sent();
                        if (line === Deno.EOF)
                            throw new UnexpectedEOFError();
                        chunkSizeString = line.split(";")[0];
                        chunkSize = parseInt(chunkSizeString, 16);
                        if (Number.isNaN(chunkSize) || chunkSize < 0) {
                            throw new Error("Invalid chunk size");
                        }
                        if (!(chunkSize > 0)) return [3 /*break*/, 11];
                        if (!(chunkSize > buf.byteLength)) return [3 /*break*/, 7];
                        return [4 /*yield*/, r.readFull(buf)];
                    case 5:
                        eof = _a.sent();
                        if (eof === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        restChunk = new Uint8Array(chunkSize - buf.byteLength);
                        return [4 /*yield*/, r.readFull(restChunk)];
                    case 6:
                        eof = _a.sent();
                        if (eof === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        else {
                            chunks.push({
                                offset: 0,
                                data: restChunk
                            });
                        }
                        return [2 /*return*/, buf.byteLength];
                    case 7:
                        bufToFill = buf.subarray(0, chunkSize);
                        return [4 /*yield*/, r.readFull(bufToFill)];
                    case 8:
                        eof = _a.sent();
                        if (eof === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        return [4 /*yield*/, tp.readLine()];
                    case 9:
                        // Consume \r\n
                        if ((_a.sent()) === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        return [2 /*return*/, chunkSize];
                    case 10: return [3 /*break*/, 14];
                    case 11:
                        assert(chunkSize === 0);
                        return [4 /*yield*/, r.readLine()];
                    case 12:
                        // Consume \r\n
                        if ((_a.sent()) === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        return [4 /*yield*/, readTrailers(h, r)];
                    case 13:
                        _a.sent();
                        finished = true;
                        return [2 /*return*/, Deno.EOF];
                    case 14: return [2 /*return*/];
                }
            });
        });
    }
    return { read: read };
}
var kProhibitedTrailerHeaders = [
    "transfer-encoding",
    "content-length",
    "trailer"
];
/**
 * Read trailer headers from reader and append values to headers.
 * "trailer" field will be deleted.
 * */
export function readTrailers(headers, r) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, tp, result, _i, result_1, _a, k, v;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    keys = parseTrailer(headers.get("trailer"));
                    if (!keys)
                        return [2 /*return*/];
                    tp = new TextProtoReader(r);
                    return [4 /*yield*/, tp.readMIMEHeader()];
                case 1:
                    result = _b.sent();
                    assert(result != Deno.EOF, "trailer must be set");
                    for (_i = 0, result_1 = result; _i < result_1.length; _i++) {
                        _a = result_1[_i], k = _a[0], v = _a[1];
                        if (!keys.has(k)) {
                            throw new Error("Undeclared trailer field");
                        }
                        keys["delete"](k);
                        headers.append(k, v);
                    }
                    assert(keys.size === 0, "Missing trailers");
                    headers["delete"]("trailer");
                    return [2 /*return*/];
            }
        });
    });
}
function parseTrailer(field) {
    if (field == null) {
        return undefined;
    }
    var keys = field.split(",").map(function (v) { return v.trim(); });
    if (keys.length === 0) {
        throw new Error("Empty trailer");
    }
    for (var _i = 0, kProhibitedTrailerHeaders_1 = kProhibitedTrailerHeaders; _i < kProhibitedTrailerHeaders_1.length; _i++) {
        var invalid = kProhibitedTrailerHeaders_1[_i];
        if (keys.includes(invalid)) {
            throw new Error("Prohibited field for trailer");
        }
    }
    return new Set(keys);
}
export function writeChunkedBody(w, r) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var writer, _b, _c, chunk, start, end, e_1_1, endChunk;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    writer = BufWriter.create(w);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 9, 10, 15]);
                    _b = __asyncValues(Deno.toAsyncIterator(r));
                    _d.label = 2;
                case 2: return [4 /*yield*/, _b.next()];
                case 3:
                    if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 8];
                    chunk = _c.value;
                    if (chunk.byteLength <= 0)
                        return [3 /*break*/, 7];
                    start = encoder.encode(chunk.byteLength.toString(16) + "\r\n");
                    end = encoder.encode("\r\n");
                    return [4 /*yield*/, writer.write(start)];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, writer.write(chunk)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, writer.write(end)];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7: return [3 /*break*/, 2];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _d.trys.push([10, , 13, 14]);
                    if (!(_c && !_c.done && (_a = _b["return"]))) return [3 /*break*/, 12];
                    return [4 /*yield*/, _a.call(_b)];
                case 11:
                    _d.sent();
                    _d.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15:
                    endChunk = encoder.encode("0\r\n\r\n");
                    return [4 /*yield*/, writer.write(endChunk)];
                case 16:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/** write trailer headers to writer. it mostly should be called after writeResponse */
export function writeTrailers(w, headers, trailers) {
    return __awaiter(this, void 0, void 0, function () {
        var trailer, transferEncoding, writer, trailerHeaderFields, _i, trailerHeaderFields_1, f, _a, trailers_1, _b, key, value;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    trailer = headers.get("trailer");
                    if (trailer === null) {
                        throw new Error('response headers must have "trailer" header field');
                    }
                    transferEncoding = headers.get("transfer-encoding");
                    if (transferEncoding === null || !transferEncoding.match(/^chunked/)) {
                        throw new Error("trailer headers is only allowed for \"transfer-encoding: chunked\": got \"" + transferEncoding + "\"");
                    }
                    writer = BufWriter.create(w);
                    trailerHeaderFields = trailer
                        .split(",")
                        .map(function (s) { return s.trim().toLowerCase(); });
                    for (_i = 0, trailerHeaderFields_1 = trailerHeaderFields; _i < trailerHeaderFields_1.length; _i++) {
                        f = trailerHeaderFields_1[_i];
                        assert(!kProhibitedTrailerHeaders.includes(f), "\"" + f + "\" is prohibited for trailer header");
                    }
                    _a = 0, trailers_1 = trailers;
                    _c.label = 1;
                case 1:
                    if (!(_a < trailers_1.length)) return [3 /*break*/, 4];
                    _b = trailers_1[_a], key = _b[0], value = _b[1];
                    assert(trailerHeaderFields.includes(key), "Not trailer header field: " + key);
                    return [4 /*yield*/, writer.write(encoder.encode(key + ": " + value + "\r\n"))];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, writer.write(encoder.encode("\r\n"))];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, writer.flush()];
                case 6:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function setContentLength(r) {
    if (!r.headers) {
        r.headers = new Headers();
    }
    if (r.body) {
        if (!r.headers.has("content-length")) {
            // typeof r.body === "string" handled in writeResponse.
            if (r.body instanceof Uint8Array) {
                var bodyLength = r.body.byteLength;
                r.headers.set("content-length", bodyLength.toString());
            }
            else {
                r.headers.set("transfer-encoding", "chunked");
            }
        }
    }
}
export function writeResponse(w, r) {
    return __awaiter(this, void 0, void 0, function () {
        var protoMajor, protoMinor, statusCode, statusText, writer, out, headers, _i, headers_1, _a, key, value, header, n, n_1, contentLength, bodyLength, n_2, t;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    protoMajor = 1;
                    protoMinor = 1;
                    statusCode = r.status || 200;
                    statusText = STATUS_TEXT.get(statusCode);
                    writer = BufWriter.create(w);
                    if (!statusText) {
                        throw Error("bad status code");
                    }
                    if (!r.body) {
                        r.body = new Uint8Array();
                    }
                    if (typeof r.body === "string") {
                        r.body = encoder.encode(r.body);
                    }
                    out = "HTTP/" + protoMajor + "." + protoMinor + " " + statusCode + " " + statusText + "\r\n";
                    setContentLength(r);
                    assert(r.headers != null);
                    headers = r.headers;
                    for (_i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
                        _a = headers_1[_i], key = _a[0], value = _a[1];
                        out += key + ": " + value + "\r\n";
                    }
                    out += "\r\n";
                    header = encoder.encode(out);
                    return [4 /*yield*/, writer.write(header)];
                case 1:
                    n = _b.sent();
                    assert(n === header.byteLength);
                    if (!(r.body instanceof Uint8Array)) return [3 /*break*/, 3];
                    return [4 /*yield*/, writer.write(r.body)];
                case 2:
                    n_1 = _b.sent();
                    assert(n_1 === r.body.byteLength);
                    return [3 /*break*/, 7];
                case 3:
                    if (!headers.has("content-length")) return [3 /*break*/, 5];
                    contentLength = headers.get("content-length");
                    assert(contentLength != null);
                    bodyLength = parseInt(contentLength);
                    return [4 /*yield*/, Deno.copy(writer, r.body)];
                case 4:
                    n_2 = _b.sent();
                    assert(n_2 === bodyLength);
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, writeChunkedBody(writer, r.body)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    if (!r.trailers) return [3 /*break*/, 10];
                    return [4 /*yield*/, r.trailers()];
                case 8:
                    t = _b.sent();
                    return [4 /*yield*/, writeTrailers(writer, headers, t)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [4 /*yield*/, writer.flush()];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * ParseHTTPVersion parses a HTTP version string.
 * "HTTP/1.0" returns (1, 0, true).
 * Ported from https://github.com/golang/go/blob/f5c43b9/src/net/http/request.go#L766-L792
 */
export function parseHTTPVersion(vers) {
    switch (vers) {
        case "HTTP/1.1":
            return [1, 1];
        case "HTTP/1.0":
            return [1, 0];
        default: {
            var Big = 1000000; // arbitrary upper bound
            var digitReg = /^\d+$/; // test if string is only digit
            if (!vers.startsWith("HTTP/")) {
                break;
            }
            var dot = vers.indexOf(".");
            if (dot < 0) {
                break;
            }
            var majorStr = vers.substring(vers.indexOf("/") + 1, dot);
            var major = parseInt(majorStr);
            if (!digitReg.test(majorStr) ||
                isNaN(major) ||
                major < 0 ||
                major > Big) {
                break;
            }
            var minorStr = vers.substring(dot + 1);
            var minor = parseInt(minorStr);
            if (!digitReg.test(minorStr) ||
                isNaN(minor) ||
                minor < 0 ||
                minor > Big) {
                break;
            }
            return [major, minor];
        }
    }
    throw new Error("malformed HTTP version " + vers);
}
export function readRequest(conn, bufr) {
    return __awaiter(this, void 0, void 0, function () {
        var tp, firstLine, headers, req;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tp = new TextProtoReader(bufr);
                    return [4 /*yield*/, tp.readLine()];
                case 1:
                    firstLine = _c.sent();
                    if (firstLine === Deno.EOF)
                        return [2 /*return*/, Deno.EOF];
                    return [4 /*yield*/, tp.readMIMEHeader()];
                case 2:
                    headers = _c.sent();
                    if (headers === Deno.EOF)
                        throw new UnexpectedEOFError();
                    req = new ServerRequest();
                    req.conn = conn;
                    req.r = bufr;
                    _a = firstLine.split(" ", 3), req.method = _a[0], req.url = _a[1], req.proto = _a[2];
                    _b = parseHTTPVersion(req.proto), req.protoMinor = _b[0], req.protoMajor = _b[1];
                    req.headers = headers;
                    fixLength(req);
                    return [2 /*return*/, req];
            }
        });
    });
}
function fixLength(req) {
    var contentLength = req.headers.get("Content-Length");
    if (contentLength) {
        var arrClen = contentLength.split(",");
        if (arrClen.length > 1) {
            var distinct = __spreadArrays(new Set(arrClen.map(function (e) { return e.trim(); })));
            if (distinct.length > 1) {
                throw Error("cannot contain multiple Content-Length headers");
            }
            else {
                req.headers.set("Content-Length", distinct[0]);
            }
        }
        var c = req.headers.get("Content-Length");
        if (req.method === "HEAD" && c && c !== "0") {
            throw Error("http: method cannot contain a Content-Length");
        }
        if (c && req.headers.has("transfer-encoding")) {
            // A sender MUST NOT send a Content-Length header field in any message
            // that contains a Transfer-Encoding header field.
            // rfc: https://tools.ietf.org/html/rfc7230#section-3.3.2
            throw new Error("http: Transfer-Encoding and Content-Length cannot be send together");
        }
    }
}
//# sourceMappingURL=io.js.map