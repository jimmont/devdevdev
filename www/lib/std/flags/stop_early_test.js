// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import { parse } from "./mod.js";
// stops parsing on the first non-option when stopEarly is set
Deno.test(function stopParsing() {
    var argv = parse(["--aaa", "bbb", "ccc", "--ddd"], {
        stopEarly: true
    });
    assertEquals(argv, {
        aaa: "bbb",
        _: ["ccc", "--ddd"]
    });
});
//# sourceMappingURL=stop_early_test.js.map
