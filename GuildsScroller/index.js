const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");

class GuildsScroller extends Plugin {
    constructor(...args) {
        super(...args);
        $(".guilds").wrap('<div class="scroller-wrap fade dark"></div>').wrap('<div class="scroller" style="overflow-x:hidden;"></div>');
    }
    
    unload() {
        $(".guilds").unwrap().unwrap();
    }
}

module.exports = GuildsScroller;