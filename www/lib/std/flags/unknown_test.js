// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.ts";
import { parse } from "./mod.ts";
Deno.test(function booleanAndAliasIsNotUnknown() {
    var unknown = [];
    function unknownFn(arg) {
        unknown.push(arg);
        return false;
    }
    var aliased = ["-h", "true", "--derp", "true"];
    var regular = ["--herp", "true", "-d", "true"];
    var opts = {
        alias: { h: "herp" },
        boolean: "h",
        unknown: unknownFn
    };
    parse(aliased, opts);
    parse(regular, opts);
    assertEquals(unknown, ["--derp", "-d"]);
});
Deno.test(function flagBooleanTrueAnyDoubleHyphenArgumentIsNotUnknown() {
    var unknown = [];
    function unknownFn(arg) {
        unknown.push(arg);
        return false;
    }
    var argv = parse(["--honk", "--tacos=good", "cow", "-p", "55"], {
        boolean: true,
        unknown: unknownFn
    });
    assertEquals(unknown, ["--tacos=good", "cow", "-p"]);
    assertEquals(argv, {
        honk: true,
        _: []
    });
});
Deno.test(function stringAndAliasIsNotUnkown() {
    var unknown = [];
    function unknownFn(arg) {
        unknown.push(arg);
        return false;
    }
    var aliased = ["-h", "hello", "--derp", "goodbye"];
    var regular = ["--herp", "hello", "-d", "moon"];
    var opts = {
        alias: { h: "herp" },
        string: "h",
        unknown: unknownFn
    };
    parse(aliased, opts);
    parse(regular, opts);
    assertEquals(unknown, ["--derp", "-d"]);
});
Deno.test(function defaultAndAliasIsNotUnknown() {
    var unknown = [];
    function unknownFn(arg) {
        unknown.push(arg);
        return false;
    }
    var aliased = ["-h", "hello"];
    var regular = ["--herp", "hello"];
    var opts = {
        "default": { h: "bar" },
        alias: { h: "herp" },
        unknown: unknownFn
    };
    parse(aliased, opts);
    parse(regular, opts);
    assertEquals(unknown, []);
});
Deno.test(function valueFollowingDoubleHyphenIsNotUnknown() {
    var unknown = [];
    function unknownFn(arg) {
        unknown.push(arg);
        return false;
    }
    var aliased = ["--bad", "--", "good", "arg"];
    var opts = {
        "--": true,
        unknown: unknownFn
    };
    var argv = parse(aliased, opts);
    assertEquals(unknown, ["--bad"]);
    assertEquals(argv, {
        "--": ["good", "arg"],
        _: []
    });
});
//# sourceMappingURL=unknown_test.js.map