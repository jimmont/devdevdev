var test = Deno.test;
import { assert } from "../testing/asserts.ts";
import * as util from "./util.ts";
test({
    name: "[util] isBoolean",
    fn: function () {
        assert(util.isBoolean(true));
        assert(util.isBoolean(new Boolean()));
        assert(util.isBoolean(new Boolean(true)));
        assert(util.isBoolean(false));
        assert(!util.isBoolean("deno"));
        assert(!util.isBoolean("true"));
    }
});
test({
    name: "[util] isNull",
    fn: function () {
        var n;
        assert(util.isNull(null));
        assert(!util.isNull(n));
        assert(!util.isNull(0));
        assert(!util.isNull({}));
    }
});
test({
    name: "[util] isNullOrUndefined",
    fn: function () {
        var n;
        assert(util.isNullOrUndefined(null));
        assert(util.isNullOrUndefined(n));
        assert(!util.isNullOrUndefined({}));
        assert(!util.isNullOrUndefined("undefined"));
    }
});
test({
    name: "[util] isNumber",
    fn: function () {
        assert(util.isNumber(666));
        assert(util.isNumber(new Number(666)));
        assert(!util.isNumber("999"));
        assert(!util.isNumber(null));
    }
});
test({
    name: "[util] isString",
    fn: function () {
        assert(util.isString("deno"));
        assert(util.isString(new String("DIO")));
        assert(!util.isString(1337));
    }
});
test({
    name: "[util] isSymbol",
    fn: function () {
        assert(util.isSymbol(Symbol()));
        assert(!util.isSymbol(123));
        assert(!util.isSymbol("string"));
    }
});
test({
    name: "[util] isUndefined",
    fn: function () {
        var t;
        assert(util.isUndefined(t));
        assert(!util.isUndefined("undefined"));
        assert(!util.isUndefined({}));
    }
});
test({
    name: "[util] isObject",
    fn: function () {
        var dio = { stand: "Za Warudo" };
        assert(util.isObject(dio));
        assert(util.isObject(new RegExp(/Toki Wo Tomare/)));
        assert(!util.isObject("Jotaro"));
    }
});
test({
    name: "[util] isError",
    fn: function () {
        var java = new Error();
        var nodejs = new TypeError();
        var deno = "Future";
        assert(util.isError(java));
        assert(util.isError(nodejs));
        assert(!util.isError(deno));
    }
});
test({
    name: "[util] isFunction",
    fn: function () {
        var f = function () { };
        assert(util.isFunction(f));
        assert(!util.isFunction({}));
        assert(!util.isFunction(new RegExp(/f/)));
    }
});
test({
    name: "[util] isRegExp",
    fn: function () {
        assert(util.isRegExp(new RegExp(/f/)));
        assert(util.isRegExp(/fuManchu/));
        assert(!util.isRegExp({ evil: "eye" }));
        assert(!util.isRegExp(null));
    }
});
test({
    name: "[util] isArray",
    fn: function () {
        assert(util.isArray([]));
        assert(!util.isArray({ yaNo: "array" }));
        assert(!util.isArray(null));
    }
});
//# sourceMappingURL=util_test.js.map