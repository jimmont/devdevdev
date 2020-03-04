// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
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
var Buffer = Deno.Buffer, copy = Deno.copy, remove = Deno.remove;
var min = Math.min, max = Math.max;
import { equal, findIndex, findLastIndex, hasPrefix } from "../bytes/mod.ts";
import { copyN } from "../io/ioutil.ts";
import { MultiReader } from "../io/readers.ts";
import { extname } from "../path/mod.ts";
import { tempFile } from "../io/util.ts";
import { BufReader, BufWriter, UnexpectedEOFError } from "../io/bufio.ts";
import { encoder } from "../strings/mod.ts";
import { assertStrictEq, assert } from "../testing/asserts.ts";
import { TextProtoReader } from "../textproto/mod.ts";
import { hasOwnProperty } from "../util/has_own_property.ts";
/** Type guard for FormFile */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFormFile(x) {
    return hasOwnProperty(x, "filename") && hasOwnProperty(x, "type");
}
function randomBoundary() {
    var boundary = "--------------------------";
    for (var i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 10).toString(16);
    }
    return boundary;
}
/**
 * Checks whether `buf` should be considered to match the boundary.
 *
 * The prefix is "--boundary" or "\r\n--boundary" or "\n--boundary", and the
 * caller has verified already that `hasPrefix(buf, prefix)` is true.
 *
 * `matchAfterPrefix()` returns `1` if the buffer does match the boundary,
 * meaning the prefix is followed by a dash, space, tab, cr, nl, or EOF.
 *
 * It returns `-1` if the buffer definitely does NOT match the boundary,
 * meaning the prefix is followed by some other character.
 * For example, "--foobar" does not match "--foo".
 *
 * It returns `0` more input needs to be read to make the decision,
 * meaning that `buf.length` and `prefix.length` are the same.
 */
export function matchAfterPrefix(buf, prefix, eof) {
    if (buf.length === prefix.length) {
        return eof ? 1 : 0;
    }
    var c = buf[prefix.length];
    if (c === " ".charCodeAt(0) ||
        c === "\t".charCodeAt(0) ||
        c === "\r".charCodeAt(0) ||
        c === "\n".charCodeAt(0) ||
        c === "-".charCodeAt(0)) {
        return 1;
    }
    return -1;
}
/**
 * Scans `buf` to identify how much of it can be safely returned as part of the
 * `PartReader` body.
 *
 * @param buf - The buffer to search for boundaries.
 * @param dashBoundary - Is "--boundary".
 * @param newLineDashBoundary - Is "\r\n--boundary" or "\n--boundary", depending
 * on what mode we are in. The comments below (and the name) assume
 * "\n--boundary", but either is accepted.
 * @param total - The number of bytes read out so far. If total == 0, then a
 * leading "--boundary" is recognized.
 * @param eof - Whether `buf` contains the final bytes in the stream before EOF.
 * If `eof` is false, more bytes are expected to follow.
 * @returns The number of data bytes from buf that can be returned as part of
 * the `PartReader` body.
 */
export function scanUntilBoundary(buf, dashBoundary, newLineDashBoundary, total, eof) {
    if (total === 0) {
        // At beginning of body, allow dashBoundary.
        if (hasPrefix(buf, dashBoundary)) {
            switch (matchAfterPrefix(buf, dashBoundary, eof)) {
                case -1:
                    return dashBoundary.length;
                case 0:
                    return 0;
                case 1:
                    return Deno.EOF;
            }
        }
        if (hasPrefix(dashBoundary, buf)) {
            return 0;
        }
    }
    // Search for "\n--boundary".
    var i = findIndex(buf, newLineDashBoundary);
    if (i >= 0) {
        switch (matchAfterPrefix(buf.slice(i), newLineDashBoundary, eof)) {
            case -1:
                return i + newLineDashBoundary.length;
            case 0:
                return i;
            case 1:
                return i > 0 ? i : Deno.EOF;
        }
    }
    if (hasPrefix(newLineDashBoundary, buf)) {
        return 0;
    }
    // Otherwise, anything up to the final \n is not part of the boundary and so
    // must be part of the body. Also, if the section from the final \n onward is
    // not a prefix of the boundary, it too must be part of the body.
    var j = findLastIndex(buf, newLineDashBoundary.slice(0, 1));
    if (j >= 0 && hasPrefix(newLineDashBoundary, buf.slice(j))) {
        return j;
    }
    return buf.length;
}
var PartReader = /** @class */ (function () {
    function PartReader(mr, headers) {
        this.mr = mr;
        this.headers = headers;
        this.n = 0;
        this.total = 0;
    }
    PartReader.prototype.read = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            var br, peekLength, peekBuf, eof, nread, buf, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        br = this.mr.bufReader;
                        peekLength = 1;
                        _a.label = 1;
                    case 1:
                        if (!(this.n === 0)) return [3 /*break*/, 3];
                        peekLength = max(peekLength, br.buffered());
                        return [4 /*yield*/, br.peek(peekLength)];
                    case 2:
                        peekBuf = _a.sent();
                        if (peekBuf === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        eof = peekBuf.length < peekLength;
                        this.n = scanUntilBoundary(peekBuf, this.mr.dashBoundary, this.mr.newLineDashBoundary, this.total, eof);
                        if (this.n === 0) {
                            // Force buffered I/O to read more into buffer.
                            assertStrictEq(eof, false);
                            peekLength++;
                        }
                        return [3 /*break*/, 1];
                    case 3:
                        if (this.n === Deno.EOF) {
                            return [2 /*return*/, Deno.EOF];
                        }
                        nread = min(p.length, this.n);
                        buf = p.subarray(0, nread);
                        return [4 /*yield*/, br.readFull(buf)];
                    case 4:
                        r = _a.sent();
                        assertStrictEq(r, buf);
                        this.n -= nread;
                        this.total += nread;
                        return [2 /*return*/, nread];
                }
            });
        });
    };
    PartReader.prototype.close = function () { };
    PartReader.prototype.getContentDispositionParams = function () {
        if (this.contentDispositionParams)
            return this.contentDispositionParams;
        var cd = this.headers.get("content-disposition");
        var params = {};
        assert(cd != null, "content-disposition must be set");
        var comps = cd.split(";");
        this.contentDisposition = comps[0];
        comps
            .slice(1)
            .map(function (v) { return v.trim(); })
            .map(function (kv) {
            var _a = kv.split("="), k = _a[0], v = _a[1];
            if (v) {
                var s = v.charAt(0);
                var e = v.charAt(v.length - 1);
                if ((s === e && s === '"') || s === "'") {
                    params[k] = v.substr(1, v.length - 2);
                }
                else {
                    params[k] = v;
                }
            }
        });
        return (this.contentDispositionParams = params);
    };
    Object.defineProperty(PartReader.prototype, "fileName", {
        get: function () {
            return this.getContentDispositionParams()["filename"];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PartReader.prototype, "formName", {
        get: function () {
            var p = this.getContentDispositionParams();
            if (this.contentDisposition === "form-data") {
                return p["name"];
            }
            return "";
        },
        enumerable: true,
        configurable: true
    });
    return PartReader;
}());
function skipLWSPChar(u) {
    var ret = new Uint8Array(u.length);
    var sp = " ".charCodeAt(0);
    var ht = "\t".charCodeAt(0);
    var j = 0;
    for (var i = 0; i < u.length; i++) {
        if (u[i] === sp || u[i] === ht)
            continue;
        ret[j++] = u[i];
    }
    return ret.slice(0, j);
}
/** Reader for parsing multipart/form-data */
var MultipartReader = /** @class */ (function () {
    function MultipartReader(reader, boundary) {
        this.boundary = boundary;
        this.newLine = encoder.encode("\r\n");
        this.newLineDashBoundary = encoder.encode("\r\n--" + this.boundary);
        this.dashBoundaryDash = encoder.encode("--" + this.boundary + "--");
        this.dashBoundary = encoder.encode("--" + this.boundary);
        this.partsRead = 0;
        this.bufReader = new BufReader(reader);
    }
    /** Read all form data from stream.
     * If total size of stored data in memory exceed maxMemory,
     * overflowed file data will be written to temporal files.
     * String field values are never written to files.
     * null value means parsing or writing to file was failed in some reason.
     *  */
    MultipartReader.prototype.readForm = function (maxMemory) {
        return __awaiter(this, void 0, void 0, function () {
            var result, maxValueBytes, buf, p, n_1, value, formFile, n, contentType, ext, _a, file, filepath, size, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = Object.create(null);
                        maxValueBytes = maxMemory + (10 << 20);
                        buf = new Buffer(new Uint8Array(maxValueBytes));
                        _b.label = 1;
                    case 1: return [4 /*yield*/, this.nextPart()];
                    case 2:
                        p = _b.sent();
                        if (p === Deno.EOF) {
                            return [3 /*break*/, 15];
                        }
                        if (p.formName === "") {
                            return [3 /*break*/, 14];
                        }
                        buf.reset();
                        if (!!p.fileName) return [3 /*break*/, 4];
                        return [4 /*yield*/, copyN(buf, p, maxValueBytes)];
                    case 3:
                        n_1 = _b.sent();
                        maxValueBytes -= n_1;
                        if (maxValueBytes < 0) {
                            throw new RangeError("message too large");
                        }
                        value = buf.toString();
                        result[p.formName] = value;
                        return [3 /*break*/, 14];
                    case 4:
                        formFile = null;
                        return [4 /*yield*/, copy(buf, p)];
                    case 5:
                        n = _b.sent();
                        contentType = p.headers.get("content-type");
                        assert(contentType != null, "content-type must be set");
                        if (!(n > maxMemory)) return [3 /*break*/, 12];
                        ext = extname(p.fileName);
                        return [4 /*yield*/, tempFile(".", {
                                prefix: "multipart-",
                                postfix: ext
                            })];
                    case 6:
                        _a = _b.sent(), file = _a.file, filepath = _a.filepath;
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 11]);
                        return [4 /*yield*/, copyN(file, new MultiReader(buf, p), maxValueBytes)];
                    case 8:
                        size = _b.sent();
                        file.close();
                        formFile = {
                            filename: p.fileName,
                            type: contentType,
                            tempfile: filepath,
                            size: size
                        };
                        return [3 /*break*/, 11];
                    case 9:
                        e_1 = _b.sent();
                        return [4 /*yield*/, remove(filepath)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        formFile = {
                            filename: p.fileName,
                            type: contentType,
                            content: buf.bytes(),
                            size: buf.length
                        };
                        maxMemory -= n;
                        maxValueBytes -= n;
                        _b.label = 13;
                    case 13:
                        result[p.formName] = formFile;
                        _b.label = 14;
                    case 14: return [3 /*break*/, 1];
                    case 15: return [2 /*return*/, result];
                }
            });
        });
    };
    MultipartReader.prototype.nextPart = function () {
        return __awaiter(this, void 0, void 0, function () {
            var expectNewPart, line, r, headers, np;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.currentPart) {
                            this.currentPart.close();
                        }
                        if (equal(this.dashBoundary, encoder.encode("--"))) {
                            throw new Error("boundary is empty");
                        }
                        expectNewPart = false;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, this.bufReader.readSlice("\n".charCodeAt(0))];
                    case 2:
                        line = _a.sent();
                        if (line === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        if (!this.isBoundaryDelimiterLine(line)) return [3 /*break*/, 4];
                        this.partsRead++;
                        r = new TextProtoReader(this.bufReader);
                        return [4 /*yield*/, r.readMIMEHeader()];
                    case 3:
                        headers = _a.sent();
                        if (headers === Deno.EOF) {
                            throw new UnexpectedEOFError();
                        }
                        np = new PartReader(this, headers);
                        this.currentPart = np;
                        return [2 /*return*/, np];
                    case 4:
                        if (this.isFinalBoundary(line)) {
                            return [2 /*return*/, Deno.EOF];
                        }
                        if (expectNewPart) {
                            throw new Error("expecting a new Part; got line " + line);
                        }
                        if (this.partsRead === 0) {
                            return [3 /*break*/, 5];
                        }
                        if (equal(line, this.newLine)) {
                            expectNewPart = true;
                            return [3 /*break*/, 5];
                        }
                        throw new Error("unexpected line in nextPart(): " + line);
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MultipartReader.prototype.isFinalBoundary = function (line) {
        if (!hasPrefix(line, this.dashBoundaryDash)) {
            return false;
        }
        var rest = line.slice(this.dashBoundaryDash.length, line.length);
        return rest.length === 0 || equal(skipLWSPChar(rest), this.newLine);
    };
    MultipartReader.prototype.isBoundaryDelimiterLine = function (line) {
        if (!hasPrefix(line, this.dashBoundary)) {
            return false;
        }
        var rest = line.slice(this.dashBoundary.length);
        return equal(skipLWSPChar(rest), this.newLine);
    };
    return MultipartReader;
}());
export { MultipartReader };
var PartWriter = /** @class */ (function () {
    function PartWriter(writer, boundary, headers, isFirstBoundary) {
        this.writer = writer;
        this.boundary = boundary;
        this.headers = headers;
        this.closed = false;
        this.headersWritten = false;
        var buf = "";
        if (isFirstBoundary) {
            buf += "--" + boundary + "\r\n";
        }
        else {
            buf += "\r\n--" + boundary + "\r\n";
        }
        for (var _i = 0, _a = headers.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            buf += key + ": " + value + "\r\n";
        }
        buf += "\r\n";
        this.partHeader = buf;
    }
    PartWriter.prototype.close = function () {
        this.closed = true;
    };
    PartWriter.prototype.write = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.closed) {
                            throw new Error("part is closed");
                        }
                        if (!!this.headersWritten) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.writer.write(encoder.encode(this.partHeader))];
                    case 1:
                        _a.sent();
                        this.headersWritten = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.writer.write(p)];
                }
            });
        });
    };
    return PartWriter;
}());
function checkBoundary(b) {
    if (b.length < 1 || b.length > 70) {
        throw new Error("invalid boundary length: " + b.length);
    }
    var end = b.length - 1;
    for (var i = 0; i < end; i++) {
        var c = b.charAt(i);
        if (!c.match(/[a-zA-Z0-9'()+_,\-./:=?]/) || (c === " " && i !== end)) {
            throw new Error("invalid boundary character: " + c);
        }
    }
    return b;
}
/** Writer for creating multipart/form-data */
var MultipartWriter = /** @class */ (function () {
    function MultipartWriter(writer, boundary) {
        this.writer = writer;
        this.isClosed = false;
        if (boundary !== void 0) {
            this._boundary = checkBoundary(boundary);
        }
        else {
            this._boundary = randomBoundary();
        }
        this.bufWriter = new BufWriter(writer);
    }
    Object.defineProperty(MultipartWriter.prototype, "boundary", {
        get: function () {
            return this._boundary;
        },
        enumerable: true,
        configurable: true
    });
    MultipartWriter.prototype.formDataContentType = function () {
        return "multipart/form-data; boundary=" + this.boundary;
    };
    MultipartWriter.prototype.createPart = function (headers) {
        if (this.isClosed) {
            throw new Error("multipart: writer is closed");
        }
        if (this.lastPart) {
            this.lastPart.close();
        }
        var part = new PartWriter(this.writer, this.boundary, headers, !this.lastPart);
        this.lastPart = part;
        return part;
    };
    MultipartWriter.prototype.createFormFile = function (field, filename) {
        var h = new Headers();
        h.set("Content-Disposition", "form-data; name=\"" + field + "\"; filename=\"" + filename + "\"");
        h.set("Content-Type", "application/octet-stream");
        return this.createPart(h);
    };
    MultipartWriter.prototype.createFormField = function (field) {
        var h = new Headers();
        h.set("Content-Disposition", "form-data; name=\"" + field + "\"");
        h.set("Content-Type", "application/octet-stream");
        return this.createPart(h);
    };
    MultipartWriter.prototype.writeField = function (field, value) {
        return __awaiter(this, void 0, void 0, function () {
            var f;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createFormField(field)];
                    case 1:
                        f = _a.sent();
                        return [4 /*yield*/, f.write(encoder.encode(value))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MultipartWriter.prototype.writeFile = function (field, filename, file) {
        return __awaiter(this, void 0, void 0, function () {
            var f;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createFormFile(field, filename)];
                    case 1:
                        f = _a.sent();
                        return [4 /*yield*/, copy(f, file)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MultipartWriter.prototype.flush = function () {
        return this.bufWriter.flush();
    };
    /** Close writer. No additional data can be writen to stream */
    MultipartWriter.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isClosed) {
                            throw new Error("multipart: writer is closed");
                        }
                        if (this.lastPart) {
                            this.lastPart.close();
                            this.lastPart = void 0;
                        }
                        return [4 /*yield*/, this.writer.write(encoder.encode("\r\n--" + this.boundary + "--\r\n"))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.flush()];
                    case 2:
                        _a.sent();
                        this.isClosed = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    return MultipartWriter;
}());
export { MultipartWriter };
//# sourceMappingURL=multipart.js.map