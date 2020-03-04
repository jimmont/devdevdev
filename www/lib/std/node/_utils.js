export function notImplemented(msg) {
    var message = msg ? "Not implemented: " + msg : "Not implemented";
    throw new Error(message);
}
export function intoCallbackAPI(
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
func, cb) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    var args = [];
    for (
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    var _i = 2; 
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    _i < arguments.length; 
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    _i++) {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        args[_i - 2] = arguments[_i];
    }
    func.apply(void 0, args).then(function (value) { return cb && cb(null, value); })["catch"](function (err) { return cb && cb(err, null); });
}
export function intoCallbackAPIWithIntercept(
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
func, interceptor, cb) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    var args = [];
    for (
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    var _i = 3; 
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    _i < arguments.length; 
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    _i++) {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        args[_i - 3] = arguments[_i];
    }
    func.apply(void 0, args).then(function (value) { return cb && cb(null, interceptor(value)); })["catch"](function (err) { return cb && cb(err, null); });
}
//# sourceMappingURL=_utils.js.map