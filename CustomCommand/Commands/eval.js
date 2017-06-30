const Command = require('../Command');

class EvalCommand extends Command {
  execute(args) {
    return `Input\n\`\`\`js\n${args.slice(1).join(' ')}\n\`\`\`\nOutput\n\`\`\`js\n${eval(args.slice(1).join(' '))}\n\`\`\``;
  }
}

module.exports = EvalCommand
