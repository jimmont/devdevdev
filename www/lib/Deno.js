/*
@since 2020-03-04T02:58:42.267Z

@summary provide Deno related standard libraries to the UI, especially for testing

@description
 * write tests in the same way across runtimes (deno, browser, Nodejs)
 * write tests and run them independent from test runners, reporters, etc (via events on the highest level event-capable global)
 * TODO make this available on-demand in such a way the implementation is not slowed by potentially unused imports

@example
// messages optional
Deno.test('feature test',()=>{
	assert(true, 'true');
	assertEquals({ hello: "world" }, { hello: "world" }, 'hello-world');
	assertStrictEq(11, 11, 'number 11');
});
Deno.test(function featureTest(){
	assertThrows(()=>{
		assert(false);
	}, AssertionError, 'assert should throw and error of type AssertionError');
});
Deno.test({name: 'feature-test', fn: ()=>{
	
}});

@see https://deno.land/std/testing/

@description
equal() - Deep comparison function, where actual and expected are compared deeply, and if they vary, equal returns false.
assert() - Expects a boolean value, throws if the value is false.
assertEquals() - Uses the equal comparison and throws if the actual and expected are not equal.
assertNotEquals() - Uses the equal comparison and throws if the actual and expected are equal.
assertStrictEq() - Compares actual and expected strictly, therefore for non-primitives the values must reference the same instance.
assertStrContains() - Make an assertion that actual contains expected.
assertMatch() - Make an assertion that actual match RegExp expected.
assertArrayContains() - Make an assertion that actual array contains the expected values.
assertThrows() - Expects the passed fn to throw. If fn does not throw, this function does. Also compares any errors thrown to an optional expected Error class and checks that the error .message includes an optional string.
assertThrowsAsync() - Expects the passed fn to be async and throw (or return a Promise that rejects). If the fn does not throw or reject, this function will throw asynchronously. Also compares any errors thrown to an optional expected Error class and checks that the error .message includes an optional string.
unimplemented() - Use this to stub out methods that will throw when invoked
unreachable() - Used to assert unreachable code

 * */

/* detect global/window/self in browser, deno, nodejs including modules where 'this' is undefined
 * window is a referenceerror in nodejs, others have window
*/
const self = new Function('return this')();

/* communicate with others via events */
let eventCapable = self && self.addEventListener && self.CustomEvent;
// Nodejs specific
if(!eventCapable && self.process && self.process.on){
	Object.assign(self, {
		dispatchEvent(event){ return self.process.emit(event.type, event); }
		,CustomEvent: class CustomEvent{
			constructor(type, config){
				Object.assign(this, {type}, config);
			}
		}
		,removeEventListener(type, fn){
			return self.process.off(type, fn);
		}
		,addEventListener(type, fn, config={}){
			return self.process[config && config.once ? 'once':'on'](type, fn);
		}
	});
	eventCapable = true;
};

function noop(){}
const Deno = {
	errors: {
		NotFound: {}
	}
	,noop
	// user configurable properties
	,config: {
		eventType: 'deno'
	}
	,dispatch: !eventCapable ? noop : function(name='deno', type='', info){
		self.dispatchEvent(new CustomEvent(name, {detail: {type, info}, cancelable: true, bubbles: false}));
	}
	,test(name, fn){
		let test;
		if(typeof name === 'string'){
			if(typeof fn !== 'function'){
				throw new Error('Missing test function');
				if(!name) throw new Error("The name of test case can't be empty");

				test = this.describe(name, fn);
			}
		}else if(typeof name === 'function'){
			if(!name.name) throw new Error("Test function can't be anonymous");
			test = this.describe(name.name, name);
		}else if(typeof name === 'object'){
			if(!name.fn || typeof name.fn !== 'function') throw Error("Missing test function");

			let text = name.name || name.fn.name;
			if(!text || typeof text !== 'string') throw Error("The name of test case or named function required.");
			test = this.describe(name, fn);
		}else{
			throw new Error("Invalid input, required: test(name, fn) test(function named(){}) test({name, fn})");
		}
		this.add(test);
		
	}
	,_tests: new Set()
	,runTests(){
		this.ran = true;

		const list = Array.from(this._tests).filter(describe=>{ return describe.status === 0; });

		const promised = list.filter(describe=>{
			describe.run();
			return describe.result instanceof Promise;
		});
		
		if(promised.length){
			return Promise.all(promised)
				.finally(()=>{
					return this.runTests();
				});
		};

		return Promise.resolve( Array.from(this._tests) );

	}
	,start(config){
// TODO TODO
		import('./std/testing/asserts.js')
		.then(imports=>{
/*
import {
AssertionError, assert, assertArrayContains, assertEquals, assertMatch, assertNotEquals, assertNotEOF, assertStrContains, assertStrictEq, assertThrows, assertThrowsAsync, equal, fail, unimplemented, unreachable
} from "./std/testing/asserts.js";
*/
console.log(imports);
// apply in the runner
			this.imports = imports;
			return imports;
		})
		.catch(err=>{
console.error(err);
debugger;
		})
		;

		this.ready = true;

		return this.runTests()
		.then(results => {
			this.dispatch(this.eventType, {type: 'run', results, text: `runTests() ${ results.length } tests`});
		})
		.catch(test=>{
			this.dispatch(this.eventType, {type: 'error', test});
		})
		.finally(()=>{
			this.dispatch(this.eventType, {type: 'complete', test: this});
		})
		;
	}
};
self.addEventListener('deno-start-tests', Deno.runTests.bind(Deno), {once: true});

const DenoProxy = new Proxy(Deno, {
	get: function($, key){
		const val = Deno[ key ];
		console.warn(`Deno[ ${key} ]:`, val);
		return val;
	}
	,set: function($, key, val){
		console.warn(`Deno[ ${key} ]:`, val);
		$[key] = val;
		return true;
	}
});
Object.defineProperty(self, 'Deno', {value: DenoProxy});

export { DenoProxy as default, DenoProxy, self };
