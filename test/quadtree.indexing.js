/*
    Quad Tree Debugger 
    quad tree debug drawing node
*/

function QuadTreeDebugger(quad_tree) {
    this.tree = quad_tree;
}; u.extend(QuadTreeDebugger, Node);

QuadTreeDebugger.prototype.render = function(ctx) {
    if (this.parent.debug) {
        ctx.strokeStyle = "rgba(120, 120, 120, 0.5)";
        ctx.lineWidth = 1;

        this.renderNode(this.tree, ctx);
    }
};

QuadTreeDebugger.prototype.renderNode = function(node, ctx) {
    var bounds = node.bounds;

    ctx.fillStyle = "hsla(" + u.map(u.clamp(node.objects.length, 0, node.max_objects), 0, node.max_objects, 60, 0) + ", "  
        + u.map(u.clamp(node.objects.length, 0, node.max_objects), 0, node.max_objects, 55, 80) + "%, "
        + u.map(u.clamp(node.objects.length, 0, node.max_objects), 0, node.max_objects, 100, 63) + "%, 0.5)"

    ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

    if(node.nodes) {
        var nodes = node.nodes;
        this.renderNode(nodes[0], ctx);
        this.renderNode(nodes[1], ctx);
        this.renderNode(nodes[2], ctx);
        this.renderNode(nodes[3], ctx);
    }
}

/*
    Quad Tree Scene
    Scene with quad tree support
*/
function QuadTreeSceneNode(ctx, max_depth, max_items) {
    QuadTreeSceneNode._super.call(this, ctx);
    // max depth: 6, max children: 2
    this.tree = new QuadTree(this.getBounds(), 0, max_depth, max_items);
    this.objects = [];
}; u.extend(QuadTreeSceneNode, SceneNode);

QuadTreeSceneNode.prototype.update = function(dt, time) {
    QuadTreeSceneNode._super_method.update.call(this, dt, time);
    this.tree.wipe();
    this.tree.insertObjects(this.objects);
    // this.tree.updateObjects();
};

QuadTreeSceneNode.prototype.addNode = function(node) {
    QuadTreeSceneNode._super_method.addNode.call(this, node);
    if (node instanceof Circle) {
        this.objects.push(node);
        this.tree.insertObject(node);
    }
}

/*
    Circle
    Simple dummy test node
*/
function Circle(bounds) {
    if(!bounds) return;
    this.radius = u.randInt(4, 8);
    this.x = 200 + 25 * u.randInt(1, 20); //u.randFloat(bounds.x + this.radius, bounds.width - this.radius);
    this.y = 30 + 25 * u.randInt(1, 5); //u.randFloat(bounds.y + this.radius, bounds.height - this.radius);
    this.v = { x: u.randInt(-50, 50), y: u.randInt(-50, 50) };
    this.world_bounds = bounds;
}; u.extend(Circle, Node);

Circle.prototype.update = function(dt, time) {
    this.x += dt * this.v.x;
    this.y += dt * this.v.y;

    if(this.x < this.radius) {
        this.x = this.radius;
        this.v.x = -this.v.x;
    } else if (this.x > this.world_bounds.width - this.radius) {
        this.x = this.world_bounds.width - this.radius;
        this.v.x = -this.v.x;
    }

    if(this.y < this.radius) {
        this.y = this.radius;
        this.v.y = -this.v.y;
    } else if (this.y > this.world_bounds.height - this.radius) {
        this.y = this.world_bounds.height - this.radius;
        this.v.y = -this.v.y;
    }
}

Circle.prototype.draw = function(ctx) {
    ctx.strokeStyle = "rgba(120, 120, 120, 0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
    ctx.stroke();

    var dir_angle = Math.atan2(this.v.y, this.v.x),
        r2 = this.radius * 2,
        tip = { 
            x: r2 * Math.cos(dir_angle),
            y: r2 * Math.sin(dir_angle)
        }

    // velocity direction vector
    if (this.v.x || this.v.y) {
        ctx.strokeStyle = "rgba(150, 150, 150, 0.5)";
        ctx.beginPath();
        ctx.moveTo(tip.x + this.radius / 2 * Math.cos(dir_angle - 135 * u.TO_RADIANS), tip.y + this.radius / 2 * Math.sin(dir_angle - 135 * u.TO_RADIANS));
        ctx.lineTo(tip.x, tip.y);
        ctx.lineTo(tip.x + this.radius / 2 * Math.cos(dir_angle + 135 * u.TO_RADIANS), tip.y + this.radius / 2 * Math.sin(dir_angle + 135 * u.TO_RADIANS));
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(this.radius * 3 * Math.cos(180 * u.TO_RADIANS + dir_angle), this.radius * 3 * Math.sin(180 * u.TO_RADIANS + dir_angle));
        ctx.stroke();
    }

    if (this.debug) {
        var bounds = this.getBounds();
        ctx.strokeStyle = "rgba(190, 80, 80, 0.4)";
        ctx.strokeRect(-bounds.width / 2, -bounds.height / 2, bounds.width, bounds.height);
    }

};

Circle.prototype.getBounds = function() {
    return { 
        x: this.x - this.radius, 
        y: this.y - this.radius, 
        width: this.radius * 2, 
        height: this.radius * 2 
    };
}

function QuadTreeIndexingTest() {

    if(window._timer) window._timer.stop();

    var c = u.createCanvas('container'),
        ctx = c.getContext('2d'),
        n = 250,
        scene = new QuadTreeSceneNode(ctx, 6, 2),
        quad_tree_debuger = new QuadTreeDebugger(scene.tree);
        
    scene.debug = true;
    
    scene.addNode(quad_tree_debuger);

    for(var i = 0; i < n; i++) {
        scene.addNode(new Circle(scene.getBounds()));
    }    

    window._timer = new Timer(scene, "simple");
    
}

if(window.tests || (window.tests = {})) {
    window.tests.quadtreeindexing = {
        pack: "QuadTree",
        type: "Datastructures",
        name: "Quad Tree Indexing",
        desc: "Quadtree node subdivides when more then 2 objects are in the node's bounds. The max depth of the tree is 6. The more objects there are in an area the 'hotter' it gets. Example displays 250 balls moving.",
        test: QuadTreeIndexingTest
    };
}