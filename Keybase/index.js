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
				if(data.user.keybase === null){
					_this.addConnectButton(_this.setKeybaseAccount.bind(_this));
				}else{
					_this.addSettingsConnection(data.user.keybase, _this.deleteKeybaseAccount.bind(_this));
				}
			});
			
		}else if(document.querySelector("#user-profile-modal") !== null && document.querySelector("#user-profile-modal").className !== "keybase-checked"){
            document.querySelector("#user-profile-modal").className = "keybase-checked";
			let user = document.querySelector("#user-profile-modal .avatar-profile").getAttribute("style").split("/")[4];
			let _this = this;
			
			this.getKeybaseAccount(user, function(data){
				if(data.user.keybase !== null){
					_this.addProfileConnection(data.user.keybase);
					
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

					for(let accountId in data.user.accounts){
                        let account_element = document.querySelector("#user-profile-modal .connected-account[data-account='" + accountId + "']");
                        if(account_element !== null){
                            let keybase_icon = document.createElement("a");
                            keybase_icon.href = data.user.accounts[accountId];
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
            this.dialog("Whooops, something went wrong :(", "Keybase executable not found... :( Make sure Keybase is installed and in your PATH, restart Discord and try again. If this alert still appears, please contact Bowser65#4680", function(){});
        }else{
			let user = document.querySelector(".username").parentNode.previousSibling.getAttribute("style").split("/")[4];
            exec(keybase_exec + " encrypt -m 'Discord:" + user + "' bowser65", function(err, data){
                data = new Buffer(data).toString("base64");
                callback(data);
            });
        }
	}
	
	/* API */
	getKeybaseAccount(accountId, callback){
		let _this = this;
		
		request.get('https://api.bowser65.tk/v1/keybase/user/' + accountId, function (error, response, body) {
			console.log(response.body);
			
            let parse = JSON.parse(response.body);
            if(parse.status != "success"){
                _this.dialog("Whooops, something went wrong :(", "Sorry, my end sucks :( Please contact me, Bowser65#4680<br>Error message: " + parse.message);
            }else{
                callback(parse);
			}
		});
	}
	
	setKeybaseAccount(){
		let _this = this;
		
		this.getKeybaseAccountData(function(keybaseData){
			request.post({url: 'https://api.bowser65.tk/v1/keybase/user', headers:{"X-Keybase-Data": keybaseData}}, function (error, response, body) {
                let data = JSON.parse(body);
                if(data.status != "success"){
                    _this.dialog("Whooops, something went wrong :(", "Sorry, my end sucks :( Please contact me, Bowser65#4680<br>Error message: " + data.message);
                }else{
                    document.querySelector(".connect-account-btn-inner[style*='keybase-logo.png']").parentNode.remove();
                    document.querySelector(".user-settings-connections").removeAttribute("keybase");
                }
            });
		});
	}
	
	deleteKeybaseAccount(){
		let _this = this;
		
		this.getKeybaseAccountData(function(keybaseData){
			request.delete({url: 'https://api.bowser65.tk/v1/keybase/user', headers:{"X-Keybase-Data": keybaseData}}, function (error, response, body) {
				debugger;
				
                let data = JSON.parse(body);
                if(data.status != "success"){
                    _this.dialog("Whooops, something went wrong :(", "Sorry, my end sucks :( Please contact me, Bowser65#4680<br>Error message: " + data.message);
                }else{
                    document.querySelector(".user-settings-connections").removeAttribute("keybase");
                }
            });
		});
	}
	
	/* UI */
	dialog(title, contents){
		if(document.querySelector(".keybase-dialog") !== null) document.querySelector(".keybase-dialog").remove();
        
        let global_container = document.createElement("div");
        global_container.className = "theme-dark keybase-dialog";
        
        let overlay = document.createElement("div");
        overlay.className = "callout-backdrop";
        overlay.setAttribute("style", "opacity: 0.85; background-color: rgb(0, 0, 0); transform: translateZ(0px);")
        overlay.addEventListener("click", function(){
            document.querySelector(".keybase-dialog").remove();
        });
        
        let modal = document.createElement("div");
        modal.className = "keybase-modal";
        
        let modal_inner = document.createElement("div");
        modal_inner.className = "keybase-modal-inner";
        
        let header = document.createElement("div");
        header.className = "keybase-modal-header";
        
        let header_title = document.createElement("h4");
        header_title.innerHTML = title;
        
        let modal_contents_wrap = document.createElement("div");
        modal_contents_wrap.className = "keybase-modal-scollerWrap";
        
        let modal_contents = document.createElement("div");
        modal_contents.className = "keybase-modal-scroller";
        modal_contents.innerHTML = contents;
        
        let modal_footer = document.createElement("div");
        modal_footer.className = "keybase-modal-footer";
        
        let modal_button = document.createElement("button");
        modal_button.className = "keybase-modal-button-done";
        modal_button.type = "button";
        modal_button.innerHTML = "<div class=\"keybase-modal-button-inner\">Done</div>";
        modal_button.addEventListener("click", function(){
            document.querySelector(".keybase-dialog").remove();
        });
        
        modal_footer.appendChild(modal_button);
        modal_contents_wrap.appendChild(modal_contents);
        
        header.appendChild(header_title);
        
        modal_inner.appendChild(header);
        modal_inner.appendChild(modal_contents_wrap);
        modal_inner.appendChild(modal_footer);
        modal.appendChild(modal_inner);
        
        global_container.appendChild(overlay);
        global_container.appendChild(modal);
        
        document.querySelector("#app-mount > div").appendChild(global_container);
	}
	
	addConnectButton(callback){
		if(document.querySelector(".connect-account-list .settings-connected-accounts") !== null){
			let connect = document.createElement("div");
			connect.className = "connect-account-btn";
			
			let btn = document.createElement("button");
			btn.className = "connect-account-btn-inner";
			btn.type = "button";
			btn.setAttribute("style", "background-image: url('https://api.bowser65.tk/assets/keybase-logo.png');");
			btn.addEventListener("click", callback);
			
			connect.appendChild(btn);
			document.querySelector(".connect-account-list .settings-connected-accounts").appendChild(connect);
		}
	}
	
	addSettingsConnection(name, deleteCallback){
		if(document.querySelector(".user-settings-connections") !== null){
            /* Create elements */
            let connection = document.createElement("div");
            connection.className = "connection elevation-low margin-bottom-8";
            connection.setAttribute("style", "border-color: #33a0ff; background-color: #33a0ff;");
            
            let connection_header = document.createElement("div");
            connection_header.className = "connection-header";
            
            let img = document.createElement("img");
            img.className = "connection-icon no-user-drag";
            img.src = "https://api.bowser65.tk/assets/keybase-logo.png";
            
            let connection_name_wrapper = document.createElement("div");
            
            let connection_name = document.createElement("div");
            connection_name.className = "connection-account-value";
            connection_name.innerHTML = name;
            
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
            
            /* Build elements */
            connection_name_wrapper.appendChild(connection_name);
            connection_name_wrapper.appendChild(connection_label);
            connection_header.appendChild(img);
            connection_header.appendChild(connection_name_wrapper);
            connection_header.appendChild(connection_delete);
            connection.appendChild(connection_header);
            
            document.querySelector(".user-settings-connections .connection-list").appendChild(connection);
        }
	}
	
	addProfileConnection(connectionName){
		if(document.querySelector("#user-profile-modal") != null && document.querySelector("#user-profile-modal .tab-bar :first-child").className == "tab-bar-item selected"){
            let account = document.createElement("div");
            account.className = "connected-account";
            
            let icon = document.createElement("img");
            icon.className = "connected-account-icon";
            icon.src = "https://api.bowser65.tk/assets/keybase-logo.png";
            
            let name_wrapper = document.createElement("div");
            name_wrapper.className = "connected-account-name-inner";
            
            let name = document.createElement("div");
            name.className = "connected-account-name";
            name.innerHTML = connectionName;
            
            let verified = document.createElement("i");
            verified.className = "connected-account-verified-icon";
            
            let link = document.createElement("a");
            link.href = "https://keybase.io/" + connectionName;
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
        }
	}
}

module.exports = KeybaseIntegration;