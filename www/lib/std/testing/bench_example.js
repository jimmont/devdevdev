// https://deno.land/std/testing/bench.ts
import { bench, runIfMain } from "./bench.js";
// Basic
bench(function forIncrementX1e9(b) {
    b.start();
    for (let i = 0; i < 1e9; i++)
        ;
    b.stop();
});
// Reporting average measured time for $runs runs of func
bench({
    name: "runs100ForIncrementX1e6",
    runs: 100,
    func(b) {
        b.start();
        for (let i = 0; i < 1e6; i++)
            ;
        b.stop();
    }
});
// Itsabug
bench(function throwing(b) {
    b.start();
    // Throws bc the timer's stop method is never called
});
// Bench control
runIfMain(import.meta, { skip: /throw/ });
