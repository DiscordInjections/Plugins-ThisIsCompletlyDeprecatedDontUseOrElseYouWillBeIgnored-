const Command = window.DI.require('./Structures/Command');
const request = require('request');

class XkcdCommand extends Command {
  constructor(plugin) {
    super(plugin, {
      name: 'xkcdclock',
      info: 'Shows you the latest XKCD comic.'
    });
  }

  execute(args) {
    return new Promise((resolve, reject) => {
      request('http://imgs.xkcd.com/comics/now.png', (err, res, body) => {
        try {
          resolve(res.request.href);
        } catch (err) {
          resolve('An error has occurred...');
        }
      });
    });
  }
}

module.exports = XkcdCommand;
