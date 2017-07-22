const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");

class MediaSupport extends Plugin {
    constructor(...args) {
        super(...args);
        this.interval = setInterval(this.convert, 5000);
        this.convert();
    }

    convert(){
        $(".message .markup a").each(function() {
            var t = $(this);
            var accessory = t.closest(".message").children(".accessory");
            var href = t.attr("href");
            if(href == undefined) return true;
            href = href.replace("http:", "https:");
            if(accessory.children(`.mediasupportplugin[src="${encodeURI(href)}"]`)[0]) return;
            if(!href.endsWith(".mp4") && !href.endsWith(".webm") && !href.endsWith(".ogg") && !href.endsWith(".mp3") && !href.endsWith(".wav")) return true;
            var video = true;
            var type = "webm";
            if(href.endsWith(".mp4")) type = "mp4";
            if(href.endsWith(".ogg")) type = "ogg";
            if(href.endsWith(".mp3")) {
                type = "mpeg";
                video = false;
            }
            if(href.endsWith(".wav")) {
                type = "wav";
                video = false;
            }
            if(video) {
                accessory.append('<video class="mediasupportplugin" width="480" height="320" src="'+encodeURI(href)+'" type="video/'+type+'" controls></video>');
            } else {
                accessory.append('<audio class="mediasupportplugin" src="'+encodeURI(href)+'" type="audio/'+type+'" controls></audio>');
            }
        });
        $(".message .accessory .attachment a").each(function() {
            var t = $(this);
            var accessory = t.closest(".accessory");
            var attachment = t.closest(".attachment");
            var href = t.attr("href");
            if(href == undefined) return true;
            href = href.replace("http:", "https:");
            if(!href.endsWith(".mp4") && !href.endsWith(".webm") && !href.endsWith(".ogg") && !href.endsWith(".mp3") && !href.endsWith(".wav")) return true;
            var video = true;
            var type = "webm";
            if(href.endsWith(".mp4")) type = "mp4";
            if(href.endsWith(".ogg")) type = "ogg";
            if(href.endsWith(".mp3")) {
                type = "mpeg";
                video = false;
            }
            if(href.endsWith(".wav")) {
                type = "wav";
                video = false;
            }
            if(!video && attachment.children(`.mediasupportplugin[src="${encodeURI(href)}"]`)[0]) return;
            if(video && accessory.children(`.mediasupportplugin[src="${encodeURI(href)}"]`)[0]) return;
            if(video) {
                accessory.append('<video class="mediasupportplugin" width="480" height="320" src="'+encodeURI(href)+'" type="video/'+type+'" controls></video>');
            } else {
                attachment.append('<audio class="mediasupportplugin msp-attachment" src="'+encodeURI(href)+'" type="audio/'+type+'" controls></audio>');
            }
        });
    }
    
    unload() {
        clearInterval(this.interval);
        $('.mediasupportplugin').remove();
    }
}

module.exports = MediaSupport;