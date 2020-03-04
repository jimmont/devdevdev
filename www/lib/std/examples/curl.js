// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var url_ = Deno.args[0];
var res = await fetch(url_);
await Deno.copy(Deno.stdout, res.body);
//# sourceMappingURL=curl.js.map
