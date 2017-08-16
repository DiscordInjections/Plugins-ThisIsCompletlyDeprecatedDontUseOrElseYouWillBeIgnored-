const Plugin = module.parent.require('../Structures/Plugin')
const snekfetch = require("snekfetch")
const cheerio = require("cheerio")

class Wikipedia extends Plugin{
	constructor(...args){
		super(...args)

		this.log("Wikipedia Loaded")


		
		this.registerCommand({
			name: "wikipedia",
			info: "Grabs the first paragraphs from a Wikipedia article and posts it",
			usage: "<article>",
			func: (args) => {
				if(!args[0]){
					this.sendLocalMessage("Failed to execute; Not enough arguments")
					return
				}

				let url = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${args.join("%20")}&redirects=true`

				const selectedChannel = window.DI.client.selectedChannel

				this.getWikipedia(url, selectedChannel, args.join("%20"))
			}
		})
	}

	getWikipedia(url, channel, title, refer={}){
		this.log("getting "+url)

		snekfetch.get(url).then(r => {
			if(r.status === 200){				
				let content = r.body.query.pages[Object.keys(r.body.query.pages)[0]].extract

				if(content === "" && r.body.query.normalized){
					this.getWikipedia(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${r.body.query.normalized[0].to.replace(" ", "%20")}`, channel, title)
				}else if(content.match(/may\srefer\sto/gi) && !refer.ref){
					this.getWikipedia(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=${title}&redirects=true`, channel, title, {ref: true, text: content})
				}else if(refer.ref){
					const $ = cheerio.load(content)

					let refersTo = [refer.text]

					$("ul > li").each((i, element)  => {
						refersTo.push(`    - ${$(element).text()}`)
					})

					let chunks = this.chunkText(refersTo.join("\n"), 1999)

					for(let i=0;i<chunks.length;i++){
						channel.send(chunks[i])
					}
				}else{
					let chunks = this.chunkText(content, 1999)

					for(let i=0;i<chunks.length;i++){
						channel.send(chunks[i])
					}
				}
			}else{
				this.sendLocalMessage("Got an error when fetching article.")
			}
		}).catch(e => {
			let toSend = ""

			switch(e.status){
				case 404:
					toSend = "Article wasn't found."
				break
				default:
					toSend = `Got error ${e.status}.`
					this.log(e)
				break
			}

			this.sendLocalMessage(toSend)
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

module.exports = Wikipedia