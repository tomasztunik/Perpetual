function QuadTree(bounds, depth, max_depth, max_objects) {
    
    this.bounds = bounds; // set node's bounds
    this.depth = depth; // set node's depth
    
    this.max_depth = max_depth; // set the max depth
    this.max_objects = max_objects; // set the max objects that can be contained by single node before subdividing the node
    
    this.objects = []; // array to store all objects in this node's bounds
    this.nodes = null; // will hold array of subnodes

}

QuadTree.prototype.insertObject = function(object) {

    var objects = this.objects;
    
    // check if node was subdivided
    if (this.nodes) {
        // if yes check if objects fits any of the subnodes
        var subnode = this.getSubnodeForBounds(object.getBounds());
        if (subnode) {
            // if it fits one of subnodes add it to this subnode
            subnode.insertObject(object);
        } else {
            // else push it to the objects held by this node
            objects.push(object);
        }
        return;
    }
    
    // if it wasn't subdivided add the object to this node
    objects.push(object);
    

    // check if adding object didn't push it past max objects before subdividing and if it isn't max depth of the tree
    if (objects.length > this.max_objects && this.depth < this.max_depth) {
        // if it did subdivide the node
        this.subdivide();
        // clear the reference to the  array of object bound to this node - reference to these objects is stored in `objects` array
        this.objects = [];

        var subnode;

        // iterate over all the objects and try to put them inside subnodes they fit in
        for (var i = 0, n = objects.length; i < n; i++) {
        
            object = objects[i];
            subnode = this.getSubnodeForBounds(object.getBounds());

            if (subnode) {
                subnode.insertObject(object);
            } else {
                this.objects.push(object);
            }
        }
    }
        
}

QuadTree.prototype.insertObjects = function(objects) {
    for (var i = 0, n = objects.length; i < n; i++) {
        this.insertObject(objects[i]);
    }
}

QuadTree.prototype.subdivide = function() {
    var bounds = this.bounds,
        x = bounds.x,
        y = bounds.y,
        width = bounds.width,
        height = bounds.height,
        half_width = bounds.width / 2,
        half_height = bounds.height / 2,
        max_objects = this.max_objects,
        max_depth = this.max_depth,
        depth = this.depth + 1,
        nodes = [];

    this.nodes = nodes;

    // create four subnodes
    nodes.push(new QuadTree({ // top left
        x: x,
        y: y,
        width: half_width,
        height: half_height
    }, depth, max_depth, max_objects));
    
    nodes.push(new QuadTree({ // top right
        x: x + half_width,
        y: y,
        width: half_width,
        height: half_height
    }, depth, max_depth, max_objects));
    
    nodes.push(new QuadTree({ // bottom left
        x: x,
        y: y + half_height,
        width: half_width,
        height: half_height
    }, depth, max_depth, max_objects));
    
    nodes.push(new QuadTree({ // bottom right
        x: x + half_width,
        y: y + half_height,
        width: half_width,
        height: half_height
    }, depth, max_depth, max_objects));
}

QuadTree.prototype.getSubnodeForBounds = function(target_bounds) {

    var bounds = this.bounds,
        bx = bounds.x,
        by = bounds.y,
        bw = bounds.width,
        bh = bounds.height,
        bx2 = bx + bw,
        by2 = by + bh,
        tx = target_bounds.x,
        ty = target_bounds.y,
        tw = target_bounds.width,
        th = target_bounds.height,
        tx2 = tx + tw,
        ty2 = ty + th;

    // if either target bound's width or height is larger then half of nodes width or height it means target bounds won't fit any subnode
    if (tw > bw / 2 || th > bh / 2) {
        return null;
    // check if it fits top left node
    } else if (tx >= bx && ty >= by && tx2 <= bx + bw / 2 && ty2 <= by + bh / 2) {
        return this.nodes[0];
    // check if it fits top right node
    } else if (tx >= bx + bw / 2 && ty >= by && tx2 <= bx2 && ty2 <= by + bh / 2) {
        return this.nodes[1];
    // check if it fits bottom left node
    } else if (tx >= bx && ty >= by + bh / 2 && tx2 <= bx + bw / 2 && ty2 <= by2) {
        return this.nodes[2];
    // check if it fits bottom right node
    } else if (tx >= bx + bw / 2 && ty >= by + bh / 2 && tx2 <= bx2 && ty2 <= by2) {
        return this.nodes[3];
    }
    // otherwise it means target bounds overlap more then one subnode and it needs to be added to this node
    return null;
};

QuadTree.prototype.getObjectsAtBounds = function(target_bounds) {

    if(!this.nodes && this.objects.length === 0) {
        return null;
    }
    
    var bounds = this.bounds,
        bx = bounds.x,
        by = bounds.y,
        bx2 = bx + bounds.width,
        by2 = by + bounds.height,
        tx = target_bounds.x,
        ty = target_bounds.y,
        tx2 = tx + target_bounds.width,
        ty2 = ty + target_bounds.height;

    // check if node doesn't intersect with target bounds - if it doesn't return null
    if (!(tx >= bx && ty >= by && tx <= bx2 && ty <= by2) ||
        !(tx2 >= bx && ty2 >= by && tx2 <= bx2 && ty2 <= by2) ||
        !(tx <= bx2 && ty <= by2 && tx2 >= bx && ty2 >= by)) {
        return null;
    }

    // if the node is fully overlaped by bounds then add all its objects and all objects which are held by subnodes and their subnodes
    if (tx <= bx && ty <= by && tx2 >= bx2 && ty2 >= by2) {
        return this.getAllObjects();
    }

    // if its in bounds add all the objects from this node to potentially intersecting objects array
    var objects = this.objects.slice();

    // if node has subnodes check them recursively for potentially intersecting objects
    if (this.nodes) {
        var nodes = this.nodes,
            subnode_objects;

        if((subnode_objects = nodes[0].getObjectsAtBounds(target_bounds))) {
            objects = objects.concat(subnode_objects);
        }
        if((subnode_objects = nodes[1].getObjectsAtBounds(target_bounds))) {
            objects = objects.concat(subnode_objects);
        }
        if((subnode_objects = nodes[2].getObjectsAtBounds(target_bounds))) {
            objects = objects.concat(subnode_objects);
        }
        if((subnode_objects = nodes[3].getObjectsAtBounds(target_bounds))) {
            objects = objects.concat(subnode_objects);
        }
    }
    if(objects.length > 0) {
        return objects;
    }

    return null;
}

QuadTree.prototype.getAllObjects = function() {
    var objects = this.objects.slice();

    // check if node has subnodes
    if(this.nodes) {
        var nodes = this.nodes,
            subnode_objects;
        // if yes recursively get all objects held by its subnodes and their subnodes
        if((subnode_objects = nodes[0].getAllObjects())) {
            objects = objects.concat(subnode_objects);
        }
        if((subnode_objects = nodes[1].getAllObjects())) {
            objects = objects.concat(subnode_objects);
        }
        if((subnode_objects = nodes[2].getAllObjects())) {
            objects = objects.concat(subnode_objects);
        }
        if((subnode_objects = nodes[3].getAllObjects())) {
            objects = objects.concat(subnode_objects);
        }
    }

    return objects;
};

QuadTree.prototype.wipe = function() {
    if (this.nodes) {
        var nodes = this.nodes;
        nodes[0].wipe();
        nodes[1].wipe();
        nodes[2].wipe();
        nodes[3].wipe();
    }
    this.objects = [];
    this.nodes = null;
}