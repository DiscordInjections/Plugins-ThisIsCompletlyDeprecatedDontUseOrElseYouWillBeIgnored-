const SlugCommand = require('../SlugCommand');

class DIUnloadCmd extends SlugCommand {
	constructor(...args){
		super({
			desc: "Unloads a DiscordInjections plugin.",
			usage: "//di-unload plugin"
		}, ...args)
	}

	execute(args, su) {
		try{
			window._pluginManager.unload(args.join(" "));
			su.sendACMessage(`Unloaded ${args.join(" ")}.`);
		}catch(e){
			su.sendACMessage(`${e}`);
		}
	}
}

module.exports = DIUnloadCmd