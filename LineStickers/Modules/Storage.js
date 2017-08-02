class Storage {
    constructor(plugin, name) {
        this.plugin = plugin;
        this.name = name;
    }
    get data() {
        if(!DI.localStorage.getItem(this.name)) DI.localStorage.setItem(this.name, '{"stickers":[],"hideUrls":true,"sendEmbed":false}');
        return JSON.parse(DI.localStorage.getItem(this.name));
    }
    set data(data) { return DI.localStorage.setItem(this.name, JSON.stringify(data)); }
    get stickers() { return this.data.stickers; }
    set stickers(stickers) {
        let data = this.data;
        data.stickers = stickers;
        return this.data = data;
    }
    get hideUrls() { return this.data.hideUrls; }
    set hideUrls(hideUrls) {
        let data = this.data;
        data.hideUrls = hideUrls;
        return this.data = data;
    }
    get sendEmbed() { return this.data.sendEmbed; }
    set sendEmbed(sendEmbed) {
        let data = this.data;
        data.sendEmbed = sendEmbed;
        return this.data = data;
    }
    wipe() {
        return this.stickers = [];
    }

    getPack(id) { return this.stickers.find(p => p.starting_id === id) }
    pushPack(pack) {
        if(this.getPack(pack.starting_id)){
            this.plugin.log('Pack is already in storage, aborting')
        } else {
            var stickers = this.stickers;
            stickers.push(pack);
            this.stickers = stickers;
            this.plugin.log(`Successfully added pack '${pack.title}' to the storage`);
        }
    }
    deletePack(id) { return this.stickers = this.stickers.filter(p => p.starting_id !== id) }
    swapPack(from, to) {
        let stickers = this.stickers;
        let temp = stickers[from];
        stickers[from] = stickers[to];
        stickers[to] = temp;
        return this.stickers = stickers;
    }
    renamePack(id, newtitle) {
        if (!this.getPack(id)) {
            this.plugin.log(`getPack() returned undefined, pack ${id} was not found in storage`);
            return;
        } else {
            var stickers = this.stickers;
            for (var pack = 0; pack < stickers.length; ++pack) {
                if (stickers[pack].starting_id === id) {
                    stickers[pack].title = newtitle;
                    this.stickers = stickers;
                    this.plugin.menu.rebuild();
                    break;
                }
            }
        }
    }
}

module.exports = Storage;