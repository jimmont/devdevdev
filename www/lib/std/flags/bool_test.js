// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.ts";
import { parse } from "./mod.ts";
Deno.test(function flagBooleanDefaultFalse() {
    var argv = parse(["moo"], {
        boolean: ["t", "verbose"],
        "default": { verbose: false, t: false }
    });
    assertEquals(argv, {
        verbose: false,
        t: false,
        _: ["moo"]
    });
    assertEquals(typeof argv.verbose, "boolean");
    assertEquals(typeof argv.t, "boolean");
});
Deno.test(function booleanGroups() {
    var argv = parse(["-x", "-z", "one", "two", "three"], {
        boolean: ["x", "y", "z"]
    });
    assertEquals(argv, {
        x: true,
        y: false,
        z: true,
        _: ["one", "two", "three"]
    });
    assertEquals(typeof argv.x, "boolean");
    assertEquals(typeof argv.y, "boolean");
    assertEquals(typeof argv.z, "boolean");
});
Deno.test(function booleanAndAliasWithChainableApi() {
    var aliased = ["-h", "derp"];
    var regular = ["--herp", "derp"];
    var aliasedArgv = parse(aliased, {
        boolean: "herp",
        alias: { h: "herp" }
    });
    var propertyArgv = parse(regular, {
        boolean: "herp",
        alias: { h: "herp" }
    });
    var expected = {
        herp: true,
        h: true,
        _: ["derp"]
    };
    assertEquals(aliasedArgv, expected);
    assertEquals(propertyArgv, expected);
});
Deno.test(function booleanAndAliasWithOptionsHash() {
    var aliased = ["-h", "derp"];
    var regular = ["--herp", "derp"];
    var opts = {
        alias: { h: "herp" },
        boolean: "herp"
    };
    var aliasedArgv = parse(aliased, opts);
    var propertyArgv = parse(regular, opts);
    var expected = {
        herp: true,
        h: true,
        _: ["derp"]
    };
    assertEquals(aliasedArgv, expected);
    assertEquals(propertyArgv, expected);
});
Deno.test(function booleanAndAliasArrayWithOptionsHash() {
    var aliased = ["-h", "derp"];
    var regular = ["--herp", "derp"];
    var alt = ["--harp", "derp"];
    var opts = {
        alias: { h: ["herp", "harp"] },
        boolean: "h"
    };
    var aliasedArgv = parse(aliased, opts);
    var propertyArgv = parse(regular, opts);
    var altPropertyArgv = parse(alt, opts);
    var expected = {
        harp: true,
        herp: true,
        h: true,
        _: ["derp"]
    };
    assertEquals(aliasedArgv, expected);
    assertEquals(propertyArgv, expected);
    assertEquals(altPropertyArgv, expected);
});
Deno.test(function booleanAndAliasUsingExplicitTrue() {
    var aliased = ["-h", "true"];
    var regular = ["--herp", "true"];
    var opts = {
        alias: { h: "herp" },
        boolean: "h"
    };
    var aliasedArgv = parse(aliased, opts);
    var propertyArgv = parse(regular, opts);
    var expected = {
        herp: true,
        h: true,
        _: []
    };
    assertEquals(aliasedArgv, expected);
    assertEquals(propertyArgv, expected);
});
// regression, see https://github.com/substack/node-optimist/issues/71
// boolean and --x=true
Deno.test(function booleanAndNonBoolean() {
    var parsed = parse(["--boool", "--other=true"], {
        boolean: "boool"
    });
    assertEquals(parsed.boool, true);
    assertEquals(parsed.other, "true");
    var parsed2 = parse(["--boool", "--other=false"], {
        boolean: "boool"
    });
    assertEquals(parsed2.boool, true);
    assertEquals(parsed2.other, "false");
});
Deno.test(function booleanParsingTrue() {
    var parsed = parse(["--boool=true"], {
        "default": {
            boool: false
        },
        boolean: ["boool"]
    });
    assertEquals(parsed.boool, true);
});
Deno.test(function booleanParsingFalse() {
    var parsed = parse(["--boool=false"], {
        "default": {
            boool: true
        },
        boolean: ["boool"]
    });
    assertEquals(parsed.boool, false);
});
Deno.test(function booleanParsingTrueLike() {
    var parsed = parse(["-t", "true123"], { boolean: ["t"] });
    assertEquals(parsed.t, true);
    var parsed2 = parse(["-t", "123"], { boolean: ["t"] });
    assertEquals(parsed2.t, true);
    var parsed3 = parse(["-t", "false123"], { boolean: ["t"] });
    assertEquals(parsed3.t, true);
});
Deno.test(function booleanNegationAfterBoolean() {
    var parsed = parse(["--foo", "--no-foo"], { boolean: ["foo"] });
    assertEquals(parsed.foo, false);
    var parsed2 = parse(["--foo", "--no-foo", "123"], { boolean: ["foo"] });
    assertEquals(parsed2.foo, false);
});
Deno.test(function booleanAfterBooleanNegation() {
    var parsed = parse(["--no--foo", "--foo"], { boolean: ["foo"] });
    assertEquals(parsed.foo, true);
    var parsed2 = parse(["--no--foo", "--foo", "123"], { boolean: ["foo"] });
    assertEquals(parsed2.foo, true);
});
Deno.test(function latestFlagIsBooleanNegation() {
    var parsed = parse(["--no-foo", "--foo", "--no-foo"], { boolean: ["foo"] });
    assertEquals(parsed.foo, false);
    var parsed2 = parse(["--no-foo", "--foo", "--no-foo", "123"], {
        boolean: ["foo"]
    });
    assertEquals(parsed2.foo, false);
});
Deno.test(function latestFlagIsBoolean() {
    var parsed = parse(["--foo", "--no-foo", "--foo"], { boolean: ["foo"] });
    assertEquals(parsed.foo, true);
    var parsed2 = parse(["--foo", "--no-foo", "--foo", "123"], {
        boolean: ["foo"]
    });
    assertEquals(parsed2.foo, true);
});
//# sourceMappingURL=bool_test.js.map