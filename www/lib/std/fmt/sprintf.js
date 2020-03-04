var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var State;
(function (State) {
    State[State["PASSTHROUGH"] = 0] = "PASSTHROUGH";
    State[State["PERCENT"] = 1] = "PERCENT";
    State[State["POSITIONAL"] = 2] = "POSITIONAL";
    State[State["PRECISION"] = 3] = "PRECISION";
    State[State["WIDTH"] = 4] = "WIDTH";
})(State || (State = {}));
var WorP;
(function (WorP) {
    WorP[WorP["WIDTH"] = 0] = "WIDTH";
    WorP[WorP["PRECISION"] = 1] = "PRECISION";
})(WorP || (WorP = {}));
var Flags = /** @class */ (function () {
    function Flags() {
        this.width = -1;
        this.precision = -1;
    }
    return Flags;
}());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var min = Math.min;
var UNICODE_REPLACEMENT_CHARACTER = "\ufffd";
var DEFAULT_PRECISION = 6;
var FLOAT_REGEXP = /(-?)(\d)\.?(\d*)e([+-])(\d+)/;
var F;
(function (F) {
    F[F["sign"] = 1] = "sign";
    F[F["mantissa"] = 2] = "mantissa";
    F[F["fractional"] = 3] = "fractional";
    F[F["esign"] = 4] = "esign";
    F[F["exponent"] = 5] = "exponent";
})(F || (F = {}));
var Printf = /** @class */ (function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function Printf(format) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.state = State.PASSTHROUGH;
        this.verb = "";
        this.buf = "";
        this.argNum = 0;
        this.flags = new Flags();
        this.format = format;
        this.args = args;
        this.haveSeen = new Array(args.length);
        this.i = 0;
    }
    Printf.prototype.doPrintf = function () {
        for (; this.i < this.format.length; ++this.i) {
            var c = this.format[this.i];
            switch (this.state) {
                case State.PASSTHROUGH:
                    if (c === "%") {
                        this.state = State.PERCENT;
                    }
                    else {
                        this.buf += c;
                    }
                    break;
                case State.PERCENT:
                    if (c === "%") {
                        this.buf += c;
                        this.state = State.PASSTHROUGH;
                    }
                    else {
                        this.handleFormat();
                    }
                    break;
                default:
                    throw Error("Should be unreachable, certainly a bug in the lib.");
            }
        }
        // check for unhandled args
        var extras = false;
        var err = "%!(EXTRA";
        for (var i = 0; i !== this.haveSeen.length; ++i) {
            if (!this.haveSeen[i]) {
                extras = true;
                err += " '" + Deno.inspect(this.args[i]) + "'";
            }
        }
        err += ")";
        if (extras) {
            this.buf += err;
        }
        return this.buf;
    };
    // %[<positional>]<flag>...<verb>
    Printf.prototype.handleFormat = function () {
        this.flags = new Flags();
        var flags = this.flags;
        for (; this.i < this.format.length; ++this.i) {
            var c = this.format[this.i];
            switch (this.state) {
                case State.PERCENT:
                    switch (c) {
                        case "[":
                            this.handlePositional();
                            this.state = State.POSITIONAL;
                            break;
                        case "+":
                            flags.plus = true;
                            break;
                        case "<":
                            flags.lessthan = true;
                            break;
                        case "-":
                            flags.dash = true;
                            flags.zero = false; // only left pad zeros, dash takes precedence
                            break;
                        case "#":
                            flags.sharp = true;
                            break;
                        case " ":
                            flags.space = true;
                            break;
                        case "0":
                            // only left pad zeros, dash takes precedence
                            flags.zero = !flags.dash;
                            break;
                        default:
                            if (("1" <= c && c <= "9") || c === "." || c === "*") {
                                if (c === ".") {
                                    this.flags.precision = 0;
                                    this.state = State.PRECISION;
                                    this.i++;
                                }
                                else {
                                    this.state = State.WIDTH;
                                }
                                this.handleWidthAndPrecision(flags);
                            }
                            else {
                                this.handleVerb();
                                return; // always end in verb
                            }
                    } // switch c
                    break;
                case State.POSITIONAL: // either a verb or * only verb for now, TODO
                    if (c === "*") {
                        var worp = this.flags.precision === -1 ? WorP.WIDTH : WorP.PRECISION;
                        this.handleWidthOrPrecisionRef(worp);
                        this.state = State.PERCENT;
                        break;
                    }
                    else {
                        this.handleVerb();
                        return; // always end in verb
                    }
                default:
                    throw new Error("Should not be here " + this.state + ", library bug!");
            } // switch state
        }
    };
    Printf.prototype.handleWidthOrPrecisionRef = function (wOrP) {
        if (this.argNum >= this.args.length) {
            // handle Positional should have already taken care of it...
            return;
        }
        var arg = this.args[this.argNum];
        this.haveSeen[this.argNum] = true;
        if (typeof arg === "number") {
            switch (wOrP) {
                case WorP.WIDTH:
                    this.flags.width = arg;
                    break;
                default:
                    this.flags.precision = arg;
            }
        }
        else {
            var tmp = wOrP === WorP.WIDTH ? "WIDTH" : "PREC";
            this.tmpError = "%!(BAD " + tmp + " '" + this.args[this.argNum] + "')";
        }
        this.argNum++;
    };
    Printf.prototype.handleWidthAndPrecision = function (flags) {
        var fmt = this.format;
        for (; this.i !== this.format.length; ++this.i) {
            var c = fmt[this.i];
            switch (this.state) {
                case State.WIDTH:
                    switch (c) {
                        case ".":
                            // initialize precision, %9.f -> precision=0
                            this.flags.precision = 0;
                            this.state = State.PRECISION;
                            break;
                        case "*":
                            this.handleWidthOrPrecisionRef(WorP.WIDTH);
                            // force . or flag at this point
                            break;
                        default:
                            var val_1 = parseInt(c);
                            // most likely parseInt does something stupid that makes
                            // it unusuable for this scenario ...
                            // if we encounter a non (number|*|.) we're done with prec & wid
                            if (isNaN(val_1)) {
                                this.i--;
                                this.state = State.PERCENT;
                                return;
                            }
                            flags.width = flags.width == -1 ? 0 : flags.width;
                            flags.width *= 10;
                            flags.width += val_1;
                    } // switch c
                    break;
                case State.PRECISION:
                    if (c === "*") {
                        this.handleWidthOrPrecisionRef(WorP.PRECISION);
                        break;
                    }
                    var val = parseInt(c);
                    if (isNaN(val)) {
                        // one too far, rewind
                        this.i--;
                        this.state = State.PERCENT;
                        return;
                    }
                    flags.precision *= 10;
                    flags.precision += val;
                    break;
                default:
                    throw new Error("can't be here. bug.");
            } // switch state
        }
    };
    Printf.prototype.handlePositional = function () {
        if (this.format[this.i] !== "[") {
            // sanity only
            throw new Error("Can't happen? Bug.");
        }
        var positional = 0;
        var format = this.format;
        this.i++;
        var err = false;
        for (; this.i !== this.format.length; ++this.i) {
            if (format[this.i] === "]") {
                break;
            }
            positional *= 10;
            var val = parseInt(format[this.i]);
            if (isNaN(val)) {
                //throw new Error(
                //  `invalid character in positional: ${format}[${format[this.i]}]`
                //);
                this.tmpError = "%!(BAD INDEX)";
                err = true;
            }
            positional += val;
        }
        if (positional - 1 >= this.args.length) {
            this.tmpError = "%!(BAD INDEX)";
            err = true;
        }
        this.argNum = err ? this.argNum : positional - 1;
        return;
    };
    Printf.prototype.handleLessThan = function () {
        var arg = this.args[this.argNum];
        if ((arg || {}).constructor.name !== "Array") {
            throw new Error("arg " + arg + " is not an array. Todo better error handling");
        }
        var str = "[ ";
        for (var i = 0; i !== arg.length; ++i) {
            if (i !== 0)
                str += ", ";
            str += this._handleVerb(arg[i]);
        }
        return str + " ]";
    };
    Printf.prototype.handleVerb = function () {
        var verb = this.format[this.i];
        this.verb = verb;
        if (this.tmpError) {
            this.buf += this.tmpError;
            this.tmpError = undefined;
            if (this.argNum < this.haveSeen.length) {
                this.haveSeen[this.argNum] = true; // keep track of used args
            }
        }
        else if (this.args.length <= this.argNum) {
            this.buf += "%!(MISSING '" + verb + "')";
        }
        else {
            var arg = this.args[this.argNum]; // check out of range
            this.haveSeen[this.argNum] = true; // keep track of used args
            if (this.flags.lessthan) {
                this.buf += this.handleLessThan();
            }
            else {
                this.buf += this._handleVerb(arg);
            }
        }
        this.argNum++; // if there is a further positional, it will reset.
        this.state = State.PASSTHROUGH;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Printf.prototype._handleVerb = function (arg) {
        switch (this.verb) {
            case "t":
                return this.pad(arg.toString());
                break;
            case "b":
                return this.fmtNumber(arg, 2);
                break;
            case "c":
                return this.fmtNumberCodePoint(arg);
                break;
            case "d":
                return this.fmtNumber(arg, 10);
                break;
            case "o":
                return this.fmtNumber(arg, 8);
                break;
            case "x":
                return this.fmtHex(arg);
                break;
            case "X":
                return this.fmtHex(arg, true);
                break;
            case "e":
                return this.fmtFloatE(arg);
                break;
            case "E":
                return this.fmtFloatE(arg, true);
                break;
            case "f":
            case "F":
                return this.fmtFloatF(arg);
                break;
            case "g":
                return this.fmtFloatG(arg);
                break;
            case "G":
                return this.fmtFloatG(arg, true);
                break;
            case "s":
                return this.fmtString(arg);
                break;
            case "T":
                return this.fmtString(typeof arg);
                break;
            case "v":
                return this.fmtV(arg);
                break;
            case "j":
                return this.fmtJ(arg);
                break;
            default:
                return "%!(BAD VERB '" + this.verb + "')";
        }
    };
    Printf.prototype.pad = function (s) {
        var padding = this.flags.zero ? "0" : " ";
        if (this.flags.dash) {
            return s.padEnd(this.flags.width, padding);
        }
        return s.padStart(this.flags.width, padding);
    };
    Printf.prototype.padNum = function (nStr, neg) {
        var sign;
        if (neg) {
            sign = "-";
        }
        else if (this.flags.plus || this.flags.space) {
            sign = this.flags.plus ? "+" : " ";
        }
        else {
            sign = "";
        }
        var zero = this.flags.zero;
        if (!zero) {
            // sign comes in front of padding when padding w/ zero,
            // in from of value if padding with spaces.
            nStr = sign + nStr;
        }
        var pad = zero ? "0" : " ";
        var len = zero ? this.flags.width - sign.length : this.flags.width;
        if (this.flags.dash) {
            nStr = nStr.padEnd(len, pad);
        }
        else {
            nStr = nStr.padStart(len, pad);
        }
        if (zero) {
            // see above
            nStr = sign + nStr;
        }
        return nStr;
    };
    Printf.prototype.fmtNumber = function (n, radix, upcase) {
        if (upcase === void 0) { upcase = false; }
        var num = Math.abs(n).toString(radix);
        var prec = this.flags.precision;
        if (prec !== -1) {
            this.flags.zero = false;
            num = n === 0 && prec === 0 ? "" : num;
            while (num.length < prec) {
                num = "0" + num;
            }
        }
        var prefix = "";
        if (this.flags.sharp) {
            switch (radix) {
                case 2:
                    prefix += "0b";
                    break;
                case 8:
                    // don't annotate octal 0 with 0...
                    prefix += num.startsWith("0") ? "" : "0";
                    break;
                case 16:
                    prefix += "0x";
                    break;
                default:
                    throw new Error("cannot handle base: " + radix);
            }
        }
        // don't add prefix in front of value truncated by precision=0, val=0
        num = num.length === 0 ? num : prefix + num;
        if (upcase) {
            num = num.toUpperCase();
        }
        return this.padNum(num, n < 0);
    };
    Printf.prototype.fmtNumberCodePoint = function (n) {
        var s = "";
        try {
            s = String.fromCodePoint(n);
        }
        catch (RangeError) {
            s = UNICODE_REPLACEMENT_CHARACTER;
        }
        return this.pad(s);
    };
    Printf.prototype.fmtFloatSpecial = function (n) {
        // formatting of NaN and Inf are pants-on-head
        // stupid and more or less arbitrary.
        if (isNaN(n)) {
            this.flags.zero = false;
            return this.padNum("NaN", false);
        }
        if (n === Number.POSITIVE_INFINITY) {
            this.flags.zero = false;
            this.flags.plus = true;
            return this.padNum("Inf", false);
        }
        if (n === Number.NEGATIVE_INFINITY) {
            this.flags.zero = false;
            return this.padNum("Inf", true);
        }
        return "";
    };
    Printf.prototype.roundFractionToPrecision = function (fractional, precision) {
        if (fractional.length > precision) {
            fractional = "1" + fractional; // prepend a 1 in case of leading 0
            var tmp = parseInt(fractional.substr(0, precision + 2)) / 10;
            tmp = Math.round(tmp);
            fractional = Math.floor(tmp).toString();
            fractional = fractional.substr(1); // remove extra 1
        }
        else {
            while (fractional.length < precision) {
                fractional += "0";
            }
        }
        return fractional;
    };
    Printf.prototype.fmtFloatE = function (n, upcase) {
        if (upcase === void 0) { upcase = false; }
        var special = this.fmtFloatSpecial(n);
        if (special !== "") {
            return special;
        }
        var m = n.toExponential().match(FLOAT_REGEXP);
        if (!m) {
            throw Error("can't happen, bug");
        }
        var fractional = m[F.fractional];
        var precision = this.flags.precision !== -1 ? this.flags.precision : DEFAULT_PRECISION;
        fractional = this.roundFractionToPrecision(fractional, precision);
        var e = m[F.exponent];
        // scientific notation output with exponent padded to minlen 2
        e = e.length == 1 ? "0" + e : e;
        var val = m[F.mantissa] + "." + fractional + (upcase ? "E" : "e") + m[F.esign] + e;
        return this.padNum(val, n < 0);
    };
    Printf.prototype.fmtFloatF = function (n) {
        var special = this.fmtFloatSpecial(n);
        if (special !== "") {
            return special;
        }
        // stupid helper that turns a number into a (potentially)
        // VERY long string.
        function expandNumber(n) {
            if (Number.isSafeInteger(n)) {
                return n.toString() + ".";
            }
            var t = n.toExponential().split("e");
            var m = t[0].replace(".", "");
            var e = parseInt(t[1]);
            if (e < 0) {
                var nStr = "0.";
                for (var i = 0; i !== Math.abs(e) - 1; ++i) {
                    nStr += "0";
                }
                return (nStr += m);
            }
            else {
                var splIdx = e + 1;
                while (m.length < splIdx) {
                    m += "0";
                }
                return m.substr(0, splIdx) + "." + m.substr(splIdx);
            }
        }
        // avoiding sign makes padding easier
        var val = expandNumber(Math.abs(n));
        var arr = val.split(".");
        var dig = arr[0];
        var fractional = arr[1];
        var precision = this.flags.precision !== -1 ? this.flags.precision : DEFAULT_PRECISION;
        fractional = this.roundFractionToPrecision(fractional, precision);
        return this.padNum(dig + "." + fractional, n < 0);
    };
    Printf.prototype.fmtFloatG = function (n, upcase) {
        if (upcase === void 0) { upcase = false; }
        var special = this.fmtFloatSpecial(n);
        if (special !== "") {
            return special;
        }
        // The double argument representing a floating-point number shall be
        // converted in the style f or e (or in the style F or E in
        // the case of a G conversion specifier), depending on the
        // value converted and the precision. Let P equal the
        // precision if non-zero, 6 if the precision is omitted, or 1
        // if the precision is zero. Then, if a conversion with style E would
        // have an exponent of X:
        //     - If P > X>=-4, the conversion shall be with style f (or F )
        //     and precision P -( X+1).
        //     - Otherwise, the conversion shall be with style e (or E )
        //     and precision P -1.
        // Finally, unless the '#' flag is used, any trailing zeros shall be
        // removed from the fractional portion of the result and the
        // decimal-point character shall be removed if there is no
        // fractional portion remaining.
        // A double argument representing an infinity or NaN shall be
        // converted in the style of an f or F conversion specifier.
        // https://pubs.opengroup.org/onlinepubs/9699919799/functions/fprintf.html
        var P = this.flags.precision !== -1 ? this.flags.precision : DEFAULT_PRECISION;
        P = P === 0 ? 1 : P;
        var m = n.toExponential().match(FLOAT_REGEXP);
        if (!m) {
            throw Error("can't happen");
        }
        var X = parseInt(m[F.exponent]) * (m[F.esign] === "-" ? -1 : 1);
        var nStr = "";
        if (P > X && X >= -4) {
            this.flags.precision = P - (X + 1);
            nStr = this.fmtFloatF(n);
            if (!this.flags.sharp) {
                nStr = nStr.replace(/\.?0*$/, "");
            }
        }
        else {
            this.flags.precision = P - 1;
            nStr = this.fmtFloatE(n);
            if (!this.flags.sharp) {
                nStr = nStr.replace(/\.?0*e/, upcase ? "E" : "e");
            }
        }
        return nStr;
    };
    Printf.prototype.fmtString = function (s) {
        if (this.flags.precision !== -1) {
            s = s.substr(0, this.flags.precision);
        }
        return this.pad(s);
    };
    Printf.prototype.fmtHex = function (val, upper) {
        if (upper === void 0) { upper = false; }
        // allow others types ?
        switch (typeof val) {
            case "number":
                return this.fmtNumber(val, 16, upper);
                break;
            case "string":
                var sharp = this.flags.sharp && val.length !== 0;
                var hex = sharp ? "0x" : "";
                var prec = this.flags.precision;
                var end = prec !== -1 ? min(prec, val.length) : val.length;
                for (var i = 0; i !== end; ++i) {
                    if (i !== 0 && this.flags.space) {
                        hex += sharp ? " 0x" : " ";
                    }
                    // TODO: for now only taking into account the
                    // lower half of the codePoint, ie. as if a string
                    // is a list of 8bit values instead of UCS2 runes
                    var c = (val.charCodeAt(i) & 0xff).toString(16);
                    hex += c.length === 1 ? "0" + c : c;
                }
                if (upper) {
                    hex = hex.toUpperCase();
                }
                return this.pad(hex);
                break;
            default:
                throw new Error("currently only number and string are implemented for hex");
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Printf.prototype.fmtV = function (val) {
        if (this.flags.sharp) {
            var options = this.flags.precision !== -1 ? { depth: this.flags.precision } : {};
            return this.pad(Deno.inspect(val, options));
        }
        else {
            var p = this.flags.precision;
            return p === -1 ? val.toString() : val.toString().substr(0, p);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Printf.prototype.fmtJ = function (val) {
        return JSON.stringify(val);
    };
    return Printf;
}());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sprintf(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var printf = new (Printf.bind.apply(Printf, __spreadArrays([void 0, format], args)))();
    return printf.doPrintf();
}
//# sourceMappingURL=sprintf.js.map