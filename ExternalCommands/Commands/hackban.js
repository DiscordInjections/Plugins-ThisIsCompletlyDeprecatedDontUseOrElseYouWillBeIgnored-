module.exports = {
	info: "Bans people by their IDs.",
	usage: "<id> [-d=<days>] [reason]",
	func: args => {
		let guild = window.DI.client.selectedGuild;
		if(!guild){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: You currently aren't in a guild.");
			return;
		}
		if(!args[0]){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: Not enough arguments.");
			return;
		}
		let member = guild.members.get(args[0]);
		if(member){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: User is in guild.");
			return;
		}
		if(!guild.members.get(window.DI.client.user.id).hasPermission("BAN_MEMBERS")){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: You do not have the Ban Members permission.");
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
		guild.ban(args[0], options).then(()=>{
			window.DI.Helpers.sendLog('SlugMod Legacy', `Successfully banned ID ${args[0]}.`);
		});
	}
};