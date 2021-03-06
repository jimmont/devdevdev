// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var test = Deno.test;
import { assertEquals } from "../testing/asserts.js";
import { lookup, contentType, extension, charset, extensions, types } from "./mod.js";
test(function testLookup() {
    assertEquals(lookup("json"), "application/json");
    assertEquals(lookup(".md"), "text/markdown");
    assertEquals(lookup("folder/file.js"), "application/javascript");
    assertEquals(lookup("folder/.htaccess"), undefined);
});
test(function testContentType() {
    assertEquals(contentType("markdown"), "text/markdown; charset=utf-8");
    assertEquals(contentType("file.json"), "application/json; charset=utf-8");
    assertEquals(contentType("text/html"), "text/html; charset=utf-8");
    assertEquals(contentType("text/html; charset=iso-8859-1"), "text/html; charset=iso-8859-1");
    assertEquals(contentType(".htaccess"), undefined);
});
test(function testExtension() {
    assertEquals(extension("application/octet-stream"), "bin");
    assertEquals(extension("application/javascript"), "js");
    assertEquals(extension("text/html"), "html");
});
test(function testCharset() {
    assertEquals(charset("text/markdown"), "UTF-8");
    assertEquals(charset("text/css"), "UTF-8");
});
test(function testExtensions() {
    assertEquals(extensions.get("application/javascript"), ["js", "mjs"]);
    assertEquals(extensions.get("foo"), undefined);
});
test(function testTypes() {
    assertEquals(types.get("js"), "application/javascript");
    assertEquals(types.get("foo"), undefined);
});
//# sourceMappingURL=test.js.map
