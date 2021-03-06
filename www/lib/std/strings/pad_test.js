var test = Deno.test;
import { assertEquals } from "../testing/asserts.js";
import { pad } from "./pad.js";
test(function padTest() {
    var expected1 = "**deno";
    var expected2 = "deno";
    var expected3 = "deno**";
    var expected4 = "denosorusrex";
    var expected5 = "denosorus";
    var expected6 = "sorusrex";
    var expected7 = "den...";
    var expected8 = "...rex";
    assertEquals(pad("deno", 6, { char: "*", side: "left" }), expected1);
    assertEquals(pad("deno", 4, { char: "*", side: "left" }), expected2);
    assertEquals(pad("deno", 6, { char: "*", side: "right" }), expected3);
    assertEquals(pad("denosorusrex", 4, {
        char: "*",
        side: "right",
        strict: false
    }), expected4);
    assertEquals(pad("denosorusrex", 9, {
        char: "*",
        side: "left",
        strict: true,
        strictSide: "right"
    }), expected5);
    assertEquals(pad("denosorusrex", 8, {
        char: "*",
        side: "left",
        strict: true,
        strictSide: "left"
    }), expected6);
    assertEquals(pad("denosorusrex", 6, {
        char: "*",
        side: "left",
        strict: true,
        strictSide: "right",
        strictChar: "..."
    }), expected7);
    assertEquals(pad("denosorusrex", 6, {
        char: "*",
        side: "left",
        strict: true,
        strictSide: "left",
        strictChar: "..."
    }), expected8);
    assertEquals(pad("deno", 4, {
        char: "*",
        side: "left",
        strict: true,
        strictSide: "right",
        strictChar: "..."
    }), expected2);
});
//# sourceMappingURL=pad_test.js.map
