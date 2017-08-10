const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");
const e = window.DI.React.createElement;
const { SettingsDivider, SettingsOptionToggle, SettingsOptionTitle, SettingsOptionTextbox, SettingsOptionDescription, SettingsOptionButton } = window.DI.require('./Structures/Components');

class BFRedux extends Plugin {
    constructor(...args) {
        super(...args);
        this.isOpen = false
        this.hasUpdate = false
        this.remoteVersion = ""
        this.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
        this.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ{|}";
        this.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
        this.upsideDownList = " ¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{";
        this.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";

        this.toolbarString = "<div class='bf-toolbar'><div class='bf-arrow'></div><div data-type='discord' data-name='bold'><b>Bold</b></div><div data-type='discord' data-name='italic'><i>Italic</i></div><div data-type='discord' data-name='underline'><u>Underline</u></div><div data-type='discord' data-name='strikethrough'><s>Strikethrough</s></div><div style='font-family:Consolas,Liberation Mono,Menlo,Courier,monospace;' data-type='discord' data-name='code'>Code</div><div data-type='bfredux' data-name='superscript'>ˢᵘᵖᵉʳˢᶜʳᶦᵖᵗ</div><div data-type='bfredux' data-name='smallcaps'>SᴍᴀʟʟCᴀᴘs</div><div data-type='bfredux' data-name='fullwidth'>Ｆｕｌｌｗｉｄｔｈ</div><div data-type='bfredux' data-name='upsidedown'>uʍopǝpᴉsd∩</div><div data-type='bfredux' data-name='varied'>VaRiEd CaPs</div></div></div>";
        
        this.discordWrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`"}

        this.defaultSettings = {wrappers: {superscript: "^", smallcaps: "%", fullwidth: "##", upsidedown: "&&", varied: "||"},
                                formatting: {fullWidthMap: true, reorderUpsidedown: true, startCaps: true},
                                plugin: {hoverOpen: true, closeOnSend: true, chainFormats: true},
                                style: {rightSide: true, opacity: 1, fontSize: "85%"}}

        if(Object.keys(this.settings).length === 0) this.settings = this.defaultSettings;
                        
        this.customWrappers = Object.keys(this.settings.wrappers);

        this.loadSettings();
        this.mo = new MutationObserver(this.init.bind(this));
        this.mo.observe(document.querySelector("[data-reactroot]"), { childList: true, subtree: true });
        window.DI.DISettings.registerSettingsTab(this, 'Better Formatting Redux', BFSettings);
    }

    init() {
        if(document.querySelector(".bf-toolbar")) return;
        let ta = $(".channelTextArea-1HTP3C textarea");
        if(!ta) return;
        this.addToolbar(ta);
    }

    loadSettings() {
        $.extend({}, this.setting, JSON.parse(window.DI.localStorage.getItem("BFPlugin")));
    }

    saveSettings() {
        window.DI.localStorage.setItem("BFPlugin", JSON.stringify(this.settings));
    }
    
    escape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    
    unload() {
        this.mo.disconnect();
        $(document).add("*").off("BFRedux");
        $(".bf-toolbar").remove();
    }
    
    
    observer(e) {
        if (!e.addedNodes.length) return;

        var $elem = $(e.addedNodes[0]);
        
        if ($elem.find(".channelTextArea-1HTP3C").length || $elem.closest(".channelTextArea-1HTP3C").length) {
            var $textarea = $elem.find("textarea");
            this.addToolbar($textarea);
        }
    }

    updateStyle() {
        this.updateSide();
        this.updateOpacity();
        this.updateFontSize();
    }
    
    updateSide() {
        if (this.settings.style.rightSide) { $(".bf-toolbar").removeClass("bf-left") }
        else { $(".bf-toolbar").addClass("bf-left") }
    }
    
    updateOpacity() {
        $(".bf-toolbar").css("opacity", this.settings.style.opacity)
    }

    updateFontSize() {
        $(".bf-toolbar").css("font-size", this.settings.style.fontSize)
    }
    
    openClose() {
        this.isOpen = !this.isOpen;
        $(".bf-toolbar").toggleClass('bf-visible');
    }
    
    doFormat(text, wrapper, offset) {

        // If this is not a wrapper, return original
        if (text.substring(offset, offset+wrapper.length) != wrapper) return text;
        
        var returnText = text, len = text.length
        var begin = text.indexOf(wrapper, offset);
        
        if (text[begin-1] == "\\") return text; // If the wrapper is escaped, remove the backslash and return the text
        
        var end = text.indexOf(wrapper, begin + wrapper.length);
        if (end != -1) end += wrapper.length-1;
        
        // Making it to this point means that we have found a full wrapper
        // This block performs inner chaining
        if (this.settings.plugin.chainFormats) {
            for (var w=0; w<this.customWrappers.length; w++) {
                var newText = this.doFormat(returnText, this.settings.wrappers[this.customWrappers[w]], begin+wrapper.length);
                if (returnText != newText) {
                    returnText = newText;
                    end = end - this.settings.wrappers[this.customWrappers[w]].length*2
                }
            }
        }
        
        returnText = returnText.replace(new RegExp(`([^]{${begin}})${this.escape(wrapper)}([^]*)${this.escape(wrapper)}([^]{${len - end - 1}})`), (match, before, middle, after) => {
            var letterNum = 0;
            var previousLetter = "";
            middle = middle.replace(/./g, letter => {
                var index = this.replaceList.indexOf(letter);
                letterNum += 1;
                if (wrapper == this.settings.wrappers.fullwidth) {
                    if (this.settings.formatting.fullWidthMap) return index != -1 ? this.fullwidthList[index] : letter;
                    else return index != -1 ? letterNum == middle.length ? letter.toUpperCase() : letter.toUpperCase() + " " : letter;
                }
                else if (wrapper == this.settings.wrappers.superscript) {return index != -1 ? this.superscriptList[index] : letter;}
                else if (wrapper == this.settings.wrappers.smallcaps) {return index != -1 ? this.smallCapsList[index] : letter;}
                else if (wrapper == this.settings.wrappers.upsidedown) {return index != -1 ? this.upsideDownList[index] : letter;}
                else if (wrapper == this.settings.wrappers.varied) {
                    var compare = this.settings.formatting.startCaps ? 1 : 0;
                    if (letter.toLowerCase() == letter.toUpperCase()) letterNum = letterNum - 1;
                    return index != -1 ? letterNum % 2 == compare ? letter.toUpperCase() : letter.toLowerCase() : letter;
                }
                else {return letter;}
                previousLetter = letter;
            })
            if (wrapper == this.settings.wrappers.upsidedown && this.settings.formatting.reorderUpsidedown) return before + middle.split("").reverse().join("") + after;
            else return before + middle + after;
        });
        
        return returnText;
    }
    
    format(e) {
        if (e.shiftKey || e.which != 13) return;
        var textarea = $(e.currentTarget);
        var text = textarea.val();
        for (var i = 0; i < text.length; i++) {
            if (text[i] == "`") {
                next = text.indexOf("`", i + 1);
                if (next != -1)
                    i = next;
            }
            else if (text[i] == "@") {
                var match = /@.*#[0-9]*/.exec(text.substring(i))
                if(match && match.index == 0) i += match[0].length - 1;
            }
            else {
                for (var w=0; w<this.customWrappers.length; w++) {
                    var newText = this.doFormat(text, this.settings.wrappers[this.customWrappers[w]], i);
                    if (text != newText) {
                        text = newText;
                        i = i - this.settings.wrappers[this.customWrappers[w]].length*2
                    }
                }
            }
        }
        textarea.val(text);
        textarea[0].dispatchEvent(new Event('input', { bubbles: true }))
        if (this.settings.plugin.closeOnSend) $(".bf-toolbar").removeClass('bf-visible');
    }
    
    wrapSelection(textarea, wrapper) {
        var text = textarea.value;
        var start = textarea.selectionStart;
        var len = text.substring(textarea.selectionStart, textarea.selectionEnd).length;
        text = wrapper + text.substring(textarea.selectionStart, textarea.selectionEnd) + wrapper;
        textarea.focus();
        document.execCommand("insertText", false, text);
        textarea.selectionEnd = (textarea.selectionStart = start + wrapper.length) + len;
    }
    
    addToolbar(textarea) {
        var hoverInterval;
        var toolbarElement = $(this.toolbarString)
        if (this.settings.plugin.hoverOpen == true) toolbarElement.addClass("bf-hover");
        if (this.isOpen) toolbarElement.addClass("bf-visible");
        
        textarea.on("keypress.BFRedux", (e) => {this.format(e)})
            .parent().after(toolbarElement)
            .siblings(".bf-toolbar")
            .on("mousemove.BFRedux", (e) => {
                var $this = $(e.currentTarget);
                var pos = e.pageX - $this.parent().offset().left;
                var diff = -$this.width();
                $this.children().each((index, elem) => {
                    diff += $(elem).outerWidth();
                });
                $this.scrollLeft(pos / $this.width() * diff);
            })
            .on("click.BFRedux", "div", (e) => {
                var button = $(e.currentTarget);
                if (button.hasClass("bf-arrow")) {
                    if (!this.settings.plugin.hoverOpen) this.openClose();
                }
                else {
                    var wrapper = "";
                    if (button.data("type") == "discord") wrapper = this.discordWrappers[button.data("name")];
                    else wrapper = this.settings.wrappers[button.data("name")];
                    this.wrapSelection(textarea[0], wrapper);   
                }
            })
        this.updateStyle()
    }

    settingsChanged(){
        let settings = this.settings;
        settings.wrappers.superscript = settings.wrappers.superscript != "" ? settings.wrappers.superscript : this.defaultSettings.wrappers.superscript;
        settings.wrappers.smallcaps = settings.wrappers.smallcaps != "" ? settings.wrappers.smallcaps : this.defaultSettings.wrappers.smallcaps;
        settings.wrappers.fullwidth = settings.wrappers.fullwidth != "" ? settings.wrappers.fullwidth : this.defaultSettings.wrappers.fullwidth;
        settings.wrappers.upsidedown = settings.wrappers.upsidedown != "" ? settings.wrappers.upsidedown : this.defaultSettings.wrappers.upsidedown;
        settings.wrappers.varied = settings.wrappers.varied != "" ? settings.wrappers.varied : this.defaultSettings.wrappers.varied;
        if (settings.plugin.hoverOpen) {
            $(".bf-toolbar").removeClass('bf-visible');
            $(".bf-toolbar").addClass('bf-hover');
        } else $(".bf-toolbar").removeClass('bf-hover');
        this.settings = settings;
        this.updateStyle();
    }
}

class BFSettings extends window.DI.React.Component {
    render() {
        return e('div', {},
            e(SettingsOptionTitle, { text: "Wrapper Options" }),
            e(SettingsOptionTextbox, {
                title: 'Superscript',
                description: 'The wrapper for superscripted text.',
                plugin: this.props.plugin,
                lsNode: 'wrappers.superscript',
                defaultValue: '^'
            }),
            e(SettingsDivider),
            e(SettingsOptionTextbox, {
                title: 'Smallcaps',
                description: 'The wrapper to make Smallcaps.',
                plugin: this.props.plugin,
                lsNode: 'wrappers.smallcaps',
                defaultValue: '%'
            }),
            e(SettingsDivider),
            e(SettingsOptionTextbox, {
                title: 'Full Width',
                description: 'The wrapper for E X P A N D E D  T E X T.',
                plugin: this.props.plugin,
                lsNode: 'wrappers.fullwidth',
                defaultValue: '##'
            }),
            e(SettingsDivider),
            e(SettingsOptionTextbox, {
                title: 'Upsidedown',
                description: 'The wrapper to flip the text upsidedown.',
                plugin: this.props.plugin,
                lsNode: 'wrappers.upsidedown',
                defaultValue: '&&'
            }),
            e(SettingsDivider),
            e(SettingsOptionTextbox, {
                title: 'Varied Caps',
                description: 'The wrapper to VaRy the capitalization.',
                plugin: this.props.plugin,
                lsNode: 'wrappers.varied',
                defaultValue: '||'
            }),
            e(SettingsDivider),
            e(SettingsOptionTitle, { text: "Formatting Options" }),
            e(SettingsOptionToggle, {
                title: 'Fullwidth Style',
                lsNode: 'formatting.fullWidthMap',
                plugin: this.props.plugin,
                defaultValue: true
            }),
            e(SettingsOptionDescription, {
                text: 'Which style of fullwidth formatting should be used. T H I S <==> ｔｈｉｓ'
            }),
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Reorder Upsidedown Text',
                lsNode: 'formatting.reorderUpsidedown',
                plugin: this.props.plugin,
                defaultValue: true
            }),
            e(SettingsOptionDescription, {
                text: 'Having this enabled reorders the upside down text to make it in-order.'
            }),
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Start VaRiEd Caps With Capital',
                lsNode: 'formatting.startCaps',
                plugin: this.props.plugin,
                defaultValue: true
            }),
            e(SettingsOptionDescription, {
                text: 'Enabling this starts a varied text string with a capital.'
            }),
            e(SettingsDivider),
            e(SettingsOptionTitle, { text: "Plugin Options" }),
            e(SettingsOptionToggle, {
                title: 'Open On Hover',
                lsNode: 'plugin.closeOnSend',
                plugin: this.props.plugin,
                defaultValue: true
            }),
            e(SettingsOptionDescription, {
                text: 'Enabling this makes you able to open the menu just by hovering the arrow instead of clicking it.'
            }),
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Close On Send',
                lsNode: 'plugin.closeOnSend',
                plugin: this.props.plugin,
                defaultValue: true
            }),
            e(SettingsOptionDescription, {
                text: 'This option will close the toolbar when the message is sent when "Open On Hover" is disabled.'
            }),
            e(SettingsDivider),
            e(SettingsOptionToggle, {
                title: 'Format Chaining',
                lsNode: 'plugin.chainFormats',
                plugin: this.props.plugin,
                defaultValue: true
            }),
            e(SettingsOptionDescription, {
                text: 'Swaps priority of wrappers between inner first and outer first. Check the GitHub for more info.'
            }),
            e(SettingsDivider),
            e(SettingsOptionTitle, { text: "Style Options" }),
            e(SettingsOptionToggle, {
                title: 'Toolbar Location',
                lsNode: 'style.rightSide',
                plugin: this.props.plugin,
                defaultValue: true
            }),
            e(SettingsOptionDescription, {
                text: 'This option enables swapping toolbar from right side to left side. Left <==> Right'
            }),
            e(SettingsDivider),
            e(SettingsOptionButton, {
                text: 'Reset To Defaults',
                outline: true,
                onClick: ()=>this.props.plugin.settings = this.props.plugin.defaultSettings
            })
        );
    }
}

class ControlGroup {
    constructor(groupName, callback) {
        this.group = $("<div>").addClass("control-group");

        var label = $("<h2>").text(groupName);
        label.attr("class", "h5-3KssQU title-1pmpPr marginReset-3hwONl size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4");
        label.css("margin-top", "30px")
        this.group.append(label);
        
        if (typeof callback != 'undefined') {
            this.group.on("change.BFRedux", "input", callback)
        }
    }
    
    getElement() {return this.group;}
    
    append(...nodes) {
        for (var i = 0; i < nodes.length; i++) {
            this.group.append(nodes[i].getElement())
        }
        return this
    }
    
    appendTo(node) {
        this.group.appendTo(node)
        return this
    }
}

class SettingField {
    constructor(name, helptext, inputData, callback, disabled = false) {
        this.name = name;
        this.helptext = helptext;
        this.row = $("<div>").addClass("ui-flex flex-vertical flex-justify-start flex-align-stretch flex-nowrap ui-switch-item").css("margin-top", 0);
        this.top = $("<div>").addClass("ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap plugin-setting-input-row")
        this.settingLabel = $("<h3>").attr("class", "ui-form-title h3 margin-reset margin-reset ui-flex-child").text(name);
        
        this.help = $("<div>").addClass("ui-form-text style-description margin-top-4").css("flex", "1 1 auto").text(helptext);
        
        this.top.append(this.settingLabel);
        this.row.append(this.top, this.help);
        
        inputData.disabled = disabled
        
        this.input = $("<input>", inputData)
        this.getValue = () => {return this.input.val();}
        this.processValue = (value) => {return value;}
        this.input.on("keyup.BFRedux change.BFRedux", () => {
            if (typeof callback != 'undefined') {
                var returnVal = this.getValue()
                callback(returnVal)
            }
        })
    }
    
    setInputElement(node) {
        this.top.append(node)
    }
    
    getElement() {return this.row}
    
    static getAccentColor() {
        var bg = $('<div class="ui-switch-item"><div class="ui-switch-wrapper"><input type="checkbox" checked="checked" class="ui-switch-checkbox"><div class="ui-switch checked">')
        bg.appendTo($("#bd-settingspane-container"))
        var bgColor = $(".ui-switch.checked").first().css("background-color")
        var afterColor = window.getComputedStyle(bg.find(".ui-switch.checked")[0], ':after').getPropertyValue('background-color'); // For beardy's theme
        bgColor = afterColor == "rgba(0, 0, 0, 0)" ? bgColor : afterColor
        bg.remove();
        return bgColor
    }
    
    static inputContainer() { return $('<div class="plugin-setting-input-container">');}
}

class TextSetting extends SettingField {
    constructor(label, help, value, placeholder, callback, disabled) {
        super(label, help, {type: "text", placeholder: placeholder, value: value}, callback, disabled);
        
        this.setInputElement(this.input);
    }
}

class ColorSetting extends SettingField {
    constructor(label, help, value, callback, disabled) {
        super(label, help, {type: "color", value: value}, callback, disabled);
        this.input.css("margin-left", "10px")
        
        var label = $('<span class="plugin-setting-label">').text(value)
        
        this.input.on("input.BFRedux", function() {
            label.text($(this).val())
        })
        
        this.setInputElement(SettingField.inputContainer().append(label,input));
    }
}

class SliderSetting extends SettingField {
    constructor(settingLabel, help, min, max, step, value, callback, disabled) {
        super(settingLabel, help, {type: "range", min: min, max: max, step: step, value: parseFloat(value)}, callback, disabled);
        this.value = parseFloat(value); this.min = min; this.max = max;
        
        this.getValue = () => {return parseFloat(this.input.val());}
        
        this.accentColor = SettingField.getAccentColor()
        this.setBackground()
        this.input.css("margin-left", "10px").css("float", "right")
        
        this.labelUnit = ""
        this.label = $('<span class="plugin-setting-label">').text(this.value + this.labelUnit)
        
        this.input.on("input.BFRedux", () => {
            this.value = parseFloat(this.input.val())
            this.label.text(this.value + this.labelUnit)
            this.setBackground()
        })
        
        this.setInputElement(SettingField.inputContainer().append(this.label,this.input));
    }
    
    getPercent() {return ((this.value-this.min)/this.max)*100;}
    setBackground() {var percent = this.getPercent(); this.input.css('background', 'linear-gradient(to right, '+this.accentColor+', '+this.accentColor+' '+percent+'%, #72767d '+percent+'%)')}
    setLabelUnit(unit) {this.labelUnit = unit; this.label.text(this.value + this.labelUnit); return this;}
}

class CheckboxSetting extends SettingField {
    constructor(label, help, isChecked, callback, disabled) {
        super(label, help, {type: "checkbox", checked: isChecked}, callback, disabled);
        this.getValue = () => {return this.input.prop("checked")}
        this.input.addClass("ui-switch-checkbox");

        this.input.on("change.BFRedux", function() {
            if ($(this).prop("checked")) switchDiv.addClass("checked");
            else switchDiv.removeClass("checked");
        })
        
        this.checkboxWrap = $('<label class="ui-switch-wrapper ui-flex-child" style="flex:0 0 auto;">');
        this.checkboxWrap.append(this.input);
        var switchDiv = $('<div class="ui-switch">');
        if (isChecked) switchDiv.addClass("checked");
        this.checkboxWrap.append(switchDiv);
        this.checkboxWrap.css("right", "0px")

        this.setInputElement(this.checkboxWrap);
    }
}

// True is right side
class PillSetting extends CheckboxSetting {
    constructor(label, help, leftLabel, rightLabel, isChecked, callback, disabled) {
        super(label, help, isChecked, callback, disabled);
        
        this.checkboxWrap.css("margin","0 9px")
        
        var labelLeft = $('<span class="plugin-setting-label left">')
        labelLeft.text(leftLabel)
        var labelRight = $('<span class="plugin-setting-label right">')
        labelRight.text(rightLabel)
        
        var accent = SettingField.getAccentColor()
        
        if (isChecked) labelRight.css("color", accent);
        else labelLeft.css("color", accent);
        
        this.checkboxWrap.find('input').on("click.BFRedux", function() {
            var checked = $(this).prop("checked");
            if (checked) {
                labelRight.css("color", accent);
                labelLeft.css("color", "");
            }
            else {
                labelLeft.css("color", accent);
                labelRight.css("color", "");
            }
        })
        
        this.setInputElement(SettingField.inputContainer().append(labelLeft, this.checkboxWrap.detach(), labelRight));
    }
}

module.exports = BFRedux;