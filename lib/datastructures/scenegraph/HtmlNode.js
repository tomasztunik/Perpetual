function HtmlNode(x, y, width, height) {
    Node._super.apply(this, arguments);

    this.scale = null;
    this.translate = null;
    this.rotate = null;
    this.flip_x = false;
    this.flip_y = false;
    this.alpha = 1;

    this.offset_x = 0;
    this.offset_y = 0;
    
}; u.extend(HtmlNode, BaseNode);

HtmlNode.prototype.addNode = function(node_ref) {
    HtmlNode._super_method.addNode.call(this, node_ref);
    node_ref.createElement(this.el);
};

HtmlNode.prototype.createElement = function(ctx) {}; // create element is called by addNode

HtmlNode.prototype.render = function() {

	// translate the x and y coords to reflect the real center of the node
	var tx = this.x - this.width / 2 + this.offset_x,
		ty = this.y - this.height / 2 + this.offset_y,
		m = M2.identity(),
		style = this.style;

	if(this.parent instanceof HtmlNode) {
		// if it is a child of another node set its orgin to the center of its parent node
		tx += this.parent.width / 2;
		ty += this.parent.height / 2;
	}

    if (this.rotate) {
        var cos = Math.cos(this.rotate),
            sin = Math.sin(this.rotate);

    	m = M2.product(m, [
    			[cos, -sin],
    			[sin, cos]
	    	])
    }
    
    if (this.flip_x) {
    	m = M2.product(m, [
    			[1, 0],
    			[0, -1]
	    	]);
    }
    
    if (this.flip_y) {
    	m = M2.product(m, [
    			[-1, 0],
    			[0, 1]
	    	]);
    }
    
    if (this.scale) {
    	m = M2.product(m, [
    			[this.scale, 0],
    			[0, this.scale]
	    	]);
    }
    
    style += "-webkit-transform: matrix(" + m[0][0] + ", " + m[1][0] + ", " + m[0][1] + ", " + m[1][1] + ", " + tx + ", " + ty +");";

    if (this.alpha < 1) {
    	style += "opacity: " + this.alpha + ";"
    }
    this.el.style.cssText = style;

    Node._super_method.render.call(this);
    
};
