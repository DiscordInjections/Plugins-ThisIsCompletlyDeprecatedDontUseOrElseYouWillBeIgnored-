const Plugin = module.parent.require('../Structures/Plugin');

/**
 * You should place this file in the `Plugins` folder of the DiscordInjections project.
 *
 * When a message is sent, the guild the message is in gets a `bump` class for 0.5 seconds.
 * When someone starts to type, the guild gets a `channel-typing` class for 5 seconds.
 *
 * Selectors:
 * .guilds-wrapper .guilds .guild.unread.bump::before
 * .guilds-wrapper .guilds .guild.unread.channel-typing::before
 * .channels-wrap .scroller-fzNley .containerDefault-7RImuF.bump::before
 * .channels-wrap .scroller-fzNley .containerDefault-7RImuF.channel-typing::before
 *
 * Happy hacking
 */

class BumpPlugin extends Plugin {
    constructor(...args) {
        super(...args);
        this.guildTimers = {};
        this.channelTimers = {};
        this.typingTimers = {};
        this.typingChannelTimers = {};
        this.log('Loading listeners');
        window.client.on('typingStart', this.typingStart.bind(this));
        window.client.on('message', this.messageCreate.bind(this));
    }

    get configTemplate() {
        return {
            color: '8e0cd3'
        };
    }

    unload() {
        this.log('Killing listeners');
        window.client.removeListener('typingStart', this.typingStart.bind(this));
        window.client.removeListener('message', this.messageCreate.bind(this));
    }

    typingStart(channel, user, timestamp) {
        if (channel && channel.guild && !channel.muted) {
            const element = channel.guild.element;
            element.classList.add('channel-typing');
            if (this.typingTimers[channel.guild.id]) clearTimeout(this.typingTimers[channel.guild.id]);
            this.typingTimers[channel.guild.id] = setTimeout(() => {
                element.classList.remove('channel-typing');
                delete this.typingTimers[channel.guild.id];
            }, 5000);

            const channelElement = channel.element;
            if (!channelElement) return;
            channelElement.classList.add('channel-typing');
            if (this.typingChannelTimers[channel.id]) clearTimeout(this.typingChannelTimers[channel.id]);
            this.typingChannelTimers[channel.id] = setTimeout(() => {
                channelElement.classList.remove('channel-typing');
                delete this.typingChannelTimers[channel.id];
            }, 5000);
        }
    }

    messageCreate(msg) {
        if (msg.guild && !msg.channel.muted) {
            const element = msg.guild.element;
            element.classList.add('bump');
            element.classList.remove('channel-typing');
            if (this.typingTimers[msg.guild.id]) clearTimeout(this.typingTimers[msg.guild.id]);
            delete this.typingTimers[msg.guild.id];
            if (this.guildTimers[msg.guild.id]) clearTimeout(this.guildTimers[msg.guild.id]);
            this.guildTimers[msg.guild.id] = setTimeout(() => {
                element.classList.remove('bump');
                delete this.guildTimers[msg.guild.id];
            }, 500);

            const channelElement = msg.channel.element;
            if (!channelElement) return;
            channelElement.classList.add('bump');
            channelElement.classList.remove('channel-typing');
            if (this.typingChannelTimers[msg.channel.id]) clearTimeout(this.typingChannelTimers[msg.channel.id]);
            delete this.typingChannelTimers[msg.channel.id];
            if (this.channelTimers[msg.channel.id]) clearTimeout(this.channelTimers[msg.channel.id]);
            this.channelTimers[msg.channel.id] = setTimeout(() => {
                channelElement.classList.remove('bump');
                delete this.channelTimers[msg.channel.id];
            }, 500);
        }
    }
}

module.exports = BumpPlugin;
