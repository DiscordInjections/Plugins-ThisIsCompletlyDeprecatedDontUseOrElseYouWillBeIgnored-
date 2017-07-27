const Plugin = module.parent.require('../Structures/Plugin');

class BetterChannels extends Plugin {
    constructor(...args) {
        super(...args);
        
        this.mo = new MutationObserver(this.tickChannels.bind(this));
        this.mo.observe(document.querySelector(".channels-wrap"), { childList: true, subtree: true });
    }

    tickChannels(){
        this.mo.disconnect(); // Prevent loop
        
        let c_channels = document.querySelectorAll(".channel-margin-left");
        let c_headers = document.querySelectorAll(".channel-header");
        for(let i = 0; i < c_channels.length; i++){
            c_channels[i].className = c_channels[i].classList.remove("channel-margin-left");
            c_channels[i].querySelector("div[class*='name']").innerHTML = c_channels[i].dataset.name
        }
        for(let i = 0; i < c_headers.length; i++){
            c_headers[i].remove();
        }
        
        let channels = document.querySelectorAll(".channels-wrap div[class*=content][class*=Text]");
        if(channels != null){
            let channel_category = null;
            let channel_category_c = false;
            for(let i = 0; i < channels.length; i++){
                let channel = channels[i];
                let channel_name = channel.querySelector("div").parentNode.parentNode.parentNode.dataset.name;
                if(channel_name === null || channel_name === undefined){
                    channel_name = channel.querySelector("div + div").innerHTML;
                    channel.querySelector("div").parentNode.parentNode.parentNode.dataset.name = channel_name;
                }
                
                let channel_name_s = channel_name.split("-");
                if(channel_name_s.length > 1){
                    let channel_prefix = channel_name_s[0];
                    
                    if(channel_prefix != channel_category){
                        channel_category_c = false;
                        channel_category = channel_prefix;
                    }else{
                        let channel_container = channel.parentNode.parentNode;
                        if(!channel_category_c){
                                
                            channel_category_c = true;
                                
                            let header = document.createElement("div");
                            header.className = "channel-header";
                            header.innerHTML = channel_category;
                            
                            channel_container.previousSibling.className += " channel-margin-left";
                            channel_container.className += " channel-margin-left";
                                
                            let prev_channel = channel_container.previousSibling.querySelector("div > div > div + div");
                                
                            prev_channel.innerHTML = prev_channel.innerHTML.replace(channel_prefix + "-", "");
                            channel.querySelector("div + div").innerHTML = channel.querySelector("div + div").innerHTML.replace(channel_prefix + "-", "");
                            
                            channel_container.parentNode.insertBefore(header, channel_container.previousSibling);
                        }else{
                            channel_container.classList.add("channel-margin-left");
                            channel.querySelector("div + div").innerHTML = channel.querySelector("div + div").innerHTML.replace(channel_prefix + "-", "");
                        }
                    }
                }else{
                    channel_category_c = false;
                    channel_category = null;
                }
            } 
        }
        
        this.mo.observe(document.querySelector(".channels-wrap"), { childList: true, subtree: true });
    }
    
    unload() {
        this.mo.disconnect();
    }
}

module.exports = BetterChannels;
