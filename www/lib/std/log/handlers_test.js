var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var test = Deno.test;
import { assertEquals } from "../testing/asserts.ts";
import { LogLevel, getLevelName, getLevelByName } from "./levels.ts";
import { BaseHandler } from "./handlers.ts";
var TestHandler = /** @class */ (function (_super) {
    __extends(TestHandler, _super);
    function TestHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messages = [];
        return _this;
    }
    TestHandler.prototype.log = function (str) {
        this.messages.push(str);
    };
    return TestHandler;
}(BaseHandler));
test(function simpleHandler() {
    var cases = new Map([
        [
            LogLevel.DEBUG,
            [
                "DEBUG debug-test",
                "INFO info-test",
                "WARNING warning-test",
                "ERROR error-test",
                "CRITICAL critical-test"
            ]
        ],
        [
            LogLevel.INFO,
            [
                "INFO info-test",
                "WARNING warning-test",
                "ERROR error-test",
                "CRITICAL critical-test"
            ]
        ],
        [
            LogLevel.WARNING,
            ["WARNING warning-test", "ERROR error-test", "CRITICAL critical-test"]
        ],
        [LogLevel.ERROR, ["ERROR error-test", "CRITICAL critical-test"]],
        [LogLevel.CRITICAL, ["CRITICAL critical-test"]]
    ]);
    for (var _i = 0, _a = cases.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], testCase = _b[0], messages = _b[1];
        var testLevel = getLevelName(testCase);
        var handler = new TestHandler(testLevel);
        for (var levelName in LogLevel) {
            var level = getLevelByName(levelName);
            handler.handle({
                msg: levelName.toLowerCase() + "-test",
                args: [],
                datetime: new Date(),
                level: level,
                levelName: levelName
            });
        }
        assertEquals(handler.level, testCase);
        assertEquals(handler.levelName, testLevel);
        assertEquals(handler.messages, messages);
    }
});
test(function testFormatterAsString() {
    var handler = new TestHandler("DEBUG", {
        formatter: "test {levelName} {msg}"
    });
    handler.handle({
        msg: "Hello, world!",
        args: [],
        datetime: new Date(),
        level: LogLevel.DEBUG,
        levelName: "DEBUG"
    });
    assertEquals(handler.messages, ["test DEBUG Hello, world!"]);
});
test(function testFormatterAsFunction() {
    var handler = new TestHandler("DEBUG", {
        formatter: function (logRecord) {
            return "fn formmatter " + logRecord.levelName + " " + logRecord.msg;
        }
    });
    handler.handle({
        msg: "Hello, world!",
        args: [],
        datetime: new Date(),
        level: LogLevel.ERROR,
        levelName: "ERROR"
    });
    assertEquals(handler.messages, ["fn formmatter ERROR Hello, world!"]);
});
//# sourceMappingURL=handlers_test.js.map