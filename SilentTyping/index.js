const Plugin = module.parent.require('../Structures/Plugin');
const { monkeyPatch, WebpackModules } = require('./internals');

class SilentTyping extends Plugin {
    constructor(...args) {
        super(...args);

        const module = WebpackModules.findByUniqueProperties(["sendTyping"]);
        if (!module) {
            this.log("unable to monkey patch sendTyping method");
            return;
        }
        this._cancel = monkeyPatch(module, "sendTyping", {instead: ()=>{}});
    }

    unload() {
        if (this._cancel) {
            this._cancel();
            delete this._cancel;
        }
    }

    get configTemplate() {
        return {};
    }
}

module.exports = SilentTyping;
