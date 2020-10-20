const express = require('express');
const app = express();
const pafs = require('path');
const {URL} = require('url');
const config = {
	hosts: '::'
	,port: 8123
	// https://nodejs.org/api/http.html#http_http_request_options_callback
	,api: {protocol: 'http:', port: 9080, setHost: false}

	,redirect: /^\/(?:api)\b/
/* static resolves multiple directories
	eg static: 'www,dist'
	files: /www/styles.css, /dist/library-from-internet.js
	both serve from root as /styles.css, /library-from-internet.js
	*/
	,static: '.'
	,index: './index.html'
};
// TODO https
const http = require('http');

function exiting(type){ // this === process
	console.log(`http finished with status:${type}`);
	this.exit(0);
}
/* SIGINT Control+C (not-windows only); SIGHUP terminal closed (all); 
https://nodejs.org/api/process.html#process_process_exit_code
 * */
'beforeExit SIGHUP SIGINT SIGUSR1 SIGUSR2 uncaughtException SIGTERM'.trim().split(/[,\s]+/).forEach((event)=>process.on(event, exiting));

process.on('beforeExit',function beforeExit(...args){
	console.log('exiting with',args);
});

// options setup
process.argv.reduce(function configure(options, arg, i){
	// allow name=value or name:value
	var parts = arg.match(/^-*(?:http-?)?([a-z][a-z0-9]+)(?:[=:]?(.+))?/i);
	if(parts){
		let name = parts[1];
		let value = (parts[2] || '').trim();
		options[ name ] = value;
	}
	return options;
}, config);

config.hosts = config.hosts.split(/,\s*/)

console.log(`__filename ${ __filename }
serving http from dir ${process.cwd()}

usage like:
$ node ./http.js

overwrite any option with pattern "name='value'" or "unpkg-name=value"

options: {
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

app
.all(config.redirect, function apiRedirect(req, res, next){
	let {host, ...headers} = req.headers;
	
	req.pipe( http.request({
		...config.api
		,method: req.method
		,path: req.url
		,headers
	}, (relayed)=>{
		relayed.pipe(res);
	}));
})
.all(/^\/ok.*/, function(req, res, next){
// utility for trying HTTP traffic
	var status = (req.query.status || '') * 1;
	if(!isNaN(status) && status > 99 && status < 600){
		res.status(status);
	};
	switch(status){
	case 204: // No Content
		res.end();
	break;
	default:
		res.end(JSON.stringify({status, url: req.url, method: req.method, query: req.query, route: req.route.path, baseUrl: req.baseUrl}, false, '\t'));
	}
})
;

config.static.split(/,/).reduce((app, dir, i)=>{
	dir = dir.trim();
	if(dir){
		const static = express.static(dir, {fallthrough: false});
		console.log(`static ${i} "${dir}"`);
		app.use(static)
	};
	return app;
}, app)

/*
TODO handle 404s by returning /vendor/proxied.js
*/
//TOOD app.use(req, res, next);
app.use(function httpErrorHandler(err, req, res, next){
	const url = new URL(req.url, 'http://'+req.headers.host);
	switch(err.code){
	case "ENOENT":
		res.status(404);
		switch(url.pathname){
		case '/':
			res.sendFile(pafs.resolve(config.index));
		break;
		default:
			res.end(JSON.stringify({method: req.method, url:req.url, accepting: req.headers.accept || '?', pathname: url.pathname, query: req.query, search: url.search}, false, '\t'));
		};
	break;
	};
});

function listenr(){
	var address = this.address();
	console.log(`listening ${address.family} http://${ address.family === "IPv6" ? '['+address.address+']':address.address }:${address.port}/`);
}

config.hosts.forEach(function(host){
	app.listen(this.port, host, listenr);
}, config);

