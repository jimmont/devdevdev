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
var Buffer = Deno.Buffer, copy = Deno.copy, open = Deno.open, remove = Deno.remove;
import { assert, assertEquals, assertThrows, assertThrowsAsync } from "../testing/asserts.js";
var test = Deno.test;
import * as path from "../path/mod.js";
import { MultipartReader, MultipartWriter, isFormFile, matchAfterPrefix, scanUntilBoundary } from "./multipart.js";
import { StringWriter } from "../io/writers.js";
var e = new TextEncoder();
var boundary = "--abcde";
var dashBoundary = e.encode("--" + boundary);
var nlDashBoundary = e.encode("\r\n--" + boundary);
test(function multipartScanUntilBoundary1() {
    var data = "--" + boundary;
    var n = scanUntilBoundary(e.encode(data), dashBoundary, nlDashBoundary, 0, true);
    assertEquals(n, Deno.EOF);
});
test(function multipartScanUntilBoundary2() {
    var data = "foo\r\n--" + boundary;
    var n = scanUntilBoundary(e.encode(data), dashBoundary, nlDashBoundary, 0, true);
    assertEquals(n, 3);
});
test(function multipartScanUntilBoundary3() {
    var data = "foobar";
    var n = scanUntilBoundary(e.encode(data), dashBoundary, nlDashBoundary, 0, false);
    assertEquals(n, data.length);
});
test(function multipartScanUntilBoundary4() {
    var data = "foo\r\n--";
    var n = scanUntilBoundary(e.encode(data), dashBoundary, nlDashBoundary, 0, false);
    assertEquals(n, 3);
});
test(function multipartMatchAfterPrefix1() {
    var data = boundary + "\r";
    var v = matchAfterPrefix(e.encode(data), e.encode(boundary), false);
    assertEquals(v, 1);
});
test(function multipartMatchAfterPrefix2() {
    var data = boundary + "hoge";
    var v = matchAfterPrefix(e.encode(data), e.encode(boundary), false);
    assertEquals(v, -1);
});
test(function multipartMatchAfterPrefix3() {
    var data = "" + boundary;
    var v = matchAfterPrefix(e.encode(data), e.encode(boundary), false);
    assertEquals(v, 0);
});
test(function multipartMultipartWriter() {
    return __awaiter(this, void 0, void 0, function () {
        var buf, mw, f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = new Buffer();
                    mw = new MultipartWriter(buf);
                    return [4 /*yield*/, mw.writeField("foo", "foo")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mw.writeField("bar", "bar")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, open(path.resolve("./mime/testdata/sample.txt"), "r")];
                case 3:
                    f = _a.sent();
                    return [4 /*yield*/, mw.writeFile("file", "sample.txt", f)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, mw.close()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
test(function multipartMultipartWriter2() {
    var w = new StringWriter();
    assertThrows(function () { return new MultipartWriter(w, ""); }, Error, "invalid boundary length");
    assertThrows(function () {
        return new MultipartWriter(w, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
            "aaaaaaaa");
    }, Error, "invalid boundary length");
    assertThrows(function () { return new MultipartWriter(w, "aaa aaa"); }, Error, "invalid boundary character");
    assertThrows(function () { return new MultipartWriter(w, "boundary¥¥"); }, Error, "invalid boundary character");
});
test(function multipartMultipartWriter3() {
    return __awaiter(this, void 0, void 0, function () {
        var w, mw;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    w = new StringWriter();
                    mw = new MultipartWriter(w);
                    return [4 /*yield*/, mw.writeField("foo", "foo")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mw.close()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, mw.close()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, Error, "closed")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // @ts-ignore
                                    return [4 /*yield*/, mw.writeFile("bar", "file", null)];
                                    case 1:
                                        // @ts-ignore
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, Error, "closed")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, assertThrowsAsync(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, mw.writeField("bar", "bar")];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, Error, "closed")];
                case 5:
                    _a.sent();
                    assertThrows(function () {
                        mw.createFormField("bar");
                    }, Error, "closed");
                    assertThrows(function () {
                        mw.createFormFile("bar", "file");
                    }, Error, "closed");
                    return [2 /*return*/];
            }
        });
    });
});
test(function multipartMultipartReader() {
    return __awaiter(this, void 0, void 0, function () {
        var o, mr, form, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(path.resolve("./mime/testdata/sample.txt"))];
                case 1:
                    o = _a.sent();
                    mr = new MultipartReader(o, "--------------------------434049563556637648550474");
                    return [4 /*yield*/, mr.readForm(10 << 20)];
                case 2:
                    form = _a.sent();
                    assertEquals(form["foo"], "foo");
                    assertEquals(form["bar"], "bar");
                    file = form["file"];
                    assertEquals(isFormFile(file), true);
                    assert(file.content !== void 0);
                    return [2 /*return*/];
            }
        });
    });
});
test(function multipartMultipartReader2() {
    return __awaiter(this, void 0, void 0, function () {
        var o, mr, form, file, f, w, json, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(path.resolve("./mime/testdata/sample.txt"))];
                case 1:
                    o = _a.sent();
                    mr = new MultipartReader(o, "--------------------------434049563556637648550474");
                    return [4 /*yield*/, mr.readForm(20)];
                case 2:
                    form = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 6, 9]);
                    assertEquals(form["foo"], "foo");
                    assertEquals(form["bar"], "bar");
                    file = form["file"];
                    assertEquals(file.type, "application/octet-stream");
                    assert(file.tempfile != null);
                    return [4 /*yield*/, open(file.tempfile)];
                case 4:
                    f = _a.sent();
                    w = new StringWriter();
                    return [4 /*yield*/, copy(w, f)];
                case 5:
                    _a.sent();
                    json = JSON.parse(w.toString());
                    assertEquals(json["compilerOptions"]["target"], "es2018");
                    f.close();
                    return [3 /*break*/, 9];
                case 6:
                    file = form["file"];
                    if (!file.tempfile) return [3 /*break*/, 8];
                    return [4 /*yield*/, remove(file.tempfile)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=multipart_test.js.map
