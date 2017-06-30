const Plugin = module.parent.require('../Structures/Plugin');


// Utility functions stolen from SO
function evalInContext(js, context) {
    return function() { return eval(js); }.call(context);
}

function addListeners(){
    document.getElementById('Repl-Div').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

}

function mouseUp(){
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
  let div = document.getElementById('Repl-Div');
  div.style.position = 'absolute';
  div.style.top = e.clientY-30 + 'px';
  div.style.left = e.clientX-30 + 'px';
}


class Repl extends Plugin {
    constructor() {
        super({
            author: 'martmists',
            version: '1.0.0',
            description: 'Gives you a REPL in Discord',
            color: '36393e'
        });
        // CSS to make it look fancy
        this.style = document.createElement('style');
        this.style.innerHTML = `
#Repl-Div {
    position: absolute;
    right: 20vw;
    top: 20vh;
    width: 12vw;
    height: 20vh;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.8);
}

#Repl-Input {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 12vw;
}

#Repl-Input:focus {
    outline: none;
}

#Repl-Code {
    word-wrap: break-word;
    oveflow-y: scroll;
    color: white;
}`;
        document.head.appendChild(this.style);


        // Create all elements
        this.div = document.createElement("div");
        this.div.id = "Repl-Div"
        this.sdiv = document.createElement("div");
        this.inp = document.createElement("input");
        this.inp.id = "Repl-Input"
        this.code = document.createElement("code");
        this.code.id = "Repl-Code"

        // Context object to be passed around
        this.ctx = {}

        // Put all elements together
        this.sdiv.appendChild(this.inp);

        this.div.appendChild(this.sdiv);
        this.div.appendChild(this.code);

        // Run eval on <enter> press
        this.inp.onkeydown = event => {
            if (event.keyCode == 13) {
                this.runCode();
            }
        }

        this.log("REPL Elements created!");

        document.body.appendChild(this.div);

        addListeners();

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
        this.code.innerHTML = this.ctx.res.toString();

        this.log(evalText + " -> " + this.code.innerHTML);
    }
}

module.exports = Repl;
