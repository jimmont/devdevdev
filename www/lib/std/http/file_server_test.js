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
import { assert, assertEquals, assertStrContains } from "../testing/asserts.js";
import { BufReader } from "../io/bufio.js";
import { TextProtoReader } from "../textproto/mod.js";
var test = Deno.test;
var fileServer;
function startFileServer() {
    return __awaiter(this, void 0, void 0, function () {
        var r, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileServer = Deno.run({
                        args: [
                            Deno.execPath(),
                            "run",
                            "--allow-read",
                            "--allow-net",
                            "http/file_server.js",
                            ".",
                            "--cors"
                        ],
                        stdout: "piped",
                        stderr: "null"
                    });
                    // Once fileServer is ready it will write to its stdout.
                    assert(fileServer.stdout != null);
                    r = new TextProtoReader(new BufReader(fileServer.stdout));
                    return [4 /*yield*/, r.readLine()];
                case 1:
                    s = _a.sent();
                    assert(s !== Deno.EOF && s.includes("server listening"));
                    return [2 /*return*/];
            }
        });
    });
}
function killFileServer() {
    var _a;
    fileServer.close();
    (_a = fileServer.stdout) === null || _a === void 0 ? void 0 : _a.close();
}
test(function serveFile() {
    return __awaiter(this, void 0, void 0, function () {
        var res_1, downloadedFile, localFile, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, startFileServer()];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, , 6, 7]);
                    return [4 /*yield*/, fetch("http://localhost:4500/README.md")];
                case 3:
                    res_1 = _c.sent();
                    assert(res_1.headers.has("access-control-allow-origin"));
                    assert(res_1.headers.has("access-control-allow-headers"));
                    assert(res_1.headers.has("content-type"));
                    assert(res_1.headers.get("content-type").includes("charset=utf-8"));
                    return [4 /*yield*/, res_1.text()];
                case 4:
                    downloadedFile = _c.sent();
                    _b = (_a = new TextDecoder()).decode;
                    return [4 /*yield*/, Deno.readFile("README.md")];
                case 5:
                    localFile = _b.apply(_a, [_c.sent()]);
                    assertEquals(downloadedFile, localFile);
                    return [3 /*break*/, 7];
                case 6:
                    killFileServer();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
});
test(function serveDirectory() {
    return __awaiter(this, void 0, void 0, function () {
        var res_2, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startFileServer()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, fetch("http://localhost:4500/")];
                case 3:
                    res_2 = _a.sent();
                    assert(res_2.headers.has("access-control-allow-origin"));
                    assert(res_2.headers.has("access-control-allow-headers"));
                    return [4 /*yield*/, res_2.text()];
                case 4:
                    page = _a.sent();
                    assert(page.includes("README.md"));
                    // `Deno.FileInfo` is not completely compatible with Windows yet
                    // TODO: `mode` should work correctly in the future.
                    // Correct this test case accordingly.
                    Deno.build.os !== "win" &&
                        assert(/<td class="mode">(\s)*\([a-zA-Z-]{10}\)(\s)*<\/td>/.test(page));
                    Deno.build.os === "win" &&
                        assert(/<td class="mode">(\s)*\(unknown mode\)(\s)*<\/td>/.test(page));
                    assert(page.includes("<a href=\"/README.md\">README.md</a>"));
                    return [3 /*break*/, 6];
                case 5:
                    killFileServer();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
});
test(function serveFallback() {
    return __awaiter(this, void 0, void 0, function () {
        var res_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startFileServer()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, fetch("http://localhost:4500/badfile.txt")];
                case 3:
                    res_3 = _a.sent();
                    assert(res_3.headers.has("access-control-allow-origin"));
                    assert(res_3.headers.has("access-control-allow-headers"));
                    assertEquals(res_3.status, 404);
                    return [3 /*break*/, 5];
                case 4:
                    killFileServer();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
});
test(function serveWithUnorthodoxFilename() {
    return __awaiter(this, void 0, void 0, function () {
        var res_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startFileServer()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, fetch("http://localhost:4500/http/testdata/%")];
                case 3:
                    res_4 = _a.sent();
                    assert(res_4.headers.has("access-control-allow-origin"));
                    assert(res_4.headers.has("access-control-allow-headers"));
                    assertEquals(res_4.status, 200);
                    return [4 /*yield*/, fetch("http://localhost:4500/http/testdata/test%20file.txt")];
                case 4:
                    res_4 = _a.sent();
                    assert(res_4.headers.has("access-control-allow-origin"));
                    assert(res_4.headers.has("access-control-allow-headers"));
                    assertEquals(res_4.status, 200);
                    return [3 /*break*/, 6];
                case 5:
                    killFileServer();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
});
test(function servePermissionDenied() {
    return __awaiter(this, void 0, void 0, function () {
        var deniedServer, reader, errReader, s, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    deniedServer = Deno.run({
                        args: [Deno.execPath(), "run", "--allow-net", "http/file_server.js"],
                        stdout: "piped",
                        stderr: "piped"
                    });
                    assert(deniedServer.stdout != null);
                    reader = new TextProtoReader(new BufReader(deniedServer.stdout));
                    assert(deniedServer.stderr != null);
                    errReader = new TextProtoReader(new BufReader(deniedServer.stderr));
                    return [4 /*yield*/, reader.readLine()];
                case 1:
                    s = _b.sent();
                    assert(s !== Deno.EOF && s.includes("server listening"));
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, , 5, 6]);
                    return [4 /*yield*/, fetch("http://localhost:4500/")];
                case 3:
                    _b.sent();
                    _a = assertStrContains;
                    return [4 /*yield*/, errReader.readLine()];
                case 4:
                    _a.apply(void 0, [(_b.sent()),
                        "run again with the --allow-read flag"]);
                    return [3 /*break*/, 6];
                case 5:
                    deniedServer.close();
                    deniedServer.stdout.close();
                    deniedServer.stderr.close();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
});
test(function printHelp() {
    return __awaiter(this, void 0, void 0, function () {
        var helpProcess, r, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    helpProcess = Deno.run({
                        args: [Deno.execPath(), "run", "http/file_server.js", "--help"],
                        stdout: "piped"
                    });
                    assert(helpProcess.stdout != null);
                    r = new TextProtoReader(new BufReader(helpProcess.stdout));
                    return [4 /*yield*/, r.readLine()];
                case 1:
                    s = _a.sent();
                    assert(s !== Deno.EOF && s.includes("Deno File Server"));
                    helpProcess.close();
                    helpProcess.stdout.close();
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=file_server_test.js.map
