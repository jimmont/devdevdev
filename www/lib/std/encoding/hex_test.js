// Ported from Go
// https://github.com/golang/go/blob/go1.12.5/src/encoding/hex/hex.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals, assertThrows } from "../testing/asserts.ts";
import { encodedLen, encode, encodeToString, decodedLen, decode, decodeString, errLength, errInvalidByte } from "./hex.ts";
function toByte(s) {
    return new TextEncoder().encode(s)[0];
}
var testCases = [
    // encoded(hex) / decoded(Uint8Array)
    ["", []],
    ["0001020304050607", [0, 1, 2, 3, 4, 5, 6, 7]],
    ["08090a0b0c0d0e0f", [8, 9, 10, 11, 12, 13, 14, 15]],
    ["f0f1f2f3f4f5f6f7", [0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7]],
    ["f8f9fafbfcfdfeff", [0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff]],
    ["67", Array.from(new TextEncoder().encode("g"))],
    ["e3a1", [0xe3, 0xa1]]
];
var errCases = [
    // encoded(hex) / error
    ["", "", undefined],
    ["0", "", errLength()],
    ["zd4aa", "", errInvalidByte(toByte("z"))],
    ["d4aaz", "\xd4\xaa", errInvalidByte(toByte("z"))],
    ["30313", "01", errLength()],
    ["0g", "", errInvalidByte(new TextEncoder().encode("g")[0])],
    ["00gg", "\x00", errInvalidByte(new TextEncoder().encode("g")[0])],
    ["0\x01", "", errInvalidByte(new TextEncoder().encode("\x01")[0])],
    ["ffeed", "\xff\xee", errLength()]
];
Deno.test({
    name: "[encoding.hex] encodedLen",
    fn: function () {
        assertEquals(encodedLen(0), 0);
        assertEquals(encodedLen(1), 2);
        assertEquals(encodedLen(2), 4);
        assertEquals(encodedLen(3), 6);
        assertEquals(encodedLen(4), 8);
    }
});
Deno.test({
    name: "[encoding.hex] encode",
    fn: function () {
        {
            var srcStr = "abc";
            var src = new TextEncoder().encode(srcStr);
            var dest = new Uint8Array(encodedLen(src.length));
            var int = encode(dest, src);
            assertEquals(src, new Uint8Array([97, 98, 99]));
            assertEquals(int, 6);
        }
        {
            var srcStr = "abc";
            var src_1 = new TextEncoder().encode(srcStr);
            var dest_1 = new Uint8Array(2); // out of index
            assertThrows(function () {
                encode(dest_1, src_1);
            }, Error, "Out of index.");
        }
        for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
            var _a = testCases_1[_i], enc = _a[0], dec = _a[1];
            var dest = new Uint8Array(encodedLen(dec.length));
            var src = new Uint8Array(dec);
            var n = encode(dest, src);
            assertEquals(dest.length, n);
            assertEquals(new TextDecoder().decode(dest), enc);
        }
    }
});
Deno.test({
    name: "[encoding.hex] encodeToString",
    fn: function () {
        for (var _i = 0, testCases_2 = testCases; _i < testCases_2.length; _i++) {
            var _a = testCases_2[_i], enc = _a[0], dec = _a[1];
            assertEquals(encodeToString(new Uint8Array(dec)), enc);
        }
    }
});
Deno.test({
    name: "[encoding.hex] decodedLen",
    fn: function () {
        assertEquals(decodedLen(0), 0);
        assertEquals(decodedLen(2), 1);
        assertEquals(decodedLen(4), 2);
        assertEquals(decodedLen(6), 3);
        assertEquals(decodedLen(8), 4);
    }
});
Deno.test({
    name: "[encoding.hex] decode",
    fn: function () {
        // Case for decoding uppercase hex characters, since
        // Encode always uses lowercase.
        var extraTestcase = [
            ["F8F9FAFBFCFDFEFF", [0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff]]
        ];
        var cases = testCases.concat(extraTestcase);
        for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
            var _a = cases_1[_i], enc = _a[0], dec = _a[1];
            var dest = new Uint8Array(decodedLen(enc.length));
            var src = new TextEncoder().encode(enc);
            var _b = decode(dest, src), err = _b[1];
            assertEquals(err, undefined);
            assertEquals(Array.from(dest), Array.from(dec));
        }
    }
});
Deno.test({
    name: "[encoding.hex] decodeString",
    fn: function () {
        for (var _i = 0, testCases_3 = testCases; _i < testCases_3.length; _i++) {
            var _a = testCases_3[_i], enc = _a[0], dec = _a[1];
            var dst = decodeString(enc);
            assertEquals(dec, Array.from(dst));
        }
    }
});
Deno.test({
    name: "[encoding.hex] decode error",
    fn: function () {
        for (var _i = 0, errCases_1 = errCases; _i < errCases_1.length; _i++) {
            var _a = errCases_1[_i], input = _a[0], output = _a[1], expectedErr = _a[2];
            var out = new Uint8Array(input.length + 10);
            var _b = decode(out, new TextEncoder().encode(input)), n = _b[0], err = _b[1];
            assertEquals(new TextDecoder("ascii").decode(out.slice(0, n)), output);
            assertEquals(err, expectedErr);
        }
    }
});
Deno.test({
    name: "[encoding.hex] decodeString error",
    fn: function () {
        var _loop_1 = function (input, output, expectedErr) {
            if (expectedErr) {
                assertThrows(function () {
                    decodeString(input);
                }, Error, expectedErr.message);
            }
            else {
                var out = decodeString(input);
                assertEquals(new TextDecoder("ascii").decode(out), output);
            }
        };
        for (var _i = 0, errCases_2 = errCases; _i < errCases_2.length; _i++) {
            var _a = errCases_2[_i], input = _a[0], output = _a[1], expectedErr = _a[2];
            _loop_1(input, output, expectedErr);
        }
    }
});
//# sourceMappingURL=hex_test.js.map