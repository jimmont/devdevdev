var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { Logger } from "./logger.ts";
import { BaseHandler, ConsoleHandler, WriterHandler, FileHandler } from "./handlers.ts";
import { assert } from "../testing/asserts.ts";
var LoggerConfig = /** @class */ (function () {
    function LoggerConfig() {
    }
    return LoggerConfig;
}());
export { LoggerConfig };
var DEFAULT_LEVEL = "INFO";
var DEFAULT_CONFIG = {
    handlers: {
        "default": new ConsoleHandler(DEFAULT_LEVEL)
    },
    loggers: {
        "default": {
            level: DEFAULT_LEVEL,
            handlers: ["default"]
        }
    }
};
var state = {
    handlers: new Map(),
    loggers: new Map(),
    config: DEFAULT_CONFIG
};
export var handlers = {
    BaseHandler: BaseHandler,
    ConsoleHandler: ConsoleHandler,
    WriterHandler: WriterHandler,
    FileHandler: FileHandler
};
export function getLogger(name) {
    if (!name) {
        var d = state.loggers.get("default");
        assert(d != null, "\"default\" logger must be set for getting logger without name");
        return d;
    }
    var result = state.loggers.get(name);
    if (!result) {
        var logger = new Logger("NOTSET", []);
        state.loggers.set(name, logger);
        return logger;
    }
    return result;
}
export var debug = function (msg) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (_a = getLogger("default")).debug.apply(_a, __spreadArrays([msg], args));
};
export var info = function (msg) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (_a = getLogger("default")).info.apply(_a, __spreadArrays([msg], args));
};
export var warning = function (msg) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (_a = getLogger("default")).warning.apply(_a, __spreadArrays([msg], args));
};
export var error = function (msg) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (_a = getLogger("default")).error.apply(_a, __spreadArrays([msg], args));
};
export var critical = function (msg) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (_a = getLogger("default")).critical.apply(_a, __spreadArrays([msg], args));
};
export function setup(config) {
    return __awaiter(this, void 0, void 0, function () {
        var handlers, _a, _b, _i, handlerName, handler, loggers, _loop_1, loggerName;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state.config = {
                        handlers: __assign(__assign({}, DEFAULT_CONFIG.handlers), config.handlers),
                        loggers: __assign(__assign({}, DEFAULT_CONFIG.loggers), config.loggers)
                    };
                    // tear down existing handlers
                    state.handlers.forEach(function (handler) {
                        handler.destroy();
                    });
                    state.handlers.clear();
                    handlers = state.config.handlers || {};
                    _a = [];
                    for (_b in handlers)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    handlerName = _a[_i];
                    handler = handlers[handlerName];
                    return [4 /*yield*/, handler.setup()];
                case 2:
                    _c.sent();
                    state.handlers.set(handlerName, handler);
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    // remove existing loggers
                    state.loggers.clear();
                    loggers = state.config.loggers || {};
                    _loop_1 = function (loggerName) {
                        var loggerConfig = loggers[loggerName];
                        var handlerNames = loggerConfig.handlers || [];
                        var handlers_1 = [];
                        handlerNames.forEach(function (handlerName) {
                            var handler = state.handlers.get(handlerName);
                            if (handler) {
                                handlers_1.push(handler);
                            }
                        });
                        var levelName = loggerConfig.level || DEFAULT_LEVEL;
                        var logger = new Logger(levelName, handlers_1);
                        state.loggers.set(loggerName, logger);
                    };
                    for (loggerName in loggers) {
                        _loop_1(loggerName);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
setup(DEFAULT_CONFIG);
//# sourceMappingURL=mod.js.map