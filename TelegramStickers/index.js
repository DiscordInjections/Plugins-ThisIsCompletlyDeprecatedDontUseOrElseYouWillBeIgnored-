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

class TelegramStickers extends Plugin {
    constructor(...args) {
        super(...args);
        window.DI.DISettings.registerSettingsTab(this, 'Telegram Stickers', TelegramStickersSettings);
        this.storage = new Storage(this, "DI-TelegramStickers");
        this.storage.data; // Spawn new data if there is none
        this.tspack = new Pack(this);
        this.categories = new Categories(this);
        this.menu = new Menu(this);
        this.observer = new Observer(this);

        $(document).off('mouseup.telegramstickers').on('mouseup.telegramstickers', e => {
            if(!DomManager.findID(e.target, 'bda-qem-telegram-container')){
                $('.popout>#bda-qem-telegram-container').parent().remove();
                $('.telegram-emotes-btn div').removeClass("hovered");
            }
        });

        window.DI.StateWatcher.on('languageChange', () => {if($(".emojiButton-38mF6t")[0]) this.insertButton();})
        if($(".telegram-emotes-btn")[0] || !$(".emojiButton-38mF6t")[0]) return;
        this.insertButton();
    }

    insertButton(){
        $(`<div class="telegram-emotes-btn"></div>`)
            .append(
                $(`<div style="background-image: url(${this.randomSticker ? this.randomSticker : "//i-need.discord.cards/eda565.png"})"></div>`)
                    .mouseover(e=>{
                        if(e.target.classList.contains('hovered')) return;
                        $(e.target).attr('style', `background-image: url(${this.randomSticker ? this.randomSticker : "//i-need.discord.cards/eda565.png"})`)
                    })
            )
            .insertAfter(".emojiButton-38mF6t")
            .click(e=>{
                e.target.classList.add('hovered');
                this.menu.init(e);
            });
    }

    unload() {
        window.DI.StateWatcher.removeListener('mutation', this.observer.bind);
        $('.telegram-emotes-btn').remove();
        $('.popout>#bda-qem-telegram-container').parent().remove();
        $('.messages .markup a[style="display: none;"]').css('display', 'initial');
        $(document).off('mouseup.telegramstickers');
    }

    get configTemplate() {
        return {
            color: "0a80ba"
        };
    }

    get locale() {
        var locale = document.children[0].getAttribute('lang');
        var localization_strings = {
            'addform-title': 'Title',
            'addform-length': 'Sticker count',
            'addform-id': 'First sticker ID',
            'addform-add': 'Add',
            'delete-confirm': 'Are you sure you want to delete this set?',
            'yes': 'Yes',
            'no': 'No'
        }

        return localization_strings;
    }

    get randomSticker(){
        let random = function(arr){
            return arr[Math.floor(Math.random() * ((arr.length-1) - 0 + 1)) + 0];
        };
        const set = random(this.storage.sets);
        return set ? `//api.snazzah-is.cool/telegram/${set.name}/${random(set.files)}` : null;
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

class TelegramStickersSettings extends window.DI.React.Component {
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

module.exports = TelegramStickers;
