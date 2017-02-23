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

var cam;
var lightsManager;
var animationsHander;

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
                animationsHander.toggleAll ();
                break;
            }
            case 83: // s
            {
                lightsManager.toggleAll ();
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

    lightsManager = new lightManager ();
    animationsHander = new animationHandler ();

    lightsManager.addSource (new light (new transform (vec3.fromValues (10.0, 0.0, 10.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.8, 0.3, 0.3, 1.0),
                              vec4.fromValues (1.0, 1.0, 1.0, 1.0)));

    lightsManager.addSource (new light (new transform (vec3.fromValues (-10.0, 0.0, 10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.8, 0.8, 0.8, 1.0),
                              vec4.fromValues (1.0, 1.0, 1.0, 1.0)));

    lightsManager.setupAll ();

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
    transforms =        [   new transform (vec3.fromValues (-4.0, 0.0, 0.0), vec3.fromValues (2.0, 2.0, 2.0), quat.create ()),
                            new transform (vec3.fromValues (4.0,  0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                            new transform (vec3.fromValues (0.0,  4.0, 0.0), vec3.fromValues (2.0, 2.0, 2.0), quat.create ()),
                            new transform (vec3.fromValues (-2.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ())
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

    animationsHander.animations.push (new animationRotation (cubes[0], 0.0, 120.0, vec3.fromValues (1.0, 1.0, 0.0)));
    animationsHander.animations.push (new animationRotation (cubes[1], 0.0, 180.0, vec3.fromValues (1.0, 0.0, 0.0)));
    animationsHander.animations.push (new animationRotation (cubes[2], 0.0, 120.0, vec3.fromValues (0.0, 0.0, 1.0)));
    animationsHander.animations.push (new animationRotation (cubes[3], 0.0, 360.0, vec3.fromValues (0.0, 0.0, 1.0)));

    var l = new object ();
    l.loadFromObj ("testCubeOBJ", "testCubeMAT", "testCubeTEX");
    cubes.push (l);

    buildSceneGraph ();

    l.transform = transforms[0];

    animationsHander.deactivateAll ();

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
    animationsHander.animateAll (deltaTime);
    lightsManager.setupAll (deltaTime);

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
