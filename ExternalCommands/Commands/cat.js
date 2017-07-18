const request = require('superagent');
const is = require('image-size');

module.exports = {
	info: "Get a random cat.",
	func: args => {
		request.get('http://random.cat/meow', (err, res) => {
			if(err) {
				console.error(err);
				window.DI.Helpers.sendLog('random.cat', "An error has occurred...", 'https://lh6.googleusercontent.com/-Bdvg4O_mimc/AAAAAAAAAAI/AAAAAAAAABo/NnvRSD8Hw1g/photo.jpg');
				return;
			}
			const body = res.body;
			request.get(body.file, (err, res2) => {
				if(err) {
					console.error(err);
					window.DI.Helpers.sendLog('random.cat', "An error has occurred...", 'https://lh6.googleusercontent.com/-Bdvg4O_mimc/AAAAAAAAAAI/AAAAAAAAABo/NnvRSD8Hw1g/photo.jpg');
					return;
				}
				const dim = is(res2.body);
				const obj = {
					content: body.file,
					embeds: [{
						type: 'image',
						url: body.file,
						thumbnail: {
							proxy_url: body.file.replace("http://","https://"),
							url: body.file,
							width: dim.width,
							height: dim.height
						}
					}]
				}
				window.DI.Helpers.sendLog('random.cat', obj, 'https://lh6.googleusercontent.com/-Bdvg4O_mimc/AAAAAAAAAAI/AAAAAAAAABo/NnvRSD8Hw1g/photo.jpg');
			});
		});
	}
};