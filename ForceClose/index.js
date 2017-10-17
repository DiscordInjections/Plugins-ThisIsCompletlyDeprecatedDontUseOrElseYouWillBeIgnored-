const Plugin = module.parent.require('../Structures/Plugin');

class ForceClose extends Plugin {
    constructor(...args) {
        super(...args);
        document.querySelector(".winButtonClose-2rIvsa").onclick = function(){
            require("electron").remote.require("electron").app.quit();
        };
    }

    unload() {
        document.querySelector(".winButtonClose-2rIvsa").onclick = null;
    }
}

module.exports = ForceClose;
