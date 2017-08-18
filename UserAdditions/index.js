const Plugin = module.parent.require('../Structures/Plugin');
const m = require('moment');
const Snowflake = require("discord.js/src/util/Snowflake");
const e = window.DI.React.createElement;
const { SettingsDivider, SettingsOptionToggle, SettingsOptionTextbox, SettingsOptionDescription } = window.DI.require('./Structures/Components');

class UserAdditions extends Plugin {
    constructor(...args) {
        super(...args);
        if(Object.keys(this.settings).length === 0) this.settings = {
        	avatarURLbutton: true,
        	createdAt: "[Created at] LL",
        	joinedAt: "[Joined guild at] LL"
        };
        m.locale(document.querySelector("html").lang);
        window.DI.DISettings.registerSettingsTab(this, 'User Additions', UserAdditionsSettings);
        this.userModalBind = this.userModal.bind(this);
        this.userPopoutBind = this.userPopout.bind(this);
        this.contextMenuBind = this.contextMenu.bind(this);
        window.A.Watcher.on('userModal', this.userModalBind);
        window.A.Watcher.on('userPopout', this.userPopoutBind);
        window.DI.StateWatcher.on('languageChange', this.languageChangeBind);
        window.A.Watcher.on('contextMenu', this.contextMenuBind);
    }

    static get after() { return ['AFunc'] }

    userModal(user) {
    	if(this.settings.avatarURLbutton){
    		let avbtn = document.createElement('div');
    		avbtn.className = "status avatar-link";
    		avbtn.onclick = e => {
    			let btn = e.target;
    			btn.innerHTML = btn.parentNode.lastChild.style.backgroundImage.replace(/url\("(.+)"\)/, "$1").replace("webp", "png").replace("=256", "=2048");
    			let range = document.createRange();
    			range.selectNode(btn);
    			window.getSelection().removeAllRanges();
    			window.getSelection().addRange(range);
    			document.execCommand('copy');
    		}
    		document.querySelector('.avatar-wrapper').insertBefore(avbtn, document.querySelector('.avatar-profile'));
    		window.A(avbtn).tooltip('right', 'Copy Avatar URL');
    	}
    }

    languageChange(lang) {
    	m.locale(lang);
    }

    userPopout(obj) {
    	if(this.settings.createdAt.length !== 0){
    		let userSnowflake = Snowflake.deconstruct(obj.userId);
    		let cts = document.createElement('div');
    		cts.className = "headerActivityText-3qBQRo";
    		cts.innerHTML = window.DI.Helpers.sanitize(m(userSnowflake.timestamp).format(this.settings.createdAt));
    		document.querySelector('.headerTag-3zin_i').appendChild(cts);
    	}
    	if(this.settings.joinedAt.length !== 0 && obj.guild){
    		let cts = document.createElement('div');
    		cts.className = "headerActivityText-3qBQRo";
    		cts.innerHTML = window.DI.Helpers.sanitize(m(obj.guild.joinedAt).format(this.settings.joinedAt));
    		document.querySelector('.headerTag-3zin_i').appendChild(cts);
    	}
    }

    copy(text) {
        let span = document.createElement('span');
        span.style = "font-size:0;-webkit-user-select:text;";
        span.innerHTML = window.DI.Helpers.sanitize(text);
        document.body.appendChild(span);
        let range = document.createRange();
        range.selectNode(span);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        document.body.removeChild(span);
    }

    contextMenu(props) {
        if(props.type === "message"){
            window.A.contextMenu.fromArray([[{
                text: "Copy Raw Content",
                onClick: (e, ctx) => {
                    this.copy(props.message.content);
                    props.element.style.display = "none";
                }
            }]]).appendToContextMenu(props.element);
        }else if(props.type === "member" || props.type === "groupMember"){
            window.A.contextMenu.fromArray([[{
                text: "Copy Avatar URL",
                onClick: (e, ctx) => {
                    this.copy(props.user.getAvatarURL());
                    props.element.style.display = "none";
                }
            }]]).appendToContextMenu(props.element);
        }
    }

    unload() {
        window.A.Watcher.removeListener('userModal', this.userModalBind);
        window.A.Watcher.removeListener('userPopout', this.userPopoutBind);
        window.DI.StateWatcher.removeListener('languageChange', this.languageChangeBind);
        window.A.Watcher.removeListener('contextMenu', this.contextMenuBind);
    }
}

class UserAdditionsSettings extends window.DI.React.Component {
    render() {
        return e('div', {},
            e(SettingsOptionToggle, {
                title: "Add a 'Copy Avatar URL to Clipboard' button in user modals",
                plugin: this.props.plugin,
                lsNode: 'avatarURLbutton',
                defaultValue: true
            }),
            e(SettingsDivider),
            e(SettingsOptionTextbox, {
                title: 'Created At String',
                description: 'Adds the date when the user was created in the user popouts',
                lsNode: 'createdAt',
                plugin: this.props.plugin,
                defaultValue: '[Created at] LL',
                apply: true,
                onApply: () => {}
            }),
            e(SettingsDivider),
            e(SettingsOptionTextbox, {
                title: 'Joined At String',
                description: 'Adds the date when the user joined that guild in the user popouts',
                lsNode: 'joinedAt',
                plugin: this.props.plugin,
                defaultValue: '[Joined guild at] LL',
                apply: true,
                onApply: () => {}
            }),
            e(SettingsDivider)
        );
    }
}

module.exports = UserAdditions;
