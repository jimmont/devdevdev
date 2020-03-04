// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
/**
 * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
 * on npm.
 *
 * ```
 * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
 * console.log(bgBlue(red(bold("Hello world!"))));
 * ```
 *
 * This module supports `NO_COLOR` environmental variable disabling any coloring
 * if `NO_COLOR` is set.
 */
var noColor = Deno.noColor;
var enabled = !noColor;
export function setColorEnabled(value) {
    if (noColor) {
        return;
    }
    enabled = value;
}
export function getColorEnabled() {
    return enabled;
}
function code(open, close) {
    return {
        open: "\u001B[" + open + "m",
        close: "\u001B[" + close + "m",
        regexp: new RegExp("\\x1b\\[" + close + "m", "g")
    };
}
function run(str, code) {
    return enabled
        ? "" + code.open + str.replace(code.regexp, code.open) + code.close
        : str;
}
export function reset(str) {
    return run(str, code(0, 0));
}
export function bold(str) {
    return run(str, code(1, 22));
}
export function dim(str) {
    return run(str, code(2, 22));
}
export function italic(str) {
    return run(str, code(3, 23));
}
export function underline(str) {
    return run(str, code(4, 24));
}
export function inverse(str) {
    return run(str, code(7, 27));
}
export function hidden(str) {
    return run(str, code(8, 28));
}
export function strikethrough(str) {
    return run(str, code(9, 29));
}
export function black(str) {
    return run(str, code(30, 39));
}
export function red(str) {
    return run(str, code(31, 39));
}
export function green(str) {
    return run(str, code(32, 39));
}
export function yellow(str) {
    return run(str, code(33, 39));
}
export function blue(str) {
    return run(str, code(34, 39));
}
export function magenta(str) {
    return run(str, code(35, 39));
}
export function cyan(str) {
    return run(str, code(36, 39));
}
export function white(str) {
    return run(str, code(37, 39));
}
export function gray(str) {
    return run(str, code(90, 39));
}
export function bgBlack(str) {
    return run(str, code(40, 49));
}
export function bgRed(str) {
    return run(str, code(41, 49));
}
export function bgGreen(str) {
    return run(str, code(42, 49));
}
export function bgYellow(str) {
    return run(str, code(43, 49));
}
export function bgBlue(str) {
    return run(str, code(44, 49));
}
export function bgMagenta(str) {
    return run(str, code(45, 49));
}
export function bgCyan(str) {
    return run(str, code(46, 49));
}
export function bgWhite(str) {
    return run(str, code(47, 49));
}
//# sourceMappingURL=colors.js.map