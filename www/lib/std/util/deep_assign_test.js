// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var test = Deno.test;
import { assertEquals, assert } from "../testing/asserts.js";
import { deepAssign } from "./deep_assign.js";
test(function deepAssignTest() {
    var date = new Date("1979-05-27T07:32:00Z");
    var reg = RegExp(/DENOWOWO/);
    var obj1 = { deno: { bar: { deno: ["is", "not", "node"] } } };
    var obj2 = { foo: { deno: date } };
    var obj3 = { foo: { bar: "deno" }, reg: reg };
    var actual = deepAssign(obj1, obj2, obj3);
    var expected = {
        foo: {
            deno: new Date("1979-05-27T07:32:00Z"),
            bar: "deno"
        },
        deno: { bar: { deno: ["is", "not", "node"] } },
        reg: RegExp(/DENOWOWO/)
    };
    assert(date !== expected.foo.deno);
    assert(reg !== expected.reg);
    assertEquals(actual, expected);
});
//# sourceMappingURL=deep_assign_test.js.map
