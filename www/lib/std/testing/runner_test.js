// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "../testing/asserts.ts";
import { isWindows } from "../path/mod.ts";
import { findTestModules } from "./runner.ts";
const { cwd, test } = Deno;
function urlToFilePath(url) {
    // Since `new URL('file:///C:/a').pathname` is `/C:/a`, remove leading slash.
    return url.pathname.slice(url.protocol == "file:" && isWindows ? 1 : 0);
}
async function findTestModulesArray(include, exclude, root = cwd()) {
    const result = [];
    for await (const testModule of findTestModules(include, exclude, root)) {
        result.push(testModule);
    }
    return result;
}
const TEST_DATA_URL = new URL("testdata", import.meta.url);
const TEST_DATA_PATH = urlToFilePath(TEST_DATA_URL);
test(async function findTestModulesDir1() {
    const urls = await findTestModulesArray(["."], [], TEST_DATA_PATH);
    assertEquals(urls.sort(), [
        `${TEST_DATA_URL}/bar_test.js`,
        `${TEST_DATA_URL}/foo_test.ts`,
        `${TEST_DATA_URL}/subdir/bar_test.js`,
        `${TEST_DATA_URL}/subdir/foo_test.ts`,
        `${TEST_DATA_URL}/subdir/test.js`,
        `${TEST_DATA_URL}/subdir/test.ts`,
        `${TEST_DATA_URL}/test.js`,
        `${TEST_DATA_URL}/test.ts`
    ]);
});
test(async function findTestModulesDir2() {
    const urls = await findTestModulesArray(["subdir"], [], TEST_DATA_PATH);
    assertEquals(urls.sort(), [
        `${TEST_DATA_URL}/subdir/bar_test.js`,
        `${TEST_DATA_URL}/subdir/foo_test.ts`,
        `${TEST_DATA_URL}/subdir/test.js`,
        `${TEST_DATA_URL}/subdir/test.ts`
    ]);
});
test(async function findTestModulesGlob() {
    const urls = await findTestModulesArray(["**/*_test.{js,ts}"], [], TEST_DATA_PATH);
    assertEquals(urls.sort(), [
        `${TEST_DATA_URL}/bar_test.js`,
        `${TEST_DATA_URL}/foo_test.ts`,
        `${TEST_DATA_URL}/subdir/bar_test.js`,
        `${TEST_DATA_URL}/subdir/foo_test.ts`
    ]);
});
test(async function findTestModulesExcludeDir() {
    const urls = await findTestModulesArray(["."], ["subdir"], TEST_DATA_PATH);
    assertEquals(urls.sort(), [
        `${TEST_DATA_URL}/bar_test.js`,
        `${TEST_DATA_URL}/foo_test.ts`,
        `${TEST_DATA_URL}/test.js`,
        `${TEST_DATA_URL}/test.ts`
    ]);
});
test(async function findTestModulesExcludeGlob() {
    const urls = await findTestModulesArray(["."], ["**/foo*"], TEST_DATA_PATH);
    assertEquals(urls.sort(), [
        `${TEST_DATA_URL}/bar_test.js`,
        `${TEST_DATA_URL}/subdir/bar_test.js`,
        `${TEST_DATA_URL}/subdir/test.js`,
        `${TEST_DATA_URL}/subdir/test.ts`,
        `${TEST_DATA_URL}/test.js`,
        `${TEST_DATA_URL}/test.ts`
    ]);
});
test(async function findTestModulesRemote() {
    const urls = [
        "https://example.com/colors_test.ts",
        "http://example.com/printf_test.ts"
    ];
    const matches = await findTestModulesArray(urls, []);
    assertEquals(matches, urls);
});
