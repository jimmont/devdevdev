// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
var test = Deno.test;
import { assertEquals } from "../testing/asserts.js";
import * as path from "./mod.js";
test(function isAbsolute() {
    assertEquals(path.posix.isAbsolute("/home/foo"), true);
    assertEquals(path.posix.isAbsolute("/home/foo/.."), true);
    assertEquals(path.posix.isAbsolute("bar/"), false);
    assertEquals(path.posix.isAbsolute("./baz"), false);
});
test(function isAbsoluteWin32() {
    assertEquals(path.win32.isAbsolute("/"), true);
    assertEquals(path.win32.isAbsolute("//"), true);
    assertEquals(path.win32.isAbsolute("//server"), true);
    assertEquals(path.win32.isAbsolute("//server/file"), true);
    assertEquals(path.win32.isAbsolute("\\\\server\\file"), true);
    assertEquals(path.win32.isAbsolute("\\\\server"), true);
    assertEquals(path.win32.isAbsolute("\\\\"), true);
    assertEquals(path.win32.isAbsolute("c"), false);
    assertEquals(path.win32.isAbsolute("c:"), false);
    assertEquals(path.win32.isAbsolute("c:\\"), true);
    assertEquals(path.win32.isAbsolute("c:/"), true);
    assertEquals(path.win32.isAbsolute("c://"), true);
    assertEquals(path.win32.isAbsolute("C:/Users/"), true);
    assertEquals(path.win32.isAbsolute("C:\\Users\\"), true);
    assertEquals(path.win32.isAbsolute("C:cwd/another"), false);
    assertEquals(path.win32.isAbsolute("C:cwd\\another"), false);
    assertEquals(path.win32.isAbsolute("directory/directory"), false);
    assertEquals(path.win32.isAbsolute("directory\\directory"), false);
});
//# sourceMappingURL=isabsolute_test.js.map
