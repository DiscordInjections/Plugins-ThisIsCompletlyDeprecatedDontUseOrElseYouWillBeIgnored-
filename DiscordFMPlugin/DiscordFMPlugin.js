const Plugin = module.parent.require('../Structures/Plugin');

class DiscordFMPlugin extends Plugin {
    constructor() {
        super({
            author: 'Snazzah',
            version: '1.0.0',
            description: 'Show current song plaing while listening in Discord.FM.',
            color: '266697'
        });
        this.html = `<div class="container-3lnMWU discord-fm"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 0 0 auto;"><a href="https://discord.fm" target="_BLANK"><div class="dfm-icon"></div></a></div><div class="inner-ptMwR-"><div class="rtc-connection-status"><marquee scrollamount="5">Loading...</marquee></div><span class="channel-3YGMy1">Loading...</span></div><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 0 0 auto;"><a target="_BLANK"><div class="dfm-lib button-3WJ5FX"></div></a></div></div>`;
        this.css = `.discord-fm{background-size:cover;background-position:50%;border:none;}\n.discord-fm .channel-3YGMy1{opacity:0.5;display:inline-block;padding: 5px;border-radius:5px;background-color:rgba(24,25,28,.5);}\n.discord-fm .channel-3YGMy1:hover{opacity:1;text-decoration:none;}\n.dfm-icon {width: 48px;height: 48px;background:transparent no-repeat 50% 50%;background-size:48px 48px;background-image:url(https://widget.discord.fm/img/dfm.png);border-radius:50%;}\n.dfm-icon:hover{background-color:rgba(24,25,28,.3);}\n.dfm-lib{background-image:url(https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_class_white_48px.svg);}\n.discord-fm.error{background:#f44!important;flex-direction:column;text-align:center;}\n.discord-fm.error>*:not(:first-child){display:none;}\n.discord-fm.error>*:first-child>a>div{background-image:url(https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_error_outline_white_48px.svg);}\n.discord-fm.error>*:first-child>a>div:hover{background-color:transparent;}\n.discord-fm.error>*:first-child>a{cursor:default;}\n.discord-fm.error>*:first-child:after{content:'The bot doesn\'t seem to be in the channel!';display:block;font-size:20px;font-weight:bold;width:100%;height:100%;margin-bottom:5px;}\n.discord-fm.error:after{content:'Consult to a Music Manager or a Developer!';color:#ccc;display:block;width:100%;height:100%;}\n.discord-fm.afk{background:#444!important;flex-direction:column;}\n.discord-fm.afk>*:not(:first-child){display:none;}\n.discord-fm.afk>*:first-child>a>div{background-image:url(https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_priority_high_white_48px.svg);}\n.discord-fm.afk>*:first-child>a>div:hover{background-color:transparent;}\n.discord-fm.afk>*:first-child>a{cursor:default;}\n.discord-fm.afk>*:first-child:after{content:'You are AFK in Discord.FM.';display:block;font-size:18px;font-weight:bold;width:100%;height:100%;margin-top:7px;}`;
        document.querySelector("head").innerHTML += `<style class="discord-fm-css">${this.css}</style>`
        window.client.on('voiceStateUpdate', this.onVoiceUpdate.bind(this));
        window.client.on('presenceUpdate', this.onPresenceUpdate.bind(this));
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
                }
            }
        }, 50);
    }
}

module.exports = DiscordFMPlugin;