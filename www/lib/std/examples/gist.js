#!/usr/bin/env -S deno --allow-net --allow-env
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { parse } from "https://deno.land/std/flags/mod.ts";
function pathBase(p) {
    var parts = p.split("/");
    return parts[parts.length - 1];
}
var token = Deno.env()["GIST_TOKEN"];
if (!token) {
    console.error("GIST_TOKEN environmental variable not set.");
    console.error("Get a token here: https://github.com/settings/tokens");
    Deno.exit(1);
}
var parsedArgs = parse(Deno.args);
if (parsedArgs._.length === 0) {
    console.error("Usage: gist.ts --allow-env --allow-net [-t|--title Example] some_file " +
        "[next_file]");
    Deno.exit(1);
}
var files = {};
for (var _i = 0, _a = parsedArgs._; _i < _a.length; _i++) {
    var filename = _a[_i];
    var base = pathBase(filename);
    var content_1 = await Deno.readFile(filename);
    var contentStr = new TextDecoder().decode(content_1);
    files[base] = { content: contentStr };
}
var content = {
    description: parsedArgs.title || parsedArgs.t || "Example",
    public: false,
    files: files
};
var body = JSON.stringify(content);
var res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: [
        ["Content-Type", "application/json"],
        ["User-Agent", "Deno-Gist"],
        ["Authorization", "token " + token]
    ],
    body: body
});
if (res.ok) {
    var resObj = await res.json();
    console.log("Success");
    console.log(resObj["html_url"]);
}
else {
    var err = await res.text();
    console.error("Failure to POST", err);
}
//# sourceMappingURL=gist.js.map