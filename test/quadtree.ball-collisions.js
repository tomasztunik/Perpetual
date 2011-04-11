function Ball(bounds) {
    Ball._super.call(this, bounds);
    this.radius = u.randInt(2,4);
    this.x = u.randInt(this.radius, bounds.width - this.radius); 
    this.y = u.randInt(this.radius, bounds.height - this.radius);  
    this.mass = this.radius / 2;
    this.collided = false;
}; u.extend(Ball, Circle);

Ball.prototype.checkCollision = function(ball) {
    if(this.radius + ball.radius < Math.sqrt(Math.pow(ball.x - this.x, 2) + Math.pow(ball.y - this.y, 2))) {
        return false;
    } else {
        this.collided = true;
        ball.collided = true;
        return true;
    }
};

Ball.prototype.resolveCollision = function(ball) {
    // + position fix

    var dist = Math.sqrt(Math.pow(ball.x - this.x, 2) + Math.pow(ball.y - this.y, 2)),
        vec_dir = Vect2.substract(ball, this),
        vp1 = this.v.x * vec_dir.x / dist + this.v.y * vec_dir.y / dist,
        vp2 = ball.v.x * vec_dir.x / dist + ball.v.y * vec_dir.y / dist,
        dt = (this.radius + ball.radius - dist) / (vp1 - vp2);

    this.x -= this.v.x * dt;
    this.y -= this.v.y * dt;
    ball.x -= ball.v.x * dt;
    ball.y -= ball.v.y * dt;

    var vect_dir = Vect2.substract(ball, this),
        vect_un = Vect2.normal(vect_dir), // unit normal vector
        v1x = this.v.x  * vect_un.x + this.v.y * vect_un.y,
        v1y = -this.v.x * vect_un.y + this.v.y * vect_un.x,
        v2x = ball.v.x * vect_un.x + ball.v.y * vect_un.y,
        v2y = -ball.v.x * vect_un.y + ball.v.y * vect_un.x,
        elasticity_factor = 0.9,
        v1P = v1x + (1 + elasticity_factor) * (v2x - v1x) / (1 + this.mass / ball.mass),
        v2P = v2x + (1 + elasticity_factor) * (v1x - v2x) / (1 + this.mass / ball.mass);

    this.v.x = v1P * vect_un.x - v1y * vect_un.y;
    this.v.y = v1P * vect_un.y + v1y * vect_un.x;
    ball.v.x = v2P * vect_un.x - v2y * vect_un.y;
    ball.v.y = v2P * vect_un.y + v2y * vect_un.x;

    this.x += this.v.x * dt;
    this.y += this.v.y * dt;
    ball.x += ball.v.x * dt;
    ball.y += ball.v.y * dt;
};

Ball.prototype.draw = function(ctx) {
    if (this.collided) {
        ctx.fillStyle = "rgb(220, 50, 50)";
        this.collided = false;
    } else {
        ctx.fillStyle = "rgb(120, 120, 120)";
    }
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
    ctx.fill();


    // velocity direction vector
    if (this.v.x || this.v.y) {

        var dir_angle = Math.atan2(this.v.y, this.v.x),
            r2 = this.radius * 2,
            tip = { 
                x: r2 * Math.cos(dir_angle),
                y: r2 * Math.sin(dir_angle)
            }

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
}

Ball.prototype.update = function(dt, time) {
    Ball._super_method.update.call(this, dt, time);

    if(this.parent instanceof QuadTreeSceneNode) {

        var potential_collidees = this.parent.tree.getObjectsAtBounds(this.getBounds());

        if (potential_collidees) {
            for (var i = 0, n = potential_collidees.length; i < n; i++) {
                var collidee = potential_collidees[i];
                if(collidee == this) continue;
                if (this.checkCollision(collidee)) {
                    this.resolveCollision(collidee);
                }
            }
        }

    } 
}

function createCanvas() {
    var c = document.getElementById('perpetual'),
        w = c.width,
        h = c.height;
    c.parentNode.removeChild(c);

    c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.id = 'perpetual';
    document.body.appendChild(c);
}

function QuadTreeCollisionsTest() {

    if(window._timer) window._timer.stop();
    createCanvas();

    var c = document.getElementById('perpetual'),
        ctx = c.getContext('2d'),
        n = 800,
        scene = new QuadTreeSceneNode(ctx, 4, 2),
        quad_tree_debuger = new QuadTreeDebugger(scene.tree);

    scene.debug = false;
    
    // scene.addNode(quad_tree_debuger);

    for(var i = 0; i < n; i++) {
        scene.addNode(new Ball(scene.getBounds()));
    }    

    window._timer = new Timer(scene);
    
}

if(window.tests || (window.tests = {})) {
    window.tests.quadtreecollisions = {
        pack: "QuadTree",
        type: "Datastructures",
        name: "Quad Tree Collisions Test",
        desc: "800 balls with collision tests using quad tree.",
        test: QuadTreeCollisionsTest
    };
}