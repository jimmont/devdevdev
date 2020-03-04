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
import { assert, assertEquals } from "../testing/asserts.ts";
import { BufReader, BufWriter } from "../io/bufio.ts";
import { TextProtoReader } from "../textproto/mod.ts";
var connect = Deno.connect, run = Deno.run, test = Deno.test;
var server;
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var r, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = run({
                        args: [Deno.execPath(), "run", "-A", "http/racing_server.ts"],
                        stdout: "piped"
                    });
                    // Once racing server is ready it will write to its stdout.
                    assert(server.stdout != null);
                    r = new TextProtoReader(new BufReader(server.stdout));
                    return [4 /*yield*/, r.readLine()];
                case 1:
                    s = _a.sent();
                    assert(s !== Deno.EOF && s.includes("Racing server listening..."));
                    return [2 /*return*/];
            }
        });
    });
}
function killServer() {
    var _a;
    server.close();
    (_a = server.stdout) === null || _a === void 0 ? void 0 : _a.close();
}
var input = [
    "GET / HTTP/1.1\r\n\r\n",
    "GET / HTTP/1.1\r\n\r\n",
    "GET / HTTP/1.1\r\n\r\n",
    "POST / HTTP/1.1\r\ncontent-length: 4\r\n\r\ndeno",
    "POST / HTTP/1.1\r\ntransfer-encoding: chunked\r\n\r\n4\r\ndeno\r\n0\r\n\r\n",
    "POST / HTTP/1.1\r\ntransfer-encoding: chunked\r\ntrailer: deno\r\n\r\n4\r\ndeno\r\n0\r\n\r\ndeno: land\r\n\r\n",
    "GET / HTTP/1.1\r\n\r\n"
].join("");
var HUGE_BODY_SIZE = 1024 * 1024;
var output = "HTTP/1.1 200 OK\ncontent-length: 6\n\nStep1\nHTTP/1.1 200 OK\ncontent-length: " + HUGE_BODY_SIZE + "\n\n" + "a".repeat(HUGE_BODY_SIZE) + "HTTP/1.1 200 OK\ncontent-length: " + HUGE_BODY_SIZE + "\n\n" + "b".repeat(HUGE_BODY_SIZE) + "HTTP/1.1 200 OK\ncontent-length: 6\n\nStep4\nHTTP/1.1 200 OK\ncontent-length: 6\n\nStep5\nHTTP/1.1 200 OK\ncontent-length: 6\n\nStep6\nHTTP/1.1 200 OK\ncontent-length: 6\n\nStep7\n";
test(function serverPipelineRace() {
    return __awaiter(this, void 0, void 0, function () {
        var conn, r, w, outLines, i, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startServer()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, connect({ port: 4501 })];
                case 2:
                    conn = _a.sent();
                    r = new TextProtoReader(new BufReader(conn));
                    w = new BufWriter(conn);
                    return [4 /*yield*/, w.write(new TextEncoder().encode(input))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, w.flush()];
                case 4:
                    _a.sent();
                    outLines = output.split("\n");
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < outLines.length - 1)) return [3 /*break*/, 8];
                    return [4 /*yield*/, r.readLine()];
                case 6:
                    s = _a.sent();
                    assertEquals(s, outLines[i]);
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    killServer();
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=racing_server_test.js.map