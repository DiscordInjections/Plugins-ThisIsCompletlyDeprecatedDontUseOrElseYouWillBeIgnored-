const Plugin = module.parent.require('../Structures/Plugin');
const $ = require('jquery');

// Helper function for finding all elements matching selector affected by a mutation
function mutationFind(mutation, selector) {
    const target = $(mutation.target), addedNodes = $(mutation.addedNodes);
    const mutated = target.add(addedNodes).filter(selector);
    const descendants = addedNodes.find(selector);
    const ancestors = target.parents(selector);
    return mutated.add(descendants).add(ancestors);
}

class LineNumbers extends Plugin {
    constructor(...args) {
        super(...args);

        // process entire document
        this.processCodeBlocks({target: document, addedNodes: [document]});

        // watch for changes
        this.observer = new MutationObserver((m, _) => m.forEach(this.processCodeBlocks.bind(this)));
        this.observer.observe(document, { childList:true, subtree:true });
    }

    unload() {
        this.observer.disconnect();
        delete this.observer;

        $(".kawaii-linenumbers")
            .removeClass("kawaii-linenumbers")
            .children()
            .not(":last-child").append(document.createTextNode("\n")).end()
            .contents().unwrap().unwrap();
    }

    get configTemplate() {
        return {
            ignoreNoLanguage: false,
        };
    }

    processCodeBlocks(mutation) {
        mutationFind(mutation, ".hljs").not(":has(ol)")
            .filter((_, e) => !(this.config.ignoreNoLanguage && e.className == "scrollbarGhost-K_3Xa9 scrollbar-11WJwo hljs"))
            .each(function () {
                this.innerHTML = this.innerHTML.split("\n").map(line => "<li>"+line+"</li>").join("");
            })
            .wrapInner($("<ol>").addClass("kawaii-linenumbers"));
    }

}

module.exports = LineNumbers;
