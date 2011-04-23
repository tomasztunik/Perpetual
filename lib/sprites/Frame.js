frames = [];

/*
	Animation Frame Class

	scalingFn callback receives frame's canvas buffer (HTMLCanvasElement) as a parameter

*/

function Frame(image, coords, duration, scalingFn) {
	// image must be preloaded
	if (typeof image == 'string') {
		var tmp = new Image();
		tmp.src = image;
		image = tmp;
	}

	this.buffer = document.createElement('canvas');
	if (typeof coords == 'object') {
		// there are coordinates passed so it's image from spritesheet
		this.buffer.width = this.width = coords.width;
		this.buffer.height = this.height = coords.height;
		this.buffer.getContext('2d').drawImage(image, coords.x, coords.y, this.width, this.height, 0, 0, this.width, this.height);
	} else {
		// it's normal image
		this.buffer.width = this.width = image.width;
		this.buffer.height = this.height = image.height;
		this.buffer.getContext('2d').drawImage(image, 0, 0);
	}

	this.duration = (typeof coords == 'number' ? coords : duration) || 0.2;
	scalingFn = typeof duration == 'string' ? duration : scalingFn;

	if (scalingFn) {
		this.buffer = scalingFn(this.buffer);
		this.width = this.buffer.width;
		this.height = this.buffer.height;
	}


	frames.push(this);
}

Frame.prototype.draw = function(ctx) {
	ctx.drawImage(this.buffer, -this.width / 2, -this.height / 2, this.width, this.height);
};