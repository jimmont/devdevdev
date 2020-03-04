// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var UUID_RE = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", "i");
export function validate(id) {
    return UUID_RE.test(id);
}
export function generate() {
    var rnds = crypto.getRandomValues(new Uint8Array(16));
    rnds[6] = (rnds[6] & 0x0f) | 0x40; // Version 4
    rnds[8] = (rnds[8] & 0x3f) | 0x80; // Variant 10
    var bits = __spreadArrays(rnds).map(function (bit) {
        var s = bit.toString(16);
        return bit < 0x10 ? "0" + s : s;
    });
    return __spreadArrays(bits.slice(0, 4), [
        "-"
    ], bits.slice(4, 6), [
        "-"
    ], bits.slice(6, 8), [
        "-"
    ], bits.slice(8, 10), [
        "-"
    ], bits.slice(10)).join("");
}
//# sourceMappingURL=v4.js.map
