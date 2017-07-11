class SlugCommand {
	constructor(obj, name) {
		this.name = name;
		this.usage = obj.usage;
		this.description = obj.desc;
	}

	execute(args) {
		return args.join(' ');
	}

	log(...args) {
        console.log(`%c[SlugMod] %c[//${this.name}]`, `color: #e74c3c; font-weight: bold;`, `font-weight: bold;`, ...args);
	}
}

module.exports = SlugCommand;
