const Plugin = module.parent.require('../Structures/Plugin');

const TwitchEmotes = require('./emoteData_Twitch.json');
const BTTVEmotes = require('./emoteData_BTTV.json');


class EmotePlugin extends Plugin {
    constructor(){
        super({
            author: 'Martmists',
            version: '1.0.0',
            description: 'Adds shitty emotes to Discord',
            color: 'CA4CE3'
        });

        this.disableBTTV = true

        setInterval(this.checkEmotes.bind(this), 15000);
        this.emotes = Object.keys(TwitchEmotes);
        this.bttv = Object.keys(BTTVEmotes);
    }

    checkEmotes(){
        let emotes = this.emotes
        let bttv = this.bttv
        let msgs = document.getElementsByClassName("markup");

        for (let m=0; m<msgs.length; m++){
            let e = msgs[m];
            for (let i=0; i<emotes.length; i++){
                if (e.innerText.indexOf(emotes[i]+" ") != -1 ||
                        e.innerText.indexOf(" "+emotes[i]) != -1 ||
                        e.innerText == emotes[i]){
                    this.log("Adding emote: "+emotes[i]);
                    e.innerHTML = e.innerHTML.replace(
                        emotes[i],
                        "<img src='https://static-cdn.jtvnw.net/emoticons/v1/"+TwitchEmotes[emotes[i]]+"/1.0' class='emote' alt='"+emotes[i]+"'/>");
                }
            };

            if (!this.disableBTTV){
                for (let i=0; i<bttv.length; i++){
                    if (e.innerText.indexOf(bttv[i]+" ") != -1 ||
                            e.innerText.indexOf(" "+bttv[i]) != -1 ||
                            e.innerText == bttv[i]){
                        this.log("Adding emote: "+bttv[i]);
                        e.innerHTML = e.innerHTML.replace(
                            bttv[i],
                            "<img src='https://cdn.betterttv.net/emote/"+BTTVEmotes[bttv[i]]+"/1x' class='emote' alt='"+bttv[i]+"'/>");
                    }
                }
            }
        }
    }
}

module.exports = EmotePlugin;
