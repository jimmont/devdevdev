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
var e_1, _a;
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { serve } from "../http/server.ts";
import { acceptWebSocket, isWebSocketCloseEvent, isWebSocketPingEvent } from "./mod.ts";
/** websocket echo server */
var port = Deno.args[0] || "8080";
console.log("websocket server is running on :" + port);
try {
    for (var _b = __asyncValues(serve(":" + port)), _c; _c = await _b.next(), !_c.done;) {
        var req = _c.value;
        var headers = req.headers, conn = req.conn;
        acceptWebSocket({
            conn: conn,
            headers: headers,
            bufReader: req.r,
            bufWriter: req.w
        })
            .then(function (sock) { return __awaiter(void 0, void 0, void 0, function () {
            var it, _a, done, value, ev, body, code, reason, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("socket connected!");
                        it = sock.receive();
                        _b.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 10];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, , 9]);
                        return [4 /*yield*/, it.next()];
                    case 3:
                        _a = _b.sent(), done = _a.done, value = _a.value;
                        if (done) {
                            return [3 /*break*/, 10];
                        }
                        ev = value;
                        if (!(typeof ev === "string")) return [3 /*break*/, 5];
                        // text message
                        console.log("ws:Text", ev);
                        return [4 /*yield*/, sock.send(ev)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        if (ev instanceof Uint8Array) {
                            // binary message
                            console.log("ws:Binary", ev);
                        }
                        else if (isWebSocketPingEvent(ev)) {
                            body = ev[1];
                            // ping
                            console.log("ws:Ping", body);
                        }
                        else if (isWebSocketCloseEvent(ev)) {
                            code = ev.code, reason = ev.reason;
                            console.log("ws:Close", code, reason);
                        }
                        _b.label = 6;
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_2 = _b.sent();
                        console.error("failed to receive frame: " + e_2);
                        return [4 /*yield*/, sock.close(1000)["catch"](console.error)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 1];
                    case 10: return [2 /*return*/];
                }
            });
        }); })["catch"](function (err) {
            console.error("failed to accept websocket: " + err);
        });
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (_c && !_c.done && (_a = _b["return"])) await _a.call(_b);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=example_server.js.map