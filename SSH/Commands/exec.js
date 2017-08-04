const node_ssh = require('node-ssh')
const ssh = window.DI.ssh;

module.exports = {
	info: "Execute SSH commands",
	usage: "<command>",
	func: args => {
		if(!ssh) return window.DI.Helpers.sendLog('SSH', 'There is no active SSH connection, use the `ssh` command to start one.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png');
    ssh.execCommand(args.join(' ')).then(result => {
      window.DI.Helpers.sendLog('SSH', `**INPUT:**\n----------\n${args.join(' ')}\n----------\n`,'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png');
      if(result.stdout) window.DI.Helpers.sendLog('SSH', `**OUTPUT:**\n----------\n${result.stdout}\n----------\n`,'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png');
      if(result.stderr) window.DI.Helpers.sendLog('SSH', `**ERRORS:**\n----------\n${result.stdout || 'none provided'}\n----------\n`,'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png');
    })
	}
};
