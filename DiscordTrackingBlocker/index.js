const Plugin = module.parent.require('../Structures/Plugin');
class DiscordTrackingBlocker extends Plugin {
    load() {
        XMLHttpRequest.prototype._oldOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (u, r) {
            if ((/\/track$/i).test(r)) {
                throw new Error('Tracking request blocked!');
            }
            XMLHttpRequest.prototype._oldOpen.apply(this, arguments);
        };
    }
    
    get configTemplate() { return { color: '00ff85', }; }
}
module.exports = DiscordTrackingBlocker;