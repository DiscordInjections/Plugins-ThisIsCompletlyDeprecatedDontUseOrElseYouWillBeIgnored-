const Plugin = module.parent.require('../Structures/Plugin');
const reload = require('require-reload');

class SSH extends Plugin {
    constructor(...args) {
        super(...args);
        this.loadCommands();
    }

  get configTemplate() {
   return {
     host: "127.0.0.1",
     username: "root",
     password: "password",
     privateKey: "path/to/privatekey"
   }
  }

    loadCommands() {
        window._fs.readdir(window._path.join(__dirname, 'Commands'), (err, files) => {
            for (const file of files) {
                    if (window._path.extname(file) === '.js') {
                    const name = window._path.basename(file, '.js');
                    const obj = reload('./Commands/' + name);
                    if(!obj.name) obj.name = name;
                    this.registerCommand(obj);
                }
            }
        });
    }
}

module.exports = SSH;
