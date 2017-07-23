const Plugin = module.parent.require('../Structures/Plugin');

class FadeAnims extends Plugin {
    constructor(...args) {
        super(...args);
    }

    unload(){
        this.mo.disconnect();
    }
	
}

module.exports = FadeAnims;
