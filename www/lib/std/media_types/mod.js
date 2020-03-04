/*!
 * Ported from: https://github.com/jshttp/mime-types and licensed as:
 *
 * (The MIT License)
 *
 * Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>
 * Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>
 * Copyright (c) 2020 the Deno authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { db, extname } from "./deps.js";
var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var TEXT_TYPE_REGEXP = /^text\//i;
/** A map of extensions for a given media type */
export var extensions = new Map();
/** A map of the media type for a given extension */
export var types = new Map();
/** Internal function to populate the maps based on the Mime DB */
function populateMaps(extensions, types) {
    var preference = ["nginx", "apache", undefined, "iana"];
    for (var _i = 0, _a = Object.keys(db); _i < _a.length; _i++) {
        var type = _a[_i];
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
            continue;
        }
        extensions.set(type, exts);
        for (var _b = 0, exts_1 = exts; _b < exts_1.length; _b++) {
            var ext = exts_1[_b];
            var current = types.get(ext);
            if (current) {
                var from = preference.indexOf(db[current].source);
                var to = preference.indexOf(mime.source);
                if (current !== "application/octet-stream" &&
                    (from > to ||
                        (from === to && current.substr(0, 12) === "application/"))) {
                    continue;
                }
            }
            types.set(ext, type);
        }
    }
}
// Populate the maps upon module load
populateMaps(extensions, types);
/** Given a media type return any default charset string.  Returns `undefined`
 * if not resolvable.
 */
export function charset(type) {
    var m = EXTRACT_TYPE_REGEXP.exec(type);
    if (!m) {
        return;
    }
    var match = m[0];
    var mime = db[match.toLowerCase()];
    if (mime && mime.charset) {
        return mime.charset;
    }
    if (TEXT_TYPE_REGEXP.test(match)) {
        return "UTF-8";
    }
}
/** Given an extension, lookup the appropriate media type for that extension.
 * Likely you should be using `contentType()` though instead.
 */
export function lookup(path) {
    var extension = extname("x." + path)
        .toLowerCase()
        .substr(1);
    return types.get(extension);
}
/** Given an extension or media type, return the full `Content-Type` header
 * string.  Returns `undefined` if not resolvable.
 */
export function contentType(str) {
    var mime = str.includes("/") ? str : lookup(str);
    if (!mime) {
        return;
    }
    if (!mime.includes("charset")) {
        var cs = charset(mime);
        if (cs) {
            mime += "; charset=" + cs.toLowerCase();
        }
    }
    return mime;
}
/** Given a media type, return the most appropriate extension or return
 * `undefined` if there is none.
 */
export function extension(type) {
    var match = EXTRACT_TYPE_REGEXP.exec(type);
    if (!match) {
        return;
    }
    var exts = extensions.get(match[1].toLowerCase());
    if (!exts || !exts.length) {
        return;
    }
    return exts[0];
}
//# sourceMappingURL=mod.js.map
