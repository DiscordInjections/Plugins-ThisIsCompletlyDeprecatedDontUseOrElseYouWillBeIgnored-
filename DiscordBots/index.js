const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");
const request = require("superagent");
const cm = require('cache-manager');
const Discord = require('discord.js');
const cache = cm.caching({store: 'memory', db: 0, ttl: 3600});
const e = window.DI.React.createElement;
const { SettingsDivider, SettingsOptionToggle, SettingsOptionTextbox, SettingsOptionDescription } = window.DI.require('./Structures/Components');

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
        this.belowNoteHTML = "";
        this.checkedProfile = false;
        this.noProfile = true;
        this.checkedPopout = false;
        this.noPopout = true;
        this.mo = new MutationObserver((changes, _) => {
            this.checkForProfile();
            this.checkForPopout();
        });
        this.mo.observe($("#app-mount>div")[0], { childList: true, subtree: true });
        this.registerCommand({
            name: "db-setbdptoken",
            info: "Sets your bots.discord.pw token.",
            usage: "<token>",
            func: (args) => {
                let settings = this.settings;
                settings.bdptoken = args[0] || "";
                this.settings = settings;
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
                let settings = this.settings;
                switch(args[0].toLowerCase()){
                    case "bdp":
                    case "bots.discord.pw":
                    case "botsdiscordpw":
                        settings.usedbl = false;
                        this.settings = settings;
                        window.DI.Helpers.sendLog('Discord Bots Plugin', "Mode set to bots.discord.pw.", this.iconURL);
                        break;
                    case "dbl":
                    case "discordbotslist":
                    case "discordbots.org":
                    case "discordbotsorg":
                    case "dborg":
                        settings.usedbl = true;
                        this.settings = settings;
                        window.DI.Helpers.sendLog('Discord Bots Plugin', "Mode set to Discordbots.org.", this.iconURL);
                        break;
                    default:
                        window.DI.Helpers.sendLog('Discord Bots Plugin', "Error: Invalid mode, must be `discordbotslist` or `botsdiscordpw`", this.iconURL);
                        break;
                }
            }
        });
        window.DI.DISettings.registerSettingsTab(this, 'Discord Bots', DiscordBotsSettings);
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
                        html += `<div class="section dbl-section"><div class="section-header">Bots</div>`;
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
                $(`<div class="member-roles marginBottom8-1mABJ4"><component class="member-role" style=""><span class="name">${res.body.lib}</span></component><component class="member-role" style=""><span class="name">${res.body.server_count.formatNumber()} Servers</span></component>${
                    res.body.shard_count ? `<component class="member-role" style=""><span class="name">${res.body.shard_count.formatNumber()} Shards</span></component>` : ""
                }<component class="member-role" style=""><span class="name">${res.body.points.formatNumber()} Upvotes</span></component></div>`)
                  .insertAfter(".userPopout-4pfA0d .headerText-3tKBWq");
                $(".userPopout-4pfA0d .headerText-3tKBWq").append(`<div class="headerActivityText-3qBQRo db-prefix">Prefix: <strong>${res.body.prefix}</strong></div>`);
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
                    $(`<div class="member-roles marginBottom8-1mABJ4"><component class="member-role" style=""><span class="name">${res.body.library}</span></component>${
                        server_count ? `<component class="member-role" style=""><span class="name">${server_count.formatNumber()} Servers</span></component>` : ""
                    }${
                        shard_count !== 1 ? `<component class="member-role" style=""><span class="name">${shard_count.formatNumber()} Shards</span></component>` : ""
                    }</div>`)
                      .insertAfter(".userPopout-4pfA0d .headerText-3tKBWq");
                }).catch(e => {
                    $(".userPopout-4pfA0d .headerText-3tKBWq").append(`<div class="headerActivityText-3qBQRo db-prefix">Prefix: <strong>${res.body.prefix}</strong></div>`);
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
                    $(".userPopout-4pfA0d .header-3mZJcV").addClass("with-background").attr('style', `background-image:url('${res.body.banner.replace(/^http:/g, "https:")}')!important;background-size:cover;background-position:center;`)
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
            this.lastUser = null;
            return;
        }
        if($("#user-profile-modal")[0] && this.lastUser && this.reactInst($("#user-profile-modal .header-info-inner .discord-tag")[0].parentNode).memoizedProps.children[0].props.user.id !== this.lastUser.id){
            $("#user-profile-modal>.fade").removeClass("injected");
            $(".dbl-section,.dblbadge").remove();
            $("#user-profile-modal .header").removeClass("with-background").attr('style', ``)
            this.checkedProfile = false;
            this.belowNoteHTML = "";
            this.longdesc = "";
            this.lastUser = null;
            return;
        }
        if($("#user-profile-modal>.fade:not(.injected)").length !== 0 && this.belowNoteHTML !== ""){
            $(this.belowNoteHTML).insertAfter($("#user-profile-modal>.fade:not(.injected) .section").first());
            $("#user-profile-modal>.fade").addClass("injected");
            if($("iframe")[0]) $("iframe")[0].src = `data:text/html,${this.longdesc}`;
        }
        if(this.checkedProfile) return;
        this.checkedProfile = true;
        this.lastUser = this.reactInst($("#user-profile-modal .header-info-inner .discord-tag")[0].parentNode).memoizedProps.children[0].props.user;
        if(this.lastUser.bot){
            this.onBotProfile(this.lastUser);
        }else{
            this.onUserProfile(this.lastUser);
        }
    }

    checkForPopout(){
        this.noPopout = !$(".userPopout-4pfA0d")[0];
        if(this.noPopout){ // If the profile is open
            this.checkedPopout = false;
            return;
        }
        if(this.checkedPopout || !this.reactInst($(".userPopout-4pfA0d")[0]).memoizedProps.children[1].props.children[1]) return;
        this.checkedPopout = true;
        let user = this.reactInst($(".userPopout-4pfA0d")[0]).memoizedProps.children[1].props.children[1][1].props.user;
        if(user.bot){
            this.onBotPopout(user);
        }else{
            this.onUserPopout(user);
        }
    }
}

class DiscordBotsSettings extends window.DI.React.Component {
    render() {
        return e('div', {},
            e(SettingsOptionToggle, {
                title: 'Enabled',
                lsNode: 'enabled',
                plugin: this.props.plugin,
                defaultValue: true
            }),
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Show information in user pop-outs',
                lsNode: 'popout',
                plugin: this.props.plugin,
                defaultValue: false
            }),
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Enable full description rendering',
                lsNode: 'renderdesc',
                plugin: this.props.plugin,
                defaultValue: false
            }),
            e(SettingsOptionDescription, {
                text: 'Descriptions are rendered in a iframe element. This option is turned off by default to lessen loading unneeded assets.'
            }),
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Use DiscordBots.org instead of bots.discord.pw',
                lsNode: 'usedbl',
                plugin: this.props.plugin,
                defaultValue: false
            }),
            e(SettingsOptionDescription, {
                text: 'DiscordBots.org uses a similar API as bots.discord.pw but adds upvotes, badges for certified developers and bots and does not require a token.'
            }),
            e(SettingsDivider),
            e(SettingsOptionTextbox, {
                title: 'bots.discord.pw Token',
                lsNode: 'bdptoken',
                plugin: this.props.plugin,
                password: true,
                defaultValue: '',
                apply: true,
                onApply: () => {}
            }),
            e(SettingsDivider)
        );
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