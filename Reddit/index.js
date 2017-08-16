const Plugin = module.parent.require('../Structures/Plugin')
const snekfetch = require("snekfetch")

class Reddit extends Plugin{

	arrayRandom(array){
		return array[Math.floor(Math.random() * ((array.length-1) - 0 + 1)) + 0]
	}

	constructor(...args){
		super(...args)

		this.log("Reddit Loaded")
		
		this.registerCommand({
			name: "reddit",
			info: "Grabs a random submission from a subreddit and posts it",
			usage: "<subreddit> [sort] m",
			func: (args) => {
				let sortBy = "hot"
				let media = false

				if(!args[0]){
					this.sendLocalMessage("Failed to execute; Not enough arguments")
					return
				}

				if(args[1]){
					if(["hot", "new", "rising", "controversial", "top", "guilded"].indexOf(args[1].toLowerCase()) <= -1){
						this.sendLocalMessage("Failed to execute; Invalid option for sort, valid options are `hot`, `new`, `rising`, `controversial`, `top`, `guilded`")
						return
					}

					sortBy = args[1].toLowerCase()
				}

				if(args[2]){
					media = true
				}

				snekfetch.get(`https://www.reddit.com/r/${args[0]}/${sortBy}.json`).then(r => {
					if(r.status === 200){
						let posts = r.body.data.children

						let selfPosts = posts.filter(post => {
							//this.log(post)
							return post.data.is_self
						})

						let mediaPosts = posts.filter(post => {
							return !post.data.is_self
						})

						const selectedChannel = window.DI.client.selectedChannel

						if(!media){

							if(selfPosts.length > 0){

								let post = this.arrayRandom(selfPosts)

								let text = post.data.selftext.replace(/\*/g, "\\*")
								
								let chunks = this.chunkText(post.data.selftext, 1999)

								for(let i=0;i<chunks.length;i++){
									selectedChannel.send(chunks[i])
								}
							}else{
								this.sendLocalMessage("No selfposts found")
							}
						}else{
							if(mediaPosts.length > 0){

								let post = this.arrayRandom(mediaPosts)

								let link = post.data.url

								selectedChannel.send(link)
							}else{
								this.sendLocalMessage("No media posts found")
							}
						}

					}else{
						this.sendLocalMessage("Got an error when fetching subreddit.")
					}
				}).catch(e => {
					let toSend = ""

					switch(e.status){
						case 404:
							toSend = "Subreddit wasn't found."
						break
						default:
							toSend = `Got error ${e.status}.`
							this.log(e)
						break
					}

					this.sendLocalMessage(toSend)
				})
			}
		})

	}

	chunkText(str, l){
		let strs = []
		while(str.length > l){
			let pos = str.substring(0, l).lastIndexOf(' ')
			pos = pos <= 0 ? l : pos
			strs.push(str.substring(0, pos))
			let i = str.indexOf(' ', pos)+1
			if(i < pos || i > pos+l){
				i = pos;
			}
			str = str.substring(i)
		}
		strs.push(str)
		return strs
	}
}

module.exports = Reddit