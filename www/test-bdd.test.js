import { describe, xdescribe, Test } from './test-bdd.js';

/*
	basic tests of the library

	TODO
	* events on window
	* test methods directly
	* returning different promises
*/
const model = { };

model.arrow = {};

describe('test-bdd arrow fn works', (it)=>{
	const item = model.arrow;
	item.status = 0;
	it.should('make assertions with arrow fn', (test)=>{
		item.status++;
		it.assert(1 === item.status, 'make a basic assertion');
		it.assert(it === test, 'passed argument matches')
	});
	it.assert(0 === item.status, 'make another assertion anywhere, before each should()');
	it.xassert(false, 'ignore a failing assertion');
	
	it.should('work with named+anonymous functions', function(it){
		this.assert(it === this, 'passed argument matches "this"');
		it.xassert(false, 'ignore a failing assertion');
	});
})

model.ignored = true;
xdescribe('ignored', ()=>{
	model.ignored = false;
});


describe('test-bdd named and anonymous functions work', function(it){
	const hold = console;
	const failMsg = 'example test failure';
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
		this.assert(result.success === false, 'result failed as expected');
		this.assert(this.assert === this.expect, 'assert and expect are the same');
		this.assert(this.xassert === this.xexpect, 'xassert and xexpect are the same');
	});
	model.async = 1;
	describe('test-bdd embedded tests work', function(it2){
		this.assert(console.log, 'console was restored as expected by after()');
		this.should('work as expected', function(it3){
			this.assert(this===it2 && this === it3, 'matching references');

			this.assert(model.ignored === true, 'xdescribe was ignored as expected');
			this.assert(model.async === 2, 'describe statements are async');
		});
	});
	model.async = 2;

	describe('test-bdd promise response', async function(){
		model.waiting = 1;
		await Promise.resolve('promise-complete').then((result)=>{
			this.result = result;
			model.waiting = 2;
			return this;
		});
		this.assert(2 === model.waiting, 'awaited resolution of promise');
		this.should('come last', function(){
			this.assert(3 === model.waiting, 'waiting === 3');
		});
		model.waiting = 3;
	});
});
