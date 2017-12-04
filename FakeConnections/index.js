const Plugin = module.parent.require('../Structures/Plugin');
const request = require("superagent");

class FakeConnections extends Plugin {
    constructor(...args) {
        super(...args);
        this.html = `<div class="fake-connection-box connection elevation-low margin-bottom-8" style="border-color: rgb(54, 57, 63);ba;background-color: rgb(54, 57, 63);"><div class="connection-header margin-bottom-20"><img class="connection-icon no-user-drag" src="//github.com/Snazzah/DiscordInjections-Chrome/raw/master/src/img/transparentIcon.png"><div><div class="default-3bB32Y formText-1L-zZB connection-account-value modeDefault-389VjU primary-2giqSn">Fake Connections Plugin</div><div class="description-3MVziF formText-1L-zZB connection-account-label modeDefault-389VjU primary-2giqSn">CLICK TO EXPAND</div></div></div><div class="connection-options-wrapper"><div class="connections-display margin-bottom-20"><div class="connect-account-btn battlenet"><button class="connect-account-btn-inner" type="button" style="background-image: url(&quot;/assets/8c289d499232cd8e9582b4a5639d9d1d.png&quot;);"></button></div><div class="connect-account-btn skype"><button class="connect-account-btn-inner" type="button" style="background-image: url(&quot;/assets/5be6cc17e596c02e7506f2776cfb1622.png&quot;);"></button></div><div class="connect-account-btn leagueoflegends fc-selected"><button class="connect-account-btn-inner" type="button" style="background-image: url(&quot;/assets/806953fe1cc616477175cbcdf90d5cd3.png&quot;);"></button></div></div><div class="option-section"><h2 class="h2-2ar_1B title-1pmpPr size16-3IvaX_ height20-165WbF weightSemiBold-T8sxWH defaultColor-v22dK1 defaultMarginh2-37e5HZ">ID<small>(optional)</small></h2><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO margin-bottom-20"><input type="text" class="inputDefault-Y_U37D input-2YozMi size16-3IvaX_ flexChild-1KGW5q" placeholder="Having this blank will generate an ID." value="" style="flex: 1 1 auto; display: inline-block;"></div></div><div class="option-section"><h2 class="h2-2ar_1B title-1pmpPr size16-3IvaX_ height20-165WbF weightSemiBold-T8sxWH defaultColor-v22dK1 defaultMarginh2-37e5HZ">Name</h2><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO margin-bottom-20"><input type="text" class="inputDefault-Y_U37D input-2YozMi size16-3IvaX_ flexChild-1KGW5q" placeholder="Cool Guy" style="flex: 1 1 auto; display: inline-block;"></div></div><div class="submit-section"><div class="connection-delete flex-center"></div><h3 class="titleDefault-1CWM9y title-3i-5G_ marginReset-3hwONl weightMedium-13x9Y8 size16-3IvaX_ height24-2pMcnc flexChild-1KGW5q status-message" style="flex: 1 1 auto;"></h3></div></div></div>`;
        this.mBind = this.check.bind(this);
        window.DI.StateWatcher.on('mutation', this.mBind);
    }

    unload(){
        window.DI.StateWatcher.removeListener('mutation', this.mBind);
        if(document.querySelector(".fake-connection-box")) document.querySelector(".connection-list").removeChild(document.querySelector(".fake-connection-box"));
    }

    check(){
        let html = document.createRange().createContextualFragment(this.html);
        let box = html.childNodes[0];
        box._selectedAccount = "leagueoflegends";
        let self = this;
        box.querySelector(".connection-header").onclick = () => {
            if(box.classList.contains("show")) box.classList.remove("show"); else box.classList.add("show");
        }
        box.querySelector(".connection-delete").onclick = () => {
            let [id, name] = box.querySelectorAll("input");
            id = id.value === "" ? Date.now().toString(36) : id.value;
            name = name.value;
            if(name === "") return self.sendStatusMessage("fail", "No name provided");
            self.log("Adding connection", id, name, box._selectedAccount);
            request.put(`https://canary.discordapp.com/api/v6/users/@me/connections/${box._selectedAccount}/${id}`)
                .set("Authorization", DI.client.token).send({ name }).then(r => {
                    self.log(r.body);
                    self.sendStatusMessage("success", "Success");
                }).catch(e => {
                    self.log(e);
                    self.log({e});
                    self.sendStatusMessage("fail", "Request failed, check console");
                });
        }
        let conF = function(){
            document.querySelector(`.${box._selectedAccount}`).classList.remove("fc-selected");
            box._selectedAccount = this.parentNode.classList[1];
            this.parentNode.classList.add("fc-selected");
        }
        box.querySelectorAll("button").forEach(b => b.onclick = conF);
        if(!document.querySelector(".fake-connection-box") && document.querySelector(".connection-list")){
            if(document.querySelector(".connection-list").childNodes.length === 0) document.querySelector(".connection-list").appendChild(box); else document.querySelector(".connection-list").insertBefore(box, document.querySelector(".connection-list").childNodes[0]);
        }
    }

    sendStatusMessage(s,m){
        if(document.querySelector(".fake-connection-box")){
            this.resetStatusMessage();
            document.querySelector(".status-message").classList.add(s);
            document.querySelector(".status-message").innerHTML = m;
            this.to = setTimeout(this.resetStatusMessage.bind(this), 5000);
        }
    }

    resetStatusMessage(){
        if(document.querySelector(".fake-connection-box")){
            document.querySelector(".status-message").classList.remove("fail");
            document.querySelector(".status-message").classList.remove("success");
            document.querySelector(".status-message").innerHTML = "";
            clearTimeout(this.to);
        }
    }

    get configTemplate() {
        return {
            color: '7A78BD'
        };
    }
}

module.exports = FakeConnections;