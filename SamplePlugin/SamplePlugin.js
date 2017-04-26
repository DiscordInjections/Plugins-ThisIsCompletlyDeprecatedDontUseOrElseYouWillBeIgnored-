const Plugin = require('../Structures/Plugin');

/**
 * A sample plugin
 * The class name *must* be the same as the file name, and it *must* extend Plugin.
 */
class SamplePlugin extends Plugin {
    constructor() {
        super({
            author: 'stupid cat',
            version: '1.0.0',
            description: 'An example plugin.'
        });

        this.log('Hello, world!');
    }

    unload() {
        this.log('Goodbye, world!');
    }
}

module.exports = SamplePlugin;