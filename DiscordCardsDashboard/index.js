const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");
const req = require("superagent");
const moment = require("moment");
const cm = require('cache-manager');
const cache = cm.caching({store: 'memory', db: 0, ttl: 3600});

Number.prototype.formatNumber = function(){
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

class DiscordCardsDashboard extends Plugin {
    constructor(...args) {
        super(...args);
        this.mo = new MutationObserver(this.check.bind(this));
        this.mo.observe(document.querySelector("#app-mount>div"), { childList: true, subtree: true });
        this.sbind = this.switched.bind(this);
        window.DI.client.on('selectedUpdate', this.sbind);
        window.DI.client.once('ready', ()=>{this.switched({}, {channel:window.DI.client.selectedChannel})});
        this.closed = false;
        this.commandChannel = '275733751814815766';
        this.dashboardChannel = '334811753055518723';
    }

    get configTemplate() {
        return {
            color: '7289da'
        };
    }

    react(node){
        return node[Object.keys(node).find((key) => key.startsWith("__reactInternalInstance"))];
    }

    unload(){
        this.closed = true;
        window.DI.client.removeListener('selectedUpdate', this.sbind);
        this.mo.disconnect();
        document.querySelectorAll(".dc-dashboard-channel").forEach(channel => {
            document.querySelector(".dc-dashboard-channel .icon-3tVJnl").viewBox.baseVal.width = 18;
            document.querySelector(".dc-dashboard-channel .icon-3tVJnl").viewBox.baseVal.height = 18;
            document.querySelector(".dc-dashboard-channel .icon-3tVJnl").innerHTML = `<path class="background-2nyTH_" fill="currentColor" d="M7.92,4.66666667 L6.50666667,4.66666667 L6.98,2 L5.64666667,2 L5.17333333,4.66666667 L2.50666667,4.66666667 L2.27333333,6 L4.94,6 L4.23333333,10 L1.56666667,10 L1.33333333,11.3333333 L4,11.3333333 L3.52666667,14 L4.86,14 L5.33333333,11.3333333 L9.33333333,11.3333333 L8.86,14 L10.1933333,14 L10.6666667,11.3333333 L13.3333333,11.3333333 L13.5666667,10 L12.2333333,10 L8.74333333,10 L5.56666667,10 L6.27333333,6 L7.92,6 L7.92,4.66666667 Z"></path><path class="foreground-2zy1hc" fill="currentColor" fill-rule="nonzero" d="M15.1,3.2 L15.1,2 C15.1,0.88 14.05,0 13,0 C11.95,0 10.9,0.88 10.9,2 L10.9,3.2 C10.45,3.2 10,3.68 10,4.16 L10,6.96 C10,7.52 10.45,8 10.9,8 L15.025,8 C15.55,8 16,7.52 16,7.04 L16,4.24 C16,3.68 15.55,3.2 15.1,3.2 Z M14,3 L12,3 L12,1.92857143 C12,1.35714286 12.4666667,1 13,1 C13.5333333,1 14,1.35714286 14,1.92857143 L14,3 Z"></path>`;
            channel.classList.remove("dc-dashboard-channel");
        });
        $(".dc-flex").remove();
    }

    check() {
        if(this.closed) return;
        if(window.DI.client.channels.get(this.dashboardChannel)
            && window.DI.client.channels.get(this.dashboardChannel).element
            && !window.DI.client.channels.get(this.dashboardChannel).element.classList.contains('dc-dashboard-channel')){
            window.DI.client.channels.get(this.dashboardChannel).element.classList.add('dc-dashboard-channel');
        }
        if(!$(".dc-dashboard-channel .icon-3tVJnl .dash-path")[0] && $(".dc-dashboard-channel")[0]){
            $(".dc-dashboard-channel .icon-3tVJnl")[0].viewBox.baseVal.width = 24;
            $(".dc-dashboard-channel .icon-3tVJnl")[0].viewBox.baseVal.height = 24;
            $(".dc-dashboard-channel .icon-3tVJnl")[0].innerHTML = `<path class="foreground-2zy1hc dash-path" fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>`;
        }
    }

    switched(o, n) {
        if(this.closed) return;
        if(n.channel && n.channel.id === this.dashboardChannel){
            $(".chat>.content").prepend(`<div class="dc-flex"><div class="scroller-wrap"><div class="main-page scroller"></div></div></div>`);
            this.initDash();
        }else{
            $(".dc-flex").remove();
        }
    }

    pickOff(arr, e){
        let a = undefined;
        let v = Object.keys(e)[0]
        arr.map(i=>{
            if(e[v] === i[v]){
                a = i;
            }
        });
        return a;
    }

    initDash() {
        if(this.closed) return;
        $(".main-page").append(`<div class="user-info-viewing cardPrimary-ZVL9Jr card-3DrRmC"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><div class="flexChild-1KGW5q" style="flex: 0 1 auto;"><div class="avatar-xxlarge stop-animation" style="background-image: url(&quot;${window.DI.client.user.displayAvatarURL}&quot;);"></div></div><div class="flexChild-1KGW5q" style="flex: 1 1 auto;"><div class="ui-form-item margin-bottom-20"><h5 class="h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH margin-bottom-4 faded-1KRDbu">Username</h5><div class="view-body selectable-prgIYK">${window.DI.client.user.username}<span style="opacity: 0.5;">#${window.DI.client.user.discriminator}</span></div></div><div class="ui-form-item balance margin-bottom-20">${DomGen.spinner}</div><div class="ui-form-item badges-wrapper"></div></div></div></div>`)
        API.getUser(window.DI.client.user.id).then(res => {
            if(res.text !== ""){
                API.getCards().then(cres => {
                    this.cards = cres.body;
                    return API.getSeries();
                }).then(sres => {
                    this.series = sres.body;
                    return API.getBadges();
                }).then(bres => {
                    this.badges = bres.body;
                    if(!$(".dc-flex")) return;
                    $(".main-page .user-info-viewing .balance")[0].innerHTML = `<h5 class="h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH margin-bottom-4 faded-1KRDbu">Balance</h5><div class="view-body selectable-prgIYK">${res.body.money.formatNumber()}</div><button type="button" class="dc-reload-stats buttonBrandFilledDefault-2Rs6u5 buttonFilledDefault-AELjWf buttonDefault-2OLW-v button-2t3of8 buttonFilled-29g7b5 buttonBrandFilled-3Mv0Ra smallGrow-2_7ZaC user-info-viewing-button"><div class="contentsDefault-nt2Ym5 contents-4L4hQM contentsFilled-3M8HCx contents-4L4hQM">Reload Stats</div></button>`
                    Object.keys(res.body.badges).map(badge => $(".dc-flex .user-info-viewing .badges-wrapper").append(DomGen.badge(badge, this.pickOff(this.badges, {id:badge}).name, res.body.badges[badge])));
                    $(".main-page").append(`<div class="message-group-blocked dc-user-options-box"><div class="message-group-blocked-btn">User Settings</div><div class="dc-user-options" style="display:none;"><div class="flex-vertical marginBottom8-1mABJ4"><div class="flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><h3 class="h3-gDcP8B title-1pmpPr marginReset-3hwONl size16-3IvaX_ height24-2pMcnc weightMedium-13x9Y8 defaultColor-v22dK1 title-3i-5G_ marginReset-3hwONl flexChild-1KGW5q" style="flex: 1 1 auto;">Trades</h3><div class="switchWrapperDefaultActive-2IdHq2 switchWrapperDefault-3GSsCS switchWrapper-3sSQdm flexChild-1KGW5q" style="flex: 0 0 auto;"><input type="checkbox" class="checkbox-1KYsPm dc-trades" value="on"><div class="switch-3lyafC"></div></div></div></div></div><div class="flex-vertical"><div class="flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><h3 class="h3-gDcP8B title-1pmpPr marginReset-3hwONl size16-3IvaX_ height24-2pMcnc weightMedium-13x9Y8 defaultColor-v22dK1 title-3i-5G_ marginReset-3hwONl flexChild-1KGW5q" style="flex: 1 1 auto;">Notifications</h3><div class="switchWrapperDefaultActive-2IdHq2 switchWrapperDefault-3GSsCS switchWrapper-3sSQdm flexChild-1KGW5q" style="flex: 0 0 auto;"><input type="checkbox" class="checkbox-1KYsPm dc-notifs" value="on"><div class="switch-3lyafC"></div></div></div></div></div></div></div><div class="message-group-blocked dc-inventory-box"><div class="message-group-blocked-btn">Inventory</div><div class="dc-inv scroller-wrap" style="display: none;"><div class="dc-inv-inner scroller"></div></div></div><div class="message-group-blocked dc-cs-box"><div class="message-group-blocked-btn">Card Search</div><iframe style="display: none;" width="495" height="400"></iframe></div>`);
                    Object.keys(res.body.inv).map(c=>{
                        if(res.body.inv[c]) $(".dc-inv-inner").append(`<div class="dc-card"><div class="tooltip tooltip-top tooltip-normal">${c.startsWith("pack") ? `Card Pack #${c.slice(4)} - ${this.pickOff(this.series, {id:c.slice(4)}).name}` : `#${c} - ${this.pickOff(this.cards, {id:c}).name}`}</div><img draggable=false src="${c.startsWith("pack") ? `https://discord.cards/i/s/${c.slice(4)}.png` : `https://discord.cards/i/c/${c}.png`}"><p>${res.body.inv[c]}x</p></div>`)
                    });
                    $(".dc-cs-box iframe")[0].src = `https://lookup.discord.cards/cards/`;
                    $(".dc-inv-inner").scroll(() => {
                        if(!$(".dc-card:hover")[0]) return;
                        let u = $(".dc-card:hover").children(".tooltip");
                        u.css({
                            'margin-left': `-${(u[0].getBoundingClientRect().width-70)/2}px`,
                            'margin-top': `-${u[0].getBoundingClientRect().height+$(".dc-inv-inner")[0].scrollTop+2}px`
                        });
                    });
                    $(".dc-card").mouseover(() => {
                        let u = $(".dc-card:hover").children(".tooltip");
                        u.css({
                            'margin-left': `-${(u[0].getBoundingClientRect().width-70)/2}px`,
                            'margin-top': `-${u[0].getBoundingClientRect().height+$(".dc-inv-inner")[0].scrollTop+2}px`
                        });
                    });
                    $(".dc-badge").mouseover(() => {
                        let u = $(".dc-badge:hover").children(".tooltip");
                        u.css({
                            'margin-left': `-${(u[0].getBoundingClientRect().width-75)/2}px`,
                            'margin-top': `-${u[0].getBoundingClientRect().height+2}px`
                        });
                    });
                    if(res.body.settings.trades){
                        $(".dc-user-options input.checkbox-1KYsPm.dc-trades")[0].checked = true;
                        $(".dc-user-options input.checkbox-1KYsPm.dc-trades+.switch-3lyafC").addClass("checked-7qfgSb");
                    }
                    if(res.body.settings.notifs){
                        $(".dc-user-options input.checkbox-1KYsPm.dc-notifs")[0].checked = true;
                        $(".dc-user-options input.checkbox-1KYsPm.dc-notifs+.switch-3lyafC").addClass("checked-7qfgSb");
                    }
                    $(".dc-user-options-box .message-group-blocked-btn").click(() => {
                        if($(".dc-user-options")[0].style.display === "none"){
                            $(".dc-user-options").css('display', 'block');
                        }else{
                            $(".dc-user-options").css('display', 'none');
                        }
                    });
                    $(".dc-inventory-box .message-group-blocked-btn").click(() => {
                        if($(".dc-inv")[0].style.display === "none"){
                            $(".dc-inv").css('display', 'block');
                        }else{
                            $(".dc-inv").css('display', 'none');
                        }
                    });
                    $(".dc-cs-box .message-group-blocked-btn").click(() => {
                        if($(".dc-cs-box iframe")[0].style.display === "none"){
                            $(".dc-cs-box iframe").css('display', 'block');
                        }else{
                            $(".dc-cs-box iframe").css('display', 'none');
                        }
                    });
                    $(".dc-user-options input.checkbox-1KYsPm.dc-trades").click(()=>{
                        if(!$(".dc-user-options input.checkbox-1KYsPm.dc-trades")[0].checked){
                            $(".dc-user-options input.checkbox-1KYsPm.dc-trades+.switch-3lyafC").removeClass("checked-7qfgSb");
                            window.DI.client.channels.get(this.commandChannel).send("[]set trades off");
                        }else{
                            $(".dc-user-options input.checkbox-1KYsPm.dc-trades+.switch-3lyafC").addClass("checked-7qfgSb");
                            window.DI.client.channels.get(this.commandChannel).send("[]set trades on");
                        }
                    });
                    $(".dc-user-options input.checkbox-1KYsPm.dc-notifs").click(()=>{
                        if(!$(".dc-user-options input.checkbox-1KYsPm.dc-notifs")[0].checked){
                            $(".dc-user-options input.checkbox-1KYsPm.dc-notifs+.switch-3lyafC").removeClass("checked-7qfgSb");
                            window.DI.client.channels.get(this.commandChannel).send("[]set notifs off");
                        }else{
                            $(".dc-user-options input.checkbox-1KYsPm.dc-notifs+.switch-3lyafC").addClass("checked-7qfgSb");
                            window.DI.client.channels.get(this.commandChannel).send("[]set notifs on");
                        }
                    });
                    $(".dc-flex .user-info-viewing .balance button.dc-reload-stats").click(() => {
                        this.log("Reloading stats...");
                        $(".dc-flex .dc-reload-stats").prepend(DomGen.spinner);
                        req.get("https://api.discord.cards/list/cards").then(cres => {
                            this.cards = cres.body;
                            cache.set("CARDS", cres);
                            return req.get("https://api.discord.cards/list/series")
                        }).then(sres => {
                            this.series = sres.body;
                            cache.set("SERIES", sres);
                            return req.get("https://api.discord.cards/list/badges")
                        }).then(bres => {
                            this.badges = bres.body;
                            cache.set("BADGES", bres);
                            return req.get(`https://api.discord.cards/user/${window.DI.client.user.id}`)
                        }).then(res => {
                            cache.set(`USER_${window.DI.client.user.id}`, res);
                            if(!$(".dc-flex")) return;
                            $(".dc-flex .user-info-viewing .balance .view-body").html(res.body.money.formatNumber());
                            $(".dc-user-options input.checkbox-1KYsPm.dc-trades")[0].checked = false;
                            $(".dc-user-options input.checkbox-1KYsPm.dc-notifs")[0].checked = false;
                            $(".dc-user-options input.checkbox-1KYsPm+.switch-3lyafC").removeClass("checked-7qfgSb");
                            $(".dc-flex .user-info-viewing .badges-wrapper").empty();
                            $(".dc-inv-inner").empty();
                            Object.keys(res.body.badges).map(badge => $(".dc-flex .user-info-viewing .badges-wrapper").append(DomGen.badge(badge, this.pickOff(this.badges, {id:badge}).name, res.body.badges[badge])));
                            Object.keys(res.body.inv).map(c=>{
                                if(res.body.inv[c]) $(".dc-inv-inner").append(`<div class="dc-card"><div class="tooltip tooltip-top tooltip-normal">${c.startsWith("pack") ? `Card Pack #${c.slice(4)} - ${this.pickOff(this.series, {id:c.slice(4)}).name}` : `#${c} - ${this.pickOff(this.cards, {id:c}).name}`}</div><img draggable=false src="${c.startsWith("pack") ? `https://discord.cards/i/s/${c.slice(4)}.png` : `https://discord.cards/i/c/${c}.png`}"><p>${res.body.inv[c]}x</p></div>`)
                            });
                            if(res.body.settings.trades){
                                $(".dc-user-options input.checkbox-1KYsPm.dc-trades")[0].checked = true;
                                $(".dc-user-options input.checkbox-1KYsPm.dc-trades+.switch-3lyafC").addClass("checked-7qfgSb");
                            }
                            if(res.body.settings.notifs){
                                $(".dc-user-options input.checkbox-1KYsPm.dc-notifs")[0].checked = true;
                                $(".dc-user-options input.checkbox-1KYsPm.dc-notifs+.switch-3lyafC").addClass("checked-7qfgSb");
                            }
                            $(".dc-flex .dc-reload-stats .spinner-inner").remove();
                        });
                    });
                });
            }else{
                $(".dc-flex .user-info-viewing .balance")[0].innerHTML = `<h1 class="view-body selectable-prgIYK">Couldn't find an account.</h1><button type="button" class="buttonBrandFilledDefault-2Rs6u5 buttonFilledDefault-AELjWf buttonDefault-2OLW-v button-2t3of8 buttonFilled-29g7b5 buttonBrandFilled-3Mv0Ra smallGrow-2_7ZaC user-info-viewing-button"><div class="contentsDefault-nt2Ym5 contents-4L4hQM contentsFilled-3M8HCx contents-4L4hQM">Create an account</div></button>`
                $(".dc-flex .user-info-viewing .balance button").click(() => {
                    window.DI.client.channels.get(this.commandChannel).send("[]stats").then(() => {
                        $(".dc-flex").empty();
                        this.initDash();
                    });
                });
            }
        })
    }
}

class DomGen {
    static badge(id,name,time){return `<div class="dc-badge" style="background-image:url('https://discord.cards/i/b/${id}.png')"><div class="tooltip tooltip-top tooltip-normal">${name} Badge, obtained in ${moment(time).format("LL")}</div></div>`}
    static get spinner(){return `<span class="spinner-inner spinner-wandering-cubes"><span class="spinner-item"></span><span class="spinner-item"></span></span>`}
}

const cacherequest = (id,url,token)=>{
    return new Promise((rs,rj)=>{
        setTimeout(()=>{
            cache.wrap(id, function(cb) {
                 req.get(url).set('User-Agent', 'DiscordCardsDashboard Plugin (https://github.com/DiscordInjections/Plugins/tree/master/DiscordCardsDashboard)').then(res=>cb(null,res)).catch(cb)
            }, (err, data)=>{
                if(err) rj(err);
                rs(data);
            });
        }, 100);
    });
};

class API {
    static getUser(id){ return cacherequest(`USER_${id}`, `https://api.discord.cards/user/${id}`) }
    static getCards(){ return cacherequest(`CARDS`, `https://api.discord.cards/list/cards`) }
    static getSeries(){ return cacherequest(`SERIES`, `https://api.discord.cards/list/series`) }
    static getBadges(){ return cacherequest(`BADGES`, `https://api.discord.cards/list/badges`) }
}

module.exports = DiscordCardsDashboard;
