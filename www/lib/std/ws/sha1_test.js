// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var test = Deno.test;
import { assertEquals } from "../testing/asserts.ts";
import { Sha1 } from "./sha1.ts";
test("[ws/sha] test1", function () {
    var sha1 = new Sha1();
    sha1.update("abcde");
    assertEquals(sha1.toString(), "03de6c570bfe24bfc328ccd7ca46b76eadaf4334");
});
test("[ws/sha] testWithArray", function () {
    var data = Uint8Array.of(0x61, 0x62, 0x63, 0x64, 0x65);
    var sha1 = new Sha1();
    sha1.update(data);
    assertEquals(sha1.toString(), "03de6c570bfe24bfc328ccd7ca46b76eadaf4334");
});
test("[ws/sha] testSha1WithBuffer", function () {
    var data = Uint8Array.of(0x61, 0x62, 0x63, 0x64, 0x65);
    var sha1 = new Sha1();
    sha1.update(data.buffer);
    assertEquals(sha1.toString(), "03de6c570bfe24bfc328ccd7ca46b76eadaf4334");
});
//# sourceMappingURL=sha1_test.js.map