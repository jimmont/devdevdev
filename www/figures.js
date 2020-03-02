/*
derivative of https://unpkg.com/figures log-symbols
 */
const chars = {
	[Symbol.for('key')]: ["default", "windows", "ubuntu", undefined, undefined],
	"arrowDown": ["↓"],
	"arrowLeft": ["←"],
	"arrowRight": ["→"],
	"arrowUp": ["↑"],
	"bullet": ["●", "*"],
	"checkboxCircleOff": ["Ⓘ", "( )"],
	"checkboxCircleOn": ["ⓧ", "(×)"],
	"checkboxOff": ["☐", "[ ]"],
	"checkboxOn": ["☒", "[×]"],
	"circle": ["◯", "( )"],
	"circleCircle": ["ⓞ", "(○)"],
	"circleCross": ["ⓧ", "(×)"],
	"circleDotted": ["◌", "( )"],
	"circleDouble": ["◎", "( )"],
	"circleFilled": ["◉", "(*)"],
	"circlePipe": ["Ⓘ", "(│)"],
	"circleQuestionMark": ["?⃝", "(?)"],
	"cross": ["✖", "×"],
	"dot": ["․", "."],
	"ellipsis": ["…", "..."],
	"fiveEighths": ["⅝", "5/8"],
	"fiveSixths": ["⅚", "5/6"],
	"fourFifths": ["⅘", "4/5"],
	"hamburger": ["☰", "≡"],
	"heart": ["♥"],
	"info": ["ℹ", "i"],
	"line": ["─", "─"],
	"mustache": ["෴", "┌─┐"],
	"nodejs": ["⬢", "♦"],
	"oneEighth": ["⅛", "1/8"],
	"oneFifth": ["⅕", "1/5"],
	"oneHalf": ["½", "1/2"],
	"oneNinth": ["⅑", "1/9"],
	"oneQuarter": ["¼", "1/4"],
	"oneSeventh": ["⅐", "1/7"],
	"oneSixth": ["⅙", "1/6"],
	"oneTenth": ["⅒", "1/10"],
	"oneThird": ["⅓", "1/3"],
	"play": ["▶", "►"],
	"pointer": ["❯", ">"],
	"pointerSmall": ["›", "»"],
	"questionMarkPrefix": ["?⃝", "？", "?"],
	"radioOff": ["◯", "( )"],
	"radioOn": ["◉", "(*)"],
	"sevenEighths": ["⅞", "7/8"],
	"smiley": ["㋡", "☺"],
	"square": ["▇", "█"],
	"squareSmall": ["◻", "[ ]"],
	"squareSmallFilled": ["◼", "[█]"],
	"star": ["★", "*"],
	"threeEighths": ["⅜", "3/8"],
	"threeFifths": ["⅗", "3/5"],
	"threeQuarters": ["¾", "3/4"],
	"tick": ["✔", "√"],
	"twoFifths": ["⅖", "2/5"],
	"twoThirds": ["⅔", "2/3"],
	"warning": ["⚠", "‼"]
};

function entriesForIndex(result, item){
	const [name, chars] = item;
	let char = chars[ result.index ];
	if(char === undefined){
		// default
		char = chars[0];
	};
	result.chars[ name ] = char;
	return result;
}
function keyIndex(name='', list){
	const key = (name+'').trim().toLowerCase();
	return list.findIndex(name=>key===name);
}
function onlyChars(forKey=0){
	const key = chars[Symbol.for('key')];
	const index = typeof forKey === 'string' ? keyIndex(forKey, list) : forKey;
	if(key[ index ] === undefined){
		return null;
	};
	const result = Object.entries(chars).reduce(entriesForIndex, {index, chars:{}}).chars;
	result[ Symbol.for('key') ] = key[ index ];
	return result;
}

const util = Object.defineProperties({}, {
	platform: {
		value: 0
		,writable: true
		,enumerable: true
	}
	,key: {
		value: chars[Symbol.for('key')]
		,enumerable: true
	}
	,lookup: {
		value: function(name, index=0){
			let options = chars[name];
			let char = options[index]
			if(!char) return chars[0];
			return char;
		}
		,enumerable: true
	}
	,rehash: {
		value: onlyChars
		,enumerable: true
	}
	,proxy: {
		get: function($, key){
			return $[key][this[Symbol.for('platform')]];
		}
		,enumerable: true
	}
});

chars[ Symbol.for('util') ] = util;

export { chars as default, chars, util };
