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

var frameBufferObject;
var colorFramebuffer;

var OFFSCREEN_WIDTH = 1024;
var OFFSCREEN_HEIGHT = 1024;

// storage for global vertices and normals
var pointsArray = [];
var normalsArray = [];
var textureArray = [];

// webGL uniforms
var projectionMatrixLoc;
var modelViewMatrixLoc;
var normalMatrixLoc;
var cameraMatrixLoc;
var lightProjectionMatrixLoc;
var lightMatrixLoc;

var modelViewMatrixSha;
var lightProjectionMatrixSha;
var lightMatrixSha;

var lightsManager;
var animationsManager;

var clicked = false;

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

// player variables; consider abstracting into a player class
var cam;
var movingforward = false;
var movingbackward = false;
var movingleft = false;
var movingright = false;
var movingup = false;
var movingdown = false;

// some objects
var color = new Uint8Array (4);

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

var planeVertices = [
    vec4.fromValues (-10.0, 0.0, 10.0, 1.0),
    vec4.fromValues (-10.0, 0.0, -10.0, 1.0),
    vec4.fromValues (10.0, 0.0, -10.0, 1.0),
    vec4.fromValues (10.0, 0.0, 10.0, 1.0)
];

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
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

    gl.enable (gl.DEPTH_TEST);

    // Setting up pointerlock
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

    canvas.onclick = function() {
        canvas.requestPointerLock();
    };

    document.addEventListener('pointerlockchange', lockChange, false);
    document.addEventListener('mozpointerlockchange', lockChange, false);

    function lockChange() {
      if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
            console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", updateCamera, false);
        } else {
            console.log('The pointer lock status is now unlocked');  
            document.removeEventListener("mousemove", updateCamera, false);
        }
    }

    function updateCamera(e) {
        cam.mouseLook (e.movementX, e.movementY);
    }

    canvas.addEventListener ("mousedown", function (e) {
        clicked = true;
    });

    // Assigning keys
    window.addEventListener ("keydown", function (e) {
        switch (event.keyCode) {
            case 32: // space
            {
                cam.camMoveUp (1);
                break;
            }
            case 16: // shift
            {
                cam.camMoveDown (1);
                break;
            }
            case 187: // =
            {
                ch.active = !ch.active;
                break;
            }
            case 73: // i
            case 79: // o
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
                break;
            }
            case 82: // r
            {
                animationsManager.toggleByAnimationTag ("rotate");
                break;
            }
            case 81: // q

            break;
            case 87: // w
            {
                cam.camMoveForward(1);
                break;
            }
            case 65: // a
            {
                cam.camMoveLeft(1);
                break;
            }
            case 83: // s
            {   
                cam.camMoveBackward(1);
                break;
            }
            case 68: // d
            {
                cam.camMoveRight(1);
                break;
            }
            case 69: // e
            case 84: // t
            case 89: // y
            case 38: // up
            case 40: // down 
            case 37: // left
            case 39: // right
            default:
                break;
        }
    }); 

    // Create the shader and vertex program
    program = initShaders (gl, "vertex-shader", "fragment-shader");
    gl.useProgram (program);

    colorFramebuffer = initColorFramebuffer ();
    frameBufferObject = initShadowFramebuffer ();

    // Get the local variable for each of the matrix uniforms
    modelViewMatrixLoc = gl.getUniformLocation (program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation (program, "projectionMatrix");
    normalMatrixLoc = gl.getUniformLocation (program, "normalMatrix");
    cameraMatrixLoc = gl.getUniformLocation (program, "cameraMatrix");
    lightMatrixLoc = gl.getUniformLocation (program, "lightMatrix");
    lightProjectionMatrixLoc = gl.getUniformLocation (program, "lightProjectionMatrix");

    lightsManager = new lightHandler ();
    animationsManager = new animationHandler ();

    lightsManager.addSource (new light (new transform (vec3.fromValues (-40.0, 0.0, 0.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (1.0, 0.1, 0.1, 1.0),
                              vec4.fromValues (1.0, 1.0, 1.0, 1.0)));

    lightsManager.lightSources[0].tag = "red";

    lightsManager.addSource (new light (new transform (vec3.fromValues (10.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.1, 0.1, 1.0, 1.0),
                              vec4.fromValues (1.0, 1.0, 1.0, 1.0)));

    lightsManager.lightSources[1].tag = "blue";

    lightsManager.addSource (new light (new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.1, 1.0, 0.1, 1.0),
                              vec4.fromValues (1.0, 1.0, 1.0, 1.0)));

    lightsManager.lightSources[2].tag = "green";

    // generate each of the spheres and create a geometry instance to define it
    generateSphere (5);
    geometries.push (new geometry (pointsArray, normalsArray));
    textures.push (new texture (document.getElementById ("TEXfrance"), textureArray, [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]));

    generateCubeNormals (cubeVertices);
    generateCubeVertices (cubeVertices);
    generateCubeTexCoords (texCoords);

    cam = new camera ();

    geometries.push (new geometry (pointsArray, normalsArray));
    textures.push (new texture (document.getElementById ("TEXfrance"), textureArray, [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]));


    // create the materials for each of the 6 bodies (sun, planet1, planet2, planet3, planet4, moon)
    materials =         [   new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0)
                        ]; 

    // create the transforms for each of the 6 bodies.
    transforms =        [   new transform (vec3.fromValues (-4.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                            new transform (vec3.fromValues (4.0,  0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                            new transform (vec3.fromValues (0.0,  4.0, 0.0), vec3.fromValues (2.0, 2.0, 2.0), quat.create ()),
                            new transform (vec3.fromValues (-2.0, 0.0, 0.0), vec3.fromValues (0.5, 0.5, 0.5), quat.create ())
                        ];

    colliders =         [   new sphereCollider (vec3.fromValues (0.0, 0.0, 0.0), 1.0),
                            new sphereCollider (vec3.fromValues (0.0, 0.0, 0.0), 0.5),
                            new sphereCollider (vec3.fromValues (0.0, 0.0, 0.0), 1.0),
                            new sphereCollider (vec3.fromValues (0.0, 0.0, 0.0), 0.5)
                        ];

    // create the object for each of the 6 bodies.
    cubes  =            [   new object (transforms[0], materials[0], geometries[0], textures[0], colliders[0]),
                            new object (transforms[1], materials[1], geometries[1], textures[1], colliders[1]),
                            new object (transforms[2], materials[2], geometries[0], textures[0], colliders[2]),
                            new object (transforms[3], materials[3], geometries[1], textures[1], colliders[3])
                        ];

    cubes[0] = new object ();
    cubes[0].loadFromObj ("chairOBJ", "chairMAT", "chairTEX");
    cubes[0].transform = transforms[0];
    cubes[0].collider = colliders[0];

    animationsManager.animations.push (new animationRotation (cubes[0], 0.0, 120.0, vec3.fromValues (1.0, 1.0, 0.0)));
    animationsManager.animations.push (new animationRotation (cubes[1], 0.0, 180.0, vec3.fromValues (1.0, 0.0, 0.0)));
    animationsManager.animations.push (new animationRotation (cubes[2], 0.0, 120.0, vec3.fromValues (0.0, 0.0, 1.0)));
    animationsManager.animations.push (new animationRotation (cubes[3], 0.0, 360.0, vec3.fromValues (0.0, 0.0, 1.0)));

    generatePlane ();
    cubes.push (new object (new transform (vec3.fromValues (0.0, -3.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            new geometry (pointsArray, normalsArray),
                            new texture (document.getElementById ("TEXfrance"), textureArray, [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]))
                );

    cubes[4].collider = new boxCollider (planeVertices);

    buildSceneGraph ();

    animationsManager.deactivateAll ();

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

    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // animate all of the objects
    animationsManager.animateAll (deltaTime);
    lightsManager.setupAll ();

    // animate the camera rotation
    cam.updateRotation (deltaTime);
    gl.uniformMatrix4fv (cameraMatrixLoc, false, cam.matrix);
    gl.uniform3fv (gl.getUniformLocation (program, "fCameraPosition"), cam.position);

    // draw
    drawSceneGraph (deltaTime);

    // callback
    window.requestAnimFrame (render);
}

function generatePlane () {
    pointsArray = [];
    normalsArray = [];
    textureArray = [];

    quad (1, 0, 3, 2, planeVertices, texCoords);
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

    quad (1, 0, 3, 2, cubeVertices, texCoords);
    quad (2, 3, 7, 6, cubeVertices, texCoords);
    quad (0, 4, 7, 3, cubeVertices, texCoords);
    quad (5, 1, 2, 6, cubeVertices, texCoords);
    quad (4, 5, 6, 7, cubeVertices, texCoords);
    quad (5, 4, 0, 1, cubeVertices, texCoords);
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

    AUX_generateCubeTexCoords (1, 0, 3, 2, texCoords);
    AUX_generateCubeVertices (1, 0, 3, 2, vertices);
    AUX_generateCubeNormals (1, 0, 3, 2, vertices);
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

function initShadowFramebuffer () {
    /*var texture, depthBuffer;
    var framebuffer = gl.createFramebuffer();

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture, 0);

    depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer); 

    framebuffer.texture = texture;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return framebuffer; */

    // Query the extension
    var depthTextureExt = gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
    if(!depthTextureExt) { doSomeFallbackInstead(); return; }

    // Create a color texture
    var colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // Create the depth texture
    var depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);

    framebuffer.texture = colorTexture;

    return framebuffer;
}

function initColorFramebuffer () {
    var texture;
    var framebuffer = gl.createFramebuffer();

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap (gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D (gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    framebuffer.texture = texture;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return framebuffer;
}

/** @endfile: test.js */
