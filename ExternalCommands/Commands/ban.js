module.exports = {
	info: "Bans people.",
	usage: "<@user> [-d=<days>] [reason]",
	func: args => {
		if(!args[0]){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: Not enough arguments.");
			return;
		}
		let user = window.DI.Helpers.resolveMention(args[0]);
		if(!user){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: Invalid user.");
			return;
		}
		let guild = window.DI.client.selectedGuild;
		if(!guild){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: You currently aren't in a guild.");
			return;
		}
		let member = guild.members.get(user.id);
		if(!member){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: User is not in guild.");
			return;
		}
		if(!member.bannable){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: Cannot ban this person.");
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
			window.DI.Helpers.sendLog('SlugMod Legacy', `Successfully banned ${user.username}.`);
		});
	}
};