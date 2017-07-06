const Plugin = module.parent.require('../Structures/Plugin');

/**
 * A sample plugin
 * The class name *must* be the same as the file name, and it *must* extend Plugin.
 */
class SamplePlugin extends Plugin {
    // These constructor args are important! Do not modify them.
    constructor(...args) {
        super(...args);

        this.log('Hello, world!');
    }

    // This is what the config file will contain when it gets generated (first use)
    get configTemplate() {
        return {
            color: 'aaaaaa'
        };
    }

    // Called when the plugin is unloaded
    unload() {
        this.log('Goodbye, world!');
    }
}

module.exports = SamplePlugin;