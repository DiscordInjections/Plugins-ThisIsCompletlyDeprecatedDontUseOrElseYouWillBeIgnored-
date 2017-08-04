
module.exports = {
	info: "Execute SSH commands",
	usage: "<command>",
	func: args => {
		let ssh = window.DI.ssh;
		if(!ssh) return window.DI.Helpers.sendLog('SSH', 'There is no active SSH connection, use the `ssh` command to start one.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png');
    		ssh.execCommand(args.join(' ')).then(result => {
      			window.DI.Helpers.sendLog('SSH', `**INPUT:**\n\`\`\`${args.join(' ')}\`\`\`\n`,'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png');
      			if(result.stdout) window.DI.Helpers.sendLog('SSH', `**OUTPUT:**\n\`\`\`${result.stdout}\`\`\`\n`,'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png');
     		        if(result.stderr) window.DI.Helpers.sendLog('SSH', `**ERRORS:**\n\`\`\`${result.stdout || 'none provided'}\`\`\`\n`,'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Octicons-terminal.svg/2000px-Octicons-terminal.svg.png');
   		 })
	}
};
