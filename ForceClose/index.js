const Plugin = module.parent.require('../Structures/Plugin');

class ForceClose extends Plugin {
    constructor(...args) {
        super(...args);
        document.querySelector(".win-close").onclick = function(){
            require("electron").remote.require("electron").app.quit();
        };
    }

    unload() {
        document.querySelector(".win-close").onclick = null;
    }
}

module.exports = ForceClose;
