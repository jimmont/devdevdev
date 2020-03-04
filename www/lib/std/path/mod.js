// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
import * as _win32 from "./win32.ts";
import * as _posix from "./posix.ts";
import { isWindows } from "./constants.ts";
var path = isWindows ? _win32 : _posix;
export var win32 = _win32;
export var posix = _posix;
export var resolve = path.resolve;
export var normalize = path.normalize;
export var isAbsolute = path.isAbsolute;
export var join = path.join;
export var relative = path.relative;
export var toNamespacedPath = path.toNamespacedPath;
export var dirname = path.dirname;
export var basename = path.basename;
export var extname = path.extname;
export var format = path.format;
export var parse = path.parse;
export var sep = path.sep;
export var delimiter = path.delimiter;
export { EOL, SEP, SEP_PATTERN, isWindows } from "./constants.ts";
export * from "./interface.ts";
export * from "./glob.ts";
export * from "./globrex.ts";
//# sourceMappingURL=mod.js.map