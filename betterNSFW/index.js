const Plugin = module.parent.require('../Structures/Plugin');

class BetterNSFW extends Plugin {
    constructor(...args) {
        super(...args);
        this.mo = new MutationObserver(this.check.bind(this));
        this.mo.observe(document.querySelector("[data-reactroot]"), { childList: true, subtree: true });
    }

    get configTemplate() {
        return {
            color: 'e74c3c'
        };
    }

    react(node){
        return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
    }

    unload(){
        this.mo.disconnect();
        document.querySelectorAll(".nsfw-channel-tag").forEach(tag => {
            tag.parentNode.removeChild(tag);
        });
        document.querySelectorAll(".nsfw-filtered").forEach(channel => {
            channel.classList.remove("nsfw-filtered");
            let react = this.react(channel);
            if(!react) return;
            if(react._currentElement.props.children[0]){
                channel.childNodes[0].lastChild.childNodes[1].childNodes[0].data = react._currentElement.props.children[0].props.channel.name;
            }else{
                channel.childNodes[0].lastChild.childNodes[1].childNodes[0].data = react._currentElement.props.children.props.channel.name;
            }
        });
    }

    check() {
        let nsfwRegex = /^nsfw(-|$)/;
        document.querySelectorAll(".channels-wrap .scroller-fzNley .containerDefault-7RImuF").forEach(channel => {
            if(!channel.childNodes[0].lastChild.childNodes[1]) return;
            let channelname = channel.childNodes[0].lastChild.childNodes[1].childNodes[0];
            if(!channel.classList.contains("nsfw-filtered") && nsfwRegex.test(channelname.data)){
                channel.classList.add("nsfw-filtered");
                channelname.parentNode.outerHTML += `<span class="nsfw-channel-tag">18+</span>`;
                //channelname.data = channelname.data.replace(/^nsfw-/, "");
            }
        });
    }
}

module.exports = BetterNSFW;
