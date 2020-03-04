// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import { parse } from "./mod.js";
Deno.test(function dottedAlias() {
    var argv = parse(["--a.b", "22"], {
        "default": { "a.b": 11 },
        alias: { "a.b": "aa.bb" }
    });
    assertEquals(argv.a.b, 22);
    assertEquals(argv.aa.bb, 22);
});
Deno.test(function dottedDefault() {
    var argv = parse([], { "default": { "a.b": 11 }, alias: { "a.b": "aa.bb" } });
    assertEquals(argv.a.b, 11);
    assertEquals(argv.aa.bb, 11);
});
Deno.test(function dottedDefaultWithNoAlias() {
    var argv = parse([], { "default": { "a.b": 11 } });
    assertEquals(argv.a.b, 11);
});
//# sourceMappingURL=dotted_test.js.map
