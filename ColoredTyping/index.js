const Plugin = module.parent.require('../Structures/Plugin');

class ColoredTyping extends Plugin {
    constructor(...args) {
        super(...args);
        this.data = {};
        window.client.on('message', this.onMessage.bind(this));
        window.client.on('typingStart', this.onTyping.bind(this));
        window.client.on('selectedUpdate', this.onSwitch.bind(this));
        window.client.on('guildMemberUpdate', this.update.bind(this));
        this.mo = new MutationObserver((changes, _) => {
          this.colorize();
        });
        this.mo.observe(document.querySelector(".app>*:first-child>*:first-child"), { childList: true, subtree: true });
        window.client.once('ready', this.onSwitch.bind(this));
        this.colorize();
    }

    unload() {
        this.decolorize();
        window.client.removeListener('message', this.onMessage.bind(this));
        window.client.removeListener('typingStart', this.onTyping.bind(this));
        window.client.removeListener('selectedUpdate', this.onSwitch.bind(this));
        window.client.removeListener('guildMemberUpdate', this.update.bind(this));
    }

    hexToRgb(hex) {
        if(hex.length > 7){hex = hex.slice(0,7-hex.length)}
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    onMessage(msg) {
        if(!window.client.selectedChannel) return;
        if(msg.channel.id !== window.client.selectedChannel.id) return;
        let usrs = document.querySelectorAll(".message .user-name");
        let lastuser = usrs[usrs.length-1];
        var username = lastuser.innerText;
        var color = lastuser.style.color;
        this.data[username] = color;
    }

    onSwitch() {
        if(!window.client.selectedGuild) return;
        window.client.selectedGuild.members.forEach(m=>{
            let rgb = this.hexToRgb(m.displayHexColor);
            if(m.colorRole){
                this.data[m.displayName] = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            }
        });
    }

    update(_, m) {
        if(!window.client.selectedGuild) return;
        let rgb = this.hexToRgb(m.displayHexColor);
        if(m.colorRole) this.data[m.displayName] = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    onTyping(channel, user) {
        if(!window.client.selectedChannel.id === channel.id) return;
        if(!channel.guild){
            this.data[user.username] = "inherit";
            return;
        }
        let m = channel.guild.members.get(user.id);
        // Check if member is cached
        if (m) {
            let rgb = this.hexToRgb(m.displayHexColor);
            if(m.colorRole) this.data[m.displayName] = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            this.colorize();
        } else this.colorize();
    }

    colorize() {
        document.querySelectorAll('.typing strong').forEach((user)=>{
            user.style.color = this.data[user.innerText];
        });
    }

    decolorize() {
        document.querySelectorAll('.typing strong').forEach((user)=>{
            user.style.color = "";
        });
    }

    observer(e) {
        if (e.addedNodes.length && e.addedNodes[0].classList && e.addedNodes[0].classList.contains("typing")) {
            this.decolorize();
            this.colorize();
        }
        if ((e.addedNodes.length && e.addedNodes[0].localName === "strong") ||
            (e.addedNodes.length && e.addedNodes[0].classList && e.addedNodes[0].classList.contains("spinner"))) {
            this.decolorize();
            this.colorize();
        }
        if ((e.removedNodes.length && e.removedNodes[0].localName === "strong") ||
            (e.removedNodes.length && e.removedNodes[0].classList && e.removedNodes[0].classList.contains("spinner"))) {
            this.decolorize();
            this.colorize();
        }
    }
}

module.exports = ColoredTyping;
