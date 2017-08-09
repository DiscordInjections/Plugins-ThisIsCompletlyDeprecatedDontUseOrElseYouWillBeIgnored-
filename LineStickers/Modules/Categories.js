const $ = require('jquery');

class Categories {
    constructor(plugin) {
        this.plugin = plugin;
    }

    build(){
        let storage = this.plugin.storage.stickers;
        let categories = [];
        if (storage) {
            for (var pack = 0; pack < storage.length; ++pack) {
                categories.push(`<div class="item" data-id="${storage[pack].starting_id}" onclick='document.querySelector(\`#bda-qem-line-container .line-pack[data-id=\\"${storage[pack].starting_id}\\"]\`).scrollIntoView()' style='background-image: url("https://api.snazzah-is.cool/line-sticker/${storage[pack]['starting_id']}")'></div>`);
            }
        }
        const locale = this.plugin.locale;
        let numbersOnly = "return event.charCode >= 48 && event.charCode <= 57";

        var state = {
            'id': false,
            'length': true,
            'title': false
        };

        function validate() {
            function clearAndSet(target, state) {
                $(target).removeClass('valid');
                $(target).removeClass('invalid');
                $(target).addClass(state);
            }
            if (state['id'] && state['length'] && state['title']) {
                clearAndSet($('#bda-qem-line-container .line-add-button'), 'valid');
                return true;
            } else {
                clearAndSet($('#bda-qem-line-container .line-add-button'), 'invalid');
                return false;
            }
        };
        return [
            $(`<div class="add-form" style="opacity: 0; pointer-events: none;">`).append([
                $(`<div class="labels">`).append([
                    `<label for="line-add-title">${locale['addform-title']}</label>`,
                    `<label for="line-add-length">${locale['addform-length']}</label>`,
                    `<label for="line-add-id">${locale['addform-id']}</label>`
                ]),
                $(`<div class="inputs">`).append([
                    $(`<input id="line-add-title" placeholder="${locale['addform-title']}">`).keyup((event) => {
                        if ($(event.target).val()) state['title'] = true;
                        else state['title'] = false;
                        validate();
                    }),
                    $(`<input id="line-add-length" onkeypress="${numbersOnly}" placeholder="${locale['addform-length']}" value="40">`).keyup((event) => {
                        if (Number($(event.target).val())) state['length'] = true;
                        else state['length'] = false;
                        validate();
                    }),
                    $(`<input id="line-add-id" onkeypress="${numbersOnly}" placeholder="${locale['addform-id']}">`).keyup((event) => {
                        if (Number($(event.target).val().trim())) state['id'] = true;
                        else state['id'] = false;
                        validate();
                    })
                ]),
                $(`<button type="button" class="line-add-button ui-button filled brand small">`).append(
                    $(`<div class="ui-button-contents">${locale['addform-add']}</div>`)
                ).mouseenter(validate).on('click', (event) => {
                    if (validate()) {
                        var title = $('#line-add-title').val().trim();
                        var length = $('#line-add-length').val().trim();
                        var id = $('#line-add-id').val().trim();
                        this.plugin.lspack.appendPack(title, id, length);
                        $('#line-add-title').val('');
                        $('#line-add-length').val(40);
                        $('#line-add-id').val('');
                    }
                })
            ]),
            $(`<div class="categories-container">`).append(
                $(`<div class="categories-wrapper">`).append([
                    $(`<div class="item">`).append(
                        $(`<div class="add-pack icon-plus"></div>`).on('click', function(event) {
                            var state = $('#bda-qem-line-container .add-form').css('opacity');
                            if (state == '1') {
                                $(this).addClass('icon-plus');
                                $(this).removeClass('icon-minus');
                                $('#bda-qem-line-container .add-form').css('opacity', '0');
                                $('#bda-qem-line-container .add-form').css('pointer-events', 'none');
                            }
                            else if (state == '0') {
                                $(this).addClass('icon-minus');
                                $(this).removeClass('icon-plus');
                                $('#bda-qem-line-container .add-form').css('opacity', '1');
                                $('#bda-qem-line-container .add-form').css('pointer-events', 'unset');
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