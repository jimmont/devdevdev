#!/usr/bin/env -S deno --allow-net
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var _a, _b, _c, _d;
// This program serves files in the current directory over HTTP.
// TODO Stream responses instead of reading them into memory.
// TODO Add tests like these:
// https://github.com/indexzero/http-server/blob/master/test/http-server-test.js
var args = Deno.args, stat = Deno.stat, readDir = Deno.readDir, open = Deno.open, exit = Deno.exit;
import { posix } from "../path/mod.ts";
import { listenAndServe } from "./server.ts";
import { parse } from "../flags/mod.ts";
import { assert } from "../testing/asserts.ts";
import { setContentLength } from "./io.ts";
var encoder = new TextEncoder();
var serverArgs = parse(args);
var CORSEnabled = serverArgs.cors ? true : false;
var target = posix.resolve((_a = serverArgs._[1]) !== null && _a !== void 0 ? _a : "");
var addr = "0.0.0.0:" + ((_c = (_b = serverArgs.port) !== null && _b !== void 0 ? _b : serverArgs.p) !== null && _c !== void 0 ? _c : 4500);
if ((_d = serverArgs.h) !== null && _d !== void 0 ? _d : serverArgs.help) {
    console.log("Deno File Server\n  Serves a local directory in HTTP.\n\nINSTALL:\n  deno install --allow-net --allow-read file_server https://deno.land/std/http/file_server.ts\n\nUSAGE:\n  file_server [path] [options]\n\nOPTIONS:\n  -h, --help          Prints help information\n  -p, --port <PORT>   Set port\n  --cors              Enable CORS via the \"Access-Control-Allow-Origin\" header");
    exit();
}
function modeToString(isDir, maybeMode) {
    var modeMap = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
    if (maybeMode === null) {
        return "(unknown mode)";
    }
    var mode = maybeMode.toString(8);
    if (mode.length < 3) {
        return "(unknown mode)";
    }
    var output = "";
    mode
        .split("")
        .reverse()
        .slice(0, 3)
        .forEach(function (v) {
        output = modeMap[+v] + output;
    });
    output = "(" + (isDir ? "d" : "-") + output + ")";
    return output;
}
function fileLenToString(len) {
    var multiplier = 1024;
    var base = 1;
    var suffix = ["B", "K", "M", "G", "T"];
    var suffixIndex = 0;
    while (base * multiplier < len) {
        if (suffixIndex >= suffix.length - 1) {
            break;
        }
        base *= multiplier;
        suffixIndex++;
    }
    return "" + (len / base).toFixed(2) + suffix[suffixIndex];
}
function serveFile(req, filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, file, fileInfo, headers, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([open(filePath), stat(filePath)])];
                case 1:
                    _a = _b.sent(), file = _a[0], fileInfo = _a[1];
                    headers = new Headers();
                    headers.set("content-length", fileInfo.len.toString());
                    headers.set("content-type", "text/plain; charset=utf-8");
                    res = {
                        status: 200,
                        body: file,
                        headers: headers
                    };
                    return [2 /*return*/, res];
            }
        });
    });
}
// TODO: simplify this after deno.stat and deno.readDir are fixed
function serveDir(req, dirPath) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var dirUrl, listEntry, fileInfos, _i, fileInfos_1, fileInfo, filePath, fileUrl, mode, e_1, formattedDirUrl, page, headers, res;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    dirUrl = "/" + posix.relative(target, dirPath);
                    listEntry = [];
                    return [4 /*yield*/, readDir(dirPath)];
                case 1:
                    fileInfos = _d.sent();
                    _i = 0, fileInfos_1 = fileInfos;
                    _d.label = 2;
                case 2:
                    if (!(_i < fileInfos_1.length)) return [3 /*break*/, 10];
                    fileInfo = fileInfos_1[_i];
                    filePath = posix.join(dirPath, (_a = fileInfo.name) !== null && _a !== void 0 ? _a : "");
                    fileUrl = posix.join(dirUrl, (_b = fileInfo.name) !== null && _b !== void 0 ? _b : "");
                    if (!(fileInfo.name === "index.html" && fileInfo.isFile())) return [3 /*break*/, 4];
                    return [4 /*yield*/, serveFile(req, filePath)];
                case 3: 
                // in case index.html as dir...
                return [2 /*return*/, _d.sent()];
                case 4:
                    mode = null;
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, stat(filePath)];
                case 6:
                    mode = (_d.sent()).mode;
                    return [3 /*break*/, 8];
                case 7:
                    e_1 = _d.sent();
                    return [3 /*break*/, 8];
                case 8:
                    listEntry.push({
                        mode: modeToString(fileInfo.isDirectory(), mode),
                        size: fileInfo.isFile() ? fileLenToString(fileInfo.len) : "",
                        name: (_c = fileInfo.name) !== null && _c !== void 0 ? _c : "",
                        url: fileUrl
                    });
                    _d.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 2];
                case 10:
                    listEntry.sort(function (a, b) {
                        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
                    });
                    formattedDirUrl = dirUrl.replace(/\/$/, "") + "/";
                    page = encoder.encode(dirViewerTemplate(formattedDirUrl, listEntry));
                    headers = new Headers();
                    headers.set("content-type", "text/html");
                    res = {
                        status: 200,
                        body: page,
                        headers: headers
                    };
                    setContentLength(res);
                    return [2 /*return*/, res];
            }
        });
    });
}
function serveFallback(req, e) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (e instanceof Deno.errors.NotFound) {
                return [2 /*return*/, {
                        status: 404,
                        body: encoder.encode("Not found")
                    }];
            }
            else {
                return [2 /*return*/, {
                        status: 500,
                        body: encoder.encode("Internal server error")
                    }];
            }
            return [2 /*return*/];
        });
    });
}
function serverLog(req, res) {
    var d = new Date().toISOString();
    var dateFmt = "[" + d.slice(0, 10) + " " + d.slice(11, 19) + "]";
    var s = dateFmt + " \"" + req.method + " " + req.url + " " + req.proto + "\" " + res.status;
    console.log(s);
}
function setCORS(res) {
    if (!res.headers) {
        res.headers = new Headers();
    }
    res.headers.append("access-control-allow-origin", "*");
    res.headers.append("access-control-allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Range");
}
function dirViewerTemplate(dirname, entries) {
    return html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    <!DOCTYPE html>\n    <html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\" />\n        <title>Deno File Server</title>\n        <style>\n          :root {\n            --background-color: #fafafa;\n            --color: rgba(0, 0, 0, 0.87);\n          }\n          @media (prefers-color-scheme: dark) {\n            :root {\n              --background-color: #303030;\n              --color: #fff;\n            }\n          }\n          @media (min-width: 960px) {\n            main {\n              max-width: 960px;\n            }\n            body {\n              padding-left: 32px;\n              padding-right: 32px;\n            }\n          }\n          @media (min-width: 600px) {\n            main {\n              padding-left: 24px;\n              padding-right: 24px;\n            }\n          }\n          body {\n            background: var(--background-color);\n            color: var(--color);\n            font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n            font-weight: 400;\n            line-height: 1.43;\n            font-size: 0.875rem;\n          }\n          a {\n            color: #2196f3;\n            text-decoration: none;\n          }\n          a:hover {\n            text-decoration: underline;\n          }\n          table th {\n            text-align: left;\n          }\n          table td {\n            padding: 12px 24px 0 0;\n          }\n        </style>\n      </head>\n      <body>\n        <main>\n          <h1>Index of ", "</h1>\n          <table>\n            <tr>\n              <th>Mode</th>\n              <th>Size</th>\n              <th>Name</th>\n            </tr>\n            ", "\n          </table>\n        </main>\n      </body>\n    </html>\n  "], ["\n    <!DOCTYPE html>\n    <html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\" />\n        <title>Deno File Server</title>\n        <style>\n          :root {\n            --background-color: #fafafa;\n            --color: rgba(0, 0, 0, 0.87);\n          }\n          @media (prefers-color-scheme: dark) {\n            :root {\n              --background-color: #303030;\n              --color: #fff;\n            }\n          }\n          @media (min-width: 960px) {\n            main {\n              max-width: 960px;\n            }\n            body {\n              padding-left: 32px;\n              padding-right: 32px;\n            }\n          }\n          @media (min-width: 600px) {\n            main {\n              padding-left: 24px;\n              padding-right: 24px;\n            }\n          }\n          body {\n            background: var(--background-color);\n            color: var(--color);\n            font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n            font-weight: 400;\n            line-height: 1.43;\n            font-size: 0.875rem;\n          }\n          a {\n            color: #2196f3;\n            text-decoration: none;\n          }\n          a:hover {\n            text-decoration: underline;\n          }\n          table th {\n            text-align: left;\n          }\n          table td {\n            padding: 12px 24px 0 0;\n          }\n        </style>\n      </head>\n      <body>\n        <main>\n          <h1>Index of ", "</h1>\n          <table>\n            <tr>\n              <th>Mode</th>\n              <th>Size</th>\n              <th>Name</th>\n            </tr>\n            ",
        "\n          </table>\n        </main>\n      </body>\n    </html>\n  "])), dirname, entries.map(function (entry) { return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                <tr>\n                  <td class=\"mode\">\n                    ", "\n                  </td>\n                  <td>\n                    ", "\n                  </td>\n                  <td>\n                    <a href=\"", "\">", "</a>\n                  </td>\n                </tr>\n              "], ["\n                <tr>\n                  <td class=\"mode\">\n                    ", "\n                  </td>\n                  <td>\n                    ", "\n                  </td>\n                  <td>\n                    <a href=\"", "\">", "</a>\n                  </td>\n                </tr>\n              "])), entry.mode, entry.size, entry.url, entry.name); }));
}
function html(strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var l = strings.length - 1;
    var html = "";
    for (var i = 0; i < l; i++) {
        var v = values[i];
        if (v instanceof Array) {
            v = v.join("");
        }
        var s = strings[i] + v;
        html += s;
    }
    html += strings[l];
    return html;
}
listenAndServe(addr, function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var normalizedUrl, fsPath, response, info, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                normalizedUrl = posix.normalize(req.url);
                try {
                    normalizedUrl = decodeURIComponent(normalizedUrl);
                }
                catch (e) {
                    if (!(e instanceof URIError)) {
                        throw e;
                    }
                }
                fsPath = posix.join(target, normalizedUrl);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, 9, 10]);
                return [4 /*yield*/, stat(fsPath)];
            case 2:
                info = _a.sent();
                if (!info.isDirectory()) return [3 /*break*/, 4];
                return [4 /*yield*/, serveDir(req, fsPath)];
            case 3:
                response = _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, serveFile(req, fsPath)];
            case 5:
                response = _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 10];
            case 7:
                e_2 = _a.sent();
                console.error(e_2.message);
                return [4 /*yield*/, serveFallback(req, e_2)];
            case 8:
                response = _a.sent();
                return [3 /*break*/, 10];
            case 9:
                if (CORSEnabled) {
                    assert(response);
                    setCORS(response);
                }
                serverLog(req, response);
                req.respond(response);
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); });
console.log("HTTP server listening on http://" + addr + "/");
var templateObject_1, templateObject_2;
//# sourceMappingURL=file_server.js.map