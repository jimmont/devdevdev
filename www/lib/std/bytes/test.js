// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { findIndex, findLastIndex, equal, hasPrefix, repeat } from "./mod.js";
import { assertEquals, assertThrows } from "../testing/asserts.js";
Deno.test(function bytesfindIndex1() {
    var i = findIndex(new Uint8Array([1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 3]), new Uint8Array([0, 1, 2]));
    assertEquals(i, 2);
});
Deno.test(function bytesfindIndex2() {
    var i = findIndex(new Uint8Array([0, 0, 1]), new Uint8Array([0, 1]));
    assertEquals(i, 1);
});
Deno.test(function bytesfindLastIndex1() {
    var i = findLastIndex(new Uint8Array([0, 1, 2, 0, 1, 2, 0, 1, 3]), new Uint8Array([0, 1, 2]));
    assertEquals(i, 3);
});
Deno.test(function bytesfindLastIndex2() {
    var i = findLastIndex(new Uint8Array([0, 1, 1]), new Uint8Array([0, 1]));
    assertEquals(i, 0);
});
Deno.test(function bytesBytesequal() {
    var v = equal(new Uint8Array([0, 1, 2, 3]), new Uint8Array([0, 1, 2, 3]));
    assertEquals(v, true);
});
Deno.test(function byteshasPrefix() {
    var v = hasPrefix(new Uint8Array([0, 1, 2]), new Uint8Array([0, 1]));
    assertEquals(v, true);
});
Deno.test(function bytesrepeat() {
    // input / output / count / error message
    var repeatTestCase = [
        ["", "", 0],
        ["", "", 1],
        ["", "", 1.1, "bytes: repeat count must be an integer"],
        ["", "", 2],
        ["", "", 0],
        ["-", "", 0],
        ["-", "-", -1, "bytes: negative repeat count"],
        ["-", "----------", 10],
        ["abc ", "abc abc abc ", 3]
    ];
    var _loop_1 = function (input, output, count, errMsg) {
        if (errMsg) {
            assertThrows(function () {
                repeat(new TextEncoder().encode(input), count);
            }, Error, errMsg);
        }
        else {
            var newBytes = repeat(new TextEncoder().encode(input), count);
            assertEquals(new TextDecoder().decode(newBytes), output);
        }
    };
    for (var _i = 0, repeatTestCase_1 = repeatTestCase; _i < repeatTestCase_1.length; _i++) {
        var _a = repeatTestCase_1[_i], input = _a[0], output = _a[1], count = _a[2], errMsg = _a[3];
        _loop_1(input, output, count, errMsg);
    }
});
//# sourceMappingURL=test.js.map
