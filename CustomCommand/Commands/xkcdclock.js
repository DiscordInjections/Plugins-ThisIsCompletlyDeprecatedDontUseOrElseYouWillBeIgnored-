const Command = require('../Command');
const request = require('request');

class XkcdCommand extends Command {
  execute(args) {
    return new Promise((resolve, reject) => {
      request('http://imgs.xkcd.com/comics/now.png', (err, res, body) => {
        try {
          resolve(res.request.href);
        } catch (err) {
          resolve('An error has occurred...');
        }
      })
    });
  }
}

module.exports = XkcdCommand
