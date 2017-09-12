const Plugin = module.parent.require('../Structures/Plugin');
const e = window.DI.React.createElement;
const { SettingsDivider, SettingsOptionToggle, SettingsOptionDescription } = window.DI.require('./Structures/Components');

class greentext extends Plugin {
	constructor(...args) {
		super(...args);
		this.didInit = false;
		this.mo = new MutationObserver(this.init.bind(this));
		this.mo.observe(document.querySelector("[data-reactroot]"), { childList: true, subtree: true });
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
		if(!m) return;
		if(m.className.includes(`greentext`) || m.className.includes(`orangetext`)) return;

		let reactregex = /(^<!-- react-text: \d+ -->|<!-- \/react-text -->$)/g;

		m.innerHTML.split(reactregex).map(line => {
			line.split("\n").forEach(l=>{
				if(this.settings.greentext && l.startsWith("&gt;")){
					let gtext = document.createElement("span");
					gtext.className += " greentext";
					gtext.innerText = m.innerText//l.replace(/&gt;/,">");
					m.innerText = "";
					m.appendChild(gtext);
				};
				if(this.settings.orangetext && l.endsWith("&lt;")){
					let gtext = document.createElement("span");
					gtext.className += " orangetext";
					gtext.innerText = m.innerText//l.replace(/&lt;/,"<");
					m.innerText = "";
					m.appendChild(gtext);
				};
			})
		});
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