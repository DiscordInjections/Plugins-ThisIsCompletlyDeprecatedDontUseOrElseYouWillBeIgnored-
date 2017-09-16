const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");

class CharacterCounter extends Plugin {
    constructor(...args) {
        super(...args);
        this.didInit = false;
        this.mo = new MutationObserver(this.init.bind(this));
        this.mo.observe(document.querySelector("#app-mount>div"), { childList: true, subtree: true });
    }

    init() {
        if(document.querySelector("#charcounter")) return;
        let ta = document.querySelector(".channel-text-area-default");
        if(!ta) return;
        this.log("Initializing Counter...");
        let eventhandler = e => {
            setTimeout(() => {
                let length = e.target.value.length;
                $("#charcounter").text(`${length}/2000`);
                if(length > 1999){
                    $("#charcounter")[0].className = "limit"
                }else if(length > 1899){
                    $("#charcounter")[0].className = "danger"
                }else if(length > 1499){
                    $("#charcounter")[0].className = "warning"
                }else if(length > 999){
                    $("#charcounter")[0].className = "minor"
                }else{
                    $("#charcounter")[0].className = ""
                }
            }, 100);
        };
        $(".channel-text-area-default").append(`<span id="charcounter">${document.querySelector(".chat .content textarea").value.length}/2000</span>`);
        $(".chat .content textarea").off("keypress.charCounter").off("keydown.charCounterKey").on("keypress.charCounter", eventhandler).on("keydown.charCounterKey", eventhandler);
    }

    unload() {
        this.mo.disconnect();
        if(document.querySelector("#charcounter")) $("#charcounter").remove();
        $(".chat .content textarea").off("keypress.charCounter").off("keydown.charCounterKey");
    }
}

module.exports = CharacterCounter;
