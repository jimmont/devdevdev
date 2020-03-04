// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import { parse } from "./mod.js";
Deno.test(function booleanDefaultTrue() {
    var argv = parse([], {
        boolean: "sometrue",
        "default": { sometrue: true }
    });
    assertEquals(argv.sometrue, true);
});
Deno.test(function booleanDefaultFalse() {
    var argv = parse([], {
        boolean: "somefalse",
        "default": { somefalse: false }
    });
    assertEquals(argv.somefalse, false);
});
Deno.test(function booleanDefaultNull() {
    var argv = parse([], {
        boolean: "maybe",
        "default": { maybe: null }
    });
    assertEquals(argv.maybe, null);
    var argv2 = parse(["--maybe"], {
        boolean: "maybe",
        "default": { maybe: null }
    });
    assertEquals(argv2.maybe, true);
});
//# sourceMappingURL=default_bool_test.js.map
