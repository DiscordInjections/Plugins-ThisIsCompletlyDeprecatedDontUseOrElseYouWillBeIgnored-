const SlugCommand = require('../SlugCommand');

class BanCmd extends SlugCommand {
	constructor(...args){
		super({
			desc: "Bans people.",
			usage: "//ban @user -d=7 reason"
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
		if(!member.bannable){
			su.sendACMessage("Failed to execute: Cannot ban this person.");
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
			su.sendACMessage(`Successfully banned ${user.username}.`);
		});
	}
}

module.exports = BanCmd