function Shader () {}

Shader.create = function(gl, shader_type, shader_source) {
    var shader = gl.createShader(shader_type);

    gl.shaderSource(shader, shader_source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        throw('Failed to compile shader');
        return null;
    }

    return shader;
}

function WebGL2D(ctx) {
    this.gl = ctx;
    this.shaderFS = "\
        precision highp float;\
        void main() {\
            gl_FragColor = vec4(1.0, 1.0, 0.2, 1.0);\
        }";
    this.shaderVS = "\
        attribute vec4 position;\
        void main() {\
            gl_Position = position;\
        }";

    this.triangle = new Float32Array([
                                        1.0, 1.0, 0.0, 
                                        -1.0, 0.0, 0.0,
                                        1.0, -1.0, 0.0
                                        ]);
    this.triangleBuffer;
    this.shaderProgram;

    this.initShaders();
    this.initBuffers();
            
};

WebGL2D.prototype.initShaders = function() {
    var gl = this.gl,
        fragmentShader = Shader.create(gl, gl.FRAGMENT_SHADER, this.shaderFS),
        vertexShader = Shader.create(gl, gl.VERTEX_SHADER, this.shaderVS);

    this.shaderProgram = gl.createProgram();

    if(this.shaderProgram == null) {
        alert("No Shader Program!");
        return;
    }

    //
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);              
 
    if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
        alert("Could not link shader!");
        gl.deleteProgram(this.shaderProgram);
        return false;
    }

    gl.useProgram(this.shaderProgram);
 
    this.shaderProgram.position = gl.getAttribLocation(this.shaderProgram, "position");             
    gl.enableVertexAttribArray(this.shaderProgram.position);
 
    return true;
}

WebGL2D.prototype.initBuffers = function() {
    var gl = this.gl;
    this.triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.triangle, gl.STATIC_DRAW);

    return true;
};

WebGL2D.prototype.update = function(dt, time) {
    
};

WebGL2D.prototype.render = function() {
    var gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.GL_DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleBuffer);
    gl.vertexAttribPointer(this.shaderProgram.position, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

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

function WebGL2DTest() {
    if(window._timer) window._timer.stop();
    createCanvas();

    var c = document.getElementById('perpetual'),
        ctx = c.getContext('experimental-webgl');

    var scene = new WebGL2D(ctx);

    window._timer = new Timer(scene);
}


if(window.tests || (window.tests = {})) {
    window.tests.webgl2dtest = {
        pack: "WebGL2D",
        type: "",
        name: "WebGL2D Test",
        desc: "Simple 2D WebGL test",
        test: WebGL2DTest
    };
}