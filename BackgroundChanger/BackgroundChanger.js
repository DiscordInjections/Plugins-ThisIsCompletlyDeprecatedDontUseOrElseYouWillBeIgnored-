const Plugin = module.parent.require('../Structures/Plugin');

class BackgroundChanger extends Plugin {
    constructor() {
        super({
            author: 'stupid cat',
            version: '1.0.6',
            description: 'Changes background images on an interval',
            color: '3622a1'
        });

        this.log('Injecting plugin CSS');
        this.styleTag = document.createElement('style');
        this.styleTag.innerHTML = `/** Remove a background discord put in front of the body **/
#app-mount > div > div.app.flex-vertical.theme-dark > div.layers.flex-vertical.flex-spacer,
#app-mount > div > div:nth-child(2) > div > div.layers.flex-vertical.flex-spacer,
.chat.flex-vertical.flex-spacer, .guilds-wrapper, .channels-wrap, .chat .content,
.messages-wrapper, .channel-members, .channels-wrap > div,
.theme-dark .layers, .theme-dark .layer {
	background: transparent !important;
}

/** Set up animated transitions **/
body {
    -webkit-transition: background 3s ease-in-out !important;
    transition: background 3s ease-in-out !important;
    background-size: cover !important;
}

.app {
    background: rgba(0, 0, 0, 0.6) !important;
}

/** Set up the next button */

#BackgroundRotatorNext {
  position: fixed;
  display: block;
  right: 10px;
  bottom: 10px;
  z-index: 999;
  height: 50px;
  width: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
#BackgroundRotatorNext:hover {
  background: rgba(255, 255, 255, 0.4)
}

#BackgroundRotatorNext span {
  background-image: url("data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNMTcuNjUgNi4zNUMxNi4yIDQuOSAxNC4yMSA0IDEyIDRjLTQuNDIgMC03Ljk5IDMuNTgtNy45OSA4czMuNTcgOCA3Ljk5IDhjMy43MyAwIDYuODQtMi41NSA3LjczLTZoLTIuMDhjLS44MiAyLjMzLTMuMDQgNC01LjY1IDQtMy4zMSAwLTYtMi42OS02LTZzMi42OS02IDYtNmMxLjY2IDAgMy4xNC42OSA0LjIyIDEuNzhMMTMgMTFoN1Y0bC0yLjM1IDIuMzV6Ii8+DQogICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPg0KPC9zdmc+DQo=");
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  display: block;
  background-origin: content-box;
  background-repeat: no-repeat;
}
`;
        document.head.appendChild(this.styleTag);

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

    get urls() {
        return [
            "your",
            "urls",
            "here"
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
