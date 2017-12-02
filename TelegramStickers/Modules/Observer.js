const $ = require('jquery');

class Observer {
    constructor(plugin) {
        this.plugin = plugin;
        this.oBind = this.observer.bind(this);
        window.DI.StateWatcher.on('mutation', this.oBind);
    }
    observer(mutation){
        let self = this;
        /*
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


        if (self.plugin.storage.hideUrls) {
            $('.messages .markup a:not([style="display: none;"])').each(function(){
                self.inject(this);
            });
        }else $('.messages .markup a[style="display: none;"]').css('display', 'initial');

        if($(".telegram-emotes-btn")[0] || !$(".emojiButton-38mF6t")[0]) return;
        self.plugin.insertButton();
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