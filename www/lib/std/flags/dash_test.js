// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import { parse } from "./mod.js";
Deno.test(function hyphen() {
    assertEquals(parse(["-n", "-"]), { n: "-", _: [] });
    assertEquals(parse(["-"]), { _: ["-"] });
    assertEquals(parse(["-f-"]), { f: "-", _: [] });
    assertEquals(parse(["-b", "-"], { boolean: "b" }), { b: true, _: ["-"] });
    assertEquals(parse(["-s", "-"], { string: "s" }), { s: "-", _: [] });
});
Deno.test(function doubleDash() {
    assertEquals(parse(["-a", "--", "b"]), { a: true, _: ["b"] });
    assertEquals(parse(["--a", "--", "b"]), { a: true, _: ["b"] });
    assertEquals(parse(["--a", "--", "b"]), { a: true, _: ["b"] });
});
Deno.test(function moveArgsAfterDoubleDashIntoOwnArray() {
    assertEquals(parse(["--name", "John", "before", "--", "after"], { "--": true }), {
        name: "John",
        _: ["before"],
        "--": ["after"]
    });
});
//# sourceMappingURL=dash_test.js.map
