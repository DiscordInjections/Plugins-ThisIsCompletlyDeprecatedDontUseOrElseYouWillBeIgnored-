const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");
const spectrum = require("spectrum-colorpicker");

class Renamer extends Plugin {
  constructor (...args) {
    super(...args);
    this.log("Loading variables...");
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

    this.modalMarkup2 = `
    <div class="ui-form-item margin-bottom-20"><h5 class="h5-3KssQU title-1pmpPr size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4 modal-text-label">modal-text-label</h5><input type="text" class="inputDefault-Y_U37D input-2YozMi size16-3IvaX_" id="modal-text" name="text"></div>
    <div class="ui-form-item margin-bottom-20"><div class="modal-reset"><a class="contentsDefault-nt2Ym5 contents-4L4hQM contentsLink-2ScJ_P contents-4L4hQM modal-reset-text">modal-reset-text</a></div></div>
    <div class="ui-form-item margin-bottom-20"><h5 class="h5-3KssQU title-1pmpPr size12-1IGJl9 height16-1qXrGy weightSemiBold-T8sxWH defaultMarginh5-2UwwFY marginBottom8-1mABJ4 color-picker-label">color-picker-label</h5><div class="color-picker"><div class="swatches"></div></div></div>`

    this.colourList = ['rgb(26, 188, 156)','rgb(46, 204, 113)','rgb(52, 152, 219)','rgb(155, 89, 182)','rgb(233, 30, 99)','rgb(241, 196, 15)','rgb(230, 126, 34)','rgb(231, 76, 60)','rgb(149, 165, 166)','rgb(96, 125, 139)','rgb(17, 128, 106)','rgb(31, 139, 76)','rgb(32, 102, 148)','rgb(113, 54, 138)','rgb(173, 20, 87)','rgb(194, 124, 14)','rgb(168, 67, 0)','rgb(153, 45, 34)','rgb(151, 156, 159)','rgb(84, 110, 122)'];

    //this.getUpdates()
    this.log("Attaching chat listeners...");
    this.processBind = this.process.bind(this);
    window.DI.StateWatcher.on('mutation', this.processBind);
    this.contextMenuBind = this.contextMenu.bind(this);
    window.A.Watcher.on('contextMenu', this.contextMenuBind);
    this.log("Loading settings...");
    this.loadSettings();
    $("head").append("<link rel='stylesheet' href='https://bgrins.github.io/spectrum/spectrum.css' />");
    this.coloredText = true;
    this.attachSlugCommand();
  }

  static get after() { return ['afunc'] }

  get configTemplate() {
      return {
          color: 'FFA500',
          iconURL: 'https://discordinjections.xyz/img/logo-alt-yellow.svg'
      };
  }

  unload () {
    $('#CSS-Renamer').remove();
    window.DI.StateWatcher.removeListener('mutation', this.processBind);
    window.DI.StateWatcher.removeListener('slugmod-reloaded', this.slugModFunction.bind(this));
    window.A.Watcher.removeListener('contextMenu', this.contextMenuBind);
  }

  attachSlugCommand () {
    window.DI.StateWatcher.on('slugmod-reloaded', this.slugModFunction.bind(this));
    this.slugModFunction();
    this.registerCommand({
      name: "tag",
      info: "Set people's tags.",
      usage: "<@user> [#color] <tag>",
      func: (args) => {
        if(!args[1]){
          this.sendLocalMessage("Failed to execute: Not enough arguments.");
          return;
        }
        let user = window.DI.Helpers.resolveMention(args[0]);
        if(!user){
          this.sendLocalMessage("Failed to execute: Invalid user.");
          return;
        }
        let shorthandRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        const h2rgb = hex => {
          var result = shorthandRegex.exec(hex);
          return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ] : null;
        };
        let color = "#7289DA";
        let tag = args.slice(1).join(" ");
        if(args[1].match(shorthandRegex)){
          color = args[1];
          tag = args.slice(2).join(" ");
        };
        const fore = c => (c[ 0 ] * 0.299 + c[ 1 ] * 0.587 + c[ 2 ] * 0.114) > 186 ? "#000" : "#FFF"
        this.setUserData(user, {
          tag: {
            text: tag,
            back: color,
            fore: fore(h2rgb(color))
          }
        });
        this.sendLocalMessage(`Set ${user.username}'s tag to ${tag}.`);
      }
    });

    this.registerCommand({
      name: "resettag",
      info: "Reset people's tags.",
      usage: "<@user>",
      func: (args) => {
        if(!args[0]){
          this.sendLocalMessage("Failed to execute: Not enough arguments.");
          return;
        }
        let user = window.DI.Helpers.resolveMention(args[0]);
        if(!user){
          this.sendLocalMessage("Failed to execute: Invalid user.");
          return;
        }
        this.resetUserProp(user.id, "tag");
        this.sendLocalMessage(`Reset ${user.username}'s tag.`);
      }
    });

    this.registerCommand({
      name: "localnick",
      info: "Set people's local nicknames.",
      usage: "<@user> [#color] <nick>",
      func: (args) => {
        if(!args[1]){
          this.sendLocalMessage("Failed to execute: Not enough arguments.");
          return;
        }
        let user = window.DI.Helpers.resolveMention(args[0]);
        if(!user){
          this.sendLocalMessage("Failed to execute: Invalid user.");
          return;
        }
        let shorthandRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        let color = null;
        let nick = args.slice(1).join(" ");
        if(args[1].match(shorthandRegex)){
          color = args[1];
          nick = args.slice(2).join(" ");
        };
        let obj = {
          nick: nick
        }
        if(color) obj.color = color;
        this.setUserData(user, obj);
        this.sendLocalMessage(`Set ${user.username}'s local nickname to ${nick}.`);
      }
    });

    this.registerCommand({
      name: "resetlocalnick",
      info: "Reset people's local nicknames.",
      usage: "<@user>",
      func: (args)=>{
        if(!args[0]){
          this.sendLocalMessage("Failed to execute: Not enough arguments.");
          return;
        }
        let user = window.DI.Helpers.resolveMention(args[0]);
        if(!user){
          this.sendLocalMessage("Failed to execute: Invalid user.");
          return;
        }
        this.resetUserProp(user.id, "nick");
        this.resetUserProp(user.id, "color");
        this.sendLocalMessage(`Reset ${user.username}'s local nickname.`);
      }
    });
  }

  slugModFunction(plugins = window.DI.PluginManager.plugins){
    if(plugins.slugmod){
      plugins.slugmod.addExternalCommand({
        name: "tag",
        desc: "Set people's tags.",
        usage: "//tag @user #7289da tag",
        plugin: "Renamer"
      }, (command, args, su)=>{
        if(!args[1]){
          su.sendACMessage("Failed to execute: Not enough arguments.");
          return;
        }
        let user = su.resolveMention(args[0]);
        if(!user){
          su.sendACMessage("Failed to execute: Invalid user.");
          return;
        }
        let shorthandRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        const h2rgb = hex => {
          var result = shorthandRegex.exec(hex);
          return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ] : null;
        };
        let color = "#7289DA";
        let tag = args.slice(1).join(" ");
        if(args[1].match(shorthandRegex)){
          color = args[1];
          tag = args.slice(2).join(" ");
        };
        const fore = c => (c[ 0 ] * 0.299 + c[ 1 ] * 0.587 + c[ 2 ] * 0.114) > 186 ? "#000" : "#FFF"
        this.setUserData(user, {
          tag: {
            text: tag,
            back: color,
            fore: fore(h2rgb(color))
          }
        });
        su.sendACMessage(`Set ${user.username}'s tag to ${su.sanitize(tag)}.`);
      });

      plugins.slugmod.addExternalCommand({
        name: "resettag",
        desc: "Reset people's tags.",
        usage: "//resettag @user",
        plugin: "Renamer"
      }, (command, args, su)=>{
        if(!args[0]){
          su.sendACMessage("Failed to execute: Not enough arguments.");
          return;
        }
        let user = su.resolveMention(args[0]);
        if(!user){
          su.sendACMessage("Failed to execute: Invalid user.");
          return;
        }
        this.resetUserProp(user.id, "tag");
        su.sendACMessage(`Reset ${user.username}'s tag.`);
      });

      plugins.slugmod.addExternalCommand({
        name: "localnick",
        desc: "Set people's local nicknames.",
        usage: "//localnick @user #7289da nick",
        plugin: "Renamer"
      }, (command, args, su)=>{
        if(!args[1]){
          su.sendACMessage("Failed to execute: Not enough arguments.");
          return;
        }
        let user = su.resolveMention(args[0]);
        if(!user){
          su.sendACMessage("Failed to execute: Invalid user.");
          return;
        }
        let shorthandRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        let color = null;
        let nick = args.slice(1).join(" ");
        if(args[1].match(shorthandRegex)){
          color = args[1];
          nick = args.slice(2).join(" ");
        };
        let obj = {
          nick: nick
        }
        if(color) obj.color = color;
        this.setUserData(user, obj);
        su.sendACMessage(`Set ${user.username}'s local nickname to ${su.sanitize(nick)}.`);
      });

      plugins.slugmod.addExternalCommand({
        name: "resetlocalnick",
        desc: "Reset people's local nicknames.",
        usage: "//resetlocalnick @user",
        plugin: "Renamer"
      }, (command, args, su)=>{
        if(!args[0]){
          su.sendACMessage("Failed to execute: Not enough arguments.");
          return;
        }
        let user = su.resolveMention(args[0]);
        if(!user){
          su.sendACMessage("Failed to execute: Invalid user.");
          return;
        }
        this.resetUserProp(user.id, "nick");
        this.resetUserProp(user.id, "color");
        su.sendACMessage(`Reset ${user.username}'s local nickname.`);
      });
    }
  }

  static getReactInstance (node) { return node[ Object.keys(node).find((key) => key.startsWith("__reactInternalInstance")) ] }

  static getReactObject (node) { return ((inst) => (inst.memoizedProps._owner._instance))(Renamer.getReactInstance(node)) }

  getMemberListUser (node) {
    let inst = getReactInstance(node)
    inst.memoizedProps._props.children
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
    if (selection > -1) {
      parent.find(".regulars .ui-color-picker-swatch").eq(selection).addClass(".selected")
    } else if (useDefault) {
      parent.find(".default").addClass(".selected")
    } else {
      $(".custom", parent).addClass(".selected").css("backgroundColor", currentColor)
    }
    parent.on("click", ".ui-color-picker-swatch:not(.custom)", (e) => {
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
    let modalInner = $(this.modalMarkup2);
    modalInner.find(".modal-text-label").text("Tag Text")
    tag && tag.text && modalInner.find("#modal-text").val(tag.text)
    modalInner.find(".modal-reset-text").text("Delete Tag")
    modalInner.find(".color-picker-label").text("Tag Color")
    this.setSwatches(tag && tag.back, this.colourList, modalInner.find(".swatches"));
    let modal = new window.A.dialog('default', {
      title: 'Change User Tag',
      content: [modalInner[0],modalInner[2],modalInner[4]],
      buttons: [
        {
          text: 'Save',
          onClick: () => {
            const fore = ((c) => (c[ 0 ] * 0.299 + c[ 1 ] * 0.587 + c[ 2 ] * 0.114) > 186 ? "#000" : "#FFF")($(".ui-color-picker-swatch.selected").css("backgroundColor").slice(4, -1).split(", "))
            const back = ((result) => result == "rgb(153, 170, 181)" ? "#7289da" : result)($(".ui-color-picker-swatch.selected").css("backgroundColor"))
            this.setUserData(user, {
              tag: {
                text: modalInner.find("#modal-text").text(),
                back: ((result) => result == "rgb(153, 170, 181)" ? "#7289da" : result)($(".ui-color-picker-swatch.selected").css("backgroundColor")),
                fore: ((c) => (c[ 0 ] * 0.299 + c[ 1 ] * 0.587 + c[ 2 ] * 0.114) > 186 ? "#000" : "#FFF")($(".ui-color-picker-swatch.selected").css("backgroundColor").slice(4, -1).split(", "))
              }
            });
            modal.hide();
          }
        },
        {text: 'Cancel', style:'ghost'}
      ]
    });
    modalInner.on("click", ".modal-reset", (e) => {
        this.resetUserProp(user.id, "tag");
        modal.hide();
      })
    modal.show();
    modalInner.find("#modal-text").click().focus();
  }

  showInputModal (user) {
    let { nick, username, colour } = ((user) => user ? user : {})(this.getNickname(user.id))
    nick = nick ? nick : user.username;
    let custom,
      selection = this.colourList.indexOf(colour);
    //this.log(nick, username, colour)
    let modalInner = $(this.modalMarkup2);
    modalInner.find(".modal-text-label").text(`Nickname ${user.username}`)
    tag && tag.text && modalInner.find("#modal-text").val(nick)
    modalInner.find(".modal-reset-text").text("Reset Nickname")
    modalInner.find(".color-picker-label").text("Nickname Color")
    this.setSwatches(tag && tag.back, this.colourList, modalInner.find(".swatches"));
    let modal = new window.A.dialog('default', {
      title: 'Change Local Username',
      content: [modalInner[0],modalInner[2],modalInner[4]],
      buttons: [
        {
          text: 'Save',
          onClick: () => {
            this.setUserData(user, {
              nick: modalInner.find("#modal-text").text(),
              color: ((result) => result == "rgb(153, 170, 181)" ? null : result)($(".ui-color-picker-swatch.selected").css("backgroundColor"))
            });
            modal.hide();
          }
        },
        {text: 'Cancel', style:'ghost'}
      ]
    });
    modalInner.on("click", ".modal-reset", (e) => {
        this.resetUserProp(user.id, "tag");
        modal.hide();
      })
    modal.show();
    modalInner.find("#modal-text").click().focus();

    /*let colorGroup =
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
        modal.remove();
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
    modal.find("#nickname").click().focus();*/
  }

  resetUserProp (id, prop) {
    let settings = this.settings;
    delete settings.globals[ id ][ prop ];
    this.settings = settings;
    this.process(true);
  }

  setUserData (user, data) {
    let { nick, color, tag } = data;
    let { username, discriminator, id } = user;
    let settings = this.settings;
    if (settings.globals[ id ]) {
      this.log(username, "has new nickname", nick)
      if (nick) {
        settings.globals[ id ].nick = nick;
        settings.globals[ id ].colour = color
      }
      username && (settings.globals[ id ].username = username);
      discriminator && (settings.globals[ id ].discriminator = discriminator);
      if (tag) {
        settings.globals[ id ].tag = tag;
        this.log(username, "has tag", tag)
      }
      this.settings = settings;
      this.process(true);
    } else {
      settings.globals[ id ] = {
        id,
        username,
        discriminator,
      }
      this.settings = settings;
      this.setUserData(user, data);
    }
  }

  loadSettings () {
    this.settings = $.extend({}, this.defaultSettings, JSON.parse(window.DI.localStorage.getItem("DI-Renamer")));
  }

  getNickname (id, channel) {
    return this.settings.globals[ id ];
  }

  process (force) {
    let self = this;
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
    const start = Date.now()

    $(".chat .comment").each((i, group) => {
      try {
        let userData = this.getNickname(Renamer.getReactInstance(group).memoizedProps.children[ 0 ][ 0 ].props.message.author.id),
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
        const userData = this.getNickname(Renamer.getReactInstance(member).memoizedProps.children[ 0 ].props.user.id);
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
    $(".user-popout .discord-tag:not([renamer]), #user-profile-modal .discord-tag:not([renamer])").each((i, member) => {
      member.setAttribute("renamer", "");
      const userData = this.getNickname(Renamer.getReactInstance(member.parentNode).memoizedProps.children[member.parentNode.className === "header-info-inner" ? 0 : 1].props.user.id);
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

  contextMenu(props) {
    if(props.type === "member" || props.type === "groupMember"){
      window.A.contextMenu.fromArray([[{
        text: "Set Local Nickname",
        onClick: () => {
          this.showInputModal({id: props.user.id, username: props.user.username, discriminator: props.user.discriminator});
          props.element.style.display = "none";
        }
      },{
        text: "Set Local Tag",
        onClick: () => {
          this.showTagModal({id: props.user.id, username: props.user.username, discriminator: props.user.discriminator});
          props.element.style.display = "none";
        }
      }]]).appendToContextMenu(props.element);
    }
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
}

module.exports = Renamer;