const Plugin = module.parent.require('../Structures/Plugin');

/**
 * A sample plugin
 * The class name *must* be the same as the file name, and it *must* extend Plugin.
 */
class SamplePlugin extends Plugin {
    // These constructor args are important! Do not modify them.
    constructor(...args) {
        super(...args);

        // `this.log()` is a helper function for formatted logging
        this.log('Hello, world!');

        /**
         * Registers a custom command. Takes an object as an argument with the following properties:
         *
         * options = {
         *   name, // This is the name of the command. No spaces!
         *   info, // A brief description of the command
         *   usage, // Command usage syntax. Do not include the prefix or command name, as these are automatically generated
         *   func  // A function that takes an input array `args` containing user input, and optionally returns a string to send as a message
         * }
         * **/
        this.registerCommand({
            name: 'sample-command',
            info: 'This is a sample command!',
            func: (args) => {
                // `this.sendLocalMessage(message, sanitize)` sends a local bot message (similar to clyde) that is already
                // formatted for this specific plugin.
                // This sanitizes input by default. To use HTML tags, pass in `false` at the end
                // ex. `this.sendLocalMessage('<p>paragraph!</p>', false)`
                this.sendLocalMessage('Hello, world!');

                // You can optionally use `DI.Helpers.sendLog(name, message, avatar, sanitize)` for more
                // control over formatting, or `DI.Helpers.sendClyde(message, sanitize)` to send as clyde.

                // Please refrain from using `DI.Helpers.sendDI(message, sanitize)`. Thanks.
            }
        });
    }

    // This is what the config file will contain when it gets generated (first use)
    get configTemplate() {
        return {
            // The color is used for the `this.log()` function and also custom command help
            color: 'aaaaaa',
            // The optional icon to use with the `this.sendLocalMessage` function. If left blank, a default one will be used instead
            iconURL: ''
        };
    }

    // Called when the plugin is unloaded
    unload() {
        this.log('Goodbye, world!');
    }
}

module.exports = SamplePlugin;