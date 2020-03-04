var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { parse } from "../flags/mod.js";
import { readStringDelim } from "../io/bufio.js";
var args = Deno.args, exit = Deno.exit, stdin = Deno.stdin;
/* eslint-disable-next-line max-len */
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction.
var AsyncFunction = Object.getPrototypeOf(function () {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
})
    .constructor;
/* eslint-disable max-len */
var HELP_MSG = "xeval\n\nRun a script for each new-line or otherwise delimited chunk of standard input.\n\nPrint all the usernames in /etc/passwd:\n  cat /etc/passwd | deno -A https://deno.land/std/examples/xeval.ts \"a = $.split(':'); if (a) console.log(a[0])\"\n\nA complicated way to print the current git branch:\n  git branch | deno -A https://deno.land/std/examples/xeval.ts -I 'line' \"if (line.startsWith('*')) console.log(line.slice(2))\"\n\nDemonstrates breaking the input up by space delimiter instead of by lines:\n  cat LICENSE | deno -A https://deno.land/std/examples/xeval.ts -d \" \" \"if ($ === 'MIT') console.log('MIT licensed')\",\n\nUSAGE:\n  deno -A https://deno.land/std/examples/xeval.ts [OPTIONS] <code>\nOPTIONS:\n  -d, --delim <delim>       Set delimiter, defaults to newline\n  -I, --replvar <replvar>   Set variable name to be used in eval, defaults to $\nARGS:\n  <code>";
var DEFAULT_DELIMITER = "\n";
export function xeval(reader, xevalFunc, _a) {
    var _b = (_a === void 0 ? {} : _a).delimiter, delimiter = _b === void 0 ? DEFAULT_DELIMITER : _b;
    var e_1, _c;
    return __awaiter(this, void 0, void 0, function () {
        var _d, _e, chunk, e_1_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 6, 7, 12]);
                    _d = __asyncValues(readStringDelim(reader, delimiter));
                    _f.label = 1;
                case 1: return [4 /*yield*/, _d.next()];
                case 2:
                    if (!(_e = _f.sent(), !_e.done)) return [3 /*break*/, 5];
                    chunk = _e.value;
                    if (!(chunk.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, xevalFunc(chunk)];
                case 3:
                    _f.sent();
                    _f.label = 4;
                case 4: return [3 /*break*/, 1];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _f.trys.push([7, , 10, 11]);
                    if (!(_e && !_e.done && (_c = _d["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _c.call(_d)];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var parsedArgs, delimiter, replVar, code, xEvalFunc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parsedArgs = parse(args, {
                        boolean: ["help"],
                        string: ["delim", "replvar"],
                        alias: {
                            delim: ["d"],
                            replvar: ["I"],
                            help: ["h"]
                        },
                        "default": {
                            delim: DEFAULT_DELIMITER,
                            replvar: "$"
                        }
                    });
                    if (parsedArgs._.length != 1) {
                        console.error(HELP_MSG);
                        console.log(parsedArgs._);
                        exit(1);
                    }
                    if (parsedArgs.help) {
                        return [2 /*return*/, console.log(HELP_MSG)];
                    }
                    delimiter = parsedArgs.delim;
                    replVar = parsedArgs.replvar;
                    code = parsedArgs._[0];
                    // new AsyncFunction()'s error message for this particular case isn't great.
                    if (!replVar.match(/^[_$A-z][_$A-z0-9]*$/)) {
                        console.error("Bad replvar identifier: \"" + replVar + "\"");
                        exit(1);
                    }
                    xEvalFunc = new AsyncFunction(replVar, code);
                    return [4 /*yield*/, xeval(stdin, xEvalFunc, { delimiter: delimiter })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
if (import.meta.main) {
    main();
}
//# sourceMappingURL=xeval.js.map
