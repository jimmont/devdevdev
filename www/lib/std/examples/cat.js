// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
var filenames = Deno.args;
for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
    var filename = filenames_1[_i];
    var file = await Deno.open(filename);
    await Deno.copy(Deno.stdout, file);
    file.close();
}
//# sourceMappingURL=cat.js.map
