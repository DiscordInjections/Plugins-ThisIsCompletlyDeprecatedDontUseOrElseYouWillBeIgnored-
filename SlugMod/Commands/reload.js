const SlugCommand = require('../SlugCommand');

class ReloadCmd extends SlugCommand {
	constructor(...args){
		super({
			desc: "Reloads SlugMod's commands.",
			usage: "//reload"
		}, ...args)
	}

	execute(args, su) {
		su.slugmod.loadCommands();
		su.sendACMessage("Triggered a reload.");
	}
}

module.exports = ReloadCmd