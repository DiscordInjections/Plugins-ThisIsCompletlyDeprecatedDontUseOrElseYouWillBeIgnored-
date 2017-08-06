const $ = require('jquery');
const superagent = require('superagent');

class Categories {
    constructor(plugin) {
        this.plugin = plugin;
    }

    build(){
        let storage = this.plugin.storage.sets;
        let categories = [];
        if (storage) {
            for (var set = 0; set < storage.length; ++set) {
                categories.push(`<div class="item" data-name="${storage[set].name}" onclick='document.querySelector(\`#bda-qem-telegram-container .line-pack[data-name=\\"${storage[set].name}\\"]\`).scrollIntoView()' style='background-image: url("https://api.snazzah-is.cool/telegram/${storage[set].name}/${storage[set].files[0]}")'></div>`);
            }
        }

        return [
            $(`<div class="add-form" style="opacity: 0; pointer-events: none;">`).append([
                $(`<div class="labels">`).append([
                    `<label for="line-add-title">Name</label>`
                ]),
                $(`<div class="inputs">`).append([
                    `<input id="line-add-title" placeholder="Name">`,
                    `<label id="telegram-status"></label>`
                ]),
                $(`<button type="button" class="line-add-button ui-button filled brand small">`).append(
                    $(`<div class="ui-button-contents">Add</div>`)
                ).on('click', (event) => {
                    $('#telegram-status').removeClass('bad').text('Requesting...');
                    var title = $('#line-add-title').val().trim();
                    superagent.get(`https://api.snazzah-is.cool/telegram/${title.split("/")[0]}`).then(res => {
                        this.plugin.log(res.body);
                        if(!$('#bda-qem-telegram-container')[0]) return;
                        this.plugin.pack.appendSet(res.body);
                        $('#line-add-title').val('');
                    }).catch(e => {
                        if(!$('#bda-qem-telegram-container')[0]) return;
                        if(e.response && e.response.statusCode === 404) $('#telegram-status').addClass('bad').html('Not found - <a onclick="window.open(\'https://gist.github.com/SnazzyPine25/a3388954d5e386a35ae39d9d00962adb\')">Publish a sticker set</a>');
                            else {
                                $('#telegram-status').addClass('bad').text('Invalid request, check console');
                                this.plugin.error(e);
                        }
                    });
                })
            ]),
            $(`<div class="categories-container">`).append(
                $(`<div class="categories-wrapper">`).append([
                    $(`<div class="item">`).append(
                        $(`<div class="add-pack icon-plus"></div>`).on('click', function(event) {
                            var state = $('#bda-qem-telegram-container .add-form').css('opacity');
                            if (state == '1') {
                                $(this).addClass('icon-plus');
                                $(this).removeClass('icon-minus');
                                $('#bda-qem-telegram-container .add-form').css('opacity', '0');
                                $('#bda-qem-telegram-container .add-form').css('pointer-events', 'none');
                            }
                            else if (state == '0') {
                                $(this).addClass('icon-minus');
                                $(this).removeClass('icon-plus');
                                $('#bda-qem-telegram-container .add-form').css('opacity', '1');
                                $('#bda-qem-telegram-container .add-form').css('pointer-events', 'unset');
                            }
                        })
                    ),
                    ...categories
                ]).bind('mousewheel', function(event) {
                    if ((event.originalEvent.wheelDelta || event.originalEvent.detail) > 0){
                        this.scrollLeft -= 25;
                    } else {
                        this.scrollLeft += 25;
                    }
                    return false;
                })
            )
        ]
    }
}

module.exports = Categories;