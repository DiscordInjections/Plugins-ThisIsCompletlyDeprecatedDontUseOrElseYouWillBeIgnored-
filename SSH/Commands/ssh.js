const node_ssh = require('node-ssh')
const ssh = new node_ssh()
let config = require('../config.json');

module.exports = {
	info: "Create an SSH connection",
	usage: "",
	func: args => {
		if(window.DI.ssh) {
			window.DI.ssh.dispose();
			window.DI.Helpers.sendLog('SSH', 'Closing current connection and opening new one...', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png')
		};
		if(config.privateKey) {
			try {
				config.privateKey = require('fs').readFileSync(config.privateKey).catch(() => {return new Error('Cannot find privateKey file')});
				delete config['password'];
			} catch(e) {
				delete config['privateKey'];
				window.console.error("[ssh] Could not find privateKey in path. Attempting to use password..");
			}
		};
		if(config.password && config.privateKey) {
			delete config['privateKey'];
		};

		ssh.connect(config).then(() => {
			window.DI.ssh = ssh;
			window.DI.Helpers.sendLog('SSH', 'Successfully created the SSH connection. Use the `exec` command to execute SSH commands.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png')
		}).catch((err) => {
			window.DI.Helpers.sendLog('SSH', `Failed to create an SSH connection.\n${err}`, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png')
		})
	}
};
