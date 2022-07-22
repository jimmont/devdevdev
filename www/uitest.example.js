/*
equivalent ways of importing testing utilities;
import * as testing from './testing.js';
window.testing === testing;


*/
const {
	equal,
	assert,
	assertEquals,
	assertNotEquals,
	assertStrictEquals,
	assertStringIncludes,
	assertMatch,
	assertNotMatch,
	assertArrayIncludes,
	assertObjectMatch,
	assertThrows,
	assertThrowsAsync,
	unimplemented,
	unreachable,
	bench,
	BenchmarkRunError,
	BenchmarkRunProgress,
	BenchmarkRunResult,
	clearBenchmarks,
	ProgressState,
	runBenchmarks,
} = window.testing;

console.log('example uitest, scope of window as global');
// alert('example uitest: this alert pauses the runtime');
await page
	.evaluate(() => {
		const result = { step: 0 };
		window.addEventListener(
			'vaadin-router-location-change',
			(event) => {
				console.log(event);
			},
			{ once: true }
		);

		return new Promise((resolve, reject) => {
			const urls = [location.pathname];

			const $node = function () {
				try {
					return document
						.querySelector('app-app')
						.shadowRoot.querySelector('app-view')
						.shadowRoot.querySelector('form');
				} catch (err) {
					return null;
				}
			};

			const formulation = function () {
				const $form = $node();
				if (!$form) return requestAnimationFrame(formulation);
				if ($form && result.step < 5) {
					result.step++;
					let list,
						root = $form.querySelector('[form-defaults]');
					switch (result.step) {
						case 2:
							root.querySelector('select[name="select-generic"]').selectedIndex = 2;
							root.querySelectorAll('input[type=radio]')[2].click();
							break;
						case 3:
							list = root.querySelectorAll('button:not([disabled],[type=button],[type=reset])');
							list[list.length - 1].click();
							break;
					}

					return requestAnimationFrame(formulation);
				}

				resolve(result);
			};

			window.addEventListener(
				'popstate',
				(event) => {
					urls.push(location.pathname);
					Object.assign(result, { urls });
					formulation();
				},
				{ once: true }
			);

			document.querySelector('app-view').shadowRoot.querySelector('a[href^="/form"]').click();
		});
	})
	.then((result) => {
		const [first, second] = result.urls;

		Deno.test('scenario example uitest', async () => {
			if (config.verbose) console.info('scenario example info:', result);
			assert(
				first.startsWith('/') && second.startsWith('/form') && first !== second,
				`url navigation to /form`
			);
			assert(result.step === 5, `expected 5 steps, got ${result.step}`);
		});
		return result;
	})
	.catch((error) => {
		console.error(error);
		return error;
	});
if (config.verbose) {
	await page.screenshot({ path: 'example-ignore.png' });

	console.log(`scenario example ${import.meta.url.replace(/^.*\//, '')} screenshot: example.png`);
}
