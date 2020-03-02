import { self, dispatch } from './untested.js';
import { chars } from './figures.js';
/*
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

const karma = self.__karma__ || {};

karma.start = function karmaStart(...args){
	dispatch('untested-start', 'start', this, ...args);
}

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
			,suite: [ this.test.text ]
			,log: [...log]
			,success: should.failed === 0
			,skipped: should.skip
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
window.untested = [];
window.addEventListener('untested', function(e){
	const detail = e.detail;
	// TODO is this useful?
	window.untested.push(e);

	switch(detail.type){
	case 'run':
		const results = detail.info.results;
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
debugger;
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
