class Storage {
    constructor(plugin, name) {
        this.plugin = plugin;
        this.name = name;
    }
    get data() {
        if(!DI.localStorage.getItem(this.name)) DI.localStorage.setItem(this.name, '{"sets":[],"hideUrls":true,"sendEmbed":false}');
        return JSON.parse(DI.localStorage.getItem(this.name));
    }
    set data(data) { return DI.localStorage.setItem(this.name, JSON.stringify(data)); }
    get sets() { return this.data.sets; }
    set sets(sets) {
        let data = this.data;
        data.sets = sets;
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
        return this.sets = [];
    }

    getSet(name) { return this.sets.find(p => p.name === name) }
    indexOf(name) { 
        var sets = this.sets;
        let index = -1;
        for (var pack = 0; pack < sets.length; ++pack) {
            if (sets[pack].name === name) {
                index = pack;
                break;
            }
        }
        return index;
    }
    pushSet(set) {
        if(this.getSet(set.name)){
            this.plugin.log('Set is already in storage, aborting')
        } else {
            var sets = this.sets;
            sets.push(set);
            this.sets = sets;
            this.plugin.log(`Successfully added sticker set '${set.name}' to the storage`);
        }
    }
    deleteSet(name) { return this.sets = this.sets.filter(p => p.name !== name) }
    renameSet(name, newtitle) {
        if (!this.getSet(name)) {
            this.plugin.log(`getSet() returned undefined, sticker set '${name}' was not found in storage`);
            return;
        } else {
            var sets = this.sets;
            for (var pack = 0; pack < sets.length; ++pack) {
                if (sets[pack].name === name) {
                    sets[pack].title = newtitle;
                    this.sets = sets;
                    this.plugin.menu.rebuild();
                    break;
                }
            }
        }
    }
}

module.exports = Storage;