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
/**
 * Tar test
 *
 * **test summary**
 * - create a tar archive in memory containing output.txt and dir/tar.ts.
 * - read and deflate a tar archive containing output.txt
 *
 * **to run this test**
 * deno run --allow-read archive/tar_test.ts
 */
import { assertEquals } from "../testing/asserts.ts";
import { resolve } from "../path/mod.ts";
import { Tar, Untar } from "./tar.ts";
var filePath = resolve("archive", "testdata", "example.txt");
Deno.test(function createTarArchive() {
    return __awaiter(this, void 0, void 0, function () {
        var tar, content, writer, wrote;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tar = new Tar();
                    content = new TextEncoder().encode("hello tar world!");
                    return [4 /*yield*/, tar.append("output.txt", {
                            reader: new Deno.Buffer(content),
                            contentSize: content.byteLength
                        })];
                case 1:
                    _a.sent();
                    // put a file
                    return [4 /*yield*/, tar.append("dir/tar.ts", { filePath: filePath })];
                case 2:
                    // put a file
                    _a.sent();
                    writer = new Deno.Buffer();
                    return [4 /*yield*/, Deno.copy(writer, tar.getReader())];
                case 3:
                    wrote = _a.sent();
                    /**
                     * 3072 = 512 (header) + 512 (content) + 512 (header) + 512 (content)
                     *       + 1024 (footer)
                     */
                    assertEquals(wrote, 3072);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function deflateTarArchive() {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, text, tar, content, untar, buf, result, untarText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = "output.txt";
                    text = "hello tar world!";
                    tar = new Tar();
                    content = new TextEncoder().encode(text);
                    return [4 /*yield*/, tar.append(fileName, {
                            reader: new Deno.Buffer(content),
                            contentSize: content.byteLength
                        })];
                case 1:
                    _a.sent();
                    untar = new Untar(tar.getReader());
                    buf = new Deno.Buffer();
                    return [4 /*yield*/, untar.extract(buf)];
                case 2:
                    result = _a.sent();
                    untarText = new TextDecoder("utf-8").decode(buf.bytes());
                    // tests
                    assertEquals(result.fileName, fileName);
                    assertEquals(untarText, text);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test(function appendFileWithLongNameToTarArchive() {
    return __awaiter(this, void 0, void 0, function () {
        var fileName, text, tar, content, untar, buf, result, untarText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileName = new Array(10).join("long-file-name/") + "file-name.txt";
                    text = "hello tar world!";
                    tar = new Tar();
                    content = new TextEncoder().encode(text);
                    return [4 /*yield*/, tar.append(fileName, {
                            reader: new Deno.Buffer(content),
                            contentSize: content.byteLength
                        })];
                case 1:
                    _a.sent();
                    untar = new Untar(tar.getReader());
                    buf = new Deno.Buffer();
                    return [4 /*yield*/, untar.extract(buf)];
                case 2:
                    result = _a.sent();
                    untarText = new TextDecoder("utf-8").decode(buf.bytes());
                    // tests
                    assertEquals(result.fileName, fileName);
                    assertEquals(untarText, text);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=tar_test.js.map