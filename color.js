/* Color class for handling color objects from picker events, parsing and generating CSS color values
 * ```js
 *	const color1 = new Color({r: 255, g: 255, b: 255}); // color1.hex returns '#fff'
 *	const color2 = new Color('hsl(204, 255, 0)').hex // returns #cf0
 * ```
 * */
export default class Color {
	/* cast input to a number, optionally scale the number relative to another
	 * @param {number} relativeTo - percent converted to number relative to this value, default 1
	 * @returns a number
	 * @example
	 *	Color.number(undefined) 0; Color.number('50%') .5;
	 *	Color.number('255') 255; Color.number('50%', 255) 127.5;
	 *	Color.number('0xFF') 255;
	 * */
	static number(input, relativeTo = 1) {
		let n;
		if (typeof input === 'string' && input.endsWith('%')) {
			// '50%' -> .5; '50%' of 50 -> 25
			n = ((Number(input.slice(0, -1)) || 0) / 100) * relativeTo;
		} else {
			n = Number(input) || 0;
		}
		return n;
	}

	/*
		 parse input to an expected color dictionary describing a color
		 @param {object|string} input - like css strings 'rgb(0,0,0)' 'hsl(1turn, 50%, 50% / 0.5)' '#11223344' and objects {r:255,g:255,b:255} from vanilla-colorful picker events for various types
		 @returns {type: 'rgb|hsl', r, g, b, h, s, l, a, grad: 'deg|grad|rad|turn'} with whatever values correlate, all number values on properties except type (and angle for hsl)
		 */
	static parse(input) {
		let output = {};
		let alpha;
		if (typeof input === 'object') {
			// numeric values only
			const { r, g, b, h, s, l, a, angle = 'deg' } = input;
			if (typeof r === 'number') {
				// clone
				output = { r, g, b, a };
			} else if (typeof h === 'number') {
				output = { h, s, l, a, angle };
			}
		} else if (typeof input === 'string') {
			const txt = input.trim();
			let r;
			let g;
			let b;
			let a;
			if (txt.startsWith('#')) {
				// hex as #rgb #rgba #rrggbb #rrggbbaa
				const size = txt.length;
				// F => '0xFF' => 255
				if (size <= 5) {
					r = Color.number(`0x${txt[1]}${txt[1]}`);
					g = Color.number(`0x${txt[2]}${txt[2]}`);
					b = Color.number(`0x${txt[3]}${txt[3]}`);
					// alpha #F => 0xFF => 255 => 1
					if (size > 4) a = Color.number(`0x${txt[4]}${txt[4]}`) / 255;
				} else {
					r = Color.number(`0x${txt[1]}${txt[2]}`);
					g = Color.number(`0x${txt[3]}${txt[4]}`);
					b = Color.number(`0x${txt[5]}${txt[6]}`);
					// alpha #00 => 0 => 0; #FF => 255 => 1
					if (size > 7) a = Color.number(`0x${txt[7]}${txt[8]}`) / 255;
				}
				alpha = a;
				output = { r, g, b };
			} else if (txt.startsWith('rgb') || txt.startsWith('hsl')) {
				// color-function(value)
				const [prefix = '', value = ''] = txt.split(/[()]/);
				// (r|h, g|s, b|l, a) number percent% number / 0.5 comma, or space or / separated
				const [v1 = '', v2 = '', v3 = '', v4] = value.trim().split(/[,\s/]+/) ?? [];
				if (prefix.startsWith('hsl')) {
					// hue = deg (default) | rad | grad | turn on color wheel
					// sat % saturated 100% to unsaturated gray 0%
					// lightness % 100% white to 0% black
					// deg rad grad turn https://developer.mozilla.org/en-US/docs/Web/CSS/angle
					let [s, h = '', angle = '', l] = v1.match(/^([0-9.]+)([a-z]*)/) ?? [];
					if (!/deg|turn|grad|rad/.test(angle)) angle = 'deg';
					h = Color.number(h);
					// s and l percentages %
					s = Color.number(v2);
					l = Color.number(v3);
					output = { h, s, l, angle };
				} else {
					// % or number
					r = Color.number(v1, 255);
					g = Color.number(v2, 255);
					b = Color.number(v3, 255);
					output = { r, g, b };
				}

				if (v4) {
					a = Color.number(v4);
				}
				alpha = a;
			}
			if (alpha !== undefined) {
				alpha = Color.number(alpha);
				if (alpha < 0) {
					alpha = 0;
				} else if (alpha > 1) {
					alpha = 1;
				}
				output.a = alpha;
			}
		}
		return output;
	}

	static convertRGBtoHSL(r, g, b) {
		// cannot convert from rgb if no valid number
		if (typeof r !== 'number') throw new Error('missing red for conversion to HSL');

		const [red, green, blue] = [r / 255, g / 255, b / 255];
		const [min, max] = [Math.min(red, green, blue), Math.max(red, green, blue)];
		const diff = max - min;
		let h;
		let s;
		let l;
		h = s = l = 0; /* eslint-disable-line no-multi-assign */
		if (diff === 0) {
			h = 0;
		} else if (max === red) {
			h = ((green - blue) / diff) % 6;
		} else if (max === green) {
			h = (blue - red) / diff + 2;
		} else {
			h = (red - green) / diff + 4;
		}
		const angle = 'deg';
		// degrees is the default, range 0 to 360°
		h = Math.round(h * 60) % 360;
		// -10 -> 350°
		if (h < 0) h += 360;

		// lightness
		l = (max + min) / 2;
		// saturation
		s = diff / (1 - Math.abs(2 * l - 1));

		return { h, s, l, angle };
	}

	static convertHSLtoRGB(hue, saturation, luminescence, angleUnits = 'deg') {
		// cannot convert from hsl if no valid number
		if (typeof hue !== 'number') throw new Error('missing hue for conversion to RGB');

		let degrees = hue;
		if (!angleUnits.includes('deg')) {
			if (angleUnits.includes('rad')) {
				degrees = (hue * 180) / Math.PI;
			} else if (angleUnits.includes('grad')) {
				degrees = (hue * 360) / 400;
			} else if (angleUnits.includes('turn')) {
				degrees = hue * 360;
			}
		}

		let r;
		let g;
		let b;
		r = g = b = 0; /* eslint-disable-line no-multi-assign */

		const chroma = (1 - Math.abs(2 * luminescence - 1)) * saturation;
		const x = chroma * (1 - Math.abs(((degrees / 60) % 2) - 1));
		const m = luminescence - chroma / 2;

		// color wheel 60° segments, so 6 sections ~ 0-5
		const section = Math.floor((degrees % 360) / 60);
		switch (section) {
			case 0: // 0-59
				r = chroma;
				g = x;
				b = 0;
				break;
			case 1: // 60-119
				r = x;
				g = chroma;
				b = 0;
				break;
			case 2: // 120-179
				r = 0;
				g = chroma;
				b = x;
				break;
			case 3: // 180-239
				r = 0;
				g = x;
				b = chroma;
				break;
			case 4: // 240-299
				r = x;
				g = 0;
				b = chroma;
				break;
			default:
				// 5: 300-359
				r = chroma;
				g = 0;
				b = x;
		}

		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);

		return { r, g, b };
	}

	toHSL() {
		// set h,s,l from r,g,b
		const { r, g, b } = this;

		const convert = Color.convertRGBtoHSL(r, g, b);

		Object.assign(this, convert);

		return this;
	}

	toRGB() {
		// set r,g,b from h,s,l
		const { h, s, l, angle = 'deg' } = this;

		const convert = Color.convertHSLtoRGB(h, s, l, angle);

		Object.assign(this, convert);

		return this;
	}

	constructor(colorLike) {
		const input = Color.parse(colorLike);
		Object.assign(this, { a: 1 }, input);
	}

	// explicit rgba(r,g,b, alpha)
	get rgba() {
		return this.toString('rgba');
	}

	// rgb(r,g,b) include alpha when it exists
	get rgb() {
		return this.toString('rgb');
	}

	// hsl(h, s, l, a) hsl includes optional alpha when exists
	get hsl() {
		return this.toString('hsl');
	}

	// #rgb and alpha when it exists #rrggbbaa
	get hex() {
		return this.toString('hex');
	}

	toString(as = 'hex') {
		let { r, g, b, h, s, l, a, angle } = this; /* eslint-disable-line prefer-const */
		// nothing to convert between
		if (typeof r !== 'number' && typeof h !== 'number') return 'Invalid Color';
		let prefix = as || (typeof h === 'number' ? 'hsl' : 'rgb');
		let alpha = '';
		if (prefix.endsWith('a') || (a >= 0 && a < 1)) {
			a = +a || 0; // ensure valid number from anything
			if (a < 0 || a > 1) {
				a = 1; // resolve out of bounds to default
			}
			// ok 0, 1, 0.67, max to hundredths: 0.12, no trailing 0, so 0.10 -> 0.1
			alpha = a.toPrecision(2);
			if (alpha.length > 2 && alpha.endsWith('0')) {
				alpha = a.toPrecision(1);
			}
		}
		if (prefix.startsWith('hsl')) {
			if (typeof h !== 'number') {
				this.toHSL();
				h = this.h;
				s = this.s;
				l = this.l;
			}
			const hsl = [h + (angle || ''), `${(s * 100).toFixed()}%`, `${(l * 100).toFixed()}%`];
			if (alpha) hsl.push(alpha);
			return `hsl(${hsl.join(', ')})`;
		}
		// rgb | hex
		if (typeof r !== 'number') {
			this.toRGB();
			r = this.r;
			g = this.g;
			b = this.b;
		}
		if (prefix.startsWith('hex')) {
			const rgb = [r, g, b];
			if (alpha) {
				// FF === 255; 00 = 0; range 0-1; (alpha * 255).toString(16)
				rgb.push(Math.round(a * 255));
			}
			const short = ['', ''];
			const rrggbb = rgb.map((n) => {
				if (n === undefined) return '';
				let hx = n.toString(16);
				if (hx.length < 2) hx = `0${hx}`;
				const [h0, h1] = hx.split('');
				short[0] += h0;
				short[1] += h1;
				return hx;
			});
			const hex = short[0];
			return `#${hex === short[1] ? hex : rrggbb.join('')}`;
		}
		if (prefix.startsWith('rgb')) {
			const rgb = [r, g, b];
			prefix = 'rgb';
			if (alpha) {
				prefix = 'rgba';
				rgb.push(alpha);
			}
			return `${prefix}(${rgb.join(', ')})`;
		}

		return 'Invalid Color';
	}
}
