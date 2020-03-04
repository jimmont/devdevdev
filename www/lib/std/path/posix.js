// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
var cwd = Deno.cwd;
import { CHAR_DOT, CHAR_FORWARD_SLASH } from "./constants.ts";
import { assertPath, normalizeString, isPosixPathSeparator, _format } from "./utils.ts";
export var sep = "/";
export var delimiter = ":";
// path.resolve([from ...], to)
export function resolve() {
    var pathSegments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pathSegments[_i] = arguments[_i];
    }
    var resolvedPath = "";
    var resolvedAbsolute = false;
    for (var i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = void 0;
        if (i >= 0)
            path = pathSegments[i];
        else
            path = cwd();
        assertPath(path);
        // Skip empty entries
        if (path.length === 0) {
            continue;
        }
        resolvedPath = path + "/" + resolvedPath;
        resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path
    resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0)
            return "/" + resolvedPath;
        else
            return "/";
    }
    else if (resolvedPath.length > 0)
        return resolvedPath;
    else
        return ".";
}
export function normalize(path) {
    assertPath(path);
    if (path.length === 0)
        return ".";
    var isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    var trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
    // Normalize the path
    path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
    if (path.length === 0 && !isAbsolute)
        path = ".";
    if (path.length > 0 && trailingSeparator)
        path += "/";
    if (isAbsolute)
        return "/" + path;
    return path;
}
export function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
}
export function join() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    if (paths.length === 0)
        return ".";
    var joined;
    for (var i = 0, len = paths.length; i < len; ++i) {
        var path = paths[i];
        assertPath(path);
        if (path.length > 0) {
            if (!joined)
                joined = path;
            else
                joined += "/" + path;
        }
    }
    if (!joined)
        return ".";
    return normalize(joined);
}
export function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to)
        return "";
    from = resolve(from);
    to = resolve(to);
    if (from === to)
        return "";
    // Trim any leading backslashes
    var fromStart = 1;
    var fromEnd = from.length;
    for (; fromStart < fromEnd; ++fromStart) {
        if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH)
            break;
    }
    var fromLen = fromEnd - fromStart;
    // Trim any leading backslashes
    var toStart = 1;
    var toEnd = to.length;
    for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH)
            break;
    }
    var toLen = toEnd - toStart;
    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
                    // We get here if `from` is the exact base path for `to`.
                    // For example: from='/foo/bar'; to='/foo/bar/baz'
                    return to.slice(toStart + i + 1);
                }
                else if (i === 0) {
                    // We get here if `from` is the root
                    // For example: from='/'; to='/foo'
                    return to.slice(toStart + i);
                }
            }
            else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
                    // We get here if `to` is the exact base path for `from`.
                    // For example: from='/foo/bar/baz'; to='/foo/bar'
                    lastCommonSep = i;
                }
                else if (i === 0) {
                    // We get here if `to` is the root.
                    // For example: from='/foo'; to='/'
                    lastCommonSep = 0;
                }
            }
            break;
        }
        var fromCode = from.charCodeAt(fromStart + i);
        var toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode)
            break;
        else if (fromCode === CHAR_FORWARD_SLASH)
            lastCommonSep = i;
    }
    var out = "";
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
            if (out.length === 0)
                out += "..";
            else
                out += "/..";
        }
    }
    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
        return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH)
            ++toStart;
        return to.slice(toStart);
    }
}
export function toNamespacedPath(path) {
    // Non-op on posix systems
    return path;
}
export function dirname(path) {
    assertPath(path);
    if (path.length === 0)
        return ".";
    var hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        }
        else {
            // We saw the first non-path separator
            matchedSlash = false;
        }
    }
    if (end === -1)
        return hasRoot ? "/" : ".";
    if (hasRoot && end === 1)
        return "//";
    return path.slice(0, end);
}
export function basename(path, ext) {
    if (ext === void 0) { ext = ""; }
    if (ext !== undefined && typeof ext !== "string")
        throw new TypeError('"ext" argument must be a string');
    assertPath(path);
    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path)
            return "";
        var extIdx = ext.length - 1;
        var firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            }
            else {
                if (firstNonSlashEnd === -1) {
                    // We saw the first non-path separator, remember this index in case
                    // we need it if the extension ends up not matching
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    // Try to match the explicit extension
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            // We matched the extension, so mark this as the end of our path
                            // component
                            end = i;
                        }
                    }
                    else {
                        // Extension does not match, so our result is the entire path
                        // component
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end)
            end = firstNonSlashEnd;
        else if (end === -1)
            end = path.length;
        return path.slice(start, end);
    }
    else {
        for (i = path.length - 1; i >= 0; --i) {
            if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            }
            else if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // path component
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1)
            return "";
        return path.slice(start, end);
    }
}
export function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // extension
            matchedSlash = false;
            end = i + 1;
        }
        if (code === CHAR_DOT) {
            // If this is our first dot, mark it as the start of our extension
            if (startDot === -1)
                startDot = i;
            else if (preDotState !== 1)
                preDotState = 1;
        }
        else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
    }
    if (startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
        return "";
    }
    return path.slice(startDot, end);
}
export function format(pathObject) {
    /* eslint-disable max-len */
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError("The \"pathObject\" argument must be of type Object. Received type " + typeof pathObject);
    }
    return _format("/", pathObject);
}
export function parse(path) {
    assertPath(path);
    var ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path.length === 0)
        return ret;
    var isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    var start;
    if (isAbsolute) {
        ret.root = "/";
        start = 1;
    }
    else {
        start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    // Get non-dir info
    for (; i >= start; --i) {
        var code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // extension
            matchedSlash = false;
            end = i + 1;
        }
        if (code === CHAR_DOT) {
            // If this is our first dot, mark it as the start of our extension
            if (startDot === -1)
                startDot = i;
            else if (preDotState !== 1)
                preDotState = 1;
        }
        else if (startDot !== -1) {
            // We saw a non-dot and non-path separator before our dot, so we should
            // have a good chance at having a non-empty extension
            preDotState = -1;
        }
    }
    if (startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute) {
                ret.base = ret.name = path.slice(1, end);
            }
            else {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
    }
    else {
        if (startPart === 0 && isAbsolute) {
            ret.name = path.slice(1, startDot);
            ret.base = path.slice(1, end);
        }
        else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0)
        ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute)
        ret.dir = "/";
    return ret;
}
//# sourceMappingURL=posix.js.map