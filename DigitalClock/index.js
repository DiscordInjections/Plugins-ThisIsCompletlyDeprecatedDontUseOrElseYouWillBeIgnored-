const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");

class DigitalClock extends Plugin {
    constructor(...args) {
        super(...args);
        this.optionHTML = $(`<div class="clockplugin-options"><h2 class="h2-2ar_1B title-1pmpPr size16-3IvaX_ height20-165WbF weightSemiBold-T8sxWH defaultColor-v22dK1 margin-top-60 margin-bottom-20">DigitalClock Plugin</h2><div class="flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO switchItem-1uofoz marginBottom20-2Ifj-2" style="flex: 1 1 auto;"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><h3 class="h3-gDcP8B title-1pmpPr marginReset-3hwONl size16-3IvaX_ height24-2pMcnc weightMedium-13x9Y8 defaultColor-v22dK1 title-3i-5G_ marginReset-3hwONl flexChild-1KGW5q" style="flex: 1 1 auto;">Enabled</h3><div class="switchWrapperDefaultActive-2IdHq2 switchWrapperDefault-3GSsCS switchWrapper-3sSQdm flexChild-1KGW5q" style="flex: 0 0 auto;"><input type="checkbox" class="checkbox-1KYsPm clockplugin-enabled" value="on"><div class="switch-3lyafC"></div></div></div><div class="divider-1G01Z9 divider-2nTTsf marginTop20-3UscxH"></div></div><div class="flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO switchItem-1uofoz marginBottom20-2Ifj-2" style="flex: 1 1 auto;"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><h3 class="h3-gDcP8B title-1pmpPr marginReset-3hwONl size16-3IvaX_ height24-2pMcnc weightMedium-13x9Y8 defaultColor-v22dK1 title-3i-5G_ marginReset-3hwONl flexChild-1KGW5q" style="flex: 1 1 auto;">24-hour clock</h3><div class="switchWrapperDefaultActive-2IdHq2 switchWrapperDefault-3GSsCS switchWrapper-3sSQdm flexChild-1KGW5q" style="flex: 0 0 auto;"><input type="checkbox" class="checkbox-1KYsPm clockplugin-24" value="on"><div class="switch-3lyafC"></div></div></div><div class="divider-1G01Z9 divider-2nTTsf marginTop20-3UscxH"></div></div></div>`);
        this.mo = new MutationObserver((changes, _) => {
            this.injectOptionHTML();
        });
        this.load();
        this.mo.observe($("[data-reactroot]")[0], { childList: true, subtree: true });

        if(this.settings.enabled){
            this.clock = $("<div/>", { id: "clockPluginClock" });
            $("body").append(this.clock);
        }
        this.ticktock();
        this.interval = setInterval(this.ticktock.bind(this), 1000);
    }

    pad(x) { return x < 10 ? '0'+x : x; }

    load() {
        this.settings = $.extend({}, {enabled:true,use24:false}, JSON.parse(window.DI.localStorage.getItem("DigitalClockPlugin")));
        this.save();
    }

    save() { window.DI.localStorage.setItem("DigitalClockPlugin", JSON.stringify(this.settings)); }

    ticktock() {
        if(this.clock && this.settings.enabled) {
            if(this.settings.use24) {
                this.ticktock24();
            }else{
                this.ticktock12();
            }
        }
    }

    ticktock24() {
        var d = new Date();
        var h = this.pad(d.getHours());
        var m = this.pad(d.getMinutes());
        var s = this.pad(d.getSeconds());
        var current_time = [h,m,s].join(':');
        this.clock.html(current_time);
    }

    ticktock12() {
        var suffix = " AM";
        var d = new Date();
        var h = d.getHours();
        var m = this.pad(d.getMinutes());
        var s = this.pad(d.getSeconds());

        if(h >= 12) {
            h -= 12;
            suffix = " PM";
        }
        if(h == 0) {
            h = 12;
        }

        h = this.pad(h);

        var current_time = [h,m,s].join(":") + suffix;
        this.clock.html(current_time);
    }

    unload() {
        this.mo.disconnect();
        clearInterval(this.interval);
        this.clock.remove();
    }

    injectOptionHTML() {
        if($(".app>*:first-child")[0].childNodes.length !== 2) return; // Is in the Options Menu
        if(!$(".itemDefaultSelected-1UAWLe.item-3879bf.selected-eNoxEK")[0]) return;
        if($(".itemDefaultSelected-1UAWLe.item-3879bf.selected-eNoxEK").html() !== "Appearance") return; // Is in the Voice Section
        if($(".clockplugin-options")[0]) return; // Don't initiate if it's already there
        $(".user-settings-appearance>.flex-vertical").append(this.optionHTML);
        if(this.settings.enabled){
            $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-enabled")[0].checked = true;
            $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-enabled+.switch-3lyafC").addClass("checked-7qfgSb");
        }
        if(this.settings.use24){
            $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-24")[0].checked = true;
            $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-24+.switch-3lyafC").addClass("checked-7qfgSb");
        }
        $(".clockplugin-options input.inputDefault-Y_U37D").val(this.settings.bdptoken);
        if(this.optionsInit) return;
        $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-enabled").click(()=>{
            if(this.settings.enabled){
                $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-enabled+.switch-3lyafC").removeClass("checked-7qfgSb");
                this.settings.enabled = false;
                this.clock.remove();
                this.clock = null;
                this.log("Saving 'enabled' as false...");
                this.save();
            }else{
                $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-enabled+.switch-3lyafC").addClass("checked-7qfgSb");
                this.settings.enabled = true;
                this.clock = $("<div/>", { id: "clockPluginClock" });
                $("body").append(this.clock);
                this.log("Saving 'enabled' as true...");
                this.save();
            }
        });
        $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-24").click(()=>{
            if(this.settings.use24){
                $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-24+.switch-3lyafC").removeClass("checked-7qfgSb");
                this.settings.use24 = false;
                this.log("Saving 'use24' as false...");
                this.save();
            }else{
                $(".clockplugin-options input.checkbox-1KYsPm.clockplugin-24+.switch-3lyafC").addClass("checked-7qfgSb");
                this.settings.use24 = true;
                this.log("Saving 'use24' as true...");
                this.save();
            }
            clearInterval(this.interval);
            this.interval = setInterval(this.ticktock.bind(this), 1000);
        });
        this.optionsInit = true;
    }
}

module.exports = DigitalClock;