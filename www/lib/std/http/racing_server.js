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
import { serve } from "./server.js";
import { delay } from "../util/async.js";
var addr = Deno.args[1] || "127.0.0.1:4501";
var server = serve(addr);
function body(i) {
    return "Step" + i + "\n";
}
function delayedRespond(request, step) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, delay(3000)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, request.respond({ status: 200, body: body(step) })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function largeRespond(request, c) {
    return __awaiter(this, void 0, void 0, function () {
        var b;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    b = new Uint8Array(1024 * 1024);
                    b.fill(c.charCodeAt(0));
                    return [4 /*yield*/, request.respond({ status: 200, body: b })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ignoreToConsume(request, step) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.respond({ status: 200, body: body(step) })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
console.log("Racing server listening...\n");
var step = 1;
try {
    for (var server_1 = __asyncValues(server), server_1_1; server_1_1 = await server_1.next(), !server_1_1.done;) {
        var request = server_1_1.value;
        switch (step) {
            case 1:
                // Try to wait long enough.
                // For pipelining, this should cause all the following response
                // to block.
                delayedRespond(request, step);
                break;
            case 2:
                // HUGE body.
                largeRespond(request, "a");
                break;
            case 3:
                // HUGE body.
                largeRespond(request, "b");
                break;
            case 4:
                // Ignore to consume body (content-length)
                ignoreToConsume(request, step);
                break;
            case 5:
                // Ignore to consume body (chunked)
                ignoreToConsume(request, step);
                break;
            case 6:
                // Ignore to consume body (chunked + trailers)
                ignoreToConsume(request, step);
                break;
            default:
                request.respond({ status: 200, body: body(step) });
                break;
        }
        step++;
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (server_1_1 && !server_1_1.done && (_a = server_1["return"])) await _a.call(server_1);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=racing_server.js.map
