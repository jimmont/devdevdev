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
import { assertEquals, assertStrContains } from "../testing/asserts.ts";
import * as path from "../path/mod.ts";
import { exists, existsSync } from "./exists.ts";
var testdataDir = path.resolve("fs", "testdata");
Deno.test("[fs] existsFile", function () {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = assertEquals;
                    return [4 /*yield*/, exists(path.join(testdataDir, "not_exist_file.ts"))];
                case 1:
                    _a.apply(void 0, [_c.sent(),
                        false]);
                    _b = assertEquals;
                    return [4 /*yield*/, existsSync(path.join(testdataDir, "0.ts"))];
                case 2:
                    _b.apply(void 0, [_c.sent(), true]);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test("[fs] existsFileSync", function () {
    assertEquals(existsSync(path.join(testdataDir, "not_exist_file.ts")), false);
    assertEquals(existsSync(path.join(testdataDir, "0.ts")), true);
});
Deno.test("[fs] existsDirectory", function () {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = assertEquals;
                    return [4 /*yield*/, exists(path.join(testdataDir, "not_exist_directory"))];
                case 1:
                    _a.apply(void 0, [_b.sent(),
                        false]);
                    assertEquals(existsSync(testdataDir), true);
                    return [2 /*return*/];
            }
        });
    });
});
Deno.test("[fs] existsDirectorySync", function () {
    assertEquals(existsSync(path.join(testdataDir, "not_exist_directory")), false);
    assertEquals(existsSync(testdataDir), true);
});
Deno.test("[fs] existsLinkSync", function () {
    // TODO(axetroy): generate link file use Deno api instead of set a link file
    // in repository
    assertEquals(existsSync(path.join(testdataDir, "0-link.ts")), true);
});
Deno.test("[fs] existsLink", function () {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // TODO(axetroy): generate link file use Deno api instead of set a link file
                    // in repository
                    _a = assertEquals;
                    return [4 /*yield*/, exists(path.join(testdataDir, "0-link.ts"))];
                case 1:
                    // TODO(axetroy): generate link file use Deno api instead of set a link file
                    // in repository
                    _a.apply(void 0, [_b.sent(), true]);
                    return [2 /*return*/];
            }
        });
    });
});
var scenes = [
    // 1
    {
        read: false,
        async: true,
        output: "run again with the --allow-read flag",
        file: "0.ts"
    },
    {
        read: false,
        async: false,
        output: "run again with the --allow-read flag",
        file: "0.ts"
    },
    // 2
    {
        read: true,
        async: true,
        output: "exist",
        file: "0.ts"
    },
    {
        read: true,
        async: false,
        output: "exist",
        file: "0.ts"
    },
    // 3
    {
        read: false,
        async: true,
        output: "run again with the --allow-read flag",
        file: "no_exist_file_for_test.ts"
    },
    {
        read: false,
        async: false,
        output: "run again with the --allow-read flag",
        file: "no_exist_file_for_test.ts"
    },
    // 4
    {
        read: true,
        async: true,
        output: "not exist",
        file: "no_exist_file_for_test.ts"
    },
    {
        read: true,
        async: false,
        output: "not exist",
        file: "no_exist_file_for_test.ts"
    }
];
var _loop_1 = function (s) {
    var title = "test " + (s.async ? "exists" : "existsSync") + "(\"testdata/" + s.file + "\")";
    title += " " + (s.read ? "with" : "without") + " --allow-read";
    Deno.test("[fs] existsPermission " + title, function () {
        return __awaiter(this, void 0, void 0, function () {
            var args, stdout, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = [Deno.execPath(), "run"];
                        if (s.read) {
                            args.push("--allow-read");
                        }
                        args.push(path.join(testdataDir, s.async ? "exists.ts" : "exists_sync.ts"));
                        args.push(s.file);
                        stdout = Deno.run({
                            stdout: "piped",
                            cwd: testdataDir,
                            args: args
                        }).stdout;
                        return [4 /*yield*/, Deno.readAll(stdout)];
                    case 1:
                        output = _a.sent();
                        assertStrContains(new TextDecoder().decode(output), s.output);
                        return [2 /*return*/];
                }
            });
        });
    });
};
for (var _i = 0, scenes_1 = scenes; _i < scenes_1.length; _i++) {
    var s = scenes_1[_i];
    _loop_1(s);
}
//# sourceMappingURL=exists_test.js.map