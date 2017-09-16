const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");
var resizexDragging;
var resizexHandle;
var resizexImage;
var resizexWidth;
var resizexX;
var resizexY;
var resizexAspectRatio;

class ResizeX extends Plugin {
    constructor(...args) {
        super(...args);
        let plugin = this;
        this.mo = new MutationObserver(this.init.bind(this));
        this.mo.observe(document.querySelector("#app-mount>div"), { childList: true, subtree: true });
        $(document).on("mousemove.resizex", function(e) {
            if (resizexHandle) {
                $(resizexHandle).siblings().width(resizexWidth + (e.pageX - resizexX + e.pageY - resizexY) / 2);
                $(resizexHandle).siblings().height($(resizexHandle).siblings().width() * resizexAspectRatio);
            }
            if (resizexImage) {
                resizexDragging = true;
                $(resizexImage).width(resizexWidth + (e.pageX - resizexX + e.pageY - resizexY) / 2);
            }
        }).on("mouseup.resizex", function() {
            resizexHandle = null;
            resizexImage = null;
            plugin.uninjectDragCSS();
        });
    }

    get configTemplate() {
        return {
            color: "FFFF00"
        };
    }

    init(m) {
        m.forEach(this.observer.bind(this));
    }

    injectDragCSS() {
        $(`<style class="resizex-dragging">iframe{pointer-events:none;}*{-webkit-user-select:none!important;cursor:nwse-resize!important;}</style>`).appendTo("head");
    }

    uninjectDragCSS() {
        $(`.resizex-dragging`).remove();
    }

    observer(e) {
        let plugin = this;
        if (e.addedNodes.length && e.addedNodes[0].classList && e.addedNodes[0].classList.contains("embed-thumbnail-video")) {
            $("<div class='resizex-handle'><div class='resizex-icon'/></div>")
                .insertAfter($(e.addedNodes[0]).find("iframe"))
                .on("mousedown.resizex", function(e) {
                    resizexWidth = $(this).siblings().width();
                    resizexX = e.pageX;
                    resizexY = e.pageY;
                    resizexHandle = this;
                    resizexAspectRatio = $(this).siblings().height() / $(this).siblings().width();
                    plugin.injectDragCSS();
                });
        }
        if (e.addedNodes.length && $(e.addedNodes[0]).attr("src") && $(e.addedNodes[0]).attr("src").indexOf("discordapp") != -1 && ($(e.addedNodes[0]).parent().attr('class')?$(e.addedNodes[0]).parent().attr('class').indexOf("embed-thumbnail-video") == -1:true)) {
            $(e.addedNodes[0])
                .one("mousedown.resizex", function() {
                    resizexWidth = $(this).width();
                    $(this)
                        .attr("src", $(this).attr("src").split("?")[0])
                        .attr("height", "")
                        .attr("width", "")
                        .attr("draggable", "false")
                        .width(resizexWidth)
                        .css("min-width", resizexWidth)
                        .css("max-width", "none")
                        .parent().attr("draggable", "false");
                })
                .on("mousedown.resizex", function(e) {
                    resizexImage = this;
                    resizexWidth = $(this).width();
                    resizexX = e.pageX;
                    resizexY = e.pageY;
                    resizexDragging = false;
                })
                .parent()
                .on("click.resizex", function() {
                    if (resizexDragging)
                        return false;
                });
        }
    }

    unload() {
        this.mo.disconnect();
        $(document).add("*").off(".resizex");
    }
}

module.exports = ResizeX;
