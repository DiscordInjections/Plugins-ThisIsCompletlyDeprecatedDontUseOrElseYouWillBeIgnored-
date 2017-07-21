const Plugin = module.parent.require('../Structures/Plugin');
const $ = require('jquery');
const { getOwnerInstance } = require('./reverse');

// Helper function for finding all elements matching selector affected by a mutation
function mutationFind(mutation, selector) {
    const target = $(mutation.target), addedNodes = $(mutation.addedNodes);
    const mutated = target.add(addedNodes).filter(selector);
    const descendants = addedNodes.find(selector);
    const ancestors = target.parents(selector);
    return mutated.add(descendants).add(ancestors);
}

// Mark elements with modified state so that they may be restored later
const animationForced = new WeakSet();

function animateAvatar() {
    /* jshint validthis: true */
    try {
        const messageGroup = getOwnerInstance(this, {include: ["MessageGroup"]});
        if (messageGroup.state.animatedAvatar) {
            animationForced.add(this);
            setTimeout(() => messageGroup.setState({animate: true}));
        }
    } catch (err) {
        // Something (not surprisingly) broke, but this isn't critical enough to completely bail over
        //console.error("DiscordAutoGif", this, err);
        return;
    }
}

class AutoGif extends Plugin {
    constructor(...args) {
        super(...args);

        // process entire document
        this.processGIFs({target: document, addedNodes: [document]});

        $(".theme-dark, .theme-light").on("mouseleave.autoGif", ".message-group", animateAvatar);

        // watch for changes
        this.observer = new MutationObserver((m, _) => m.forEach(this.processGIFs.bind(this)));
        this.observer.observe(document, { childList:true, subtree:true });
    }

    unload() {
        this.observer.disconnect();
        delete this.observer;

        $(".theme-dark, .theme-light").off(".autoGif", ".message-group");

        // Restore original state
        $(".message-group").each(function () {
            if (!animationForced.delete(this)) {
                // This element's state was not modified
                // Don't trigger a pointless re-render with setState
                return;
            }
            try {
                getOwnerInstance(this, {include: ["MessageGroup"]}).setState({animate: false});
            } catch (err) {
                // Something (not surprisingly) broke, but this isn't critical enough to completely bail over
                //console.error("DiscordAutoGif", this, err);
                return;
            }
        });
    }

    get configTemplate() {
        return {};
    }

    // Automatically play GIFs and "GIFV" Videos
    processGIFs(mutation) {
        const accessories = mutationFind(mutation, ".accessory");

        // Handle GIF
        accessories.find(".image:has(canvas)").each(function () {
            const image = $(this);
            const canvas = image.children("canvas").first();
            // Replace GIF preview with actual image
            image.replaceWith($("<img>", {
                src: canvas.attr("src"),
                href: canvas.attr("href"),
                width: canvas.attr("width"),
                height: canvas.attr("height"),
            }).addClass("image kawaii-autogif"));
        });

        // Handle GIFV
        accessories.find(".embed-thumbnail-gifv:has(video)").each(function () {
            const embed = $(this);
            const video = embed.children("video").first();
            // Remove the class, embed-thumbnail-gifv, to avoid the "GIF" overlay
            embed.removeClass("embed-thumbnail-gifv").addClass("kawaii-autogif");
            // Prevent the default behavior of pausing the video
            embed.parent().on("mouseout.autoGif", function (event) {
                event.stopPropagation();
            });
            video[0].play();
        });

        mutationFind(mutation, ".message-group").each(animateAvatar);
    }

}

module.exports = AutoGif;
