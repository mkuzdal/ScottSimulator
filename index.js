/** @file: test.js
 *  Main runtime code for ScottSimulator
 *  Licensed under the MIT license
 *
 **/

/** GLOBALS: **/

// webGL variables
var canvas;
var gl;
var program;

var shadowFramebuffers = [];
var colorFramebuffer;

var currentScene;
var startMenuScene;
var mainScene;
var physicsDemoScene;
var project1Scene;
var survivalScene;
var eggertRoomScene;

var OFFSCREEN_WIDTH = 2048;
var OFFSCREEN_HEIGHT = 2048;

// storage for global vertices and normals
var pointsArray = [];
var normalsArray = [];
var textureArray = [];

// webGL uniforms
var projectionMatrixLoc;
var modelMatrixLoc;
var normalMatrixLoc;
var cameraMatrixLoc;
var lightProjectionMatrixLoc;
var lightMatrixLoc;

// previous frame time
var prev = 0;

// global index for generating sphere vertices
var index = 0;

// component containers for each of the objects
var objects = [];
var materials = [];
var geometries = [];
var textures = [];
var transforms = [];
var colliders = [];
var rigidBodies = [];
var clickEvents = [];
var crosshair;

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

window.onload = function loading () {
    setTimeout(init, 5000);
}

/** init: intialization function.
 */
function init () {

	// Get the canvas variable and set it up
	canvas = document.getElementById ("gl-canvas");

	gl = WebGLUtils.setupWebGL (canvas, {antialias: true});
	if (!gl) { alert ("WebGL isn't available"); }

	// GL setup for viewport and background color
	gl.viewport (0, 0, canvas.width, canvas.height);
	gl.clearColor (0.0, 0.0, 0.0, 1.0);

	gl.enable (gl.DEPTH_TEST);

	// Create the shader and vertex program
	program = initShaders (gl, "vertex-shader", "fragment-shader");
	gl.useProgram (program);

	colorFramebuffer = initColorFramebuffer ();
	for (var i = 0; i < 5; i++) {
        shadowFramebuffers.push (initShadowFramebuffer ());
    }

	// Get the local variable for each of the matrix uniforms
	modelMatrixLoc = gl.getUniformLocation (program, "modelMatrix");
	projectionMatrixLoc = gl.getUniformLocation (program, "projectionMatrix");
	normalMatrixLoc = gl.getUniformLocation (program, "normalMatrix");
	cameraMatrixLoc = gl.getUniformLocation (program, "cameraMatrix");
	lightMatrixLoc = gl.getUniformLocation (program, "lightMatrix");
	lightProjectionMatrixLoc = gl.getUniformLocation (program, "lightProjectionMatrix");

    startMenuScene = new sceneGraph (buildMenuSceneGraph);
	mainScene = new sceneGraph (buildSceneGraph);
    physicsDemoScene = new sceneGraph (buildPhysicsScene);
    project1Scene = new sceneGraph (buildProject1Scene);
    survivalScene = new sceneGraph (buildSurvivalScene);
    eggertRoomScene = new sceneGraph (buildEggertRoomSceneGraph);
    currentScene = startMenuScene;

    startMenuScene.build ();
    physicsDemoScene.build ();
    project1Scene.build ();
    survivalScene.build ();
    eggertRoomScene.build ();
	buildStateMachine ();

    crosshair = new Crosshair ([
            vec4.fromValues (0.0, 0.05, 0.5, 1.0),
            vec4.fromValues (0.0, -0.05, 0.5, 1.0),
            vec4.fromValues (0.05, 0.0, 0.5, 1.0),
            vec4.fromValues (-0.05, 0.0, 0.5, 1.0)
        ]);

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
            // console.log('The pointer lock status is now locked');
            document.addEventListener("mousemove", updateCamera, false);
        } else {
            // console.log('The pointer lock status is now unlocked');  
            document.removeEventListener("mousemove", updateCamera, false);
        }
    }

    function updateCamera(e) {
        currentScene.playerController.player.camera.mouseLook (e.movementX, e.movementY);
    }

    canvas.addEventListener ("mousedown", function (e) {
        var isRightMB;
		    e = e || window.event;

		    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
		        isRightMB = e.which == 3; 
		    else if ("button" in e)  // IE, Opera 
		        isRightMB = e.button == 2; 

		    if (isRightMB) {
		    	currentScene.clickManager.rightclicked = true;
		    } else {
		    	currentScene.clickManager.leftclicked = true;
		    }
    });

    canvas.addEventListener ("mouseup", function (e) {
        var isRightMB;
            e = e || window.event;

            if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                isRightMB = e.which == 3; 
            else if ("button" in e)  // IE, Opera 
                isRightMB = e.button == 2; 

            if (isRightMB) {
                currentScene.clickManager.rightreleased = true;
            } else {
                currentScene.clickManager.leftreleased = true;
            }
    });

    // Assigning keys
    window.addEventListener ("keydown", function (e) {
        switch (event.keyCode) {
            case 187: // =
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
                currentScene.animationsManager.toggleByAnimationTag ("rotate");
                break;
            }
            case 81: // q
            break;
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

    // Camera movement - consider abstracting into a player class
    window.addEventListener ("keydown", function (e) {
        switch (event.keyCode) {
            case 32: // space
                    currentScene.playerController.movingup = true;
                break;
            case 16: // shift
                    currentScene.playerController.movingdown = true;
                break;
            case 87: // w
                    currentScene.playerController.movingforward = true;
                break;
            case 65: // a
                    currentScene.playerController.movingleft = true;
                break;
            case 83: // s
                    currentScene.playerController.movingbackward = true;
                break;
            case 68: // d
                    currentScene.playerController.movingright = true;
                break;
        }
    }); 

    window.addEventListener ("keyup", function (e) {
        switch (event.keyCode) {
            case 32: // space
                    currentScene.playerController.movingup = false;
                break;
            case 16: // shift
                    currentScene.playerController.movingdown = false;
                break;
            case 87: // w
                    currentScene.playerController.movingforward = false;
                break;
            case 65: // a
                    currentScene.playerController.movingleft = false;
                break;
            case 83: // s
                    currentScene.playerController.movingbackward = false;
                break;
            case 68: // d
                    currentScene.playerController.movingright = false;
                break;
        }
    }); 

	prev = performance.now();
	prev *= 0.001;

	//Get rid of the loading screen
	loader = document.getElementById("loader");
	loader.style.display="none"; 


	window.requestAnimationFrame (render);
}

/** render: renders the current callback frame.
 *  @param: { float } current: the current frame time.
 */
function render (current) {
	// update the current and change in time
	current = performance.now();
	current *= 0.001;
	var deltaTime = current - prev;
	//cap the maximum delta time so that if you switch away from the tab and switch back everything won't go haywire
	if(deltaTime > 0.1) deltaTime=0.1;
	prev = current;

    // animate the camera rotation
    currentScene.updateCamera (deltaTime);

	// draw
	currentScene.render (deltaTime);

    // game checks - test conditions, etc. that are run every frame and are game specific.
    gameChecks ();

	// callback
	window.requestAnimationFrame (render);
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
    var texture;
    var framebuffer = gl.createFramebuffer();

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap (gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindFramebuffer (gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D (gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    framebuffer.texture = texture;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

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

function readTextFile(file)
{
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function ()
	{
		if(rawFile.readyState === 4)
		{
			if(rawFile.status === 200 || rawFile.status == 0)
			{
				var allText = rawFile.responseText;
				alert(allText);
			}
		}
	}
	rawFile.send(null);
}

/** @endfile: index.js */
