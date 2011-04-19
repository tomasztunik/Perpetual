/*
    TODO: test worlds with non inverted axes
    TODO: tune everything to work with non full-screen apps
    TODO: add drawing visibility check vs camera view bounds
*/

function Camera2d(ctx, target_node, zoom, scale, world_bounds, invert_camera) {
    if(!ctx) return;

    this._ctx = ctx;

    this.target = target_node || null;
    this.world_bounds = world_bounds; // should be passed in world's units
    this.scale = scale || 1; // how many pixels equals to one unit at zoom 1 (ex 40px == 1 meter then scale equals 40)
    this.invert_camera = invert_camera || false; // invert y axis when drawing (0, 0) is in the bottom left) - useful for box2d
    this.zoom = zoom || 1; // values from 0 to 1 zoom outs,  > 1 zoom ins

    this.x = 0; // always in world units - ignores zoom
    this.y = 0; // ignores zoom
    this.width = ctx.canvas.width / (scale * zoom); // in units 1 unit = 1 pixel / (scale * zoom)
    this.height = ctx.canvas.height / (scale * zoom);

    if (target_node) { // if target node was set center at it
        this.target = target_node;
        this.centerAt(target_node.x, target_node.y);
    } else if (world_bounds) { // if world's bounds were set center at its center
        this.centerAt(world_bounds.width / 2, world_bounds.height / 2);
    }

    this.updateViewBounds(); // update the viewing bounds based on zoom, scale and camera focus position (x, y)

}

Camera2d.prototype.updateViewBounds = function() {
    this.view_bounds = {
        x: this.x - this.width / 2,
        y: this.y - this.height / 2,
        x2: this.x + this.width / 2,
        y2: this.y + this.height / 2
    }
}

Camera2d.prototype.centerAt = function(x, y) {
    this.x = x;
    this.y = y;
    this.updateViewBounds();
}

Camera2d.prototype.moveBy = function(x, y, invert_movement) {
    var mod = invert_movement ? -1 : 1;
    this.x += mod * x;
    this.y += mod * ((this.invert_camera) ? -y : y);
    this.updateViewBounds();
}
Camera2d.prototype.follow = function(target, speed, dt) {

}

Camera2d.prototype.transformView = function() {

    var scale = this.scale,
        zoom = this.zoom;

    if(this.invert_camera) {
        this._ctx.setTransform(scale * zoom, 0, 0, -scale * zoom, -this.view_bounds.x * scale * zoom, this._ctx.canvas.height + this.view_bounds.y * scale * zoom);
    } else {
        this._ctx.setTransform(scale * zoom, 0, 0, scale * zoom, -this.view_bounds.x * scale * zoom, this.view_bounds.y * scale * zoom);
    }
}

Camera2d.prototype.setZoom = function(zoom) {
    var canvas = this._ctx.canvas;
    this.zoom = zoom;

    this.clearView();

    this.width = canvas.width / (this.scale * zoom);
    this.height = canvas.height / (this.scale * zoom);

    this.updateViewBounds();

    return zoom;
};

Camera2d.prototype.centerAtMouse = function(e) {
    var canvas = this._ctx.canvas;
    // this.centerAt(e.clientX * this.world_bounds.width * this.zoom / canvas.width, (canvas.height - e.clientY) * this.world_bounds.height * this.zoom / canvas.height); 
}

Camera2d.prototype.clearView = function() {
    var view = this.view_bounds;
    this._ctx.clearRect(view.x, view.y, this.width, this.height); // clears only the visible area pixels - makes it more efficient at zoom values > 1
}

Camera2d.prototype.getWorldPosition = function(x, y) {
    var canvas = this._ctx.canvas,
        view = this.view_bounds;

    return {
        x: u.map(x, 0, canvas.width, view.x, view.x2), 
        y: (!this.inverse) ? u.map(y, 0, canvas.height, view.y2, view.y) : u.map(y, 0, canvas.height, view.y, view.y2)
    };
}