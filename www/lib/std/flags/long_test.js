// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import { parse } from "./mod.js";
Deno.test(function longOpts() {
    assertEquals(parse(["--bool"]), { bool: true, _: [] });
    assertEquals(parse(["--pow", "xixxle"]), { pow: "xixxle", _: [] });
    assertEquals(parse(["--pow=xixxle"]), { pow: "xixxle", _: [] });
    assertEquals(parse(["--host", "localhost", "--port", "555"]), {
        host: "localhost",
        port: 555,
        _: []
    });
    assertEquals(parse(["--host=localhost", "--port=555"]), {
        host: "localhost",
        port: 555,
        _: []
    });
});
//# sourceMappingURL=long_test.js.map
