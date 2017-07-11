const SlugCommand = require('../SlugCommand');

class DILoadCmd extends SlugCommand {
	constructor(...args){
		super({
			desc: "Loads a DiscordInjections plugin.",
			usage: "//di-load plugin"
		}, ...args)
	}

	execute(args, su) {
		try{
			window._pluginManager.load(args.join(" "));
			su.sendACMessage(`Loaded ${args.join(" ")}.`);
		}catch(e){
			su.sendACMessage(`${e}`);
		}
	}
}

module.exports = DILoadCmd