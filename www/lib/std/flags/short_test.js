// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import { parse } from "./mod.js";
Deno.test(function numbericShortArgs() {
    assertEquals(parse(["-n123"]), { n: 123, _: [] });
    assertEquals(parse(["-123", "456"]), { 1: true, 2: true, 3: 456, _: [] });
});
Deno.test(function short() {
    assertEquals(parse(["-b"]), { b: true, _: [] });
    assertEquals(parse(["foo", "bar", "baz"]), { _: ["foo", "bar", "baz"] });
    assertEquals(parse(["-cats"]), { c: true, a: true, t: true, s: true, _: [] });
    assertEquals(parse(["-cats", "meow"]), {
        c: true,
        a: true,
        t: true,
        s: "meow",
        _: []
    });
    assertEquals(parse(["-h", "localhost"]), { h: "localhost", _: [] });
    assertEquals(parse(["-h", "localhost", "-p", "555"]), {
        h: "localhost",
        p: 555,
        _: []
    });
});
Deno.test(function mixedShortBoolAndCapture() {
    assertEquals(parse(["-h", "localhost", "-fp", "555", "script.js"]), {
        f: true,
        p: 555,
        h: "localhost",
        _: ["script.js"]
    });
});
Deno.test(function shortAndLong() {
    assertEquals(parse(["-h", "localhost", "-fp", "555", "script.js"]), {
        f: true,
        p: 555,
        h: "localhost",
        _: ["script.js"]
    });
});
//# sourceMappingURL=short_test.js.map
