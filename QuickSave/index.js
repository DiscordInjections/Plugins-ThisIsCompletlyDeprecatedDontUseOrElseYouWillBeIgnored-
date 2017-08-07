const Plugin = module.parent.require('../Structures/Plugin');
const fs = require('fs');
const $ = require('jquery');
const e = window.DI.React.createElement;
const { SettingsDivider, SettingsOptionTextbox } = window.DI.require('./Structures/Components');
const SettingsOptionFolderbox = require('./SettingsOptionFolderbox');

class QuickSave extends Plugin {
    constructor(...args) {
        super(...args);
        this.mo = new MutationObserver(this.observer.bind(this));
        this.mo.observe(document.querySelector("[data-reactroot]"), { childList: true, subtree: true });
        window.DI.DISettings.registerSettingsTab(this, 'QuickSave', QSSettings);
    }

    get configTemplate() {
        return {
            color: 'dddddd'
        };
    }

    get namingMethods() {
        return {
            random: function(plugin, settings, url, dir){

                let filename = plugin.randomFilename64(settings.fnLength);

                let filetype =  '.'+url.split('.').slice(-1)[0].split('?')[0];

                let loops = 50;
                const dest = _path.join(dir, filename, filetype);
                while(plugin.accessSync(dest) && loops--)
                    filename = plugin.randomFilename64(parseInt(settings.fnLength));

                if(loops == -1){
                    this.error('Could not find a free filename ),: Check permissions or increase filename lenght');
                    return null;
                }
                return filename+filetype;
            },

            original: function(plugin, settings, url, dir){

                let filename_original = url.split('/').slice(-1)[0].split('?')[0];
                let temp = filename_original.split('.');
                let filetype_original = '.'+temp.pop();
                filename_original = temp.join('.');

                let filename = filename_original+filetype_original;

                let num = 2;
                let loops = 2048;
                const dest = _path.join(dir, filename);
                while(plugin.accessSync(dest) && loops--)
                    filename = filename_original + ` (${num})` + filetype_original;
                    num++;
                }

                if(loops == -1){
                    this.error('Could not find a free filename ),: Possible causes: no permissions or you have saved truckloads of images with this name');
                    return null;
                }

                return filename;
            }
        }
    }

    randomFilename64(length){
        var name = '';
        while(length--)
            name += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'[ (Math.random()*64|0) ];
        return name;
    }

    observer(recs){
        let e = recs[0];
        let self = this;
        // Fun stuff
        var settings = this.lsSettings;
        if(e.addedNodes.length > 0 && e.addedNodes[0].className=='callout-backdrop'){
            var elem = document.getElementsByClassName('modal-image')[0];
            if(!elem) return;

            var button = document.createElement('a');
            
            
            fs.access(settings.directory, fs.W_OK, err=>{
                if (err){
                    button.id = "qs_button";
                    
                    button.className = "download-button";
                    button.innerHTML = "Can't Quicksave: save location is invalid";
        
                }else{
                    button.id = "qs_button";
                    button.href = "#";
                    button.onclick = this.saveCurrentImage.bind(this);
                    button.className = "download-button";
                    button.innerHTML = "Quicksave";
                }   
                elem.appendChild(button);
            });
        }
        
        // Check for images
        $(".embed-thumbnail").each(function() {
            if($(this).children(".quicksave-icon-btn")[0] !== undefined) return;
            $("<div class='quicksave-icon-btn'></div>")
                .insertBefore($(this.childNodes[0]))
                .on("click", function() {
                    if(!$(this).hasClass("downloading") && !$(this).hasClass("finished")) {
                        self.saveFromEmbedIcon($(this));
                    }
                });
        });
        $(".attachment-image").each(function() {
            if($(this).children(".quicksave-icon-btn")[0] !== undefined) return;
            $("<div class='quicksave-icon-btn'></div>")
                .insertBefore($(this.childNodes[0]))
                .on("click", function() {
                    if(!$(this).hasClass("downloading") && !$(this).hasClass("finished")) {
                        self.saveFromIcon($(this));
                    }
                });
        });
        $(".attachment").each(function() {
            if($(this).children(".quicksave-icon-btn")[0] !== undefined) return;
            $("<div class='quicksave-icon-btn qs-attachment'></div>")
                .insertAfter($(this).children(".attachment-inner"))
                .on("click", function() {
                    if(!$(this).hasClass("downloading") && !$(this).hasClass("finished")) {
                        self.saveFromAttachment($(this));
                    }
                });
        });
    }

    accessSync(dir) {
        try {
            fs.accessSync(dir, fs.F_OK);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Toast UI from Keybase plugin
    toast(text){
        let toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = text;
            
        setTimeout(() => {
            document.querySelector(".toast").className = "toast";
            setTimeout(() => {
                document.querySelector(".toast").remove();
            }, 500);
        }, 10000);
            
        document.body.appendChild(toast);
            
        setTimeout(() => {
            document.querySelector(".toast").className = "toast toast-show";
        }, 100);
    }

    get defaultSettings() {
        return {
            directory: "./Downloads",
            namingmethod: "original",
            fnLength: '4'
        };
    }

    get lsSettings() {
        let settings = $.extend({}, this.defaultSettings, JSON.parse(window.DI.localStorage.getItem("DI-QuickSave")));
        this.lsSettings = settings;
        return settings;
    }

    set lsSettings(settings) {
        return window.DI.localStorage.setItem("DI-QuickSave", JSON.stringify(settings));
    }

    unload() {
        this.mo.disconnect();
        $(".quicksave-icon-btn").remove();
    }

    saveFromEmbedIcon($sender) {
        let self = this;
        var settings = this.lsSettings;
        var dir = settings.directory;
        var url = $sender.siblings("img").attr("href");
        var net = (url.split('//')[0]=='https:') ? require('https') : require('http');

        var namemethod = this.namingMethods[settings.namingmethod] || this.namingMethods.original;
        var filename = namemethod(this, settings, url, dir);

        if(filename == null){
            this.toast('Error while trying to find a free filename! Check console for more details.');
            return;
        }

        var dest = dir+(dir.endsWith("\\")?"":"\\")+filename;
        self.log("Quicksaving", url, '-->', dest);

        var file = fs.createWriteStream(dest);
        
        
        $sender.removeClass("finished").addClass("downloading");
        net.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                self.log("Finished");
                file.close();
                $sender.removeClass("downloading").addClass("finished");
                self.toast(`Saved as ${dest.split("/").reverse()[0].split("\\").reverse()[0]}`);
            });
        }).on('error', function(err) {
            fs.unlink(dest)
            self.toast('Failed to download file '+url+'\nError: '+err.message);
            self.error(err.message);
            
            file.close();
            $sender.removeClass("downloading");
        });
    }

    saveFromIcon($sender) {
        let self = this;
        var settings = this.lsSettings;
        var dir = settings.directory;
        var url = $sender.siblings("a").attr("href");
        var net = (url.split('//')[0]=='https:') ? require('https') : require('http');

        var namemethod = this.namingMethods[settings.namingmethod] || this.namingMethods.original;
        var filename = namemethod(this, settings, url, dir);

        if(filename == null){
            this.toast('Error while trying to find a free filename! Check console for more details.');
            return;
        }

        var dest = dir+(dir.endsWith("\\")?"":"\\")+filename;
        self.log("Quicksaving", url, '-->', dest);

        var file = fs.createWriteStream(dest);
        
        
        $sender.removeClass("finished").addClass("downloading");
        net.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                self.log("Finished");
                file.close();
                $sender.removeClass("downloading").addClass("finished");
                self.toast(`Saved as ${dest.split("/").reverse()[0].split("\\").reverse()[0]}`);
            });
        }).on('error', function(err) {
            fs.unlink(dest)
            self.toast('Failed to download file '+url+'\nError: '+err.message);
            self.error(err.message);
            
            file.close();
            $sender.removeClass("downloading");
        });
    }

    saveFromAttachment($sender) {
        let self = this;
        var settings = this.lsSettings;
        var dir = settings.directory;
        var url = $sender.siblings(".attachment-inner").children("a").attr("href");
        var net = (url.split('//')[0]=='https:') ? require('https') : require('http');

        var namemethod = this.namingMethods[settings.namingmethod] || this.namingMethods.original;
        var filename = namemethod(this, settings, url, dir);

        if(filename == null){
            this.toast('Error while trying to find a free filename! Check console for more details.');
            return;
        }

        const dest = _path.join(dir, filename);
        self.log("Quicksaving", url, '-->', dest);

        var file = fs.createWriteStream(dest);
        
        
        $sender.removeClass("finished").addClass("downloading");
        net.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                self.log("Finished");
                file.close();
                $sender.removeClass("downloading").addClass("finished");
                self.toast(`Saved as ${dest.split("/").reverse()[0].split("\\").reverse()[0]}`);
            });
        }).on('error', function(err) {
            fs.unlink(dest)
            self.toast('Failed to download file '+url+'\nError: '+err.message);
            self.error(err.message);
            
            file.close();
            $sender.removeClass("downloading");
        });
    }

    saveCurrentImage() {
        let self = this;
        var button = document.getElementById('qs_button');
        button.innerHTML = "Downloading...";
        var settings = this.lsSettings;
        var fs = require('fs');
        var dir = settings.directory;
        var url = document.getElementsByClassName('modal-image')[0].childNodes[1].attributes[0].nodeValue;
        var twitterFix = new RegExp(":large$");
        if (twitterFix.test(url)) {
            url = url.replace(twitterFix, '');
        }
        var net = (url.split('//')[0]=='https:') ? require('https') : require('http');

        var namemethod = this.namingMethods[settings.namingmethod] || this.namingMethods.original;
        var filename = namemethod(this, settings, url, dir);

        if(filename == null){
            button.innerHTML = 'Error while trying to find a free filename! Check console for more details.';
            return;
        }

        var dest = dir+(dir.endsWith("\\")?"":"\\")+filename;
        self.log("Quicksaving", url, '-->', dest);

        var file = fs.createWriteStream(dest);
        net.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                self.log("Finished");
                button.innerHTML = "Download finished";
                self.toast(`Saved as ${dest.split("/").reverse()[0].split("\\").reverse()[0]}`);
                file.close();
            });
        }).on('error', function(err) {
            fs.unlink(dest); 
            if(document.getElementById('qs_button'))
                button.innerHTML = "Error: " + err.message;
            else
                self.toast('Failed to download file '+url+'\nError: '+err.message);
            self.error(err.message);
            file.close();
        });
    }
}

class QSSettings extends window.DI.React.Component {
    render() {
        return e('div', {},
            e(SettingsOptionFolderbox, {
                title: 'Directory',
                description: 'This is the directory to save all images to.',
                plugin: this.props.plugin,
                lsNode: 'directory',
                defaultValue: './Downloads',
                apply: true,
                onApply: () => {}
            }),
            e(SettingsDivider),
            e(SettingsOptionTextbox, {
                title: 'Naming Method',
                description: 'This is the naming method that will be used when downloading images.',
                plugin: this.props.plugin,
                lsNode: 'namingmethod',
                defaultValue: 'original'
            }),
            e(SettingsDivider),
            e(SettingsOptionTextbox, {
                title: 'Random File Name Length',
                description: 'The length of the file name. Only applies when the naming method is \'random\'.',
                plugin: this.props.plugin,
                lsNode: 'fnLength',
                defaultValue: '4'
            })
        );
    }
}


module.exports = QuickSave;
