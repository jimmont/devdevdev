var test = Deno.test;
import { assert, assertThrows, assertEquals } from "../testing/asserts.js";
import { process } from "./process.js";
// NOTE: Deno.execPath() (and thus process.argv) currently requires --allow-env
// (Also Deno.env() (and process.env) requires --allow-env but it's more obvious)
test({
    name: "process.cwd and process.chdir success",
    fn: function () {
        // this should be run like other tests from directory up
        assert(process.cwd().match(/\Wstd$/));
        process.chdir("node");
        assert(process.cwd().match(/\Wnode$/));
        process.chdir("..");
        assert(process.cwd().match(/\Wstd$/));
    }
});
test({
    name: "process.chdir failure",
    fn: function () {
        assertThrows(function () {
            process.chdir("non-existent-directory-name");
        }, Deno.errors.NotFound, "file"
        // On every OS Deno returns: "No such file" except for Windows, where it's:
        // "The system cannot find the file specified. (os error 2)" so "file" is
        // the only common string here.
        );
    }
});
test({
    name: "process.version",
    fn: function () {
        assertEquals(typeof process, "object");
        assertEquals(typeof process.version, "string");
        assertEquals(typeof process.versions, "object");
        assertEquals(typeof process.versions.node, "string");
    }
});
test({
    name: "process.platform",
    fn: function () {
        assertEquals(typeof process.platform, "string");
    }
});
test({
    name: "process.arch",
    fn: function () {
        assertEquals(typeof process.arch, "string");
        // TODO(rsp): make sure that the arch strings should be the same in Node and Deno:
        assertEquals(process.arch, Deno.build.arch);
    }
});
test({
    name: "process.pid",
    fn: function () {
        assertEquals(typeof process.pid, "number");
        assertEquals(process.pid, Deno.pid);
    }
});
test({
    name: "process.on",
    fn: function () {
        assertEquals(typeof process.on, "function");
        assertThrows(function () {
            process.on("uncaughtException", function (_err) { });
        }, Error, "implemented");
    }
});
test({
    name: "process.argv",
    fn: function () {
        assert(Array.isArray(process.argv));
        assert(process.argv[0].match(/[^/\\]*deno[^/\\]*$/), "deno included in the file name of argv[0]");
        // we cannot test for anything else (we see test runner arguments here)
    }
});
test({
    name: "process.env",
    fn: function () {
        assertEquals(typeof process.env.PATH, "string");
    }
});
//# sourceMappingURL=process_test.js.map
