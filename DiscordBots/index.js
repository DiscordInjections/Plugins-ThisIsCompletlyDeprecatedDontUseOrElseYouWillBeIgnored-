const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");
const request = require("superagent");
const cm = require('cache-manager');
const Discord = require('discord.js');
const cache = cm.caching({store: 'memory', db: 0, ttl: 3600});

Number.prototype.formatNumber = function(){
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

Object.defineProperty(Discord.User.prototype, 'avatarURL', {
    get: function () {
        return `https://images.discordapp.net/avatars/${this.id}/${this.avatar}.png?size=512`
    }
});

class DiscordBots extends Plugin {
    constructor(...args) {
        super(...args);
        this.optionHTML = $(`<div class="db-options"><h2 class="h2-2ar_1B title-1pmpPr size16-3IvaX_ height20-165WbF weightSemiBold-T8sxWH defaultColor-v22dK1 margin-top-60 margin-bottom-20">DiscordBots Plugin</h2><div class="flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO switchItem-1uofoz marginBottom20-2Ifj-2" style="flex: 1 1 auto;"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><h3 class="h3-gDcP8B title-1pmpPr marginReset-3hwONl size16-3IvaX_ height24-2pMcnc weightMedium-13x9Y8 defaultColor-v22dK1 title-3i-5G_ marginReset-3hwONl flexChild-1KGW5q" style="flex: 1 1 auto;">Enabled</h3><div class="switchWrapperDefaultActive-2IdHq2 switchWrapperDefault-3GSsCS switchWrapper-3sSQdm flexChild-1KGW5q" style="flex: 0 0 auto;"><input type="checkbox" class="checkbox-1KYsPm db-enabled" value="on"><div class="switch-3lyafC"></div></div></div><div class="divider-1G01Z9 divider-2nTTsf marginTop20-3UscxH"></div></div><div class="flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO switchItem-1uofoz marginBottom20-2Ifj-2" style="flex: 1 1 auto;"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><h3 class="h3-gDcP8B title-1pmpPr marginReset-3hwONl size16-3IvaX_ height24-2pMcnc weightMedium-13x9Y8 defaultColor-v22dK1 title-3i-5G_ marginReset-3hwONl flexChild-1KGW5q" style="flex: 1 1 auto;">Show information in user pop-outs</h3><div class="switchWrapperDefaultActive-2IdHq2 switchWrapperDefault-3GSsCS switchWrapper-3sSQdm flexChild-1KGW5q" style="flex: 0 0 auto;"><input type="checkbox" class="checkbox-1KYsPm db-popout" value="on"><div class="switch-3lyafC"></div></div></div><div class="divider-1G01Z9 divider-2nTTsf marginTop20-3UscxH"></div></div><div class="flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO switchItem-1uofoz marginBottom20-2Ifj-2" style="flex: 1 1 auto;"><h3 class="h3-gDcP8B title-1pmpPr marginReset-3hwONl size16-3IvaX_ height24-2pMcnc weightMedium-13x9Y8 defaultColor-v22dK1 title-3i-5G_ marginReset-3hwONl flexChild-1KGW5q" style="flex: 1 1 auto;">Enable full description rendering</h3><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><div class="description-3MVziF formText-1L-zZB note-UEZmbY marginTop4-2rEBfJ modeDefault-389VjU primary-2giqSn" style="flex: 1 1 auto;">Descriptions are rendered in a iframe element. This option is turned off by default to lessen loading unneeded assets.</div><div class="switchWrapperDefaultActive-2IdHq2 switchWrapperDefault-3GSsCS switchWrapper-3sSQdm flexChild-1KGW5q" style="flex: 0 0 auto;"><input type="checkbox" class="checkbox-1KYsPm db-renderdesc" value="on"><div class="switch-3lyafC"></div></div></div><div class="divider-1G01Z9 divider-2nTTsf marginTop20-3UscxH"></div></div><div class="flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO switchItem-1uofoz marginBottom20-2Ifj-2" style="flex: 1 1 auto;"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><h3 class="h3-gDcP8B title-1pmpPr marginReset-3hwONl size16-3IvaX_ height24-2pMcnc weightMedium-13x9Y8 defaultColor-v22dK1 title-3i-5G_ marginReset-3hwONl flexChild-1KGW5q" style="flex: 1 1 auto;">Use DiscordBots.org instead of bots.discord.pw</h3><div class="switchWrapperDefaultActive-2IdHq2 switchWrapperDefault-3GSsCS switchWrapper-3sSQdm flexChild-1KGW5q" style="flex: 0 0 auto;"><input type="checkbox" class="checkbox-1KYsPm db-usedbl" value="on"><div class="switch-3lyafC"></div></div></div><div class="description-3MVziF formText-1L-zZB note-UEZmbY marginTop4-2rEBfJ modeDefault-389VjU primary-2giqSn" style="flex: 1 1 auto;"><a href="//discordbots.org" target="_blank">DiscordBots.org</a> uses a similar API as <a href="//bots.discord.pw" target="_blank">bots.discord.pw</a> but adds upvotes, badges for certified developers and bots and does not require a token.</div></div><input class="inputDefault-Y_U37D input-2YozMi size16-3IvaX_" name="password" value="" placeholder="bots.discord.pw Token" maxlength="999" type="password"><div class="divider-1G01Z9 divider-2nTTsf marginTop20-3UscxH"></div></div>`);
        this.belowNoteHTML = "";
        this.checkedProfile = false;
        this.noProfile = true;
        this.checkedPopout = false;
        this.noPopout = true;
        this.mo = new MutationObserver((changes, _) => {
            this.injectOptionHTML();
            this.checkForProfile();
            this.checkForPopout();
        });
        this.load();
        this.mo.observe($("[data-reactroot]")[0], { childList: true, subtree: true });
        this.registerCommand({
            name: "db-setbdptoken",
            info: "Sets your bots.discord.pw token.",
            usage: "<token>",
            func: (args) => {
                this.settings.bdptoken = args[0] || "";
                this.save();
                if(args[0] || args[0] === "") window.DI.Helpers.sendLog('Discord Bots Plugin', "Reset bots.discord.pw token.", this.iconURL);
                    else window.DI.Helpers.sendLog('Discord Bots Plugin', "Set bots.discord.pw token.", this.iconURL);
            }
        });
        this.registerCommand({
            name: "db-mode",
            info: "Change the mode of the plugin.",
            usage: "<bdp|dbl>",
            func: (args) => {
                if(!args[0]) args[0] = "";
                switch(args[0].toLowerCase()){
                    case "bdp":
                    case "bots.discord.pw":
                    case "botsdiscordpw":
                        this.settings.usedbl = false;
                        this.save();
                        window.DI.Helpers.sendLog('Discord Bots Plugin', "Mode set to bots.discord.pw.", this.iconURL);
                        break;
                    case "dbl":
                    case "discordbotslist":
                    case "discordbots.org":
                    case "discordbotsorg":
                    case "dborg":
                        this.settings.usedbl = true;
                        this.save();
                        window.DI.Helpers.sendLog('Discord Bots Plugin', "Mode set to Discordbots.org.", this.iconURL);
                        break;
                    default:
                        window.DI.Helpers.sendLog('Discord Bots Plugin', "Error: Invalid mode", this.iconURL);
                        break;
                }
            }
        });
    }

    get configTemplate() {
        return {
            color: '7A78BD'
        };
    }

    get iconURL() {
        return this.settings.usedbl ? 'https://i-need.discord.cards/da0e09.webp' : 'https://i-need.discord.cards/5e6c8d.png';
    }

    unload() {
        this.mo.disconnect();
    }

    load() {
        this.settings = $.extend({}, {enabled:true,usedbl:false,renderdesc:false,bdptoken:"",popout:false}, JSON.parse(window.DI.localStorage.getItem("DiscordBotsPlugin")));
        this.save();
    }

    save() {
        window.DI.localStorage.setItem("DiscordBotsPlugin", JSON.stringify(this.settings));
    }

    reactInst(node){
        return node[ Object.keys(node).find((key) => key.startsWith("__reactInternalInstance")) ]
    }

    makeProfileGuild(user){
        return `<div class="guild no-link"><div class="avatar-large stop-animation" style="background-image: url(&quot;${user.displayAvatarURL}&quot;);"><div class="status status-${user.presence.game && user.presence.game.streaming ? "streaming" : user.presence.status}"></div></div><div class="guild-inner"><div class="guild-name"><span class="username">${user.username.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")}</span><span class="discriminator">#${user.discriminator}</span></div></div></div>`
    }

    onBotProfile(user){
        if(this.settings.usedbl){
            DBLAPI.getBot(user.id).then(res => {
                if(res.body.certifiedBot){
                    $(".header-info").prepend(`<div class="profile-badge dblbadge badge-dblcertbot"></div>`);
                    $(".badge-dblcertbot").mouseover(()=>{
                        let tt = $("<div>").append("Certified Bot").addClass("tooltip tooltip-top tooltip-normal db-tt dblcertbot")
                        $(".tooltips").append(tt);
                        var position = $(".badge-dblcertbot").offset();
                        position.top -= 38 + tt.height();
                        position.left += $(".badge-dblcertbot").width()/2 - tt.width()/2 - 11;
                        tt.offset(position);
                    });
                    $(".badge-dblcertbot").mouseout(()=>{
                        $(".tooltip.dblcertbot").remove();
                    });
                    $(".badge-dblcertbot").click(()=>{
                        window.open("//discordbots.org/certification")
                    });
                };
                $(`<div class="actions db-bot"><button class="btn reject-friend no-link">${res.body.lib}</button>${
                    res.body.server_count ? `<button class="btn no-link">${res.body.server_count.formatNumber()} Servers</button>` : ""
                }${
                    res.body.shard_count ? `<button class="btn no-link">${res.body.shard_count.formatNumber()} Shards</button>` : ""
                }<button class="btn add-friend no-link">${res.body.points.formatNumber()} Upvotes</button></div>`)
                .insertAfter(".header-info");
                $(".header-info-inner").append(`<div class="activity db-prefix">Prefix: <strong>${res.body.prefix.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")}</strong></div>`);
                let html = `<div class="section db-more"><div class="section-header">About</div><div class="note">`;
                html += `<div class="description-3MVziF formText-1L-zZB note-UEZmbY marginTop4-2rEBfJ modeDefault-389VjU primary-2giqSn" style="flex: 1 1 auto;">${res.body.shortdesc.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")}</div>`
                html += `<a href="//discordbots/bot/${user.id}"><button class="btn">Discordbots.org Page</button></a>`;
                if(res.body.invite !== "") html += `<a href="${res.body.invite}"><button class="btn">Invite</button></a>`;
                if(res.body.website !== "") html += `<a href="${res.body.website}"><button class="btn">Website</button></a>`;
                if(res.body.github !== "") html += `<a href="${res.body.github}"><button class="btn">GitHub Repo</button></a>`;
                html += `</div></div></div>`;
                let owners = [];
                res.body.owners.map(id => {if(window.DI.client.users.get(id)) owners.push(window.DI.client.users.get(id))});
                if(owners.length !== 0){
                    html += `<div class="section"><div class="section-header">Owner(s)</div>`;
                    owners.map(user=>html+=this.makeProfileGuild(user));
                    html += `</div>`;
                }
                if(this.settings.renderdesc) {
                    html += `<div class="section db-fulldesc"><iframe width="470" height="800px"></iframe></div>`;
                    this.longdesc = res.body.longdesc;
                };
                this.belowNoteHTML = html;
            }).catch(e => {
                if(e.toString() === "Error: Not Found") return;
                this.log("Failed to recieve bot information", user, e);
            });
        }else if(this.settings.bdptoken.length > 0){
            BDPAPI.getBot(user.id, this.settings.bdptoken).then(res => {
                BDPAPI.getBotStats(user.id, this.settings.bdptoken).then(res2 => {
                    let shard_count = res2.body.stats.length;
                    let server_count = res2.body.stats.map(s=>s.server_count).reduce((prev, val) => prev + val);
                    $(".header-info-inner").append(`<div class="activity db-prefix">Prefix: <strong>${res.body.prefix.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")}</strong></div>`);
                    $(`<div class="actions db-bot"><button class="btn reject-friend no-link">${res.body.library}</button>${
                        server_count ? `<button class="btn no-link">${server_count.formatNumber()} Servers</button>` : ""
                    }${
                        shard_count !== 1 ? `<button class="btn no-link">${shard_count.formatNumber()} Shards</button>` : ""
                    }</div>`).insertAfter(".header-info");
                    let html = `<div class="section db-more"><div class="section-header">About</div><div class="note">`;
                    html += `<div class="description-3MVziF formText-1L-zZB note-UEZmbY marginTop4-2rEBfJ modeDefault-389VjU primary-2giqSn" style="flex: 1 1 auto;">${res.body.description.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")}</div>`
                    html += `<a href="//bots.discord.pw/bots/${user.id}"><button class="btn">bots.discord.pw Page</button></a>`;
                    if(res.body.invite_url !== "") html += `<a href="${res.body.invite_url}"><button class="btn">Invite</button></a>`;
                    if(res.body.website !== "") html += `<a href="${res.body.website}"><button class="btn">Website</button></a>`;
                    html += `</div></div></div>`;
                    let owners = [];
                    res.body.owner_ids.map(id => {if(window.DI.client.users.get(id)) owners.push(window.DI.client.users.get(id))});
                    if(owners.length !== 0){
                        html += `<div class="section"><div class="section-header">Owner(s)</div>`;
                        owners.map(user=>html+=this.makeProfileGuild(user));
                        html += `</div>`;
                    }
                    if(this.settings.renderdesc) {
                        html += `<div class="section db-fulldesc"><iframe width="470" height="800px"></iframe></div>`;
                        this.longdesc = res.body.full_description;
                    };
                    this.belowNoteHTML = html;
                }).catch(e => {
                    $(`<div class="actions db-bot"><button class="btn reject-friend no-link">${res.body.library}</button></div>`)
                      .insertAfter(".header-info");
                    $(".header-info-inner").append(`<div class="activity db-prefix">Prefix: <strong>${res.body.prefix.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;")}</strong></div>`);
                });
            }).catch(e => {
                if(e.toString() === "Error: Not Found") return;
                this.log("Failed to recieve bot information", user, e);
            });
        }
    }

    onUserProfile(user){
        if(this.settings.usedbl){
            DBLAPI.getUser(user.id).then(res => {
                DBLAPI.getUserBots(user.id).then(res2 => {
                    if(res.body.certifiedDev){
                        $(".header-info").prepend(`<div class="profile-badge dblbadge badge-dblcertdev"></div>`);
                        $(".badge-dblcertdev").mouseover(()=>{
                            let tt = $("<div>").append("Certified Developer").addClass("tooltip tooltip-top tooltip-normal db-tt dblcertdev")
                            $(".tooltips").append(tt);
                            var position = $(".badge-dblcertdev").offset();
                            position.top -= 38 + tt.height();
                            position.left += $(".badge-dblcertdev").width()/2 - tt.width()/2 - 11;
                            tt.offset(position);
                        });
                        $(".badge-dblcertdev").mouseout(()=>{
                            $(".tooltip.dblcertdev").remove();
                        });
                        $(".badge-dblcertdev").click(()=>{
                            window.open("//discordbots.org/certification")
                        });
                    };
                    if(res.body.admin){
                        $(".header-info").prepend(`<div class="profile-badge dblbadge no-link badge-dbladmin"></div>`);
                        $(".badge-dbladmin").mouseover(()=>{
                            let tt = $("<div>").append("Discord Bot List Site Administrator").addClass("tooltip tooltip-top tooltip-normal db-tt dbladmin")
                            $(".tooltips").append(tt);
                            var position = $(".badge-dbladmin").offset();
                            position.top -= 38 + tt.height();
                            position.left += $(".badge-dbladmin").width()/2 - tt.width()/2 - 11;
                            tt.offset(position);
                        });
                        $(".badge-dbladmin").mouseout(()=>{
                            $(".tooltip.dbladmin").remove();
                        });
                    };
                    if(res.body.mod){
                        $(".header-info").prepend(`<div class="profile-badge dblbadge no-link badge-dblmod"></div>`);
                        $(".badge-dblmod").mouseover(()=>{
                            let tt = $("<div>").append("Discord Bot List Moderator").addClass("tooltip tooltip-top tooltip-normal db-tt dblmod")
                            $(".tooltips").append(tt);
                            var position = $(".badge-dblmod").offset();
                            position.top -= 38 + tt.height();
                            position.left += $(".badge-dblmod").width()/2 - tt.width()/2 - 11;
                            tt.offset(position);
                        });
                        $(".badge-dblmod").mouseout(()=>{
                            $(".tooltip.dblmod").remove();
                        });
                    };
                    if(res.body.banner !== "" && res.body.banner){
                        $("#user-profile-modal .header").addClass("with-background").attr('style', `background-image:url('${res.body.banner.replace(/^http:/g, "https:")}')!important;background-size:cover;background-position:center;`)
                    }
                    let html = '';
                    let owners = [];
                    res2.body.results.map(bot => owners.push(new Discord.User(window.DI.client, bot)));
                    this.log(owners, res2, new Discord.User(window.DI.client, res2.body.results[0]))
                    if(owners.length !== 0){
                        html += `<div class="section"><div class="section-header">Bots</div>`;
                        owners.map(user=>html+=this.makeProfileGuild(user));
                        html += `</div>`;
                    };
                    this.belowNoteHTML = html;
                }).catch(e => {
                    if(e.toString() === "Error: Not Found") return;
                    this.log("Failed to recieve user bot information", user, e);
                });
            }).catch(e => {
                if(e.toString() === "Error: Not Found") return;
                this.log("Failed to recieve user information", user, e);
            });
        }else{
            BDPAPI.getUser(user.id).then(res => {
                let html = `</div></div></div>`;
                let owners = [];
                res.body.bots.map(bot => {if(window.DI.client.users.get(bot.user_id)) owners.push(window.DI.client.users.get(bot.user_id))});
                if(owners.length !== 0){
                    html += `<div class="section"><div class="section-header">Bots</div>`;
                    owners.map(user=>html+=this.makeProfileGuild(user));
                    html += `</div>`;
                }
                this.belowNoteHTML = html;
            }).catch(e => {
                if(e.toString() === "Error: Not Found") return;
                this.log("Failed to recieve user information", user, e);
            });
        }
    }

    onBotPopout(user){
        if(!this.settings.popout) return;
        if(this.settings.usedbl){
            DBLAPI.getBot(user.id).then(res => {
                $(`<div class="member-roles"><component class="member-role" style=""><span class="name">${res.body.lib}</span></component><component class="member-role" style=""><span class="name">${res.body.server_count.formatNumber()} Servers</span></component>${
                    res.body.shard_count ? `<component class="member-role" style=""><span class="name">${res.body.shard_count.formatNumber()} Shards</span></component>` : ""
                }<component class="member-role" style=""><span class="name">${res.body.points.formatNumber()} Upvotes</span></component></div>`)
                  .insertAfter(".user-popout .username-wrapper");
                $(".user-popout .username-wrapper").append(`<div class="activity db-prefix">Prefix: <strong>${res.body.prefix}</strong></div>`);
                this.belowNoteHTML = `<div class="section"><div class="section-header">DiscordBots Plugin</div><div class="note"><button class="btn add-friend no-link">Upvotes</button></div></div>`
            }).catch(e => {
                if(e.toString() === "Error: Not Found") return;
                this.log("Failed to recieve bot information", user, e);
            });
        }else if(this.settings.bdptoken.length > 0){
            BDPAPI.getBot(user.id, this.settings.bdptoken).then(res => {
                BDPAPI.getBotStats(user.id, this.settings.bdptoken).then(res2 => {
                    let shard_count = res2.body.stats.length;
                    let server_count = res2.body.stats.map(s=>s.server_count).reduce((prev, val) => prev + val);
                    $(`<div class="member-roles"><component class="member-role" style=""><span class="name">${res.body.library}</span></component>${
                        server_count ? `<component class="member-role" style=""><span class="name">${server_count.formatNumber()} Servers</span></component>` : ""
                    }${
                        shard_count !== 1 ? `<component class="member-role" style=""><span class="name">${shard_count.formatNumber()} Shards</span></component>` : ""
                    }</div>`)
                      .insertAfter(".user-popout .username-wrapper");
                }).catch(e => {
                    $(".user-popout .username-wrapper").append(`<div class="activity db-prefix">Prefix: <strong>${res.body.prefix}</strong></div>`);
                });
            }).catch(e => {
                if(e.toString() === "Error: Not Found") return;
                this.log("Failed to recieve bot information", user, e);
            });
        }
    }

    onUserPopout(user){
        if(!this.settings.popout) return;
        if(this.settings.usedbl){
            DBLAPI.getUser(user.id).then(res => {
                if(res.body.banner !== "" && res.body.banner){
                    $(".user-popout .header").addClass("with-background").attr('style', `background-image:url('${res.body.banner.replace(/^http:/g, "https:")}')!important;background-size:cover;background-position:center;`)
                }
            }).catch(e => {
                if(e.toString() === "Error: Not Found") return;
                this.log("Failed to recieve user information", user, e);
            });
        }
    }

    checkForProfile(){
        this.noProfile = !$("#user-profile-modal")[0];
        if(this.noProfile){ // If the profile is open
            this.checkedProfile = false;
            this.belowNoteHTML = "";
            this.longdesc = "";
            return;
        }
        if($("#user-profile-modal>.fade:not(.injected)").length !== 0 && this.belowNoteHTML !== ""){
            $(this.belowNoteHTML).insertAfter($("#user-profile-modal>.fade:not(.injected) .section").first());
            $("#user-profile-modal>.fade").addClass("injected");
            if($("iframe")[0]) $("iframe")[0].src = `data:text/html,${this.longdesc}`;
        }
        if(this.checkedProfile) return;
        this.checkedProfile = true;
        let user = this.reactInst($("#user-profile-modal .header-info-inner .discord-tag")[0].parentNode)._currentElement.props.children[0].props.user;
        if(user.bot){
            this.onBotProfile(user);
        }else{
            this.onUserProfile(user);
        }
    }

    checkForPopout(){
        this.noPopout = !$(".user-popout")[0];
        if(this.noPopout){ // If the profile is open
            this.checkedPopout = false;
            return;
        }
        if(this.checkedPopout) return;
        this.checkedPopout = true;
        let user = this.reactInst($(".user-popout .discord-tag")[0].parentNode)._currentElement.props.children[1].props.user;
        if(user.bot){
            this.onBotPopout(user);
        }else{
            this.onUserPopout(user);
        }
    }

    injectOptionHTML() {
        if($(".app>*:first-child")[0].childNodes.length !== 2) return; // Is in the Options Menu
        if(!$(".itemDefaultSelected-1UAWLe.item-3879bf.selected-eNoxEK")[0]) return;
        if($(".itemDefaultSelected-1UAWLe.item-3879bf.selected-eNoxEK").html() !== "Appearance") return; // Is in the Voice Section
        if($(".db-options")[0]) return; // Don't initiate if it's already there
        $(".user-settings-appearance>.flex-vertical").append(this.optionHTML);
        if(this.settings.enabled){
            $(".db-options input.checkbox-1KYsPm.db-enabled")[0].checked = true;
            $(".db-options input.checkbox-1KYsPm.db-enabled+.switch-3lyafC").addClass("checked-7qfgSb");
        }
        if(this.settings.popout){
            $(".db-options input.checkbox-1KYsPm.db-popout")[0].checked = true;
            $(".db-options input.checkbox-1KYsPm.db-popout+.switch-3lyafC").addClass("checked-7qfgSb");
        }
        if(this.settings.usedbl){
            $(".db-options input.db-usedbl")[0].checked = true;
            $(".db-options input.db-usedbl+.switch-3lyafC").addClass("checked-7qfgSb");
        }
        if(this.settings.renderdesc){
            $(".db-options input.db-renderdesc")[0].checked = true;
            $(".db-options input.db-renderdesc+.switch-3lyafC").addClass("checked-7qfgSb");
        }
        $(".db-options input.inputDefault-Y_U37D").val(this.settings.bdptoken);
        if(this.optionsInit) return;
        $(".db-options input.checkbox-1KYsPm.db-enabled").click(()=>{
            if(this.settings.enabled){
                $(".db-options input.checkbox-1KYsPm.db-enabled+.switch-3lyafC").removeClass("checked-7qfgSb");
                this.settings.enabled = false;
                this.log("Saving 'enabled' as false...");
                this.save();
            }else{
                $(".db-options input.checkbox-1KYsPm.db-enabled+.switch-3lyafC").addClass("checked-7qfgSb");
                this.settings.enabled = true;
                this.log("Saving 'enabled' as true...");
                this.save();
            }
        });
        $(".db-options input.checkbox-1KYsPm.db-popout").click(()=>{
            if(this.settings.popout){
                $(".db-options input.checkbox-1KYsPm.db-popout+.switch-3lyafC").removeClass("checked-7qfgSb");
                this.settings.popout = false;
                this.log("Saving 'popout' as false...");
                this.save();
            }else{
                $(".db-options input.checkbox-1KYsPm.db-popout+.switch-3lyafC").addClass("checked-7qfgSb");
                this.settings.popout = true;
                this.log("Saving 'popout' as true...");
                this.save();
            }
        });
        $(".db-options input.checkbox-1KYsPm.db-renderdesc").click(()=>{
            if(this.settings.renderdesc){
                $(".db-options input.checkbox-1KYsPm.db-renderdesc+.switch-3lyafC").removeClass("checked-7qfgSb");
                this.settings.renderdesc = false;
                this.log("Saving 'renderdesc' as false...");
                this.save();
            }else{
                $(".db-options input.checkbox-1KYsPm.db-renderdesc+.switch-3lyafC").addClass("checked-7qfgSb");
                this.settings.renderdesc = true;
                this.log("Saving 'renderdesc' as true...");
                this.save();
            }
        });
        $(".db-options input.db-usedbl").click(()=>{
            if(this.settings.usedbl){
                $(".db-options input.db-usedbl+.switch-3lyafC").removeClass("checked-7qfgSb");
                this.settings.usedbl = false;
                this.log("Saving 'usedbl' as false...");
                this.save();
            }else{
                $(".db-options input.db-usedbl+.switch-3lyafC").addClass("checked-7qfgSb");
                this.settings.usedbl = true;
                this.log("Saving 'usedbl' as true...");
                this.save();
            }
        });
        $(".db-options input.inputDefault-Y_U37D").change(()=>{
            this.settings.bdptoken = $(".db-options input.inputDefault-Y_U37D").val();
            this.log("Saving token...");
            this.save();
        });
        this.optionsInit = true;
    }
}

const cacherequest = (id,url,token)=>{
    return new Promise((rs,rj)=>{
        setTimeout(()=>{
            cache.wrap(id, function(cb) {
                if(token){
                    request.get(url).set('User-Agent', 'DiscordBots Plugin (https://github.com/DiscordInjections/Plugins/tree/master/DiscordBots)').set('Authorization', token).then(res=>cb(null,res)).catch(cb)
                }else{
                    request.get(url).set('User-Agent', 'DiscordBots Plugin (https://github.com/DiscordInjections/Plugins/tree/master/DiscordBots)').then(res=>cb(null,res)).catch(cb)
                }
            }, (err, data)=>{
                if(err) rj(err);
                rs(data);
            });
        }, 100);
    })
}

class BDPAPI {
    static getUser(id){ return cacherequest(`BDP_USER_${id}`, `https://bots.discord.pw/api/users/${id}`) }
    static getBot(id, token){ return cacherequest(`BDP_BOT_${id}`, `https://bots.discord.pw/api/bots/${id}`, token) }
    static getBotStats(id, token){ return cacherequest(`BDP_BOTSTATS_${id}`, `https://bots.discord.pw/api/bots/${id}/stats`, token) }
}

class DBLAPI {
    static getUser(id){ return cacherequest(`DBL_USER_${id}`, `https://discordbots.org/api/users/${id}`) }
    static getBot(id){ return cacherequest(`DBL_BOT_${id}`, `https://discordbots.org/api/bots/${id}`) }
    static getUserBots(id){ return cacherequest(`DBL_USERBOTS_${id}`, `https://discordbots.org/api/bots?search=owners,${id}`) }
}

module.exports = DiscordBots;
