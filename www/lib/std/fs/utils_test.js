// Copyright the Browserify authors. MIT License.
import { assertEquals } from "../testing/asserts.ts";
import * as path from "../path/mod.ts";
import { isSubdir, getFileInfoType } from "./utils.ts";
import { ensureFileSync } from "./ensure_file.ts";
import { ensureDirSync } from "./ensure_dir.ts";
var testdataDir = path.resolve("fs", "testdata");
Deno.test(function _isSubdir() {
    var pairs = [
        ["", "", false, path.posix.sep],
        ["/first/second", "/first", false, path.posix.sep],
        ["/first", "/first", false, path.posix.sep],
        ["/first", "/first/second", true, path.posix.sep],
        ["first", "first/second", true, path.posix.sep],
        ["../first", "../first/second", true, path.posix.sep],
        ["c:\\first", "c:\\first", false, path.win32.sep],
        ["c:\\first", "c:\\first\\second", true, path.win32.sep]
    ];
    pairs.forEach(function (p) {
        var src = p[0];
        var dest = p[1];
        var expected = p[2];
        var sep = p[3];
        assertEquals(isSubdir(src, dest, sep), expected, "'" + src + "' should " + (expected ? "" : "not") + " be parent dir of '" + dest + "'");
    });
});
Deno.test(function _getFileInfoType() {
    var pairs = [
        [path.join(testdataDir, "file_type_1"), "file"],
        [path.join(testdataDir, "file_type_dir_1"), "dir"]
    ];
    pairs.forEach(function (p) {
        var filePath = p[0];
        var type = p[1];
        switch (type) {
            case "file":
                ensureFileSync(filePath);
                break;
            case "dir":
                ensureDirSync(filePath);
                break;
            case "symlink":
                // TODO(axetroy): test symlink
                break;
        }
        var stat = Deno.statSync(filePath);
        Deno.removeSync(filePath, { recursive: true });
        assertEquals(getFileInfoType(stat), type);
    });
});
//# sourceMappingURL=utils_test.js.map