const Command = window.DI.require('./Structures/Command');

class PingCommand extends Command {
  constructor(plugin) {
    super(plugin, {
      name: 'ping',
      info: 'Pong!'
    });
  }
  execute(args) {
    this.plugin.sendLocalMessage('Pong!');
  }
}


module.exports = PingCommand;
