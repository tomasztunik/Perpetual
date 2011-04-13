function ThreeJSWrapper(container_id) {
    var container = document.getElementById(container_id);
    // setup camera
    this.camera = new THREE.Camera(45, container.clientWidth / container.clientHeight, 1, 3000);
    // create scene
    this.scene = new THREE.Scene();
    // setup renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // setup the scene
    this.initScene();
}

ThreeJSWrapper.prototype.initScene = function() {

    this.camera.position.x = -850;
    this.camera.position.y = -850;
    this.camera.position.z = 450;

    // this.camera.rotation.x = 30 * u.TO_RADIANS;
    // this.camera.rotation.y = -30 * u.TO_RADIANS;
    // this.camera.rotation.z = 45 * u.TO_RADIANS;

    this.camera.up.x = 1;
    this.camera.up.y = 1;
    this.camera.up.z = 1;

    console.log(this.camera);

    var material_wire = new THREE.MeshBasicMaterial({color: 0x555555, wireframe: true}),
        material_yellow = new THREE.MeshLambertMaterial({color: 0xffff00, shading: THREE.FlatShading,}),
        material_magenta = new THREE.MeshLambertMaterial({color: 0xff00ff, shading: THREE.FlatShading});

    var plane = new THREE.Mesh(new THREE.Plane(1000, 1000, 20, 20), material_yellow);
    this.scene.addObject(plane);

    var cube = new THREE.Mesh(new THREE.Cube(50, 50, 50), material_magenta);
    this.scene.addObject(cube);
    this.cube = cube;
    new THREE.ShadowVolume(cube);

    cube2 = new THREE.Mesh(new THREE.Cube(50, 50, 50), material_magenta);
    this.scene.addObject(cube2);
    this.cube2 = cube2;
    new THREE.ShadowVolume(cube2);;

    cube3 = new THREE.Mesh(new THREE.Cube(50, 50, 50), material_magenta);
    this.scene.addObject(cube3);
    this.cube3 = cube3;
    new THREE.ShadowVolume(cube3);;

    var axis_x_mat = new THREE.LineBasicMaterial({color: 0xff0000, opacity: 1});
        axis_x_geom = new THREE.Geometry();
    axis_x_geom.vertices.push(new THREE.Vertex(new THREE.Vector3(-550, 0, 0)));
    axis_x_geom.vertices.push(new THREE.Vertex(new THREE.Vector3(-510, 0, 0)));
    var axis_x = new THREE.Line(axis_x_geom, axis_x_mat);

    var axis_y_mat = new THREE.LineBasicMaterial({color: 0x00ff00, opacity: 1});
        axis_y_geom = new THREE.Geometry();
    axis_y_geom.vertices.push(new THREE.Vertex(new THREE.Vector3(-550, 0, 0)));
    axis_y_geom.vertices.push(new THREE.Vertex(new THREE.Vector3(-550, 40, 0)));
    var axis_y = new THREE.Line(axis_y_geom, axis_y_mat);

    var axis_z_mat = new THREE.LineBasicMaterial({color: 0x0000ff, opacity: 1});
        axis_z_geom = new THREE.Geometry();
    axis_z_geom.vertices.push(new THREE.Vertex(new THREE.Vector3(-550, 0, 0)));
    axis_z_geom.vertices.push(new THREE.Vertex(new THREE.Vector3(-550, 0, 40)));
    var axis_z = new THREE.Line(axis_z_geom, axis_z_mat);

    this.scene.addObject(axis_x);
    this.scene.addObject(axis_y);
    this.scene.addObject(axis_z);

    var ambientLight = new THREE.AmbientLight(0x606060);
    this.scene.addLight(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.x = -500;
    directionalLight.position.y = 200;
    directionalLight.position.z = 400;
    directionalLight.position.normalize();
    this.scene.addLight(directionalLight);

    
};

ThreeJSWrapper.prototype.render = function(dt, time) {

    time = time / 2;

    this.cube.position.z = u.map(Math.sin(time * Math.PI * 2), -1, 1, 50, 300);
    this.cube.position.x = Math.cos(time * Math.PI * 2) * 200;
    this.cube.position.y = Math.sin(time * Math.PI * 2) * 200;
    this.cube.rotation.x = u.map(time % 1, 0, 1, -180 * u.TO_RADIANS, 180 * u.TO_RADIANS);

    this.cube2.position.z = u.map(Math.sin((time + 0.333) * Math.PI * 2), -1, 1, 50, 300);
    this.cube2.position.x = Math.cos((time + 0.333) * Math.PI * 2) * 200;
    this.cube2.position.y = Math.sin((time + 0.333) * Math.PI * 2) * 200;
    this.cube2.rotation.y = u.map(time % 1, 0, 1, -180 * u.TO_RADIANS, 180 * u.TO_RADIANS);

    this.cube3.position.z = u.map(Math.sin((time + 0.666) * Math.PI * 2), -1, 1, 50, 300);
    this.cube3.position.x = Math.cos((time + 0.666) * Math.PI * 2) * 200;
    this.cube3.position.y = Math.sin((time + 0.666) * Math.PI * 2) * 200;
    this.cube3.rotation.z = u.map(time % 1, 0, 1, -180 * u.TO_RADIANS, 180 * u.TO_RADIANS);

    this.renderer.render(this.scene, this.camera);
}

function ThreeJSTest() {
    if(window._timer) window._timer.stop();

    u.removeCanvas('container');

    var scene = new ThreeJSWrapper('container');

    window._timer = new Timer(scene, "render");
}


if(window.tests || (window.tests = {})) {
    window.tests.threejstest = {
        pack: "ThreeJS",
        type: "",
        name: "three.js Test",
        desc: "Basic three.js webgl rendering test",
        test: ThreeJSTest
    };
}