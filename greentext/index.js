const Plugin = module.parent.require('../Structures/Plugin');
const e = window.DI.React.createElement;
const { SettingsDivider, SettingsOptionToggle, SettingsOptionDescription } = window.DI.require('./Structures/Components');

class greentext extends Plugin {
    constructor(...args) {
        super(...args);
        this.didInit = false;
        this.mo = new MutationObserver(this.init.bind(this));
        this.mo.observe(document.querySelector(".app-XZYfmp"), { childList: true, subtree: true });
        window.DI.DISettings.registerSettingsTab(this, 'greentext', greentextSettings);
        window.DI.client.on('selectedUpdate', this.recolor.bind(this));
        this.recolor();
        if(Object.keys(this.settings).length === 0) this.settings = {greentext:true,orangetext:false};
    }

    get configTemplate() {
        return {
            color: "789922"
        };
    }

    init(m) {
        //this.log(m);
        //return;
        if(!this.settings.greentext) document.querySelectorAll(".markup>.greentext").forEach(e => e.outerHTML = e.innerHTML);
        if(!this.settings.orangetext) document.querySelectorAll(".markup>.orangetext").forEach(e => e.outerHTML = e.innerHTML);
        m.forEach(mr => {
            if(mr.addedNodes) mr.addedNodes.forEach(e => {
                if(e.classList && e.classList.contains("message") && !e.classList.contains("message-sending")) this.process(e.childNodes[0].childNodes[0].childNodes[2]);
                if(e.classList && e.classList.contains("message-group")){
                    if(!e.childNodes[1].childNodes[0].classList.contains("message-sending")){
                        e.childNodes[1].childNodes.forEach(me => {
                            this.process(me.childNodes[0].childNodes[me.classList.contains("first") ? 1 : 0].childNodes[2]);
                        });
                    }
                }
                if(e.classList && e.classList.contains("markup")) this.process(e);
            });
        });
    }

    recolor(){
        document.querySelectorAll(".markup").forEach(m => {
            this.process(m);
        });
    }

    process(m) {
        let reactregex = /(^<!-- react-text: \d+ -->|<!-- \/react-text -->$)/g;
        let reacttags = m.innerHTML.match(reactregex) || ['', ''];
        //this.log(m.innerHTML.replace(reactregex, "").split("\n"), m.innerHTML, m.innerHTML.includes(`<span class="greentext">`) || m.innerHTML.includes(`<span class="orangetext">`), reacttags)
        if(m.innerHTML.includes(`<span class="greentext">`) || m.innerHTML.includes(`<span class="orangetext">`)) return;
        m.innerHTML = (reacttags[0] || '') + m.innerHTML.replace(reactregex, "").split("\n").map(line => {
            if(this.settings.greentext && line.startsWith("&gt;")) return `<span class="greentext">${line}</span>`;
            if(this.settings.orangetext && line.endsWith("&lt;")) return `<span class="orangetext">${line}</span>`;
            return line;
        }).join("\n") + (reacttags[1] || '');
    }

    unload() {
        this.mo.disconnect();
        window.DI.client.removeListener('selectedUpdate', this.recolor.bind(this));
        document.querySelectorAll(".markup>.orangetext,.markup>.greentext").forEach(e => e.outerHTML = e.innerHTML);
    }
}

class greentextSettings extends window.DI.React.Component {
    render() {
        return e('div', {},
            e(SettingsOptionToggle, {
                title: 'Greentext',
                plugin: this.props.plugin,
                lsNode: 'greentext',
                defaultValue: true
            }),
            e(SettingsOptionDescription, {
                text: 'Make lines that start with ">" into greentext'
            }),
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Orangetext',
                plugin: this.props.plugin,
                lsNode: 'orangetext',
                defaultValue: false
            }),
            e(SettingsOptionDescription, {
                text: 'Make lines that end with "<" into orangetext'
            }),
            e(SettingsDivider)
        );
    }
}

module.exports = greentext;