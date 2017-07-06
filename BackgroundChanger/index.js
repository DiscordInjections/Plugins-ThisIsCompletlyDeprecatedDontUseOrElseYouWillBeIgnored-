const Plugin = module.parent.require('../Structures/Plugin');

class BackgroundChanger extends Plugin {
    constructor(...args) {
        super(...args);

        this.nextButton = document.createElement('button');
        this.nextButton.id = 'BackgroundRotatorNext';
        this.nextButton.appendChild(document.createElement('span'));
        this.nextButton.addEventListener("click", this.next.bind(this));
        document.body.appendChild(this.nextButton);

        // Empty starting URL
        this.lastUrl = '';

        // Switch every 10 minutes
        setInterval(this.next.bind(this), 10 * 60 * 1000);
        this.next();
        this.log('Rotater initialized.');
    }

    get configTemplate() {
        return {
            color: '3622a1',
            urls: []
        };
    }

    get urls() {
        return this.config.urls;
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
