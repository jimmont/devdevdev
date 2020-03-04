var _a;
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
export var LogLevel = {
    NOTSET: 0,
    DEBUG: 10,
    INFO: 20,
    WARNING: 30,
    ERROR: 40,
    CRITICAL: 50
};
var byLevel = (_a = {},
    _a[LogLevel.NOTSET] = "NOTSET",
    _a[LogLevel.DEBUG] = "DEBUG",
    _a[LogLevel.INFO] = "INFO",
    _a[LogLevel.WARNING] = "WARNING",
    _a[LogLevel.ERROR] = "ERROR",
    _a[LogLevel.CRITICAL] = "CRITICAL",
    _a);
export function getLevelByName(name) {
    return LogLevel[name];
}
export function getLevelName(level) {
    return byLevel[level];
}
//# sourceMappingURL=levels.js.map
