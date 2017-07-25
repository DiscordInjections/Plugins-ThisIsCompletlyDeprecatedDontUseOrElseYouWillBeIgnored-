const Plugin = module.parent.require('../Structures/Plugin');
const settingsTab = require('./settingsTab');

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

        // Example settings tab registration
        this.registerSettingsTab('Sample Settings', SettingsSamplePlugin);
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

const e = window.DI.React.createElement;
const { SettingsExpandableSection, SettingsDivider, SettingsOptionTextbox, SettingsOptionToggle,
    SettingsDescription } = window.DI.require('./Structures/Components');

class SettingsSamplePlugin extends window.DI.React.Component {
    render() {
        return e('div', {},
            e(SettingsDescription, {
                text: 'This is an example settings page, constructed with React!'
            }),
            e(SettingsOptionTextbox, {
                title: 'Example Textbox',
                description: 'This is an example textbox!',
                // lsKey refers to the localStorage key to store in
                lsKey: 'SamplePlugin',
                // lsNode refers to the property of the parsed localStorage value to store in
                lsNode: 'exampleTextbox',
                // This is the default value
                defaultValue: 'value',
                // For example, this would parse to `DI-DiscordInjections: {"exampleTextbox": "value"}`
                // Reset adds a button to reset the value to the default
                reset: true,
                // Apply adds a button to explicitly set the new value
                apply: true,
                // onApply is a function used for any external logic
                onApply: () => console.log('Example Textbox was applied!')
            }),
            // A basic divider
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Example Toggle Switch',
                lsKey: 'SamplePlugin',
                lsNode: 'exampleToggle',
                defaultValue: false
            }),
            e(SettingsDivider),
            e(SettingsExpandableSection, {
                title: 'Expandable Section',
                // An array of components to put in the section
                components: [
                    e(SettingsDescription, { text: 'This is an expandable section to put things into!' })
                ]
            })
        );
    }
}


module.exports = SamplePlugin;