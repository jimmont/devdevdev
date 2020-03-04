import * as path from "../path/mod.ts";
/**
 * Test whether or not `dest` is a sub-directory of `src`
 * @param src src file path
 * @param dest dest file path
 * @param sep path separator
 */
export function isSubdir(src, dest, sep) {
    if (sep === void 0) { sep = path.sep; }
    if (src === dest) {
        return false;
    }
    var srcArray = src.split(sep);
    var destArray = dest.split(sep);
    // see: https://github.com/Microsoft/TypeScript/issues/30821
    return srcArray.reduce(
    // @ts-ignore
    function (acc, current, i) {
        return acc && destArray[i] === current;
    }, true);
}
/**
 * Get a human readable file type string.
 *
 * @param fileInfo A FileInfo describes a file and is returned by `stat`,
 *                 `lstat`
 */
export function getFileInfoType(fileInfo) {
    return fileInfo.isFile()
        ? "file"
        : fileInfo.isDirectory()
            ? "dir"
            : fileInfo.isSymlink()
                ? "symlink"
                : undefined;
}
//# sourceMappingURL=utils.js.map