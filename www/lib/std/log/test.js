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
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var test = Deno.test;
import { assertEquals } from "../testing/asserts.js";
import * as log from "./mod.js";
import { LogLevel } from "./levels.js";
var TestHandler = /** @class */ (function (_super) {
    __extends(TestHandler, _super);
    function TestHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messages = [];
        return _this;
    }
    TestHandler.prototype.log = function (msg) {
        this.messages.push(msg);
    };
    return TestHandler;
}(log.handlers.BaseHandler));
test(function defaultHandlers() {
    return __awaiter(this, void 0, void 0, function () {
        var loggers, _a, _b, _i, levelName, logger, handler;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    loggers = {
                        DEBUG: log.debug,
                        INFO: log.info,
                        WARNING: log.warning,
                        ERROR: log.error,
                        CRITICAL: log.critical
                    };
                    _a = [];
                    for (_b in LogLevel)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    levelName = _a[_i];
                    if (levelName === "NOTSET") {
                        return [3 /*break*/, 3];
                    }
                    logger = loggers[levelName];
                    handler = new TestHandler(levelName);
                    return [4 /*yield*/, log.setup({
                            handlers: {
                                "default": handler
                            },
                            loggers: {
                                "default": {
                                    level: levelName,
                                    handlers: ["default"]
                                }
                            }
                        })];
                case 2:
                    _c.sent();
                    logger("foo");
                    logger("bar", 1, 2);
                    assertEquals(handler.messages, [levelName + " foo", levelName + " bar"]);
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
});
test(function getLogger() {
    return __awaiter(this, void 0, void 0, function () {
        var handler, logger;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handler = new TestHandler("DEBUG");
                    return [4 /*yield*/, log.setup({
                            handlers: {
                                "default": handler
                            },
                            loggers: {
                                "default": {
                                    level: "DEBUG",
                                    handlers: ["default"]
                                }
                            }
                        })];
                case 1:
                    _a.sent();
                    logger = log.getLogger();
                    assertEquals(logger.levelName, "DEBUG");
                    assertEquals(logger.handlers, [handler]);
                    return [2 /*return*/];
            }
        });
    });
});
test(function getLoggerWithName() {
    return __awaiter(this, void 0, void 0, function () {
        var fooHandler, logger;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fooHandler = new TestHandler("DEBUG");
                    return [4 /*yield*/, log.setup({
                            handlers: {
                                foo: fooHandler
                            },
                            loggers: {
                                bar: {
                                    level: "INFO",
                                    handlers: ["foo"]
                                }
                            }
                        })];
                case 1:
                    _a.sent();
                    logger = log.getLogger("bar");
                    assertEquals(logger.levelName, "INFO");
                    assertEquals(logger.handlers, [fooHandler]);
                    return [2 /*return*/];
            }
        });
    });
});
test(function getLoggerUnknown() {
    return __awaiter(this, void 0, void 0, function () {
        var logger;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, log.setup({
                        handlers: {},
                        loggers: {}
                    })];
                case 1:
                    _a.sent();
                    logger = log.getLogger("nonexistent");
                    assertEquals(logger.levelName, "NOTSET");
                    assertEquals(logger.handlers, []);
                    return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=test.js.map
