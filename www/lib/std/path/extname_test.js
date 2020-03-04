// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
var test = Deno.test;
import { assertEquals } from "../testing/asserts.js";
import * as path from "./mod.js";
var slashRE = /\//g;
var pairs = [
    ["", ""],
    ["/path/to/file", ""],
    ["/path/to/file.ext", ".ext"],
    ["/path.to/file.ext", ".ext"],
    ["/path.to/file", ""],
    ["/path.to/.file", ""],
    ["/path.to/.file.ext", ".ext"],
    ["/path/to/f.ext", ".ext"],
    ["/path/to/..ext", ".ext"],
    ["/path/to/..", ""],
    ["file", ""],
    ["file.ext", ".ext"],
    [".file", ""],
    [".file.ext", ".ext"],
    ["/file", ""],
    ["/file.ext", ".ext"],
    ["/.file", ""],
    ["/.file.ext", ".ext"],
    [".path/file.ext", ".ext"],
    ["file.ext.ext", ".ext"],
    ["file.", "."],
    [".", ""],
    ["./", ""],
    [".file.ext", ".ext"],
    [".file", ""],
    [".file.", "."],
    [".file..", "."],
    ["..", ""],
    ["../", ""],
    ["..file.ext", ".ext"],
    ["..file", ".file"],
    ["..file.", "."],
    ["..file..", "."],
    ["...", "."],
    ["...ext", ".ext"],
    ["....", "."],
    ["file.ext/", ".ext"],
    ["file.ext//", ".ext"],
    ["file/", ""],
    ["file//", ""],
    ["file./", "."],
    ["file.//", "."]
];
test(function extname() {
    pairs.forEach(function (p) {
        var input = p[0];
        var expected = p[1];
        assertEquals(expected, path.posix.extname(input));
    });
    // On *nix, backslash is a valid name component like any other character.
    assertEquals(path.posix.extname(".\\"), "");
    assertEquals(path.posix.extname("..\\"), ".\\");
    assertEquals(path.posix.extname("file.ext\\"), ".ext\\");
    assertEquals(path.posix.extname("file.ext\\\\"), ".ext\\\\");
    assertEquals(path.posix.extname("file\\"), "");
    assertEquals(path.posix.extname("file\\\\"), "");
    assertEquals(path.posix.extname("file.\\"), ".\\");
    assertEquals(path.posix.extname("file.\\\\"), ".\\\\");
});
test(function extnameWin32() {
    pairs.forEach(function (p) {
        var input = p[0].replace(slashRE, "\\");
        var expected = p[1];
        assertEquals(expected, path.win32.extname(input));
        assertEquals(expected, path.win32.extname("C:" + input));
    });
    // On Windows, backslash is a path separator.
    assertEquals(path.win32.extname(".\\"), "");
    assertEquals(path.win32.extname("..\\"), "");
    assertEquals(path.win32.extname("file.ext\\"), ".ext");
    assertEquals(path.win32.extname("file.ext\\\\"), ".ext");
    assertEquals(path.win32.extname("file\\"), "");
    assertEquals(path.win32.extname("file\\\\"), "");
    assertEquals(path.win32.extname("file.\\"), ".");
    assertEquals(path.win32.extname("file.\\\\"), ".");
});
//# sourceMappingURL=extname_test.js.map
