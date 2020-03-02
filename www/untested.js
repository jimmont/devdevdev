/*
@since 2020-02-25T01:01:31.188Z

*/
/* detect global/window/self in browser, deno, nodejs
including where 'this' is undefined */
const self = new Function('return this')();

let eventCapable = self && self.addEventListener && self.CustomEvent;
function noop(){}
/* communicate with others via events */
let dispatch = !eventCapable ? noop : function dispatch(name='untested', type='', ...info){
		self.dispatchEvent(new CustomEvent(name, {detail: {type, info}, cancelable: true, bubbles: false}));
}
;
// Nodejs specific TODO is this needed? TODO test
if(!eventCapable && self && self.process && self.process.on){
	self.dispatchEvent = (event)=>{
		return self.process.emit(event.type, event);
	}
	self.CustomEvent = class CustomEvent{
		constructor(type, config){
			Object.assign(this, {type}, config);
		}
	}
	self.removeEventListener = function(type, fn){
		return self.process.off(type, fn);
	}
	self.addEventListener = function(type, fn, config={}){
		return self.process[config && config.once ? 'once':'on'](type, fn);
	}
	eventCapable = true;
}

const skip = Symbol.for('skip');
class Test{
	constructor(){
		this.result = skip;
		this.log = [];
		this.skip = false;
		this.ok = false;
	}
	xassert(truth, ...explanation){
		this.result = truth;
		this.skip = true;
		this.ok = !!truth;
		this.log = explanation;
		return this;
	}
	assert(truth, ...explanation){
		this.xassert(truth, ...explanation);
		this.skip = false;
		console.assert(truth, ...explanation);
		return this;
	}
	dispatch(type, event){
		Test.dispatch('untested', type, {event});
	}
}
/*
	@class Should 
	@summary basic lightweight bdd test runner
	@example

	import describe from './test-bdd.js';

	describe('something', function(it){
		this.should('make a few assertions', function(){
			this.assert(true, 'passes');
			this.assert(false === true, 'fails');
		});
		it.should(...)
	});

	describe('abc', (it)=>{
		it.should(...);
		return async function....;
	})
*/
class Should extends Test{
	constructor(text, fn, config){
		super();
		Object.assign(this, {
			text
			,fn
			,error: undefined

			,start: new Date()
			,time: -1

			,status: 0
			,skip: false
			,ok: false
		}, config);
	}
	run(...args){
		try{
			this.status = -1;
			this.log = [];
			this.result = null;
			this.time = -1;
			this._fail = [];
			this._skip = [];
			this.start = Date.now();

			const result = this.fn.call(this, this, ...args);
			this.result = result;
			if(result instanceof Promise){
				return result
				.then(res=>{
					this.time = Date.now() - this.start;
					this.result = res;
					this.status = 1;
					this.ok = this._fail.length === 0;
					return this;
				})
				.catch(res=>{
					this.time = Date.now() - this.start;
					this.error = res;
					this.status = -2;
					this.ok = false;
					return Promise.reject(this);
				})
				;
			};

			this.status = 1;
			this.ok = true;
		}catch(err){
			this.status = -2;
			this.ok = false;
			this.error = err;
		};
		this.time = Date.now() - this.start;

		return this;
	}
	_failures(entry){ return entry.assert && !entry.skip && !entry.ok; }
	failed(){
		return this.log.filter(this._failures, this);
	}
	xassert(truth, ...explanation){
		const result = new Test().xassert(truth, ...explanation);
		this.log.push(result);
		this._skip.push(result);
		return result;
	}
	assert(truth, ...explanation){
		const result = new Test().assert(truth, ...explanation);
		this.log.push(result);
		if(!result.ok) this._fail.push(result);
		return result;
	}
}
// synonyms
Should.prototype.xexpect = Should.prototype.xassert;
Should.prototype.expect = Should.prototype.assert;

/* @class Describe
	@summary series of should and describe statements with associated assertions
	@extends Should
	@describe
		adds the ability to have embedded assert, describe and should statments
		before() after() and beforeEach() and afterEach()
 */
class Describe extends Should{
	constructor(text, fn){
		super(text, fn);
		Object.assign(this, {
			series: []
			,_before: []
			,_beforeEach: []
			,_after: []
			,_afterEach: []
		});
	}
	before(fn){ this._before.push(fn); }
	beforeEach(fn){ this._beforeEach.push(fn); }
	after(fn){ this._after.push(fn); }
	afterEach(fn){ this._afterEach.push(fn); }
	runEach(fn){ fn.call(this, this); }
	runner(task, i){
		this._beforeEach.forEach(this.runEach, this);
		if(typeof task.run === 'function'){
			// this.should() | this.describe()
			task.run();
		}else{
			// assert(...)
debugger;
throw 'task.call(this)';
			task.call(this);
		}
		this.log.push(task);
		this._afterEach.forEach(this.runEach, this);

		return task.result instanceof Promise;
	}
	run(){
		let res;
		try{
			/* make it possible to use 'describe()' in the current scope */
			super.run( this.describe.bind(this) );
			this._before.forEach(this.runEach, this);
			const promised = this.series.filter(this.runner, this);
			this._after.forEach(this.runEach, this);

if(promised.length) console.warn('PROMISED', promised);

			if(this.result instanceof Promise){
				return this.result
				.then((res)=>{
					this.time = Date.now() - this.start;
					this.result = res;
					this.status = 1;
					// TODO confirm
					this.ok = this._fail.length === 0;
					return this;
				})
				.catch((err)=>{
					this.time = Date.now() - this.start;
					// TODO confirm
					this.error = res;
					this.status = -2;
					this.ok = false;
					return Promise.reject(this);
				})
				;
			};
			this.status = 1;
		}catch(err){
			this.status = -2;
			this.error = err;
console.error(err, this);
		};
		//this.ok = true???;
		this.time = Date.now() - this.start;

		return this;
	}
	xdescribe(text, fn, config){
		const describe = new Describe(text, fn, {...config, skip: true, status: -3});
		// anyone can call from/on class
		if(this && this.series) this.series.push( describe );
		return describe;
	}
	describe(text, fn, config){
		const describe = new Describe(text, fn, config);
		// anyone can call from/on class
		this.series.push( describe );

		return describe;
	}
	xshould(text, fn, config){
		const should = new Should(text, fn, {...config, skip: true});
		return this.series.push( should );
	}
	should(text, fn, config){
		const should = new Should(text, fn, config);
		return this.series.push( should );
	}
/*
describe
xdescribe
add
run => pass to karma when all are finished
*/
	static describe(label, fn, config={}){
		// return new Describe(...)
		const test = new this(label, fn, config);
		this.add(test);
		if(this.ready) test.run(test);
		return test;
	}
	static xdescribe(label, fn, config={}){
		const test = this.prototype.xdescribe(label, fn, config);
		this.add(test);
		return test;
	}
	static add(test){
		return this.list.add(test);
	}
	static run(){
		const list = Array.from(this.list).filter(describe=>{ return describe.status === 0; });

		const promised = list.filter(describe=>{
			describe.run();
			return describe.result instanceof Promise;
		});
		
		if(promised.length){
			return Promise.all(promised)
				.finally(()=>{
					return this.run();
				});
		};

		return Promise.resolve( Array.from(this.list) );

	}
	/*
	@summary make it possible to respond to events on the window
	@example
	window.addEventListener('test', function(e){
		console.log(`${ e.type }-${ e.detail.type }:`, e.detail);
		// logs: "test-error:", {...}
	});
	*/
	static start(config){
		this.ready = true;

		this.run()
		.then(results => {
			this.dispatch('run', {results, text: `run() ${ results.length } tests`});
		})
		.catch(test=>{
			this.dispatch('error', {test});
		})
		.finally(()=>{
			this.dispatch('complete', {test: this});
		})
		;
	}
}
Describe.list = Describe.list || new Set();
if(eventCapable){
	self.addEventListener('untested-start', Describe.start.bind(Describe), {once: true});
}

export { Describe as default, Describe, Should, Test, self, dispatch }
