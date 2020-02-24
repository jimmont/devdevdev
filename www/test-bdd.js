/*
Karma Framework API
Karma Framework connects existing testing libraries to Karma's API, so that their results can be displayed in a browser and sent back to the server.

Karma frameworks must implement a window.__karma__.start method that Karma will call to start test execution. This function is called with an object that has methods to send results back to karma:

karma
.result a single test has finished
.complete the client completed execution of all the tests
.error an error happened in the client
.info other data (e.g. number of tests or debugging messages)
Most commonly you'll use the result method to send individual test success or failure statuses. The method takes an object of the form:

{
    // test id
    id: String,

     // test description
    description: String,

    // the suite to which this test belongs. potentially nested.
    suite: Array[String],

    // an array of string error messages that might explain a failure.
    // this is required if success is false.
    log: Array[String],

    success: Boolean, // pass / fail

    skipped: Boolean // skipped / ran
}
*/
const karma = self.__karma__ || {};

/*
// TODO cleanup
karma.start = function(config){
	const karma = this;
//	console.log('__karma__.start',karma, config);
karma.info('starting...');
	karma.info({total: 21});
	// see $www/testing/karma-mocha/src/adapter.js

	karma.result({
		//id: 'result0'
		id: 'result-1abc'
		,description: 'example -test result'
		,suite: ['eg~suite suite']
		,log: [1234, 789, 10, 'okay']
		,success: true 
		,skipped: false
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
	//karma.error(new Error('fake error'));
	karma.complete({coverage: window[Symbol.for('coverage')]});

	karma.info('pass 2');
	karma.info({total: 2});
	karma.result({
		//id: 'result0'
		id: 'result...1'
		,description: 'rrrr'
		,suite: ['other-suite']
		,log: [1234, 789, 10, 'okay']
		,success: true 
		,skipped: false
	});
	karma.result({
		//id: 'result0'
		id: 'result...'
		,description: 'bbbb'
		,suite: ['other-suite']
		,log: [1234, 789, 10, 'okay']
		,success: true 
		,skipped: false
	});

	karma.complete({coverage: window[Symbol.for('coverage')]});

//		console.assert(1===2, '1 === 2');
}
//console.warn('cleanup TODO');
*/

/*
	@class Test
	@example
	import describe from './<this>.js';

	// async block
	describe('something', function(done){
		// sync block
		this.should('make a few assertions', function(){
			this.assert(true, 'passes');
			this.assert(false === true, 'fails');
		});

	});

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
		this[Symbol.for('result')] = should.result;
		this._beforeEach.forEach(this.runEach, this);
		const start = Date.now();
		should.start = start;
		should.result = should.fn.call(this, this);
		const end = Date.now();
		should.time = end - start;
		this._afterEach.forEach(this.runEach, this);
		this[Symbol.for('result')] = null;
	}
	run(sync=false){
		let res, status = Symbol.for('status');
		try{
			this[status] = -1;
			this.start = Date.now();
			// describe('thing', function(it){...it.should/this.should}))
			this.result = this.fn.call(this, this);
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
	find(item){
		return item[this.key] === this.value;
	}
/*
format results and have constructor try to run
 */
	report(){
		// reset success && skipped to show any single failure and any skipped
		this.skipped = this.series.find(this.find, {key: 'skipped', value: true});
		this.success = undefined === this.series.find(this.find, {key: 'success', value: false});
	}
/*
should
xshould

add item w/ fn+text to series list

*/
	expecting(text, fn, config){
		return Object.assign({
			text, fn, result: null, log: [], skipped: true, time: 0, start: 0
		}, config);
	}
	xshould(text, fn, config){
		return this.expecting(text, fn, {...config, skip:true});
	}
	should(text, fn, config){
		const expect = this.expecting(text, fn, {...config, skip: false})
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
			const list = this[Symbol.for('result')];
			if(list) list.push(result);
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
	static dispatch(type, payload){
		self.dispatchEvent(new CustomEvent('test', {detail: {type, ...payload}, cancelable: true, bubbles: false}));
	}
	static start(config){
		console.log('karma.start', {config, karma});
		this.run()
		.then(results => {
			this.dispatch('info', results);
			console.warn(`
TODO finish with karma calls
results ${ results.length }
-------------------------------
`);
debugger
			karma.info({total: results.length});
console.warn('TODO reformat for karma.result({...})',results);
//			results.forEach(karma.result);
		})
		.catch(test=>{
			this.dispatch('error', results);

			console.error(test.error);
			console.warn(test);
			karma.error(test.error);
		})
		.finally(()=>{
			const results = Array.from(this.list);
			this.dispatch('complete', results);
			console.log(results);

debugger
			karma.complete({coverage: self[Symbol.for('coverage')]});
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

