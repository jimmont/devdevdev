import { assert } from "../testing/asserts.js";
import { toIMF } from "../datetime/mod.js";
function toString(cookie) {
    var out = [];
    out.push(cookie.name + "=" + cookie.value);
    // Fallback for invalid Set-Cookie
    // ref: https://tools.ietf.org/html/draft-ietf-httpbis-cookie-prefixes-00#section-3.1
    if (cookie.name.startsWith("__Secure")) {
        cookie.secure = true;
    }
    if (cookie.name.startsWith("__Host")) {
        cookie.path = "/";
        cookie.secure = true;
        delete cookie.domain;
    }
    if (cookie.secure) {
        out.push("Secure");
    }
    if (cookie.httpOnly) {
        out.push("HttpOnly");
    }
    if (typeof cookie.maxAge === "number" && Number.isInteger(cookie.maxAge)) {
        assert(cookie.maxAge > 0, "Max-Age must be an integer superior to 0");
        out.push("Max-Age=" + cookie.maxAge);
    }
    if (cookie.domain) {
        out.push("Domain=" + cookie.domain);
    }
    if (cookie.sameSite) {
        out.push("SameSite=" + cookie.sameSite);
    }
    if (cookie.path) {
        out.push("Path=" + cookie.path);
    }
    if (cookie.expires) {
        var dateString = toIMF(cookie.expires);
        out.push("Expires=" + dateString);
    }
    if (cookie.unparsed) {
        out.push(cookie.unparsed.join("; "));
    }
    return out.join("; ");
}
/**
 * Parse the cookies of the Server Request
 * @param req Server Request
 */
export function getCookies(req) {
    var cookie = req.headers.get("Cookie");
    if (cookie != null) {
        var out = {};
        var c = cookie.split(";");
        for (var _i = 0, c_1 = c; _i < c_1.length; _i++) {
            var kv = c_1[_i];
            var _a = kv.split("="), cookieKey = _a[0], cookieVal = _a.slice(1);
            assert(cookieKey != null);
            var key = cookieKey.trim();
            out[key] = cookieVal.join("=");
        }
        return out;
    }
    return {};
}
/**
 * Set the cookie header properly in the Response
 * @param res Server Response
 * @param cookie Cookie to set
 * @param [cookie.name] Name of the cookie
 * @param [cookie.value] Value of the cookie
 * @param [cookie.expires] Expiration Date of the cookie
 * @param [cookie.maxAge] Max-Age of the Cookie. Must be integer superior to 0
 * @param [cookie.domain] Specifies those hosts to which the cookie will be sent
 * @param [cookie.path] Indicates a URL path that must exist in the request.
 * @param [cookie.secure] Indicates if the cookie is made using SSL & HTTPS.
 * @param [cookie.httpOnly] Indicates that cookie is not accessible via
 *                          Javascript
 * @param [cookie.sameSite] Allows servers to assert that a cookie ought not to
 *                          be sent along with cross-site requests
 * Example:
 *
 *     setCookie(response, { name: 'deno', value: 'runtime',
 *        httpOnly: true, secure: true, maxAge: 2, domain: "deno.land" });
 */
export function setCookie(res, cookie) {
    if (!res.headers) {
        res.headers = new Headers();
    }
    // TODO (zekth) : Add proper parsing of Set-Cookie headers
    // Parsing cookie headers to make consistent set-cookie header
    // ref: https://tools.ietf.org/html/rfc6265#section-4.1.1
    res.headers.set("Set-Cookie", toString(cookie));
}
/**
 *  Set the cookie header properly in the Response to delete it
 * @param res Server Response
 * @param name Name of the cookie to Delete
 * Example:
 *
 *     delCookie(res,'foo');
 */
export function delCookie(res, name) {
    setCookie(res, {
        name: name,
        value: "",
        expires: new Date(0)
    });
}
//# sourceMappingURL=cookie.js.map
