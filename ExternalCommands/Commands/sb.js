rInt = function(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

rBool = function(){
	return rInt(0,1) === 1;
}

const picURL = "https://fa707ec5abab9620c91c-e087a9513984a31bae18dd7ef8b1f502.ssl.cf1.rackcdn.com/15749735_the-best-mocking-spongebob-memes_4cca620b_m.jpg";
module.exports = {
	info: "???",
	usage: "<message>",
	func: args => {
		const mocktext = args.join(" ").split("").map(c => rBool() ? c.toUpperCase() : c.toLowerCase()).join("");
		if(window.DI.client.selectedChannel){
			let embedPerms = false;
			let filePerms = false;
			if(window.DI.client.selectedChannel.type !== "text"){
				embedPerms = true;
				filePerms = true;
			}else{
				if(window.DI.client.selectedChannel.permissionsFor(window.DI.client.user).has("EMBED_LINKS")){
					embedPerms = true;
				}
				if(window.DI.client.selectedChannel.permissionsFor(window.DI.client.user).has("ATTACH_FILES")){
					filePerms = true;
				}
			}
			if(embedPerms){
				window.DI.client.selectedChannel.send("", { embed: { title: mocktext, image: { url: picURL } } });
			}else if(filePerms){
				window.DI.client.selectedChannel.send(mocktext, { embed: { file: { attachment: picURL, name: "sb.png" } } });
			}else{
				window.DI.client.selectedChannel.send(mocktext);
			}
		}
	}
};
