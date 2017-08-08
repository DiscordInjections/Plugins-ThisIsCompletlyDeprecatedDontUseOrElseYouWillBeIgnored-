const $ = require('jquery');
const superagent = require('superagent');

class Pack {
    constructor(plugin) {
        this.plugin = plugin;
    }

    wrapSet(name){
        var set = this.plugin.storage.getSet(name);
        if (set === null) { return ''; }
        var stickers = set.files.map(f=>$(`<div class="emote-container"></div>`).append(
            $(`<div class="emote-icon" style="background-image: url(https://api.snazzah-is.cool/telegram/${name}/${f})">`)
                .mouseenter((e) => this.plugin.menu.previewShow(e.target.style.backgroundImage.replace(/url\("(.+)"\)/, "$1")))
                .mouseleave(() => this.plugin.menu.previewHide())
                .on("click", function() {
                    self.plugin.sendEmote(this);
                })
        ));
        let self = this;
        
        return $(`<div class="line-pack" data-name="${name}"></div>`).append([
            $(`<div class="line-editbar"></div>`).append([
                $(`<span class="item"></span>`).append(
                    $(`<span class="icon-plus-cross icon-plus"></span>`).on('click', (event) => {
                        var name = $(event.target.parentNode.parentNode.parentNode).attr('data-name');
                        $('#bda-qem-telegram-container .confirm .yes').attr('data-name', name);
                        this.plugin.menu.confirmShow();
                    })
                ),
                $(`<span class="item"></span>`).append(
                    $(`<span class="icon-edit"></span>`).click((event) => {
                        var pack = $(event.target.parentNode.parentNode.parentNode);
                        if (pack.find('.line-pack-header input').length === 0) {
                            var bar = $(event.target.parentNode.parentNode);
                            var header = pack.find('.line-pack-header');
                            var value = pack.find('.line-pack-header').text();
                            header.html(`<input class="line-edit-input" value="${value}"></input>`);
                            bar.addClass('visible')

                            function save(event) {
                                var value = $(event.target).val();
                                var id = $(event.target.parentNode.parentNode).attr('data-name');
                                self.plugin.storage.renameSet(name, value);
                                $(event.target.parentNode).html(value);
                            }

                            header.find('input')
                                .on('blur', (event) => {
                                    save(event);
                                    bar.removeClass('visible');
                                })
                                .on('keydown', (event) => {
                                    if ((event.key === 'Escape') || (event.key ==='Enter')) {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        event.target.blur();
                                    }
                                })
                                .focus();
                        };
                    })
                ),
                $(`<span class="item" style="display: none; text-align: center; width: 30px; vertical-align: middle; line-height: 23.5px; color: #d1d1d1;"></span>`).append(
                    $(`<span class="icon-edit-len">LEN</span>`)
                )
            ]),
            `<div class="line-pack-header">${set.title}</div>`,
            $(`<div class="line-pack-stickers">`).append(stickers)
        ]);
    }

    appendSet(set){
        if (this.checking) {
            $('#telegram-status').text('Cannot add set, checking in progress');
        } else if (!this.plugin.storage.getSet(set.name)) {
            this.plugin.storage.pushSet(set);
            this.plugin.menu.rebuild();
            this.plugin.menu.appendSet(set.name);
            $('#telegram-status').text('');
        } else {
            let index = this.plugin.storage.indexOf(set.name);
            let sets = this.plugin.storage.sets;
            this.plugin.storage.sets[index] = set;
            this.plugin.storage.sets = sets;
            this.plugin.menu.rebuild();
            $('#telegram-status').text('');
        }
        return true;
    }

    checkSets(set){
        let sets = this.plugin.storage.sets;
        if(sets.length === 0) return;
        let lastSet = sets[sets.length-1];
        this.checking = true;
        let checked = 0;
        console.log("STARTING CHECK", lastSet);
        let doneCheck = () => {
            this.plugin.storage.sets = sets;
            this.plugin.menu.rebuild();
            this.checking = false;
            this.plugin.log("FINISHING CHECK");
        };
        for (var i in sets) {
            let set = sets[i];
            this.plugin.log("checking set", set);
            superagent.get(`https://api.snazzah-is.cool/telegram/${set.name}/${set.files[0]}`).then(() => {
                if(lastSet.name === set.name) doneCheck();
                this.plugin.log("checked set", set.name);
            }).catch(e => {
                this.plugin.log("caught error while checking set", set.name, e);
                superagent.get(`https://api.snazzah-is.cool/telegram/${set.name}`).then(res => {
                    this.plugin.storage.sets[i] = res.body;
                    if(lastSet.name === set.name) doneCheck();
                });
            });
        };
    }
}

module.exports = Pack;
