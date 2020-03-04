// Ported from Go
// https://github.com/golang/go/blob/go1.12.5/src/encoding/hex/hex.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var hextable = new TextEncoder().encode("0123456789abcdef");
export function errInvalidByte(byte) {
    return new Error("encoding/hex: invalid byte: " +
        new TextDecoder().decode(new Uint8Array([byte])));
}
export function errLength() {
    return new Error("encoding/hex: odd length hex string");
}
// fromHexChar converts a hex character into its value and a success flag.
function fromHexChar(byte) {
    switch (true) {
        case 48 <= byte && byte <= 57: // '0' <= byte && byte <= '9'
            return [byte - 48, true];
        case 97 <= byte && byte <= 102: // 'a' <= byte && byte <= 'f'
            return [byte - 97 + 10, true];
        case 65 <= byte && byte <= 70: // 'A' <= byte && byte <= 'F'
            return [byte - 65 + 10, true];
    }
    return [0, false];
}
/**
 * EncodedLen returns the length of an encoding of n source bytes. Specifically,
 * it returns n * 2.
 * @param n
 */
export function encodedLen(n) {
    return n * 2;
}
/**
 * Encode encodes `src` into `encodedLen(src.length)` bytes of `dst`.
 * As a convenience, it returns the number of bytes written to `dst`
 * but this value is always `encodedLen(src.length)`.
 * Encode implements hexadecimal encoding.
 * @param dst
 * @param src
 */
export function encode(dst, src) {
    var srcLength = encodedLen(src.length);
    if (dst.length !== srcLength) {
        throw new Error("Out of index.");
    }
    for (var i = 0; i < src.length; i++) {
        var v = src[i];
        dst[i * 2] = hextable[v >> 4];
        dst[i * 2 + 1] = hextable[v & 0x0f];
    }
    return srcLength;
}
/**
 * EncodeToString returns the hexadecimal encoding of `src`.
 * @param src
 */
export function encodeToString(src) {
    var dest = new Uint8Array(encodedLen(src.length));
    encode(dest, src);
    return new TextDecoder().decode(dest);
}
/**
 * Decode decodes `src` into `decodedLen(src.length)` bytes
 * returning the actual number of bytes written to `dst`.
 * Decode expects that `src` contains only hexadecimal characters and that `src`
 * has even length.
 * If the input is malformed, Decode returns the number of bytes decoded before
 * the error.
 * @param dst
 * @param src
 */
export function decode(dst, src) {
    var i = 0;
    for (; i < Math.floor(src.length / 2); i++) {
        var _a = fromHexChar(src[i * 2]), a = _a[0], aOK = _a[1];
        if (!aOK) {
            return [i, errInvalidByte(src[i * 2])];
        }
        var _b = fromHexChar(src[i * 2 + 1]), b = _b[0], bOK = _b[1];
        if (!bOK) {
            return [i, errInvalidByte(src[i * 2 + 1])];
        }
        dst[i] = (a << 4) | b;
    }
    if (src.length % 2 == 1) {
        // Check for invalid char before reporting bad length,
        // since the invalid char (if present) is an earlier problem.
        var _c = fromHexChar(src[i * 2]), ok = _c[1];
        if (!ok) {
            return [i, errInvalidByte(src[i * 2])];
        }
        return [i, errLength()];
    }
    return [i, undefined];
}
/**
 * DecodedLen returns the length of a decoding of `x` source bytes.
 * Specifically, it returns `x / 2`.
 * @param x
 */
export function decodedLen(x) {
    return Math.floor(x / 2);
}
/**
 * DecodeString returns the bytes represented by the hexadecimal string `s`.
 * DecodeString expects that src contains only hexadecimal characters and that
 * src has even length.
 * If the input is malformed, DecodeString will throws an error.
 * @param s the `string` need to decode to `Uint8Array`
 */
export function decodeString(s) {
    var src = new TextEncoder().encode(s);
    // We can use the source slice itself as the destination
    // because the decode loop increments by one and then the 'seen' byte is not
    // used anymore.
    var _a = decode(src, src), n = _a[0], err = _a[1];
    if (err) {
        throw err;
    }
    return src.slice(0, n);
}
//# sourceMappingURL=hex.js.map
