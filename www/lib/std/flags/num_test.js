// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import { parse } from "./mod.js";
Deno.test(function nums() {
    var argv = parse([
        "-x",
        "1234",
        "-y",
        "5.67",
        "-z",
        "1e7",
        "-w",
        "10f",
        "--hex",
        "0xdeadbeef",
        "789"
    ]);
    assertEquals(argv, {
        x: 1234,
        y: 5.67,
        z: 1e7,
        w: "10f",
        hex: 0xdeadbeef,
        _: [789]
    });
    assertEquals(typeof argv.x, "number");
    assertEquals(typeof argv.y, "number");
    assertEquals(typeof argv.z, "number");
    assertEquals(typeof argv.w, "string");
    assertEquals(typeof argv.hex, "number");
    assertEquals(typeof argv._[0], "number");
});
Deno.test(function alreadyNumber() {
    var argv = parse(["-x", 1234, 789]);
    assertEquals(argv, { x: 1234, _: [789] });
    assertEquals(typeof argv.x, "number");
    assertEquals(typeof argv._[0], "number");
});
//# sourceMappingURL=num_test.js.map
