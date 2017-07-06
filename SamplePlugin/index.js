const Plugin = module.parent.require('../Structures/Plugin');

/**
 * A sample plugin
 * The class name *must* be the same as the file name, and it *must* extend Plugin.
 */
class SamplePlugin extends Plugin {
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

    unload() {
        this.log('Goodbye, world!');
    }
}

module.exports = SamplePlugin;