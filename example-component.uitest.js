//import './example-component.js';
/*
https://github.com/puppeteer/puppeteer/blob/main/docs/api.md

essentially delivers:

	<script type="module" src="/example-component.js"></script>
	<example-component>ok</example-component>
	<example-component flag title="flagged"></example-component>
*/

const { page, testing } = window;
const { assert } = testing;

await page.addScriptTag({
	url: '/example-component.js',
	type: 'module',
});
const payload = { hello: 'world' };

await page
	.evaluate((payload) => {
		return new Promise((resolve, reject) => {
			requestAnimationFrame(() => {
				let node = document.createElement('div');
				node.innerHTML = `
			<example-component>ok</example-component>
		`;
				document.body.appendChild(node.firstElementChild);
				node = document.createElement('example-component');
				node.setAttribute('flag', '');
				node.title = 'flagged and titled';
				document.body.appendChild(node);

				requestAnimationFrame(() => {
					try {
						const nodes = Array.from(document.querySelectorAll('example-component'));
						nodes.forEach((node, index) => {
							node.add(index);
							node.shadowRoot.querySelector('h1').click();
						});
						requestAnimationFrame(() => {
							const results = nodes.map((node, index) => {
								const result = {
									// textContent is aware of slotted content and applied styling
									text: node.textContent,
									textShadow: node.shadowRoot.textContent,
									index,
									count: node.count,
									hello: node.hello,
									type: node.constructor.name,
									title: node.getAttribute('title') ?? 'FAIL',
									flag: node.hasAttribute('flag'),
								};
								return result;
							});
							resolve(results);
						});
					} catch (error) {
						reject(error);
					}
				});
			});
		});
	}, payload)
	.then((results) => {
		const expected = [
			{
				text: 'ok',
				index: 0,
				count: 1,
				hello: 'world',
				type: 'ExampleComponent',
				title: '',
				flag: true,
			},
			{
				text: '',
				index: 1,
				count: 2,
				hello: 'world',
				type: 'ExampleComponent',
				title: 'flagged and titled',
				flag: false,
			},
		];

		Deno.test('example-component uitest', () => {
			const keys = Object.keys(expected[0]);

			results.forEach((result, i) => {
				const expect = expected[i];
				keys.forEach((key) => {
					assert(result[key] === expect[key], `${key} "${result[key]}" should be "${expect[key]}"`);
				});
				assert(
					(result.flag ? /\bflagged\b/ : /\bunflagged\b/).test(result.textShadow),
					`shadow text for flag ${result.flag} includes "${result.flag ? 'flagged' : 'unflagged'}"`
				);
			});
		});

		console.log(`example-component ok from ${import.meta.url}`);

		return results;
	})
	.catch((error) => {
		console.error(error);

		return error;
	});
