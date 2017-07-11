const SlugCommand = require('../SlugCommand');

class HackBanCmd extends SlugCommand {
	constructor(...args){
		super({
			desc: "Bans people by their IDs",
			usage: "//hackban ID -d=7 reason"
		}, ...args)
	}

	execute(args, su) {
		let guild = window.DI.client.selectedGuild;
		if(!guild){
			su.sendACMessage("Failed to execute: You currently aren't in a guild.");
			return;
		}
		if(!args[0]){
			su.sendACMessage("Failed to execute: Not enough arguments.");
			return;
		}
		let member = guild.members.get(args[0]);
		if(member){
			su.sendACMessage("Failed to execute: User is in guild.");
			return;
		}
		if(!guild.members.get(window.DI.client.user.id).hasPermission("BAN_MEMBERS")){
			su.sendACMessage("Failed to execute: You do not have the Ban Members permission.");
			return;
		}
		let options = {
			reason: args.slice(1).join(" ")
		};
		if(args[1] && args[1].match(/-d=(\d+)/)){
			let days = args[1].match(/-d=(\d+)/)[1];
			options.reason = args.slice(2).join(" ");
			options.days = parseInt(days);
		}
		member.ban(options).then(()=>{
			su.sendACMessage(`Successfully banned ${args[0]}.`);
		});
	}
}

module.exports = HackBanCmd