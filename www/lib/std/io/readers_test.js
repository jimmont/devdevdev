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
var copy = Deno.copy, test = Deno.test;
import { assertEquals } from "../testing/asserts.ts";
import { MultiReader, StringReader } from "./readers.ts";
import { StringWriter } from "./writers.ts";
import { copyN } from "./ioutil.ts";
import { decode } from "../strings/mod.ts";
test(function ioStringReader() {
    return __awaiter(this, void 0, void 0, function () {
        var r, res0, res1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = new StringReader("abcdef");
                    return [4 /*yield*/, r.read(new Uint8Array(6))];
                case 1:
                    res0 = _a.sent();
                    assertEquals(res0, 6);
                    return [4 /*yield*/, r.read(new Uint8Array(6))];
                case 2:
                    res1 = _a.sent();
                    assertEquals(res1, Deno.EOF);
                    return [2 /*return*/];
            }
        });
    });
});
test(function ioStringReader() {
    return __awaiter(this, void 0, void 0, function () {
        var r, buf, res1, res2, res3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = new StringReader("abcdef");
                    buf = new Uint8Array(3);
                    return [4 /*yield*/, r.read(buf)];
                case 1:
                    res1 = _a.sent();
                    assertEquals(res1, 3);
                    assertEquals(decode(buf), "abc");
                    return [4 /*yield*/, r.read(buf)];
                case 2:
                    res2 = _a.sent();
                    assertEquals(res2, 3);
                    assertEquals(decode(buf), "def");
                    return [4 /*yield*/, r.read(buf)];
                case 3:
                    res3 = _a.sent();
                    assertEquals(res3, Deno.EOF);
                    assertEquals(decode(buf), "def");
                    return [2 /*return*/];
            }
        });
    });
});
test(function ioMultiReader() {
    return __awaiter(this, void 0, void 0, function () {
        var r, w, n;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = new MultiReader(new StringReader("abc"), new StringReader("def"));
                    w = new StringWriter();
                    return [4 /*yield*/, copyN(w, r, 4)];
                case 1:
                    n = _a.sent();
                    assertEquals(n, 4);
                    assertEquals(w.toString(), "abcd");
                    return [4 /*yield*/, copy(w, r)];
                case 2:
                    _a.sent();
                    assertEquals(w.toString(), "abcdef");
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=readers_test.js.map