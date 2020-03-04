var test = Deno.test;
import { assertEquals, assert } from "../testing/asserts.js";
import { createRequire } from "./module.js";
// TS compiler would try to resolve if function named "require"
// Thus suffixing it with require_ to fix this...
var require_ = createRequire(import.meta.url);
test(function requireSuccess() {
    // Relative to import.meta.url
    var result = require_("./tests/cjs/cjs_a.js");
    assert("helloA" in result);
    assert("helloB" in result);
    assert("C" in result);
    assert("leftPad" in result);
    assertEquals(result.helloA(), "A");
    assertEquals(result.helloB(), "B");
    assertEquals(result.C, "C");
    assertEquals(result.leftPad("pad", 4), " pad");
});
test(function requireCycle() {
    var resultA = require_("./tests/cjs/cjs_cycle_a");
    var resultB = require_("./tests/cjs/cjs_cycle_b");
    assert(resultA);
    assert(resultB);
});
test(function requireBuiltin() {
    var fs = require_("fs");
    assert("readFileSync" in fs);
    var _a = require_("./tests/cjs/cjs_builtin"), readFileSync = _a.readFileSync, isNull = _a.isNull, extname = _a.extname;
    assertEquals(readFileSync("./node/testdata/hello.txt", { encoding: "utf8" }), "hello world");
    assert(isNull(null));
    assertEquals(extname("index.html"), ".html");
});
test(function requireIndexJS() {
    var isIndex = require_("./tests/cjs").isIndex;
    assert(isIndex);
});
test(function requireNodeOs() {
    var os = require_("os");
    assert(os.arch);
    assert(typeof os.arch() == "string");
});
//# sourceMappingURL=module_test.js.map
