module.exports = {
	info: "Kicks people.",
	usage: "<@user> [reason]",
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
		if(!member.kickable){
			window.DI.Helpers.sendLog('SlugMod Legacy', "Failed to execute: Cannot kick this person.");
			return
		}
		member.kick(args.slice(1).join(" ")).then(()=>{
			window.DI.Helpers.sendLog('SlugMod Legacy', `Successfully kicked ${user.username}.`);
		});
	}
};