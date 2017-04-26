# BumpPlugin

You should place this file in the `Plugins` folder of the DiscordInjections project.

When a message is sent, the guild the message is in gets a `bump` class for 0.5 seconds.

When someone starts to type, the guild gets a `channel-typing` class for 5 seconds.

Selectors:
- .guilds-wrapper .guilds .guild.unread.bump::before
- .guilds-wrapper .guilds .guild.unread.channel-typing::before

Happy hacking!