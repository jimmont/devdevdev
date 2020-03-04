// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/** EndOfLine character enum */
export var EOL;
(function (EOL) {
    EOL["LF"] = "\n";
    EOL["CRLF"] = "\r\n";
})(EOL || (EOL = {}));
var regDetect = /(?:\r?\n)/g;
/**
 * Detect the EOL character for string input.
 * returns null if no newline
 */
export function detect(content) {
    var d = content.match(regDetect);
    if (!d || d.length === 0) {
        return null;
    }
    var crlf = d.filter(function (x) { return x === EOL.CRLF; });
    if (crlf.length > 0) {
        return EOL.CRLF;
    }
    else {
        return EOL.LF;
    }
}
/** Format the file to the targeted EOL */
export function format(content, eol) {
    return content.replace(regDetect, eol);
}
//# sourceMappingURL=eol.js.map
