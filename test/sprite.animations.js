function TextNode(x, y, text) {
    y += 6;
    TextNode._super.call(this, x, y);
    this.text = text;
} u.extend(TextNode, BaseNode);

TextNode.prototype.draw = function(ctx) {
    ctx.textAlign = "center";
    // ctx.textBaseline = "top";
    ctx.font = "normal 12pt Consolas, Inconsolata, Monaco, monotype";
    ctx.fillStyle = "#FF00FF";
    ctx.fillText(this.text, this.x, this.y);
};

function Samurai(x, y, scale) {
    Samurai._super.call(this, x, y);

    this.scale = (typeof scale == 'number') ? scale : null;

    scale = (typeof scale == 'function') ? scale : null;

    var frames = [];

    for (var i = 0, n = 8; i < n; i++) {
        frames.push(new Frame('resources/samurai-walk.png', {
            x: i * 20,
            y: 0,
            width: 20,
            height: 20
        }, 0.2, scale));
    }

    this.animation = this.WALK =  new Animation(frames);

} u.extend(Samurai, Node);

Samurai.prototype.update = function(dt, time) {
    this.animation.update(dt);
};

Samurai.prototype.draw = function(ctx) {
    this.animation.draw(ctx);
};


function BatsSwarm(x, y) {
    BatsSwarm._super.call(this, x, y);

    var frames = [];
    frames.push(new Frame('resources/bats-anim-01-f1.png', 0.2));
    frames.push(new Frame('resources/bats-anim-01-f2.png', 0.2));
    frames.push(new Frame('resources/bats-anim-01-f3.png', 0.2));

    this.FLY = new Animation(frames);

    this.animation = this.FLY;

} u.extend(BatsSwarm, Node);

BatsSwarm.prototype.update = function(dt, time) {
    this.animation.update(dt);
};

BatsSwarm.prototype.draw = function(ctx) {
    this.animation.draw(ctx);
};

BatsSwarm.prototype.getBounds = function() {
    var cur_frame = this.animation.cur_frame;
    return {
        x: this.x - cur_frmae.width / 2,
        y: this.y - cur_frame.height / 2,
        width: cur_frame.width,
        height: cur_frame.height
    }
}

function SpriteAnimationTest() {

    if(window._timer) window._timer.stop();

    u.createCanvas('container').innerHTML = "Loadign images, please wait.";

    new ImageLoader().loadImages([
            'resources/bats-anim-01-f1.png',
            'resources/bats-anim-01-f2.png',
            'resources/bats-anim-01-f3.png',
            'resources/samurai-walk.png'
        ], function() {
            var c = u.createCanvas('container'),
                ctx = c.getContext('2d'),
                scene = new SceneNode(ctx);

            // scene.addNode(new BatsSwarm(window.innerWidth / 2 + 100, window.innerHeight / 2));
            scene.addNode(new TextNode(200, 125, "browser default"));
            scene.addNode(new TextNode(400, 125, "Scale algorithm"));
            scene.addNode(new TextNode(600, 125, "Nearest Neighbour"));
            scene.addNode(new TextNode(120, 175, "x1"));
            scene.addNode(new Samurai(200, 175, 1));
            scene.addNode(new Samurai(400, 175, 1));
            scene.addNode(new Samurai(600, 175, 1));
            scene.addNode(new TextNode(120, 200, "x2"));
            scene.addNode(new Samurai(200, 200, 2));
            scene.addNode(new Samurai(400, 200, function(canvas) { return is.Scale2x(canvas) }));
            scene.addNode(new Samurai(600, 200, function(canvas, ratio) { return is.Neighbour(canvas, 2) }));
            scene.addNode(new TextNode(120, 250, "x4"));
            scene.addNode(new Samurai(200, 250, 4));
            scene.addNode(new Samurai(400, 250, function(canvas) { return is.Scale4x(canvas) }));
            scene.addNode(new Samurai(600, 250, function(canvas, ratio) { return is.Neighbour(canvas, 4) }));
            scene.addNode(new TextNode(120, 350, "x8"));
            scene.addNode(new Samurai(200, 350, 8));
            scene.addNode(new Samurai(400, 350, function(canvas) { return is.Scale8x(canvas) }));
            scene.addNode(new Samurai(600, 350, function(canvas, ratio) { return is.Neighbour(canvas, 8) }));

            window._timer = new Timer(scene, "simple");
        });

}

if(window.tests || (window.tests = {})) {
    window.tests.anim01 = {
        pack: "Sprites",
        type: "drawing",
        name: "Sprite Animations + Scaling Algorithms",
        desc: "Sprite Animation pre-processed frames and test of different upscalling algorithms. There are some glitches in the upscalled sprites because of the extremely small input image (20x20px frame spritesheet)",
        test: SpriteAnimationTest
    };
}