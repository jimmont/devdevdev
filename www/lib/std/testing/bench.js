// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
const { exit, noColor } = Deno;
function red(text) {
    return noColor ? text : `\x1b[31m${text}\x1b[0m`;
}
function blue(text) {
    return noColor ? text : `\x1b[34m${text}\x1b[0m`;
}
function verifyOr1Run(runs) {
    return runs && runs >= 1 && runs !== Infinity ? Math.floor(runs) : 1;
}
function assertTiming(clock) {
    // NaN indicates that a benchmark has not been timed properly
    if (!clock.stop) {
        throw new Error("The benchmark timer's stop method must be called");
    }
    else if (!clock.start) {
        throw new Error("The benchmark timer's start method must be called");
    }
    else if (clock.start > clock.stop) {
        throw new Error("The benchmark timer's start method must be called before its " +
            "stop method");
    }
}
function createBenchmarkTimer(clock) {
    return {
        start() {
            clock.start = performance.now();
        },
        stop() {
            clock.stop = performance.now();
        }
    };
}
const candidates = [];
/** Registers a benchmark as a candidate for the runBenchmarks executor. */
export function bench(benchmark) {
    if (!benchmark.name) {
        throw new Error("The benchmark function must not be anonymous");
    }
    if (typeof benchmark === "function") {
        candidates.push({ name: benchmark.name, runs: 1, func: benchmark });
    }
    else {
        candidates.push({
            name: benchmark.name,
            runs: verifyOr1Run(benchmark.runs),
            func: benchmark.func
        });
    }
}
/** Runs all registered and non-skipped benchmarks serially. */
export async function runBenchmarks({ only = /[^\s]/, skip = /^\s*$/ } = {}) {
    // Filtering candidates by the "only" and "skip" constraint
    const benchmarks = candidates.filter(({ name }) => only.test(name) && !skip.test(name));
    // Init main counters and error flag
    const filtered = candidates.length - benchmarks.length;
    let measured = 0;
    let failed = false;
    // Setting up a shared benchmark clock and timer
    const clock = { start: NaN, stop: NaN };
    const b = createBenchmarkTimer(clock);
    // Iterating given benchmark definitions (await-in-loop)
    console.log("running", benchmarks.length, `benchmark${benchmarks.length === 1 ? " ..." : "s ..."}`);
    for (const { name, runs = 0, func } of benchmarks) {
        // See https://github.com/denoland/deno/pull/1452 about groupCollapsed
        console.groupCollapsed(`benchmark ${name} ... `);
        // Trying benchmark.func
        let result = "";
        try {
            if (runs === 1) {
                // b is a benchmark timer interfacing an unset (NaN) benchmark clock
                await func(b);
                // Making sure the benchmark was started/stopped properly
                assertTiming(clock);
                result = `${clock.stop - clock.start}ms`;
            }
            else if (runs > 1) {
                // Averaging runs
                let pendingRuns = runs;
                let totalMs = 0;
                // Would be better 2 not run these serially
                while (true) {
                    // b is a benchmark timer interfacing an unset (NaN) benchmark clock
                    await func(b);
                    // Making sure the benchmark was started/stopped properly
                    assertTiming(clock);
                    // Summing up
                    totalMs += clock.stop - clock.start;
                    // Resetting the benchmark clock
                    clock.start = clock.stop = NaN;
                    // Once all ran
                    if (!--pendingRuns) {
                        result = `${runs} runs avg: ${totalMs / runs}ms`;
                        break;
                    }
                }
            }
        }
        catch (err) {
            failed = true;
            console.groupEnd();
            console.error(red(err.stack));
            break;
        }
        // Reporting
        console.log(blue(result));
        console.groupEnd();
        measured++;
        // Resetting the benchmark clock
        clock.start = clock.stop = NaN;
    }
    // Closing results
    console.log(`benchmark result: ${failed ? red("FAIL") : blue("DONE")}. ` +
        `${measured} measured; ${filtered} filtered`);
    // Making sure the program exit code is not zero in case of failure
    if (failed) {
        setTimeout(() => exit(1), 0);
    }
}
/** Runs specified benchmarks if the enclosing script is main. */
export async function runIfMain(meta, opts) {
    if (meta.main) {
        return runBenchmarks(opts);
    }
}
