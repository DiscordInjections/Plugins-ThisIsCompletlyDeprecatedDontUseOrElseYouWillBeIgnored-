const Plugin = module.parent.require('../Structures/Plugin');
const $ = require('jquery');
const reload = require('require-reload');
const { SettingsDivider, SettingsOptionDescription, SettingsOptionToggle } = window.DI.require('./Structures/Components');
const { Categories, Menu, Observer, Pack, Storage } = reload('./Modules');
const e = window.DI.React.createElement;

const DomManager = {
    findID: (e, id) => {
        if(e.id === id) return e;
        const parents = DomManager.listParents(e);
        for(let i in parents){
            let p = parents[i];
            if(p instanceof HTMLDivElement && p.id === id){
                return p
            }
        }
        return null;
    },

    listParents: e => {
        let list = [];
        let iterate = parent => {
            if(parent !== null && parent.parentNode !== null){
                list.push(parent.parentNode);
                iterate(parent.parentNode);
            }
        }
        iterate(e);
        return list;
    }
}

class LineStickers extends Plugin {
    constructor(...args) {
        super(...args);
        window.DI.DISettings.registerSettingsTab(this, 'Line Stickers', LineStickersSettings);
        this.storage = new Storage(this, "DI-LineStickers");
        this.storage.data; // Spawn new data if there is none
        this.lspack = new Pack(this);
        this.categories = new Categories(this);
        this.menu = new Menu(this);
        this.observer = new Observer(this);

        $(document).off('mouseup.lineemotes').on('mouseup.lineemotes', e => {
            if(!DomManager.findID(e.target, 'bda-qem-line-container')){
                $('.popout>#bda-qem-line-container').parent().remove();
                $('.line-emotes-btn div').removeClass("hovered");
            }
        });

        if($(".line-emotes-btn")[0] || !$(".emojiButton-38mF6t")[0]) return;
        $(`<div class="line-emotes-btn"></div>`)
            .append(
                $(`<div style="background-image: url(${this.randomStickerID ? `//api.snazzah-is.cool/line-sticker/${this.randomStickerID}` : "//i-need.discord.cards/dab204.png"})"></div>`)
                    .mouseover(e=>{
                        if(e.target.classList.contains('hovered')) return;
                        $(e.target).attr('style', `background-image: url(${this.randomStickerID ? `//api.snazzah-is.cool/line-sticker/${this.randomStickerID}` : "//i-need.discord.cards/dab204.png"})`)
                    })
            )
            .insertAfter(".emojiButton-38mF6t")
            .click(e=>{
                e.target.classList.add('hovered');
                this.menu.init(e);
            });
    }

    unload() {
        this.observer.mo.disconnect();
        $('.line-emotes-btn').remove();
        $('.popout>#bda-qem-line-container').parent().remove();
        $('.messages .markup a[style="display: none;"]').css('display', 'initial');
        $(document).off('mouseup.lineemotes');
    }

    get configTemplate() {
        return {
            color: "00b800"
        };
    }

    get locale() {
        var locale = document.children[0].getAttribute('lang');
        var localization_strings = {
            'addform-title': 'Title',
            'addform-length': 'Sticker count',
            'addform-id': 'First sticker ID',
            'addform-add': 'Add',
            'delete-confirm': 'Are you sure you want to delete this pack?',
            'yes': 'Yes',
            'no': 'No'
        }
        if (locale === 'ja') {
            localization_strings['addform-length'] = 'スタンプの数',
            localization_strings['addform-id'] = '最初のスタンプID',
            localization_strings['addform-add'] = '追加',
            localization_strings['delete-confirm'] = 'このパックを削除しますか？',
            localization_strings['yes'] = 'はい',
            localization_strings['no'] = 'いいえ'
        }

        return localization_strings;
    }

    get randomStickerID(){
        let random = function(arr){
            return arr[Math.floor(Math.random() * ((arr.length-1) - 0 + 1)) + 0];
        };
        let rInt = function(min, max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const pack = random(this.storage.stickers);
        return pack ? rInt(0, pack.length) + pack.starting_id : null;
    }

    sendEmote(e){
        if ($(e).parent().parent().attr("class") === 'line-pack-stickers') {
            var emote = e.style.backgroundImage.replace(/url\("(.+)"\)/, "$1");
        } else {
            var emote = $(e).attr("title");
        }
        if(this.storage.sendEmbed && window.DI.client.selectedChannel && (window.DI.client.selectedChannel.type !== 'text' || window.DI.client.selectedChannel.permissionsFor(window.DI.client.user).has("EMBED_LINKS"))){
            window.DI.client.selectedChannel.send('', { embed: { image: { url: emote } } })
        }else{
            var ta = $(".chat .content textarea");
            ta.val(ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
        }
    }
}

class LineStickersSettings extends window.DI.React.Component {
    render() {
        return e('div', {},
            e(SettingsOptionToggle, {
                title: 'Hide URLs',
                lsNode: 'hideUrls',
                plugin: this.props.plugin,
                defaultValue: true
            }),
            e(SettingsOptionDescription, {
                text: 'Hide sticker URL on client side. (others will still see it)'
            }),
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Send emotes as Embed',
                lsNode: 'sendEmbed',
                plugin: this.props.plugin,
                defaultValue: false
            }),
            e(SettingsOptionDescription, {
                text: 'Send emote directly as embed instead of copying to textarea. (Only sends if it has permissions to do so)'
            }),
            e(SettingsDivider)
        );
    }
}

module.exports = LineStickers;
