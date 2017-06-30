class Command {
  constructor() {

  }

  execute(args) {
    return args.join(' ');
  }
}

module.exports = Command;
