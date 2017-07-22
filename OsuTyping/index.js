const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");

class OsuTyping extends Plugin {
    constructor(...args) {
        super(...args);
        if($("#tsp-ts").length) return;
        $("head").append('<audio id="tsp-ts"><source src="//betterdiscord.net/stuff/ts4.wav"></audio>');
        this.ts = $("#tsp-ts");
        if($("#tsp-bs").length) return;
        $("head").append('<audio id="tsp-bs"><source src="//betterdiscord.net/stuff/bs.wav"></audio>');
        this.bs = $("#tsp-bs");

        var self = this;
        $(document).on("keypress.ts", function(e) {
            self.ts.trigger("pause");
            self.bs.trigger("pause");
            self.ts.prop("currentTime", 0);
            self.bs.prop("currentTime", 0);
            self.ts.trigger("play");
        });

        $(document).on("keydown.ts", function(e) {
            if(e.keyCode == 8) {
                self.bs.trigger("pause");
                self.bs.prop("currentTime", 0);
                self.bs.trigger("play");
                return;
            }
        });
    }

    unload() {
        $(document).off("keypress.ts");
        $(document).off("keydown.ts");
    }
}

module.exports = OsuTyping;