function Camera2D() {}

Camera2D.prototype.init = function(ctx, world_bounds, target_node, bounds_offset) {
	
	this.half_width = ctx.canvas.width / 2;
	this.half_height = ctx.canvas.height / 2;
	
	if (!view_bounds) {
		this.bounds = new geo.Rect(this.half_width, this.half_height, world_node.width - this.half_width, world_node.height - this.half_height);
	} else {
		this.bounds = new geo.Rect(bounds_offset.pos.x + this.half_width, bounds_offset.pos.y + this.half_height, bounds_offset.width - this.half_width, bounds_offset.height - this.half_height);
	}
	 	
	if (target_node) {
		this.target = target_node;
		this.x;
		this.y;
	} else {
		this.target = null;
		this.x = world_bounds.width / 2;
		this.x = world_bounds.height / 2;
	}
	
	return this;
}

Camera2D.prototype.follow = function() {
	var target = this.target;
	if (target && target.active) {
		this.x = target.x - this.half_width;
		this.y = target.y - this.half_height;  
	}
}
