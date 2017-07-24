const Plugin = module.parent.require('../Structures/Plugin');

// Utility functions stolen from SO
function evalInContext(js, ctx) {
    return function() { return eval(js); }.call(ctx);
}


class Repl extends Plugin {
    constructor(...args) {
        super(...args);
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
        this.ctx = { log: this.log };

        this.sdiv.appendChild(this.code);

        this.div.appendChild(this.inp);
        this.div.appendChild(this.sdiv);

        // Run eval on <enter> press
        this.inp.onkeydown = event => {
            if (event.keyCode == 13) {
                this.runCode();
            }
        }

        document.body.appendChild(this.div);

        this.log("REPL Elements created!");

        this.registerCommand({
            name: 'hide-repl',
            info: 'hide the REPL',
            func: this.hiderepl.bind(this)
        })
        this.log("added //hide");

        this.registerCommand({
            name: 'show-repl',
            info: 'show the REPL',
            func: this.showrepl.bind(this)
        })
        this.log("added //show");

        /* BEGIN DRAGGABLE CODE */
        this.el_y = 0;
        this.el_x = 0;
        this.y = 0;
        this.x = 0;
        this.selected = null;
        this.hidden = false;

        this.div.onmousedown = this.select.bind(this);
        this.log("added onmousedown");


        document.onmousemove = this.drag.bind(this);
        this.log("added onmousemove");

        document.onmouseup = this.unselect.bind(this);
        this.log("added onmouseup");

        this.log("REPL added!");
    }

    select(el) {
        el = el.toElement;
        while (el.parentElement.localName != "body")
            el = el.parentElement;
        this.selected = el;
        this.el_y = this.y - el.offsetTop;
        this.el_x = this.x - el.offsetLeft;
    }

    drag(e) {
        this.y = document.all ? window.event.clientY : e.pageY;
        this.x = document.all ? window.event.clientX : e.pageX;
        if (this.selected != null) {
            // Apparently this.selected is undefined here?
            this.selected.style.left = this.x - this.el_x + "px";
            this.selected.style.top = this.y - this.el_y + "px";
        }
    }

    unselect() {
        this.selected = null;
    }

    /* END DRAGGABLE CODE */


    hiderepl() {
        if (!this.hidden) {
            document.body.removeChild(this.div);
            this.hidden = true;
        }
    }

    showrepl() {
        if (this.hidden) {
            document.body.appendChild(this.div);
            this.hidden = false;
        }
    }

    runCode() {
        // Get value and clear result
        let evalText = this.inp.value;
        this.code.innerHTML = '';

        try {
            // Eval, on error, res = error
            // `res` is the latest eval result
            this.ctx.res = evalInContext(evalText, this.ctx);
        } catch (e) {
            this.ctx.res = e;
        }

        // Return the result
        this.code.innerHTML = this.ctx.res;

        this.log(evalText + " -> " + this.code.innerHTML);
    }

    unload() {
        if (!this.hidden) {
            document.body.removeChild(this.div);
        }
        this.div = null;
    }
};

module.exports = Repl;
