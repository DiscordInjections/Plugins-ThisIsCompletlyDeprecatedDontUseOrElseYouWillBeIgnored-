const $ = require('jquery');

class Observer {
    constructor(plugin) {
        this.plugin = plugin;
        this.mo = new MutationObserver(this.observer.bind(this));
        this.mo.observe(document.querySelector(".app-XZYfmp"), { childList: true, subtree: true });
    }
    observer(recs){
        let self = this;
        /*
        let mutation = recs[0];
        if (this.plugin.storage.hideUrls) {
                for (var i = 0; i < mutation.addedNodes.length; ++i) {
                var next = mutation.addedNodes.item(i);
                if (next) {
                    var nodes = this.getNodes(next);
                    for (var node in nodes) {
                        if (nodes.hasOwnProperty(node)) {
                            var element = nodes[node].parentElement;
                            if (element) {
                                // skip code blocks
                                if (element.tagName !== 'CODE') {
                                    if (element.classList.contains('edited')) { 
                                        // if message with a sticker was edited, apply the sticker url hide
                                        this.inject(element); 
                                    } else {
                                        // apply the sticker url hide
                                        this.inject(nodes[node]); 
                                    }
                                    }
                                    // if message is being edited, unhide the text
                                    if (element.tagName == "TEXTAREA" && element.style.display == "none") {
                                        element.style.display = "";
                                }
                            }
                        }
                    }
                }
            }
        }*/


        if (this.plugin.storage.hideUrls) {
            $('.messages .markup a:not([style="display: none;"])').each(function(){
                self.inject(this);
            });
        }else{
            $('.messages .markup a[style="display: none;"]').css('display', 'initial');
        }

        if($(".telegram-emotes-btn")[0] || !$(".emojiButton-38mF6t")[0]) return;
        $(`<div class="telegram-emotes-btn"></div>`)
            .append(
                $(`<div style="background-image: url(${this.plugin.randomSticker ? this.plugin.randomSticker : "//i-need.discord.cards/eda565.png"})"></div>`)
                    .mouseover(e=>{
                        if(e.target.classList.contains('hovered')) return;
                        $(e.target).attr('style', `background-image: url(${this.plugin.randomSticker ? this.plugin.randomSticker : "//i-need.discord.cards/eda565.png"})`)
                    })
            )
            .insertAfter(".emojiButton-38mF6t")
            .click(e=>{
                e.target.classList.add('hovered');
                this.plugin.menu.init(e);
            });
    }
    getNodes(node){
        var next;
        var nodes = [];
        var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        while (next = treeWalker.nextNode()) {
            nodes.push(next);
        }
        return nodes;
    }
    inject(node){
        if ((node.innerText.match(/api.snazzah-is.cool\/telegram\/(\w+)\/(.+).webp/g)||[]).length < 1) return
        node.style.display = "none";
    }
}

module.exports = Observer;