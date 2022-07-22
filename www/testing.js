/*
 * unit testing core import
 * only requires Deno, info on available Web APIs and differences are linked below
 * uitests tests (aka end-to-end/e2e tests, ie puppeteer/playwright) are expected to import and use the following for assertions,
 * benchmarking, not the other way around--meaning unit test in uitests/e2e tests, don't polyfill, run uitests in
 * browsers/implementations with those features, see tools/uitest.runner.js for more info on that;
 * console.assert is fine because it's part of all the supported runtimes, just run those assertions when/where desired
 * prefer fail-fast to expose problems sooner
 *
 * run tests:
 * $ deno test
 * $ deno test --fail-fast ./
 *
 * install, general background, documentation, notable:
 * https://deno.land/
 *	https://deno.land/manual
 * https://deno.land/manual/getting_started/installation
 * https://deno.land/manual/getting_started/debugging_your_code
 *	https://deno.land/manual/runtime/web_platform_apis
 *	https://deno.land/manual/testing
 * https://deno.land/manual/testing
 * https://deno.land/std/testing
 *
 * convention for script with its related specific tests:
 * /path/to/example.js
 * /path/to/example.test.js
 *
 * // example.js as an example of a file
 * export const hello = "world";
 *
 * // example.test.js as an example of a tightly coupled set of tests
 * // invoke: $ deno test
 * // output: test hello sample ... ok (6ms)
 * // output: test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (96ms)
 * import { hello } from "./example.js";
 * import { assert } from "./testing.js";
 *
 * Deno.test('hello sample', () => {
 *	 assert(hello === "world", `expected world... this won't show unless this fails`);
 * });
 *
 *
 * // see https://deno.land/std/testing for details on all of these testing and benchmarking features:
 *
 * import { equal, assert, assertEquals, assertNotEquals, assertStrictEquals, assertStringIncludes, assertMatch,
 * assertNotMatch, assertArrayIncludes, assertObjectMatch, assertThrows, assertThrowsAsync, unimplemented,
 * unreachable, } from 'https://deno.land/std/testing/asserts.ts';
 *
 * import { bench, BenchmarkRunError, BenchmarkRunProgress, BenchmarkRunResult, clearBenchmarks, ProgressState,
 * runBenchmarks, } from 'https://deno.land/std/testing/bench.ts';
 *
 */

/* eslint-disable import/no-unresolved */
export * from 'https://deno.land/std/testing/asserts.ts';
export * from 'https://deno.land/std/testing/bench.ts';
