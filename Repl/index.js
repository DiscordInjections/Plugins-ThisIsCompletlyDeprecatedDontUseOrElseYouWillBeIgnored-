const Plugin = module.parent.require('../Structures/Plugin');
const $ = require("jquery");


// Utility functions stolen from SO
function evalInContext(js, ctx) {
    return function() { return eval(js); }.call(ctx);
}


class Repl extends Plugin {
    constructor(...args) {
        super(...args);
        document.head.appendChild(this.style);


        // Create all elements
        this.div = document.createElement("div");
        this.div.id = "Repl-Div"
        this.inp = document.createElement("input");
        this.inp.id = "Repl-Input"
        this.sdiv = document.createElement("div");
        this.sdiv.id = "Repl-Code-Div"
        this.code = document.createElement("code");
        this.code.id = "Repl-Code"

        // Context object to be passed around
        this.ctx = {};

        this.sdiv.appendChild(this.code);

        this.div.appendChild(this.inp);
        this.div.appendChild(this.sdiv);

        // Run eval on <enter> press
        this.inp.onkeydown = event => {
            if (event.keyCode == 13) {
                this.runCode();
            }
        }

        this.log("REPL Elements created!");

        document.body.appendChild(this.div);

        $(function() {
            $("#Repl-Div").draggable();
        });

        this.log("REPL added!")
    }

    runCode() {
        // Get value and clear result
        let evalText = this.inp.value;
        this.code.innerHTML = '';

        try {
            // Eval, on error, res = error
            // `res` is the latest eval result
            this.ctx.res = evalInContext(evalText, this.ctx);
        } catch(e) {
            this.ctx.res = e;
        }

        // Return the result
        this.code.innerHTML = this.ctx.res;

        this.log(evalText + " -> " + this.code.innerHTML);
    }
}

module.exports = Repl;
