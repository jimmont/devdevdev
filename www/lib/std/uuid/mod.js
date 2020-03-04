// Based on https://github.com/kelektiv/node-uuid
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import * as v4 from "./v4.ts";
export var NIL_UUID = "00000000-0000-0000-0000-000000000000";
export function isNil(val) {
    return val === NIL_UUID;
}
var NOT_IMPLEMENTED = {
    generate: function () {
        throw new Error("Not implemented");
    },
    validate: function () {
        throw new Error("Not implemented");
    }
};
// TODO Implement
export var v1 = NOT_IMPLEMENTED;
// TODO Implement
export var v3 = NOT_IMPLEMENTED;
export { v4 };
// TODO Implement
export var v5 = NOT_IMPLEMENTED;
//# sourceMappingURL=mod.js.map