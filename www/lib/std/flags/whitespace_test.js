// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import { parse } from "./mod.js";
Deno.test(function whitespaceShouldBeWhitespace() {
    assertEquals(parse(["-x", "\t"]).x, "\t");
});
//# sourceMappingURL=whitespace_test.js.map
