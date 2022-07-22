import Color from './color.js';
import { assert } from './testing.js';

Deno.test('Color class, parse, conversion, toString of hex,rgb,hsl', () => {
	const textSamples = [
		'#000',
		' #cf0f',
		'#ff0022',
		'#001122ff',
		' rgb(255, 255, 255)',
		' rgba(255, 255, 255, 100%)',
		' rgb(255, 50%, 255, 100%)',
		'rgb(200, 50%, 255, 100%)',
		'hsl(200, 50%, 100%)',
	];

	textSamples.forEach((sample) => {
		const color = new Color(sample);
		const parsed = Color.parse(sample);
		for (const prop in parsed) {
			assert(color[prop] === parsed[prop]);
		}
		assert(color instanceof Color, 'is a Color object');
		let { r, g, b, a, h, s, l } = color;
		if (sample.includes('#') || sample.includes('rgb')) {
			assert(typeof r === 'number' && !isNaN(r) && r >= 0 && r <= 255, 'valid red');
			assert(typeof g === 'number' && !isNaN(g) && g >= 0 && g <= 255, 'valid green');
			assert(typeof b === 'number' && !isNaN(b) && b >= 0 && b <= 255, 'valid blue');
		} else if (sample.includes('rgb')) {
			assert(typeof r === 'number' && !isNaN(r) && r >= 0 && r <= 255, 'valid red');
			assert(typeof g === 'number' && !isNaN(g) && g >= 0 && g <= 255, 'valid green');
			assert(typeof b === 'number' && !isNaN(b) && b >= 0 && b <= 255, 'valid blue');
			assert(
				h === undefined && s === undefined && l === undefined,
				'no hue on rgb colors by-default'
			);

			const { hsl } = color;
			h = color.h;
			s = color.s;
			l = color.l;
			assert(
				typeof h === 'number' && typeof s === 'number' && typeof l === 'number',
				`conversion toHSL() adds hue, saturation and luminescence`
			);
			assert(/^hsl\(\d+[^)]+\)$/.assert(hsl), `expected hsl(h, s, l) pattern: ${hsl}`);
		} else if (sample.includes('hsl')) {
			assert(typeof h === 'number' && !isNaN(h), 'valid hue');
			assert(typeof s === 'number' && !isNaN(s) && s >= 0 && s <= 1, 'valid saturation');
			assert(typeof l === 'number' && !isNaN(l) && l >= 0 && l <= 1, 'valid luminescence');
			assert(color.r === undefined, 'missing red value for hsl color');
			const hex = color.toString();
			assert(typeof color.r === 'number', 'calling toString() defaults to hex which uses rgb');
			assert(/^#[a-z0-9]{3,8}$/i.test(hex), 'hex value looks valid, like #rgb #rgba to #rrggbbaa');
		}
		if (a !== undefined) {
			assert(!isNaN(a) && a >= 0 && a <= 1, `valid alpha in range 0-1 for ${a} ${sample}`);
		}
	});
});

Deno.test('Color class handling specific color conversion', () => {
	let acolor;
	let avalue;
	acolor = new Color('#cf0a');
	avalue = acolor.hsl;
	assert(acolor.hex === '#cf0a', `expected yellow #cf0a ${acolor}`);
	assert(acolor.r === 204 && acolor.h === 72, `expected red 204 and hue 72 in color`);
	assert(avalue === 'hsl(72, 100%, 50%, 0.67)', `expected #cf0a toHSL() ${avalue}`);
	acolor = new Color('hsl(72 100% 50%)');
	avalue = acolor.hex;
	assert(avalue === '#cf0', `expected yellow hsl(72, 100% 50%) ${acolor}`);
	assert(acolor.r === 204 && acolor.h === 72, `expected red 204 and hue 72 in color`);
});

Deno.test('Color.number() handling string->number', () => {
	const colorNumberSamples = [
		[['255'], 255],
		[[], 0],
		[[''], 0],
		[['0xff'], 255],
		[['0.5'], 0.5],
		[['100%'], 1],
		[['100%', 255], 255],
		[['50%', 255], 127.5],
		[['0%', 255], 0],
		[['50%', 50], 25],
		[['50%'], 0.5],
		[['0xFF'], 255],
		[['0x00'], 0],
		[[1, 2], 1],
		[['1', 3], 1],
	];

	colorNumberSamples.forEach(([args, expected]) => {
		const n = Color.number(...args);
		assert(n === expected, `${n} should be: ${expected}, Color.number(${args.join(', ')})`);
	});
});
