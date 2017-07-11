const Plugin = module.parent.require('../Structures/Plugin');

class CopyCode extends Plugin {
    constructor(...args) {
        super(...args);
        this.mo = new MutationObserver(this.check.bind(this));
        this.mo.observe(document.querySelector("[data-reactroot]"), { childList: true, subtree: true });
    }

    unload(){
        this.mo.disconnect();
        document.querySelectorAll(".pre-copy-button").forEach(tag => {
            tag.parentNode.removeChild(tag);
        });
    }

    check() {
        document.querySelectorAll(".markup pre").forEach(block => {
            if(!block.lastChild.classList.contains('pre-copy-button')){
                block.innerHTML += `<div class="pre-copy-button" onclick="range=document.createRange();range.selectNode(this.parentNode);window.getSelection().addRange(range);document.execCommand('copy')"></div>`;
            }
        });
    }
}

module.exports = CopyCode;