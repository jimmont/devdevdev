var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { assert } from "../testing/asserts.ts";
var DEFAULT_OPTIONS = {
    unknown: function (i) { return i; },
    boolean: false,
    alias: {},
    string: [],
    "default": {},
    "--": false,
    stopEarly: false
};
function get(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key];
    }
}
function getForce(obj, key) {
    var v = get(obj, key);
    assert(v != null);
    return v;
}
function isNumber(x) {
    if (typeof x === "number")
        return true;
    if (/^0x[0-9a-f]+$/i.test(String(x)))
        return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
}
function hasKey(obj, keys) {
    var o = obj;
    keys.slice(0, -1).forEach(function (key) {
        o = (get(o, key) || {});
    });
    var key = keys[keys.length - 1];
    return key in o;
}
export function parse(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
args, initialOptions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) {
    var _a;
    if (initialOptions === void 0) { initialOptions = {}; }
    var options = __assign(__assign({}, DEFAULT_OPTIONS), initialOptions);
    var flags = {
        bools: {},
        strings: {},
        unknownFn: options.unknown,
        allBools: false
    };
    if (options.boolean !== undefined) {
        if (typeof options.boolean === "boolean") {
            flags.allBools = !!options.boolean;
        }
        else {
            var booleanArgs = typeof options.boolean === "string"
                ? [options.boolean]
                : options.boolean;
            booleanArgs.filter(Boolean).forEach(function (key) {
                flags.bools[key] = true;
            });
        }
    }
    var aliases = {};
    if (options.alias !== undefined) {
        for (var key in options.alias) {
            var val = getForce(options.alias, key);
            if (typeof val === "string") {
                aliases[key] = [val];
            }
            else {
                aliases[key] = val;
            }
            var _loop_1 = function (alias) {
                aliases[alias] = [key].concat(aliases[key].filter(function (y) { return alias !== y; }));
            };
            for (var _i = 0, _b = getForce(aliases, key); _i < _b.length; _i++) {
                var alias = _b[_i];
                _loop_1(alias);
            }
        }
    }
    if (options.string !== undefined) {
        var stringArgs = typeof options.string === "string" ? [options.string] : options.string;
        stringArgs.filter(Boolean).forEach(function (key) {
            flags.strings[key] = true;
            var alias = get(aliases, key);
            if (alias) {
                alias.forEach(function (alias) {
                    flags.strings[alias] = true;
                });
            }
        });
    }
    var defaults = options["default"];
    var argv = { _: [] };
    function argDefined(key, arg) {
        return ((flags.allBools && /^--[^=]+$/.test(arg)) ||
            get(flags.bools, key) ||
            !!get(flags.strings, key) ||
            !!get(aliases, key));
    }
    function setKey(obj, keys, value) {
        var o = obj;
        keys.slice(0, -1).forEach(function (key) {
            if (get(o, key) === undefined) {
                o[key] = {};
            }
            o = get(o, key);
        });
        var key = keys[keys.length - 1];
        if (get(o, key) === undefined ||
            get(flags.bools, key) ||
            typeof get(o, key) === "boolean") {
            o[key] = value;
        }
        else if (Array.isArray(get(o, key))) {
            o[key].push(value);
        }
        else {
            o[key] = [get(o, key), value];
        }
    }
    function setArg(key, val, arg) {
        if (arg === void 0) { arg = undefined; }
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg) === false)
                return;
        }
        var value = !get(flags.strings, key) && isNumber(val) ? Number(val) : val;
        setKey(argv, key.split("."), value);
        (get(aliases, key) || []).forEach(function (x) {
            setKey(argv, x.split("."), value);
        });
    }
    function aliasIsBoolean(key) {
        return getForce(aliases, key).some(function (x) {
            return typeof get(flags.bools, x) === "boolean";
        });
    }
    Object.keys(flags.bools).forEach(function (key) {
        setArg(key, defaults[key] === undefined ? false : defaults[key]);
    });
    var notFlags = [];
    // all args after "--" are not parsed
    if (args.indexOf("--") !== -1) {
        notFlags = args.slice(args.indexOf("--") + 1);
        args = args.slice(0, args.indexOf("--"));
    }
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (/^--.+=/.test(arg)) {
            // Using [\s\S] instead of . because js doesn't support the
            // 'dotall' regex modifier. See:
            // http://stackoverflow.com/a/1068308/13216
            var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
            assert(m != null);
            var key = m[1];
            var value = m[2];
            if (flags.bools[key]) {
                var booleanValue = value !== "false";
                setArg(key, booleanValue, arg);
            }
            else {
                setArg(key, value, arg);
            }
        }
        else if (/^--no-.+/.test(arg)) {
            var m = arg.match(/^--no-(.+)/);
            assert(m != null);
            setArg(m[1], false, arg);
        }
        else if (/^--.+/.test(arg)) {
            var m = arg.match(/^--(.+)/);
            assert(m != null);
            var key = m[1];
            var next = args[i + 1];
            if (next !== undefined &&
                !/^-/.test(next) &&
                !get(flags.bools, key) &&
                !flags.allBools &&
                (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                setArg(key, next, arg);
                i++;
            }
            else if (/^(true|false)$/.test(next)) {
                setArg(key, next === "true", arg);
                i++;
            }
            else {
                setArg(key, get(flags.strings, key) ? "" : true, arg);
            }
        }
        else if (/^-[^-]+/.test(arg)) {
            var letters = arg.slice(1, -1).split("");
            var broken = false;
            for (var j = 0; j < letters.length; j++) {
                var next = arg.slice(j + 2);
                if (next === "-") {
                    setArg(letters[j], next, arg);
                    continue;
                }
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split("=")[1], arg);
                    broken = true;
                    break;
                }
                if (/[A-Za-z]/.test(letters[j]) &&
                    /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j + 2), arg);
                    broken = true;
                    break;
                }
                else {
                    setArg(letters[j], get(flags.strings, letters[j]) ? "" : true, arg);
                }
            }
            var key = arg.slice(-1)[0];
            if (!broken && key !== "-") {
                if (args[i + 1] &&
                    !/^(-|--)[^-]/.test(args[i + 1]) &&
                    !get(flags.bools, key) &&
                    (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                    setArg(key, args[i + 1], arg);
                    i++;
                }
                else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                    setArg(key, args[i + 1] === "true", arg);
                    i++;
                }
                else {
                    setArg(key, get(flags.strings, key) ? "" : true, arg);
                }
            }
        }
        else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(flags.strings["_"] || !isNumber(arg) ? arg : Number(arg));
            }
            if (options.stopEarly) {
                (_a = argv._).push.apply(_a, args.slice(i + 1));
                break;
            }
        }
    }
    Object.keys(defaults).forEach(function (key) {
        if (!hasKey(argv, key.split("."))) {
            setKey(argv, key.split("."), defaults[key]);
            (aliases[key] || []).forEach(function (x) {
                setKey(argv, x.split("."), defaults[key]);
            });
        }
    });
    if (options["--"]) {
        argv["--"] = [];
        notFlags.forEach(function (key) {
            argv["--"].push(key);
        });
    }
    else {
        notFlags.forEach(function (key) {
            argv._.push(key);
        });
    }
    return argv;
}
//# sourceMappingURL=mod.js.map