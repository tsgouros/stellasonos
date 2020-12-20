
class PlayheadCanvas {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = "fixed";
        this.canvas.style.top = "0px";
        this.canvas.style.left = "0px";
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

    }

    addEventHandler(name, func) {
        console.log(name);
        console.log(func);
        this.canvas.addEventListener(name, func, false);
    }

    paintDisplayBar(col) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(255, 0, 0, 1)";
        this.ctx.fillRect(col - 5, 0, 10, this.canvas.height);
    }

    paintVisualIndicationOfSonificationOnDisplayBar(col, row, val) {
        this.ctx.fillStyle = "rgba(0, 0, 255, 1)";
        this.ctx.fillRect(col - 5, row, 10, val * 5);
    }
}

export { PlayheadCanvas as default}