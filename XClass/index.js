const Plugin = module.parent.require('../Structures/Plugin');

class XClass extends Plugin {
    constructor(...args) {
        super(...args);
        this.log('Loading listeners');
        this.userModalBind = this.userModal.bind(this);
        this.userPopoutBind = this.userPopout.bind(this);
        this.messageGroupBind = this.messageGroup.bind(this);
        window.A.Watcher.on('messageGroup', this.messageGroupBind);
        window.A.Watcher.on('userPopout', this.userPopoutBind);
        window.A.Watcher.on('userModal', this.userModalBind);
    }

    static get after() { return ['afunc'] }

    get configTemplate() {
        return {
            color: '7e2682'
        };
    }

    unload() {
        this.log('Killing listeners');
        window.A.Watcher.removeListener('messageGroup', this.messageGroupBind);
        window.A.Watcher.removeListener('userPopout', this.userPopoutBind);
        window.A.Watcher.removeListener('userModal', this.userModalBind);
    }

    messageGroup(event) {
        event.element.classList.add(`xclass-guild-${event.channel.guild_id}`);
        event.element.classList.add(`xclass-channel-${event.channel.id}`);
        if(event.channel.nsfw) event.element.classList.add(`xclass-channelnsfw`);
        event.element.classList.add(`xclass-channelname-${event.channel.name}`);
        event.element.classList.add(`xclass-user-${event.message.author.id}`);
        if(event.message.author.bot) event.element.classList.add(`xclass-botuser`);
    }

    userPopout(event) {
        document.querySelector(".userPopout-4pfA0d").classList.add(`xclass-user-${event.userId}`);
        if(event.user && event.user.bot) document.querySelector(".userPopout-4pfA0d").classList.add(`xclass-botuser`);
        if(event.guild) document.querySelector(".userPopout-4pfA0d").classList.add(`xclass-guild-${event.guild.id}`);
    }

    userModal(user) {
        document.querySelector("#user-profile-modal").classList.add(`xclass-user-${user.id}`);
        if(user.bot) document.querySelector("#user-profile-modal").classList.add(`xclass-botuser`);
    }
}

module.exports = XClass;
