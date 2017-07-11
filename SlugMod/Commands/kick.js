const SlugCommand = require('../SlugCommand');

class KickCmd extends SlugCommand {
	constructor(...args){
		super({
			desc: "Kicks people.",
			usage: "//kick @user reason"
		}, ...args)
	}

	execute(args, su) {
		if(!args[0]){
			su.sendACMessage("Failed to execute: Not enough arguments.");
			return;
		}
		let user = su.resolveMention(args[0]);
		if(!user){
			su.sendACMessage("Failed to execute: Invalid user.");
			return;
		}
		let guild = window.client.selectedGuild;
		if(!guild){
			su.sendACMessage("Failed to execute: You currently aren't in a guild.");
			return;
		}
		let member = guild.members.get(user.id);
		if(!member){
			su.sendACMessage("Failed to execute: User is not in guild.");
			return;
		}
		if(!member.kickable){
			su.sendACMessage("Failed to execute: Cannot kick this person.");
			return
		}
		member.kick(args.slice(1).join(" ")).then(()=>{
			su.sendACMessage(`Successfully kicked ${user.username}.`);
		});
	}
}

module.exports = KickCmd