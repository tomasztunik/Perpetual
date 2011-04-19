/*@
 * SceneNode class
 * @extends BaseNode
 * main container for objects, app/game world - can be larger then canvas
 */
function SceneNode(ctx, width, height){
    // extra ctx check to prevent error when extending this class
    SceneNode._super.call(this, 0, 0, width || (ctx && ctx.canvas.width), height || (ctx && ctx.canvas.height));
    this._ctx = ctx;
}; u.extend(SceneNode, BaseNode);

SceneNode.prototype.init = function(ctx, width, height) {
    return this;
};

SceneNode.prototype.render = function() {
    var ctx = this._ctx,
        nodes = this._nodes;
    
    ctx.clearRect(0, 0, this.width, this.height);
    
    for (var i = 0, n = nodes.length; i < n; i++) {
        ctx.save();
        nodes[i].render(ctx);
        ctx.restore();
    }
};

SceneNode.prototype.update = function(dt, time) {
    var nodes = this._nodes;
    
    for (var i = 0, n =nodes.length; i < n; i++) {
        nodes[i].update(dt, time)
    }
}