const $ = require('jquery');

class Menu {
    constructor(plugin) {
        this.plugin = plugin;
    }

    init(e){
        const btnBCR = e.target.getBoundingClientRect();
        const boxTop = btnBCR.top-357;
        const boxLeft = btnBCR.left-318;
        $(`<div class="popout popout-top-right no-arrow no-shadow" style="z-index: 2000; visibility: visible; left: ${boxLeft}px; top: ${boxTop}px;"></div>`)
            .appendTo($('#app-mount>div>[class="theme-dark"],#app-mount>div>[class="theme-light"]').first())
            .append(this.build())
    }

    build(){
        return $(`<div id="bda-qem-line-container"></div>`).append([
            $(`<div class="scroller-wrap fade"></div>`).append([
                this.confirmBuild(),
                $(`<div class="scroller"></div>`).append(
                    $(`<div class="emote-menu-inner"></div>`).append(
                        this.plugin.storage.stickers.map(e=>this.plugin.lspack.wrapPack(e.starting_id))
                    )
                )
            ]),
            `<div class="preview-container"><div class="preview-wrapper" style="visibility: hidden; opacity: 0; background-size: inherit;"></div></div>`,
            ...this.plugin.categories.build()
        ]);
    }

    appendPack(id){
        if (!this.open) return;
        this.plugin.log('Appending a pack to the current container');
        $('#bda-qem-line-container .emote-menu-inner').append(this.plugin.lspack.wrapPack(id));
        var pack = this.plugin.storage.getPack(id);
        var id = pack['starting_id'];
        $('#bda-qem-line-container .categories-wrapper').append(`<div class="item" data-id="${id}" onclick='document.querySelector(\`#bda-qem-line-container .line-pack[data-id="${id}"]\`).scrollIntoView()' style='background-image: url("https://api.snazzah-is.cool/line-sticker/${id}")'></div>`);
    }

    removePack(id){
        $(`#bda-qem-line-container .line-pack[data-id="${id}"]`).remove();
        $(`#bda-qem-line-container .categories-container .item[data-id="${id}"]`).remove();
    }

    get open(){
        let container = document.getElementById('bda-qem-line-container')
        if (container) {
            let display = container.style.display;
            if (display !== 'none') return true;
        }
        return false;
    }

    rebuild(){
        return $(`.emote-menu-inner`).empty().append(this.plugin.storage.stickers.map(e=>this.plugin.lspack.wrapPack(e.starting_id)));
    }

    confirmBuild(){
        const locale = this.plugin.locale;
        let self = this;
        return $(`<div class="confirm" style="opacity: 0; pointer-events: none;"></div>`).append(
            $(`<div class="box"></div>`).append([
                $(`<h3 class="value"></h3>`),
                $(`<h3 style="padding: 10px;">${locale['delete-confirm']}</h3>`),
                $(`<div></div>`).append([
                    $(`<span class="yes">${locale['yes']}</span>`).click(function() {
                        let id = $(this).attr('data-id');
                        if(!id) return;
                        self.plugin.storage.deletePack(Number(id));
                        self.removePack(id);
                        self.confirmHide();
                        $(this).attr('data-id', '');
                    }),
                    $(`<span class="no">${locale['no']}</span>`).click(self.confirmHide)
                ])
            ])
        );
    }

    confirmShow(){
        $('#bda-qem-line-container .confirm').css('opacity', '1').css('pointer-events', 'unset');
    }

    confirmHide(){
        $('#bda-qem-line-container .confirm')
            .css('opacity', '0').css('pointer-events', 'none');
        $('#bda-qem-line-container .confirm .yes').attr('data-id', '');
    }

    previewShow(url){
        $('#bda-qem-line-container .preview-container .preview-wrapper')
            .css('visibility', 'visible').css('opacity', '1')
            .css('background-image', `url("${url}")`);
    }

    previewHide(){
        $('#bda-qem-line-container .preview-container .preview-wrapper')
            .css('visibility', 'hidden')
            .css('opacity', '0');
    }
}

module.exports = Menu;
