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
import "./global.js";
import * as nodeFS from "./fs.js";
import * as nodeUtil from "./util.js";
import * as nodePath from "./path.js";
import * as nodeTimers from "./timers.js";
import * as nodeOs from "./os.js";
import * as nodeEvents from "./events.js";
import * as path from "../path/mod.js";
import { assert } from "../testing/asserts.js";
var CHAR_FORWARD_SLASH = "/".charCodeAt(0);
var CHAR_BACKWARD_SLASH = "\\".charCodeAt(0);
var CHAR_COLON = ":".charCodeAt(0);
var isWindows = path.isWindows;
var relativeResolveCache = Object.create(null);
var requireDepth = 0;
var statCache = null;
// Returns 0 if the path refers to
// a file, 1 when it's a directory or < 0 on error.
function stat(filename) {
    filename = path.toNamespacedPath(filename);
    if (statCache !== null) {
        var result = statCache.get(filename);
        if (result !== undefined)
            return result;
    }
    try {
        var info = Deno.statSync(filename);
        var result = info.isFile() ? 0 : 1;
        if (statCache !== null)
            statCache.set(filename, result);
        return result;
    }
    catch (e) {
        if (e instanceof Deno.errors.PermissionDenied) {
            throw new Error("CJS loader requires --allow-read.");
        }
        return -1;
    }
}
function updateChildren(parent, child, scan) {
    var children = parent && parent.children;
    if (children && !(scan && children.includes(child))) {
        children.push(child);
    }
}
var Module = /** @class */ (function () {
    function Module(id, parent) {
        if (id === void 0) { id = ""; }
        this.id = id;
        this.exports = {};
        this.parent = parent || null;
        updateChildren(parent || null, this, false);
        this.filename = null;
        this.loaded = false;
        this.children = [];
        this.paths = [];
        this.path = path.dirname(id);
    }
    // Loads a module at the given file path. Returns that module's
    // `exports` property.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Module.prototype.require = function (id) {
        if (id === "") {
            throw new Error("id '" + id + "' must be a non-empty string");
        }
        requireDepth++;
        try {
            return Module._load(id, this, /* isMain */ false);
        }
        finally {
            requireDepth--;
        }
    };
    // Given a file name, pass it to the proper extension handler.
    Module.prototype.load = function (filename) {
        assert(!this.loaded);
        this.filename = filename;
        this.paths = Module._nodeModulePaths(path.dirname(filename));
        var extension = findLongestRegisteredExtension(filename);
        // Removed ESM code
        Module._extensions[extension](this, filename);
        this.loaded = true;
        // Removed ESM code
    };
    // Run the file contents in the correct scope or sandbox. Expose
    // the correct helper variables (require, module, exports) to
    // the file.
    // Returns exception, if any.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Module.prototype._compile = function (content, filename) {
        // manifest code removed
        var compiledWrapper = wrapSafe(filename, content);
        // inspector code remove
        var dirname = path.dirname(filename);
        var require = makeRequireFunction(this);
        var exports = this.exports;
        var thisValue = exports;
        if (requireDepth === 0) {
            statCache = new Map();
        }
        var result = compiledWrapper.call(thisValue, exports, require, this, filename, dirname);
        if (requireDepth === 0) {
            statCache = null;
        }
        return result;
    };
    Module._resolveLookupPaths = function (request, parent) {
        // Check for node modules paths.
        if (request.charAt(0) !== "." ||
            (request.length > 1 &&
                request.charAt(1) !== "." &&
                request.charAt(1) !== "/" &&
                (!isWindows || request.charAt(1) !== "\\"))) {
            var paths = modulePaths;
            if (parent !== null && parent.paths && parent.paths.length) {
                paths = parent.paths.concat(paths);
            }
            return paths.length > 0 ? paths : null;
        }
        // With --eval, parent.id is not set and parent.filename is null.
        if (!parent || !parent.id || !parent.filename) {
            // Make require('./path/to/foo') work - normally the path is taken
            // from realpath(__filename) but with eval there is no filename
            var mainPaths = ["."].concat(Module._nodeModulePaths("."), modulePaths);
            return mainPaths;
        }
        var parentDir = [path.dirname(parent.filename)];
        return parentDir;
    };
    Module._resolveFilename = function (request, parent, isMain, options) {
        // Polyfills.
        if (nativeModuleCanBeRequiredByUsers(request)) {
            return request;
        }
        var paths;
        if (typeof options === "object" && options !== null) {
            if (Array.isArray(options.paths)) {
                var isRelative = request.startsWith("./") ||
                    request.startsWith("../") ||
                    (isWindows && request.startsWith(".\\")) ||
                    request.startsWith("..\\");
                if (isRelative) {
                    paths = options.paths;
                }
                else {
                    var fakeParent = new Module("", null);
                    paths = [];
                    for (var i = 0; i < options.paths.length; i++) {
                        var path_1 = options.paths[i];
                        fakeParent.paths = Module._nodeModulePaths(path_1);
                        var lookupPaths = Module._resolveLookupPaths(request, fakeParent);
                        for (var j = 0; j < lookupPaths.length; j++) {
                            if (!paths.includes(lookupPaths[j]))
                                paths.push(lookupPaths[j]);
                        }
                    }
                }
            }
            else if (options.paths === undefined) {
                paths = Module._resolveLookupPaths(request, parent);
            }
            else {
                throw new Error("options.paths is invalid");
            }
        }
        else {
            paths = Module._resolveLookupPaths(request, parent);
        }
        // Look up the filename first, since that's the cache key.
        var filename = Module._findPath(request, paths, isMain);
        if (!filename) {
            var requireStack = [];
            for (var cursor = parent; cursor; cursor = cursor.parent) {
                requireStack.push(cursor.filename || cursor.id);
            }
            var message = "Cannot find module '" + request + "'";
            if (requireStack.length > 0) {
                message = message + "\nRequire stack:\n- " + requireStack.join("\n- ");
            }
            var err = new Error(message);
            // @ts-ignore
            err.code = "MODULE_NOT_FOUND";
            // @ts-ignore
            err.requireStack = requireStack;
            throw err;
        }
        return filename;
    };
    Module._findPath = function (request, paths, isMain) {
        var absoluteRequest = path.isAbsolute(request);
        if (absoluteRequest) {
            paths = [""];
        }
        else if (!paths || paths.length === 0) {
            return false;
        }
        var cacheKey = request + "\x00" + (paths.length === 1 ? paths[0] : paths.join("\x00"));
        var entry = Module._pathCache[cacheKey];
        if (entry) {
            return entry;
        }
        var exts;
        var trailingSlash = request.length > 0 &&
            request.charCodeAt(request.length - 1) === CHAR_FORWARD_SLASH;
        if (!trailingSlash) {
            trailingSlash = /(?:^|\/)\.?\.$/.test(request);
        }
        // For each path
        for (var i = 0; i < paths.length; i++) {
            // Don't search further if path doesn't exist
            var curPath = paths[i];
            if (curPath && stat(curPath) < 1)
                continue;
            var basePath = resolveExports(curPath, request, absoluteRequest);
            var filename = void 0;
            var rc = stat(basePath);
            if (!trailingSlash) {
                if (rc === 0) {
                    // File.
                    // preserveSymlinks removed
                    filename = toRealPath(basePath);
                }
                if (!filename) {
                    // Try it with each of the extensions
                    if (exts === undefined)
                        exts = Object.keys(Module._extensions);
                    filename = tryExtensions(basePath, exts, isMain);
                }
            }
            if (!filename && rc === 1) {
                // Directory.
                // try it with each of the extensions at "index"
                if (exts === undefined)
                    exts = Object.keys(Module._extensions);
                filename = tryPackage(basePath, exts, isMain, request);
            }
            if (filename) {
                Module._pathCache[cacheKey] = filename;
                return filename;
            }
        }
        // trySelf removed.
        return false;
    };
    // Check the cache for the requested file.
    // 1. If a module already exists in the cache: return its exports object.
    // 2. If the module is native: call
    //    `NativeModule.prototype.compileForPublicLoader()` and return the exports.
    // 3. Otherwise, create a new module for the file and save it to the cache.
    //    Then have it load  the file contents before returning its exports
    //    object.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Module._load = function (request, parent, isMain) {
        var relResolveCacheIdentifier;
        if (parent) {
            // Fast path for (lazy loaded) modules in the same directory. The indirect
            // caching is required to allow cache invalidation without changing the old
            // cache key names.
            relResolveCacheIdentifier = parent.path + "\0" + request;
            var filename_1 = relativeResolveCache[relResolveCacheIdentifier];
            if (filename_1 !== undefined) {
                var cachedModule_1 = Module._cache[filename_1];
                if (cachedModule_1 !== undefined) {
                    updateChildren(parent, cachedModule_1, true);
                    if (!cachedModule_1.loaded)
                        return getExportsForCircularRequire(cachedModule_1);
                    return cachedModule_1.exports;
                }
                delete relativeResolveCache[relResolveCacheIdentifier];
            }
        }
        var filename = Module._resolveFilename(request, parent, isMain);
        var cachedModule = Module._cache[filename];
        if (cachedModule !== undefined) {
            updateChildren(parent, cachedModule, true);
            if (!cachedModule.loaded)
                return getExportsForCircularRequire(cachedModule);
            return cachedModule.exports;
        }
        // Native module polyfills
        var mod = loadNativeModule(filename, request);
        if (mod)
            return mod.exports;
        // Don't call updateChildren(), Module constructor already does.
        var module = new Module(filename, parent);
        if (isMain) {
            // TODO: set process info
            // process.mainModule = module;
            module.id = ".";
        }
        Module._cache[filename] = module;
        if (parent !== undefined) {
            assert(relResolveCacheIdentifier);
            relativeResolveCache[relResolveCacheIdentifier] = filename;
        }
        var threw = true;
        try {
            // Source map code removed
            module.load(filename);
            threw = false;
        }
        finally {
            if (threw) {
                delete Module._cache[filename];
                if (parent !== undefined) {
                    assert(relResolveCacheIdentifier);
                    delete relativeResolveCache[relResolveCacheIdentifier];
                }
            }
            else if (module.exports &&
                Object.getPrototypeOf(module.exports) ===
                    CircularRequirePrototypeWarningProxy) {
                Object.setPrototypeOf(module.exports, PublicObjectPrototype);
            }
        }
        return module.exports;
    };
    Module.wrap = function (script) {
        return "" + Module.wrapper[0] + script + Module.wrapper[1];
    };
    Module._nodeModulePaths = function (from) {
        if (isWindows) {
            // Guarantee that 'from' is absolute.
            from = path.resolve(from);
            // note: this approach *only* works when the path is guaranteed
            // to be absolute.  Doing a fully-edge-case-correct path.split
            // that works on both Windows and Posix is non-trivial.
            // return root node_modules when path is 'D:\\'.
            // path.resolve will make sure from.length >=3 in Windows.
            if (from.charCodeAt(from.length - 1) === CHAR_BACKWARD_SLASH &&
                from.charCodeAt(from.length - 2) === CHAR_COLON)
                return [from + "node_modules"];
            var paths = [];
            for (var i = from.length - 1, p = 0, last = from.length; i >= 0; --i) {
                var code = from.charCodeAt(i);
                // The path segment separator check ('\' and '/') was used to get
                // node_modules path for every path segment.
                // Use colon as an extra condition since we can get node_modules
                // path for drive root like 'C:\node_modules' and don't need to
                // parse drive name.
                if (code === CHAR_BACKWARD_SLASH ||
                    code === CHAR_FORWARD_SLASH ||
                    code === CHAR_COLON) {
                    if (p !== nmLen)
                        paths.push(from.slice(0, last) + "\\node_modules");
                    last = i;
                    p = 0;
                }
                else if (p !== -1) {
                    if (nmChars[p] === code) {
                        ++p;
                    }
                    else {
                        p = -1;
                    }
                }
            }
            return paths;
        }
        else {
            // posix
            // Guarantee that 'from' is absolute.
            from = path.resolve(from);
            // Return early not only to avoid unnecessary work, but to *avoid* returning
            // an array of two items for a root: [ '//node_modules', '/node_modules' ]
            if (from === "/")
                return ["/node_modules"];
            // note: this approach *only* works when the path is guaranteed
            // to be absolute.  Doing a fully-edge-case-correct path.split
            // that works on both Windows and Posix is non-trivial.
            var paths = [];
            for (var i = from.length - 1, p = 0, last = from.length; i >= 0; --i) {
                var code = from.charCodeAt(i);
                if (code === CHAR_FORWARD_SLASH) {
                    if (p !== nmLen)
                        paths.push(from.slice(0, last) + "/node_modules");
                    last = i;
                    p = 0;
                }
                else if (p !== -1) {
                    if (nmChars[p] === code) {
                        ++p;
                    }
                    else {
                        p = -1;
                    }
                }
            }
            // Append /node_modules to handle root paths.
            paths.push("/node_modules");
            return paths;
        }
    };
    /**
     * Create a `require` function that can be used to import CJS modules.
     * Follows CommonJS resolution similar to that of Node.js,
     * with `node_modules` lookup and `index.js` lookup support.
     * Also injects available Node.js builtin module polyfills.
     *
     *     const require_ = createRequire(import.meta.url);
     *     const fs = require_("fs");
     *     const leftPad = require_("left-pad");
     *     const cjsModule = require_("./cjs_mod");
     *
     * @param filename path or URL to current module
     * @return Require function to import CJS modules
     */
    Module.createRequire = function (filename) {
        var filepath;
        if (filename instanceof URL ||
            (typeof filename === "string" && !path.isAbsolute(filename))) {
            filepath = fileURLToPath(filename);
        }
        else if (typeof filename !== "string") {
            throw new Error("filename should be a string");
        }
        else {
            filepath = filename;
        }
        return createRequireFromPath(filepath);
    };
    Module._initPaths = function () {
        var homeDir = Deno.env("HOME");
        var nodePath = Deno.env("NODE_PATH");
        // Removed $PREFIX/bin/node case
        var paths = [];
        if (homeDir) {
            paths.unshift(path.resolve(homeDir, ".node_libraries"));
            paths.unshift(path.resolve(homeDir, ".node_modules"));
        }
        if (nodePath) {
            paths = nodePath
                .split(path.delimiter)
                .filter(function pathsFilterCB(path) {
                return !!path;
            })
                .concat(paths);
        }
        modulePaths = paths;
        // Clone as a shallow copy, for introspection.
        Module.globalPaths = modulePaths.slice(0);
    };
    Module._preloadModules = function (requests) {
        if (!Array.isArray(requests)) {
            return;
        }
        // Preloaded modules have a dummy parent module which is deemed to exist
        // in the current working directory. This seeds the search path for
        // preloaded modules.
        var parent = new Module("internal/preload", null);
        try {
            parent.paths = Module._nodeModulePaths(Deno.cwd());
        }
        catch (e) {
            if (e.code !== "ENOENT") {
                throw e;
            }
        }
        for (var n = 0; n < requests.length; n++) {
            parent.require(requests[n]);
        }
    };
    Module.builtinModules = [];
    Module._extensions = Object.create(null);
    Module._cache = Object.create(null);
    Module._pathCache = Object.create(null);
    Module.globalPaths = [];
    // Proxy related code removed.
    Module.wrapper = [
        "(function (exports, require, module, __filename, __dirname) { ",
        "\n});"
    ];
    return Module;
}());
// Polyfills.
var nativeModulePolyfill = new Map();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createNativeModule(id, exports) {
    var mod = new Module(id);
    mod.exports = exports;
    mod.loaded = true;
    return mod;
}
nativeModulePolyfill.set("fs", createNativeModule("fs", nodeFS));
nativeModulePolyfill.set("events", createNativeModule("events", nodeEvents));
nativeModulePolyfill.set("os", createNativeModule("os", nodeOs));
nativeModulePolyfill.set("path", createNativeModule("path", nodePath));
nativeModulePolyfill.set("timers", createNativeModule("timers", nodeTimers));
nativeModulePolyfill.set("util", createNativeModule("util", nodeUtil));
function loadNativeModule(_filename, request) {
    return nativeModulePolyfill.get(request);
}
function nativeModuleCanBeRequiredByUsers(request) {
    return nativeModulePolyfill.has(request);
}
// Populate with polyfill names
for (var _i = 0, _a = nativeModulePolyfill.keys(); _i < _a.length; _i++) {
    var id = _a[_i];
    Module.builtinModules.push(id);
}
var modulePaths = [];
// Given a module name, and a list of paths to test, returns the first
// matching file in the following precedence.
//
// require("a.<ext>")
//   -> a.<ext>
//
// require("a")
//   -> a
//   -> a.<ext>
//   -> a/index.<ext>
var packageJsonCache = new Map();
function readPackage(requestPath) {
    var jsonPath = path.resolve(requestPath, "package.json");
    var existing = packageJsonCache.get(jsonPath);
    if (existing !== undefined) {
        return existing;
    }
    var json;
    try {
        json = new TextDecoder().decode(Deno.readFileSync(path.toNamespacedPath(jsonPath)));
    }
    catch (_a) { }
    if (json === undefined) {
        packageJsonCache.set(jsonPath, null);
        return null;
    }
    try {
        var parsed = JSON.parse(json);
        var filtered = {
            name: parsed.name,
            main: parsed.main,
            exports: parsed.exports,
            type: parsed.type
        };
        packageJsonCache.set(jsonPath, filtered);
        return filtered;
    }
    catch (e) {
        e.path = jsonPath;
        e.message = "Error parsing " + jsonPath + ": " + e.message;
        throw e;
    }
}
function readPackageScope(checkPath) {
    var rootSeparatorIndex = checkPath.indexOf(path.sep);
    var separatorIndex;
    while ((separatorIndex = checkPath.lastIndexOf(path.sep)) > rootSeparatorIndex) {
        checkPath = checkPath.slice(0, separatorIndex);
        if (checkPath.endsWith(path.sep + "node_modules"))
            return false;
        var pjson = readPackage(checkPath);
        if (pjson)
            return {
                path: checkPath,
                data: pjson
            };
    }
    return false;
}
function readPackageMain(requestPath) {
    var pkg = readPackage(requestPath);
    return pkg ? pkg.main : undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readPackageExports(requestPath) {
    var pkg = readPackage(requestPath);
    return pkg ? pkg.exports : undefined;
}
function tryPackage(requestPath, exts, isMain, _originalPath) {
    var pkg = readPackageMain(requestPath);
    if (!pkg) {
        return tryExtensions(path.resolve(requestPath, "index"), exts, isMain);
    }
    var filename = path.resolve(requestPath, pkg);
    var actual = tryFile(filename, isMain) ||
        tryExtensions(filename, exts, isMain) ||
        tryExtensions(path.resolve(filename, "index"), exts, isMain);
    if (actual === false) {
        actual = tryExtensions(path.resolve(requestPath, "index"), exts, isMain);
        if (!actual) {
            // eslint-disable-next-line no-restricted-syntax
            var err = new Error("Cannot find module '" + filename + "'. " +
                'Please verify that the package.json has a valid "main" entry');
            // @ts-ignore
            err.code = "MODULE_NOT_FOUND";
            throw err;
        }
    }
    return actual;
}
// Check if the file exists and is not a directory
// if using --preserve-symlinks and isMain is false,
// keep symlinks intact, otherwise resolve to the
// absolute realpath.
function tryFile(requestPath, _isMain) {
    var rc = stat(requestPath);
    return rc === 0 && toRealPath(requestPath);
}
function toRealPath(requestPath) {
    // Deno does not have realpath implemented yet.
    var fullPath = requestPath;
    while (true) {
        try {
            fullPath = Deno.readlinkSync(fullPath);
        }
        catch (_a) {
            break;
        }
    }
    return path.resolve(requestPath);
}
// Given a path, check if the file exists with any of the set extensions
function tryExtensions(p, exts, isMain) {
    for (var i = 0; i < exts.length; i++) {
        var filename = tryFile(p + exts[i], isMain);
        if (filename) {
            return filename;
        }
    }
    return false;
}
// Find the longest (possibly multi-dot) extension registered in
// Module._extensions
function findLongestRegisteredExtension(filename) {
    var name = path.basename(filename);
    var currentExtension;
    var index;
    var startIndex = 0;
    while ((index = name.indexOf(".", startIndex)) !== -1) {
        startIndex = index + 1;
        if (index === 0)
            continue; // Skip dotfiles like .gitignore
        currentExtension = name.slice(index);
        if (Module._extensions[currentExtension])
            return currentExtension;
    }
    return ".js";
}
// --experimental-resolve-self trySelf() support removed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isConditionalDotExportSugar(exports, _basePath) {
    if (typeof exports === "string")
        return true;
    if (Array.isArray(exports))
        return true;
    if (typeof exports !== "object")
        return false;
    var isConditional = false;
    var firstCheck = true;
    for (var _i = 0, _a = Object.keys(exports); _i < _a.length; _i++) {
        var key = _a[_i];
        var curIsConditional = key[0] !== ".";
        if (firstCheck) {
            firstCheck = false;
            isConditional = curIsConditional;
        }
        else if (isConditional !== curIsConditional) {
            throw new Error('"exports" cannot ' +
                "contain some keys starting with '.' and some not. The exports " +
                "object must either be an object of package subpath keys or an " +
                "object of main entry condition name keys only.");
        }
    }
    return isConditional;
}
function applyExports(basePath, expansion) {
    var mappingKey = "." + expansion;
    var pkgExports = readPackageExports(basePath);
    if (pkgExports === undefined || pkgExports === null)
        return path.resolve(basePath, mappingKey);
    if (isConditionalDotExportSugar(pkgExports, basePath))
        pkgExports = { ".": pkgExports };
    if (typeof pkgExports === "object") {
        if (pkgExports.hasOwnProperty(mappingKey)) {
            var mapping = pkgExports[mappingKey];
            return resolveExportsTarget(pathToFileURL(basePath + "/"), mapping, "", basePath, mappingKey);
        }
        // Fallback to CJS main lookup when no main export is defined
        if (mappingKey === ".")
            return basePath;
        var dirMatch = "";
        for (var _i = 0, _a = Object.keys(pkgExports); _i < _a.length; _i++) {
            var candidateKey = _a[_i];
            if (candidateKey[candidateKey.length - 1] !== "/")
                continue;
            if (candidateKey.length > dirMatch.length &&
                mappingKey.startsWith(candidateKey)) {
                dirMatch = candidateKey;
            }
        }
        if (dirMatch !== "") {
            var mapping = pkgExports[dirMatch];
            var subpath = mappingKey.slice(dirMatch.length);
            return resolveExportsTarget(pathToFileURL(basePath + "/"), mapping, subpath, basePath, mappingKey);
        }
    }
    // Fallback to CJS main lookup when no main export is defined
    if (mappingKey === ".")
        return basePath;
    var e = new Error("Package exports for '" + basePath + "' do not define " +
        ("a '" + mappingKey + "' subpath"));
    // @ts-ignore
    e.code = "MODULE_NOT_FOUND";
    throw e;
}
// This only applies to requests of a specific form:
// 1. name/.*
// 2. @scope/name/.*
var EXPORTS_PATTERN = /^((?:@[^/\\%]+\/)?[^./\\%][^/\\%]*)(\/.*)?$/;
function resolveExports(nmPath, request, absoluteRequest) {
    // The implementation's behavior is meant to mirror resolution in ESM.
    if (!absoluteRequest) {
        var _a = request.match(EXPORTS_PATTERN) || [], name = _a[1], _b = _a[2], expansion = _b === void 0 ? "" : _b;
        if (!name) {
            return path.resolve(nmPath, request);
        }
        var basePath = path.resolve(nmPath, name);
        return applyExports(basePath, expansion);
    }
    return path.resolve(nmPath, request);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveExportsTarget(pkgPath, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
target, subpath, basePath, mappingKey) {
    if (typeof target === "string") {
        if (target.startsWith("./") &&
            (subpath.length === 0 || target.endsWith("/"))) {
            var resolvedTarget = new URL(target, pkgPath);
            var pkgPathPath = pkgPath.pathname;
            var resolvedTargetPath = resolvedTarget.pathname;
            if (resolvedTargetPath.startsWith(pkgPathPath) &&
                resolvedTargetPath.indexOf("/node_modules/", pkgPathPath.length - 1) ===
                    -1) {
                var resolved = new URL(subpath, resolvedTarget);
                var resolvedPath = resolved.pathname;
                if (resolvedPath.startsWith(resolvedTargetPath) &&
                    resolvedPath.indexOf("/node_modules/", pkgPathPath.length - 1) === -1) {
                    return fileURLToPath(resolved);
                }
            }
        }
    }
    else if (Array.isArray(target)) {
        for (var _i = 0, target_1 = target; _i < target_1.length; _i++) {
            var targetValue = target_1[_i];
            if (Array.isArray(targetValue))
                continue;
            try {
                return resolveExportsTarget(pkgPath, targetValue, subpath, basePath, mappingKey);
            }
            catch (e) {
                if (e.code !== "MODULE_NOT_FOUND")
                    throw e;
            }
        }
    }
    else if (typeof target === "object" && target !== null) {
        // removed experimentalConditionalExports
        if (target.hasOwnProperty("default")) {
            try {
                return resolveExportsTarget(pkgPath, target["default"], subpath, basePath, mappingKey);
            }
            catch (e) {
                if (e.code !== "MODULE_NOT_FOUND")
                    throw e;
            }
        }
    }
    var e;
    if (mappingKey !== ".") {
        e = new Error("Package exports for '" + basePath + "' do not define a " +
            ("valid '" + mappingKey + "' target" + (subpath ? " for " + subpath : "")));
    }
    else {
        e = new Error("No valid exports main found for '" + basePath + "'");
    }
    // @ts-ignore
    e.code = "MODULE_NOT_FOUND";
    throw e;
}
// 'node_modules' character codes reversed
var nmChars = [115, 101, 108, 117, 100, 111, 109, 95, 101, 100, 111, 110];
var nmLen = nmChars.length;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function emitCircularRequireWarning(prop) {
    console.error("Accessing non-existent property '" + String(prop) + "' of module exports inside circular dependency");
}
// A Proxy that can be used as the prototype of a module.exports object and
// warns when non-existend properties are accessed.
var CircularRequirePrototypeWarningProxy = new Proxy({}, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: function (target, prop) {
        // @ts-ignore
        if (prop in target)
            return target[prop];
        emitCircularRequireWarning(prop);
        return undefined;
    },
    getOwnPropertyDescriptor: function (target, prop) {
        if (target.hasOwnProperty(prop))
            return Object.getOwnPropertyDescriptor(target, prop);
        emitCircularRequireWarning(prop);
        return undefined;
    }
});
// Object.prototype and ObjectProtoype refer to our 'primordials' versions
// and are not identical to the versions on the global object.
var PublicObjectPrototype = window.Object.prototype;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getExportsForCircularRequire(module) {
    if (module.exports &&
        Object.getPrototypeOf(module.exports) === PublicObjectPrototype &&
        // Exclude transpiled ES6 modules / TypeScript code because those may
        // employ unusual patterns for accessing 'module.exports'. That should be
        // okay because ES6 modules have a different approach to circular
        // dependencies anyway.
        !module.exports.__esModule) {
        // This is later unset once the module is done loading.
        Object.setPrototypeOf(module.exports, CircularRequirePrototypeWarningProxy);
    }
    return module.exports;
}
function wrapSafe(filename_, content) {
    // TODO: fix this
    var wrapper = Module.wrap(content);
    // @ts-ignore
    var _a = Deno.core.evalContext(wrapper), f = _a[0], err = _a[1];
    if (err) {
        throw err;
    }
    return f;
    // ESM code removed.
}
// Native extension for .js
Module._extensions[".js"] = function (module, filename) {
    if (filename.endsWith(".js")) {
        var pkg = readPackageScope(filename);
        if (pkg !== false && pkg.data && pkg.data.type === "module") {
            throw new Error("Importing ESM module");
        }
    }
    var content = new TextDecoder().decode(Deno.readFileSync(filename));
    module._compile(content, filename);
};
// Native extension for .json
Module._extensions[".json"] = function (module, filename) {
    var content = new TextDecoder().decode(Deno.readFileSync(filename));
    // manifest code removed
    try {
        module.exports = JSON.parse(stripBOM(content));
    }
    catch (err) {
        err.message = filename + ": " + err.message;
        throw err;
    }
};
// .node extension is not supported
function createRequireFromPath(filename) {
    // Allow a directory to be passed as the filename
    var trailingSlash = filename.endsWith("/") || (isWindows && filename.endsWith("\\"));
    var proxyPath = trailingSlash ? path.join(filename, "noop.js") : filename;
    var m = new Module(proxyPath);
    m.filename = proxyPath;
    m.paths = Module._nodeModulePaths(m.path);
    return makeRequireFunction(m);
}
function makeRequireFunction(mod) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var require = function require(path) {
        return mod.require(path);
    };
    function resolve(request, options) {
        return Module._resolveFilename(request, mod, false, options);
    }
    require.resolve = resolve;
    function paths(request) {
        return Module._resolveLookupPaths(request, mod);
    }
    resolve.paths = paths;
    // TODO: set main
    // require.main = process.mainModule;
    // Enable support to add extra extension types.
    require.extensions = Module._extensions;
    require.cache = Module._cache;
    return require;
}
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 * because the buffer-to-string conversion in `fs.readFileSync()`
 * translates it to FEFF, the UTF-16 BOM.
 */
function stripBOM(content) {
    if (content.charCodeAt(0) === 0xfeff) {
        content = content.slice(1);
    }
    return content;
}
var forwardSlashRegEx = /\//g;
var CHAR_LOWERCASE_A = "a".charCodeAt(0);
var CHAR_LOWERCASE_Z = "z".charCodeAt(0);
function getPathFromURLWin32(url) {
    // const hostname = url.hostname;
    var pathname = url.pathname;
    for (var n = 0; n < pathname.length; n++) {
        if (pathname[n] === "%") {
            var third = pathname.codePointAt(n + 2) | 0x20;
            if ((pathname[n + 1] === "2" && third === 102) || // 2f 2F /
                (pathname[n + 1] === "5" && third === 99)) {
                // 5c 5C \
                throw new Error("Invalid file url path: must not include encoded \\ or / characters");
            }
        }
    }
    pathname = pathname.replace(forwardSlashRegEx, "\\");
    pathname = decodeURIComponent(pathname);
    // TODO: handle windows hostname case (needs bindings)
    var letter = pathname.codePointAt(1) | 0x20;
    var sep = pathname[2];
    if (letter < CHAR_LOWERCASE_A ||
        letter > CHAR_LOWERCASE_Z || // a..z A..Z
        sep !== ":") {
        throw new Error("Invalid file URL path: must be absolute");
    }
    return pathname.slice(1);
}
function getPathFromURLPosix(url) {
    if (url.hostname !== "") {
        throw new Error("Invalid file URL host");
    }
    var pathname = url.pathname;
    for (var n = 0; n < pathname.length; n++) {
        if (pathname[n] === "%") {
            var third = pathname.codePointAt(n + 2) | 0x20;
            if (pathname[n + 1] === "2" && third === 102) {
                throw new Error("Invalid file URL path: must not include encoded / characters");
            }
        }
    }
    return decodeURIComponent(pathname);
}
function fileURLToPath(path) {
    if (typeof path === "string") {
        path = new URL(path);
    }
    if (path.protocol !== "file:") {
        throw new Error("Protocol has to be file://");
    }
    return isWindows ? getPathFromURLWin32(path) : getPathFromURLPosix(path);
}
var percentRegEx = /%/g;
var backslashRegEx = /\\/g;
var newlineRegEx = /\n/g;
var carriageReturnRegEx = /\r/g;
var tabRegEx = /\t/g;
function pathToFileURL(filepath) {
    var resolved = path.resolve(filepath);
    // path.resolve strips trailing slashes so we must add them back
    var filePathLast = filepath.charCodeAt(filepath.length - 1);
    if ((filePathLast === CHAR_FORWARD_SLASH ||
        (isWindows && filePathLast === CHAR_BACKWARD_SLASH)) &&
        resolved[resolved.length - 1] !== path.sep)
        resolved += "/";
    var outURL = new URL("file://");
    if (resolved.includes("%"))
        resolved = resolved.replace(percentRegEx, "%25");
    // In posix, "/" is a valid character in paths
    if (!isWindows && resolved.includes("\\"))
        resolved = resolved.replace(backslashRegEx, "%5C");
    if (resolved.includes("\n"))
        resolved = resolved.replace(newlineRegEx, "%0A");
    if (resolved.includes("\r"))
        resolved = resolved.replace(carriageReturnRegEx, "%0D");
    if (resolved.includes("\t"))
        resolved = resolved.replace(tabRegEx, "%09");
    outURL.pathname = resolved;
    return outURL;
}
export var builtinModules = Module.builtinModules;
export var createRequire = Module.createRequire;
export default Module;
//# sourceMappingURL=module.js.map
