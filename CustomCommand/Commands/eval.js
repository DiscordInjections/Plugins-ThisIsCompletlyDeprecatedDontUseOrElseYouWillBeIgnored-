const Command = window.DI.require('./Structures/Command');

class EvalCommand extends Command {
  constructor(plugin) {
    super(plugin, {
      name: 'eval',
      info: 'Executes javascript code.',
      usage: '<code>'
    });
  }

  execute(args) {
    try {
      return `Input\n\`\`\`js\n${args.join(' ')}\n\`\`\`\nOutput\n\`\`\`js\n${eval(args.join(' '))}\n\`\`\``;
    } catch (err) {
      return `Error\n\`\`\`js\n${err.stack}\`\`\``;
    }
  }
}

module.exports = EvalCommand;
