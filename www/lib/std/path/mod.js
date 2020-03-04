// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
import * as _win32 from "./win32.js";
import * as _posix from "./posix.js";
import { isWindows } from "./constants.js";
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
export { EOL, SEP, SEP_PATTERN, isWindows } from "./constants.js";
export * from "./interface.js";
export * from "./glob.js";
export * from "./globrex.js";
//# sourceMappingURL=mod.js.map
