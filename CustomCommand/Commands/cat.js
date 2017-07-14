const Command = window.DI.require('./Structures/Command');
const request = require('request');

class CatCommand extends Command {
  constructor(plugin) {
    super(plugin, {
      name: 'cat',
      info: 'Gives you a lovely cat! :3'
    });
  }

  execute(args) {
    return new Promise((resolve, reject) => {
      request('http://random.cat/meow', (err, res, body) => {
        try {
          body = JSON.parse(body);
          resolve(body.file);
        } catch (err) {
          resolve('An error has occurred... 3:');
        }
      });
    });
  }
}

module.exports = CatCommand;
