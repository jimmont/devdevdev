// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
var cwd = Deno.cwd, env = Deno.env;
import { CHAR_DOT, CHAR_BACKWARD_SLASH, CHAR_COLON, CHAR_QUESTION_MARK } from "./constants.ts";
import { assertPath, isPathSeparator, isWindowsDeviceRoot, normalizeString, _format } from "./utils.ts";
import { assert } from "../testing/asserts.ts";
export var sep = "\\";
export var delimiter = ";";
export function resolve() {
    var pathSegments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pathSegments[_i] = arguments[_i];
    }
    var resolvedDevice = "";
    var resolvedTail = "";
    var resolvedAbsolute = false;
    for (var i = pathSegments.length - 1; i >= -1; i--) {
        var path = void 0;
        if (i >= 0) {
            path = pathSegments[i];
        }
        else if (!resolvedDevice) {
            path = cwd();
        }
        else {
            // Windows has the concept of drive-specific current working
            // directories. If we've resolved a drive letter but not yet an
            // absolute path, get cwd for that drive, or the process cwd if
            // the drive cwd is not available. We're sure the device is not
            // a UNC path at this points, because UNC paths are always absolute.
            path = env()["=" + resolvedDevice] || cwd();
            // Verify that a cwd was found and that it actually points
            // to our drive. If not, default to the drive's root.
            if (path === undefined ||
                path.slice(0, 3).toLowerCase() !== resolvedDevice.toLowerCase() + "\\") {
                path = resolvedDevice + "\\";
            }
        }
        assertPath(path);
        var len = path.length;
        // Skip empty entries
        if (len === 0)
            continue;
        var rootEnd = 0;
        var device = "";
        var isAbsolute_1 = false;
        var code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (isPathSeparator(code)) {
                // Possible UNC root
                // If we started with a separator, we know we at least have an
                // absolute path of some kind (UNC or otherwise)
                isAbsolute_1 = true;
                if (isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    var j = 2;
                    var last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        var firstPart = path.slice(last, j);
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                device = "\\\\" + firstPart + "\\" + path.slice(last);
                                rootEnd = j;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                device = "\\\\" + firstPart + "\\" + path.slice(last, j);
                                rootEnd = j;
                            }
                        }
                    }
                }
                else {
                    rootEnd = 1;
                }
            }
            else if (isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === CHAR_COLON) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator(path.charCodeAt(2))) {
                            // Treat separator following drive name as an absolute path
                            // indicator
                            isAbsolute_1 = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        }
        else if (isPathSeparator(code)) {
            // `path` contains just a path separator
            rootEnd = 1;
            isAbsolute_1 = true;
        }
        if (device.length > 0 &&
            resolvedDevice.length > 0 &&
            device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            // This path points to another device so it is not applicable
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = path.slice(rootEnd) + "\\" + resolvedTail;
            resolvedAbsolute = isAbsolute_1;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0)
            break;
    }
    // At this point the path should be resolved to a full absolute path,
    // but handle relative paths to be safe (might happen when process.cwd()
    // fails)
    // Normalize the tail path
    resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
export function normalize(path) {
    assertPath(path);
    var len = path.length;
    if (len === 0)
        return ".";
    var rootEnd = 0;
    var device;
    var isAbsolute = false;
    var code = path.charCodeAt(0);
    // Try to match a root
    if (len > 1) {
        if (isPathSeparator(code)) {
            // Possible UNC root
            // If we started with a separator, we know we at least have an absolute
            // path of some kind (UNC or otherwise)
            isAbsolute = true;
            if (isPathSeparator(path.charCodeAt(1))) {
                // Matched double path separator at beginning
                var j = 2;
                var last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                    if (isPathSeparator(path.charCodeAt(j)))
                        break;
                }
                if (j < len && j !== last) {
                    var firstPart = path.slice(last, j);
                    // Matched!
                    last = j;
                    // Match 1 or more path separators
                    for (; j < len; ++j) {
                        if (!isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more non-path separators
                        for (; j < len; ++j) {
                            if (isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j === len) {
                            // We matched a UNC root only
                            // Return the normalized version of the UNC root since there
                            // is nothing left to process
                            return "\\\\" + firstPart + "\\" + path.slice(last) + "\\";
                        }
                        else if (j !== last) {
                            // We matched a UNC root with leftovers
                            device = "\\\\" + firstPart + "\\" + path.slice(last, j);
                            rootEnd = j;
                        }
                    }
                }
            }
            else {
                rootEnd = 1;
            }
        }
        else if (isWindowsDeviceRoot(code)) {
            // Possible device root
            if (path.charCodeAt(1) === CHAR_COLON) {
                device = path.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path.charCodeAt(2))) {
                        // Treat separator following drive name as an absolute path
                        // indicator
                        isAbsolute = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    }
    else if (isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid unnecessary
        // work
        return "\\";
    }
    var tail;
    if (rootEnd < len) {
        tail = normalizeString(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator);
    }
    else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute)
        tail = ".";
    if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1)))
        tail += "\\";
    if (device === undefined) {
        if (isAbsolute) {
            if (tail.length > 0)
                return "\\" + tail;
            else
                return "\\";
        }
        else if (tail.length > 0) {
            return tail;
        }
        else {
            return "";
        }
    }
    else if (isAbsolute) {
        if (tail.length > 0)
            return device + "\\" + tail;
        else
            return device + "\\";
    }
    else if (tail.length > 0) {
        return device + tail;
    }
    else {
        return device;
    }
}
export function isAbsolute(path) {
    assertPath(path);
    var len = path.length;
    if (len === 0)
        return false;
    var code = path.charCodeAt(0);
    if (isPathSeparator(code)) {
        return true;
    }
    else if (isWindowsDeviceRoot(code)) {
        // Possible device root
        if (len > 2 && path.charCodeAt(1) === CHAR_COLON) {
            if (isPathSeparator(path.charCodeAt(2)))
                return true;
        }
    }
    return false;
}
export function join() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    var pathsCount = paths.length;
    if (pathsCount === 0)
        return ".";
    var joined;
    var firstPart = null;
    for (var i = 0; i < pathsCount; ++i) {
        var path = paths[i];
        assertPath(path);
        if (path.length > 0) {
            if (joined === undefined)
                joined = firstPart = path;
            else
                joined += "\\" + path;
        }
    }
    if (joined === undefined)
        return ".";
    // Make sure that the joined path doesn't start with two slashes, because
    // normalize() will mistake it for an UNC path then.
    //
    // This step is skipped when it is very clear that the user actually
    // intended to point at an UNC path. This is assumed when the first
    // non-empty string arguments starts with exactly two slashes followed by
    // at least one more non-slash character.
    //
    // Note that for normalize() to treat a path as an UNC path it needs to
    // have at least 2 components, so we don't filter for that here.
    // This means that the user can use join to construct UNC paths from
    // a server name and a share name; for example:
    //   path.join('//server', 'share') -> '\\\\server\\share\\')
    var needsReplace = true;
    var slashCount = 0;
    assert(firstPart != null);
    if (isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        var firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator(firstPart.charCodeAt(2)))
                        ++slashCount;
                    else {
                        // We matched a UNC path in the first part
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        // Find any more consecutive slashes we need to replace
        for (; slashCount < joined.length; ++slashCount) {
            if (!isPathSeparator(joined.charCodeAt(slashCount)))
                break;
        }
        // Replace the slashes if needed
        if (slashCount >= 2)
            joined = "\\" + joined.slice(slashCount);
    }
    return normalize(joined);
}
// It will solve the relative path from `from` to `to`, for instance:
//  from = 'C:\\orandea\\test\\aaa'
//  to = 'C:\\orandea\\impl\\bbb'
// The output of the function should be: '..\\..\\impl\\bbb'
export function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to)
        return "";
    var fromOrig = resolve(from);
    var toOrig = resolve(to);
    if (fromOrig === toOrig)
        return "";
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to)
        return "";
    // Trim any leading backslashes
    var fromStart = 0;
    var fromEnd = from.length;
    for (; fromStart < fromEnd; ++fromStart) {
        if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH)
            break;
    }
    // Trim trailing backslashes (applicable to UNC paths only)
    for (; fromEnd - 1 > fromStart; --fromEnd) {
        if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH)
            break;
    }
    var fromLen = fromEnd - fromStart;
    // Trim any leading backslashes
    var toStart = 0;
    var toEnd = to.length;
    for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH)
            break;
    }
    // Trim trailing backslashes (applicable to UNC paths only)
    for (; toEnd - 1 > toStart; --toEnd) {
        if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH)
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
                if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
                    // We get here if `from` is the exact base path for `to`.
                    // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
                    return toOrig.slice(toStart + i + 1);
                }
                else if (i === 2) {
                    // We get here if `from` is the device root.
                    // For example: from='C:\\'; to='C:\\foo'
                    return toOrig.slice(toStart + i);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
                    // We get here if `to` is the exact base path for `from`.
                    // For example: from='C:\\foo\\bar'; to='C:\\foo'
                    lastCommonSep = i;
                }
                else if (i === 2) {
                    // We get here if `to` is the device root.
                    // For example: from='C:\\foo\\bar'; to='C:\\'
                    lastCommonSep = 3;
                }
            }
            break;
        }
        var fromCode = from.charCodeAt(fromStart + i);
        var toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode)
            break;
        else if (fromCode === CHAR_BACKWARD_SLASH)
            lastCommonSep = i;
    }
    // We found a mismatch before the first common path separator was seen, so
    // return the original `to`.
    if (i !== length && lastCommonSep === -1) {
        return toOrig;
    }
    var out = "";
    if (lastCommonSep === -1)
        lastCommonSep = 0;
    // Generate the relative path based on the path difference between `to` and
    // `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
            if (out.length === 0)
                out += "..";
            else
                out += "\\..";
        }
    }
    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
    else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH)
            ++toStart;
        return toOrig.slice(toStart, toEnd);
    }
}
export function toNamespacedPath(path) {
    // Note: this will *probably* throw somewhere.
    if (typeof path !== "string")
        return path;
    if (path.length === 0)
        return "";
    var resolvedPath = resolve(path);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
            // Possible UNC root
            if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
                var code = resolvedPath.charCodeAt(2);
                if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
                    // Matched non-long UNC root, convert the path to a long UNC path
                    return "\\\\?\\UNC\\" + resolvedPath.slice(2);
                }
            }
        }
        else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
            // Possible device root
            if (resolvedPath.charCodeAt(1) === CHAR_COLON &&
                resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
                // Matched device root, convert the path to a long UNC path
                return "\\\\?\\" + resolvedPath;
            }
        }
    }
    return path;
}
export function dirname(path) {
    assertPath(path);
    var len = path.length;
    if (len === 0)
        return ".";
    var rootEnd = -1;
    var end = -1;
    var matchedSlash = true;
    var offset = 0;
    var code = path.charCodeAt(0);
    // Try to match a root
    if (len > 1) {
        if (isPathSeparator(code)) {
            // Possible UNC root
            rootEnd = offset = 1;
            if (isPathSeparator(path.charCodeAt(1))) {
                // Matched double path separator at beginning
                var j = 2;
                var last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                    if (isPathSeparator(path.charCodeAt(j)))
                        break;
                }
                if (j < len && j !== last) {
                    // Matched!
                    last = j;
                    // Match 1 or more path separators
                    for (; j < len; ++j) {
                        if (!isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more non-path separators
                        for (; j < len; ++j) {
                            if (isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j === len) {
                            // We matched a UNC root only
                            return path;
                        }
                        if (j !== last) {
                            // We matched a UNC root with leftovers
                            // Offset by 1 to include the separator after the UNC root to
                            // treat it as a "normal root" on top of a (UNC) root
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        }
        else if (isWindowsDeviceRoot(code)) {
            // Possible device root
            if (path.charCodeAt(1) === CHAR_COLON) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator(path.charCodeAt(2)))
                        rootEnd = offset = 3;
                }
            }
        }
    }
    else if (isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        return path;
    }
    for (var i = len - 1; i >= offset; --i) {
        if (isPathSeparator(path.charCodeAt(i))) {
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
    if (end === -1) {
        if (rootEnd === -1)
            return ".";
        else
            end = rootEnd;
    }
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
    // Check for a drive letter prefix so as not to mistake the following
    // path separator as an extra separator at the end of the path that can be
    // disregarded
    if (path.length >= 2) {
        var drive = path.charCodeAt(0);
        if (isWindowsDeviceRoot(drive)) {
            if (path.charCodeAt(1) === CHAR_COLON)
                start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path)
            return "";
        var extIdx = ext.length - 1;
        var firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= start; --i) {
            var code = path.charCodeAt(i);
            if (isPathSeparator(code)) {
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
        for (i = path.length - 1; i >= start; --i) {
            if (isPathSeparator(path.charCodeAt(i))) {
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
    var start = 0;
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    // Check for a drive letter prefix so as not to mistake the following
    // path separator as an extra separator at the end of the path that can be
    // disregarded
    if (path.length >= 2 &&
        path.charCodeAt(1) === CHAR_COLON &&
        isWindowsDeviceRoot(path.charCodeAt(0))) {
        start = startPart = 2;
    }
    for (var i = path.length - 1; i >= start; --i) {
        var code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
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
    return _format("\\", pathObject);
}
export function parse(path) {
    assertPath(path);
    var ret = { root: "", dir: "", base: "", ext: "", name: "" };
    var len = path.length;
    if (len === 0)
        return ret;
    var rootEnd = 0;
    var code = path.charCodeAt(0);
    // Try to match a root
    if (len > 1) {
        if (isPathSeparator(code)) {
            // Possible UNC root
            rootEnd = 1;
            if (isPathSeparator(path.charCodeAt(1))) {
                // Matched double path separator at beginning
                var j = 2;
                var last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                    if (isPathSeparator(path.charCodeAt(j)))
                        break;
                }
                if (j < len && j !== last) {
                    // Matched!
                    last = j;
                    // Match 1 or more path separators
                    for (; j < len; ++j) {
                        if (!isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more non-path separators
                        for (; j < len; ++j) {
                            if (isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j === len) {
                            // We matched a UNC root only
                            rootEnd = j;
                        }
                        else if (j !== last) {
                            // We matched a UNC root with leftovers
                            rootEnd = j + 1;
                        }
                    }
                }
            }
        }
        else if (isWindowsDeviceRoot(code)) {
            // Possible device root
            if (path.charCodeAt(1) === CHAR_COLON) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path.charCodeAt(2))) {
                        if (len === 3) {
                            // `path` contains just a drive root, exit early to avoid
                            // unnecessary work
                            ret.root = ret.dir = path;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                }
                else {
                    // `path` contains just a drive root, exit early to avoid
                    // unnecessary work
                    ret.root = ret.dir = path;
                    return ret;
                }
            }
        }
    }
    else if (isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        ret.root = ret.dir = path;
        return ret;
    }
    if (rootEnd > 0)
        ret.root = path.slice(0, rootEnd);
    var startDot = -1;
    var startPart = rootEnd;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    // Get non-dir info
    for (; i >= rootEnd; --i) {
        code = path.charCodeAt(i);
        if (isPathSeparator(code)) {
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
            ret.base = ret.name = path.slice(startPart, end);
        }
    }
    else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
    }
    // If the directory is the root, use the entire root as the `dir` including
    // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
    // trailing slash (`C:\abc\def` -> `C:\abc`).
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
    }
    else
        ret.dir = ret.root;
    return ret;
}
//# sourceMappingURL=win32.js.map