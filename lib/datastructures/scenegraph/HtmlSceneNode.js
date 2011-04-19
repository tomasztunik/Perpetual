/*@
 * HtmlSceneNode class
 * @extends BaseNode
 * main container for objects, app/game world - can be larger then canvas
 */
function HtmlSceneNode(ctx, width, height){
    // extra ctx check to prevent error when extending this class
    HtmlSceneNode._super.call(this, 0, 0, width || (ctx && ctx.offsetWidth), height || (ctx && ctx.offsetHeight));
    this._ctx = ctx;
}; u.extend(HtmlSceneNode, BaseNode);

HtmlSceneNode.prototype.addNode = function(node_ref) {
    HtmlSceneNode._super_method.addNode.call(this, node_ref);
    node_ref.createElement(this._ctx);
};

HtmlSceneNode.prototype.render = function() {

    var nodes = this._nodes,
        wrap = this._ctx.parentNode;

    wrap.removeChild(this._ctx);

    for (var i = 0, n = nodes.length; i < n; i++) {
        nodes[i].render();
    }
    wrap.appendChild(this._ctx);

};

HtmlSceneNode.prototype.update = function(dt, time) {
    var nodes = this._nodes;
    for (var i = 0, n = nodes.length; i < n; i++) {
        nodes[i].update(dt, time)
    }
}
