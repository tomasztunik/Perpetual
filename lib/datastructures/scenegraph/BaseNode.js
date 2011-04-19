/*@
 * Node class
 * base scene object class 
 * can be transformed and automatically applies all its transformations to its children
 */

function BaseNode(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.parent = null;
    this._nodes = [];
};

BaseNode.prototype.addNode = function(node_ref) {
    this._nodes.push(node_ref);
    node_ref.parent = this;
};

BaseNode.prototype.removeNode = function(node_ref) {
    var nodes = this._nodes;
    for (var i = 0, n = nodes.length; i < n; i++) {
        if (nodes[i] === node_ref) {
            nodes.splice(i, 1);
            break;
        }
    }
};
    
BaseNode.prototype.render = function(ctx) {
    var nodes = this._nodes;
    if(this.draw) this.draw(ctx);
    for (var i = 0, n = this._nodes.length; i < n; i++) {
        nodes[i].render(ctx);
    }
};
    
BaseNode.prototype.update = function(dt, time) {
    var nodes = this._nodes;
    for (var i = 0, n = this._nodes.length; i < n; i++) {
        nodes[i].update(dt, time);
    }
};

BaseNode.prototype.getBounds = function() {
    return { x: 0, y: 0, width: this.width, height: this.height }
}