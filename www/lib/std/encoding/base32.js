// Modified from https://github.com/beatgammit/base64-js
// Copyright (c) 2014 Jameson Little. MIT License.
var lookup = [];
var revLookup = [];
// RFC4648 base32
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
var placeHolderPadLookup = [0, 1, , 2, 3, , 4];
function _getPadLen(placeHoldersLen) {
    var maybeLen = placeHolderPadLookup[placeHoldersLen];
    if (typeof maybeLen !== "number") {
        throw new Error("Invalid pad length");
    }
    return maybeLen;
}
function getLens(b32) {
    var len = b32.length;
    if (len % 8 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 8");
    }
    var validLen = b32.indexOf("=");
    if (validLen === -1)
        validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 8 - (validLen % 8);
    return [validLen, placeHoldersLen];
}
/**
 * Returns number of bytes encoded in the given RFC4648 base32 string input.
 * @param b32
 */
export function byteLength(b32) {
    var _a = getLens(b32), validLen = _a[0], placeHoldersLen = _a[1];
    return _byteLength(validLen, placeHoldersLen);
}
function _byteLength(validLen, placeHoldersLen) {
    return ((validLen + placeHoldersLen) * 5) / 8 - _getPadLen(placeHoldersLen);
}
/**
 * Decodes a given RFC4648 base32 encoded string.
 * @param b32
 */
export function decode(b32) {
    var tmp;
    var _a = getLens(b32), validLen = _a[0], placeHoldersLen = _a[1];
    var arr = new Uint8Array(_byteLength(validLen, placeHoldersLen));
    var curByte = 0;
    // if there are placeholders, only get up to the last complete 8 chars
    var len = placeHoldersLen > 0 ? validLen - 8 : validLen;
    var i;
    for (i = 0; i < len; i += 8) {
        tmp =
            (revLookup[b32.charCodeAt(i)] << 20) |
                (revLookup[b32.charCodeAt(i + 1)] << 15) |
                (revLookup[b32.charCodeAt(i + 2)] << 10) |
                (revLookup[b32.charCodeAt(i + 3)] << 5) |
                revLookup[b32.charCodeAt(i + 4)];
        arr[curByte++] = (tmp >> 17) & 0xff;
        arr[curByte++] = (tmp >> 9) & 0xff;
        arr[curByte++] = (tmp >> 1) & 0xff;
        tmp =
            ((tmp & 1) << 15) |
                (revLookup[b32.charCodeAt(i + 5)] << 10) |
                (revLookup[b32.charCodeAt(i + 6)] << 5) |
                revLookup[b32.charCodeAt(i + 7)];
        arr[curByte++] = (tmp >> 8) & 0xff;
        arr[curByte++] = tmp & 0xff;
    }
    if (placeHoldersLen === 1) {
        tmp =
            (revLookup[b32.charCodeAt(i)] << 20) |
                (revLookup[b32.charCodeAt(i + 1)] << 15) |
                (revLookup[b32.charCodeAt(i + 2)] << 10) |
                (revLookup[b32.charCodeAt(i + 3)] << 5) |
                revLookup[b32.charCodeAt(i + 4)];
        arr[curByte++] = (tmp >> 17) & 0xff;
        arr[curByte++] = (tmp >> 9) & 0xff;
        arr[curByte++] = (tmp >> 1) & 0xff;
        tmp =
            ((tmp & 1) << 7) |
                (revLookup[b32.charCodeAt(i + 5)] << 2) |
                (revLookup[b32.charCodeAt(i + 6)] >> 3);
        arr[curByte++] = tmp & 0xff;
    }
    else if (placeHoldersLen === 3) {
        tmp =
            (revLookup[b32.charCodeAt(i)] << 19) |
                (revLookup[b32.charCodeAt(i + 1)] << 14) |
                (revLookup[b32.charCodeAt(i + 2)] << 9) |
                (revLookup[b32.charCodeAt(i + 3)] << 4) |
                (revLookup[b32.charCodeAt(i + 4)] >> 1);
        arr[curByte++] = (tmp >> 16) & 0xff;
        arr[curByte++] = (tmp >> 8) & 0xff;
        arr[curByte++] = tmp & 0xff;
    }
    else if (placeHoldersLen === 4) {
        tmp =
            (revLookup[b32.charCodeAt(i)] << 11) |
                (revLookup[b32.charCodeAt(i + 1)] << 6) |
                (revLookup[b32.charCodeAt(i + 2)] << 1) |
                (revLookup[b32.charCodeAt(i + 3)] >> 4);
        arr[curByte++] = (tmp >> 8) & 0xff;
        arr[curByte++] = tmp & 0xff;
    }
    else if (placeHoldersLen === 6) {
        tmp =
            (revLookup[b32.charCodeAt(i)] << 3) |
                (revLookup[b32.charCodeAt(i + 1)] >> 2);
        arr[curByte++] = tmp & 0xff;
    }
    return arr;
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for (var i = start; i < end; i += 5) {
        tmp =
            ((uint8[i] << 16) & 0xff0000) |
                ((uint8[i + 1] << 8) & 0xff00) |
                (uint8[i + 2] & 0xff);
        output.push(lookup[(tmp >> 19) & 0x1f]);
        output.push(lookup[(tmp >> 14) & 0x1f]);
        output.push(lookup[(tmp >> 9) & 0x1f]);
        output.push(lookup[(tmp >> 4) & 0x1f]);
        tmp =
            ((tmp & 0xf) << 16) |
                ((uint8[i + 3] << 8) & 0xff00) |
                (uint8[i + 4] & 0xff);
        output.push(lookup[(tmp >> 15) & 0x1f]);
        output.push(lookup[(tmp >> 10) & 0x1f]);
        output.push(lookup[(tmp >> 5) & 0x1f]);
        output.push(lookup[tmp & 0x1f]);
    }
    return output.join("");
}
/**
 * Encodes a given Uint8Array into RFC4648 base32 representation
 * @param uint8
 */
export function encode(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 5;
    var parts = [];
    var maxChunkLength = 16385; // must be multiple of 5
    var len2 = len - extraBytes;
    // go through the array every 5 bytes, we'll deal with trailing stuff later
    for (var i = 0; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    }
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 4) {
        tmp =
            ((uint8[len2] & 0xff) << 16) |
                ((uint8[len2 + 1] & 0xff) << 8) |
                (uint8[len2 + 2] & 0xff);
        parts.push(lookup[(tmp >> 19) & 0x1f]);
        parts.push(lookup[(tmp >> 14) & 0x1f]);
        parts.push(lookup[(tmp >> 9) & 0x1f]);
        parts.push(lookup[(tmp >> 4) & 0x1f]);
        tmp = ((tmp & 0xf) << 11) | (uint8[len2 + 3] << 3);
        parts.push(lookup[(tmp >> 10) & 0x1f]);
        parts.push(lookup[(tmp >> 5) & 0x1f]);
        parts.push(lookup[tmp & 0x1f]);
        parts.push("=");
    }
    else if (extraBytes === 3) {
        tmp =
            ((uint8[len2] & 0xff) << 17) |
                ((uint8[len2 + 1] & 0xff) << 9) |
                ((uint8[len2 + 2] & 0xff) << 1);
        parts.push(lookup[(tmp >> 20) & 0x1f]);
        parts.push(lookup[(tmp >> 15) & 0x1f]);
        parts.push(lookup[(tmp >> 10) & 0x1f]);
        parts.push(lookup[(tmp >> 5) & 0x1f]);
        parts.push(lookup[tmp & 0x1f]);
        parts.push("===");
    }
    else if (extraBytes === 2) {
        tmp = ((uint8[len2] & 0xff) << 12) | ((uint8[len2 + 1] & 0xff) << 4);
        parts.push(lookup[(tmp >> 15) & 0x1f]);
        parts.push(lookup[(tmp >> 10) & 0x1f]);
        parts.push(lookup[(tmp >> 5) & 0x1f]);
        parts.push(lookup[tmp & 0x1f]);
        parts.push("====");
    }
    else if (extraBytes === 1) {
        tmp = (uint8[len2] & 0xff) << 2;
        parts.push(lookup[(tmp >> 5) & 0x1f]);
        parts.push(lookup[tmp & 0x1f]);
        parts.push("======");
    }
    return parts.join("");
}
//# sourceMappingURL=base32.js.map