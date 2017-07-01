const Plugin = module.parent.require('../Structures/Plugin');

const TwitchEmotes = require('./emoteData_Twitch.json');


class EmotePlugin extends Plugin {
    constructor(){
        super({
            author: 'Martmists',
            version: '1.0.0',
            description: 'Adds shitty emotes to Discord',
            color: 'CA4CE3'
        });

        setInterval(this.checkEmotes.bind(this), 15000);
    }

    checkEmotes(){
        let emotes = Object.keys(TwitchEmotes);
        let msgs = document.getElementsByClassName("markup");
        for (let m=0; m<msgs.length; m++){
            let e = msgs[m];
            for (let i=0; i<emotes.length; i++){
                if (e.innerHTML.indexOf(emotes[i]) != -1){
                    e.innerHTML = e.innerHTML.replace(
                        emotes[i],
                        "<img src='https://static-cdn.jtvnw.net/emoticons/v1/"+TwitchEmotes[emotes[i]]+"/1.0' class='emote'/>");
                }
            }
        }
    }
}

module.exports = EmotePlugin;
