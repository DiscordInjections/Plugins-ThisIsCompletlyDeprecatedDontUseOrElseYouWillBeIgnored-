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
            .append(this.build());
        this.plugin.tspack.checkSets();
    }

    build(){
        return $(`<div id="bda-qem-telegram-container"></div>`).append([
            $(`<div class="scroller-wrap fade"></div>`).append([
                this.confirmBuild(),
                $(`<div class="scroller"></div>`).append(
                    $(`<div class="emote-menu-inner"></div>`).append(
                        this.plugin.storage.sets.map(e=>this.plugin.tspack.wrapSet(e.name))
                    )
                )
            ]),
            `<div class="preview-container"><div class="preview-wrapper" style="visibility: hidden; opacity: 0;"></div></div>`,
            ...this.plugin.categories.build()
        ]);
    }

    appendSet(name){
        if (!this.open) return;
        this.plugin.log('Appending a pack to the current container');
        $('#bda-qem-telegram-container .emote-menu-inner').append(this.plugin.tspack.wrapSet(name));
        var set = this.plugin.storage.getSet(name);
        var name = set.name;
        $('#bda-qem-telegram-container .categories-wrapper').append(`<div class="item" data-name="${name}" onclick='document.querySelector(\`#bda-qem-telegram-container .line-pack[data-name="${name}"]\`).scrollIntoView()' style='background-image: url("https://api.snazzah-is.cool/telegram/${name}/${set.files[0]}")'></div>`);
    }

    removeSet(name){
        $(`#bda-qem-telegram-container .line-pack[data-name="${name}"]`).remove();
        $(`#bda-qem-telegram-container .categories-container .item[data-name="${name}"]`).remove();
    }

    get open(){
        let container = document.getElementById('bda-qem-telegram-container')
        if (container) {
            let display = container.style.display;
            if (display !== 'none') return true;
        }
        return false;
    }

    rebuild(){
        return $(`.emote-menu-inner`).empty().append(this.plugin.storage.sets.map(e=>this.plugin.tspack.wrapSet(e.name)));
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
                        let name = $(this).attr('data-name');
                        if(!name) return;
                        self.plugin.storage.deleteSet(name);
                        self.removeSet(name);
                        self.confirmHide();
                        $(this).attr('data-name', '');
                    }),
                    $(`<span class="no">${locale['no']}</span>`).click(self.confirmHide)
                ])
            ])
        );
    }

    confirmShow(){
        $('#bda-qem-telegram-container .confirm').css('opacity', '1').css('pointer-events', 'unset');
    }

    confirmHide(){
        $('#bda-qem-telegram-container .confirm')
            .css('opacity', '0').css('pointer-events', 'none');
        $('#bda-qem-telegram-container .confirm .yes').attr('data-id', '');
    }

    previewShow(url){
        $('#bda-qem-telegram-container .preview-container .preview-wrapper')
            .css('visibility', 'visible').css('opacity', '1')
            .css('background-image', `url("${url}")`);
    }

    previewHide(){
        $('#bda-qem-telegram-container .preview-container .preview-wrapper')
            .css('visibility', 'hidden')
            .css('opacity', '0');
    }
}

module.exports = Menu;
