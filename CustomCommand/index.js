const Plugin = module.parent.require('../Structures/Plugin');
const util = require('util');

class CustomCommand extends Plugin {
  constructor(...args) {
    super(...args);

    this.loadCommands();
  }

  get configTemplate() {
    return {
      color: '68f2c6'
    };
  }

  loadCommands() {
    window._fs.readdir(window._path.join(__dirname, 'Commands'), (err, files) => {
      for (const file of files) {
        if (window._path.extname(file) === '.js') {
          const name = window._path.basename(file, '.js');
          const Class = require('./Commands/' + name);
          const instance = new Class(this);
          window.DI.CommandHandler.hookCommand(instance);
          this.log('Loaded command ' + name);
        }
      }
    });
  }
}

module.exports = CustomCommand;
