import { MuxAsyncIterator } from "../util/async.ts";
export function signal() {
    var signos = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        signos[_i] = arguments[_i];
    }
    var mux = new MuxAsyncIterator();
    if (signos.length < 1) {
        throw new Error("No signals are given. You need to specify at least one signal to create a signal stream.");
    }
    var streams = signos.map(Deno.signal);
    streams.forEach(function (stream) {
        mux.add(stream);
    });
    // Create dispose method for the muxer of signal streams.
    var dispose = function () {
        streams.forEach(function (stream) {
            stream.dispose();
        });
    };
    return Object.assign(mux, { dispose: dispose });
}
//# sourceMappingURL=mod.js.map