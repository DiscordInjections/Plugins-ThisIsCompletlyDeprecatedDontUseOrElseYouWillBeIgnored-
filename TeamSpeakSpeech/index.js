const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");

class TeamSpeakSpeech extends Plugin {
    constructor() {
        super({
            author: 'Snazzah',
            version: '1.0.0',
            description: 'Use TeamSpeak-eqsue speech notifications.',
            color: '425f80'
        });
        this.trackSlider = 0;
        this.optionsInit = false;
        this.optionHTML = $(`<div class="margin-bottom-40 tss-options"><h5 class="h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4">TeamSpeak Speech Plugin</h5><div class="flex-vertical marginBottom8-1mABJ4"><div class="flex-lFgbSz flex-3B1Tl4 vertical-3X17r5 flex-3B1Tl4 directionColumn-2h-LPR justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><div class="flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO" style="flex: 1 1 auto;"><h3 class="h3-gDcP8B title-1pmpPr marginReset-3hwONl size16-3IvaX_ height24-2pMcnc weightMedium-13x9Y8 defaultColor-v22dK1 title-3i-5G_ marginReset-3hwONl flexChild-1KGW5q" style="flex: 1 1 auto;">Enable TeamSpeak-esque Speech Notifications</h3><div class="switchWrapperDefaultActive-2IdHq2 switchWrapperDefault-3GSsCS switchWrapper-3sSQdm flexChild-1KGW5q" style="flex: 0 0 auto;"><input type="checkbox" class="checkbox-1KYsPm" value="on"><div class="switch-3lyafC"></div></div></div></div></div><div class="flexChild-1KGW5q" style="flex: 1 1 auto;"><h5 class="h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH margin-bottom-4">Volume</h5><div class="slider-2e2iXJ"><input type="number" class="input-27JrJm tss-volume-slider" value="100" readonly=""><div class="track-1h2wOF"></div><div class="bar-2cFRGz"><div class="barFill-18ABna" style="width: 100%;"></div></div><div class="track-1h2wOF"><div class="grabber-1TZCZi" style="left: 100%;"><span class="bubble-17BwqU elevationHigh-3lNfp9">100%</span></div></div></div></div><div class="flexChild-1KGW5q" style="flex: 1 1 auto;"><h5 class="h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH margin-bottom-4">Speech Rate</h5><div class="slider-2e2iXJ"><input type="number" class="input-27JrJm tss-rate-slider" value="100" readonly=""><div class="track-1h2wOF"></div><div class="bar-2cFRGz"><div class="barFill-18ABna" style="width: 100%;"></div></div><div class="track-1h2wOF"><div class="grabber-1TZCZi" style="left: 100%;"><span class="bubble-17BwqU elevationHigh-3lNfp9">100%</span></div></div></div></div><div class="flexChild-1KGW5q" style="flex: 1 1 auto;"><h5 class="h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH margin-bottom-4">Pitch</h5><div class="slider-2e2iXJ"><input type="number" class="input-27JrJm tss-pitch-slider" value="100" readonly=""><div class="track-1h2wOF"></div><div class="bar-2cFRGz"><div class="barFill-18ABna" style="width: 100%;"></div></div><div class="track-1h2wOF"><div class="grabber-1TZCZi" style="left: 100%;"><span class="bubble-17BwqU elevationHigh-3lNfp9">100%</span></div></div></div><div class="divider-1G01Z9 divider-2nTTsf marginTop20-3UscxH"></div></div>`);
        window.client.on('voiceStateUpdate', this.onVoiceUpdate.bind(this));
        this.mo = new MutationObserver((changes, _) => {
          this.injectOptionHTML();
        });
        this.load();
        this.mo.observe($(".app>*:first-child")[0], { childList: true, subtree: true });
        window.addEventListener('mouseup', ()=>{
            if(this.trackSlider>0){
                $('.layer')[1].style.cursor = null;
                this.save();
                this.trackSlider = 0;
            }
        }, false);
        window.addEventListener('mousemove', e=>{
            if(this.trackSlider === 0) return;
            let grabber = $('.tss-options .grabber-1TZCZi')[this.trackSlider-1];
            let realvalue = e.clientX-grabber.parentNode.getBoundingClientRect().left;
            if(realvalue < 0){
                realvalue = 0;
            };
            if(realvalue > grabber.parentNode.getBoundingClientRect().width){
                realvalue = grabber.parentNode.getBoundingClientRect().width;
            };
            let value = Math.round(((200/grabber.parentNode.getBoundingClientRect().width)*realvalue)*2)/2;
            grabber.parentNode.parentNode.childNodes[0].outerHTML = `<input type="number" class="${grabber.parentNode.parentNode.childNodes[0].className}" value="${value/2}" readonly="">`;
            grabber.parentNode.parentNode.childNodes[2].childNodes[0].style.width = `${value/2}%`;
            grabber.childNodes[0].innerText = `${value}%`;
            grabber.style.left = `${value/2}%`;

            this.settings[grabber.parentNode.parentNode.childNodes[0].classList[1].split("-")[1]] = value/100;
        }, false);
    }

    load() {
        this.settings = $.extend({}, {enabled:true,volume:1,rate:1,pitch:1}, JSON.parse($localStorage.getItem("TeamSpeakSpeech")));
        this.save();
    }

    save() {
        $localStorage.setItem("TeamSpeakSpeech", JSON.stringify(this.settings));
    }

    VC() {
        window.client.channels.get(this.currentVC);
    }

    onVoiceUpdate(oldMember,newMember) {
        if(!this.settings.enabled) return;
        if(oldMember.user.id === window.client.user.id || newMember.user.id === window.client.user.id){
            if(!oldMember.voiceChannel && newMember.voiceChannel){ // Client joins a new channel
                this.speak("Connected");
                this.currentVC = newMember.voiceChannel.id;
            }else if(oldMember.voiceChannel && !newMember.voiceChannel){ // Client disconnects from channel
                this.speak("Disconnected");
                this.currentVC = null;
            }else if(oldMember.voiceChannel.id !== newMember.voiceChannel.id){ // Client switches channels
                this.speak("Channel switched");
                this.currentVC = newMember.voiceChannel.id;
            }
        }
        if(!this.currentVC) return;
        if(oldMember.user.id !== window.client.user.id && newMember.user.id !== window.client.user.id ){
            if(!oldMember.voiceChannel && newMember.voiceChannel && newMember.voiceChannel.id !== this.currentVC) return;
            if(oldMember.voiceChannel && oldMember.voiceChannel.id !== this.currentVC && !newMember.voiceChannel) return;
            if(!oldMember.voiceChannel && newMember.voiceChannel && newMember.voiceChannel.id === this.currentVC){
                this.speak("User joined your channel");
            }else if(oldMember.voiceChannel && oldMember.voiceChannel.id === this.currentVC && !newMember.voiceChannel){
                this.speak("User left your channel");
            }else if(oldMember.voiceChannel.id !== this.currentVC && newMember.voiceChannel.id === this.currentVC){ // User joined to channel
                this.speak("User joined your channel");
            }else if(oldMember.voiceChannel.id === this.currentVC && newMember.voiceChannel.id !== this.currentVC){ // User joined another channel
                this.speak("User left your channel");
            }
        }
    }

    injectOptionHTML() {
        if($(".app>*:first-child")[0].childNodes.length !== 2) return; // Is in the Options Menu
        if(!$(".itemDefaultSelected-1UAWLe.item-3879bf.selected-eNoxEK")[0]) return;
        if($(".itemDefaultSelected-1UAWLe.item-3879bf.selected-eNoxEK").html() !== "Voice") return; // Is in the Voice Section
        if($(".tss-options")[0]) return; // Don't initiate if it's already there
        this.optionHTML.insertBefore(".ui-form-item:last-child");
        if(this.settings.enabled){
            $(".tss-options input.checkbox-1KYsPm")[0].checked = true;
            $(".tss-options .switch-3lyafC").addClass("checked-7qfgSb");
        }
        let vs = $(".tss-options .tss-volume-slider")[0]
        vs.parentNode.childNodes[2].childNodes[0].style.width = `${this.settings.volume*50}%`;
        vs.parentNode.childNodes[3].childNodes[0].childNodes[0].innerText = `${this.settings.volume*100}%`;
        vs.parentNode.childNodes[3].childNodes[0].style.left = `${this.settings.volume*50}%`;
        vs.outerHTML = `<input type="number" class="${vs.className}" value="${this.settings.volume*100}" readonly="">`;
        let rs = $(".tss-options .tss-rate-slider")[0]
        rs.parentNode.childNodes[2].childNodes[0].style.width = `${this.settings.rate*50}%`;
        rs.parentNode.childNodes[3].childNodes[0].childNodes[0].innerText = `${this.settings.rate*100}%`;
        rs.parentNode.childNodes[3].childNodes[0].style.left = `${this.settings.rate*50}%`;
        rs.outerHTML = `<input type="number" class="${rs.className}" value="${this.settings.rate*100}" readonly="">`;
        let ps = $(".tss-options .tss-pitch-slider")[0]
        ps.parentNode.childNodes[2].childNodes[0].style.width = `${this.settings.pitch*50}%`;
        ps.parentNode.childNodes[3].childNodes[0].childNodes[0].innerText = `${this.settings.pitch*100}%`;
        ps.parentNode.childNodes[3].childNodes[0].style.left = `${this.settings.pitch*50}%`;
        ps.outerHTML = `<input type="number" class="${ps.className}" value="${this.settings.pitch*100}" readonly="">`;
        if(this.optionsInit) return;
        $(".tss-options input.checkbox-1KYsPm").click(()=>{
            if(this.settings.enabled){
                $(".tss-options .switch-3lyafC").removeClass("checked-7qfgSb");
                this.settings.enabled = false;
                this.log("Saving as false...");
                this.save();
            }else{
                $(".tss-options .switch-3lyafC").addClass("checked-7qfgSb");
                this.settings.enabled = true;
                this.log("Saving as true...");
                this.save();
            }
        });
        $(".tss-options .grabber-1TZCZi").mousedown(e=>{
            let type = e.target.parentNode.parentNode.childNodes[0].classList[1];
            e.target.parentNode.parentNode.parentNode.parentNode.childNodes.forEach((v,k)=>{
                if(v.className!=="flexChild-1KGW5q") return;
                if(v.childNodes[1].childNodes[0].classList[1]===type) this.trackSlider = k-1;
            });
            $('.layer')[1].style.cursor = "ew-resize";
        });
        this.optionsInit = true;
    }

    speak(text) {
        var speech = new SpeechSynthesisUtterance(text);
        var voices = window.speechSynthesis.getVoices();
        
        speech.volume = this.settings.volume;
        speech.rate   = this.settings.rate;
        speech.pitch  = this.settings.pitch;
        speech.voice  = window.speechSynthesis.getVoices()[0];
        
        window.speechSynthesis.speak(speech);
    }
}

module.exports = TeamSpeakSpeech;