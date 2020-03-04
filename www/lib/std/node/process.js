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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { notImplemented } from "./_utils.ts";
var version = "v" + Deno.version.deno;
var versions = __assign({ node: Deno.version.deno }, Deno.version);
var osToPlatform = function (os) {
    return os === "win" ? "win32" : os === "mac" ? "darwin" : os;
};
var platform = osToPlatform(Deno.build.os);
var arch = Deno.build.arch;
var pid = Deno.pid, cwd = Deno.cwd, chdir = Deno.chdir, exit = Deno.exit;
function on(_event, _callback) {
    // TODO(rsp): to be implemented
    notImplemented();
}
export var process = {
    version: version,
    versions: versions,
    platform: platform,
    arch: arch,
    pid: pid,
    cwd: cwd,
    chdir: chdir,
    exit: exit,
    on: on,
    get env() {
        // using getter to avoid --allow-env unless it's used
        return Deno.env();
    },
    get argv() {
        // Deno.execPath() also requires --allow-env
        return __spreadArrays([Deno.execPath()], Deno.args);
    }
};
//# sourceMappingURL=process.js.map