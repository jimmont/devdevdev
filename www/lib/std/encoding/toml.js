var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { deepAssign } from "../util/deep_assign.ts";
import { pad } from "../strings/pad.ts";
import { assert } from "../testing/asserts.ts";
var KeyValuePair = /** @class */ (function () {
    function KeyValuePair(key, value) {
        this.key = key;
        this.value = value;
    }
    return KeyValuePair;
}());
var ParserGroup = /** @class */ (function () {
    function ParserGroup(type, name) {
        this.type = type;
        this.name = name;
        this.arrValues = [];
        this.objValues = {};
    }
    return ParserGroup;
}());
var ParserContext = /** @class */ (function () {
    function ParserContext() {
        this.output = {};
    }
    return ParserContext;
}());
var Parser = /** @class */ (function () {
    function Parser(tomlString) {
        this.tomlLines = this._split(tomlString);
        this.context = new ParserContext();
    }
    Parser.prototype._sanitize = function () {
        var out = [];
        for (var i = 0; i < this.tomlLines.length; i++) {
            var s = this.tomlLines[i];
            var trimmed = s.trim();
            if (trimmed !== "" && trimmed[0] !== "#") {
                out.push(s);
            }
        }
        this.tomlLines = out;
        this._mergeMultilines();
    };
    Parser.prototype._mergeMultilines = function () {
        function arrayStart(line) {
            var reg = /.*=\s*\[/g;
            return reg.test(line) && !(line[line.length - 1] === "]");
        }
        function arrayEnd(line) {
            return line[line.length - 1] === "]";
        }
        function stringStart(line) {
            var m = line.match(/.*=\s*(?:\"\"\"|''')/);
            if (!m) {
                return false;
            }
            return !line.endsWith("\"\"\"") || !line.endsWith("'''");
        }
        function stringEnd(line) {
            return line.endsWith("'''") || line.endsWith("\"\"\"");
        }
        function isLiteralString(line) {
            return line.match(/'''/) ? true : false;
        }
        var merged = [];
        var acc = [], isLiteral = false, capture = false, captureType = "", merge = false;
        for (var i = 0; i < this.tomlLines.length; i++) {
            var line = this.tomlLines[i];
            var trimmed = line.trim();
            if (!capture && arrayStart(trimmed)) {
                capture = true;
                captureType = "array";
            }
            else if (!capture && stringStart(trimmed)) {
                isLiteral = isLiteralString(trimmed);
                capture = true;
                captureType = "string";
            }
            else if (capture && arrayEnd(trimmed)) {
                merge = true;
            }
            else if (capture && stringEnd(trimmed)) {
                merge = true;
            }
            if (capture) {
                if (isLiteral) {
                    acc.push(line);
                }
                else {
                    acc.push(trimmed);
                }
            }
            else {
                if (isLiteral) {
                    merged.push(line);
                }
                else {
                    merged.push(trimmed);
                }
            }
            if (merge) {
                capture = false;
                merge = false;
                if (captureType === "string") {
                    merged.push(acc
                        .join("\n")
                        .replace(/"""/g, '"')
                        .replace(/'''/g, "'")
                        .replace(/\n/g, "\\n"));
                    isLiteral = false;
                }
                else {
                    merged.push(acc.join(""));
                }
                captureType = "";
                acc = [];
            }
        }
        this.tomlLines = merged;
    };
    Parser.prototype._unflat = function (keys, values, cObj) {
        if (values === void 0) { values = {}; }
        if (cObj === void 0) { cObj = {}; }
        var out = {};
        if (keys.length === 0) {
            return cObj;
        }
        else {
            if (Object.keys(cObj).length === 0) {
                cObj = values;
            }
            var key = keys.pop();
            if (key) {
                out[key] = cObj;
            }
            return this._unflat(keys, values, out);
        }
    };
    Parser.prototype._groupToOutput = function () {
        assert(this.context.currentGroup != null, "currentGroup must be set");
        var arrProperty = this.context.currentGroup.name
            .replace(/"/g, "")
            .replace(/'/g, "")
            .split(".");
        var u = {};
        if (this.context.currentGroup.type === "array") {
            u = this._unflat(arrProperty, this.context.currentGroup.arrValues);
        }
        else {
            u = this._unflat(arrProperty, this.context.currentGroup.objValues);
        }
        deepAssign(this.context.output, u);
        delete this.context.currentGroup;
    };
    Parser.prototype._split = function (str) {
        var out = [];
        out.push.apply(out, str.split("\n"));
        return out;
    };
    Parser.prototype._isGroup = function (line) {
        var t = line.trim();
        return t[0] === "[" && /\[(.*)\]/.exec(t) ? true : false;
    };
    Parser.prototype._isDeclaration = function (line) {
        return line.split("=").length > 1;
    };
    Parser.prototype._createGroup = function (line) {
        var captureReg = /\[(.*)\]/;
        if (this.context.currentGroup) {
            this._groupToOutput();
        }
        var type;
        var m = line.match(captureReg);
        assert(m != null, "line mut be matched");
        var name = m[1];
        if (name.match(/\[.*\]/)) {
            type = "array";
            m = name.match(captureReg);
            assert(m != null, "name must be matched");
            name = m[1];
        }
        else {
            type = "object";
        }
        this.context.currentGroup = new ParserGroup(type, name);
    };
    Parser.prototype._processDeclaration = function (line) {
        var idx = line.indexOf("=");
        var key = line.substring(0, idx).trim();
        var value = this._parseData(line.slice(idx + 1));
        return new KeyValuePair(key, value);
    };
    // TODO (zekth) Need refactor using ACC
    Parser.prototype._parseData = function (dataString) {
        dataString = dataString.trim();
        if (this._isDate(dataString)) {
            return new Date(dataString.split("#")[0].trim());
        }
        if (this._isLocalTime(dataString)) {
            return eval("\"" + dataString.split("#")[0].trim() + "\"");
        }
        var cut3 = dataString.substring(0, 3).toLowerCase();
        var cut4 = dataString.substring(0, 4).toLowerCase();
        if (cut3 === "inf" || cut4 === "+inf") {
            return Infinity;
        }
        if (cut4 === "-inf") {
            return -Infinity;
        }
        if (cut3 === "nan" || cut4 === "+nan" || cut4 === "-nan") {
            return NaN;
        }
        // If binary / octal / hex
        var hex = /(0(?:x|o|b)[0-9a-f_]*)[^#]/gi.exec(dataString);
        if (hex && hex[0]) {
            return hex[0].trim();
        }
        var testNumber = this._isParsableNumber(dataString);
        if (testNumber && !isNaN(testNumber)) {
            return testNumber;
        }
        var invalidArr = /,\]/g.exec(dataString);
        if (invalidArr) {
            dataString = dataString.replace(/,]/g, "]");
        }
        var m = /(?:\'|\[|{|\").*(?:\'|\]|\"|})\s*[^#]/g.exec(dataString);
        if (m) {
            dataString = m[0].trim();
        }
        if (dataString[0] === "{" && dataString[dataString.length - 1] === "}") {
            var reg = /([a-zA-Z0-9-_\.]*) (=)/gi;
            var result = void 0;
            while ((result = reg.exec(dataString))) {
                var ogVal = result[0];
                var newVal = ogVal
                    .replace(result[1], "\"" + result[1] + "\"")
                    .replace(result[2], ":");
                dataString = dataString.replace(ogVal, newVal);
            }
            return JSON.parse(dataString);
        }
        // Handle First and last EOL for multiline strings
        if (dataString.startsWith("\"\\n")) {
            dataString = dataString.replace("\"\\n", "\"");
        }
        else if (dataString.startsWith("'\\n")) {
            dataString = dataString.replace("'\\n", "'");
        }
        if (dataString.endsWith("\\n\"")) {
            dataString = dataString.replace("\\n\"", "\"");
        }
        else if (dataString.endsWith("\\n'")) {
            dataString = dataString.replace("\\n'", "'");
        }
        return eval(dataString);
    };
    Parser.prototype._isLocalTime = function (str) {
        var reg = /(\d{2}):(\d{2}):(\d{2})/;
        return reg.test(str);
    };
    Parser.prototype._isParsableNumber = function (dataString) {
        var m = /((?:\+|-|)[0-9_\.e+\-]*)[^#]/i.exec(dataString.trim());
        if (!m) {
            return false;
        }
        else {
            return parseFloat(m[0].replace(/_/g, ""));
        }
    };
    Parser.prototype._isDate = function (dateStr) {
        var reg = /\d{4}-\d{2}-\d{2}/;
        return reg.test(dateStr);
    };
    Parser.prototype._parseDeclarationName = function (declaration) {
        var out = [];
        var acc = [];
        var inLiteral = false;
        for (var i = 0; i < declaration.length; i++) {
            var c = declaration[i];
            switch (c) {
                case ".":
                    if (!inLiteral) {
                        out.push(acc.join(""));
                        acc = [];
                    }
                    else {
                        acc.push(c);
                    }
                    break;
                case "\"":
                    if (inLiteral) {
                        inLiteral = false;
                    }
                    else {
                        inLiteral = true;
                    }
                    break;
                default:
                    acc.push(c);
                    break;
            }
        }
        if (acc.length !== 0) {
            out.push(acc.join(""));
        }
        return out;
    };
    Parser.prototype._parseLines = function () {
        for (var i = 0; i < this.tomlLines.length; i++) {
            var line = this.tomlLines[i];
            // TODO (zekth) Handle unflat of array of tables
            if (this._isGroup(line)) {
                // if the current group is an array we push the
                // parsed objects in it.
                if (this.context.currentGroup &&
                    this.context.currentGroup.type === "array") {
                    this.context.currentGroup.arrValues.push(this.context.currentGroup.objValues);
                    this.context.currentGroup.objValues = {};
                }
                // If we need to create a group or to change group
                if (!this.context.currentGroup ||
                    (this.context.currentGroup &&
                        this.context.currentGroup.name !==
                            line.replace(/\[/g, "").replace(/\]/g, ""))) {
                    this._createGroup(line);
                    continue;
                }
            }
            if (this._isDeclaration(line)) {
                var kv = this._processDeclaration(line);
                var key = kv.key;
                var value = kv.value;
                if (!this.context.currentGroup) {
                    this.context.output[key] = value;
                }
                else {
                    this.context.currentGroup.objValues[key] = value;
                }
            }
        }
        if (this.context.currentGroup) {
            if (this.context.currentGroup.type === "array") {
                this.context.currentGroup.arrValues.push(this.context.currentGroup.objValues);
            }
            this._groupToOutput();
        }
    };
    Parser.prototype._cleanOutput = function () {
        this._propertyClean(this.context.output);
    };
    Parser.prototype._propertyClean = function (obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (k) {
                var v = obj[k];
                var pathDeclaration = this._parseDeclarationName(k);
                delete obj[k];
                if (pathDeclaration.length > 1) {
                    var shift = pathDeclaration.shift();
                    if (shift) {
                        k = shift.replace(/"/g, "");
                        v = this._unflat(pathDeclaration, v);
                    }
                }
                else {
                    k = k.replace(/"/g, "");
                }
                obj[k] = v;
                if (v instanceof Object) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this._propertyClean(v);
                }
            }
        }
    };
    Parser.prototype.parse = function () {
        this._sanitize();
        this._parseLines();
        this._cleanOutput();
        return this.context.output;
    };
    return Parser;
}());
// Bare keys may only contain ASCII letters,
// ASCII digits, underscores, and dashes (A-Za-z0-9_-).
function joinKeys(keys) {
    // Dotted keys are a sequence of bare or quoted keys joined with a dot.
    // This allows for grouping similar properties together:
    return keys
        .map(function (str) {
        return str.match(/[^A-Za-z0-9_-]/) ? "\"" + str + "\"" : str;
    })
        .join(".");
}
var Dumper = /** @class */ (function () {
    function Dumper(srcObjc) {
        this.maxPad = 0;
        this.output = [];
        this.srcObject = srcObjc;
    }
    Dumper.prototype.dump = function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.output = this._parse(this.srcObject);
        this.output = this._format();
        return this.output;
    };
    Dumper.prototype._parse = function (obj, keys) {
        var _this = this;
        if (keys === void 0) { keys = []; }
        var out = [];
        var props = Object.keys(obj);
        var propObj = props.filter(function (e) {
            if (obj[e] instanceof Array) {
                var d = obj[e];
                return !_this._isSimplySerializable(d[0]);
            }
            return !_this._isSimplySerializable(obj[e]);
        });
        var propPrim = props.filter(function (e) {
            if (obj[e] instanceof Array) {
                var d = obj[e];
                return _this._isSimplySerializable(d[0]);
            }
            return _this._isSimplySerializable(obj[e]);
        });
        var k = propPrim.concat(propObj);
        for (var i = 0; i < k.length; i++) {
            var prop = k[i];
            var value = obj[prop];
            if (value instanceof Date) {
                out.push(this._dateDeclaration([prop], value));
            }
            else if (typeof value === "string" || value instanceof RegExp) {
                out.push(this._strDeclaration([prop], value.toString()));
            }
            else if (typeof value === "number") {
                out.push(this._numberDeclaration([prop], value));
            }
            else if (value instanceof Array &&
                this._isSimplySerializable(value[0])) {
                // only if primitives types in the array
                out.push(this._arrayDeclaration([prop], value));
            }
            else if (value instanceof Array &&
                !this._isSimplySerializable(value[0])) {
                // array of objects
                for (var i_1 = 0; i_1 < value.length; i_1++) {
                    out.push("");
                    out.push(this._headerGroup(__spreadArrays(keys, [prop])));
                    out.push.apply(out, this._parse(value[i_1], __spreadArrays(keys, [prop])));
                }
            }
            else if (typeof value === "object") {
                out.push("");
                out.push(this._header(__spreadArrays(keys, [prop])));
                if (value) {
                    var toParse = value;
                    out.push.apply(out, this._parse(toParse, __spreadArrays(keys, [prop])));
                }
                // out.push(...this._parse(value, `${path}${prop}.`));
            }
        }
        out.push("");
        return out;
    };
    Dumper.prototype._isSimplySerializable = function (value) {
        return (typeof value === "string" ||
            typeof value === "number" ||
            value instanceof RegExp ||
            value instanceof Date ||
            value instanceof Array);
    };
    Dumper.prototype._header = function (keys) {
        return "[" + joinKeys(keys) + "]";
    };
    Dumper.prototype._headerGroup = function (keys) {
        return "[[" + joinKeys(keys) + "]]";
    };
    Dumper.prototype._declaration = function (keys) {
        var title = joinKeys(keys);
        if (title.length > this.maxPad) {
            this.maxPad = title.length;
        }
        return title + " = ";
    };
    Dumper.prototype._arrayDeclaration = function (keys, value) {
        return "" + this._declaration(keys) + JSON.stringify(value);
    };
    Dumper.prototype._strDeclaration = function (keys, value) {
        return this._declaration(keys) + "\"" + value + "\"";
    };
    Dumper.prototype._numberDeclaration = function (keys, value) {
        switch (value) {
            case Infinity:
                return this._declaration(keys) + "inf";
            case -Infinity:
                return this._declaration(keys) + "-inf";
            default:
                return "" + this._declaration(keys) + value;
        }
    };
    Dumper.prototype._dateDeclaration = function (keys, value) {
        function dtPad(v, lPad) {
            if (lPad === void 0) { lPad = 2; }
            return pad(v, lPad, { char: "0" });
        }
        var m = dtPad((value.getUTCMonth() + 1).toString());
        var d = dtPad(value.getUTCDate().toString());
        var h = dtPad(value.getUTCHours().toString());
        var min = dtPad(value.getUTCMinutes().toString());
        var s = dtPad(value.getUTCSeconds().toString());
        var ms = dtPad(value.getUTCMilliseconds().toString(), 3);
        // formated date
        var fData = value.getUTCFullYear() + "-" + m + "-" + d + "T" + h + ":" + min + ":" + s + "." + ms;
        return "" + this._declaration(keys) + fData;
    };
    Dumper.prototype._format = function () {
        var rDeclaration = /(.*)\s=/;
        var out = [];
        for (var i = 0; i < this.output.length; i++) {
            var l = this.output[i];
            // we keep empty entry for array of objects
            if (l[0] === "[" && l[1] !== "[") {
                // empty object
                if (this.output[i + 1] === "") {
                    i += 1;
                    continue;
                }
                out.push(l);
            }
            else {
                var m = rDeclaration.exec(l);
                if (m) {
                    out.push(l.replace(m[1], pad(m[1], this.maxPad, { side: "right" })));
                }
                else {
                    out.push(l);
                }
            }
        }
        // Cleaning multiple spaces
        var cleanedOutput = [];
        for (var i = 0; i < out.length; i++) {
            var l = out[i];
            if (!(l === "" && out[i + 1] === "")) {
                cleanedOutput.push(l);
            }
        }
        return cleanedOutput;
    };
    return Dumper;
}());
export function stringify(srcObj) {
    return new Dumper(srcObj).dump().join("\n");
}
export function parse(tomlString) {
    // File is potentially using EOL CRLF
    tomlString = tomlString.replace(/\r\n/g, "\n").replace(/\\\n/g, "\n");
    return new Parser(tomlString).parse();
}
//# sourceMappingURL=toml.js.map