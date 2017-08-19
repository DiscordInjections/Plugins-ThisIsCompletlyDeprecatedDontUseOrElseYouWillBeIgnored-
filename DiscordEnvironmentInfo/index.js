const Plugin = module.parent.require('../Structures/Plugin');
class DiscordEnvironmentInfo extends Plugin {
    load() {
        this.registerCommand({
            name: 'envinfo',
            info: 'Shows information about the current environment.',
            func: this.envinfo.bind(this, true)
        });
    }
    envinfo(args) {
        const v = new Date().getTime();
        webpackJsonp([], {[v]: (a, b, d) => {
            for (let f = 0, g = {};;) {
                g = d(f++) || {};
                let h = g._globalOptions;
                if (h) {
                    if (h.environment === "ptb") {
                        var relchannel = "PTB";
                    }
                    else {
                        var relchannel = (h.environment.charAt(0).toUpperCase() + h.environment.slice(1));
                    };
                    this.sendLocalMessage(
                        "**Release channel:** `" + relchannel + "`"
                        + "\n**App Version:** `" + require("electron").remote.app.getVersion() + "`"
                        + "\n**Build Number:** `" + h.release + "`"
                        + "\n────────────────────"
                        + "\n**Node version:** `" + process.versions.node + "`"
                        + "\n**Chromium version:** `" + process.versions.chrome
                        + "`\n**v8 version:** `" + process.versions.v8 + "`");
                    break
                }
            }
        }},[v]);
    }
    
    get configTemplate() { return { color: '00ff85' }; }
}
module.exports = DiscordEnvironmentInfo;