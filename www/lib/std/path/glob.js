import { SEP, SEP_PATTERN } from "./constants.js";
import { globrex } from "./globrex.js";
import { join, normalize } from "./mod.js";
import { assert } from "../testing/asserts.js";
/**
 * Generate a regex based on glob pattern and options
 * This was meant to be using the the `fs.walk` function
 * but can be used anywhere else.
 * Examples:
 *
 *     Looking for all the `ts` files:
 *     walkSync(".", {
 *       match: [globToRegExp("*.js")]
 *     })
 *
 *     Looking for all the `.json` files in any subfolder:
 *     walkSync(".", {
 *       match: [globToRegExp(join("a", "**", "*.json"),{
 *         flags: "g",
 *         extended: true,
 *         globstar: true
 *       })]
 *     })
 *
 * @param glob - Glob pattern to be used
 * @param options - Specific options for the glob pattern
 * @returns A RegExp for the glob pattern
 */
export function globToRegExp(glob, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.extended, extended = _c === void 0 ? false : _c, _d = _b.globstar, globstar = _d === void 0 ? true : _d;
    var result = globrex(glob, {
        extended: extended,
        globstar: globstar,
        strict: false,
        filepath: true
    });
    assert(result.path != null);
    return result.path.regex;
}
/** Test whether the given string is a glob */
export function isGlob(str) {
    var chars = { "{": "}", "(": ")", "[": "]" };
    /* eslint-disable-next-line max-len */
    var regex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
    if (str === "") {
        return false;
    }
    var match;
    while ((match = regex.exec(str))) {
        if (match[2])
            return true;
        var idx = match.index + match[0].length;
        // if an open bracket/brace/paren is escaped,
        // set the index to the next closing character
        var open = match[1];
        var close = open ? chars[open] : null;
        if (open && close) {
            var n = str.indexOf(close, idx);
            if (n !== -1) {
                idx = n + 1;
            }
        }
        str = str.slice(idx);
    }
    return false;
}
/** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
export function normalizeGlob(glob, _a) {
    var _b = (_a === void 0 ? {} : _a).globstar, globstar = _b === void 0 ? false : _b;
    if (!!glob.match(/\0/g)) {
        throw new Error("Glob contains invalid characters: \"" + glob + "\"");
    }
    if (!globstar) {
        return normalize(glob);
    }
    var s = SEP_PATTERN.source;
    var badParentPattern = new RegExp("(?<=(" + s + "|^)\\*\\*" + s + ")\\.\\.(?=" + s + "|$)", "g");
    return normalize(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
/** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
export function joinGlobs(globs, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.extended, extended = _c === void 0 ? false : _c, _d = _b.globstar, globstar = _d === void 0 ? false : _d;
    if (!globstar || globs.length == 0) {
        return join.apply(void 0, globs);
    }
    if (globs.length === 0)
        return ".";
    var joined;
    for (var _i = 0, globs_1 = globs; _i < globs_1.length; _i++) {
        var glob = globs_1[_i];
        var path = glob;
        if (path.length > 0) {
            if (!joined)
                joined = path;
            else
                joined += "" + SEP + path;
        }
    }
    if (!joined)
        return ".";
    return normalizeGlob(joined, { extended: extended, globstar: globstar });
}
//# sourceMappingURL=glob.js.map
