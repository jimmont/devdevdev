var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { LogLevel, getLevelByName, getLevelName } from "./levels.js";
var Logger = /** @class */ (function () {
    function Logger(levelName, handlers) {
        this.level = getLevelByName(levelName);
        this.levelName = levelName;
        this.handlers = handlers || [];
    }
    Logger.prototype._log = function (level, msg) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (this.level > level)
            return;
        // TODO: it'd be a good idea to make it immutable, so
        // no handler mangles it by mistake
        // TODO: iterpolate msg with values
        var record = {
            msg: msg,
            args: args,
            datetime: new Date(),
            level: level,
            levelName: getLevelName(level)
        };
        this.handlers.forEach(function (handler) {
            handler.handle(record);
        });
    };
    Logger.prototype.debug = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._log.apply(this, __spreadArrays([LogLevel.DEBUG, msg], args));
    };
    Logger.prototype.info = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._log.apply(this, __spreadArrays([LogLevel.INFO, msg], args));
    };
    Logger.prototype.warning = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._log.apply(this, __spreadArrays([LogLevel.WARNING, msg], args));
    };
    Logger.prototype.error = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._log.apply(this, __spreadArrays([LogLevel.ERROR, msg], args));
    };
    Logger.prototype.critical = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._log.apply(this, __spreadArrays([LogLevel.CRITICAL, msg], args));
    };
    return Logger;
}());
export { Logger };
//# sourceMappingURL=logger.js.map
