var test = Deno.test;
import { assert, assertThrows, assertEquals } from "../testing/asserts.js";
import * as os from "./os.js";
test({
    name: "build architecture is a string",
    fn: function () {
        assertEquals(typeof os.arch(), "string");
    }
});
test({
    name: "home directory is a string",
    fn: function () {
        assertEquals(typeof os.homedir(), "string");
    }
});
test({
    name: "tmp directory is a string",
    fn: function () {
        assertEquals(typeof os.tmpdir(), "string");
    }
});
test({
    name: "hostname is a string",
    fn: function () {
        assertEquals(typeof os.hostname(), "string");
    }
});
test({
    name: "platform is a string",
    fn: function () {
        assertEquals(typeof os.platform(), "string");
    }
});
test({
    name: "release is a string",
    fn: function () {
        assertEquals(typeof os.release(), "string");
    }
});
test({
    name: "getPriority(): PID must be a 32 bit integer",
    fn: function () {
        assertThrows(function () {
            os.getPriority(3.15);
        }, Error, "pid must be 'an integer'");
        assertThrows(function () {
            os.getPriority(9999999999);
        }, Error, "must be >= -2147483648 && <= 2147483647");
    }
});
test({
    name: "setPriority(): PID must be a 32 bit integer",
    fn: function () {
        assertThrows(function () {
            os.setPriority(3.15, 0);
        }, Error, "pid must be 'an integer'");
        assertThrows(function () {
            os.setPriority(9999999999, 0);
        }, Error, "pid must be >= -2147483648 && <= 2147483647");
    }
});
test({
    name: "setPriority(): priority must be an integer between -20 and 19",
    fn: function () {
        assertThrows(function () {
            os.setPriority(0, 3.15);
        }, Error, "priority must be 'an integer'");
        assertThrows(function () {
            os.setPriority(0, -21);
        }, Error, "priority must be >= -20 && <= 19");
        assertThrows(function () {
            os.setPriority(0, 20);
        }, Error, "priority must be >= -20 && <= 19");
        assertThrows(function () {
            os.setPriority(0, 9999999999);
        }, Error, "priority must be >= -20 && <= 19");
    }
});
test({
    name: "setPriority(): if only one argument specified, then this is the priority, NOT the pid",
    fn: function () {
        assertThrows(function () {
            os.setPriority(3.15);
        }, Error, "priority must be 'an integer'");
        assertThrows(function () {
            os.setPriority(-21);
        }, Error, "priority must be >= -20 && <= 19");
        assertThrows(function () {
            os.setPriority(20);
        }, Error, "priority must be >= -20 && <= 19");
        assertThrows(function () {
            os.setPriority(9999999999);
        }, Error, "priority must be >= -20 && <= 19");
    }
});
test({
    name: "Signals are as expected",
    fn: function () {
        // Test a few random signals for equality
        assertEquals(os.constants.signals.SIGKILL, Deno.Signal.SIGKILL);
        assertEquals(os.constants.signals.SIGCONT, Deno.Signal.SIGCONT);
        assertEquals(os.constants.signals.SIGXFSZ, Deno.Signal.SIGXFSZ);
    }
});
test({
    name: "EOL is as expected",
    fn: function () {
        assert(os.EOL == "\r\n" || os.EOL == "\n");
    }
});
test({
    name: "Endianness is determined",
    fn: function () {
        assert(["LE", "BE"].includes(os.endianness()));
    }
});
test({
    name: "Load average is an array of 3 numbers",
    fn: function () {
        var result = os.loadavg();
        assert(result.length == 3);
        assertEquals(typeof result[0], "number");
        assertEquals(typeof result[1], "number");
        assertEquals(typeof result[2], "number");
    }
});
test({
    name: "Primitive coercion works as expected",
    fn: function () {
        assertEquals("" + os.arch, os.arch());
        assertEquals("" + os.endianness, os.endianness());
        assertEquals("" + os.homedir, os.homedir());
        assertEquals("" + os.hostname, os.hostname());
        assertEquals("" + os.platform, os.platform());
    }
});
test({
    name: "APIs not yet implemented",
    fn: function () {
        assertThrows(function () {
            os.cpus();
        }, Error, "Not implemented");
        assertThrows(function () {
            os.freemem();
        }, Error, "Not implemented");
        assertThrows(function () {
            os.getPriority();
        }, Error, "Not implemented");
        assertThrows(function () {
            os.networkInterfaces();
        }, Error, "Not implemented");
        assertThrows(function () {
            os.setPriority(0);
        }, Error, "Not implemented");
        assertThrows(function () {
            os.totalmem();
        }, Error, "Not implemented");
        assertThrows(function () {
            os.type();
        }, Error, "Not implemented");
        assertThrows(function () {
            os.uptime();
        }, Error, "Not implemented");
        assertThrows(function () {
            os.userInfo();
        }, Error, "Not implemented");
    }
});
//# sourceMappingURL=os_test.js.map
