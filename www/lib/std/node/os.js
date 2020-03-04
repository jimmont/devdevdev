// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
import { notImplemented } from "./_utils.js";
import { validateIntegerRange } from "./util.js";
import { EOL as fsEOL } from "../fs/eol.js";
import { process } from "./process.js";
var SEE_GITHUB_ISSUE = "See https://github.com/denoland/deno/issues/3802";
arch[Symbol.toPrimitive] = function () { return arch(); };
endianness[Symbol.toPrimitive] = function () { return endianness(); };
freemem[Symbol.toPrimitive] = function () { return freemem(); };
homedir[Symbol.toPrimitive] = function () { return homedir(); };
hostname[Symbol.toPrimitive] = function () { return hostname(); };
platform[Symbol.toPrimitive] = function () { return platform(); };
release[Symbol.toPrimitive] = function () { return release(); };
totalmem[Symbol.toPrimitive] = function () { return totalmem(); };
type[Symbol.toPrimitive] = function () { return type(); };
uptime[Symbol.toPrimitive] = function () { return uptime(); };
/** Returns the operating system CPU architecture for which the Deno binary was compiled */
export function arch() {
    return Deno.build.arch;
}
/** Not yet implemented */
export function cpus() {
    notImplemented(SEE_GITHUB_ISSUE);
}
/**
 * Returns a string identifying the endianness of the CPU for which the Deno
 * binary was compiled. Possible values are 'BE' for big endian and 'LE' for
 * little endian.
 **/
export function endianness() {
    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView#Endianness
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true /* littleEndian */);
    // Int16Array uses the platform's endianness.
    return new Int16Array(buffer)[0] === 256 ? "LE" : "BE";
}
/** Not yet implemented */
export function freemem() {
    notImplemented(SEE_GITHUB_ISSUE);
}
/** Not yet implemented */
export function getPriority(pid) {
    if (pid === void 0) { pid = 0; }
    validateIntegerRange(pid, "pid");
    notImplemented(SEE_GITHUB_ISSUE);
}
/** Returns the string path of the current user's home directory. */
export function homedir() {
    return Deno.dir("home");
}
/** Returns the host name of the operating system as a string. */
export function hostname() {
    return Deno.hostname();
}
/** Returns an array containing the 1, 5, and 15 minute load averages */
export function loadavg() {
    if (Deno.build.os == "win") {
        return [0, 0, 0];
    }
    return Deno.loadavg();
}
/** Not yet implemented */
export function networkInterfaces() {
    notImplemented(SEE_GITHUB_ISSUE);
}
/** Returns the a string identifying the operating system platform. The value is set at compile time. Possible values are 'darwin', 'linux', and 'win32'. */
export function platform() {
    return process.platform;
}
/** Returns the operating system as a string */
export function release() {
    return Deno.osRelease();
}
/** Not yet implemented */
export function setPriority(pid, priority) {
    /* The node API has the 'pid' as the first parameter and as optional.
         This makes for a problematic implementation in Typescript. */
    if (priority === undefined) {
        priority = pid;
        pid = 0;
    }
    validateIntegerRange(pid, "pid");
    validateIntegerRange(priority, "priority", -20, 19);
    notImplemented(SEE_GITHUB_ISSUE);
}
/** Returns the operating system's default directory for temporary files as a string. */
export function tmpdir() {
    return Deno.dir("tmp");
}
/** Not yet implemented */
export function totalmem() {
    notImplemented(SEE_GITHUB_ISSUE);
}
/** Not yet implemented */
export function type() {
    notImplemented(SEE_GITHUB_ISSUE);
}
/** Not yet implemented */
export function uptime() {
    notImplemented(SEE_GITHUB_ISSUE);
}
/** Not yet implemented */
export function userInfo(
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
options) {
    if (options === void 0) { options = { encoding: "utf-8" }; }
    notImplemented(SEE_GITHUB_ISSUE);
}
export var constants = {
    // UV_UDP_REUSEADDR: 4,  //see https://nodejs.org/docs/latest-v12.x/api/os.html#os_libuv_constants
    dlopen: {
    // see https://nodejs.org/docs/latest-v12.x/api/os.html#os_dlopen_constants
    },
    errno: {
    // see https://nodejs.org/docs/latest-v12.x/api/os.html#os_error_constants
    },
    signals: Deno.Signal,
    priority: {
    // see https://nodejs.org/docs/latest-v12.x/api/os.html#os_priority_constants
    }
};
export var EOL = Deno.build.os == "win" ? fsEOL.CRLF : fsEOL.LF;
//# sourceMappingURL=os.js.map
