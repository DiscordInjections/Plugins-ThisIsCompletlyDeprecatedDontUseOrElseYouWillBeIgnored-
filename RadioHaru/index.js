const Plugin = module.parent.require('../Structures/Plugin');

class RadioHaru extends Plugin {
    constructor(...args) {
        super(...args);
		var audio = new Audio('https://stream.radioharu.pw/owo');

        this.log('Radio Haru loaded!');

        this.registerCommand({
            name: 'radioplay',
            info: 'Plays Radio Haru in the Discord client!',
            func: (args) => {
                this.sendLocalMessage('Playing!\n\nhttps://radioharu.pw/');
                audio.play();
            }
        });
		this.registerCommand({
            name: 'radiostop',
            info: 'Stops playing Radio Haru in the Discord client!',
            func: (args) => {
                this.sendLocalMessage('Stopping!\n\nhttps://radioharu.pw/');
                audio.pause();
            }
        });
		this.registerCommand({
            name: 'radiovolume',
            info: 'From 0.1 to 1',
            func: (volume) => {
                this.sendLocalMessage('Changing volume to ' + volume + '!\n\nhttps://radioharu.pw/');
                audio.volume = volume;
            }
        });
    }

    get configTemplate() {
        return {
            color: 'aaaaaa',
            iconURL: 'https://files.isabel.moe/hNKOYP5.png'
        };
    }

    unload() {
        this.log('Radio Haru unloaded!');
    }
}

module.exports = RadioHaru;
