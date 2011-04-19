u.setShadow = function(ctx, x, y, blur, color) {
    ctx.shadowOffsetX = x;
    ctx.shadowOffsetY = y;
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;

}

function CircleShape(x, y, r, fill, stroke, shadow) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.fill = fill || null;
    this.stroke = stroke || null;
    if (!this.fill && !this.stroke) {
        this.fill = "rgba(255, 0, 255, 0.8)";
    }
}

CircleShape.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
    }
    if (this.stroke) {
        ctx.strokeStyle = this.stroke;
        ctx.stroke();
    }
}

function CreatureSegment(root, length) {
    this.root
    this.length = length;
} u.extend(CreatureSegment, Node);

CreatureSegment.prototype.update = function(dt, time) {
    
};

function Creature(segments_count, bounds) {
    Creature._super.apply(this, arguments);
    this.glow_blur = 5;
    this.segments = [];
    this.accured_time;
    this.x = this.org_x = bounds.width / 2;
    this.y = this.org_y = bounds.height / 2;

    this.segments.push(new CircleShape(0, 0, 8, "rgba(255, 255, 255, 0.6)"));


} u.extend(Creature, Node);

Creature.prototype.update = function(dt, time) {
    this.x = this.org_x + Math.cos(time / 4.1 * Math.PI * 2) * this.parent.height / 4,
    this.y = this.org_y + Math.sin(time / 3.3 * Math.PI * 2) * this.parent.height / 4;
    this.segments[0].radius = u.map(Math.sin(time / 2 * Math.PI * 2), -1, 1, 4, 8);
    this.glow_blur = u.map(Math.sin(time / 3 * Math.PI * 2), -1, 1, 1, 20);
};

Creature.prototype.draw = function(ctx) {
    ctx.save()
    u.setShadow(ctx, 0, 0, this.glow_blur, "#ffffff");
    this.segments[0].draw(ctx)
    ctx.restore();
};

function Plankton(bounds) {
    this.x = Math.random() * bounds.width;
    this.y = Math.random() * bounds.height;
    this.radius = u.randFloat(0.75, 2.5);
    this.color = "hsla(" + u.randInt(120, 180) + ", 75%, 25%, " + u.randFloat(0.25, 0.8).toFixed(2) + ")"; 
    this.shape = new CircleShape(0, 0, this.radius, this.color);
    this.time_factor = u.randInt(3, 9);
}; u.extend(Plankton, Node);

Plankton.prototype.update = function(dt, time) {
    this.shape.x += Math.sin(time / this.time_factor  * Math.PI * 2) * 2;
}

Plankton.prototype.draw = function(ctx) {
    ctx.save();
    u.setShadow(ctx, 0, 0, 5, "#ffffff");
    this.shape.draw(ctx);
    ctx.restore();
};

function DeepSeaSceneNode(ctx) {
    DeepSeaSceneNode._super.call(this, ctx);
}; u.extend(DeepSeaSceneNode, SceneNode);

DeepSeaSceneNode.prototype.render = function() {
    var ctx = this._ctx,
        nodes = this._nodes;
    
    ctx.fillStyle = "#111122";
    ctx.fillRect(0, 0, this.width, this.height);
    
    for (var i = 0, n = this._nodes.length; i < n; i++) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        nodes[i].render(ctx);
    }
};

function DeepSeaTest() {

    if(window._timer) window._timer.stop();

    var c = u.createCanvas('container'),
        ctx = c.getContext('2d'),
        scene = new DeepSeaSceneNode(ctx),
        scene_bounds = scene.getBounds(),
        n = 1,
        plankton_n = 200;
        
    for(var i = 0; i < n; i++) {
        var node = new Creature(5, scene_bounds);
        scene.addNode(node);
    }

    for (var i = 0; i < plankton_n; i++) {
        scene.addNode(new Plankton(scene_bounds));
    }
    
    window._timer = new Timer(scene, "simple");
}

if(window.tests || (window.tests = {})) {
    window.tests.deepsea = {
        pack: "Concept",
        type: "Drawing technique",
        name: "Deep Sea Creatures",
        desc: "work in progress",
        test: DeepSeaTest
    };
}