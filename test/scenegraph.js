var Rect = function(x, y, width, height) { 
    Rect._super.call(this, x, y, width, height);
    this.rotation_factor = u.randInt(2, 4);
    this.circ_motion_factor = u.randFloat(2, 4);
}; u.extend(Rect, Node);

Rect.prototype.init = function(x, y, w, h) {
    return this;
};

Rect.prototype.draw = function(ctx) {
        if (this.parent instanceof Rect) {
            ctx.fillStyle = "rgba(44, 44, 44, 0.8)";
        } else {
            ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
        }
        ctx.fillRect(-this.width / 2, -this.height /2, this.width, this.height);
};

Rect.prototype.update = function(dt, time) {
    
    Rect._super_method.update.apply(this, arguments);
    
    if (this.parent instanceof Rect) {
        this.x = (Math.sin(time / this.circ_motion_factor * Math.PI * 2) * 20);
        this.y = (Math.cos(time / this.circ_motion_factor * Math.PI * 2) * 20);
        this.rotate = u.map(time / this.rotation_factor * 100 % 36, 0, 35, 0, Math.PI * 2);
    } else {
        if(!this.root_pos) {
            this.root_pos = {
                x: this.x, 
                y: this.y
            };
        }
        this.x = this.root_pos.x + (Math.cos(time / this.circ_motion_factor * Math.PI * 2) * 40);
        this.y = this.root_pos.y + (Math.sin(time / this.circ_motion_factor * Math.PI * 2) * 40);
    }
}

var Link = function(node){
    Link._super.call(this, 0, 0);
    this.to = node;
}; u.extend(Link, Node);

Link.prototype.init = function(node) {
    return this;
}

Link.prototype.draw = function(ctx) {
    ctx.strokeStyle = "rgba(220, 120, 120, 0.8)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.stroke();
}

function ScenegraphTest() {

    if(window._timer) window._timer.stop();

    var c = u.createCanvas('container'),
        ctx = c.getContext('2d'),
        scene = new SceneNode(ctx),
        n = 250;
        
    for(var i = 0; i < n; i++) {
        var node = new Rect(u.map(Math.random(), 0, 1, 50, c.width - 50), u.map(Math.random(), 0, 1, 50, c.height - 50), 20, 20),
            child_node = new Rect(u.map(Math.random(), 0, 1, 10, 40), u.map(Math.random(), 0, 1, 10, 40), 10, 10),
            link_node = new Link(child_node);

        node.rotate = u.map(Math.random(), 0, 1, 0, Math.PI);
        child_node.rotate = u.map(Math.random(), 0, 1, 0, Math.PI);
        
        node.addNode(child_node);
        node.addNode(link_node);
        scene.addNode(node);
    }
    
    window._timer = new Timer(scene, "simple");
}

if(window.tests || (window.tests = {})) {
    window.tests.scenegraph = {
        pack: "Scene graph",
        type: "Datastructures",
        name: "Scene and Dependency Graph Test",
        desc: "Scene graph allows to easily (as in automatically) apply transformations to child objects. Example shows 250 complex objects (each build out of 3 objects).",
        test: ScenegraphTest
    };
}