const Plugin = module.parent.require('../Structures/Plugin');

class ReactDevtools extends Plugin {
    constructor(...args) {
        super(...args);
        this.listenerBind = this.listener.bind(this);
        this.window = require("electron").remote.BrowserWindow.getAllWindows()[0];
        try {
            this.path = require("path").resolve(
                process.env.LOCALAPPDATA, "Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/"
            )
            this.versions = require("fs").readdirSync( this.path );
            this.path = require("path").resolve( this.path, this.versions[this.versions.length - 1] );
            this.window.webContents.on("devtools-opened", this.listenerBind);
        } catch (e) {
            this.path = null;
            if (e !== "ENOENT") throw e;
            this.error("Couldn't find react devtools in chrome extensions! Install it here: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi");
            window.DI.PluginManager.unload("reactdevtools");
        }
    }

    get configTemplate() {
        return {
            color: '5555ff'
        };
    }

    unload() {
        this.window.webContents.removeListener("devtools-opened", this.listenerBind);
    }

    listener(){
        require("electron").remote.BrowserWindow.removeDevToolsExtension("React Developer Tools");
        require("electron").webFrame.registerURLSchemeAsSecure("chrome-extension");
        if( this.path != null && null != require("electron").remote.BrowserWindow.addDevToolsExtension( this.path ) )
          this.log("Successfully installed react devtools.");
        else
          this.error("Couldn't find react devtools in chrome extensions!");
    }
}

module.exports = ReactDevtools;