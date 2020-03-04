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
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var test = Deno.test;
import { assertEquals } from "../testing/asserts.js";
import { Logger } from "./logger.js";
import { LogLevel } from "./levels.js";
import { BaseHandler } from "./handlers.js";
var TestHandler = /** @class */ (function (_super) {
    __extends(TestHandler, _super);
    function TestHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messages = [];
        _this.records = [];
        return _this;
    }
    TestHandler.prototype.handle = function (record) {
        this.records.push(__assign({}, record));
        _super.prototype.handle.call(this, record);
    };
    TestHandler.prototype.log = function (str) {
        this.messages.push(str);
    };
    return TestHandler;
}(BaseHandler));
test(function simpleLogger() {
    var handler = new TestHandler("DEBUG");
    var logger = new Logger("DEBUG");
    assertEquals(logger.level, LogLevel.DEBUG);
    assertEquals(logger.levelName, "DEBUG");
    assertEquals(logger.handlers, []);
    logger = new Logger("DEBUG", [handler]);
    assertEquals(logger.handlers, [handler]);
});
test(function customHandler() {
    var handler = new TestHandler("DEBUG");
    var logger = new Logger("DEBUG", [handler]);
    logger.debug("foo", 1, 2);
    var record = handler.records[0];
    assertEquals(record.msg, "foo");
    assertEquals(record.args, [1, 2]);
    assertEquals(record.level, LogLevel.DEBUG);
    assertEquals(record.levelName, "DEBUG");
    assertEquals(handler.messages, ["DEBUG foo"]);
});
test(function logFunctions() {
    var doLog = function (level) {
        var handler = new TestHandler(level);
        var logger = new Logger(level, [handler]);
        logger.debug("foo");
        logger.info("bar");
        logger.warning("baz");
        logger.error("boo");
        logger.critical("doo");
        return handler;
    };
    var handler;
    handler = doLog("DEBUG");
    assertEquals(handler.messages, [
        "DEBUG foo",
        "INFO bar",
        "WARNING baz",
        "ERROR boo",
        "CRITICAL doo"
    ]);
    handler = doLog("INFO");
    assertEquals(handler.messages, [
        "INFO bar",
        "WARNING baz",
        "ERROR boo",
        "CRITICAL doo"
    ]);
    handler = doLog("WARNING");
    assertEquals(handler.messages, ["WARNING baz", "ERROR boo", "CRITICAL doo"]);
    handler = doLog("ERROR");
    assertEquals(handler.messages, ["ERROR boo", "CRITICAL doo"]);
    handler = doLog("CRITICAL");
    assertEquals(handler.messages, ["CRITICAL doo"]);
});
//# sourceMappingURL=logger_test.js.map
