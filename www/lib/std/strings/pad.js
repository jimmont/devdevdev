// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/**
 * Pad helper for strings.
 * Input string is processed to output a string with a minimal length.
 * If the parameter `strict` is set to true, the output string length
 * is equal to the `strLen` parameter.
 * Example:
 *
 *     pad("deno", 6, { char: "*", side: "left" }) // output : "**deno"
 *     pad("deno", 6, { char: "*", side: "right"}) // output : "deno**"
 *     pad("denosorusrex", 6 {
 *       char: "*",
 *       side: "left",
 *       strict: true,
 *       strictSide: "right",
 *       strictChar: "..."
 *     }) // output : "den..."
 *
 * @param input Input string
 * @param strLen Output string lenght
 * @param opts Configuration object
 * @param [opts.char=" "] Character used to fill in
 * @param [opts.side="left"] Side to fill in
 * @param [opts.strict=false] Flag to truncate the string if length > strLen
 * @param [opts.strictChar=""] Character to add if string is truncated
 * @param [opts.strictSide="right"] Side to truncate
 */
export function pad(input, strLen, opts) {
    if (opts === void 0) { opts = {
        char: " ",
        strict: false,
        side: "left",
        strictChar: "",
        strictSide: "right"
    }; }
    var out = input;
    var outL = out.length;
    if (outL < strLen) {
        if (!opts.side || opts.side === "left") {
            out = out.padStart(strLen, opts.char);
        }
        else {
            out = out.padEnd(strLen, opts.char);
        }
    }
    else if (opts.strict && outL > strLen) {
        var addChar = opts.strictChar ? opts.strictChar : "";
        if (opts.strictSide === "left") {
            var toDrop = outL - strLen;
            if (opts.strictChar) {
                toDrop += opts.strictChar.length;
            }
            out = "" + addChar + out.slice(toDrop, outL);
        }
        else {
            out = "" + out.substring(0, strLen - addChar.length) + addChar;
        }
    }
    return out;
}
//# sourceMappingURL=pad.js.map