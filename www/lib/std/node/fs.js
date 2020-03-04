import { notImplemented, intoCallbackAPIWithIntercept } from "./_utils.js";
var denoReadFile = Deno.readFile, denoReadFileSync = Deno.readFileSync, denoReadlink = Deno.readlink, denoReadlinkSync = Deno.readlinkSync;
function getEncoding(optOrCallback) {
    if (!optOrCallback || typeof optOrCallback === "function") {
        return null;
    }
    else {
        if (optOrCallback.encoding) {
            if (optOrCallback.encoding === "utf8" ||
                optOrCallback.encoding === "utf-8") {
                return "utf8";
            }
            else if (optOrCallback.encoding === "buffer") {
                return "buffer";
            }
            else {
                notImplemented();
            }
        }
        return null;
    }
}
function maybeDecode(data, encoding) {
    if (encoding === "utf8") {
        return new TextDecoder().decode(data);
    }
    return data;
}
function maybeEncode(data, encoding) {
    if (encoding === "buffer") {
        return new TextEncoder().encode(data);
    }
    return data;
}
export function readFile(path, optOrCallback, callback) {
    var cb;
    if (typeof optOrCallback === "function") {
        cb = optOrCallback;
    }
    else {
        cb = callback;
    }
    var encoding = getEncoding(optOrCallback);
    intoCallbackAPIWithIntercept(denoReadFile, function (data) { return maybeDecode(data, encoding); }, cb, path);
}
export function readFileSync(path, opt) {
    return maybeDecode(denoReadFileSync(path), getEncoding(opt));
}
export function readlink(path, optOrCallback, callback) {
    var cb;
    if (typeof optOrCallback === "function") {
        cb = optOrCallback;
    }
    else {
        cb = callback;
    }
    var encoding = getEncoding(optOrCallback);
    intoCallbackAPIWithIntercept(denoReadlink, function (data) { return maybeEncode(data, encoding); }, cb, path);
}
export function readlinkSync(path, opt) {
    return maybeEncode(denoReadlinkSync(path), getEncoding(opt));
}
//# sourceMappingURL=fs.js.map
