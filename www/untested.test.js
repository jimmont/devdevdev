import { describe, xdescribe, Describe } from './untested.js';

/*
	basic tests of the library

	TODO
	* events on window
	* test methods directly
	* returning different promises
*/
const model = { };

model.arrow = {};

describe('untested arrow fn works', (it)=>{
	const item = model.arrow;
	item.status = 0;
	it.should('make assertions with arrow fn', (test)=>{
		item.status++;
		it.assert(1 === item.status, 'make a basic assertion');
		it.assert(it.assert === test.assert, 'passed argument matches')
	});
	it.assert(0 === item.status, 'assert is synchronous here directly inside a describe');
	it.xassert(false, 'failing assertion should be ignored');
	it.assert(it._failed === 0, 'successfully ignored xassert of failing assertion');
	
	it.should('work with named+anonymous functions', function(it){
		this.assert(it === this, 'passed argument matches "this"');
		it.xassert(false, 'ignore a failing assertion');
	});
})

model.ignored = true;
xdescribe('ignored', ()=>{
	model.ignored = false;
	this.assert(false, 'this is ignored in xdescribe');
});


describe('untested named and anonymous functions work', function(it){
	const hold = console;
	const failMsg = 'untested example test failure';
	this.before(()=>{
		self.console = {
			assert: function(truthy, msg){
				if(!truthy){
					model.error = msg;
					if(failMsg !== msg){
						debugger;
						throw 'unexpected failure';
					}
				}
			}
		};
	});
	this.after(()=>{
		self.console = hold;
	});

	this.should('make basic assertions, including following a failed one', function(){
		this.assert(true, 'true');
		const result = this.assert(false, failMsg);
		this.assert(console.log === undefined, 'intercept console');
		this.assert(model.error === failMsg, 'expected console.assert result');
		this.assert(result.ok === false, 'result failed as expected');
		this.assert(this.assert === this.expect, 'assert and expect are the same');
		this.assert(this.xassert === this.xexpect, 'xassert and xexpect are the same');
		this.assert(model.shouldbe4 === 4, 'should statements are synchronous after wrapping describe runs, when they are not promises anyway');
	});
	model.shouldbe4 = 4;
	model.async = 1;
console.warn('TODO', this.describe !== describe);
debugger;
	describe('untested embedded tests work', function(it2){
		this.assert(console.log, 'console was restored as expected by after()');
		this.should('work as expected', function(it3){
			this.assert(this === it3, 'matching references');
			this.assert(this.assert===it2.assert, 'matching methods');

			this.assert(model.ignored === true, 'xdescribe was ignored as expected');
debugger
			this.assert(model.async === 2, 'describe statements are synchronous when they are');
		});
	});
	model.async = 2;

	describe('untested promise response', async function(){
		model.waiting = 1;
		this.assert(3 === model.async, 'describe statements can be async');

		await Promise.resolve('promise-complete').then((result)=>{
			this.result = result;
			model.waiting = 2;
			return this;
		});
		this.assert(2 === model.waiting, 'awaited resolution, last');
	});
	model.async = 3;
});
