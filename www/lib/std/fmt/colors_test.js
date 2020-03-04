// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.js";
import * as c from "./colors.js";
import "../examples/colors.js";
Deno.test(function singleColor() {
    assertEquals(c.red("foo bar"), "[31mfoo bar[39m");
});
Deno.test(function doubleColor() {
    assertEquals(c.bgBlue(c.red("foo bar")), "[44m[31mfoo bar[39m[49m");
});
Deno.test(function replacesCloseCharacters() {
    assertEquals(c.red("Hel[39mlo"), "[31mHel[31mlo[39m");
});
Deno.test(function enablingColors() {
    assertEquals(c.getColorEnabled(), true);
    c.setColorEnabled(false);
    assertEquals(c.bgBlue(c.red("foo bar")), "foo bar");
    c.setColorEnabled(true);
    assertEquals(c.red("foo bar"), "[31mfoo bar[39m");
});
Deno.test(function testBold() {
    assertEquals(c.bold("foo bar"), "[1mfoo bar[22m");
});
Deno.test(function testDim() {
    assertEquals(c.dim("foo bar"), "[2mfoo bar[22m");
});
Deno.test(function testItalic() {
    assertEquals(c.italic("foo bar"), "[3mfoo bar[23m");
});
Deno.test(function testUnderline() {
    assertEquals(c.underline("foo bar"), "[4mfoo bar[24m");
});
Deno.test(function testInverse() {
    assertEquals(c.inverse("foo bar"), "[7mfoo bar[27m");
});
Deno.test(function testHidden() {
    assertEquals(c.hidden("foo bar"), "[8mfoo bar[28m");
});
Deno.test(function testStrikethrough() {
    assertEquals(c.strikethrough("foo bar"), "[9mfoo bar[29m");
});
Deno.test(function testBlack() {
    assertEquals(c.black("foo bar"), "[30mfoo bar[39m");
});
Deno.test(function testRed() {
    assertEquals(c.red("foo bar"), "[31mfoo bar[39m");
});
Deno.test(function testGreen() {
    assertEquals(c.green("foo bar"), "[32mfoo bar[39m");
});
Deno.test(function testYellow() {
    assertEquals(c.yellow("foo bar"), "[33mfoo bar[39m");
});
Deno.test(function testBlue() {
    assertEquals(c.blue("foo bar"), "[34mfoo bar[39m");
});
Deno.test(function testMagenta() {
    assertEquals(c.magenta("foo bar"), "[35mfoo bar[39m");
});
Deno.test(function testCyan() {
    assertEquals(c.cyan("foo bar"), "[36mfoo bar[39m");
});
Deno.test(function testWhite() {
    assertEquals(c.white("foo bar"), "[37mfoo bar[39m");
});
Deno.test(function testGray() {
    assertEquals(c.gray("foo bar"), "[90mfoo bar[39m");
});
Deno.test(function testBgBlack() {
    assertEquals(c.bgBlack("foo bar"), "[40mfoo bar[49m");
});
Deno.test(function testBgRed() {
    assertEquals(c.bgRed("foo bar"), "[41mfoo bar[49m");
});
Deno.test(function testBgGreen() {
    assertEquals(c.bgGreen("foo bar"), "[42mfoo bar[49m");
});
Deno.test(function testBgYellow() {
    assertEquals(c.bgYellow("foo bar"), "[43mfoo bar[49m");
});
Deno.test(function testBgBlue() {
    assertEquals(c.bgBlue("foo bar"), "[44mfoo bar[49m");
});
Deno.test(function testBgMagenta() {
    assertEquals(c.bgMagenta("foo bar"), "[45mfoo bar[49m");
});
Deno.test(function testBgCyan() {
    assertEquals(c.bgCyan("foo bar"), "[46mfoo bar[49m");
});
Deno.test(function testBgWhite() {
    assertEquals(c.bgWhite("foo bar"), "[47mfoo bar[49m");
});
//# sourceMappingURL=colors_test.js.map
