// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { assert } from "../testing/asserts.js";
export function deepAssign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        if (!source || typeof source !== "object") {
            return;
        }
        Object.entries(source).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (value instanceof Date) {
                target[key] = new Date(value);
                return;
            }
            if (!value || typeof value !== "object") {
                target[key] = value;
                return;
            }
            if (Array.isArray(value)) {
                target[key] = [];
            }
            // value is an Object
            if (typeof target[key] !== "object" || !target[key]) {
                target[key] = {};
            }
            assert(value);
            deepAssign(target[key], value);
        });
    }
    return target;
}
//# sourceMappingURL=deep_assign.js.map
