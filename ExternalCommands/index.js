const Plugin = module.parent.require('../Structures/Plugin');
const reload = require('require-reload');

class ExternalCommands extends Plugin {
    constructor(...args) {
        super(...args);
        this.loadCommands();
    }

    get configTemplate() {
        return {
            color: '0A6906'
        };
    }

    loadCommands() {
        this.registerCommand({
            name: "extcmd-reload",
            info: "Reload all commands in ExternalCommands",
            func: this.commandReload.bind(this)
        });
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

    commandReload(args) {
        this.log("Preparing reload...")
        for (const command of this._commands) {
            window.DI.CommandHandler.unhookCommand(command.name);
        }
        this.loadCommands();
        window.DI.Helpers.sendLog('ExternalCommands', "Reloaded commands.");
    }
}

module.exports = ExternalCommands;