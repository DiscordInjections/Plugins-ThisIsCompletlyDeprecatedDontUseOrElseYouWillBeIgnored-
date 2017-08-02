const $ = require('jquery');

class Pack {
    constructor(plugin) {
        this.plugin = plugin;
    }

    wrapPack(stickerid){
        var pack = this.plugin.storage.getPack(stickerid);
        if (pack === null) { return ''; }
        var stickers = [];
        let self = this;
        for (var i = 0; i < pack['length']; ++i) {
            stickers.push($(`<div class="emote-container"></div>`).append(
                $(`<img class="emote-icon" src="https://api.snazzah-is.cool/line-sticker/${Number(stickerid) + i}">`)
                    .mouseenter((e) => this.plugin.menu.previewShow(e.target.src))
                    .mouseleave(() => this.plugin.menu.previewHide())
                    .on("click", function() {
                        self.plugin.sendEmote(this)
                    })
            ));
        };
        return $(`<div class="line-pack" data-id="${stickerid}"></div>`).append([
            $(`<div class="line-editbar"></div>`).append([
                $(`<span class="item"></span>`).append(
                    $(`<span class="icon-plus-cross icon-plus"></span>`).on('click', (event) => {
                        var id = $(event.target.parentNode.parentNode.parentNode).attr('data-id');
                        $('#bda-qem-line-container .confirm .yes').attr('data-id', id);
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
                                var id = $(event.target.parentNode.parentNode).attr('data-id');
                                self.plugin.storage.renamePack(Number(id), value);
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
            `<div class="line-pack-header">${pack.title}</div>`,
            $(`<div class="line-pack-stickers">`).append(stickers)
        ]);
    }

    appendPack(title, stickerid, length){
        // parsing arguments
        if (typeof title     === 'undefined') { throw 'ParsingError: Title is not defined'; }
        if (typeof stickerid === 'undefined') { throw 'ParsingError: Sticker ID is not a defined'; }
        if (typeof length    === 'undefined') { length = 40; this.plugin.log(`Length is not explicitly defined, defaulting to ${length}`); }

        if (typeof title !== 'string') { throw 'ParsingError: Title is not a string'; }
        if (Number.isInteger(stickerid) === false) {
            if (typeof stickerid === 'string') {
                stickerid = parseInt(stickerid, 10);
                if (isNaN(stickerid)) {
                    throw 'ParsingError: First sticker ID is not a number';
                } else {
                    this.plugin.log(`First sticker ID passed as a string, parsed as integer ${stickerid}`);
                }
            } else {
                throw 'ParsingError: First sticker ID is not a number nor string';
            }
        }
        if (Number.isInteger(length) === false) {
            if (length === null) {
                length = 40;
                this.plugin.log(`Null length passed, defaulting to ${length}`);
            } else if (typeof length === 'string') {
                length = parseInt(length, 10);
                if (isNaN(length)) {
                    throw 'ParsingError: Length is not a number';
                } else {
                    this.plugin.log(`Length passed as a string, parsed as integer ${length}`);
                }
            } else {
                throw 'ParsingError: Length is not a number nor string';
            }
        }

        var stickerpack = this.getPack(title, stickerid, length);
        if (!this.plugin.storage.getPack(stickerid)) {
            this.plugin.storage.pushPack(stickerpack);
            this.plugin.menu.rebuild();
            this.plugin.menu.appendPack(stickerid);
        } else {
            this.plugin.log('Pack already exists in storage');
        }
        return true;
    }

    getPack(title, stickerid, length) {
        return {
            title: title,
            starting_id: Number(stickerid),
            length: Number(length)
        };
    }
}

module.exports = Pack;