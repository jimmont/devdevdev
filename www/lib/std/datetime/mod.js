// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { pad } from "../strings/pad.ts";
import { assert } from "../testing/asserts.ts";
function execForce(reg, pat) {
    var v = reg.exec(pat);
    assert(v != null);
    return v;
}
/**
 * Parse date from string using format string
 * @param dateStr Date string
 * @param format Format string
 * @return Parsed date
 */
export function parseDate(dateStr, format) {
    var _a, _b, _c;
    var m, d, y;
    var datePattern;
    switch (format) {
        case "mm-dd-yyyy":
            datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
            _a = execForce(datePattern, dateStr), m = _a[1], d = _a[2], y = _a[3];
            break;
        case "dd-mm-yyyy":
            datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
            _b = execForce(datePattern, dateStr), d = _b[1], m = _b[2], y = _b[3];
            break;
        case "yyyy-mm-dd":
            datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
            _c = execForce(datePattern, dateStr), y = _c[1], m = _c[2], d = _c[3];
            break;
        default:
            throw new Error("Invalid date format!");
    }
    return new Date(Number(y), Number(m) - 1, Number(d));
}
/**
 * Parse date & time from string using format string
 * @param dateStr Date & time string
 * @param format Format string
 * @return Parsed date
 */
export function parseDateTime(datetimeStr, format) {
    var _a, _b, _c, _d, _e, _f;
    var m, d, y, ho, mi;
    var datePattern;
    switch (format) {
        case "mm-dd-yyyy hh:mm":
            datePattern = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/;
            _a = execForce(datePattern, datetimeStr), m = _a[1], d = _a[2], y = _a[3], ho = _a[4], mi = _a[5];
            break;
        case "dd-mm-yyyy hh:mm":
            datePattern = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/;
            _b = execForce(datePattern, datetimeStr), d = _b[1], m = _b[2], y = _b[3], ho = _b[4], mi = _b[5];
            break;
        case "yyyy-mm-dd hh:mm":
            datePattern = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;
            _c = execForce(datePattern, datetimeStr), y = _c[1], m = _c[2], d = _c[3], ho = _c[4], mi = _c[5];
            break;
        case "hh:mm mm-dd-yyyy":
            datePattern = /^(\d{2}):(\d{2}) (\d{2})-(\d{2})-(\d{4})$/;
            _d = execForce(datePattern, datetimeStr), ho = _d[1], mi = _d[2], m = _d[3], d = _d[4], y = _d[5];
            break;
        case "hh:mm dd-mm-yyyy":
            datePattern = /^(\d{2}):(\d{2}) (\d{2})-(\d{2})-(\d{4})$/;
            _e = execForce(datePattern, datetimeStr), ho = _e[1], mi = _e[2], d = _e[3], m = _e[4], y = _e[5];
            break;
        case "hh:mm yyyy-mm-dd":
            datePattern = /^(\d{2}):(\d{2}) (\d{4})-(\d{2})-(\d{2})$/;
            _f = execForce(datePattern, datetimeStr), ho = _f[1], mi = _f[2], y = _f[3], m = _f[4], d = _f[5];
            break;
        default:
            throw new Error("Invalid datetime format!");
    }
    return new Date(Number(y), Number(m) - 1, Number(d), Number(ho), Number(mi));
}
/**
 * Get number of the day in the year
 * @return Number of the day in year
 */
export function dayOfYear(date) {
    var dayMs = 1000 * 60 * 60 * 24;
    var yearStart = new Date(date.getFullYear(), 0, 0);
    var diff = date.getTime() -
        yearStart.getTime() +
        (yearStart.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    return Math.floor(diff / dayMs);
}
/**
 * Get number of current day in year
 * @return Number of current day in year
 */
export function currentDayOfYear() {
    return dayOfYear(new Date());
}
/**
 * Parse a date to return a IMF formated string date
 * RFC: https://tools.ietf.org/html/rfc7231#section-7.1.1.1
 * IMF is the time format to use when generating times in HTTP
 * headers. The time being formatted must be in UTC for Format to
 * generate the correct format.
 * @param date Date to parse
 * @return IMF date formated string
 */
export function toIMF(date) {
    function dtPad(v, lPad) {
        if (lPad === void 0) { lPad = 2; }
        return pad(v, lPad, { char: "0" });
    }
    var d = dtPad(date.getUTCDate().toString());
    var h = dtPad(date.getUTCHours().toString());
    var min = dtPad(date.getUTCMinutes().toString());
    var s = dtPad(date.getUTCSeconds().toString());
    var y = date.getUTCFullYear();
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    return days[date.getUTCDay()] + ", " + d + " " + months[date.getUTCMonth()] + " " + y + " " + h + ":" + min + ":" + s + " GMT";
}
//# sourceMappingURL=mod.js.map