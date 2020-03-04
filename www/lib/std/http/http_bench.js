var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var e_1, _a;
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { serve } from "./server.ts";
var addr = Deno.args[0] || "127.0.0.1:4500";
var server = serve(addr);
var body = new TextEncoder().encode("Hello World");
console.log("http://" + addr + "/");
try {
    for (var server_1 = __asyncValues(server), server_1_1; server_1_1 = await server_1.next(), !server_1_1.done;) {
        var req = server_1_1.value;
        var res_1 = {
            body: body,
            headers: new Headers()
        };
        res_1.headers.set("Date", new Date().toUTCString());
        res_1.headers.set("Connection", "keep-alive");
        req.respond(res_1)["catch"](function () { });
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (server_1_1 && !server_1_1.done && (_a = server_1["return"])) await _a.call(server_1);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=http_bench.js.map