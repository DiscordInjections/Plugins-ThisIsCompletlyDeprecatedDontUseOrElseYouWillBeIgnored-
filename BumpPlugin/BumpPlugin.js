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
 *
 * Happy hacking
 */

class BumpPlugin extends Plugin {
    constructor() {
        super({
            author: 'stupid cat',
            version: '1.0.0',
            description: 'Give a class to guild indicators when a message is sent / when someone starts typing.'
        });
        this.guildTimers = {};
        this.typingTimers = {};
        this.log('Loading listeners');
        window.client.on('typingStart', this.typingStart.bind(this));
        window.client.on('message', this.messageCreate.bind(this));
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
            if (this.typingTimers[channel.guild.id])
                clearTimeout(this.typingTimers[channel.guild.id]);
            this.typingTimers[channel.guild.id] = setTimeout(() => {
                element.classList.remove('channel-typing');
                delete this.typingTimers[channel.guild.id];
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
            if (this.guildTimers[msg.guild.id])
                clearTimeout(this.guildTimers[msg.guild.id]);
            this.guildTimers[msg.guild.id] = setTimeout(() => {
                element.classList.remove('bump');
                delete this.guildTimers[msg.guild.id];
            }, 500);
        }
    }
}

module.exports = BumpPlugin;
