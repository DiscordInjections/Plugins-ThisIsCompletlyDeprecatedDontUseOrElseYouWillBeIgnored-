const Plugin = module.parent.require('../Structures/Plugin');

class Experihax extends Plugin {
    // These constructor args are important! Do not modify them.
    constructor(...args) {
        super(...args);
        this.lolhacked(false);

        this.registerCommand({
            name: 'experihax',
            info: 'haaaxxxxxx',
            func: this.lolhacked.bind(this)
        });
    }

    lolhacked(args) {
        webpackJsonp([],{d:(a,b,d)=>{let f={};for(i=0;0!==f.isDeveloper;i++)f=d(i)||{};let o=Object;o.setPrototypeOf(f,o.assign({},o.getPrototypeOf(f),{isDeveloper:1}))}},["d"]);
        // new code to enable experiments :)

        this.log('lol hacked');
        if (args !== false) this.sendLocalMessage('lol hacked');
    }

    // This is what the config file will contain when it gets generated (first use)
    get configTemplate() {
        return {
            // The color is used for the `this.log()` function and also custom command help
            color: '1af463',
            // The optional icon to use with the `this.sendLocalMessage` function. If left blank, a default one will be used instead
            iconURL: 'https://i.ytimg.com/vi/KEkrWRHCDQU/maxresdefault.jpg'
        };
    }
}

module.exports = Experihax;
