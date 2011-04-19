var HtmlRect = function(x, y, width, height, color) { 
    HtmlRect._super.call(this, x, y, width, height);
    this.rotation_factor = u.randInt(2, 4);
    this.circ_motion_factor = u.randFloat(2, 4);
    this.color = color;
}; u.extend(HtmlRect, HtmlNode);

HtmlRect.prototype.createElement = function(ctx) {
    var el = document.createElement('div');
    this.style = el.style.cssText = ""
        + "width: " + this.width + "px;"
        + "height: " + this.height + "px;"
        + "position: absolute;"
        + "background-color: " + this.color + ";";
    this.el = el;
    ctx.appendChild(el);
}

HtmlRect.prototype.update = function(dt, time) {
    
    HtmlRect._super_method.update.apply(this, arguments);
    
    if (this.parent instanceof HtmlRect) {
        this.x = (Math.cos(time / this.circ_motion_factor * Math.PI * 2) * 20);
        this.y = (Math.sin(time / this.circ_motion_factor * Math.PI * 2) * 20);
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

var HtmlLink = function(node){
    HtmlLink._super.call(this, 0, 0, node.x, 2);
    this.to = node;
}; u.extend(HtmlLink, HtmlNode);

HtmlLink.prototype.createElement = function(ctx) {
    var el = document.createElement('div');
    this.style = el.style.cssText = ""
        + "width: " + this.to.x + "px;"
        + "height: " + this.height + "px;"
        + "position: absolute;"
        + "background-color: #dddddd;";
    this.el = el;
    ctx.appendChild(el);
}

HtmlLink.prototype.update = function(dt, time) {
    this.offset_x = Math.cos(time / this.to.circ_motion_factor * Math.PI * 2) * this.width / 2;
    this.offset_y = Math.sin(time / this.to.circ_motion_factor * Math.PI * 2) * this.width / 2;
    this.rotate = Math.atan2(this.to.y, this.to.x);
}

function HtmlScenegraphTest() {

    if(window._timer) window._timer.stop();

    var c = u.createHTMLCanvas('container'),
        scene = new HtmlSceneNode(c),
        n = 250;

    for(var i = 0; i < n; i++) {
        var node = new HtmlRect(u.map(Math.random(), 0, 1, 50, c.width - 50), u.map(Math.random(), 0, 1, 50, c.height - 50), 20, 20, '#ffff00');
            child_node = new HtmlRect(20, 0, 10, 10, '#2c2c2c'),
            link_node = new HtmlLink(child_node);

        // node.rotate = u.map(Math.random(), 0, 1, 0, Math.PI);
        // child_node.rotate = u.map(Math.random(), 0, 1, 0, Math.PI);
        
        scene.addNode(node); // if you want to add nodes to non scene nodes you must to add the parent node to the scene first as the DOM element is created at this stage
        node.addNode(child_node);
        node.addNode(link_node);
    }
    
    window._timer = new Timer(scene, "simple");
}

if(window.tests || (window.tests = {})) {
    window.tests.scenegraph_html = {
        pack: "Scene graph",
        type: "Datastructures",
        name: "Scene Graph [html]",
        desc: "Scene Graph using html renderer - 250 complex dom objects - each build out of 3 nodes",
        test: HtmlScenegraphTest
    };
}