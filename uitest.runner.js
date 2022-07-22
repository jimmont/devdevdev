/* eslint-disable */
/*
main UI test runner

deno test -A --unstable ./uitest.runner.js -- --verbose

deno test -A --unstable ./uitest.runner.js

UIEXECUTABLEPATH='/path/to/chrome' && deno test -A --unstable ./uitest.runner.js

...

naming convention:

uitest.scenario.js
 - uitest.login.js

component.uitest.js
 - example-component.uitest.js

puppeteer primary sources for info:
https://github.com/puppeteer/puppeteer/blob/main/docs/api.md
https://developers.google.com/web/tools/puppeteer/get-started
https://pptr.dev/#?product=Puppeteer&show=outline

related resources/cookbook type samples:
https://github.com/checkly/puppeteer-examples
https://github.com/checkly/theheadless.dev

*/
import puppeteer from 'https://deno.land/x/puppeteer/mod.ts';
import { configOverrides } from './deno.configoverrides.js';
import { uitestList } from './uitest.list.js';
// see file for links to detailed info
import * as testing from './testing.js';

const executablePath = Deno.env.get('UIEXECUTABLEPATH') || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const uitests = await uitestList();
const config = {
	debug: false,
	verbose: false,
	url: 'http://localhost:8000/',
	slowMo: 250,
	devtools: true,
	width: 980,
	height: 720,
	executablePath,
};
configOverrides(config);
config.url = new URL(config.url);
Object.freeze(config);

// expose globals for dynamic imports to use
Object.defineProperties(window, {
	testing: { value: testing },
	config: { value: config },
});

console.log(`${uitests.length} files`, uitests);

const browser = await puppeteer.launch({
	headless: false, // Turn on local browser UI
	devtools: config.devtools, // Open Chrome devtools at the beginning of the test
	slowMo: config.slowMo, // eg 250 ms wait between each step of execution
	executablePath: config.executablePath,
	//	args: ['--no-sandbox']
});
// can create a context in each test run
const defaultContext = browser.defaultBrowserContext();
// const incognitoContext = await browser.createIncognitoBrowserContext();
const [page] = await browser.pages();
page.setViewport({ width: config.width, height: config.height });

Object.defineProperties(window, {
	browser: { value: browser },
	page: { value: page },
});

await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);

const gotoResult = await page.goto(config.url).catch((err) => err);
if (gotoResult instanceof Error) {
	console.error(`${config.url} failed. Is the app running? "${gotoResult.message}"`);
	Deno.exit(1);
}

await Promise.all(
	uitests.map((path) => {
		return import(path).then((module) => {
			if (config.debug) console.log(`path import(${path})`, import.meta, module);
			return module;
		});
	})
);
// Stops the coverage gathering
const [jsCoverage, cssCoverage] = await Promise.all([
	page.coverage.stopJSCoverage(),
	page.coverage.stopCSSCoverage(),
]);

// Calculates how many bytes are being used based on the coverage
const calculateUsedBytes = (type, coverage) =>
	coverage.map(({ url, ranges, text }) => {
		let usedBytes = 0;
		ranges.forEach((range) => (usedBytes += range.end - range.start - 1));
		const totalBytes = text.length;
		return {
			url,
			usedBytes,
			totalBytes,
			usedPercent: Math.round((usedBytes / totalBytes) * 100),
		};
	});
const jsUsage = calculateUsedBytes('js', jsCoverage);
const jsUsageModerate = jsUsage.filter((item) => {
	return item.usedPercent < 91 && item.usedPercent >= 50;
});
const jsUsageLow = jsUsage.filter((item) => item.usedPercent < 50);
const cssUsage = calculateUsedBytes('css', cssCoverage);
console.log(
	`${jsUsage.length} JavaScripts; ${jsUsageModerate.length} are 90-50% used; ${jsUsageLow.length} less than 50%`
);
if (config.verbose)
	console.info(
		jsUsageLow
			.sort((a, b) => {
				const n = a.usedPercent,
					m = b.usedPercent;
				return n < m ? -1 : n > m ? 1 : 0;
			})
			.map((item) => `${item.usedPercent}% of ${item.totalBytes}b ${item.url}`)
	);
//console.info(cssUsage);

// hold process until we explicitly end it
// await browser.waitForTarget(() => false);
// set location to the north pole
// await page.setGeolocation({ latitude: 90, longitude: 0 });
/*
const dimensions = await page.evaluate(() => {
return {
width: document.documentElement.clientWidth,
height: document.documentElement.clientHeight,
deviceScaleFactor: window.devicePixelRatio,
};
});

console.log("Dimensions:", dimensions);

// Captures the current state of the accessibility tree
const snapshot = await page.accessibility.snapshot();
console.info(snapshot);
*/

/**/
//Capture console output - You can listen for the console event. This is also handy when debugging code in page.evaluate():
/*
page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
await page.evaluate(() => console.log(`url is ${location.href}`));
*/
/*
* to set a breakpoint in puppeteer, when devtools are open (devtools: true)
await page.evaluate(() => {
debugger;
});
* */

/*

What’s the difference between a “trusted" and "untrusted" input event?
In browsers, input events could be divided into two big groups: trusted vs. untrusted.

Trusted events: events generated by users interacting with the page, e.g. using a mouse or keyboard.
Untrusted event: events generated by Web APIs, e.g. document.createEvent or element.click() methods.
Websites can distinguish between these two groups:

using an Event.isTrusted event flag
sniffing for accompanying events. For example, every trusted 'click' event is preceded by 'mousedown' and 'mouseup' events.
For automation purposes it’s important to generate trusted events. All input events generated with Puppeteer are trusted and fire proper accompanying events. If, for some reason, one needs an untrusted event, it’s always possible to hop into a page context with page.evaluate and generate a fake event:

await page.evaluate(() => {
document.querySelector('button[type=submit]').click();
});
*/
// Deno has no Buffer, so it is replaced with Uint8Array
//
// Executes Navigation API within the page context
const metricsReport = await page.evaluate(() => JSON.stringify(window.performance));
// Parses the result to JSON
function reportMetrics() {
	const metrics = JSON.parse(metricsReport);
	const { timeOrigin, timing } = metrics;
	const { connectStart, domLoading, domInteractive, loadEventEnd } = timing;
	console.info({
		url: config.url.toString(),
		load: loadEventEnd - connectStart,
		ready: domInteractive - connectStart,
	});
}

/*
TODO this will run pending async tests if there is a problem getting that to happen as expected
runs them all again a second time when not wrapped in outer async function

related:
async runTests()
https://github.com/denoland/deno/issues/10941
https://github.com/denoland/deno_std/issues/162
discussion of testing API
https://github.com/denoland/deno/discussions/10771
more
https://deno.land/manual/testing
https://deno.land/std/testing
*/
// await Deno[Deno.internal].runTests();

reportMetrics();

await browser.close();
