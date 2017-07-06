const Plugin = module.parent.require('../Structures/Plugin');

class DiscordFMPlugin extends Plugin {
    constructor(...args) {
        super(...args);
        this.html = `<div class="container-3lnMWU discord-fm"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 0 0 auto;"><a href="https://discord.fm" target="_BLANK"><div class="dfm-icon"></div></a></div><div class="inner-ptMwR-"><div class="rtc-connection-status"><marquee scrollamount="5">Loading...</marquee></div><span class="channel-3YGMy1">Loading...</span></div><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 0 0 auto;"><a target="_BLANK"><div class="dfm-lib button-3WJ5FX"></div></a></div></div>`;
        window.client.on('voiceStateUpdate', this.onVoiceUpdate.bind(this));
        window.client.on('presenceUpdate', this.onPresenceUpdate.bind(this));
    }

    get configTemplate() {
        return {
            color: '266697'
        };
    }

    unload(){
        this.currentLibName = null;
        this.currentLib = null;
        this.currentVC = null;
        this.removeHTML();
        window.client.removeListener('voiceStateUpdate', this.onVoiceUpdate.bind(this));
        window.client.removeListener('presenceUpdate', this.onPresenceUpdate.bind(this));
    }

    setTitle(title){
        document.querySelector(".discord-fm marquee").innerHTML = title;
    }

    insertHTML(){
        let div = document.createElement("div");
        document.querySelector(".channels-wrap").insertBefore(div, document.querySelector(".container-3lnMWU"))
        div.outerHTML = this.html;
        let libBtn = document.querySelector(".dfm-lib").parentNode;
        libBtn.addEventListener('mouseover', function() {
            document.querySelector(".tooltips").innerHTML += `<div class="tooltip tooltip-top tooltip-normal dfm-tt">Go To Library</div>`;
            let position = libBtn.getBoundingClientRect();
            let tt = document.querySelector(".dfm-tt");
            let newpos = {
                top: position.top,
                left: position.left,
            };
            newpos.top -= 20;
            newpos.left += position.width/2 - tt.getBoundingClientRect().width/2 - 1;
            tt.style.top = `${newpos.top}px`;
            tt.style.left = `${newpos.left}px`;
        });
        libBtn.addEventListener('mouseout', function() {
            document.querySelector(".tooltips").removeChild(document.querySelector(".dfm-tt"));
        });
        this.htmlElement = div;
    }

    removeHTML(){
        this.htmlElement = null;
        document.querySelector("head").removeChild(document.querySelector(".discord-fm-css"));
        if(document.querySelector(".discord-fm")) document.querySelector(".channels-wrap").removeChild(document.querySelector(".discord-fm"));
        if(document.querySelector(".dfm-tt")) document.querySelector(".tooltips").removeChild(document.querySelector(".dfm-tt"));
    }

    onPresenceUpdate(oldMember, newMember){
        if(!newMember.roles.has("143688156837838848")) return;
        if(newMember.user.username === this.currentLibName) this.setTitle(newMember.presence.game.name.slice(2));;
    }

    onVoiceUpdate(oldMember, newMember) {
        window.client.setTimeout(()=>{ // Delay the request because HTML rendering is too fast
            if(oldMember.user.id === window.client.user.id || newMember.user.id === window.client.user.id){
                if(!oldMember.voiceChannel && newMember.voiceChannel){ // Client joins a new channel
                    if((newMember.voiceChannel.guild.id !== '143686242687647745') || newMember.voiceChannel.id === '194816320045318144') return;
                    if(newMember.voiceChannel.id === '169559972764450816'){
                        this.insertHTML();
                        document.querySelector(".discord-fm").classList.add("afk");
                        return;
                    }
                    this.insertHTML();
                    this.currentLib = newMember.voiceChannel.name.replace(/ /g, "-").toLowerCase();
                    this.currentLibName = newMember.voiceChannel.name;
                    this.currentVC = newMember.voiceChannel.id;
                    document.querySelector(".discord-fm").style.backgroundImage = `url(https://widget.discord.fm/img/bgs/${this.currentLib}.png)`;
                    document.querySelector('.channel-3YGMy1').innerText = newMember.voiceChannel.name;
                    document.querySelector('.justifyStart-2yIZo0:last-child a').href = `https://temp.discord.fm/libraries/${this.currentLib}`;
                    if(!newMember.voiceChannel.members.find(m=>m.roles.has("143688156837838848"))){ // Couldn't find the bot
                        document.querySelector(".discord-fm").classList.add("error");
                        this.timeout = setInterval(()=>{
                            if(newMember.voiceChannel.members.find(m=>m.roles.has("143688156837838848"))){
                                if(!this.currentVC){
                                    clearTimeout(this.timeout);
                                    return;
                                };
                                document.querySelector(".discord-fm").classList.remove("error");
                                this.setTitle(window.client.channels.get(this.currentVC).members.find(m=>m.roles.has("143688156837838848")).presence.game.name.slice(2));
                                clearTimeout(this.timeout);
                            }
                        }, 2000)
                    }else{
                        this.setTitle(newMember.voiceChannel.members.find(m=>m.roles.has("143688156837838848")).presence.game.name.slice(2));
                    }
                }else if(oldMember.voiceChannel && !newMember.voiceChannel){ // Client disconnects from channel
                    this.removeHTML();
                    this.currentLib = null;
                    this.currentLibName = null;
                    this.currentVC = null;
                }else if(oldMember.voiceChannel.id !== newMember.voiceChannel.id){ // Client switches channels
                    if((newMember.voiceChannel.guild.id !== '143686242687647745') || newMember.voiceChannel.id === '194816320045318144'){
                        this.removeHTML();
                        this.currentLib = null;
                        this.currentLibName = null;
                        this.currentVC = null;
                        return;
                    };
                    if(!document.querySelector(".discord-fm")){
                        this.insertHTML();
                    }
                    if(newMember.voiceChannel.id === '169559972764450816'){
                        document.querySelector(".discord-fm").classList.add("afk");
                        return;
                    }
                    document.querySelector(".discord-fm").classList.remove("afk");
                    this.currentLib = newMember.voiceChannel.name.replace(/ /g, "-").toLowerCase();
                    this.currentLibName = newMember.voiceChannel.name;
                    this.currentVC = newMember.voiceChannel.id;
                    document.querySelector(".discord-fm").style.backgroundImage = `url(https://widget.discord.fm/img/bgs/${this.currentLib}.png)`;
                    document.querySelector('.channel-3YGMy1').innerText = newMember.voiceChannel.name;
                    document.querySelector('.justifyStart-2yIZo0:last-child a').href = `https://temp.discord.fm/libraries/${this.currentLib}`;
                    this.setTitle(newMember.voiceChannel.members.find(m=>m.roles.has("143688156837838848")).presence.game.name.slice(2));
                }
            }
            if(newMember.roles.has("143688156837838848")){
                if(newMember.voiceChannel && newMember.voiceChannel.id === this.currentVC){
                    document.querySelector(".discord-fm").classList.remove("error");
                    this.setTitle(newMember.presence.game.name.slice(2));
                    clearTimeout(this.timeout);
                }
            }
        }, 300);
    }
}

module.exports = DiscordFMPlugin;