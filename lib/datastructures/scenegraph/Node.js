/*@
 * Node class
 * @extends BaseNode
 * transformation node, allows for transformations of current node and its children
 */

function Node(x, y, width, height) {
    Node._super.apply(this, arguments);
    
    this.scale = null;
    this.translate = null;
    this.rotate = null;
    this.flip_x = false;
    this.flip_y = false;
    this.alpha = 1;
    
}; u.extend(Node, BaseNode);

Node.prototype.render = function(ctx) {
    ctx.save();

    ctx.transform(1, 0, 0, 1, this.x, this.y);
    
    if (this.rotate) {
        var cos = Math.cos(this.rotate),
            sin = Math.sin(this.rotate);
        ctx.transform(cos, sin, -sin, cos, 0, 0);
    }
    
    if (this.flip_x) {
        ctx.transform(1, 0, 0, -1, 0, 0);
    }
    
    if (this.flip_y) {
        ctx.transform(-1, 0, 0, 1, 0, 0);
    }
    
    if (this.scale) {
        ctx.transform(this.scale, 0, 0, this.scale, 0, 0);
    }
    
    if (this.alpha < 1) {
        ctx.globalAlpha = ctx.glbalAlpha * this.alpha;
    }

    Node._super_method.render.call(this, ctx);
    
    ctx.restore();
};
