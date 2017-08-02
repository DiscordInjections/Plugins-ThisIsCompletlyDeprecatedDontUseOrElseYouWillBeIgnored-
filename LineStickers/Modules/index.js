const reload = require('require-reload');

module.exports = {
	Categories: reload("./Categories"),
	Menu: reload("./Menu"),
	Observer: reload("./Observer"),
	Pack: reload("./Pack"),
	Storage: reload("./Storage")
};