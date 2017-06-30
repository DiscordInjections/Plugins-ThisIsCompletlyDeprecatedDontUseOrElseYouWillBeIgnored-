const Command = require('../Command');
const request = require('request');

class PingCommand extends Command {
  execute(args) {
    return new Promise((resolve, reject) => {
      request('http://random.cat/meow', (err, res, body) => {
        try {
          body = JSON.parse(body);
          resolve(body.file);
        } catch (err) {
          resolve('An error has occurred...');
        }
      })
    });
  }
}

module.exports = PingCommand
