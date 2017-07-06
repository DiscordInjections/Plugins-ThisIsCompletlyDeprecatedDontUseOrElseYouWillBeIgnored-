const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");
const spectrum = require("spectrum-colorpicker");

class Renamer extends Plugin {
  constructor () {
    super({
        author: 'Megamit/Mitchell, Ported by Snazzah',
        version: '1.6.1',
        description: 'Rename your friends',
        color: 'FFA500'
    });
    this.log("Loading variables...");
    this.css = `<style class='renamer'>

.pick-wrap {
    position: relative;
    padding: 0;
    margin: 0;
}

.pick-wrap .color-picker-popout {
    position: absolute;
}

.renamer-tag {
    font-size: 10px;
    font-weight: 600;
    padding: 1px 2px;
    border-radius: 3px;
    text-transform: uppercase;
    vertical-align: bottom;
    line-height: 16px;
    flex-shrink: 0;
}

.channel-members .renamer-tag {
    line-height: 15px;
    height: 14px;
    margin-left: 6px;
}

.message-group .renamer-tag {
    margin-right: 4px;
}

.message-group:not(.compact) .renamer-tag {
    margin-left: 6px;
}

.ui-color-picker-swatch {
    margin-bottom: 10px;
    border: 1px solid black;
}

.ui-color-picker-swatch.large {
    width: 100px;
    height: 50px;
}

.ui-color-picker-swatch.selected {
    border: 2px solid black;
}

.renamer-modal .modal {
    display: flex;
    position: absolute;
    user-select: none;
    height: 100%;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: space-around;
    padding-top: 60px;
    padding-bottom: 60px;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    box-sizing: border-box;
    min-height: 340px;
}

.renamer-modal .form-header, .renamer-modal .form-actions{
    padding: 20px;
    background-color: rgba(32,34,37,.3);
    box-shadow: inset 0 1px 0 rgba(32,34,37,.6);
    
}

.renamer-modal .form-header{
    color: #f6f6f7;
    text-transform: uppercase;
    letter-spacing: .3px;
    cursor: default;
    font-weight: 600;
    line-height: 20px;
    font-size: 16px;
}

.renamer-modal .form-actions{
    display: flex;
    flex-direction: row-reverse;
    flex: 0 0 auto;
    flex-wrap: nowrap;
}

.renamer-modal .form-inner{
    padding: 0 20px;
    margin: 20px 0;

}

.renamer-modal .modal-inner {
    border-radius: 5px;

    display: flex;
    pointer-events: auto;
    width: 470px;
    max-height: 660px;
    min-height: 200px;
    background-color: #2f3136;
    box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
}

.renamer-modal input {
    color: #f6f6f7;
    background-color: rgba(0,0,0,.1);
    border-color: rgba(0,0,0,.3);
}

.renamer-modal input {
    padding: 10px;
    height: 40px;
}
.renamer-modal input {
    box-sizing: border-box;
    width: 100%;
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
    outline: none;
    transition: background-color .15s ease,border .15s ease;
}

.renamer-modal .btn {
    min-width: 96px;
    min-height: 38px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    background: none;
    border: none;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    padding: 2px 16px;
}

.renamer-modal .btn-default {
    color: #dcddde;
}

.renamer-modal .btn-primary {
    color: #fff;
    background-color: #7289da;
}

.renamer-modal .control-group label {
    color: #b9bbbe;
    letter-spacing: .5px;
    text-transform: uppercase;
    flex: 1;
    cursor: default;
    margin-bottom: 8px;
    margin-top: 0;
    font-weight: 600;
    line-height: 16px;
    font-size: 12px;
}

.renamer-modal label.modal-reset, .renamer-modal label.reset-nick {
    color: #dcddde;
    text-transform: capitalize;
    opacity: .6;
    margin-bottom: 20px;
    font-weight: 600;
    line-height: 16px;
    font-size: 12px;
}

.renamer-modal .control-group {
    margin-top: 10px;
}

'</style>`;
    this.defaultSettings = {
      globals: {
        "158049329150427136": {
          id: "158049329150427136",
          username: "Snazzah",
          discriminator: "0371",
          tag: { text: "Cool Cat", back: "rgb(252, 41, 41)", fore: "#FFF" }
        }
      }
    };
    this.contextMarkup =
      `<div class="item-group renamer">
		  <div class="item name-item">
  			<span>Change Local Nickname</span>
  			<div class="hint"></div>
      </div>
      <div class="item tag-item">
  			<span>Change User Tag</span>
  			<div class="hint"></div>
		  </div>
		</div>`;

    this.modalMarkup =
      `<span class="renamer-modal"><div class="callout-backdrop renamer" style="background-color:#000; opacity:0.85"></div><div class="modal" style="opacity: 1">
        <div class="modal-inner">
            <form class="form">
                <div class="form-header">
                    <header class="modal-header">modal-header</header>
                </div>
                <div class="form-inner">
                    <div class="control-group">
                        <label class="modal-text-label" for="modal-text">
                            modal-text-label
                        </label>
                        <input type="text" id="modal-text" name="text">
                    </div>
                    <div class="control-group">
                        <label class="modal-reset"><a class="modal-reset-text">modal-reset-text</a></label>
                    </div>
              <div class="control-group">
                <label class="color-picker-label">color-picker-label</label>
                <div class="color-picker">
                <div class="swatches"></div>
                </div>
              </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-default">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    </div></span>`

		this.colourList = ['rgb(26, 188, 156)','rgb(46, 204, 113)','rgb(52, 152, 219)','rgb(155, 89, 182)','rgb(233, 30, 99)','rgb(241, 196, 15)','rgb(230, 126, 34)','rgb(231, 76, 60)','rgb(149, 165, 166)','rgb(96, 125, 139)','rgb(17, 128, 106)','rgb(31, 139, 76)','rgb(32, 102, 148)','rgb(113, 54, 138)','rgb(173, 20, 87)','rgb(194, 124, 14)','rgb(168, 67, 0)','rgb(153, 45, 34)','rgb(151, 156, 159)','rgb(84, 110, 122)'];

    //this.getUpdates()
    this.log("Initializing MutationObserver...");
    const contextmo = new MutationObserver((changes, _) => {
      changes.forEach(
        (change, i) => {
          if (change.addedNodes) {
            [ ...change.addedNodes ].forEach((node) => {
              if (node.nodeType == 1 && node.className.includes("context-menu")) this.onContextMenu(node)
            })
          }
        }
      )
    })
    // ,dm_mo = new MutationObserver((...args)=>{
    //   this.log("dm_mo")
    //   this.attachChatListners()
    // });
    this.log("Attaching chat listeners...");
    this.attachChatListners();
    contextmo.observe($("#app-mount>:first-child")[ 0 ], { childList: true })
    // dm_mo.observe($(".app>.flex-spacer>.flex-spacer")[0],{childList:true})
    this.log("Loading settings...");
    this.loadSettings()
    this.log("Appending CSS...");
    $('head').append(this.css)
      .append("<link rel='stylesheet' href='https://bgrins.github.io/spectrum/spectrum.css' />");
    this.contextExtention = $(this.contextMarkup)
    this.syncColoredTextSetting();
  }

  unload () {
    $('.renamer').remove();
  }

  static getReactInstance (node) { return node[ Object.keys(node).find((key) => key.startsWith("__reactInternalInstance")) ] }

  static getReactObject (node) { return ((inst) => (inst._currentElement._owner._instance))(Renamer.getReactInstance(node)) }

  getMemberListUser (node) {
    let inst = getReactInstance(node)
    inst._currentElement._props.children
  }

  setSwatches (currentColor, colorOptions, parent) {
    //this.log('swatches', currentColor, colorOptions, parent)
    parent = $(parent)
    let custom;
    const useDefault = typeof currentColor === "undefined" || !currentColor || currentColor === "#7289da";
    const selection = colorOptions.indexOf(currentColor);
    //this.log(selection)
    const swatches = $(`<div class="ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap" style="flex: 1 1 auto; margin-top: 5px;"><div class="ui-color-picker-swatch large default${useDefault ? ' selected' : ''}" style="background-color: #7289da;"></div>
    <div class="ui-color-picker-swatch large custom${selection === -1 && !useDefault ? ' selected' : ''}" style="background-color: rgb(255, 255, 255);"></div>
    <div class="regulars ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-wrap ui-color-picker-row" style="flex: 1 1 auto; display: flex; flex-wrap: wrap; overflow: visible !important;">${ colorOptions.map((val, i) => `<div class="ui-color-picker-swatch${i === selection ? ' selected' : ''}" style="background-color: ${val};"></div>`).join("")}</div></div>`)
      .appendTo(parent);
    //console.log("test");
    if (selection > -1) {
      parent.find(".regulars .ui-color-picker-swatch").eq(selection).addClass(".selected")
    } else if (useDefault) {
      parent.find(".default").addClass(".selected")
    } else {
      $(".custom", parent).addClass(".selected").css("backgroundColor", currentColor)
    }
    parent.on("click", ".ui-color-picker-swatch:not(.custom)", (e) => {
      console.log(e.target)
      parent.find(".ui-color-picker-swatch.selected").removeClass("selected");
      e.target.classList.add("selected");
      custom.css("backgroundColor", "");
    })
    custom = $(".ui-color-picker-swatch.custom", parent).spectrum({
      showInput: true,
      showButtons: false,
      move: (color) => {
        $(".ui-color-picker-swatch.selected").removeClass("selected");
        custom.css("backgroundColor", color.toRgbString()).addClass("selected");
      }
    });
  }

  showTagModal (user) {
    let { nick, username, tag } = ((user) => user ? user : {})(this.getNickname(user.id))
    nick = nick ? nick : user.username;
    //this.log(nick, username)
    let modal = $(this.modalMarkup)
    modal.find(".modal-header").text("Change User Tag")
    modal.find(".modal-text-label").text("Tag Text")
    tag && tag.text && modal.find("#modal-text").val(tag.text)
    modal.find(".modal-reset-text").text("Delete Tag")
    modal.find(".color-picker-label").text("Tag Color")
    this.setSwatches(tag && tag.back, this.colourList, modal.find(".swatches"));
    modal.on("submit", "form", (e) => {
      e.preventDefault();
      const fore = ((c) => (c[ 0 ] * 0.299 + c[ 1 ] * 0.587 + c[ 2 ] * 0.114) > 186 ? "#000" : "#FFF")($(".ui-color-picker-swatch.selected").css("backgroundColor").slice(4, -1).split(", "))
      const back = ((result) => result == "rgb(153, 170, 181)" ? "#7289da" : result)($(".ui-color-picker-swatch.selected").css("backgroundColor"))
      this.setUserData(user, {
        tag: {
          text: e.target.elements.text.value,
          back: ((result) => result == "rgb(153, 170, 181)" ? "#7289da" : result)($(".ui-color-picker-swatch.selected").css("backgroundColor")),
          fore: ((c) => (c[ 0 ] * 0.299 + c[ 1 ] * 0.587 + c[ 2 ] * 0.114) > 186 ? "#000" : "#FFF")($(".ui-color-picker-swatch.selected").css("backgroundColor").slice(4, -1).split(", "))
        }
      });
      modal.remove();
    })
      .appendTo("#app-mount>:first-child")
      .on("click", ".modal-reset", (e) => {
        this.resetUserProp(user.id, "tag");
        this.process(true);
        modal.remove();
        this.saveSettings();
      })
      .on("click", ".callout-backdrop,button.btn-default", (e) => {modal.remove()})
    modal.find("#modal-text").click().focus();
  }

  showInputModal (user) {
    let { nick, username, colour } = ((user) => user ? user : {})(this.getNickname(user.id))
    nick = nick ? nick : user.username;
    let custom,
      selection = this.colourList.indexOf(colour);
    //this.log(nick, username, colour)
    let colorGroup =
      `<div class="ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-nowrap" style="flex: 1 1 auto; margin-top: 5px;"><div class="ui-color-picker-swatch large${colour == null ? " selected" : ""}" style="background-color: rgb(153, 170, 181);"></div><div class="ui-color-picker-swatch large custom${selection == -1 && colour ? " selected" : ""}" style="background-color:${selection == -1 && colour ? colour : 'rgb(255, 255, 255)'}"></div>
		<div class="regulars ui-flex flex-horizontal flex-justify-start flex-align-stretch flex-wrap ui-color-picker-row" style="flex: 1 1 auto; display: flex; flex-wrap: wrap; overflow: visible !important;">` + this.colourList.map((val, i) => `<div class="ui-color-picker-swatch${i == selection ? " selected" : ""}" style="background-color: ${val};"></div>`).join("") + `</div></div>`
    let modal = $(`<span class="renamer-modal"><div class="callout-backdrop renamer" style="background-color:#000; opacity:0.85"></div><div class="modal" style="opacity: 1">
        <div class="modal-inner">
            <form class="form">
                <div class="form-header">
                    <header>Change Local Nickname</header>
                </div>
                <div class="form-inner">
                    <div class="control-group">
                        <label for="nickname">
                            Nickname ${user.username}
                        </label>
                        <input type="text" id="nickname" placeholder="${user.username}" name="nick" value="${nick}">
                    </div>
                    <div class="control-group">
                        <label class="reset-nick"><a>Reset Nickname</a></label>
                    </div>
					<div class="control-group">
					  <label for="role-name">Nickname color</label>
					  <div class="color-picker">
						<div class="swatches">
							${colorGroup}
						</div>
					  </div>
					</div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-default">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    </div></span>`).on("submit", "form", (e) => {
      e.preventDefault();
      this.setUserData(user, {
        nick: e.target.elements.nick.value,
        color: ((result) => result == "rgb(153, 170, 181)" ? null : result)($(".ui-color-picker-swatch.selected").css("backgroundColor"))
      });
      modal.remove();
    })
      .appendTo("#app-mount>:first-child")
      .on("click", ".reset-nick", (e) => {
        this.resetUserProp(user.id, "nick");
        this.process(true);
        modal.remove();
        this.saveSettings();
      })
      .on("click", ".callout-backdrop,button.btn-default", (e) => {modal.remove()})
      .on("click", ".ui-color-picker-swatch:not(.custom)", (e) => {
        modal.find(".ui-color-picker-swatch.selected").removeClass("selected");
        e.target.classList.add("selected");
        custom.css("backgroundColor", "")
      })
    custom = $(".ui-color-picker-swatch.custom").spectrum({
      showInput: true,
      showButtons: false,
      move: (color) => {
        $(".ui-color-picker-swatch.selected").removeClass("selected");
        custom.css("backgroundColor", color.toRgbString()).addClass("selected")
      }
    })
    modal.find("#nickname").click().focus();
  }

  resetUserProp (id, prop) {
    delete this.settings.globals[ id ][ prop ];
  }

  setUserData (user, data) {
    let { nick, color, tag } = data;
    let { username, discriminator, id } = user;
    if (this.settings.globals[ id ]) {
      this.log(username, "has new nickname", nick)
      if (nick) {
        this.settings.globals[ id ].nick = nick;
        this.settings.globals[ id ].colour = color
      }
      username && (this.settings.globals[ id ].username = username);
      discriminator && (this.settings.globals[ id ].discriminator = discriminator);
      if (tag) {
        this.settings.globals[ id ].tag = tag;
        this.log(username, "has tag", tag)
      }
    } else {
      this.log(username, "is now", nick)
      this.settings.globals[ id ] = {
        id,
        username,
        discriminator,
      }
      if (nick) {
        this.settings.globals[ id ].nick = nick;
        this.settings.globals[ id ].colour = color
      }
      if (tag) {
        this.settings.globals[ id ].tag = tag;
      }
    }
    this.saveSettings();
    this.process(true);
  }

  syncColoredTextSetting () {
    this.coloredText = true;
  }

  saveSettings () {
    $localStorage.setItem("Renamer", JSON.stringify(this.settings));
  }

  loadSettings () {
    this.settings = $.extend({}, this.defaultSettings, JSON.parse($localStorage.getItem("Renamer")))
    this.saveSettings();
  }

  getNickname (id, channel) {
    return this.settings.globals[ id ];
  }

  process (force) {
    if (force) {
      $("[renamer]").removeAttr("renamer");
      $(".renamer-tag").remove();
      $("[data-renamer-name]").html(function () {
        let name = this.dataset.renamerName;
        delete this.dataset.renamerName;
        return name
      }).removeAttr("data-renamer-name");
      $("[data-renamer-color]").css("color", function () {
        let color = this.dataset.renamerColor;
        delete this.dataset.renamerColor;
        return color;
      }).removeAttr("data-renamer-color");
    }
    //chat names
    this.syncColoredTextSetting();
    const start = Date.now()

    $(".chat .comment").each((i, group) => {
      try {
        let userData = this.getNickname(Renamer.getReactInstance(group)._currentElement.props.children[ 0 ][ 0 ].props.message.author.id),
          names = $("strong.user-name:not([renamer])", group).each((i, el) => {
            //this.log(i,el);
            //FORGIVE ME LORD FOR I HAVE SINNED
            //I SACRIFICE CODE EFFICIENCY TO SUMMON
            //HACKY BUGFIX IN ATTACK MODE
            el.setAttribute("renamer", "");
            if (userData) {
              if (userData.tag) {
                $("<span/>", { class: "renamer-tag", text: userData.tag.text }).css({
                  color: userData.tag.fore,
                  backgroundColor: userData.tag.back
                }).insertAfter(el)
              }
              if (userData.nick) {
                el.dataset.renamerName = el.innerHTML;
                el.innerHTML = userData.nick;
              }
              if (userData.colour) {
                el.dataset.renamerColor = el.style.color;
                el.style.color = userData.colour;
                if (this.coloredText) {
                  if (el.parentElement.parentElement.classList.contains("markup")) {
                    el.parentElement.parentElement.style.color = userData.colour;
                    el.parentElement.parentElement.colour = true;
                  } else {
                    console.log(
                      $(el).parents(".comment").find(".markup").css("color", userData.colour).attr("data-colour", true)
                    )
                  }
                }
              }
            }
          })
      } catch (TypeError) {
        return
      }
    })

    // member list names
    $(".channel-members .member:not([renamer])").each((i, member) => {
      member.setAttribute("renamer", "");
      //if (i > 2000) return this.log("WHATTHEFUCK")

      if(member.className.includes("member")){ // Member List
        const userData = this.getNickname(Renamer.getReactInstance(member)._currentElement.props.children[ 0 ].props.user.id);
        if (userData) {
          const name = $(".member-username-inner", member)[ 0 ];
          if (userData.nick) {
            name.dataset.renamerName = name.innerHTML;
            name.innerHTML = userData.nick;
          }
          if (userData.colour) {
            name.dataset.renamerColor = name.style.color;
            name.style.color = userData.colour;
          }
          if (userData.tag) {
            $("<span/>", { class: "renamer-tag", text: userData.tag.text }).css({
              color: userData.tag.fore,
              backgroundColor: userData.tag.back
            }).insertAfter(name)
          }
        }
      }
    });

    // user popouts and profiles
    $(".discord-tag:not([renamer])").each((i, member) => {
      member.setAttribute("renamer", "");
      const userData = this.getNickname(Renamer.getReactInstance(member.parentNode)._currentElement.props.children[member.parentNode.className === "header-info-inner" ? 0 : 1].props.user.id);
      if (userData) {
        const name = $(".username", member)[0];
        if (userData.nick) {
          name.dataset.renamerName = name.innerHTML;
          name.innerHTML = userData.nick;
        }
        if (userData.colour) {
          name.dataset.renamerColor = name.style.color;
          name.style.color = userData.colour;
        }
        if (userData.tag) {
          $("<span/>", { class: "renamer-tag", text: userData.tag.text }).css({
            color: userData.tag.fore,
            backgroundColor: userData.tag.back,
            marginLeft: "6px"
          }).insertAfter($(".discriminator", member)[0])
        }
      }
    });
  }

  onContextMenu (context) {
    // this.log(context)
    let inst = Renamer.getReactInstance(context)
    if (!inst) return;
    for (const child of inst._currentElement.props.children) {
      if (child && child.props && child.props.user) {
        let { id, username, discriminator } = child.props.user;
        // this.log(child.props.user)
        let data = { id, username, discriminator }
        $(context).append(this.contextExtention)
          .on("click.renamer", ".name-item", data, this.onContextName.bind(this))
          .on("click.renamer", ".tag-item", data, this.onContextTag.bind(this))
        //.on("click.renamer",".avatar-item",data,this.onContextAvatar.bind(this))
        break;
      }
    }
    //this.log(this.getReactObject( context).props.type)
  }

  onContextName (e) {
    $(e.delegateTarget).hide()
    //this.log("SetName",e.data);
    this.showInputModal(e.data)
  }

  waitForElement (css, callback) {
    let obj = $(css),
      timer;
    if (obj.length) {
      this.log("Element Present")
      callback(obj)
    }
    else {
      timer = setInterval(() => {
        obj = $(css);
        if (obj.length) {
          this.log("Element Attached");
          clearInterval(timer);
          callback(obj);
        }
      }, 100)
    }
  }

  attachChatListners () {
    const processmo = new MutationObserver((changes, _) => {
      this.process();
    })
    processmo.observe($(".app>*:first-child>*:first-child")[ 0 ], { childList: true, subtree: true });
    $("div[data-reactroot]>.theme-dark:not(.pictureInPicture-Ryvh67), div[data-reactroot]>.theme-light:not(.pictureInPicture-Ryvh67)").each((i, elm) => {
      processmo.observe(elm, { childList: true, subtree: true });
    });
    // processmo.observe( $(".channel-members")[0] , {childList:true, subtree: true} )
    // processmo.observe( $(".channel-voice-states")[0] , {childList:true, subtree: true} )
  }

  onContextTag (e) {
    $(e.delegateTarget).hide();
    this.showTagModal(e.data);
  }
}

module.exports = Renamer;