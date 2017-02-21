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

// shading specifiers
const SHADING_NONE = 0;
const SHADING_PHONG = 1; 
const SHADING_FLAT = 2;
const SHADING_GOURAUD = 3;

// webGL uniforms
var projectionMatrixLoc;
var modelViewMatrixLoc;
var normalMatrixLoc;
var cameraMatrixLoc;

// light and camera instance
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
var transforms = [];
var rot_animations = [];

var cubeVertices = [
    vec4 (-0.5, -0.5,  0.5, 1.0),
    vec4 (-0.5,  0.5,  0.5, 1.0),
    vec4 (0.5,  0.5,  0.5, 1.0),
    vec4 (0.5, -0.5,  0.5, 1.0),
    vec4 (-0.5, -0.5, -0.5, 1.0),
    vec4 (-0.5,  0.5, -0.5, 1.0),
    vec4 (0.5,  0.5, -0.5, 1.0),
    vec4 (0.5, -0.5, -0.5, 1.0)
];

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
        gl.bufferData (gl.ARRAY_BUFFER, flatten(_normals), gl.STATIC_DRAW);

        this.vBuffer = gl.createBuffer ();
        gl.bindBuffer (gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, flatten (_vertices), gl.STATIC_DRAW);
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
        gl.vertexAttribPointer (vNormal, 4, gl.FLOAT, false, 0, 0);
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
    constructor (_ambient, _diffuse, _specular, _shininess, _shader) {
        this.ambient = _ambient     || vec4 (1.0, 0.0, 1.0, 1.0);
        this.diffuse = _diffuse     || vec4 (1.0, 0.8, 0.0, 1.0);
        this.specular = _specular   || vec4 (1.0, 1.0, 1.0, 1.0);
        this.shininess = _shininess || 50.0;
        this.shader = _shader;
    }

    /** setup: enables all uniform variables to define the shading. 
     */
    setup () {
        gl.uniform4fv (gl.getUniformLocation(program, 
        "fAmbientMaterial"),flatten (this.ambient));
        gl.uniform4fv (gl.getUniformLocation(program, 
        "fDiffuseMaterial"),flatten (this.diffuse));
        gl.uniform4fv (gl.getUniformLocation(program, 
        "fSpecularMaterial"),flatten (this.specular));   
        gl.uniform1f (gl.getUniformLocation (program, 
        "fShininess"), this.shininess);
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
        this.position = _position   || vec3 (0.0, 0.0, 0.0);
        this.scale = _scale         || vec3 (1.0, 1.0, 1.0);
        this.rotation = _rotation   || angleAxisToQuat (0.0, vec3 (0.0, 1.0, 0.0));

        this.setMatrices ();
    }

    /** update: event loop function. Currently just sets the matrices for the object.
     *  @param { float } dTime: the time since the last framce callback (in seconds).
     */
    update (dTime) {
        this.setMatrices ();
    }
 
    /** setMatrices: sets the model and normal matrices for an object.
     */
    setMatrices () {
        this.NMmatrix = mult (scale (this.scale[0], this.scale[1], this.scale[2]), quaternionToMat (this.rotation));
        this.MVmatrix = mult (translate (this.position), this.NMmatrix);
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
        this.transform = _transform || new transform (vec3 (0.0, 0.0, 0.0), vec3 (1.0, 1.0, 1.0), angleAxisToQuat (0.0, vec3 (0.0, 1.0, 0.0)));
        this.ambient = _ambient     || vec4 (0.2, 0.2, 0.2, 1.0);
        this.diffuse = _diffuse     || vec4 (0.4, 0.4, 0.4, 1.0);
        this.specular = _specular   || vec4 (0.6, 0.6, 0.6, 1.0);
    }

    /** setup: sets up the lightposition uniform in the vertex shader.
     */
    setup () {
        var pos = vec4 (this.transform.position, 1.0);
        gl.uniform4fv (gl.getUniformLocation (program, 
        "fLightPosition"), flatten (pos));
        gl.uniform4fv (gl.getUniformLocation (program, 
        "fAmbientLight"), flatten (this.ambient));
        gl.uniform4fv (gl.getUniformLocation (program, 
        "fDiffuseLight"), flatten (this.diffuse));
        gl.uniform4fv (gl.getUniformLocation (program, 
        "fSpecularLight"), flatten (this.specular));
    }
}

function setupLights () {
    var pos1 = vec4 (lightSource1.transform.position, 1.0);
    var pos2 = vec4 (lightSource2.transform.position, 1.0);
    var locations = [ pos1 , pos2 ]; 
    var ambient = [ lightSource1.ambient , lightSource2.ambient ];
    var diffuse = [ lightSource1.diffuse , lightSource2.diffuse ];
    var specular = [ lightSource1.specular , lightSource2.specular ];

    gl.uniform4fv (gl.getUniformLocation (program, 
    "fLightPosition"), flatten (locations));
    gl.uniform4fv (gl.getUniformLocation (program, 
    "fAmbientLight"), flatten (ambient));
    gl.uniform4fv (gl.getUniformLocation (program, 
    "fDiffuseLight"), flatten (diffuse));
    gl.uniform4fv (gl.getUniformLocation (program, 
    "fSpecularLight"), flatten (specular));
}

/** object: an abstraction for a object. Objects contain a material, geometry,
 *  and transform object to define it. Objects can also be deactivated, causing
 *  their motion to still be upated, but they won't be drawn to the screen.
 */
class object {
    /** constructor: builds an instance of an object with given attributes.
     *  @param { transform } transform: the orientation and position of the object.
     *  @param { material } material: the material that defines an object.
     *  @param { geometry } geometry: the object's geometry to define it.
     */
    constructor (_transform, _material, _geometry) {
        this.transform = _transform || new transform ();
        this.material = _material;
        this.geometry = _geometry;
        this.active = true;

        this.LBF = vec4 (-0.5, -0.5, -0.5, 1.0);
        this.RTN = vec4 (0.5, 0.5, 0.5, 1.0);
    }

    /** update: event loop function. Calls the update function for the transform component.
     *  @param { float } dTime: the time since the last framce callback (in seconds).
     */
    update (dTime) {
        this.transform.update (dTime);
    }

    /** draw: draws the object to the screen.
     */
    draw () {
        if (!this.active)
            return;

        this.geometry.setup ();
        this.material.setup ();

        gl.uniformMatrix4fv (modelViewMatrixLoc, false, flatten (this.transform.MVmatrix));
        gl.uniformMatrix4fv (cameraMatrixLoc, false, flatten (cam.matrix));
        gl.uniformMatrix4fv (projectionMatrixLoc, false, flatten (cam.perspectiveProjectionMatrix)); 
        gl.uniformMatrix4fv (normalMatrixLoc, false, flatten (this.transform.NMmatrix));

        var x = mult (mult (cam.perspectiveProjectionMatrix, cam.matrix), this.transform.MVmatrix);

        var LBF_prime = vec4 ((x[0][0] * this.LBF[0] + x[0][1] * this.LBF[1] + x[0][2] * this.LBF[2] + x[0][3] * this.LBF[3]),
                              (x[1][0] * this.LBF[0] + x[1][1] * this.LBF[1] + x[1][2] * this.LBF[2] + x[1][3] * this.LBF[3]),
                              (x[2][0] * this.LBF[0] + x[2][1] * this.LBF[1] + x[2][2] * this.LBF[2] + x[2][3] * this.LBF[3]),
                              (x[3][0] * this.LBF[0] + x[3][1] * this.LBF[1] + x[3][2] * this.LBF[2] + x[3][3] * this.LBF[3]))

        if (LBF_prime[0] > LBF_prime[3]) {
            console.log ("HERE");
            return;
        }
        if (LBF_prime[1] > LBF_prime[3]) {
            console.log ("HERE");
            return;
        }
        if (LBF_prime[2] > LBF_prime[3]) {
            console.log ("HERE");
            return;
        }

        var RTN_prime = vec4 ((x[0][0] * this.RTN[0] + x[0][1] * this.RTN[1] + x[0][2] * this.RTN[2] + x[0][3] * this.RTN[3]),
                              (x[1][0] * this.RTN[0] + x[1][1] * this.RTN[1] + x[1][2] * this.RTN[2] + x[1][3] * this.RTN[3]),
                              (x[2][0] * this.RTN[0] + x[2][1] * this.RTN[1] + x[2][2] * this.RTN[2] + x[2][3] * this.RTN[3]),
                              (x[3][0] * this.RTN[0] + x[3][1] * this.RTN[1] + x[3][2] * this.RTN[2] + x[3][3] * this.RTN[3]))

        if (RTN_prime[0] + RTN_prime[3] < 0) {
            console.log ("HERE");
            return;
        }
        if (RTN_prime[1] + RTN_prime[3] < 0) {
            console.log ("HERE");
            return;
        }
        if (RTN_prime[2] < 0) {
            console.log ("HERE");
            return;
        }

        gl.drawArrays (gl.TRIANGLES, 0, this.geometry.Nvertices);
        gl.bindBuffer (gl.ARRAY_BUFFER, null);
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
        this.position = _position   || vec3 (0.0, 0.0, 15.0);
        this.rotation = _rotation   || eulerToQuat (0.0, 0.0, 0.0);
        this.speed = _speed         || 1.0;
        this.fovy = _fovy           || 50.0;
        this.aspect = _aspect       || canvas.width / canvas.height;
        this.far = _far             || 1000.0;
        this.near = _near           || 0.001;
        this.setPerspective ();
        this.setOrthographic ();
        this.setCameraMatrix ();
    }

    /** setPerspective: sets the perspective projection matrix.
     */
    setPerspective () {
        this.perspectiveProjectionMatrix = perspective (this.fovy, this.aspect, this.near, this.far);
    }

    /** setOrthographic: sets the orthographic projection matrix.
     */
    setOrthographic () {
        this.orthoProjectionMatrix = ortho (-this.aspect, this.aspect, -1.0, 1.0, -1.0, 1.0);
    }

    /** setCameraMatrix: sets the camera view matrix.
     */
    setCameraMatrix () {
        this.matrix = mult (quaternionToMat (this.rotation), translate (scale2 (-1, this.position)));

        gl.uniform3fv (gl.getUniformLocation (program, 
        "fCameraPosition"), flatten (this.position));
    }

    /** camMoveForward: moves the camera in the forwards direction by 'speed' many units.
     */
    camMoveForward () {
        if (this.observe == null) {
            var direction = quatFront (this.rotation);
            var to_move = scale2 (this.speed, direction);
            this.position = add (this.position, to_move);
            this.setCameraMatrix ();
            console.log ("Position: " + this.position);
        }
    }

    /** camMoveForward: moves the camera in the forwards direction by 'speed' many units.
     */
    camMoveBackwards () {
        if (this.observe == null) {
            var direction = quatFront (this.rotation);
            var to_move = scale2 (-this.speed, direction);
            this.position = add (this.position, to_move);
            this.setCameraMatrix ();
            console.log ("Position: " + this.position);
        }
    }

    /** camPitchUp: pitches the camera in the upwards direction by speed many units.
     */
    camPitchUp () {
        if (this.observe == null) {
            var quat = angleAxisToQuat (-this.speed, quatRight (this.rotation));
            //var quat = angleAxisToQuat (this.speed, vec3 (1.0, 0.0, 0.0));
            this.rotation = quatMult (this.rotation, quat);
            this.setCameraMatrix ();
        }
    }

    /** camPitchDown: pitches the camera in the downwards direction by speed many units.
     */
    camPitchDown () {
        if (this.observe == null) {
            var quat = angleAxisToQuat (this.speed, quatRight (this.rotation));
            //var quat = angleAxisToQuat (-this.speed, vec3 (1.0, 0.0, 0.0));
            this.rotation = quatMult (this.rotation, quat);
            this.setCameraMatrix ();
        }
    }

    /** camYawLeft: yaws the camera to the left by speed many units.
     */
    camYawLeft () {
        if (this.observe == null) {
            var quat = angleAxisToQuat (-this.speed, quatUp (this.rotation));
            //var quat = angleAxisToQuat (-this.speed, vec3 (0.0, 1.0, 0.0));
            this.rotation = quatMult (this.rotation, quat);
            this.setCameraMatrix ();
        } else {
            this.theta -= this.speed;
            console.log (this.theta);
        }
    }

    /** camYawLeft: yaws the camera to the right by speed many units.
     */
    camYawRight () {
        if (this.observe == null) {
            var quat = angleAxisToQuat (this.speed, quatUp (this.rotation));
            //var quat = angleAxisToQuat (this.speed, vec3 (0.0, 1.0, 0.0));
            this.rotation = quatMult (this.rotation, quat);
            this.setCameraMatrix ();
        } else {
            this.theta += this.speed;
            console.log (this.theta);
        }
    }

    /** camSetSpeed: sets the camera speed.
     *  @param: { float } speed: the speed to set the camera to.
     */
    camSetSpeed (speed) {
        this.speed = speed;
        console.log ("Speed: " + speed);
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
        var to_rot = angleAxisToQuat (this.theta, this.axis);
        this.object.transform.rotation = slerp (this.object.transform.rotation, to_rot, 1.0);
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
    lightSource1 = new light (new transform (vec3 (10.0, 0.0, 10.0), vec3 (1.0, 1.0, 1.0), angleAxisToQuat (0.0, vec3 (0.0, 1.0, 0.0))),
                              vec4 (0.2, 0.2, 0.2, 1.0),
                              vec4 (0.0, 0.0, 1.0, 1.0),
                              vec4 (1.0, 1.0, 1.0, 1.0));
    lightSource2 = new light (new transform (vec3 (-10.0, 0.0, 10.0), vec3 (1.0, 1.0, 1.0), angleAxisToQuat (0.0, vec3 (0.0, 1.0, 0.0))),
                              vec4 (0.2, 0.2, 0.2, 1.0),
                              vec4 (1.0, 0.0, 0.0, 1.0),
                              vec4 (1.0, 1.0, 1.0, 1.0));
    setupLights ();

    // generate each of the spheres and create a geometry instance to define it
    generateCubeNormals (cubeVertices);
    generateCubeVertices (cubeVertices);
    geometries.push (new geometry (pointsArray, normalsArray));

    // create the materials for each of the 6 bodies (sun, planet1, planet2, planet3, planet4, moon)
    materials =         [   new material (vec4 (0.6, 0.6, 0.6, 1.0),   vec4 (0.6, 0.6, 0.6, 1.0),    vec4 (0.6, 0.6, 0.6, 1.0),    40.0,  SHADING_PHONG),
                            new material (vec4 (0.6, 0.6, 0.6, 1.0),   vec4 (0.6, 0.6, 0.6, 1.0),    vec4 (0.6, 0.6, 0.6, 1.0),    40.0,  SHADING_PHONG)
                        ]; 

    // create the transforms for each of the 6 bodies.
    transforms =        [   new transform (vec3 (-4.0, 0.0, 0.0),     vec3 (2.0, 2.0, 2.0), angleAxisToQuat (0.0, vec3 (0.0, 1.0, 0.0))),
                            new transform (vec3 (4.0,  0.0, 0.0),     vec3 (2.0, 2.0, 2.0), angleAxisToQuat (0.0, vec3 (0.0, 1.0, 0.0)))
                        ];

    // create the object for each of the 6 bodies.
    cubes  =            [   new object (transforms[0], materials[0], geometries[0]),
                            new object (transforms[1], materials[1], geometries[0])
                        ];

    rot_animations =    [   new animationRotation (cubes[0], 0.0, 120.0, vec3 (0.0, 1.0, 0.0)),
                            new animationRotation (cubes[1], 0.0, 180.0, vec3 (1.0, 0.0, 0.0))
                        ];


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
    
    // update and draw all of the objects
    for (var i = 0; i < cubes.length; i++) {
        cubes[i].update (deltaTime);
        cubes[i].draw ();
    }

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
    var t1 = subtract (vertices[b], vertices[a]);
    var t2 = subtract (vertices[c], vertices[b]);
    var normal = cross (t1, t2);
    var normal = vec4 (normal, 0.0);

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

/** camReset: resets the global camera to its default state.
 */
function camReset () {
    cam = new camera ();
}

/** lerp: Linear Interpolation function.
 *  @param { vec3 } v1: the initial vector.
 *  @param { vec3 } v2: the vector to interpolate to.
 *  @param { float } u: the interpolation factor (0 <= u <= 1).
 *  @ret { vec3 } ret: the resulting vector.
 */
function lerp (v1, v2, u) {
    return add (scale2 (1 - u, v1), scale2 (u, v2));
}

/**	Flattens an array of mat4's
 *	@param { Array } array: array to be flattened
 *	@ret { Float32Array } ret: a flattened array of floats
 */
function flattenMatrixArray(array) {
    var flattenedArray = [];
    for (var i = 0; i < array.length; i++) {
    	for (var j = 0; j < 16; j++) {
    		flattenedArray.push(array[i][j]);
    	}
    }
    return new Float32Array(ret);
}

/** @endfile: test.js */
