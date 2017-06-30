const Plugin = module.parent.require('../Structures/Plugin');
const util = require('util');

class CustomCommand extends Plugin {
  constructor() {
    super({
      author: 'stupid cat',
      version: '1.0.0',
      description: 'CUSTOM COMAMDNSA?E',
      color: '3fd24c'
    });

    this.log('WHAO');
    this.lastKey = '';
    setTimeout(this.setup.bind(this), 3000);

    this.commands = {};
    this.loadCommands();
  }

  loadCommands() {
    window._fs.readdir(window._path.join(__dirname, 'Commands'), (err, files) => {
      for (const file of files) {
        if (window._path.extname(file) === '.js') {
          const name = window._path.basename(file, '.js');
          const Class = require('./Commands/' + name);
          const instance = new Class();
          this.commands[name] = instance;
          this.log('Loaded command ' + name);
        }
      }
    });
  }

  get textarea() {
    return document.querySelector('.channel-textarea-inner textarea');
  }

  setup() {
    let textarea = this.textarea;
    if (textarea) this.registerEvent(textarea);
    let changer = document.querySelector('.app .layers .layer section.flex-horizontal');
    this.observer = new MutationObserver((mutations) => {
      if (mutations[0].addedNodes[0].id !== 'friends') {
        this.registerEvent();
      }
    });
    this.observer.observe(changer, {
      childList: true
    });
  }

  registerEvent(textarea = this.textarea) {
    textarea.parentElement.parentElement.parentElement.addEventListener('keydown', this.keyDown.bind(this));
  }

  textChange(event) {
    let text = event.target.value;
    this.log(text);
  }

  keyDown(event) {
    if (this.lastKey === 'Shift' && event.key === 'Tab' && this.textarea.value.startsWith('/')) {
      this.lastKey = '';
      let args = this.textarea.value.trim().substring(1).split(' ');

      if (args.length > 0 && this.commands[args[0]]) {
        let result = this.commands[args[0]].execute(args);
        if (result instanceof Promise) {
          result.then(this.finishCommand.bind(this));
        } else {
          this.finishCommand(result);
        }
      }

    } else this.lastKey = event.key;
  }

  finishCommand(val) {
    if (Array.isArray(val)) {
      this.textarea.value = val.join('');
    } else if (typeof val === 'object') {
      this.textarea.value = util.inspect(val, { depth: 1 });
    } else {
      this.textarea.value = val.toString();
    }
    this.textarea.style.height = (val.split('\n').length * 18) + 'px';
  }


  unload() {
    this.log('Killing interval');
    clearInterval(this.interval);
    this.log('Un-injecting CSS');
    document.head.removeChild(this.styleTag);
  }
}

module.exports = CustomCommand;
