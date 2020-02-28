/*
@since 2020-02-25T01:01:31.188Z

@summary basic bdd style test running for functional tests with karma
@see https://karma-runner.github.io/latest/dev/plugins.html

@description
karma
.start start test execution
.complete the client completed execution of all the tests
.error an error happened in the client
.info other data (e.g. number of tests or debugging messages)
.result a single test has finished, object for individual test success or failure in the form:
{
    id: String,
    description: String,
    suite: Array[String],
    // an array of string error messages that might explain a failure--this is required if success is false.
    log: Array[String],
    success: Boolean, // pass / fail
    skipped: Boolean // skipped / ran
}

TODO
* separate karma/test-runner format
* allow handling via events on the window (eg notifications or similar when running)
* basic tests run, synchronously or async as promise
* run them as they come

*/

const karma = window.__karma__ || {};

const karmaFormat = {
	log(assert, i){
		return (assert.pending ? '?' : (assert.skipped ? '~' : ( assert.success ? '+':'-' ))) + JSON.stringify(assert.log);
	}
	,item(should, i, list){
	const now = Date.now();
	const log = should.log.map(karmaFormat.log)
		return {
			 id: `${ this.name }-should-${ i }`
			,description: 'description..'+should.text
			,suite: [ this.test.text, 'soup', 'fries', 'sweet suite' ]
			,log: ['SHAZAM', ...log]
			,success: should.failed === 0
			,skipped: should.skipped
			,duration: 191
			,total: 191
			,time: 191
			,startTime: now
			,endTime: now + 191
		};
	}
	,group(results, test, i, list){
		results.push(...test.series.map(karmaFormat.item, {test, index: i, name: `test-${i}`}));
		return results;
	}
};
window.addEventListener('test', function(e){
	const detail = e.detail;
	switch(detail.type){
	case 'run':
		const results = detail.results;
		const tests = results.reduce(karmaFormat.group, []);
		// TODO problem with total 
		karma.info({total: tests.length});

		tests.forEach((test, i, list)=>{
			karma.result(test);
		});
demo();

	break;
	case 'error':
		karma.error(test.error);
	break;
	case 'complete':
demo();
		karma.complete({coverage: window[Symbol.for('coverage')]});
console.warn('<---->');
demo();
console.warn('<---->');
	break;
	default:
		karma.info(detail);
	}
});

function demo(){
return console.warn('DISABLE DEMO');
	karma.info({total: Math.floor(Math.random() * 97) + 1});
	karma.info({total: 77});
	karma.info({total: 77});
	karma.info({total: 77});
	karma.info({total: 77});
var now = Date.now();
	karma.result({
		//id: 'result0'
		id: 'result-1abc'
		,description: 'demo> example -test result'
		,suite: ['eg~suite suite']
		,log: [1234, 789, 10, 'okay']
		,time: 741
		,startTime: now
		,endTime: now + 741
		,success: true 
		,skipped: false
	});

	karma.result({
		id: 'result-1abc'
		// ,description: test.title
		,description: 'demo> example +test result'
		//,suite: []
		,suite: ['eg~suite suite']
		,log: [new Error('nope').message, 'error message(s) explaining failure']
		,success: false
		,skipped: false
		,pending: false
		// skipped ? 0 : duration
		,time: false ? 0 : 0
		,time: 741
		,startTime: now
		,endTime: now + 741
		//,assertionErrors
		//,start: test.start
		//,end: Date.now()
	});

	karma.result({
		//id: 'result0'
		id: 'result-1abc'
		,description: 'example -test result'
		,suite: ['eg~suite suite', 'OTHER suite']
		,log: []
		,success: true 
		,skipped: false
		,time: 741
		,startTime: now
		,endTime: now + 741
	});
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
class Should{
	constructor(text, fn, config){
		Object.assign(this, {
			text
			,fn
			,result: null
			,error: undefined
			,log: []
			,start: new Date()
			,time: 0
			,status: 0
			,pass: false
			,skipped: false
			,success: false
		}, config);
	}
	run(){
		try{
			this.status = -1;
			this.log = [];
			this.result = null;
			this.time = 0;
			this._failed = 0;
			this._skipped = 0;
			this.start = Date.now();

			const result = this.fn.call(this, this);
			this.result = result;
			if(result instanceof Promise){
				return result
				.then(res=>{
					this.time = Date.now() - this.start;
					this.result = res;
					this.status = 1;
					this.success = this._failed === 0;
					return this;
				})
				.catch(res=>{
					this.time = Date.now() - this.start;
					this.error = res;
					this.status = -2;
					this.success = false;
					return Promise.reject(this);
				})
				;
			}else{
				this.status = 1;
				this.success = true;
			}
		}catch(err){
			this.status = -2;
			this.success = false;
			this.error = err;
		};
		this.time = Date.now() - this.start;

		return this;
	}
	_failures(entry){ return entry.assert && !entry.skipped && !entry.success; }
	failed(){
		return this.log.filter(this._failures, this);
	}
	xassert(truth, ...explanation){
		const result = {truth, explanation, skipped: true, assert: true};
		this.log.push(result);
		this._skipped++;
		return result;
	}
	assert(truth, ...explanation){
		const success = !!truth;
		const result = {truth, explanation, skipped: false, success, assert: true};
		this.log.push(result);
		if(!success) this._failed++;
		console.assert(truth, ...explanation);
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
		let result;
		if(typeof task.run === 'function'){
			// this.should() | this.describe()
			result = task.run();
		}else if(typeof task === 'function'){
			// assert(...)
			result = task.call(this);
		}
		this.log.push(result);
		this._afterEach.forEach(this.runEach, this);
	}
	run(){
		let res;
		try{
console.warn('describe.run()',this.text);
			// describe('thing', function(it){...it.should/this.should}))
			super.run();
			this._before.forEach(this.runEach, this);
			this.series.forEach(this.runner, this);
			this._after.forEach(this.runEach, this);

			if(this.result instanceof Promise){
				return this.result
				.then((res)=>{
					this.time = Date.now() - this.start;
					this.result = res;
					this.status = 1;
					// TODO confirm
					this.success = this._failed === 0;
					return this;
				})
				.catch((err)=>{
					this.time = Date.now() - this.start;
					// TODO confirm
					this.error = res;
					this.status = -2;
					this.success = false;
					return Promise.reject(this);
				})
				;
			};
		}catch(err){
			this.status = -2;
			this.error = err;
		};
		this.status = 1;
		//this.success = true???;
		this.time = Date.now() - this.start;

		return this;
	}
	xdescribe(text, fn, config){
		const describe = new Describe(text, fn, {...config, skipped: true, status: -3});
		// anyone can call from/on class
		if(this && this.series) this.series.push( describe );
		return describe;
	}
	describe(text, fn, config){
		const describe = new Describe(text, fn, config);
		// anyone can call from/on class
		if(this && this.series) this.series.push( describe );
		return describe;
	}
	xshould(text, fn, config){
		return this.series.push( new Should(text, fn, {...config, skipped: true}) );
	}
	should(text, fn, config){
		return this.series.push( new Should(text, fn, config) );
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
		test.run(test);
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
	static dispatch(type, payload){
console.log('dispatch(test)',type, payload.text);
if(payload.results){
	payload.results.forEach(item=>console.warn('>>',item.text, item.skipped, item.success, item.log.length, item.log))
}
		window.dispatchEvent(new CustomEvent('test', {detail: {type, ...payload}, cancelable: true, bubbles: false}));
	}
	static start(config){
		this.run()
		.then(results => {
debugger;
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

karma.start = Describe.start.bind(Describe);

const describe = Describe.describe.bind(Describe);
const xdescribe = Describe.xdescribe.bind(Describe);
export { describe as default, describe, xdescribe, Describe, Should }

