const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");

class DoubleClickEdit extends Plugin {
    constructor(...args) {
        super(...args);
        $(document).on("dblclick.dce", function(e) {
            var target = $(e.target);
            if(target.parents(".message").length > 0) {
                var msg = target.parents(".message").first();
                var opt = msg.find(".btn-option");
                opt.click();

                $.each($(".popout .btn-item"), (index, value) => {
                    var option = $(value);
                    if(option.text() === "Edit") {
                        option.click();
                    }
                });

            }
        });
    }

    unload() {$(document).off("dblclick.dce")}
}

module.exports = DoubleClickEdit;