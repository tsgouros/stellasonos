class ImageCanvas {
	constructor(){
		//output canvas
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.position = "fixed";
		this.canvas.style.top = "0px";
		this.canvas.style.left = "0px";

		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		document.body.appendChild(this.canvas);
		this.loadImage("./images/nightsky.jpg");

		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
			this.setImageData();
		});
	}

	loadImage(filename) {
		var img = new Image();
		img.src = filename;
		img.onload = function () {
			//this.ctx.fillStyle = "rgb(0, 0, 0)";
			//this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			//this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
			this.setImageData();
		}.bind(this);
		this.img = img;
	}

	setImageData() {
		this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.imageData = this.data.data;
	}
}

export { ImageCanvas as default}