/** @file: test.js
 *  Created by Matthew P. Kuzdal 
 *  ID:404564296
 *  CS174A - Introduction to Computer Graphics - Project 3
 *  Feb. 18, 2017
 *  
 *  Simple WebGL application utilizing features such as perspective / orthographic
 *  projections, quaternion camera controls, lighting and shading (Phong, Gaurad and Flat). 
 *  
 *  All requirements were attemped with no known bugs.
 *
 **/

/** GLOBALS: **/

// webGL variables
var canvas;
var gl;
var program;

// storage for global vertices and normals
var pointsArray = [];
var normalsArray = [];
var textureArray = [];

// webGL uniforms
var projectionMatrixLoc;
var modelViewMatrixLoc;
var normalMatrixLoc;
var cameraMatrixLoc;

// light and camera instance
var lightSourceCount = 0;
var lightSource1;
var lightSource2;
var cam;

// previous frame time
var prev = 0;

// global index for generating sphere vertices
var index = 0;

// component containers for each of the planets
var cubes = [];
var materials = [];
var geometries = [];
var textures = [];
var transforms = [];
var colliders = [];
var rot_animations = [];

var cubeVertices = [
     vec4.fromValues ( -0.5, -0.5,  0.5, 1.0 ),
     vec4.fromValues ( -0.5,  0.5,  0.5, 1.0 ),
     vec4.fromValues (  0.5,  0.5,  0.5, 1.0 ),
     vec4.fromValues (  0.5, -0.5,  0.5, 1.0 ),
     vec4.fromValues ( -0.5, -0.5, -0.5, 1.0 ),
     vec4.fromValues ( -0.5,  0.5, -0.5, 1.0 ),
     vec4.fromValues (  0.5,  0.5, -0.5, 1.0 ),
     vec4.fromValues (  0.5, -0.5, -0.5, 1.0 )
];

var texCoords = [
    vec2.fromValues (0.0, 0.0),
    vec2.fromValues (0.0, 1.0),
    vec2.fromValues (1.0, 1.0),
    vec2.fromValues (1.0, 0.0)
];

class boxCollider {
    constructor (_vertices) {
        this.vertices = _vertices;
        this.type = "box"
    }

    inFustrum (PC, M) {
        var PCM = mat4.create ();
        mat4.mul (PCM, PC, M);

        var p_prime = [];
        for (var i = 0; i < this.vertices.length; i++) {
            var storage = vec4.create ();
            p_prime.push (vec4.transformMat4 (storage, this.vertices[i], PCM));
        }

        var toDraw = false;

        // check right plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][0] < p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check left plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][0] > -p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check top plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][1] < p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check bottom plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][1] > -p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check far plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][2] < p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check near plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][2] > 0) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }

        return true;
    }
}

class sphereCollider {
    constructor (_center, _radius) {
        this.center = _center;
        this.radius = _radius;
        this.type = "sphere"
    }

    inFustrum (PC, T) {
        var c = vec3.create ();
        vec3.transformMat4 (c, this.center, T);

        var r = this.radius;
        var d, A, B, C, D;

        // check right plane:
        A = PC[3]  - PC[0];
        B = PC[7]  - PC[4];
        C = PC[11] - PC[8];
        D = PC[15] - PC[12];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check left plane:
        A = PC[3]  + PC[0];
        B = PC[7]  + PC[4];
        C = PC[11] + PC[8];
        D = PC[15] + PC[12];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check top plane:
        A = PC[3]  - PC[1];
        B = PC[7]  - PC[5];
        C = PC[11] - PC[9];
        D = PC[15] - PC[13];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check bottom plane:
        A = PC[3]  + PC[1];
        B = PC[7]  + PC[5];
        C = PC[11] + PC[9];
        D = PC[15] + PC[13];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check far plane:
        A = PC[3]  - PC[2];
        B = PC[7]  - PC[6];
        C = PC[11] - PC[10];
        D = PC[15] - PC[14];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check near plane:
        A = PC[2];
        B = PC[6];
        C = PC[10];
        D = PC[14];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        return true;
    }
} 

/** geometry: an abstraction for a geometry object. Geometries manage and maintain
 *  all GLSL buffers, normals, and vertex attributes. 
 */
class geometry {
    /** constructor: builds an instance of a geometry object with given attributes.
     *  @param { vec3 [] } vertices: the array of vertices to represent the geometry.
     *  @param { vec4 [] } normals: the array of normals to represent the geometry.
     */
    constructor (_vertices, _normals) {
        this.Nvertices = _vertices.length;
        this.Nnormals = _normals.length;

        this.nBuffer = gl.createBuffer();
        gl.bindBuffer (gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, flattenArray (_normals), gl.STATIC_DRAW);

        this.vBuffer = gl.createBuffer ();
        gl.bindBuffer (gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, flattenArray (_vertices), gl.STATIC_DRAW);
    }

    /** setup: enables all buffers and sets the vertex and normal attributes.
     */
    setup () {
        gl.bindBuffer (gl.ARRAY_BUFFER, this.vBuffer);
        var vPosition = gl.getAttribLocation (program, "vPosition");
        gl.vertexAttribPointer (vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray (vPosition);

        gl.bindBuffer (gl.ARRAY_BUFFER, this.nBuffer);
        var vNormal = gl.getAttribLocation (program, "vNormal");
        gl.vertexAttribPointer (vNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray (vNormal);
    }
}

/** material: an abstraction for a material object. Materials represent the color
 *  for a model and the type of shading to render the model with. Materials also handle
 *  setting up all gl uniforms having to do with shading.
 */
class material {
    /** constructor: builds an instance of a material object with given attributes.
     *  @param { vec4 } ambient: the effective RGB values for the materials ambient lighting.
     *  @param { vec4 } diffuse: the effective RGB values for the materials diffuse lighting.
     *  @param { vec4 } specular: the effective RGB values for the materials specular lighting.
     *  @param { float } shinines: defines the shininess of the material.
     *  @param { int } shader: the type of shading to use (see shading types above).
     */
    constructor (_ambient, _diffuse, _specular, _shininess) {
        this.ambient = _ambient     || vec4.fromValues (1.0, 0.0, 1.0, 1.0);
        this.diffuse = _diffuse     || vec4.fromValues (1.0, 0.8, 0.0, 1.0);
        this.specular = _specular   || vec4.fromValues (1.0, 1.0, 1.0, 1.0);
        this.shininess = _shininess || 50.0;
    }

    /** setup: enables all uniform variables to define the shading. 
     */
    setup () {
        gl.uniform4fv (gl.getUniformLocation (program, "fAmbientMaterial"), this.ambient);
        gl.uniform4fv (gl.getUniformLocation (program, "fDiffuseMaterial"), this.diffuse);
        gl.uniform4fv (gl.getUniformLocation (program, "fSpecularMaterial"), this.specular);   
        gl.uniform1f (gl.getUniformLocation  (program, "fShininess"), this.shininess);
    }
}

/** texture: holds a set of vertices and image to define a texture. Automatically 
 *  creates and loads buffers.
 */
class texture {
    constructor (_image, _texCoords, _options) {
        this.image = _image;
        this.nCoords = _texCoords.length;
        this.options = _options;

        this.texture = gl.createTexture();
        gl.bindTexture (gl.TEXTURE_2D, this.texture);
        
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);
        gl.generateMipmap (gl.TEXTURE_2D);

        gl.uniform1i (gl.getUniformLocation (program, "texture"), 0);

        this.tBuffer = gl.createBuffer ();
        gl.bindBuffer (gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, flattenArray (_texCoords), gl.STATIC_DRAW);
    }

    setup () {
        // bind textures
        gl.bindTexture (gl.TEXTURE_2D, this.texture);
        gl.bindBuffer (gl.ARRAY_BUFFER, this.tBuffer);

        for (var i = 0; i < this.options.length; i++) {
            gl.texParameteri (gl.TEXTURE_2D, this.options[i][0], this.options[i][1]);
        }

        var vTexCoord = gl.getAttribLocation (program, "vTexCoord");
        gl.vertexAttribPointer (vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray (vTexCoord);
    }

    bindCoordinates (texCoords) {
        gl.bindBuffer (gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, flattenArray (texCoords), gl.STATIC_DRAW);
    }
}

/** transform: an abstraction for a transform object. Transforms represent the rotation, 
 *  position and rotation for a model. Transforms handle all object motion and creating the 
 *  model view matrices and normal matrices.
 */
class transform {
    /** constructor: builds an instance of a transform object with given attributes.
     *  @param { vec3 } position: the position of the object.
     *  @param { vec3 } scale: the x, y and z scaling of the object.
     *  @param { vec4 } rotation: the rotation quaternion of the object.
     */
    constructor (_position, _scale, _rotation) {
        this.position = _position   || vec3.fromValues (0.0, 0.0, 0.0);
        this.scale = _scale         || vec3.fromValues (1.0, 1.0, 1.0);
        this.rotation = _rotation   || quat.create();

        this.MVmatrix = mat4.create ();

        this.setModelView ();
    }

    /** update: event loop function. Currently just sets the matrices for the object.
     *  @param { float } dTime: the time since the last framce callback (in seconds).
     */
    update (dTime) {
        this.setModelView ();
    }
 
    /** setMatrices: sets the model and normal matrices for an object.
     */
    setModelView () {
        mat4.fromRotationTranslationScale (this.MVmatrix, this.rotation, this.position, this.scale);
    }
}

/** light: an abstraction for a light object. Lights have a transform component defining
 *  its orientation and position in space as well as the ambient, diffuse and specular values
 *  that define it.
 */
class light {
    /** constructor: builds an instance of a light object with given attributes.
     *  @param { transform } transform: the orientation and position of the light source.
     *  @param { vec4 } ambient: the ambient value for the light
     *  @param { vec4 } diffuse: the diffuse value for the light.
     *  @param { vec4 } specular: the specular value for the light.
     */
    constructor (_transform, _ambient, _diffuse, _specular) {
        this.transform = _transform || new transform ();
        this.ambient = _ambient     || vec4.fromValues (0.2, 0.2, 0.2, 1.0);
        this.diffuse = _diffuse     || vec4.fromValues (0.4, 0.4, 0.4, 1.0);
        this.specular = _specular   || vec4.fromValues (0.6, 0.6, 0.6, 1.0);
        this.lightID = lightSourceCount++;
    }   

    /** setup: sets up the lightposition uniform in the vertex shader.
     */
    setup () {
        var pos = [ this.transform.position[0], this.transform.position[1], this.transform.position[2], 1.0 ];

        gl.uniform4fv (gl.getUniformLocation (program, "fLightPosition[" + this.lightID + "]"), pos);
        gl.uniform4fv (gl.getUniformLocation (program, "fAmbientLight["  + this.lightID + "]"), this.ambient);
        gl.uniform4fv (gl.getUniformLocation (program, "fDiffuseLight["  + this.lightID + "]"), this.diffuse);
        gl.uniform4fv (gl.getUniformLocation (program, "fSpecularLight[" + this.lightID + "]"), this.specular);
    }
}

/** Camera Object: An abstraction for the camera object where given a position, rotation,
 *  field of view, aspect ratio, and far and near clipping planes, the camera can render images to
 *  the screen. The camera was implemented using a quaternion navigation system. 
 */
class camera {
    /** constructor: builds an instance of an object with given attributes.
     *  @param { vec3 } position: the default position of the camera.
     *  @param { vec4 } rotation: the default rotation of the camera.
     *  @param { float } speed: the speed of the camera movement and rotation.
     *  @param { float } fovy: the field of view for the camera.
     *  @param { float } aspect: the aspect ratio for the camera.
     *  @param { float } far: the far clipping plane.
     *  @param { float } near: the near clipping place.
     */
    constructor (_position, _rotation, _speed, _fovy, _aspect, _far, _near) {
        this.position = _position   || vec3.fromValues (0.0, 0.0, 15.0);
        this.rotation = _rotation   || quat.create ();
        this.speed = _speed         || 1.0;
        this.fovy = _fovy           || 50.0;
        this.aspect = _aspect       || canvas.width / canvas.height;
        this.far = _far             || 1000.0;
        this.near = _near           || 0.0001;

        this.matrix = mat4.create ();
        this.perspectiveProjectionMatrix = mat4.create ();
        this.orthoProjectionMatrix = mat4.create ();

        this.setPerspective ();
        this.setOrthographic ();
        this.setCameraMatrix ();
    }

    /** setPerspective: sets the perspective projection matrix.
     */
    setPerspective () {
        mat4.perspective (this.perspectiveProjectionMatrix, Math.PI * this.fovy / 180, this.aspect, this.near, this.far);
    }

    /** setOrthographic: sets the orthographic projection matrix.
     */
    setOrthographic () {
        mat4.ortho (this.orthoProjectionMatrix, -this.aspect, this.aspect, -1.0, 1.0, -1.0, 1.0);
    }

    /** setCameraMatrix: sets the camera view matrix.
     */
    setCameraMatrix () {
        var storage = vec3.create ();
        mat4.fromRotationTranslation (this.matrix, this.rotation, this.position);
        mat4.invert (this.matrix, this.matrix);

        gl.uniform3fv (gl.getUniformLocation (program, 
        "fCameraPosition"), this.position);
    }

    /** camMoveForward: moves the camera in the forwards direction by 'speed' many units.
     */
    camMoveForward () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);
            
        var direction = vec3.fromValues (-storage[8], -storage[9], -storage[10]);
        vec3.scale (direction, direction, this.speed);

        this.position = vec3.add (this.position, this.position, direction);

        console.log ("Position: " + this.position);
        this.setCameraMatrix ();
    }

    /** camMoveForward: moves the camera in the forwards direction by 'speed' many units.
     */
    camMoveBackwards () {
        var storage = mat4.create ();
        mat4.Quat (storage, this.rotation);
            
        var direction = vec3.fromValues (storage[8], storage[9], storage[10]);
        vec3.scale (direction, direction, this.speed);

        this.position = vec3.add (this.position, this.position, direction);

        this.setCameraMatrix ();
    }

    /** camPitchUp: pitches the camera in the upwards direction by speed many units.
     */
    camPitchUp () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);

        var direction = vec3.fromValues (storage[0], storage[1], storage[2]);

        var q = quat.create ();
        quat.setAxisAngle (q, direction, this.speed * Math.PI / 180.0)
        quat.mul (this.rotation, this.rotation, q);

        this.setCameraMatrix ();
    }

    /** camPitchDown: pitches the camera in the downwards direction by speed many units.
     */
    camPitchDown () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);

        var direction = vec3.fromValues (storage[0], storage[1], storage[2]);

        var q = quat.create ();
        quat.setAxisAngle (q, direction, -this.speed * Math.PI / 180.0)
        quat.mul (this.rotation, this.rotation, q);

        this.setCameraMatrix ();
    }

    /** camYawLeft: yaws the camera to the left by speed many units.
     */
    camYawLeft () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);

        var direction = vec3.fromValues (storage[4], storage[5], storage[6]);

        var q = quat.create ();
        quat.setAxisAngle (q, direction, this.speed * Math.PI / 180.0)
        quat.mul (this.rotation, this.rotation, q);

        this.setCameraMatrix ();
    }

    /** camYawLeft: yaws the camera to the right by speed many units.
     */
    camYawRight () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);

        var direction = vec3.fromValues (storage[4], storage[5], storage[6]);

        var q = quat.create ();
        quat.setAxisAngle (q, direction, -this.speed * Math.PI / 180.0)
        quat.mul (this.rotation, this.rotation, q);

        this.setCameraMatrix ();
    }

    /** camSetSpeed: sets the camera speed.
     *  @param: { float } speed: the speed to set the camera to.
     */
    camSetSpeed (speed) {
        this.speed = speed;
    }
}

/** animationRotation: a class that defines a rotation for an object. When passed
 *  an object to rotate, and a frequency, the animation will rotate the object to 
 *  the proper orientation.
 */
class animationRotation {
    /** constructor: creates an instance of the animation
     *  @param { object } object: the object to apply the animation to.
     *  @param { float } theta: the initial rotation for the object
     *  @param { float } omega: the angular frequency of rotation for the object.
     *  @param { vec3 } axis: the axis to rotate around.
     */
    constructor (_object, _theta, _omega, _axis) {
        this.object = _object;
        this.theta = _theta;
        this.omega = _omega;
        this.axis = _axis;
        this.active = true;
    }

    /** animate: event loop function. Applies the rotation animation to the object.
     *  @param { float } dTime: the time since the last framce callback (in seconds).
     */
    animate (dTime) {
        if (!this.active)
            return;

        this.theta += this.omega * dTime;
        var to_rot = quat.create ();
        quat.setAxisAngle (to_rot, this.axis, this.theta * Math.PI / 180);
        quat.slerp (this.object.transform.rotation, this.object.transform.rotation, to_rot, 1.0);
    }
}


/** init: intialization function.
 */
window.onload = function init () {

    // Get the canvas variable and set it up
    canvas = document.getElementById ("gl-canvas");
    gl = WebGLUtils.setupWebGL (canvas);
    if (!gl) { alert ("WebGL isn't available"); }

    // GL setup for viewport and background color
    gl.viewport (0, 0, canvas.width, canvas.height);
    gl.clearColor (0.0, 0.0, 0.0, 1.0);
    
    gl.enable (gl.DEPTH_TEST);

    window.addEventListener ("keydown", function (e) {
        switch (event.keyCode) {
            case 32: // space
            {
                cam.camMoveForward ();
                break;
            }
            case 73: // i
            {
                cam.camMoveForward ();
                break;
            }
            case 79: // o
            {
                cam.camMoveBackwards ();
                break;
            }
            case 49: // 1
            case 50: // 2
            case 51: // 3
            case 52: // 4
            case 53: // 5
            case 54: // 6
            case 55: // 7
            case 56: // 8
            case 57: // 9
            {
                cam.camSetSpeed (event.keyCode - 48);
                break;
            }
            case 82: // r
            {	
            	camReset();
                for (var i = 0; i < rot_animations.length; i++) {
                    rot_animations[i].active = !rot_animations[i].active;
                }
                break;
            }
            case 83: // s
            {
                break;
            }
            case 84: // t
            {
                break;
            }
            case 38: // up
            { 
                cam.camPitchUp ();
                break;
            }
            case 40: // down 
            {
                cam.camPitchDown ();
                break;
            }
            case 37: // left
            {
                cam.camYawLeft ();
                break;
            }
            case 39: // right
            {
                cam.camYawRight ();
                break;
            }
            default:
                break;
        }
    }); 

    // Create the shader and vertex program
    program = initShaders (gl, "vertex-shader", "fragment-shader");
    gl.useProgram (program);

    // Get the local variable for each of the matrix uniforms
    modelViewMatrixLoc = gl.getUniformLocation (program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation (program, "projectionMatrix");
    normalMatrixLoc = gl.getUniformLocation (program, "normalMatrix");
    cameraMatrixLoc = gl.getUniformLocation (program, "cameraMatrix");

    // Instantiate the camera and light source
    cam = new camera ();
    lightSource1 = new light (new transform (vec3.fromValues (10.0, 0.0, 10.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.8, 0.3, 0.3, 1.0),
                              vec4.fromValues (1.0, 1.0, 1.0, 1.0));

    lightSource2 = new light (new transform (vec3.fromValues (-10.0, 0.0, 10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.8, 0.8, 0.8, 1.0),
                              vec4.fromValues (1.0, 1.0, 1.0, 1.0));
    lightSource1.setup ();
    lightSource2.setup ();

    // generate each of the spheres and create a geometry instance to define it
    generateSphere (5);
    geometries.push (new geometry (pointsArray, normalsArray));
    textures.push (new texture (document.getElementById ("TEXfrance"), textureArray, [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]));

    generateCubeNormals (cubeVertices);
    generateCubeVertices (cubeVertices);
    generateCubeTexCoords (texCoords);

    geometries.push (new geometry (pointsArray, normalsArray));
    textures.push (new texture (document.getElementById ("TEXfrance"), textureArray, [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]));


    // create the materials for each of the 6 bodies (sun, planet1, planet2, planet3, planet4, moon)
    materials =         [   new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0)
                        ]; 

    // create the transforms for each of the 6 bodies.
    transforms =        [   new transform (vec3.fromValues (-4.0, 0.0, 0.0), vec3.fromValues (2.0, 2.0, 2.0), quat.create ()),
                            new transform (vec3.fromValues (4.0,  0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create()),
                            new transform (vec3.fromValues (0.0,  4.0, 0.0), vec3.fromValues (2.0, 2.0, 2.0), quat.create()),
                            new transform (vec3.fromValues (-2.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create())
                        ];

    colliders =         [   new sphereCollider (vec3.fromValues (0.0, 0.0, 0.0), 2.0),
                            new boxCollider (cubeVertices),
                            new sphereCollider (vec3.fromValues (0.0, 0.0, 0.0), 2.0),
                            new boxCollider (cubeVertices),
                        ];

    // create the object for each of the 6 bodies.
    cubes  =            [   new object (transforms[0], materials[0], geometries[0], textures[0], colliders[0]),
                            new object (transforms[1], materials[1], geometries[1], textures[1], colliders[1]),
                            new object (transforms[2], materials[2], geometries[0], textures[0], colliders[2]),
                            new object (transforms[3], materials[3], geometries[1], textures[1], colliders[3])
                        ];

    rot_animations =    [   new animationRotation (cubes[0], 0.0, 120.0, vec3.fromValues (0.0, 1.0, 0.0)),
                            new animationRotation (cubes[1], 0.0, 180.0, vec3.fromValues (1.0, 0.0, 0.0)),
                            new animationRotation (cubes[2], 0.0, 120.0, vec3.fromValues (0.0, 0.0, 1.0)),
                            new animationRotation (cubes[3], 0.0, 360.0, vec3.fromValues (1.0, 0.0, 0.0))
                        ];

    buildSceneGraph ();

    for (var i = 0; i < rot_animations.length; i++) {
        rot_animations[i].active = false;
    }

    window.requestAnimFrame (render);

}

/** render: renders the current callback frame.
 *  @param: { float } current: the current frame time.
 */
function render (current) {
    
    // update the current and change in time
    current *= 0.001;
    var deltaTime = current - prev;
    prev = current;

    // clear the screen
    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // animate all of the objects
    for (var i = 0; i < rot_animations.length; i++) {
        rot_animations[i].animate (deltaTime);
    }

    drawSceneGraph (deltaTime);

    // callback
    window.requestAnimFrame (render);
}

/** generateCube: function to generate the vertices for a recursive sphere 
 *  based on the complexity (i.e., the levels of recursion) and the shading type.
 *  @pre: there must be defined global arrays: pointsArray to store the vertices
 *        and normalsArray to store the spheres normals
 *
 *  @param { int } vertexCount: the number of vertices to generate for the sphere.
 *  @param { int } shadingType: the type of shading to use: 
 *      0 => computes normals per polygon for per model shading (none).
 *      1 => computes normals per vertex for per fragment interpolated shading (Phong).
 *      2 => computes normals per polygon for per fragment shading (flat).
 *      3 => computes normals per vertex for per vertex interpolated shading (Gaurard).
 *
 *  @post: the global arrays pointsArray and normalsArray store the vertices and 
 *         normals for the generated sphere.
 */
function generateCube () {
    pointsArray = [];
    normalsArray = [];
    textureArray = [];

    quad (1, 0, 3, 2, cubeVertices, texCoord);
    quad (2, 3, 7, 6, cubeVertices, texCoord);
    quad (0, 4, 7, 3, cubeVertices, texCoord);
    quad (5, 1, 2, 6, cubeVertices, texCoord);
    quad (4, 5, 6, 7, cubeVertices, texCoord);
    quad (5, 4, 0, 1, cubeVertices, texCoord);
}

function generateCubeNormals (vertices) {
    normalsArray = [];

    AUX_generateCubeNormals (1, 0, 3, 2, vertices);
    AUX_generateCubeNormals (2, 3, 7, 6, vertices);
    AUX_generateCubeNormals (0, 4, 7, 3, vertices);
    AUX_generateCubeNormals (5, 1, 2, 6, vertices);
    AUX_generateCubeNormals (4, 5, 6, 7, vertices);
    AUX_generateCubeNormals (5, 4, 0, 1, vertices);
}

function AUX_generateCubeNormals (a, b, c, d, vertices) {
    var t1 = vec3.create ();
    var t2 = vec3.create ();
    vec4.subtract (t1, vertices[b], vertices[a]);
    vec4.subtract (t2, vertices[c], vertices[b]);

    t1 = vec3.fromValues (t1[0], t1[1], t1[2]);
    t2 = vec3.fromValues (t2[0], t2[1], t2[2]);

    var normal = vec3.create ();
    vec3.cross (normal, t1, t2);

    normalsArray.push (normal);
    normalsArray.push (normal);
    normalsArray.push (normal);
    normalsArray.push (normal);
    normalsArray.push (normal);
    normalsArray.push (normal);
}

function generateCubeTexCoords (texCoords) {
    textureArray = [];

    AUX_generateCubeTexCoords (1, 0, 3, 2, texCoords);
    AUX_generateCubeTexCoords (2, 3, 7, 6, texCoords);
    AUX_generateCubeTexCoords (0, 4, 7, 3, texCoords);
    AUX_generateCubeTexCoords (5, 1, 2, 6, texCoords);
    AUX_generateCubeTexCoords (4, 5, 6, 7, texCoords);
    AUX_generateCubeTexCoords (5, 4, 0, 1, texCoords);
}

function AUX_generateCubeTexCoords (a, b, c, d, texCoords) {
    textureArray.push (texCoords[3]);
    textureArray.push (texCoords[2]);
    textureArray.push (texCoords[1]);
    textureArray.push (texCoords[3]);
    textureArray.push (texCoords[1]);
    textureArray.push (texCoords[0]); 
}

function generateCubeVertices (vertices) {
    pointsArray = [];

    AUX_generateCubeVertices (1, 0, 3, 2, vertices);
    AUX_generateCubeVertices (2, 3, 7, 6, vertices);
    AUX_generateCubeVertices (0, 4, 7, 3, vertices);
    AUX_generateCubeVertices (5, 1, 2, 6, vertices);
    AUX_generateCubeVertices (4, 5, 6, 7, vertices);
    AUX_generateCubeVertices (5, 4, 0, 1, vertices);
}

function AUX_generateCubeVertices (a, b, c, d, vertices) {
    pointsArray.push (vertices[a]); 
    pointsArray.push (vertices[b]);  
    pointsArray.push (vertices[c]);  
    pointsArray.push (vertices[a]);  
    pointsArray.push (vertices[c]);
    pointsArray.push (vertices[d]);  
}

/** quad: generateCube helper function.
 */
function quad (a, b, c, d, vertices, texCoords) {
    generateCubeVertices (a, b, c, d, vertices);
    generateCubeNormals (a, b, c, d, vertices);
    generateCubeTexCoords (a, b, c, d, texCoords);
}


/** generateSphere: function to generate the vertices for a recursive sphere 
 *  based on the complexity (i.e., the levels of recursion) and the shading type.
 *  @pre: there must be defined global arrays: pointsArray to store the vertices
 *        and normalsArray to store the spheres normals
 *
 *  @param { int } vertexCount: the number of vertices to generate for the sphere.
 *  @param { int } shadingType: the type of shading to use: 
 *      0 => computes normals per polygon for per model shading (none).
 *      1 => computes normals per vertex for per fragment interpolated shading (Phong).
 *      2 => computes normals per polygon for per fragment shading (flat).
 *      3 => computes normals per vertex for per vertex interpolated shading (Gaurard).
 *
 *  @post: the global arrays pointsArray and normalsArray store the vertices and 
 *         normals for the generated sphere.
 */
function generateSphere (complexity) {
    pointsArray = [];
    normalsArray = [];
    textureArray = [];

    var va = vec4.fromValues (0.0, 0.0, -1.0,1);
    var vb = vec4.fromValues (0.0, 0.942809, 0.333333, 1);
    var vc = vec4.fromValues (-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4.fromValues (0.816497, -0.471405, 0.333333,1);

    tetrahedron (va, vb, vc, vd, complexity);
}

/** triangle: generateSphere helper function.
 */
function triangle (a, b, c) {

    pointsArray.push (a);
    pointsArray.push (b);      
    pointsArray.push (c);

    var N1 = vec3.fromValues (a[0], a[1], a[2], 0.0);
    var N2 = vec3.fromValues (b[0], b[1], b[2], 0.0);
    var N3 = vec3.fromValues (c[0], c[1], c[2], 0.0);

    normalsArray.push (N1);
    normalsArray.push (N2);
    normalsArray.push (N3);

    var tx1 = Math.atan2(a[0], a[2]) / (2 * Math.PI) + 0.5;
    var ty1 = Math.asin(a[1]) / Math.PI + .5;
    var tx2 = Math.atan2(b[0], b[2]) / (2 * Math.PI) + 0.5;
    var ty2 = Math.asin(b[1]) / Math.PI + .5;
    var tx3 = Math.atan2(c[0], c[2]) / (2 * Math.PI) + 0.5;
    var ty3 = Math.asin(c[1]) / Math.PI + .5;
/*
    var tx2 = Math.atan2 (b[0], b[2]) / (2 * Math.PI) + 0.5;
    var ty2 = Math.asin (b[1]) / Math.PI + 0.5;
    if (tx2 < 0.75 && tx1 > 0.75)
        tx2 += 1.0;
    else if(tx2 > 0.75 && tx1 < 0.75)
        tx2 -= 1.0;

    var tx3 = Math.atan2 (c[0], c[2]) / (2 * Math.PI) + 0.5;
    var ty3 = Math.asin (c[1]) / Math.PI + 0.5;
    if (tx3 < 0.75 && tx1 > 0.75)
        tx3 += 1.0;
    else if(tx2 > 0.75 && tx1 < 0.75)
        tx3 -= 1.0; */

    textureArray.push (vec2.fromValues (tx1, ty1));
    textureArray.push (vec2.fromValues (tx2, ty2));
    textureArray.push (vec2.fromValues (tx3, ty3));
}

/** divideTriangle: generateSphere helper function.
 */
function divideTriangle (a, b, c, count) {
    if (count > 0) {
                
        var ab = mix (a, b, 0.5);
        var ac = mix (a, c, 0.5);
        var bc = mix (b, c, 0.5);
                
        vec3.normalize (ab, ab);
        vec3.normalize (ac, ac);
        vec3.normalize (bc, bc);
                                
        divideTriangle (a, ab, ac, count - 1);
        divideTriangle (ab, b, bc, count - 1);
        divideTriangle (bc, c, ac, count - 1);
        divideTriangle (ab, bc, ac, count - 1);
    }
    else { 
        triangle (a, b, c);
    }
}

/** tetrahedron: generateSphere helper function.
 */
function tetrahedron (a, b, c, d, n, type) {
    divideTriangle (a, b, c, n, type);
    divideTriangle (d, c, b, n, type);
    divideTriangle (a, d, b, n, type);
    divideTriangle (a, c, d, n, type);
}

function mix (u, v, s)
{
    if (typeof s !== "number") {
        throw "mix: the last paramter " + s + " must be a number";
    }
    
    if (u.length != v.length) {
        throw "vector dimension mismatch";
    }

    var result = [];
    for (var i = 0; i < u.length; ++i) {
        result.push ((1.0 - s) * u[i] +  s * v[i]);
    }

    return result;
}


/** camReset: resets the global camera to its default state.
 */
function camReset () {
    cam = new camera ();
}


/**	Flattens an array of Float32Array's
 *	@param { Array } array: array to be flattened
 *	@ret { Float32Array } ret: a flattened array of floats
 */
function flattenArray (array) {
    var flattenedArray = [];

    for (var i = 0; i < array.length; i++) {
    	for (var j = 0; j < array[i].length; j++) {
    		flattenedArray.push (array[i][j]);
    	}
    }

    return new Float32Array (flattenedArray);
}

/** @endfile: test.js */
