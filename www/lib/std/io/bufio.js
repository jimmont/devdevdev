// Based on https://github.com/golang/go/blob/891682/src/bufio/bufio.go
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
import { charCode, copyBytes } from "./util.ts";
import { assert } from "../testing/asserts.ts";
var DEFAULT_BUF_SIZE = 4096;
var MIN_BUF_SIZE = 16;
var MAX_CONSECUTIVE_EMPTY_READS = 100;
var CR = charCode("\r");
var LF = charCode("\n");
var BufferFullError = /** @class */ (function (_super) {
    __extends(BufferFullError, _super);
    function BufferFullError(partial) {
        var _this = _super.call(this, "Buffer full") || this;
        _this.partial = partial;
        _this.name = "BufferFullError";
        return _this;
    }
    return BufferFullError;
}(Error));
export { BufferFullError };
var UnexpectedEOFError = /** @class */ (function (_super) {
    __extends(UnexpectedEOFError, _super);
    function UnexpectedEOFError() {
        var _this = _super.call(this, "Unexpected EOF") || this;
        _this.name = "UnexpectedEOFError";
        return _this;
    }
    return UnexpectedEOFError;
}(Error));
export { UnexpectedEOFError };
/** BufReader implements buffering for a Reader object. */
var BufReader = /** @class */ (function () {
    function BufReader(rd, size) {
        if (size === void 0) { size = DEFAULT_BUF_SIZE; }
        this.r = 0; // buf read position.
        this.w = 0; // buf write position.
        this.eof = false;
        if (size < MIN_BUF_SIZE) {
            size = MIN_BUF_SIZE;
        }
        this._reset(new Uint8Array(size), rd);
    }
    // private lastByte: number;
    // private lastCharSize: number;
    /** return new BufReader unless r is BufReader */
    BufReader.create = function (r, size) {
        if (size === void 0) { size = DEFAULT_BUF_SIZE; }
        return r instanceof BufReader ? r : new BufReader(r, size);
    };
    /** Returns the size of the underlying buffer in bytes. */
    BufReader.prototype.size = function () {
        return this.buf.byteLength;
    };
    BufReader.prototype.buffered = function () {
        return this.w - this.r;
    };
    // Reads a new chunk into the buffer.
    BufReader.prototype._fill = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, rr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Slide existing data to beginning.
                        if (this.r > 0) {
                            this.buf.copyWithin(0, this.r, this.w);
                            this.w -= this.r;
                            this.r = 0;
                        }
                        if (this.w >= this.buf.byteLength) {
                            throw Error("bufio: tried to fill full buffer");
                        }
                        i = MAX_CONSECUTIVE_EMPTY_READS;
                        _a.label = 1;
                    case 1:
                        if (!(i > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.rd.read(this.buf.subarray(this.w))];
                    case 2:
                        rr = _a.sent();
                        if (rr === Deno.EOF) {
                            this.eof = true;
                            return [2 /*return*/];
                        }
                        assert(rr >= 0, "negative read");
                        this.w += rr;
                        if (rr > 0) {
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3:
                        i--;
                        return [3 /*break*/, 1];
                    case 4: throw new Error("No progress after " + MAX_CONSECUTIVE_EMPTY_READS + " read() calls");
                }
            });
        });
    };
    /** Discards any buffered data, resets all state, and switches
     * the buffered reader to read from r.
     */
    BufReader.prototype.reset = function (r) {
        this._reset(this.buf, r);
    };
    BufReader.prototype._reset = function (buf, rd) {
        this.buf = buf;
        this.rd = rd;
        this.eof = false;
        // this.lastByte = -1;
        // this.lastCharSize = -1;
    };
    /** reads data into p.
     * It returns the number of bytes read into p.
     * The bytes are taken from at most one Read on the underlying Reader,
     * hence n may be less than len(p).
     * To read exactly len(p) bytes, use io.ReadFull(b, p).
     */
    BufReader.prototype.read = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            var rr, rr_1, nread, copied;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rr = p.byteLength;
                        if (p.byteLength === 0)
                            return [2 /*return*/, rr];
                        if (!(this.r === this.w)) return [3 /*break*/, 4];
                        if (!(p.byteLength >= this.buf.byteLength)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.rd.read(p)];
                    case 1:
                        rr_1 = _a.sent();
                        nread = rr_1 === Deno.EOF ? 0 : rr_1;
                        assert(nread >= 0, "negative read");
                        // if (rr.nread > 0) {
                        //   this.lastByte = p[rr.nread - 1];
                        //   this.lastCharSize = -1;
                        // }
                        return [2 /*return*/, rr_1];
                    case 2:
                        // One read.
                        // Do not use this.fill, which will loop.
                        this.r = 0;
                        this.w = 0;
                        return [4 /*yield*/, this.rd.read(this.buf)];
                    case 3:
                        rr = _a.sent();
                        if (rr === 0 || rr === Deno.EOF)
                            return [2 /*return*/, rr];
                        assert(rr >= 0, "negative read");
                        this.w += rr;
                        _a.label = 4;
                    case 4:
                        copied = copyBytes(p, this.buf.subarray(this.r, this.w), 0);
                        this.r += copied;
                        // this.lastByte = this.buf[this.r - 1];
                        // this.lastCharSize = -1;
                        return [2 /*return*/, copied];
                }
            });
        });
    };
    /** reads exactly `p.length` bytes into `p`.
     *
     * If successful, `p` is returned.
     *
     * If the end of the underlying stream has been reached, and there are no more
     * bytes available in the buffer, `readFull()` returns `EOF` instead.
     *
     * An error is thrown if some bytes could be read, but not enough to fill `p`
     * entirely before the underlying stream reported an error or EOF. Any error
     * thrown will have a `partial` property that indicates the slice of the
     * buffer that has been successfully filled with data.
     *
     * Ported from https://golang.org/pkg/io/#ReadFull
     */
    BufReader.prototype.readFull = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            var bytesRead, rr, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bytesRead = 0;
                        _a.label = 1;
                    case 1:
                        if (!(bytesRead < p.length)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.read(p.subarray(bytesRead))];
                    case 3:
                        rr = _a.sent();
                        if (rr === Deno.EOF) {
                            if (bytesRead === 0) {
                                return [2 /*return*/, Deno.EOF];
                            }
                            else {
                                throw new UnexpectedEOFError();
                            }
                        }
                        bytesRead += rr;
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        err_1.partial = p.subarray(0, bytesRead);
                        throw err_1;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, p];
                }
            });
        });
    };
    /** Returns the next byte [0, 255] or `EOF`. */
    BufReader.prototype.readByte = function () {
        return __awaiter(this, void 0, void 0, function () {
            var c;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.r === this.w)) return [3 /*break*/, 2];
                        if (this.eof)
                            return [2 /*return*/, Deno.EOF];
                        return [4 /*yield*/, this._fill()];
                    case 1:
                        _a.sent(); // buffer is empty.
                        return [3 /*break*/, 0];
                    case 2:
                        c = this.buf[this.r];
                        this.r++;
                        // this.lastByte = c;
                        return [2 /*return*/, c];
                }
            });
        });
    };
    /** readString() reads until the first occurrence of delim in the input,
     * returning a string containing the data up to and including the delimiter.
     * If ReadString encounters an error before finding a delimiter,
     * it returns the data read before the error and the error itself
     * (often io.EOF).
     * ReadString returns err != nil if and only if the returned data does not end
     * in delim.
     * For simple uses, a Scanner may be more convenient.
     */
    BufReader.prototype.readString = function (delim) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (delim.length !== 1)
                            throw new Error("Delimiter should be a single character");
                        return [4 /*yield*/, this.readSlice(delim.charCodeAt(0))];
                    case 1:
                        buffer = _a.sent();
                        if (buffer == Deno.EOF)
                            return [2 /*return*/, Deno.EOF];
                        return [2 /*return*/, new TextDecoder().decode(buffer)];
                }
            });
        });
    };
    /** `readLine()` is a low-level line-reading primitive. Most callers should
     * use `readString('\n')` instead or use a Scanner.
     *
     * `readLine()` tries to return a single line, not including the end-of-line
     * bytes. If the line was too long for the buffer then `more` is set and the
     * beginning of the line is returned. The rest of the line will be returned
     * from future calls. `more` will be false when returning the last fragment
     * of the line. The returned buffer is only valid until the next call to
     * `readLine()`.
     *
     * The text returned from ReadLine does not include the line end ("\r\n" or
     * "\n").
     *
     * When the end of the underlying stream is reached, the final bytes in the
     * stream are returned. No indication or error is given if the input ends
     * without a final line end. When there are no more trailing bytes to read,
     * `readLine()` returns the `EOF` symbol.
     *
     * Calling `unreadByte()` after `readLine()` will always unread the last byte
     * read (possibly a character belonging to the line end) even if that byte is
     * not part of the line returned by `readLine()`.
     */
    BufReader.prototype.readLine = function () {
        return __awaiter(this, void 0, void 0, function () {
            var line, err_2, partial, drop;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.readSlice(LF)];
                    case 1:
                        line = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        partial = err_2.partial;
                        assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
                        // Don't throw if `readSlice()` failed with `BufferFullError`, instead we
                        // just return whatever is available and set the `more` flag.
                        if (!(err_2 instanceof BufferFullError)) {
                            throw err_2;
                        }
                        // Handle the case where "\r\n" straddles the buffer.
                        if (!this.eof &&
                            partial.byteLength > 0 &&
                            partial[partial.byteLength - 1] === CR) {
                            // Put the '\r' back on buf and drop it from line.
                            // Let the next call to ReadLine check for "\r\n".
                            assert(this.r > 0, "bufio: tried to rewind past start of buffer");
                            this.r--;
                            partial = partial.subarray(0, partial.byteLength - 1);
                        }
                        return [2 /*return*/, { line: partial, more: !this.eof }];
                    case 3:
                        if (line === Deno.EOF) {
                            return [2 /*return*/, Deno.EOF];
                        }
                        if (line.byteLength === 0) {
                            return [2 /*return*/, { line: line, more: false }];
                        }
                        if (line[line.byteLength - 1] == LF) {
                            drop = 1;
                            if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                                drop = 2;
                            }
                            line = line.subarray(0, line.byteLength - drop);
                        }
                        return [2 /*return*/, { line: line, more: false }];
                }
            });
        });
    };
    /** `readSlice()` reads until the first occurrence of `delim` in the input,
     * returning a slice pointing at the bytes in the buffer. The bytes stop
     * being valid at the next read.
     *
     * If `readSlice()` encounters an error before finding a delimiter, or the
     * buffer fills without finding a delimiter, it throws an error with a
     * `partial` property that contains the entire buffer.
     *
     * If `readSlice()` encounters the end of the underlying stream and there are
     * any bytes left in the buffer, the rest of the buffer is returned. In other
     * words, EOF is always treated as a delimiter. Once the buffer is empty,
     * it returns `EOF`.
     *
     * Because the data returned from `readSlice()` will be overwritten by the
     * next I/O operation, most clients should use `readString()` instead.
     */
    BufReader.prototype.readSlice = function (delim) {
        return __awaiter(this, void 0, void 0, function () {
            var s, slice, i, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 6];
                        i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
                        if (i >= 0) {
                            i += s;
                            slice = this.buf.subarray(this.r, this.r + i + 1);
                            this.r += i + 1;
                            return [3 /*break*/, 6];
                        }
                        // EOF?
                        if (this.eof) {
                            if (this.r === this.w) {
                                return [2 /*return*/, Deno.EOF];
                            }
                            slice = this.buf.subarray(this.r, this.w);
                            this.r = this.w;
                            return [3 /*break*/, 6];
                        }
                        // Buffer full?
                        if (this.buffered() >= this.buf.byteLength) {
                            this.r = this.w;
                            throw new BufferFullError(this.buf);
                        }
                        s = this.w - this.r; // do not rescan area we scanned before
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._fill()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        err_3.partial = slice;
                        throw err_3;
                    case 5: return [3 /*break*/, 1];
                    case 6: 
                    // Handle last byte, if any.
                    // const i = slice.byteLength - 1;
                    // if (i >= 0) {
                    //   this.lastByte = slice[i];
                    //   this.lastCharSize = -1
                    // }
                    return [2 /*return*/, slice];
                }
            });
        });
    };
    /** `peek()` returns the next `n` bytes without advancing the reader. The
     * bytes stop being valid at the next read call.
     *
     * When the end of the underlying stream is reached, but there are unread
     * bytes left in the buffer, those bytes are returned. If there are no bytes
     * left in the buffer, it returns `EOF`.
     *
     * If an error is encountered before `n` bytes are available, `peek()` throws
     * an error with the `partial` property set to a slice of the buffer that
     * contains the bytes that were available before the error occurred.
     */
    BufReader.prototype.peek = function (n) {
        return __awaiter(this, void 0, void 0, function () {
            var avail, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (n < 0) {
                            throw Error("negative count");
                        }
                        avail = this.w - this.r;
                        _a.label = 1;
                    case 1:
                        if (!(avail < n && avail < this.buf.byteLength && !this.eof)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._fill()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_4 = _a.sent();
                        err_4.partial = this.buf.subarray(this.r, this.w);
                        throw err_4;
                    case 5:
                        avail = this.w - this.r;
                        return [3 /*break*/, 1];
                    case 6:
                        if (avail === 0 && this.eof) {
                            return [2 /*return*/, Deno.EOF];
                        }
                        else if (avail < n && this.eof) {
                            return [2 /*return*/, this.buf.subarray(this.r, this.r + avail)];
                        }
                        else if (avail < n) {
                            throw new BufferFullError(this.buf.subarray(this.r, this.w));
                        }
                        return [2 /*return*/, this.buf.subarray(this.r, this.r + n)];
                }
            });
        });
    };
    return BufReader;
}());
export { BufReader };
/** BufWriter implements buffering for an deno.Writer object.
 * If an error occurs writing to a Writer, no more data will be
 * accepted and all subsequent writes, and flush(), will return the error.
 * After all data has been written, the client should call the
 * flush() method to guarantee all data has been forwarded to
 * the underlying deno.Writer.
 */
var BufWriter = /** @class */ (function () {
    function BufWriter(wr, size) {
        if (size === void 0) { size = DEFAULT_BUF_SIZE; }
        this.wr = wr;
        this.n = 0;
        this.err = null;
        if (size <= 0) {
            size = DEFAULT_BUF_SIZE;
        }
        this.buf = new Uint8Array(size);
    }
    /** return new BufWriter unless w is BufWriter */
    BufWriter.create = function (w, size) {
        if (size === void 0) { size = DEFAULT_BUF_SIZE; }
        return w instanceof BufWriter ? w : new BufWriter(w, size);
    };
    /** Size returns the size of the underlying buffer in bytes. */
    BufWriter.prototype.size = function () {
        return this.buf.byteLength;
    };
    /** Discards any unflushed buffered data, clears any error, and
     * resets b to write its output to w.
     */
    BufWriter.prototype.reset = function (w) {
        this.err = null;
        this.n = 0;
        this.wr = w;
    };
    /** Flush writes any buffered data to the underlying io.Writer. */
    BufWriter.prototype.flush = function () {
        return __awaiter(this, void 0, void 0, function () {
            var n, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.err !== null)
                            throw this.err;
                        if (this.n === 0)
                            return [2 /*return*/];
                        n = 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.wr.write(this.buf.subarray(0, this.n))];
                    case 2:
                        n = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.err = e_1;
                        throw e_1;
                    case 4:
                        if (n < this.n) {
                            if (n > 0) {
                                this.buf.copyWithin(0, n, this.n);
                                this.n -= n;
                            }
                            this.err = new Error("Short write");
                            throw this.err;
                        }
                        this.n = 0;
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Returns how many bytes are unused in the buffer. */
    BufWriter.prototype.available = function () {
        return this.buf.byteLength - this.n;
    };
    /** buffered returns the number of bytes that have been written into the
     * current buffer.
     */
    BufWriter.prototype.buffered = function () {
        return this.n;
    };
    /** Writes the contents of p into the buffer.
     * Returns the number of bytes written.
     */
    BufWriter.prototype.write = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            var nn, n, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.err !== null)
                            throw this.err;
                        if (p.length === 0)
                            return [2 /*return*/, 0];
                        nn = 0;
                        n = 0;
                        _a.label = 1;
                    case 1:
                        if (!(p.byteLength > this.available())) return [3 /*break*/, 9];
                        if (!(this.buffered() === 0)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.wr.write(p)];
                    case 3:
                        n = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        this.err = e_2;
                        throw e_2;
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        n = copyBytes(this.buf, p, this.n);
                        this.n += n;
                        return [4 /*yield*/, this.flush()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        nn += n;
                        p = p.subarray(n);
                        return [3 /*break*/, 1];
                    case 9:
                        n = copyBytes(this.buf, p, this.n);
                        this.n += n;
                        nn += n;
                        return [2 /*return*/, nn];
                }
            });
        });
    };
    return BufWriter;
}());
export { BufWriter };
/** Generate longest proper prefix which is also suffix array. */
function createLPS(pat) {
    var lps = new Uint8Array(pat.length);
    lps[0] = 0;
    var prefixEnd = 0;
    var i = 1;
    while (i < lps.length) {
        if (pat[i] == pat[prefixEnd]) {
            prefixEnd++;
            lps[i] = prefixEnd;
            i++;
        }
        else if (prefixEnd === 0) {
            lps[i] = 0;
            i++;
        }
        else {
            prefixEnd = pat[prefixEnd - 1];
        }
    }
    return lps;
}
/** Read delimited bytes from a Reader. */
export function readDelim(reader, delim) {
    return __asyncGenerator(this, arguments, function readDelim_1() {
        var delimLen, delimLPS, inputBuffer, inspectArr, inspectIndex, matchIndex, result, sliceRead, sliceToProcess, matchEnd, readyBytes, pendingBytes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    delimLen = delim.length;
                    delimLPS = createLPS(delim);
                    inputBuffer = new Deno.Buffer();
                    inspectArr = new Uint8Array(Math.max(1024, delimLen + 1));
                    inspectIndex = 0;
                    matchIndex = 0;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 17];
                    return [4 /*yield*/, __await(reader.read(inspectArr))];
                case 2:
                    result = _a.sent();
                    if (!(result === Deno.EOF)) return [3 /*break*/, 6];
                    return [4 /*yield*/, __await(inputBuffer.bytes())];
                case 3: 
                // Yield last chunk.
                return [4 /*yield*/, _a.sent()];
                case 4:
                    // Yield last chunk.
                    _a.sent();
                    return [4 /*yield*/, __await(void 0)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6:
                    if (!(result < 0)) return [3 /*break*/, 8];
                    return [4 /*yield*/, __await(void 0)];
                case 7: 
                // Discard all remaining and silently fail.
                return [2 /*return*/, _a.sent()];
                case 8:
                    sliceRead = inspectArr.subarray(0, result);
                    return [4 /*yield*/, __await(Deno.writeAll(inputBuffer, sliceRead))];
                case 9:
                    _a.sent();
                    sliceToProcess = inputBuffer.bytes();
                    _a.label = 10;
                case 10:
                    if (!(inspectIndex < sliceToProcess.length)) return [3 /*break*/, 16];
                    if (!(sliceToProcess[inspectIndex] === delim[matchIndex])) return [3 /*break*/, 14];
                    inspectIndex++;
                    matchIndex++;
                    if (!(matchIndex === delimLen)) return [3 /*break*/, 13];
                    matchEnd = inspectIndex - delimLen;
                    readyBytes = sliceToProcess.subarray(0, matchEnd);
                    pendingBytes = sliceToProcess.slice(inspectIndex);
                    return [4 /*yield*/, __await(readyBytes)];
                case 11: return [4 /*yield*/, _a.sent()];
                case 12:
                    _a.sent();
                    // Reset match, different from KMP.
                    sliceToProcess = pendingBytes;
                    inspectIndex = 0;
                    matchIndex = 0;
                    _a.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (matchIndex === 0) {
                        inspectIndex++;
                    }
                    else {
                        matchIndex = delimLPS[matchIndex - 1];
                    }
                    _a.label = 15;
                case 15: return [3 /*break*/, 10];
                case 16:
                    // Keep inspectIndex and matchIndex.
                    inputBuffer = new Deno.Buffer(sliceToProcess);
                    return [3 /*break*/, 1];
                case 17: return [2 /*return*/];
            }
        });
    });
}
/** Read delimited strings from a Reader. */
export function readStringDelim(reader, delim) {
    return __asyncGenerator(this, arguments, function readStringDelim_1() {
        var encoder, decoder, _a, _b, chunk, e_3_1;
        var e_3, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    encoder = new TextEncoder();
                    decoder = new TextDecoder();
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, 9, 14]);
                    _a = __asyncValues(readDelim(reader, encoder.encode(delim)));
                    _d.label = 2;
                case 2: return [4 /*yield*/, __await(_a.next())];
                case 3:
                    if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 7];
                    chunk = _b.value;
                    return [4 /*yield*/, __await(decoder.decode(chunk))];
                case 4: return [4 /*yield*/, _d.sent()];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6: return [3 /*break*/, 2];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_3_1 = _d.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _d.trys.push([9, , 12, 13]);
                    if (!(_b && !_b.done && (_c = _a["return"]))) return [3 /*break*/, 11];
                    return [4 /*yield*/, __await(_c.call(_a))];
                case 10:
                    _d.sent();
                    _d.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_3) throw e_3.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
/** Read strings line-by-line from a Reader. */
export function readLines(reader) {
    return __asyncGenerator(this, arguments, function readLines_1() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(readStringDelim(reader, "\n"))))];
                case 1: return [4 /*yield*/, __await.apply(void 0, [_a.sent()])];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=bufio.js.map