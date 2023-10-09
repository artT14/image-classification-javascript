class SketchPad{
    constructor(container,size=400){
        this.#initCanvas(container,size);
        this.#initControls(container);
        this.#initContext();
    }

    #initCanvas(container,size){
        this.canvas = document.createElement("canvas");
        this.canvas.width=size;
        this.canvas.height=size;
        this.canvas.style=`
            background-color: white;
            outline: 2px solid cyan;
        `;
        container.appendChild(this.canvas);
    }

    #initContext(){
        this.ctx = this.canvas.getContext("2d");
        this.reset();
        this.#addEventListeners();
    }

    #initControls(container){
        const br = document.createElement("br");
        container.appendChild(br);
        this.undoButton = document.createElement("button");
        this.undoButton.innerHTML="Undo";
        container.appendChild(this.undoButton);
    }

    reset(){
        this.paths = [];
        this.isDrawing = false;
        this.#redraw();
    }

    #addEventListeners(){
        // Click event
        this.canvas.onmousedown=(e)=>{
            // get [x,y] coordinates
            const mouse = this.#getMouse(e);
            this.paths.push([mouse]);
            this.isDrawing = true;
        }
        // Move event
        this.canvas.onmousemove=(e)=>{
            if(this.isDrawing){
                // get [x,y] coordinates
                const mouse = this.#getMouse(e);
                this.paths[this.paths.length-1].push(mouse);
                this.#redraw();
            }
        }
        document.onmouseup=()=>{this.isDrawing = false};
        // translate touch to mouse events
        this.canvas.ontouchstart=(e)=>{
            const loc = e.touches[0];
            this.canvas.onmousedown(loc);
        }
        this.canvas.ontouchmove=(e)=>{
            const loc = e.touches[0];
            this.canvas.onmousemove(loc);
        }
        document.ontouchend=()=>{document.onmouseup();}
        this.undoButton.onclick=()=>{
            this.paths.pop();
            this.#redraw();
        }
    }

    #redraw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        draw.paths(this.ctx, this.paths);
        this.undoButton.disabled = this.paths.length <= 0
    }

    #getMouse (e) {
        // get boundaries of canvas
        const rect = this.canvas.getBoundingClientRect();
        return [Math.round(e.clientX-rect.left), Math.round(e.clientY-rect.top)]
    }
}