function Animation(frames, type) {
	this.type = type || 'loop';
	this.frames = [];
	if (frames && frames.length) {
		this.frames = this.frames.concat(frames);
	}
	if (this.frames.length > 0) {
		this.cur_frame = this.frames[0];
		this.cur_frame_index = 0;
	}
	if (this.type == 'pingpong') {
		this.dir = 1;
	}

	this.time = 0;
}

Animation.prototype.addFrame = function(frame, duration) {
	if (duration) {
		frame.duration = duration;
	}
	if (!this.cur_frame) {
		this.cur_frame = frame;
	}
	this.frames.push(frame)
};

Animation.prototype.update = function(dt) {
	var cur_frame = this.frames[this.cur_frame];
	this.time += dt;
	if (this.time >= this.cur_frame.duration) {
		this.time -= this.cur_frame.duration;
		this.nextFrame();
	}
}

Animation.prototype.draw = function(ctx) {
	this.cur_frame.draw(ctx);
}

Animation.prototype.nextFrame = function() {
	if (this.type == 'loop') {
		this.cur_frame_index += 1;
		if(this.cur_frame_index == this.frames.length) {
			this.cur_frame_index = 0;
		}
	} else if (this.type == 'once') {
		this.cur_frame_index += 1;
		if(this.cur_frame_index == this.frames.length) {
			this.cur_frame_index -= 1;
		}
	} else if (this.type == 'pingpong') {
		this.cur_frame_index += this.dir;
		if (this.dir == 1) {
			if(this.cur_frame_index == this.frames.length) {
				this.dir = -1;
				this.cur_frame_index -= 2;
			}
		} else {
			if(this.cur_frame_index == -1) {
				this.dir = 1;
				this.cur_frame_index += 2;
			}
		}
	}
	this.cur_frame = this.frames[this.cur_frame_index];
}