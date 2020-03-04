/*
 * [js-sha1]{@link https://github.com/emn178/js-sha1}
 *
 * @version 0.6.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
var HEX_CHARS = "0123456789abcdef".split("");
var EXTRA = Uint32Array.of(-2147483648, 8388608, 32768, 128);
var SHIFT = Uint32Array.of(24, 16, 8, 0);
var blocks = new Uint32Array(80);
var Sha1 = /** @class */ (function () {
    function Sha1(sharedMemory) {
        if (sharedMemory === void 0) { sharedMemory = false; }
        this._h0 = 0x67452301;
        this._h1 = 0xefcdab89;
        this._h2 = 0x98badcfe;
        this._h3 = 0x10325476;
        this._h4 = 0xc3d2e1f0;
        this._lastByteIndex = 0;
        if (sharedMemory) {
            this._blocks = blocks.fill(0, 0, 17);
        }
        else {
            this._blocks = new Uint32Array(80);
        }
        this._h0 = 0x67452301;
        this._h1 = 0xefcdab89;
        this._h2 = 0x98badcfe;
        this._h3 = 0x10325476;
        this._h4 = 0xc3d2e1f0;
        this._block = this._start = this._bytes = this._hBytes = 0;
        this._finalized = this._hashed = false;
    }
    Sha1.prototype.update = function (data) {
        if (this._finalized) {
            return;
        }
        var notString = true;
        var message;
        if (data instanceof ArrayBuffer) {
            message = new Uint8Array(data);
        }
        else if (ArrayBuffer.isView(data)) {
            message = new Uint8Array(data.buffer);
        }
        else {
            notString = false;
            message = String(data);
        }
        var code;
        var index = 0;
        var i;
        var start = this._start;
        var length = message.length || 0;
        var blocks = this._blocks;
        while (index < length) {
            if (this._hashed) {
                this._hashed = false;
                blocks[0] = this._block;
                blocks.fill(0, 1, 17);
            }
            if (notString) {
                for (i = start; index < length && i < 64; ++index) {
                    blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                }
            }
            else {
                for (i = start; index < length && i < 64; ++index) {
                    code = message.charCodeAt(index);
                    if (code < 0x80) {
                        blocks[i >> 2] |= code << SHIFT[i++ & 3];
                    }
                    else if (code < 0x800) {
                        blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    }
                    else if (code < 0xd800 || code >= 0xe000) {
                        blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    }
                    else {
                        code =
                            0x10000 +
                                (((code & 0x3ff) << 10) |
                                    (message.charCodeAt(++index) & 0x3ff));
                        blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                        blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                    }
                }
            }
            this._lastByteIndex = i;
            this._bytes += i - start;
            if (i >= 64) {
                this._block = blocks[16];
                this._start = i - 64;
                this.hash();
                this._hashed = true;
            }
            else {
                this._start = i;
            }
        }
        if (this._bytes > 4294967295) {
            this._hBytes += (this._bytes / 4294967296) >>> 0;
            this._bytes = this._bytes >>> 0;
        }
    };
    Sha1.prototype.finalize = function () {
        if (this._finalized) {
            return;
        }
        this._finalized = true;
        var blocks = this._blocks;
        var i = this._lastByteIndex;
        blocks[16] = this._block;
        blocks[i >> 2] |= EXTRA[i & 3];
        this._block = blocks[16];
        if (i >= 56) {
            if (!this._hashed) {
                this.hash();
            }
            blocks[0] = this._block;
            blocks.fill(0, 1, 17);
        }
        blocks[14] = (this._hBytes << 3) | (this._bytes >>> 29);
        blocks[15] = this._bytes << 3;
        this.hash();
    };
    Sha1.prototype.hash = function () {
        var a = this._h0;
        var b = this._h1;
        var c = this._h2;
        var d = this._h3;
        var e = this._h4;
        var f, j, t;
        var blocks = this._blocks;
        for (j = 16; j < 80; ++j) {
            t = blocks[j - 3] ^ blocks[j - 8] ^ blocks[j - 14] ^ blocks[j - 16];
            blocks[j] = (t << 1) | (t >>> 31);
        }
        for (j = 0; j < 20; j += 5) {
            f = (b & c) | (~b & d);
            t = (a << 5) | (a >>> 27);
            e = (t + f + e + 1518500249 + blocks[j]) >>> 0;
            b = (b << 30) | (b >>> 2);
            f = (a & b) | (~a & c);
            t = (e << 5) | (e >>> 27);
            d = (t + f + d + 1518500249 + blocks[j + 1]) >>> 0;
            a = (a << 30) | (a >>> 2);
            f = (e & a) | (~e & b);
            t = (d << 5) | (d >>> 27);
            c = (t + f + c + 1518500249 + blocks[j + 2]) >>> 0;
            e = (e << 30) | (e >>> 2);
            f = (d & e) | (~d & a);
            t = (c << 5) | (c >>> 27);
            b = (t + f + b + 1518500249 + blocks[j + 3]) >>> 0;
            d = (d << 30) | (d >>> 2);
            f = (c & d) | (~c & e);
            t = (b << 5) | (b >>> 27);
            a = (t + f + a + 1518500249 + blocks[j + 4]) >>> 0;
            c = (c << 30) | (c >>> 2);
        }
        for (; j < 40; j += 5) {
            f = b ^ c ^ d;
            t = (a << 5) | (a >>> 27);
            e = (t + f + e + 1859775393 + blocks[j]) >>> 0;
            b = (b << 30) | (b >>> 2);
            f = a ^ b ^ c;
            t = (e << 5) | (e >>> 27);
            d = (t + f + d + 1859775393 + blocks[j + 1]) >>> 0;
            a = (a << 30) | (a >>> 2);
            f = e ^ a ^ b;
            t = (d << 5) | (d >>> 27);
            c = (t + f + c + 1859775393 + blocks[j + 2]) >>> 0;
            e = (e << 30) | (e >>> 2);
            f = d ^ e ^ a;
            t = (c << 5) | (c >>> 27);
            b = (t + f + b + 1859775393 + blocks[j + 3]) >>> 0;
            d = (d << 30) | (d >>> 2);
            f = c ^ d ^ e;
            t = (b << 5) | (b >>> 27);
            a = (t + f + a + 1859775393 + blocks[j + 4]) >>> 0;
            c = (c << 30) | (c >>> 2);
        }
        for (; j < 60; j += 5) {
            f = (b & c) | (b & d) | (c & d);
            t = (a << 5) | (a >>> 27);
            e = (t + f + e - 1894007588 + blocks[j]) >>> 0;
            b = (b << 30) | (b >>> 2);
            f = (a & b) | (a & c) | (b & c);
            t = (e << 5) | (e >>> 27);
            d = (t + f + d - 1894007588 + blocks[j + 1]) >>> 0;
            a = (a << 30) | (a >>> 2);
            f = (e & a) | (e & b) | (a & b);
            t = (d << 5) | (d >>> 27);
            c = (t + f + c - 1894007588 + blocks[j + 2]) >>> 0;
            e = (e << 30) | (e >>> 2);
            f = (d & e) | (d & a) | (e & a);
            t = (c << 5) | (c >>> 27);
            b = (t + f + b - 1894007588 + blocks[j + 3]) >>> 0;
            d = (d << 30) | (d >>> 2);
            f = (c & d) | (c & e) | (d & e);
            t = (b << 5) | (b >>> 27);
            a = (t + f + a - 1894007588 + blocks[j + 4]) >>> 0;
            c = (c << 30) | (c >>> 2);
        }
        for (; j < 80; j += 5) {
            f = b ^ c ^ d;
            t = (a << 5) | (a >>> 27);
            e = (t + f + e - 899497514 + blocks[j]) >>> 0;
            b = (b << 30) | (b >>> 2);
            f = a ^ b ^ c;
            t = (e << 5) | (e >>> 27);
            d = (t + f + d - 899497514 + blocks[j + 1]) >>> 0;
            a = (a << 30) | (a >>> 2);
            f = e ^ a ^ b;
            t = (d << 5) | (d >>> 27);
            c = (t + f + c - 899497514 + blocks[j + 2]) >>> 0;
            e = (e << 30) | (e >>> 2);
            f = d ^ e ^ a;
            t = (c << 5) | (c >>> 27);
            b = (t + f + b - 899497514 + blocks[j + 3]) >>> 0;
            d = (d << 30) | (d >>> 2);
            f = c ^ d ^ e;
            t = (b << 5) | (b >>> 27);
            a = (t + f + a - 899497514 + blocks[j + 4]) >>> 0;
            c = (c << 30) | (c >>> 2);
        }
        this._h0 = (this._h0 + a) >>> 0;
        this._h1 = (this._h1 + b) >>> 0;
        this._h2 = (this._h2 + c) >>> 0;
        this._h3 = (this._h3 + d) >>> 0;
        this._h4 = (this._h4 + e) >>> 0;
    };
    Sha1.prototype.hex = function () {
        this.finalize();
        var h0 = this._h0;
        var h1 = this._h1;
        var h2 = this._h2;
        var h3 = this._h3;
        var h4 = this._h4;
        return (HEX_CHARS[(h0 >> 28) & 0x0f] +
            HEX_CHARS[(h0 >> 24) & 0x0f] +
            HEX_CHARS[(h0 >> 20) & 0x0f] +
            HEX_CHARS[(h0 >> 16) & 0x0f] +
            HEX_CHARS[(h0 >> 12) & 0x0f] +
            HEX_CHARS[(h0 >> 8) & 0x0f] +
            HEX_CHARS[(h0 >> 4) & 0x0f] +
            HEX_CHARS[h0 & 0x0f] +
            HEX_CHARS[(h1 >> 28) & 0x0f] +
            HEX_CHARS[(h1 >> 24) & 0x0f] +
            HEX_CHARS[(h1 >> 20) & 0x0f] +
            HEX_CHARS[(h1 >> 16) & 0x0f] +
            HEX_CHARS[(h1 >> 12) & 0x0f] +
            HEX_CHARS[(h1 >> 8) & 0x0f] +
            HEX_CHARS[(h1 >> 4) & 0x0f] +
            HEX_CHARS[h1 & 0x0f] +
            HEX_CHARS[(h2 >> 28) & 0x0f] +
            HEX_CHARS[(h2 >> 24) & 0x0f] +
            HEX_CHARS[(h2 >> 20) & 0x0f] +
            HEX_CHARS[(h2 >> 16) & 0x0f] +
            HEX_CHARS[(h2 >> 12) & 0x0f] +
            HEX_CHARS[(h2 >> 8) & 0x0f] +
            HEX_CHARS[(h2 >> 4) & 0x0f] +
            HEX_CHARS[h2 & 0x0f] +
            HEX_CHARS[(h3 >> 28) & 0x0f] +
            HEX_CHARS[(h3 >> 24) & 0x0f] +
            HEX_CHARS[(h3 >> 20) & 0x0f] +
            HEX_CHARS[(h3 >> 16) & 0x0f] +
            HEX_CHARS[(h3 >> 12) & 0x0f] +
            HEX_CHARS[(h3 >> 8) & 0x0f] +
            HEX_CHARS[(h3 >> 4) & 0x0f] +
            HEX_CHARS[h3 & 0x0f] +
            HEX_CHARS[(h4 >> 28) & 0x0f] +
            HEX_CHARS[(h4 >> 24) & 0x0f] +
            HEX_CHARS[(h4 >> 20) & 0x0f] +
            HEX_CHARS[(h4 >> 16) & 0x0f] +
            HEX_CHARS[(h4 >> 12) & 0x0f] +
            HEX_CHARS[(h4 >> 8) & 0x0f] +
            HEX_CHARS[(h4 >> 4) & 0x0f] +
            HEX_CHARS[h4 & 0x0f]);
    };
    Sha1.prototype.toString = function () {
        return this.hex();
    };
    Sha1.prototype.digest = function () {
        this.finalize();
        var h0 = this._h0;
        var h1 = this._h1;
        var h2 = this._h2;
        var h3 = this._h3;
        var h4 = this._h4;
        return [
            (h0 >> 24) & 0xff,
            (h0 >> 16) & 0xff,
            (h0 >> 8) & 0xff,
            h0 & 0xff,
            (h1 >> 24) & 0xff,
            (h1 >> 16) & 0xff,
            (h1 >> 8) & 0xff,
            h1 & 0xff,
            (h2 >> 24) & 0xff,
            (h2 >> 16) & 0xff,
            (h2 >> 8) & 0xff,
            h2 & 0xff,
            (h3 >> 24) & 0xff,
            (h3 >> 16) & 0xff,
            (h3 >> 8) & 0xff,
            h3 & 0xff,
            (h4 >> 24) & 0xff,
            (h4 >> 16) & 0xff,
            (h4 >> 8) & 0xff,
            h4 & 0xff
        ];
    };
    Sha1.prototype.array = function () {
        return this.digest();
    };
    Sha1.prototype.arrayBuffer = function () {
        this.finalize();
        return Uint32Array.of(this._h0, this._h1, this._h2, this._h3, this._h4)
            .buffer;
    };
    return Sha1;
}());
export { Sha1 };
//# sourceMappingURL=sha1.js.map
