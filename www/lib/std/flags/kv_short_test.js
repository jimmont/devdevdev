// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import { parse } from "./mod.js";
Deno.test(function short() {
    var argv = parse(["-b=123"]);
    assertEquals(argv, { b: 123, _: [] });
});
Deno.test(function multiShort() {
    var argv = parse(["-a=whatever", "-b=robots"]);
    assertEquals(argv, { a: "whatever", b: "robots", _: [] });
});
//# sourceMappingURL=kv_short_test.js.map
