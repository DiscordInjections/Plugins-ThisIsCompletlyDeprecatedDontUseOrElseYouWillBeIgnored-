const SlugCommand = require('../SlugCommand');

class DIReloadCmd extends SlugCommand {
	constructor(...args){
		super({
			desc: "Reloads a DiscordInjections plugin.",
			usage: "//di-reload plugin"
		}, ...args)
	}

	execute(args, su) {
		try{
			window._pluginManager.reload(args.join(" "));
			su.sendACMessage(`Reloaded ${args.join(" ")}.`);
		}catch(e){
			su.sendACMessage(`${e}`);
		}
	}
}

module.exports = DIReloadCmd