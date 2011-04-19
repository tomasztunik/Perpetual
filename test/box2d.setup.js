// break box2d js drawing implementation

b2DebugDraw.prototype.Y = function(y) { return y; };
b2DebugDraw.prototype.Clear = function(){};


/*
    DummyBox Class
*/

function DummyWall(world, x, y, width, height) {
    DummyWall._super.call(this, x, y, width, height);
    this.createBody(world);
}; u.extend(DummyWall, Node);

DummyWall.prototype.draw = function(ctx) {
    ctx.fillStyle = "rgba(0, 190, 190, 0.8)";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
};

DummyWall.prototype.createBody = function(world) {
    var body,
        body_def = new b2BodyDef(),
        fixture_def = new b2FixtureDef()

    body_def.userData = this; // keep reference to itself
    body_def.position.Set(this.x, this.y);

    fixture_def.shape = b2PolygonShape.AsBox(this.width / 2, this.height / 2); // always half width/height

    body = world.CreateBody(body_def);
    body.CreateFixture(fixture_def);

    return body;

}
/*
    DummyBall Class
*/

function DummyBall(world, x, y, radius) {
    var width, height;
    width = height = radius * 2;
    DummyBall._super.call(this, x, y, width, height);

    this.x = x;
    this.y = y;
    this.radius = radius;

    this.body = this.createBody(world);

}; u.extend(DummyBall, Node);

DummyBall.prototype.draw = function(ctx) {
    ctx.fillStyle = "rgba(230, 230, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
};

DummyBall.prototype.update = function(dt, time) {
    var position = this.body.GetPosition();
    this.x = position.x;
    this.y = position.y;
};

DummyBall.prototype.createBody = function(world) {
    var body,
        body_def = new b2BodyDef(),
        fixture_def = new b2FixtureDef()

    body_def.userData = this; // keep reference to itself
    body_def.position.Set(this.x, this.y);
    body_def.type = b2Body.b2_dynamicBody;

    fixture_def.restitution = 0.9;
    fixture_def.friction = 0.8;
    fixture_def.density = 0.8;
    fixture_def.shape = new b2CircleShape(this.radius);

    body = world.CreateBody(body_def);
    body.CreateFixture(fixture_def);

    return body;

}

/*
    Box2DSceneNode Class
    base box2d scene class 
    includes camera2d support
*/

function Box2DSceneNode(ctx) {
    if(!ctx) return;
    Box2DSceneNode._super.call(this, ctx);

    // BOX2D SETUP

    // create new box2d world and set its gravitational force and set box2d to use sleep feature
    // box2d 2.1+ deosn't require specifying world dimensions
    this.world = new b2World(new b2Vec2(0.0, -9.81), true);
    // pixel to meters ratio - 40px == 1m
    this.pm_ratio = ctx.pm_ratio = 20;

    this.debug = false;
    // setup the debug drawing
    this.debug_renderer = new b2DebugDraw();
    this.debug_renderer.SetSprite(ctx);
    this.debug_renderer.SetLineThickness(1 / this.pm_ratio);
    this.debug_renderer.SetFillAlpha(0.5);
    this.debug_renderer.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
    // this.debug_renderer.SetDrawScale(this.pm_ratio);
    this.world.SetDebugDraw(this.debug_renderer);

    // CAMERA SETUP

    // make the world bounds to be twice wide and tall compared to the canvas size
    // expressed in meters to make it compatible with box2d
    this.world_bounds = {
        x: 0,
        y: 0,
        width: this.width * 2 / this.pm_ratio,
        height: this.height / this.pm_ratio
    }
    // initialize camera - we are passing pixel to meters ratio as scale factor 
    // so we can store objects dimensions in meters rather then pixels and then we set the
    // invert y-axis parameter to true so we can map box2d world coords 1:1 with canvas coords
    // so that (0, 0) is in the bottom left corner and that 40px is 1m
    // With this set up we can use meters rather then pixels as our objects units 
    this.camera = new Camera2d(ctx, null, 1, this.pm_ratio, this.world_bounds, true);
    // you can use the camera to change the scale of drawn objects by setting camera zoom
    // this.camera.setZoom(0.25) // you can set it anytime - look at mousewheel below
}; u.extend(Box2DSceneNode, SceneNode);

Box2DSceneNode.prototype.update = function(dt, time) {
    // required in b2d 2.1a
    this.world.ClearForces();
    // update the b2d world model
    this.world.Step(dt, 5, 5);

    Box2DSceneNode._super_method.update.call(this, dt, time);
};

Box2DSceneNode.prototype.render = function() {
    var ctx = this._ctx,
        nodes = this._nodes,
        camera = this.camera;

    camera.transformView();
    camera.clearView();

    for (var i = 0, n = this._nodes.length; i < n; i++) {
        ctx.save();
        nodes[i].render(ctx);
        ctx.restore();
    }

    if (this.debug) {
        this.world.DrawDebugData();
    }
}

/*
    TestBox2DSceneNode Class
*/

function TestBox2DSceneNode(ctx) {
    TestBox2DSceneNode._super.call(this, ctx);
    // create world boundaries

    this.addNode(new DummyWall(this.world, -0.5, this.world_bounds.height / 2, 1, this.world_bounds.height));
    this.addNode(new DummyWall(this.world, this.world_bounds.width + 0.5, this.world_bounds.height / 2, 1, this.world_bounds.height));
    this.addNode(new DummyWall(this.world, this.world_bounds.width / 2, -0.5, this.world_bounds.width, 1));

    this.debug = true;

    // this.camera.setZoom(0.4)

}; u.extend(TestBox2DSceneNode, Box2DSceneNode);

function Box2DSetup() {

    if(window._timer) window._timer.stop();

    var c = u.createCanvas('container'),
        ctx = c.getContext('2d'),
        scene = new TestBox2DSceneNode(ctx),
        n = 150,
        max_radius = 1,
        max_zoom = 3,
        min_zoom = 0.25;
        
    for(var i = 0; i < n; i++) {
        
        var radius = u.randFloat(0.5, 2.5);
            x = u.randInt(5, scene.world_bounds.width - 5),
            y = u.randInt(max_radius + 1, scene.world_bounds.height + 60);
        scene.addNode(new DummyBall(scene.world, x, y, radius))
    }
       
    function Mouse(){
    };

    Mouse.move = function(e) {
        if (!Mouse.prev_pos) {
            Mouse.prev_pos = {
                x: e.clientX,
                y: e.clientY
            }
        }
        if(Key.SPACE) {
            var scale = scene.camera.scale;
            scene.camera.moveBy((Mouse.prev_pos.x - e.clientX) / scale * 2, (Mouse.prev_pos.y - e.clientY) / scale * 2, true);
        }
        // Mouse.pos = scene.camera.getWorldPosition(e.clientX, e.clientY);
        Mouse.prev_pos = {
            x: e.clientX,
            y: e.clientY
        };
    }

    Mouse.mousewheel = function(e) {
        var zoom = scene.camera.zoom + e.wheelDeltaY / 30;

        if (zoom > max_zoom) {
            zoom = max_zoom;
        } else if (zoom < min_zoom) {
            zoom = min_zoom;
        }

        scene.camera.setZoom(zoom);

    }

    Mouse.down = function(e) {
        var pos = scene.camera.getWorldPosition(e.clientX, e.clientY);

        if(Key.SHIFT) {
            scene.addNode(new DummyBall(scene.world, pos.x, pos.y, 1));
        } else {
            Mouse.DOWN = true;
        }

        e.preventDefault();

    }

    Mouse.up = function(e) {
        Mouse.DOWN = false;
    }

    function Key(){};

    Key.down = function(e) {
        if(e.keyCode == 16) { // shift
            Key.SHIFT = true;
        } else if (e.keyCode == 68) { // d
            scene.debug = !scene.debug;
        } else if (e.keyCode == 32) { // space
            Key.SPACE = true;
            e.preventDefault();
        } else if (e.keyCode == 90) { // z
            scene.camera.setZoom(1);
        } else if (e.keyCode == 67) { // c
            scene.camera.centerAt(scene.camera.world_bounds.width / 2, scene.camera.world_bounds.height / 2);
        }
    }

    Key.up = function(e) {
        if(e.keyCode == 16) {
            Key.SHIFT = false;
        } else if(e.keyCode == 32) {
            Key.SPACE = false;
        }
    }

    document.addEventListener('mousemove', Mouse.move, true);
    document.addEventListener('mousedown', Mouse.down, true);
    document.addEventListener('mouseup', Mouse.up, true);
    window.addEventListener('mousewheel', Mouse.mousewheel, true);
    document.addEventListener('keydown', Key.down, true);
    document.addEventListener('keyup', Key.up, true);

    window._timer = new Timer(scene, "deterministic", 20);
}

if(window.tests || (window.tests = {})) {
    window.tests.box2dsetup = {
        pack: "Box2d",
        type: "libs",
        name: "Box2d + Camera2d setup",
        desc: "150 balls with 0.5 - 2.5 m radius simulation at fixed box2d physics update interval with 50 updates/s "
            + "using deterministic timer. World is 2 canvases wide and one canvas high. <br>"
            + "<br> SPACE + mouse move - pan view" 
            + "<br> mousewheel - zoom in/out"
            + "<br> SHIFT + mouse click - creates a ball"
            + "<br> C - center camera"
            + "<br> Z - reset zoom to 1"
            + "<br> D - toggle box2d debug drawing on/off",
        test: Box2DSetup
    };
}