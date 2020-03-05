/*
@since 2020-03-04T02:58:42.267Z

@summary provide Deno related standard libraries to the UI; currently for testing

*/
const Deno = {
	errors: {
		NotFound: {}
	}
	,TEST_REGISTRY: []
	,test(t, fn) {
		let name;
		if (typeof t === "string") {
			if (!fn) {
				throw new Error("Missing test function");
			}
			name = t;
			if (!name) {
				throw new Error("The name of test case can't be empty");
			}
		}
		else if (typeof t === "function") {
			fn = t;
			name = t.name;
			if (!name) {
				throw new Error("Test function can't be anonymous");
			}
		}
		else {
			fn = t.fn;
			if (!fn) {
				throw new Error("Missing test function");
			}
			name = t.name;
			if (!name) {
				throw new Error("The name of test case can't be empty");
			}
		}
		TEST_REGISTRY.push({ fn, name });
	}
	,async runTests(){
// TODO
return console.warn('TODO runTests()');
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
// TODO
return console.warn('TODO start()');

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

export { DenoProxy as default, DenoProxy as Deno };
