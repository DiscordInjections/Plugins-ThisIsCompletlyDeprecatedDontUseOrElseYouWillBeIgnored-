const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");
const fuzzy = require("fuzzy");
const resolver = new (require("discord.js/src/client/ClientDataResolver"))(window.DI.client);

class SlugMod extends Plugin {
    constructor(...args) {
        super(...args);
        this.commands = {};
        this.loadCommands();
        this.util = new SlugUtil(this);
        if(!window.DI) throw new Error("Please update DiscordInjections to use this plugin!");
        setTimeout(()=>{
            window.DI.StateWatcher.emit('slugmod-reloaded');
        }, 2000)
        $(document).on('input', this.onInput.bind(this));
        $(document).on('keydown', this.onKeyDown.bind(this));
    }

    get configTemplate() {
        return {
            color: 'e74c3c'
        };
    }

    unload(){
        $(document).off('input', this.onInput.bind(this));
        $(document).off('keydown', this.onKeyDown.bind(this));
        $(".slugmod-autocomplete, .slugmod-clyde, .slugmod-message").remove();
        //this.observer.disconnect();
    }

    loadCommands() {
        window._fs.readdir(window._path.join(__dirname, 'Commands'), (err, files) => {
            for (const file of files) {
                    if (window._path.extname(file) === '.js') {
                    const name = window._path.basename(file, '.js');
                    const Class = require('./Commands/' + name);
                    const instance = new Class(name);
                    this.commands[name] = instance;
                    this.log('Loaded command ' + name);
                }
            }
        });
        window.DI.StateWatcher.emit('slugmod-reloaded');
    }

    addExternalCommand(obj, execute) {
        const instance = new ExternalSlug(obj, execute);
        this.commands[obj.name] = instance;
        this.log('Loaded external command ' + obj.name);
    }

    makeACRow(name, desc, notusage){
        $(".slugmod-autocomplete").append(`<div class="autocompleteRowVertical-3_UxVA autocompleteRow-31UJBI command"><div class="selector-nbyEfM selectable-3iSmAf"${notusage ? ` onclick="document.querySelector('.textAreaEnabled-2vOfh8').value = '//'+this.childNodes[0].childNodes[1].innerText;document.querySelector('.textAreaEnabled-2vOfh8').dispatchEvent(new Event('input', { bubbles: true }));"` : ""}><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO content-249Pr9" style="flex: 1 1 auto;"><svg class="icon-3XfMwL" width="16" height="16" viewBox="0 0 16 16"><g fill="none" fill-rule="evenodd"><rect width="16" height="16"></rect><polygon class="iconForeground-1U-F96" fill="currentColor" points="12 2.32 10.513 2 4 13.68 5.487 14"></polygon><polygon class="iconForeground-1U-F96" fill="currentColor" points="12 2.32 10.513 2 4 13.68 5.487 14"></polygon></g></svg><div class="marginLeft4-3RAvyQ" style="flex: 1 1 auto;">${name}</div><div class="ellipsis-1MzbWB primary400-1OkqpL">${desc}</div></div></div></div>`);
    }

    makeACUsageRow(usage){
        $(".slugmod-autocomplete").append(`<div class="autocompleteRowVertical-3_UxVA autocompleteRow-31UJBI command-usage"><div class="selector-nbyEfM selectable-3iSmAf"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO content-249Pr9" style="flex: 1 1 auto;"><div class="marginLeft4-3RAvyQ">Usage</div><div class="ellipsis-1MzbWB primary400-1OkqpL">: ${usage}</div></div></div></div>`);
    }

    initAC(){
        $(`<div class="autocomplete-1TnWNR autocomplete-1LLKUa slugmod-autocomplete"><div class="autocompleteRowVertical-3_UxVA autocompleteRow-31UJBI header"><div class="selector-nbyEfM"><div class="contentTitle-sL6DrN primary400-1OkqpL weightBold-2qbcng">SlugMod Commands</div></div></div></div>`)
          .insertAfter(".emojiButton-38mF6t");
    }

    clearAC(){
        $(".slugmod-autocomplete .command, .slugmod-autocomplete .command-usage").remove();
    }

    onInput(){
        if(!$(".textAreaEnabled-2vOfh8")[0]) return;
        if($(".textAreaEnabled-2vOfh8")[0].value.startsWith("//")){
            if(!$(".slugmod-autocomplete")[0]) this.initAC();
            let args = $(".textAreaEnabled-2vOfh8")[0].value.substring(2).split(' ');
            if($(".textAreaEnabled-2vOfh8")[0].value === "//"){
                $(".slugmod-autocomplete").removeClass("in-command-usage");
                this.clearAC();
                Object.keys(this.commands).splice(0,10).map(c=>this.makeACRow(c, this.commands[c].plugin ? `<span class="external-command">${this.commands[c].plugin}</span> - ${this.commands[c].description}` : this.commands[c].description, true));
            }else if(args[0] === '' || args.length > 1){
                $(".slugmod-autocomplete").remove();
            }else{
                $(".slugmod-autocomplete").removeClass("in-command-usage");
                if(this.commands[args[0]]){
                    this.clearAC();
                    $(".slugmod-autocomplete").addClass("in-command-usage");
                    let cmd = this.commands[args[0]];
                    this.makeACRow(args[0], cmd.plugin ? `<span class="external-command">${cmd.plugin}</span> - ${cmd.description}` : cmd.description);
                    this.makeACUsageRow(cmd.usage);
                }else{
                    let results = fuzzy.filter(args[0], Object.keys(this.commands));
                    if(results.length === 0) return $(".slugmod-autocomplete").remove();
                    this.clearAC();
                    results.map(r=>this.makeACRow(r.original, this.commands[r.original].plugin ? `<span class="external-command">${this.commands[r.original].plugin}</span> - ${this.commands[r.original].description}` : this.commands[r.original].description, true));
                    if(results.length === 1){
                        this.makeACUsageRow(this.commands[results[0].original].usage);
                        $(".slugmod-autocomplete").addClass("in-command-usage");
                    }
                }
            }
        }else if($(".slugmod-autocomplete")[0]) $(".slugmod-autocomplete").remove();
    }

    onKeyDown(event){
        if(event.key === 'Enter' && !event.shiftKey && $(".textAreaEnabled-2vOfh8")[0].value.startsWith("//")){
            let args = $(".textAreaEnabled-2vOfh8")[0].value.trim().substring(2).split(' ');
            if (args.length > 0 && this.commands[args[0]]) {
                this.commands[args[0]].execute(this.util.filterMessage(args.slice(1).join(" ")).split(" "), this.util);
                $(".textAreaEnabled-2vOfh8").val("").focus()[0].dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        if(event.key === 'Tab' && $(".slugmod-autocomplete")[0]) $(".slugmod-autocomplete").children(".command:first-child").click(); 
    }
}

class SlugUtil {
    constructor(slugmod) {
        this.slugmod = slugmod;
    }
    escape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    resolveUser(query){
        return window.DI.client.users.find("tag", query.slice(1));
    }
    resolveMention(query){
        let res = query.match(/<@!?[0-9]+>/g);
        if(!res) return null;
        return resolver.resolveUser(res[0].replace(/<|!|>|@/g, ''));
    }
    filterMessage(message){
        window.DI.client.users.forEach(u=>message=message.replace(new RegExp(this.escape(`@${u.tag}`), "g"), `<@${u.id}>`));
        return message;
    }
    sanitize(query){
        return query.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")
    }
    sendBotMessage(message){
        if(!$(".messages .message-group:last-child").hasClass("slugmod-clyde")){
            $(".messages")
              .append(`<div class="message-group hide-overflow is-local-bot-message slugmod-clyde"><div class="avatar-large stop-animation" style="background-image: url(&quot;/assets/f78426a064bc9dd24847519259bc42af.png&quot;);"></div><div class="comment"><div class="message first"><div class="body"><h2><span class="username-wrapper"><strong class="user-name" renamer="">SlugMod Clyde</strong><span class="bot-tag">BOT</span></span><span class="highlight-separator"> - </span><span class="timestamp">Today at 10:50 PM</span></h2><div class="message-text"><div class="markup">${message}</div></div></div><div class="accessory"></div></div><div class="local-bot-message">Only you can see this — <a onclick="this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode)">delete this message</a>.</div></div></div>`)
        }else{
            $(".slugmod-clyde:last-child .local-bot-message a").html("delete these messages");
            $(`<div class="message"><div class="body"><div class="message-text"><div class="markup">${message}</div></div></div><div class="accessory"></div></div>`)
              .insertBefore(".slugmod-clyde:last-child .local-bot-message");
        }
    }
    sendACMessage(message){
        let tsc = new Date().valueOf().toString(36);
        $(`<div class="autocomplete-1TnWNR autocomplete-1LLKUa slugmod-message slugmod-message-${tsc}"><div class="autocompleteRowVertical-3_UxVA autocompleteRow-31UJBI"><div class="selector-nbyEfM"><div class="contentTitle-sL6DrN primary400-1OkqpL weightBold-2qbcng">${message}</div></div></div><div class="timer"></div></div>`)
          .insertAfter(".emojiButton-38mF6t");
        setTimeout(()=>$(`.slugmod-message-${tsc}`).remove(),5000);
    }
    get textarea(){
        return $(".textAreaEnabled-2vOfh8")[0];
    }
}

class ExternalSlug {
    constructor(obj, execute){
        this.name = obj.name;
        this.usage = obj.usage;
        this.description = obj.desc;
        this.plugin = obj.plugin;
        this.exec = execute;
    }

    execute(...args){
        this.exec(this, ...args);
    }
}

module.exports = SlugMod;
