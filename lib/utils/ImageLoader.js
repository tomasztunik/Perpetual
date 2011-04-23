function ImageLoader() {}

ImageLoader.prototype.loadImages = function(paths, cb) {
	var self = this;
	this.cb = cb;
	this.load_count = paths.length
	for (var i = 0, n = this.load_count; i < n; i++) {
		var image = new Image();
		image.onload = function() {
			self.load_count -= 1;
			if (self.load_count == 0) {
				self.ready();
			}
		}		
		image.src = paths[i];
	}
}

ImageLoader.prototype.ready = function() {
	this.cb();
};