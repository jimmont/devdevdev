const args = Deno.args.reduce((args, arg, i) => {
	// allow name=value or name:value, with or without any leading '-'
	const parts = arg.match(/^-*([a-z][a-z0-9]+)(?:[=:]?(.+))?/i);
	if (parts) {
		const [all, name, value = ''] = parts;
		args[name] = value;
	}
	return args;
}, {});

function fromEnv(name) {
	try {
		return Deno.env.get(name);
	} catch (err) {
		return undefined;
	}
}

function fromArg(name) {
	return args[name];
}

function configEach(name) {
	// arguments override env, both override options
	const env = fromArg(name) ?? fromEnv(name) ?? undefined;
	if (env === undefined) {
		return;
	}
	const value = env.trim();
	switch (typeof this[name]) {
		case 'number':
			this[name] = Number(value);
			break;
		case 'boolean':
			let bool;
			// falsy-case exceptions where casting would be true
			if (/^(?:0|false)$/.test(value)) {
				bool = false;
			} else if (value === '') {
				// presence of flag alone infers true, eg --verbose
				bool = true;
			} else {
				bool = Boolean(value);
			}
			this[name] = bool;
			break;
		default:
			this[name] = value;
	}
}

export function configOverrides(options = {}) {
	Object.keys(options).forEach(configEach, options);
}
