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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * Ported and modified from: https://github.com/jshttp/mime-types and
 * licensed as:
 *
 * (The MIT License)
 *
 * Copyright (c) 2011 T. Jameson Little
 * Copyright (c) 2019 Jun Kato
 * Copyright (c) 2020 the Deno authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import { MultiReader } from "../io/readers.js";
import { BufReader } from "../io/bufio.js";
import { assert } from "../testing/asserts.js";
var recordSize = 512;
var ustar = "ustar\u000000";
/**
 * Simple file reader
 */
var FileReader = /** @class */ (function () {
    function FileReader(filePath, mode) {
        if (mode === void 0) { mode = "r"; }
        this.filePath = filePath;
        this.mode = mode;
    }
    FileReader.prototype.read = function (p) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.file) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, Deno.open(this.filePath, this.mode)];
                    case 1:
                        _a.file = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, Deno.read(this.file.rid, p)];
                    case 3:
                        res = _b.sent();
                        if (!(res === Deno.EOF)) return [3 /*break*/, 5];
                        return [4 /*yield*/, Deno.close(this.file.rid)];
                    case 4:
                        _b.sent();
                        this.file = undefined;
                        _b.label = 5;
                    case 5: return [2 /*return*/, res];
                }
            });
        });
    };
    return FileReader;
}());
/**
 * Remove the trailing null codes
 * @param buffer
 */
function trim(buffer) {
    var index = buffer.findIndex(function (v) { return v === 0; });
    if (index < 0)
        return buffer;
    return buffer.subarray(0, index);
}
/**
 * Initialize Uint8Array of the specified length filled with 0
 * @param length
 */
function clean(length) {
    var buffer = new Uint8Array(length);
    buffer.fill(0, 0, length - 1);
    return buffer;
}
function pad(num, bytes, base) {
    var numString = num.toString(base || 8);
    return "000000000000".substr(numString.length + 12 - bytes) + numString;
}
/*
struct posix_header {           // byte offset
    char name[100];               //   0
    char mode[8];                 // 100
    char uid[8];                  // 108
    char gid[8];                  // 116
    char size[12];                // 124
    char mtime[12];               // 136
    char chksum[8];               // 148
    char typeflag;                // 156
    char linkname[100];           // 157
    char magic[6];                // 257
    char version[2];              // 263
    char uname[32];               // 265
    char gname[32];               // 297
    char devmajor[8];             // 329
    char devminor[8];             // 337
    char prefix[155];             // 345
                                // 500
};
*/
var ustarStructure = [
    {
        field: "fileName",
        length: 100
    },
    {
        field: "fileMode",
        length: 8
    },
    {
        field: "uid",
        length: 8
    },
    {
        field: "gid",
        length: 8
    },
    {
        field: "fileSize",
        length: 12
    },
    {
        field: "mtime",
        length: 12
    },
    {
        field: "checksum",
        length: 8
    },
    {
        field: "type",
        length: 1
    },
    {
        field: "linkName",
        length: 100
    },
    {
        field: "ustar",
        length: 8
    },
    {
        field: "owner",
        length: 32
    },
    {
        field: "group",
        length: 32
    },
    {
        field: "majorNumber",
        length: 8
    },
    {
        field: "minorNumber",
        length: 8
    },
    {
        field: "fileNamePrefix",
        length: 155
    },
    {
        field: "padding",
        length: 12
    }
];
/**
 * Create header for a file in a tar archive
 */
function formatHeader(data) {
    var encoder = new TextEncoder(), buffer = clean(512);
    var offset = 0;
    ustarStructure.forEach(function (value) {
        var entry = encoder.encode(data[value.field] || "");
        buffer.set(entry, offset);
        offset += value.length; // space it out with nulls
    });
    return buffer;
}
/**
 * Parse file header in a tar archive
 * @param length
 */
function parseHeader(buffer) {
    var data = {};
    var offset = 0;
    ustarStructure.forEach(function (value) {
        var arr = buffer.subarray(offset, offset + value.length);
        data[value.field] = arr;
        offset += value.length;
    });
    return data;
}
/**
 * A class to create a tar archive
 */
var Tar = /** @class */ (function () {
    function Tar(recordsPerBlock) {
        this.data = [];
        this.written = 0;
        this.blockSize = (recordsPerBlock || 20) * recordSize;
        this.out = clean(this.blockSize);
    }
    /**
     * Append a file to this tar archive
     * @param fn file name
     *                 e.g., test.txt; use slash for directory separators
     * @param opts options
     */
    Tar.prototype.append = function (fn, opts) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var fileName, fileNamePrefix, i, errMsg, info, mode, mtime, uid, gid, fileSize, tarData, checksum, encoder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof fn !== "string") {
                            throw new Error("file name not specified");
                        }
                        fileName = fn;
                        if (fileName.length > 100) {
                            i = fileName.length;
                            while (i >= 0) {
                                i = fileName.lastIndexOf("/", i);
                                if (i <= 155) {
                                    fileNamePrefix = fileName.substr(0, i);
                                    fileName = fileName.substr(i + 1);
                                    break;
                                }
                                i--;
                            }
                            errMsg = "ustar format does not allow a long file name (length of [file name" +
                                "prefix] + / + [file name] must be shorter than 256 bytes)";
                            if (i < 0 || fileName.length > 100) {
                                throw new Error(errMsg);
                            }
                            else {
                                assert(fileNamePrefix != null);
                                if (fileNamePrefix.length > 155) {
                                    throw new Error(errMsg);
                                }
                            }
                        }
                        opts = opts || {};
                        if (!opts.filePath) return [3 /*break*/, 2];
                        return [4 /*yield*/, Deno.stat(opts.filePath)];
                    case 1:
                        info = _b.sent();
                        _b.label = 2;
                    case 2:
                        mode = opts.fileMode || (info && info.mode) || parseInt("777", 8) & 0xfff, mtime = opts.mtime ||
                            (info && info.modified) ||
                            Math.floor(new Date().getTime() / 1000), uid = opts.uid || 0, gid = opts.gid || 0;
                        if (typeof opts.owner === "string" && opts.owner.length >= 32) {
                            throw new Error("ustar format does not allow owner name length >= 32 bytes");
                        }
                        if (typeof opts.group === "string" && opts.group.length >= 32) {
                            throw new Error("ustar format does not allow group name length >= 32 bytes");
                        }
                        fileSize = (_a = info === null || info === void 0 ? void 0 : info.len) !== null && _a !== void 0 ? _a : opts.contentSize;
                        assert(fileSize != null, "fileSize must be set");
                        tarData = {
                            fileName: fileName,
                            fileNamePrefix: fileNamePrefix,
                            fileMode: pad(mode, 7),
                            uid: pad(uid, 7),
                            gid: pad(gid, 7),
                            fileSize: pad(fileSize, 11),
                            mtime: pad(mtime, 11),
                            checksum: "        ",
                            type: "0",
                            ustar: ustar,
                            owner: opts.owner || "",
                            group: opts.group || "",
                            filePath: opts.filePath,
                            reader: opts.reader
                        };
                        checksum = 0;
                        encoder = new TextEncoder();
                        Object.keys(tarData)
                            .filter(function (key) { return ["filePath", "reader"].indexOf(key) < 0; })
                            .forEach(function (key) {
                            checksum += encoder
                                .encode(tarData[key])
                                .reduce(function (p, c) { return p + c; }, 0);
                        });
                        tarData.checksum = pad(checksum, 6) + "\u0000 ";
                        this.data.push(tarData);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a Reader instance for this tar data
     */
    Tar.prototype.getReader = function () {
        var readers = [];
        this.data.forEach(function (tarData) {
            var reader = tarData.reader;
            var filePath = tarData.filePath;
            var headerArr = formatHeader(tarData);
            readers.push(new Deno.Buffer(headerArr));
            if (!reader) {
                assert(filePath != null);
                reader = new FileReader(filePath);
            }
            readers.push(reader);
            // to the nearest multiple of recordSize
            assert(tarData.fileSize != null, "fileSize must be set");
            readers.push(new Deno.Buffer(clean(recordSize -
                (parseInt(tarData.fileSize, 8) % recordSize || recordSize))));
        });
        // append 2 empty records
        readers.push(new Deno.Buffer(clean(recordSize * 2)));
        return new (MultiReader.bind.apply(MultiReader, __spreadArrays([void 0], readers)))();
    };
    return Tar;
}());
export { Tar };
/**
 * A class to create a tar archive
 */
var Untar = /** @class */ (function () {
    function Untar(reader) {
        this.reader = new BufReader(reader);
        this.block = new Uint8Array(recordSize);
    }
    Untar.prototype.extract = function (writer) {
        return __awaiter(this, void 0, void 0, function () {
            var header, checksum, encoder, decoder, magic, meta, fileNamePrefix, len, rest, arr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reader.readFull(this.block)];
                    case 1:
                        _a.sent();
                        header = parseHeader(this.block);
                        checksum = 0;
                        encoder = new TextEncoder(), decoder = new TextDecoder("ascii");
                        Object.keys(header)
                            .filter(function (key) { return key !== "checksum"; })
                            .forEach(function (key) {
                            checksum += header[key].reduce(function (p, c) { return p + c; }, 0);
                        });
                        checksum += encoder.encode("        ").reduce(function (p, c) { return p + c; }, 0);
                        if (parseInt(decoder.decode(header.checksum), 8) !== checksum) {
                            throw new Error("checksum error");
                        }
                        magic = decoder.decode(header.ustar);
                        if (magic !== ustar) {
                            throw new Error("unsupported archive format: " + magic);
                        }
                        meta = {
                            fileName: decoder.decode(trim(header.fileName))
                        };
                        fileNamePrefix = trim(header.fileNamePrefix);
                        if (fileNamePrefix.byteLength > 0) {
                            meta.fileName = decoder.decode(fileNamePrefix) + "/" + meta.fileName;
                        }
                        ["fileMode", "mtime", "uid", "gid"].forEach(function (key) {
                            var arr = trim(header[key]);
                            if (arr.byteLength > 0) {
                                meta[key] = parseInt(decoder.decode(arr), 8);
                            }
                        });
                        ["owner", "group"].forEach(function (key) {
                            var arr = trim(header[key]);
                            if (arr.byteLength > 0) {
                                meta[key] = decoder.decode(arr);
                            }
                        });
                        len = parseInt(decoder.decode(header.fileSize), 8);
                        rest = len;
                        _a.label = 2;
                    case 2:
                        if (!(rest > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.reader.readFull(this.block)];
                    case 3:
                        _a.sent();
                        arr = rest < recordSize ? this.block.subarray(0, rest) : this.block;
                        return [4 /*yield*/, Deno.copy(writer, new Deno.Buffer(arr))];
                    case 4:
                        _a.sent();
                        rest -= recordSize;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, meta];
                }
            });
        });
    };
    return Untar;
}());
export { Untar };
//# sourceMappingURL=tar.js.map
