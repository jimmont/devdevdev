// Ported from Go:
// https://github.com/golang/go/blob/go1.12.5/src/encoding/csv/
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
import { BufReader } from "../io/bufio.ts";
import { TextProtoReader } from "../textproto/mod.ts";
import { StringReader } from "../io/readers.ts";
import { assert } from "../testing/asserts.ts";
var INVALID_RUNE = ["\r", "\n", '"'];
var ParseError = /** @class */ (function (_super) {
    __extends(ParseError, _super);
    function ParseError(start, line, message) {
        var _this = _super.call(this, message) || this;
        _this.StartLine = start;
        _this.Line = line;
        return _this;
    }
    return ParseError;
}(Error));
export { ParseError };
function chkOptions(opt) {
    if (!opt.comma) {
        opt.comma = ",";
    }
    if (!opt.trimLeadingSpace) {
        opt.trimLeadingSpace = false;
    }
    if (INVALID_RUNE.includes(opt.comma) ||
        (typeof opt.comment === "string" && INVALID_RUNE.includes(opt.comment)) ||
        opt.comma === opt.comment) {
        throw new Error("Invalid Delimiter");
    }
}
function read(Startline, reader, opt) {
    if (opt === void 0) { opt = { comma: ",", trimLeadingSpace: false }; }
    return __awaiter(this, void 0, void 0, function () {
        var tp, line, result, lineIndex, r, trimmedLine, quoteError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tp = new TextProtoReader(reader);
                    result = [];
                    lineIndex = Startline;
                    return [4 /*yield*/, tp.readLine()];
                case 1:
                    r = _a.sent();
                    if (r === Deno.EOF)
                        return [2 /*return*/, Deno.EOF];
                    line = r;
                    // Normalize \r\n to \n on all input lines.
                    if (line.length >= 2 &&
                        line[line.length - 2] === "\r" &&
                        line[line.length - 1] === "\n") {
                        line = line.substring(0, line.length - 2);
                        line = line + "\n";
                    }
                    trimmedLine = line.trimLeft();
                    if (trimmedLine.length === 0) {
                        return [2 /*return*/, []];
                    }
                    // line starting with comment character is ignored
                    if (opt.comment && trimmedLine[0] === opt.comment) {
                        return [2 /*return*/, []];
                    }
                    assert(opt.comma != null);
                    result = line.split(opt.comma);
                    quoteError = false;
                    result = result.map(function (r) {
                        if (opt.trimLeadingSpace) {
                            r = r.trimLeft();
                        }
                        if (r[0] === '"' && r[r.length - 1] === '"') {
                            r = r.substring(1, r.length - 1);
                        }
                        else if (r[0] === '"') {
                            r = r.substring(1, r.length);
                        }
                        if (!opt.lazyQuotes) {
                            if (r[0] !== '"' && r.indexOf('"') !== -1) {
                                quoteError = true;
                            }
                        }
                        return r;
                    });
                    if (quoteError) {
                        throw new ParseError(Startline, lineIndex, 'bare " in non-quoted-field');
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
export function readMatrix(reader, opt) {
    if (opt === void 0) { opt = {
        comma: ",",
        trimLeadingSpace: false,
        lazyQuotes: false
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var result, _nbFields, lineResult, first, lineIndex, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = [];
                    first = true;
                    lineIndex = 0;
                    chkOptions(opt);
                    _a.label = 1;
                case 1: return [4 /*yield*/, read(lineIndex, reader, opt)];
                case 2:
                    r = _a.sent();
                    if (r === Deno.EOF)
                        return [3 /*break*/, 4];
                    lineResult = r;
                    lineIndex++;
                    // If fieldsPerRecord is 0, Read sets it to
                    // the number of fields in the first record
                    if (first) {
                        first = false;
                        if (opt.fieldsPerRecord !== undefined) {
                            if (opt.fieldsPerRecord === 0) {
                                _nbFields = lineResult.length;
                            }
                            else {
                                _nbFields = opt.fieldsPerRecord;
                            }
                        }
                    }
                    if (lineResult.length > 0) {
                        if (_nbFields && _nbFields !== lineResult.length) {
                            throw new ParseError(lineIndex, lineIndex, "wrong number of fields");
                        }
                        result.push(lineResult);
                    }
                    _a.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/, result];
            }
        });
    });
}
/**
 * Csv parse helper to manipulate data.
 * Provides an auto/custom mapper for columns and parse function
 * for columns and rows.
 * @param input Input to parse. Can be a string or BufReader.
 * @param opt options of the parser.
 * @param [opt.header=false] HeaderOptions
 * @param [opt.parse=null] Parse function for rows.
 * Example:
 *     const r = await parseFile('a,b,c\ne,f,g\n', {
 *      header: ["this", "is", "sparta"],
 *       parse: (e: Record<string, unknown>) => {
 *         return { super: e.this, street: e.is, fighter: e.sparta };
 *       }
 *     });
 * // output
 * [
 *   { super: "a", street: "b", fighter: "c" },
 *   { super: "e", street: "f", fighter: "g" }
 * ]
 */
export function parse(input, opt) {
    if (opt === void 0) { opt = {
        header: false
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var r, headers_1, i_1, h, head;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(input instanceof BufReader)) return [3 /*break*/, 2];
                    return [4 /*yield*/, readMatrix(input, opt)];
                case 1:
                    r = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, readMatrix(new BufReader(new StringReader(input)), opt)];
                case 3:
                    r = _a.sent();
                    _a.label = 4;
                case 4:
                    if (opt.header) {
                        headers_1 = [];
                        i_1 = 0;
                        if (Array.isArray(opt.header)) {
                            if (typeof opt.header[0] !== "string") {
                                headers_1 = opt.header;
                            }
                            else {
                                h = opt.header;
                                headers_1 = h.map(function (e) {
                                    return {
                                        name: e
                                    };
                                });
                            }
                        }
                        else {
                            head = r.shift();
                            assert(head != null);
                            headers_1 = head.map(function (e) {
                                return {
                                    name: e
                                };
                            });
                            i_1++;
                        }
                        return [2 /*return*/, r.map(function (e) {
                                if (e.length !== headers_1.length) {
                                    throw "Error number of fields line:" + i_1;
                                }
                                i_1++;
                                var out = {};
                                for (var j = 0; j < e.length; j++) {
                                    var h = headers_1[j];
                                    if (h.parse) {
                                        out[h.name] = h.parse(e[j]);
                                    }
                                    else {
                                        out[h.name] = e[j];
                                    }
                                }
                                if (opt.parse) {
                                    return opt.parse(out);
                                }
                                return out;
                            })];
                    }
                    if (opt.parse) {
                        return [2 /*return*/, r.map(function (e) {
                                assert(opt.parse, "opt.parse must be set");
                                return opt.parse(e);
                            })];
                    }
                    return [2 /*return*/, r];
            }
        });
    });
}
//# sourceMappingURL=csv.js.map