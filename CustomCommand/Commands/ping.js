const Command = require('../Command');

class PingCommand extends Command {
  execute(args) {
    return "Pong!";
  }
}


module.exports = PingCommand
