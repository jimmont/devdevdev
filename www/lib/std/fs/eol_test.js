// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.ts";
import { format, detect, EOL } from "./eol.ts";
var CRLFinput = "deno\r\nis not\r\nnode";
var Mixedinput = "deno\nis not\r\nnode";
var Mixedinput2 = "deno\r\nis not\nnode";
var LFinput = "deno\nis not\nnode";
var NoNLinput = "deno is not node";
Deno.test({
    name: "[EOL] Detect CR LF",
    fn: function () {
        assertEquals(detect(CRLFinput), EOL.CRLF);
    }
});
Deno.test({
    name: "[EOL] Detect LF",
    fn: function () {
        assertEquals(detect(LFinput), EOL.LF);
    }
});
Deno.test({
    name: "[EOL] Detect No New Line",
    fn: function () {
        assertEquals(detect(NoNLinput), null);
    }
});
Deno.test({
    name: "[EOL] Detect Mixed",
    fn: function () {
        assertEquals(detect(Mixedinput), EOL.CRLF);
        assertEquals(detect(Mixedinput2), EOL.CRLF);
    }
});
Deno.test({
    name: "[EOL] Format",
    fn: function () {
        assertEquals(format(CRLFinput, EOL.LF), LFinput);
        assertEquals(format(LFinput, EOL.LF), LFinput);
        assertEquals(format(LFinput, EOL.CRLF), CRLFinput);
        assertEquals(format(CRLFinput, EOL.CRLF), CRLFinput);
        assertEquals(format(CRLFinput, EOL.CRLF), CRLFinput);
        assertEquals(format(NoNLinput, EOL.CRLF), NoNLinput);
        assertEquals(format(Mixedinput, EOL.CRLF), CRLFinput);
        assertEquals(format(Mixedinput, EOL.LF), LFinput);
        assertEquals(format(Mixedinput2, EOL.CRLF), CRLFinput);
        assertEquals(format(Mixedinput2, EOL.LF), LFinput);
    }
});
//# sourceMappingURL=eol_test.js.map