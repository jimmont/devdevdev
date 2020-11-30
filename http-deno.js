/*
deno run --allow-read --allow-net http.js www=../some/where

deno run -A --unstable --inspect-brk ./http.js

https://deno.land/x/oak
https://deno.land/manual/runtime/program_lifecycle
https://doc.deno.land/builtin/stable

EOL.LF .CRLF see https://deno.land/std/fs
*/
import * as pafs from "https://deno.land/std/path/mod.ts";
import { Application, Router, HttpError, send, Status } from "https://deno.land/x/oak/mod.ts";

const config = {
	hostname: 'localhost'
	,port: 8123
	// TODO
	,api: {protocol: 'http:', port: 9080, setHost: false}
	,redirect: /^\/(?:api)\b/
/* TODO static resolves multiple directories
	eg static: 'www,dist'
	files: /www/styles.css, /dist/library-from-internet.js
	both serve from root as /styles.css, /library-from-internet.js
	,static: '.'
	*/
	,www: '.'
	,index: 'index.html'

	// default expiration caching (minimum 1 second);
	,expires: 'private, max-age=7, s-maxage=8'
};

Deno.args.reduce(function configure(options, arg, i){
	// allow name=value or name:value
	var parts = arg.match(/^-*(?:http-?)?([a-z][a-z0-9]+)(?:[=:]?(.+))?/i);
	if(parts){
		let name = parts[1];
		let value = (parts[2] || '').trim();
		options[ name ] = value;
	}
	return options;
}, config);

// NOTE resolve(Deno.cwd(), '/root') => '/root'
config.root = pafs.resolve(Deno.cwd(), config.www);
config.userAgent = `Deno/${Deno.version.deno} V8/${Deno.version.v8} TS/${Deno.version.typescript} ${Deno.build.target}`;

console.log(`pid ${ Deno.pid }
$0 ${ import.meta.url }
cwd ${ Deno.cwd() }

usage like:
$ deno run -A ./http.js

overwrite any option with pattern "name='value'" or "www=../www"

${ JSON.stringify(config, (key, val)=>{
	switch(typeof val){
	case 'object':
		if(val && val.constructor.name !== 'Object') return val.toString();
		return val;
	break;
	case 'function':
		return val.toString();
	break;
	default:
		return val;
	}
}, '\t') }
}

`);

const app = new Application(config);
const router = new Router();

// TODO
router.get('/events', (context) => {
//	const headers = new Headers([['content-type', 'text/event-stream']]);
	const target = context.sendEvents();//{ headers });
	target.addEventListener('close', e => {
		console.log('bye! no more /events for you');
	});
	/*
	target.addEventListener('close', e => {
		// cleanup
	});

	on client:
	const source = new EventSource("/events");
	source.addEventListener("ping", (evt) => {
		console.log(evt.data); // should log a string of the pre-parsed JSON above/below
	});
	*/
	target.dispatchMessage({text: 'messages'});
	setTimeout(()=>{
		target.dispatchMessage({text: 'message2'});
	}, 1000)
	// or close the connection when desired: await target.close();
});


const charset = '; charset=utf-8';
const mimetypes = {
	css: `text/css${ charset }`
	,ico: `image/vnd.microsoft.icon`
	,jpg: `image/jpeg`
	,js: `text/javascript${ charset }`
	,json: `application/json${ charset }`
	,pdf: `application/pdf${ charset }`
	,txt: `text/plain${ charset }`
	,html: `text/html${ charset }`
	// application/csp-report as JSON
};

// general error handling including unhandled middleware errors (500)
app.use(async ({response, request}, next) => {
	try{
		await next();
	}catch(err){
		const status = err instanceof HttpError ? err.status : 500;
		// respect error status codes set by other middleware
		if((response.status || 0) < 400){
			response.status = status;
		};
		log(status, request.method, request.url.href, request.user, request.headers.get('user-agent'), request.ip);
		// adjust response to fit requested mimetype
		let ext = request.url.pathname.split('?')[0].split('.').pop().toLowerCase();
		
		let type = mimetypes[ ext ] || mimetypes[ ( ext = 'html' ) ];
		response.type = type;

		// short caches on errors
		response.headers.set('Cache-Control', config.expires);

		const msg = (err.message || '').slice(0, 3000);

		if(err.expose){
			response.headers.set('X-appmsg', msg);
		};

		// send an appropriate response
		switch(ext){
		case 'html':
		response.body = `<!doctype html>
<html><body>
<p>${status} ${ Status[status] || 'Internal Server Error' }</p>
</body></html>`;
		break;
		default:
		response.body = '';
		}
	}
});

function log(status='000', VERB='GUESS', what='', who='?', client='~', where='...', other='-'){
	console.log(`${ (new Date).toISOString() } ${ status } "${ VERB } ${ what }" ${ who } "${ client }" ${ where } ${ other }`);
}

// Logger
app.use(async (context, next) => {
	await next();
	const request = context.request;
	const time = context.response.headers.get('X-Response-Time');
	log(context.response.status, request.method, request.url, request.user, request.headers.get('user-agent'), request.ip, time);
});

app.use(async (context, next) => {
	const start = Date.now();
	await next();
	const msg = Date.now() - start;
	context.response.headers.set('X-Response-Time', `${msg}ms`);
});


app.use(router.routes());
app.use(router.allowedMethods());

// static content
app.use(async context => {
	// config = {root: pafs.resolve(Deno.cwd(), '....'), index: 'index.html'}
	await send(context, context.request.url.pathname, config);
});

app.addEventListener('error', (event)=>{
	console.error(event.error);
	log('000', 'ERROR', `${ event.error }`, undefined, config.userAgent);
});
app.addEventListener('listen', (server)=>{
	log('000', 'START', `${ server.secure ? 'https':'http' }://${ server.hostname }:${ server.port }`, undefined, config.userAgent);
});

/*
// Deno.Signal is currently --unstable
// works though I don't know the signals well: inspect Deno.Signal for the hash
// https://en.wikipedia.org/wiki/Signal_(IPC)
// signal.dispose() to stop watching
async function onSignal(it){
	const [name, num] = it;
	for await(const _ of Deno.signal(num)){
		console.log(`Deno pid ${ Deno.pid } bye ${name}`);
		Deno.exit();
	}
};

Object.entries(Deno.Signal).filter(it=>{
	const [name, num] = it;
	let ok = (num !== 4 && num !== 9 && num !== 8 && num !== 11 && num !== 17);
	return ok && name.startsWith('SIG');
}).forEach(onSignal);
*/

const whenClosed = app.listen(config);

await whenClosed;
// this never happens
log('000', 'CLOSE', `${ server.secure ? 'https':'http' }://${ server.hostname }:${ server.port }`, undefined, config.userAgent);

