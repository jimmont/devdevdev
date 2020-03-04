// This file is ported from globrex@0.1.2
// MIT License
// Copyright (c) 2018 Terkel Gjervig Nielsen
var isWin = Deno.build.os === "win";
var SEP = isWin ? "(?:\\\\|\\/)" : "\\/";
var SEP_ESC = isWin ? "\\\\" : "/";
var SEP_RAW = isWin ? "\\" : "/";
var GLOBSTAR = "(?:(?:[^" + SEP_ESC + "/]*(?:" + SEP_ESC + "|/|$))*)";
var WILDCARD = "(?:[^" + SEP_ESC + "/]*)";
var GLOBSTAR_SEGMENT = "((?:[^" + SEP_ESC + "/]*(?:" + SEP_ESC + "|/|$))*)";
var WILDCARD_SEGMENT = "(?:[^" + SEP_ESC + "/]*)";
/**
 * Convert any glob pattern to a JavaScript Regexp object
 * @param glob Glob pattern to convert
 * @param opts Configuration object
 * @param [opts.extended=false] Support advanced ext globbing
 * @param [opts.globstar=false] Support globstar
 * @param [opts.strict=true] be laissez faire about mutiple slashes
 * @param [opts.filepath=""] Parse as filepath for extra path related features
 * @param [opts.flags=""] RegExp globs
 * @returns Converted object with string, segments and RegExp object
 */
export function globrex(glob, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.extended, extended = _c === void 0 ? false : _c, _d = _b.globstar, globstar = _d === void 0 ? false : _d, _e = _b.strict, strict = _e === void 0 ? false : _e, _f = _b.filepath, filepath = _f === void 0 ? false : _f, _g = _b.flags, flags = _g === void 0 ? "" : _g;
    var sepPattern = new RegExp("^" + SEP + (strict ? "" : "+") + "$");
    var regex = "";
    var segment = "";
    var pathRegexStr = "";
    var pathSegments = [];
    // If we are doing extended matching, this boolean is true when we are inside
    // a group (eg {*.html,*.js}), and false otherwise.
    var inGroup = false;
    var inRange = false;
    // extglob stack. Keep track of scope
    var ext = [];
    // Helper function to build string and segments
    function add(str, options) {
        if (options === void 0) { options = { split: false, last: false, only: "" }; }
        var split = options.split, last = options.last, only = options.only;
        if (only !== "path")
            regex += str;
        if (filepath && only !== "regex") {
            pathRegexStr += str.match(sepPattern) ? SEP : str;
            if (split) {
                if (last)
                    segment += str;
                if (segment !== "") {
                    // change it 'includes'
                    if (!flags.includes("g"))
                        segment = "^" + segment + "$";
                    pathSegments.push(new RegExp(segment, flags));
                }
                segment = "";
            }
            else {
                segment += str;
            }
        }
    }
    var c, n;
    for (var i = 0; i < glob.length; i++) {
        c = glob[i];
        n = glob[i + 1];
        if (["\\", "$", "^", ".", "="].includes(c)) {
            add("\\" + c);
            continue;
        }
        if (c.match(sepPattern)) {
            add(SEP, { split: true });
            if (n != null && n.match(sepPattern) && !strict)
                regex += "?";
            continue;
        }
        if (c === "(") {
            if (ext.length) {
                add(c + "?:");
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === ")") {
            if (ext.length) {
                add(c);
                var type = ext.pop();
                if (type === "@") {
                    add("{1}");
                }
                else if (type === "!") {
                    add(WILDCARD);
                }
                else {
                    add(type);
                }
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === "|") {
            if (ext.length) {
                add(c);
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === "+") {
            if (n === "(" && extended) {
                ext.push(c);
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === "@" && extended) {
            if (n === "(") {
                ext.push(c);
                continue;
            }
        }
        if (c === "!") {
            if (extended) {
                if (inRange) {
                    add("^");
                    continue;
                }
                if (n === "(") {
                    ext.push(c);
                    add("(?!");
                    i++;
                    continue;
                }
                add("\\" + c);
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === "?") {
            if (extended) {
                if (n === "(") {
                    ext.push(c);
                }
                else {
                    add(".");
                }
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === "[") {
            if (inRange && n === ":") {
                i++; // skip [
                var value = "";
                while (glob[++i] !== ":")
                    value += glob[i];
                if (value === "alnum")
                    add("(?:\\w|\\d)");
                else if (value === "space")
                    add("\\s");
                else if (value === "digit")
                    add("\\d");
                i++; // skip last ]
                continue;
            }
            if (extended) {
                inRange = true;
                add(c);
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === "]") {
            if (extended) {
                inRange = false;
                add(c);
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === "{") {
            if (extended) {
                inGroup = true;
                add("(?:");
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === "}") {
            if (extended) {
                inGroup = false;
                add(")");
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === ",") {
            if (inGroup) {
                add("|");
                continue;
            }
            add("\\" + c);
            continue;
        }
        if (c === "*") {
            if (n === "(" && extended) {
                ext.push(c);
                continue;
            }
            // Move over all consecutive "*"'s.
            // Also store the previous and next characters
            var prevChar = glob[i - 1];
            var starCount = 1;
            while (glob[i + 1] === "*") {
                starCount++;
                i++;
            }
            var nextChar = glob[i + 1];
            if (!globstar) {
                // globstar is disabled, so treat any number of "*" as one
                add(".*");
            }
            else {
                // globstar is enabled, so determine if this is a globstar segment
                var isGlobstar = starCount > 1 && // multiple "*"'s
                    // from the start of the segment
                    [SEP_RAW, "/", undefined].includes(prevChar) &&
                    // to the end of the segment
                    [SEP_RAW, "/", undefined].includes(nextChar);
                if (isGlobstar) {
                    // it's a globstar, so match zero or more path segments
                    add(GLOBSTAR, { only: "regex" });
                    add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
                    i++; // move over the "/"
                }
                else {
                    // it's not a globstar, so only match one path segment
                    add(WILDCARD, { only: "regex" });
                    add(WILDCARD_SEGMENT, { only: "path" });
                }
            }
            continue;
        }
        add(c);
    }
    // When regexp 'g' flag is specified don't
    // constrain the regular expression with ^ & $
    if (!flags.includes("g")) {
        regex = "^" + regex + "$";
        segment = "^" + segment + "$";
        if (filepath)
            pathRegexStr = "^" + pathRegexStr + "$";
    }
    var result = { regex: new RegExp(regex, flags) };
    // Push the last segment
    if (filepath) {
        pathSegments.push(new RegExp(segment, flags));
        result.path = {
            regex: new RegExp(pathRegexStr, flags),
            segments: pathSegments,
            globstar: new RegExp(!flags.includes("g") ? "^" + GLOBSTAR_SEGMENT + "$" : GLOBSTAR_SEGMENT, flags)
        };
    }
    return result;
}
//# sourceMappingURL=globrex.js.map