const Plugin = module.parent.require('../Structures/Plugin');

class BetterNSFW extends Plugin {
    constructor(...args) {
        super(...args);
        this.mo = new MutationObserver(this.check.bind(this));
        this.mo.observe(document.querySelector(".app-XZYfmp"), { childList: true, subtree: true });
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
            if(react.memoizedProps.children[0]){
                channel.childNodes[0].lastChild.childNodes[1].childNodes[0].data = react.memoizedProps.children[0].props.channel.name;
            }else{
                channel.childNodes[0].lastChild.childNodes[1].childNodes[0].data = react.memoizedProps.children.props.channel.name;
            }
        });
    }

    check() {
        let nsfwRegex = /^nsfw(-|$)/;
        document.querySelectorAll(".channels-wrap div[class*=scroller] div[class*=containerDefault]").forEach(channel => {
            let svg = channel.childNodes[0].lastChild.childNodes[0].childNodes[0]
            if (svg === undefined || svg.childNodes.length == 1) return;
            let channelname = channel.childNodes[0].lastChild.childNodes[1]
            if (channelname === undefined) return
            channelname = channelname.childNodes[0];
            if(!channel.classList.contains("nsfw-filtered") && ((svg.childNodes.length > 1 && svg.childNodes[1].getAttribute("d").startsWith("M9.75,8")) || nsfwRegex.test(channelname.data)) &&
                channel.querySelector('.nsfw-channel-tag') === null){
                channel.classList.add("nsfw-filtered");
                channelname.parentNode.outerHTML += `<span class="nsfw-channel-tag">18+</span>`;
                //channelname.data = channelname.data.replace(/^nsfw-/, "");
            }
        });
    }
}

module.exports = BetterNSFW;