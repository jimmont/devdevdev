var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var e_1, _a;
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var hostname = "0.0.0.0";
var port = 8080;
var listener = Deno.listen({ hostname: hostname, port: port });
console.log("Listening on " + hostname + ":" + port);
try {
    for (var listener_1 = __asyncValues(listener), listener_1_1; listener_1_1 = await listener_1.next(), !listener_1_1.done;) {
        var conn = listener_1_1.value;
        Deno.copy(conn, conn);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (listener_1_1 && !listener_1_1.done && (_a = listener_1["return"])) await _a.call(listener_1);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=echo_server.js.map