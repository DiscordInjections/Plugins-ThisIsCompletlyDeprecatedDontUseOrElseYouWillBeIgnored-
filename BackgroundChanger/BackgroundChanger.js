const Plugin = require('../Structures/Plugin');

class BackgroundChanger extends Plugin {
    constructor() {
        super({
            author: 'stupid cat',
            version: '1.0.3',
            description: 'Changes background images on an interval',
            color: '3622a1'
        });

        this.log('Injecting plugin CSS');
        this.styleTag = document.createElement('style');
        this.styleTag.innerHTML = `/** Remove a background discord put in front of the body **/
#app-mount > div > div.app.flex-vertical.theme-dark > div.layers.flex-vertical.flex-spacer,
#app-mount > div > div:nth-child(2) > div > div.layers.flex-vertical.flex-spacer, 
div.layers {
	background: rgba(0, 0, 0, 0) !important;
}

/** Set up animated transitions **/
body {
    -webkit-transition: background 3s ease-in-out !important;
    transition: background 3s ease-in-out !important;
    background-size: cover !important;
}

.app .layer {
    background: rgba(0, 0, 0, 0.7) !important;
}`;
        document.head.appendChild(this.styleTag);

        // Empty starting URL
        this.lastUrl = '';

        // Switch every 10 minutes
        setInterval(this.next.bind(this), 1 * 60 * 1000);
        this.next();
        this.log('Rotater initialized.');
    }

    get urls() {
        return [
            'your',
            'urls',
            'here'
        ];
    }

    get url() {
        let url;
        do {
            url = this.urls[Math.floor(Math.random() * this.urls.length)];
        } while (url == this.lastUrl);
        this.lastUrl = url;
        return url;
    }

    next() {
        this.log('Changing background...');
        let url = this.url;
        document.getElementById('app-mount').style.backgroundImage = 'url(' + url + ')';
        setTimeout(function () {
            document.getElementsByTagName('body')[0].style.backgroundImage = 'url(' + url + ')';
        }, 200);
    }

    unload() {
        this.log('Killing interval');
        clearInterval(this.interval);
        this.log('Un-injecting CSS');
        document.head.removeChild(this.styleTag);
    }
}

module.exports = BackgroundChanger;