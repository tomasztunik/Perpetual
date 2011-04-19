function BruteSceneNode(ctx) {
    BruteSceneNode._super.call(this, ctx);
    this.objects = [];
} u.extend(BruteSceneNode, SceneNode);

BruteSceneNode.prototype.addNode = function(node) {
    QuadTreeSceneNode._super_method.addNode.call(this, node);
    if (node instanceof Ball) {
        this.objects.push(node);
    }
}

BruteSceneNode.prototype.update = function(dt, time) {
    BruteSceneNode._super_method.update.call(this, dt, time);

    var balls = this.objects;

    for (var i = 0, n = balls.length; i < n; i++) {
        var ball = balls[i];
        for (var j = i + 1; j < n; j++) {
            if(ball.checkCollision(balls[j])) {
                ball.resolveCollision(balls[j]);
            }
        }
    }


};

function BruteForceCollisionsTest() {

    if(window._timer) window._timer.stop();

    var c = u.createCanvas('container'),
        ctx = c.getContext('2d'),
        n = 900,
        scene = new BruteSceneNode(ctx);
    
    for(var i = 0; i < n; i++) {
        scene.addNode(new Ball(scene.getBounds()));
    }    

    window._timer = new Timer(scene, "deterministic");
    
}

if(window.tests || (window.tests = {})) {
    window.tests.bruteforcecollisions = {
        pack: "QuadTree",
        type: "Datastructures",
        name: "Brute Force Collisions",
        desc: "900 balls with collisions tests using brute force checking. Logics updates run at 60 updates per second.",
        test: BruteForceCollisionsTest
    };
}