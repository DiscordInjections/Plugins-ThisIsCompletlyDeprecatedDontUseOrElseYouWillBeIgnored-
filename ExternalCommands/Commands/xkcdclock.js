const request = require('superagent');

module.exports = {
	info: "???",
	func: args => {
		request.get('http://imgs.xkcd.com/comics/now.png', (err, res) => {
			if(err) {
				console.error(err);
				window.DI.Helpers.sendLog('xkcd', "An error has occurred...", 'https://xkcd.com/s/0b7742.png');
				return;
			}
			const originalfile = "http://imgs.xkcd.com"+res.req.path
			const obj = {
				content: originalfile,
				embeds: [{
					type: 'image',
					url: originalfile,
					thumbnail: {
						proxy_url: originalfile.replace("http://","https://"),
						url: originalfile,
						width: 705,
						height: 706
					}
				}]
			}
			window.DI.Helpers.sendLog('xkcd', obj, 'https://xkcd.com/s/0b7742.png');
		});
	}
};
