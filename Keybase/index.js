const Plugin = module.parent.require('../Structures/Plugin');
const request = require("request");
const fs = require("fs");
const exec = require("child_process").exec;

class KeybaseIntegration extends Plugin {
    constructor(...args) {
        super(...args);
        
        this.interval = setInterval(this.tick.bind(this), 200);
    }

    get configTemplate() {
        return {
            color: '33a0ff'
        };
    }

    unload() {
        clearInterval(this.interval);
    }

    tick() {
        if(document.querySelector(".user-settings-connections") !== null && !document.querySelector(".user-settings-connections").hasAttribute("keybase")){
            document.querySelector(".user-settings-connections").setAttribute("keybase", "checked");
            let user = document.querySelector(".username").parentNode.previousSibling.getAttribute("style").split("/")[4];
            
            let _this = this;
            this.getKeybaseAccount(user, function(data){
                if(data === null){
                    _this.addConnectButton(_this.setKeybaseAccount.bind(_this));
                }else{
                    _this.addSettingsConnection(data.user, _this.deleteKeybaseAccount.bind(_this));
                }
            });
            
        }else if(document.querySelector("#user-profile-modal") !== null && document.querySelector("#user-profile-modal").className !== "keybase-checked"){
            document.querySelector("#user-profile-modal").className = "keybase-checked";
            let user = document.querySelector("#user-profile-modal .avatar-profile").getAttribute("style").split("/")[4];
            let _this = this;
            
            this.getKeybaseAccount(user, function(data){
                if(data !== null){
                    _this.addProfileConnection(data.user.keybase, "https://keybase.io/" + data.user.keybase);
                    
                    let twitterList = document.querySelectorAll("#user-profile-modal img[src*='c795f9ef8be0d19a0555ee96213abd00'] + div > div");
                    let redditList = document.querySelectorAll("#user-profile-modal img[src*='4a3496c5b0924198ae0234331c912d1b'] + div > div");

                    for(let i = 0; i < twitterList.length; ++i) {
                        let twitter = twitterList[i];
                        twitter.parentNode.parentNode.setAttribute("data-account", "twitter:" + twitter.innerHTML.toLowerCase());
                    }

                    for(let i = 0; i < redditList.length; ++i) {
                        let reddit = redditList[i];
                        reddit.parentNode.parentNode.setAttribute("data-account", "reddit:" + reddit.innerHTML.toLowerCase());
                    }

                    for(let accountId in data.user.proofs){
                        let account_element = document.querySelector("#user-profile-modal .connected-account[data-account='" + accountId + "']");
                        if(account_element !== null){
                            let keybase_icon = document.createElement("a");
                            keybase_icon.href = data.user.proofs[accountId].proof;
                            keybase_icon.rel = "noreferrer";
                            keybase_icon.target = "_blank";
                            keybase_icon.innerHTML = "<div class=\"connected-account-keybase-icon\"></div>";
                            account_element.appendChild(keybase_icon);
                        }else if(data.user.proofs[accountId].show){
                            let account_data = accountId.split(":");
                            account_element = _this.addProfileConnection(account_data[1], data.user.proofs[accountId].link, "https://api.bowser65.tk/assets/" + account_data[0].replace("generic_web_site", "site").replace("dns", "site") + "-logo.png");
                            
                            let keybase_icon = document.createElement("a");
                            keybase_icon.href = data.user.proofs[accountId].proof;
                            keybase_icon.rel = "noreferrer";
                            keybase_icon.target = "_blank";
                            keybase_icon.innerHTML = "<div class=\"connected-account-keybase-icon\"></div>";
                            account_element.appendChild(keybase_icon);
                        }
                    }
                }
            });
        }
    }
    
    /* Keybase */
    getKeybaseAccountData(callback) {        
        let pathList = process.env.PATH.split(require("path").delimiter);
        let ext = (process.platform == "win32" ? ".exe" : "");
        let keybase_exec = null;
        for (let i = 0; i < pathList.length; ++i) {
            let path = pathList[i];
            if(fs.existsSync(path + require("path").sep + "keybase" + ext)){
                keybase_exec = path + require("path").sep + "keybase" + ext;
                i = pathList.length;
            }
        }

        if(keybase_exec === null){
            this.toast("Sorry, your Keybase executable seems to be hidden... Make sure Keybase is installed and in your PATH, then try again");
        }else{
            let user = document.querySelector(".username").parentNode.previousSibling.getAttribute("style").split("/")[4];
            exec(keybase_exec + " encrypt -m '" + user + "' bowser65", function(err, data){
                data = new Buffer(data).toString("base64");
                callback(data);
            });
        }
    }
    
    /* API */
    getKeybaseAccount(accountId, callback){
        let _this = this;
        
        request.get('https://api.bowser65.tk/v1/keybase/user/' + accountId, function (error, response, body) {
            if(response.statusCode == 200){
                let parse = JSON.parse(response.body);
                callback(parse);
            }else if(response.statusCode == 404){
                callback(null);
            }else{
                _this.handleAPIResponse(response);
            }
        });
    }
    
    setKeybaseAccount(){
        let spinner = document.createElement("div");
        spinner.className = "waiting-spinner-wrapper";
        spinner.innerHTML = "<svg viewBox=\"25 25 50 50\" class=\"waiting-spinner\"><circle cx=\"50\" cy=\"50\" r=\"20\" class=\"waiting-spinner-path waiting-spinner-path-dark\"></circle><circle cx=\"50\" cy=\"50\" r=\"20\" class=\"waiting-spinner-path waiting-spinner-path-light\"></circle><circle cx=\"50\" cy=\"50\" r=\"20\" class=\"waiting-spinner-path\"></circle></svg>";
        
        document.querySelector(".connect-account-btn-inner[style*='keybase-logo.png']").parentNode.appendChild(spinner);
        
        let _this = this;
        
        this.getKeybaseAccountData(function(keybaseData){
            request.post({url: 'https://api.bowser65.tk/v1/keybase/user', json:{keybase_data: keybaseData}}, function (error, response, body) {
                if(!response.statusCode == 200){
                    document.querySelector(".waiting-spinner").remove();
                    _this.handleAPIResponse(response);
                }else{
                    document.querySelector(".connect-account-btn-inner[style*='keybase-logo.png']").parentNode.remove();
                    document.querySelector(".user-settings-connections").removeAttribute("keybase");
                }
            });
        });
    }
    
    changeDisplay(account, display){
        let _this = this;
        
        this.getKeybaseAccountData(function(keybaseData){
            request.put({url: 'https://api.bowser65.tk/v1/keybase/user', json:{keybase_data: keybaseData, action: (display?"show":"hide"), account: account}}, function (error, response, body) {
                if(!response.statusCode == 200){
                    if(response.statusCode == 404){
                        this.toast("Wew! Your Keybase account is no longer linked, but for unknown reasons still displayed here...");
                        document.querySelector(".connection[style*='border-color: #33a0ff'").remove();
                        document.querySelector(".user-settings-connections").removeAttribute("keybase");
                    }else{
                        _this.handleAPIResponse(response);
                    }
                }
            });
        });
    }
    
    deleteKeybaseAccount(){
        let _this = this;
        
        this.getKeybaseAccountData(function(keybaseData){
            request.delete({url: 'https://api.bowser65.tk/v1/keybase/user', json:{"keybase_data": keybaseData}}, function (error, response, body) {
                if(response.statusCode == 200){
                    document.querySelector(".user-settings-connections").removeAttribute("keybase");
                }else if(response.statusCode == 404){
                    this.toast("Wew! Your Keybase account was already unlinked, but for unknown reasons still displayed here...");
                    document.querySelector(".user-settings-connections").removeAttribute("keybase");
                }else{
                    _this.handleAPIResponse(response);
                }
            });
        });
    }
    
    handleAPIResponse(response){
        let text = null;
        
        if(response.statusCode == 429){
            text = "Wow too fast! You got rate limited... Try again in " + Math.ceil(response.headers["retry-after"].replace("ms", "") / 1000) + "s";
        }else if(response.statusCode == 400){
            text = "Wew this was unexpected, same as your request params! Check your Keybase install, and make sure you're connected and able to encrypt messages through Keybase";
        }else if(response.statusCode == 418){
            text = "Whoops, something went wrong! An external service had issues, try again later";
        }else if(response.statusCode == 500){
            text = "Oh, sorry dude, server looks like to be in vacations :( Please contact Bowser65#4680";
        }else if(response.statusCode == 426){
            text = "Hey dude, it's time to update! This plugin version no longer works";
        }else if(response.statusCode == 403 && response.statusMessage.includes("Banned")){
            text = "You are " + response.statusMessage.replace(" Banned", "").toLowerCase() + " banned from the API (Reason: " + response.headers["ban-reason"] + ")";
            if(response.statusMessage.replace(" Banned", "") === "Temporarily"){
                text = text + ". You will get unbanned on " + response.headers["banned-until"];
            }
        }
        
        if(text !== null){
            this.toast(text);
        }
    }
    /* UI */
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
    
    addSettingsConnection(data, deleteCallback){
        if(document.querySelector(".user-settings-connections") !== null){
            let state = true;
            /* Create elements */
            let connection = document.createElement("div");
            connection.className = "connection elevation-low margin-bottom-8";
            connection.setAttribute("style", "border-color: #33a0ff; background-color: #33a0ff;");
            
            let connection_header = document.createElement("div");
            connection_header.className = "connection-header margin-bottom-20";
            
            let img = document.createElement("img");
            img.className = "connection-icon no-user-drag";
            img.src = "https://api.bowser65.tk/assets/keybase-logo.png";
            
            let connection_name_wrapper = document.createElement("div");
            
            let connection_name = document.createElement("div");
            connection_name.className = "connection-account-value";
            connection_name.innerHTML = data.keybase;
            
            let connection_label = document.createElement("div");
            connection_label.className = "connection-account-label";
            connection_label.innerHTML = "Account Name";
            
            let connection_delete = document.createElement("div");
            connection_delete.className = "connection-delete flex-center";
            connection_delete.innerHTML = "<span>Disconnect</span>";
            connection_delete.addEventListener("click", function(){
                this.parentNode.parentNode.remove();
                deleteCallback();
            });
            
            let connections_options_wrap = document.createElement("div");
            connections_options_wrap.className = "connection-options-wrapper";
            
            let connections_options = document.createElement("div");
            connections_options.className = "connection-options";
            
            let i = 0;
            for(let key in data.proofs) {
                if(i === 3){
                    connections_options_wrap.appendChild(connections_options);
                    connections_options = document.createElement("div");
                    connections_options.className = "connection-options";
                }
                
                if(key.split(":")[0] === "twitter" && document.querySelector(".connection[style*='border-color: rgb(29, 161, 242);']") !== null)
                    continue;
                else if(key.split(":")[0] === "reddit" && document.querySelector(".connection[style*='border-color: rgb(95, 153, 207);']") !== null)
                    continue;
                
                
                let connections_options_inner = document.createElement("div");
                connections_options_inner.className = "connection-option-switch margin-bottom-20";
                connections_options_inner.setAttribute("style", "display: flex; flex: 1 1 auto;");
                
                let connections_options_h3 = document.createElement("h3");
                connections_options_h3.innerHTML = "Display <div class=\"icon-" + key.split(":")[0].replace("generic_web_site", "site").replace("dns", "site") + "\"></div> " + key.split(":")[1] + " on profile";
                connections_options_h3.setAttribute("style", "line-height: 24px; flex: 1 1 auto;");
                
                let checkbox_wrap = document.createElement('div');
                checkbox_wrap.className = "keybase-checkbox-wrap";
                
                let checkbox_switch = document.createElement('div');
                checkbox_switch.className = data.proofs[key].show?'keybase-checkbox-switch keybase-checkbox-checked':'keybase-checkbox-switch';
                
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = data.proofs[key].show?'on':'off';
                checkbox.className = 'keybase-checkbox';
                checkbox.setAttribute("data-account", key);
                
                let _this = this;
                checkbox.addEventListener("click", function(){
                    let isOn = this.value === "on";
                    this.value = isOn?'off':'on';
                    
                    checkbox_switch.className = isOn?'keybase-checkbox-switch':'keybase-checkbox-switch keybase-checkbox-checked';
                    
                    _this.changeDisplay(this.getAttribute("data-account"), !isOn);
                });
                
                checkbox_wrap.appendChild(checkbox);
                checkbox_wrap.appendChild(checkbox_switch);
                connections_options_inner.appendChild(connections_options_h3);
                connections_options_inner.appendChild(checkbox_wrap);
                connections_options.appendChild(connections_options_inner);
                
                i++;
            }
            connections_options_wrap.appendChild(connections_options);
            
            /* Build elements */
            
            connection_name_wrapper.appendChild(connection_name);
            connection_name_wrapper.appendChild(connection_label);
            connection_header.appendChild(img);
            connection_header.appendChild(connection_name_wrapper);
            connection_header.appendChild(connection_delete);
            connection.appendChild(connection_header);
            connection.appendChild(connections_options_wrap);
            
            document.querySelector(".user-settings-connections .connection-list").appendChild(connection);
        }
    }
    
    addProfileConnection(connectionName, externalLink, iconUrl){
        if(document.querySelector("#user-profile-modal") != null && document.querySelector("#user-profile-modal .tab-bar :first-child").className == "tab-bar-item selected"){
            if(!iconUrl)
                iconUrl = "https://api.bowser65.tk/assets/keybase-logo.png";
            
            let account = document.createElement("div");
            account.className = "connected-account";
            
            let icon = document.createElement("img");
            icon.className = "connected-account-icon";
            icon.src = iconUrl;
            
            let name_wrapper = document.createElement("div");
            name_wrapper.className = "connected-account-name-inner";
            
            let name = document.createElement("div");
            name.className = "connected-account-name";
            name.innerHTML = connectionName;
            name.setAttribute("title", connectionName);
            
            let verified = document.createElement("i");
            verified.className = "connected-account-verified-icon";
            
            let link = document.createElement("a");
            link.href = externalLink;
            link.rel = "noreferrer";
            link.target = "_blank";
            link.innerHTML = "<div class=\"connected-account-open-icon\"></div>";
            
            name_wrapper.appendChild(name);
            name_wrapper.appendChild(verified);
            
            account.appendChild(icon);
            account.appendChild(name_wrapper);
            account.appendChild(link);
            
            if(document.querySelector("#user-profile-modal .connected-accounts") == null){
                let section = document.createElement("div");
                section.className = "section";
                
                let account_wrap = document.createElement("div");
                account_wrap.className = "connected-accounts";
                
                section.appendChild(account_wrap);
                document.querySelector("#user-profile-modal .guilds").appendChild(section);
            }
            document.querySelector("#user-profile-modal .connected-accounts").appendChild(account);
            return account;
        }
    }
}

module.exports = KeybaseIntegration;