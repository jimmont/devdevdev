/***
untested.js

@summary write tests in one simplified style across runtimes, make it simple to use via events for reporting, etc
@since 2020-03-04T02:58:42.267Z
@name untested.js

@description
write tests in one simplified style across runtimes, make it simple to use via events for reporting, etc

Goals
 * Write tests in the same way and same assertions across runtimes Deno, browsers, Node.js
	`untested.test(<test>)` Where untested maps directly to `Deno.test(<test>)`
	Tests require a descriptive string from 1 of 3: key 'name' on object, function name or argument 0.
	And a function to execute as 1 of 3: argument 0 with name or argument 1 or object with key 'fn'.

 * Write tests and run them easily independent from test runners, reporters, etc reporting and observing events in the same simple way.
 * Make using this for tests as clear and simple as possible for current and forward looking usage.
 * communicate about tests via events on the global `window` or `process`
 * start running tests by:
	1) dispatching event of type `untested-start` on window or process (process.emit(...))
	2) include an event.detail.untested object with options for startup
		detail.untested = {
			url: '/path' // adjust path to libraries from the default './'
			runTests: false // don't automatically run tests
			runTests: {} // options passed directly to runTests()
		}

Assertions and tests based directly on Deno's implementation as it is both simple and clear.

Assertions (copied from following link) all globals;

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

@example
// message string required via 1 of 3 options: fn.name argument 0 or value for key 'name'

untested.test('feature test',()=>{
	assert(true, 'true');
	assertEquals({ hello: "world" }, { hello: "world" }, 'hello-world');
	assertStrictEq(11, 11, 'number 11');
});

untested.test(function featureTest(){
	assertThrows(()=>{
		assert(false);
	}, AssertionError, 'assert should throw and error of type AssertionError');
});

untested.test({name: 'feature-test', fn: ()=>{
	
}});

@see https://deno.land/std/testing/

***/
/* detect global/window/self in browser, deno, nodejs including modules where 'this' is undefined
 * window is a referenceerror in nodejs, others have window
*/
const self = new Function('return this')();
/* communicate with others via events */
// Nodejs specific
if(self.process && self.process.on){
	Object.assign(self, { dispatchEvent(event){ return self.process.emit(event.type, event); }
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
};

const untested = {
	// where the libraries are
	url: './'
	// dispatch this event-type and listen for it
	,dispatch: function(type='', info){
		self.dispatchEvent(new CustomEvent('untested', {detail: {type, info}, cancelable: true, bubbles: false}));
	}
	// run the tests registered through test()
	// { exitOnFail = false, only = /[^\s]/, skip = /^\s*$/, disableLog = false }
	,async runTests(config={}){
		return this.setup()
			.then(()=>{
				return Deno.runTests(config);
			})
			;
	}
	// get the libraries required to work and related
	,setup(url=this.url){
		if(this.lib) return this.lib;
		// provide Deno as global, from the library
		let lib = !self.Deno.stub ? Promise.resolve(self.Deno)
			: (import(url+'/Deno.js')
				.then(lib=>{
					const Deno = lib.Deno;
					this.Deno = Deno;
					// global is required for assert to work
					Object.defineProperty(self, 'Deno', {value: Deno});
					return lib;
				})
			)
		;
		return this.lib = lib.then(lib=>import(url+'/std/testing/asserts.js'))
			.then(libs=>{
				// also globals
				Object.assign(self, libs);

				this.dispatch('setup', 'loaded globals '+Object.keys(libs).sort().join(', '));

				// now able to run tests so overwrite
				this.test = this.testnow;
				const pending = this.pending;
				this.pending = [];
				pending.forEach(test=>this.test(test));

				return libs;
			})
		;
	}
	// test() after setup
	,testnow(...args){
		return Deno.test(...args);
	}
	,pending: []
	// test() before setup
	,testwait(...pending){
		this.pending.push(pending);
		this.setup();
	}
	// listen for 'untested-start' event with possible options
	,start(e={}){
		const config = e && e.detail && e.detail.untested || {};
		if(typeof config.url === 'string') this.url = config.url;
		this.dispatch('start', config);
		if(config.runTests !== false) untested.runTests(config.runTests);
	}
}
untested.test = untested.testwait;
self.addEventListener('untested-start', untested.start.bind(untested), {once: true});
// make it possible to handle cases where the tests are written for Deno directly as a global and load after this
// which should also setup asserts when runTests called TBD TODO
if(!self.Deno){
	self.Deno = {
		// prevent race in setup
		stub: true
		,runTests(...args){
			return untested.runTests(...args);
		}
		,test(...args){
			return untested.test(...args);
		}
	};
};
export { untested as default, untested, self }
