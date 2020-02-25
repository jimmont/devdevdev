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
*/
const karma = self.__karma__ || {};
const karmaFormat = {
	log(assert, i){
		return (assert.pending ? '?' : (assert.skipped ? '~' : ( assert.success ? '+':'-' ))) + JSON.stringify(assert.log);
	}
	,item(should, i, list){
		return {
			 id: `${ this.name }-should-${ i }`
			,description: should.text
			,suite: [ this.test.text ]
			,log: should.log.map(karmaFormat.log)
			,success: should.failed === 0
			,skipped: should.skipped
		};
	}
	,group(results, test, i, list){
		results.push(...test.series.map(karmaFormat.item, {test, index: i, name: `test-${i}`}));
		return results;
	}
};
self.addEventListener('test', function(e){
	const detail = e.detail;
	switch(detail.type){
	case 'run':
		const results = detail.results;
		const tests = results.reduce(karmaFormat.group, []);
debugger
		karma.info({total: tests.length});
		tests.forEach((test, i, list)=>{
			karma.result(test);
		});
	break;
	case 'error':
		karma.error(test.error);
	break;
	case 'complete':
		karma.complete({coverage: self[Symbol.for('coverage')]});
	break;
	default:
		karma.info(detail);
	}
});

function demo(){
	karma.result({
		//id: 'result0'
		id: 'result-1abc'
		,description: 'example -test result'
		,suite: ['eg~suite suite']
		,log: [1234, 789, 10, 'okay']
		,success: true 
		,skipped: true
	});

	karma.result({
		id: 'result-1abc'
		// ,description: test.title
		,description: 'example +test result'
		//,suite: []
		,suite: ['eg~suite suite']
		,log: [new Error('nope').message, 'error message(s) explaining failure']
		,success: false
		,skipped: false
		,pending: false
		// skipped ? 0 : duration
		,time: false ? 0 : 0
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
	});
}
/*
	@class Test
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
class Test{
	constructor(text, fn, config){
		Object.assign(this, {
			 text
			,fn
			,result: null
			,error: undefined
			,series: []
			,_before: []
			,_after: []
			,_beforeEach: []
			,_afterEach: []
			,start: 0
			,time: 0
		}, fn, config);
	}
	get status(){
		return this[Symbol.for('status')] || 0;
	}
	runEach(fn){ fn.call(this); }
	after(fn){ this._after.push(fn); }
	before(fn){ this._before.push(fn); }
	afterEach(fn){ this._afterEach.push(fn); }
	beforeEach(fn){ this._beforeEach.push(fn); }
	runner(should, i){
		const resultKey = Symbol.for('result');
		this[resultKey] = should;
		this._beforeEach.forEach(this.runEach, this);
		const start = Date.now();
		should.start = start;
		should.result = should.fn.call(this, this);
		const end = Date.now();
		should.time = end - start;
		this._afterEach.forEach(this.runEach, this);
		this[resultKey] = null;
	}
	run(sync=false){
		let res, status = Symbol.for('status');
		try{
			this[status] = -1;
			this.start = Date.now();
			// describe('thing', function(it){...it.should/this.should}))
			const result = this.fn.call(this, this);
			this.result = result;
			if(result instanceof Promise){
				result
					.then((res)=>{ this.result = res; return this; })
					.catch((res)=>{ this.error = res; return Promise.reject(this); })
					;
			};
			this._before.forEach(this.runEach, this);
			// run each should w/ its assertions
			this.series.forEach(this.runner, this);
			this._after.forEach(this.runEach, this);
			this[status] = 1;
			res = sync === true ? this : Promise.resolve(this);
		}catch(err){
			this[status] = -2;
			this.error = err;
			res = sync === true ? this : Promise.reject(this);
		};
		this.time = Date.now() - this.start;
		return res;
	}
/*
should
xshould

add item w/ fn+text to series list

*/
	expecting(text, fn, config){
		return Object.assign({
			text, fn, result: null, log: [], skipped: true, time: 0, start: 0, failed: 0
		}, config);
	}
	xshould(text, fn, config){
		return this.expecting(text, fn, {...config, skipped:true});
	}
	should(text, fn, config){
		const expect = this.expecting(text, fn, {...config, skipped: false})
		this.series.push(expect);
		return expect;
	}
/*
format consolidation for an assert result
collect into results if possible (allow calling assert directly without a list)
*/
	resulting(assert){
		const result = Object.assign({
			 log: []
			,success: false
			,skipped: false
			,pending: true
			,time: Date.now()
		}, assert);
		if(this){
			// fault tolerant
			const should = this[Symbol.for('result')];
			if(should){
				should.log.push(result);
				if(!result.pending && !result.skipped && result.success === false && !!result.result && result.hasOwnProperty('result')) should.failed++;
			};
		};
		return result;
	}
	xassert(result, ...explanation){
		return this.resulting({result, log: explanation, skipped: true, pending: false});
	}
	assert(result, ...explanation){
		const assert = this.resulting({
			 result
			,log: [result, ...explanation]
			,success: !!result
			,skipped: false
			,pending: false
		});
		console.assert(result, ...explanation);
		return assert;
	}
/*
describe
xdescribe
add
run => pass to karma when all are finished
*/
	static describe(label, fn, config={}){
		// return new Test(...)
		const test = new this(label, fn, config);
		this.add(test);
		return test;
	}
	static xdescribe(label, fn, config={}){
		return null;
	}
	static add(test){
		return this.list.add(test);
	}
	static run(){
		const list = Array.from(this.list).filter(describe=>{ return describe.status === 0; });
		if(list.length){
			return Promise.all( list.map(describe=>{
				// return a promise or the result
				return describe.run(describe);
			}) ).finally(list=>{
				// run any new/remaining
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
		self.dispatchEvent(new CustomEvent('test', {detail: {type, ...payload}, cancelable: true, bubbles: false}));
	}
	static start(config){

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
Test.list = Test.list || new Set();
// synonyms
Test.prototype.xexpect = Test.prototype.xassert;
Test.prototype.expect = Test.prototype.assert;

karma.start = Test.start.bind(Test);

const describe = Test.describe.bind(Test);
const xdescribe = Test.xdescribe.bind(Test);
export { describe as default, Test, describe, xdescribe, karma }

