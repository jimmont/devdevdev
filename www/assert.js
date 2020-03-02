/*
equivalent for Nodejs, deno
Nodejs require('assert') API


@see
https://nodejs.org/api/assert.html
https://deno.land/x/std/testing/
https://deno.land/x/std/testing/asserts_test.ts

@description (copied)
testing/asserts.ts module provides range of assertion helpers. If the assertion is false an AssertionError will be thrown which will result in pretty-printed diff of failing assertion.

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


Assert

Strict assertion mode
Legacy assertion mode
Class: assert.AssertionError

new assert.AssertionError(options)
assert(value[, message])
assert.deepEqual(actual, expected[, message])

Comparison details
assert.deepStrictEqual(actual, expected[, message])

Comparison details
assert.doesNotMatch(string, regexp[, message])
assert.doesNotReject(asyncFn[, error][, message])
assert.doesNotThrow(fn[, error][, message])
assert.equal(actual, expected[, message])
assert.fail([message])
assert.fail(actual, expected[, message[, operator[, stackStartFn]]])
assert.ifError(value)
assert.match(string, regexp[, message])
assert.notDeepEqual(actual, expected[, message])
assert.notDeepStrictEqual(actual, expected[, message])
assert.notEqual(actual, expected[, message])
assert.notStrictEqual(actual, expected[, message])
assert.ok(value[, message])
assert.rejects(asyncFn[, error][, message])
assert.strictEqual(actual, expected[, message])
assert.throws(fn[, error][, message])

assert
[Function: ok] {
  fail: [Function: fail],
  AssertionError: [Function: AssertionError],
  ok: [Circular],
  equal: [Function: equal],
  notEqual: [Function: notEqual],
  deepEqual: [Function: deepEqual],
  notDeepEqual: [Function: notDeepEqual],
  deepStrictEqual: [Function: deepStrictEqual],
  notDeepStrictEqual: [Function: notDeepStrictEqual],
  strictEqual: [Function: strictEqual],
  notStrictEqual: [Function: notStrictEqual],
  throws: [Function: throws],
  rejects: [AsyncFunction: rejects],
  doesNotThrow: [Function: doesNotThrow],
  doesNotReject: [AsyncFunction: doesNotReject],
  ifError: [Function: ifError],
  match: [Function: match],
  doesNotMatch: [Function: doesNotMatch],
  strict: [Function: strict] {
    fail: [Function: fail],
    AssertionError: [Function: AssertionError],
    ok: [Circular],
    equal: [Function: strictEqual],
    notEqual: [Function: notStrictEqual],
    deepEqual: [Function: deepStrictEqual],
    notDeepEqual: [Function: notDeepStrictEqual],
    deepStrictEqual: [Function: deepStrictEqual],
    notDeepStrictEqual: [Function: notDeepStrictEqual],
    strictEqual: [Function: strictEqual],
    notStrictEqual: [Function: notStrictEqual],
    throws: [Function: throws],
    rejects: [AsyncFunction: rejects],
    doesNotThrow: [Function: doesNotThrow],
    doesNotReject: [AsyncFunction: doesNotReject],
    ifError: [Function: ifError],
    match: [Function: match],
    doesNotMatch: [Function: doesNotMatch],
    strict: [Circular]
  }
*/

/* @param {object} conf {
			message: 'string', file: 'string', line: Number,
			actual: <any>, expected: <any>, operator: 'strictEqual' (function.name), code: 'ERR_ASSERTION',
			name: 'AssertionError', generatedMessage: true
		}

 */
class AssertionError extends Error{
	constructor(conf={}){
		super(conf.message, conf.file, conf.line);
		/*
			
		*/
	}
}
function noop(){}

// fail, ok, equal, notEqual, deepEqual, notDeepEqual, 
// deepStrictEqual, notDeepStrictEqual, strictEqual, notStrictEqual, 
// throws, rejects, doesNotThrow, doesNotReject, ifError, match, doesNotMatch, 
// strict, AssertionError
// TODO strict mode display a diff, non-strict shows object like:
/*
assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
*/
/*

	@param {string | object} message
*/
const assert = {
	ok: function(value, message){
		if(value) return;
		if(message instanceof Error){
			throw message;
		}else{
			throw new AssertionError({message: message || ''});
		};
	}
	,deepEqual: function(actual, expected, message){
	}
	,fail: noop
};

Object.assign(ok, assert);

export { ok as default }
