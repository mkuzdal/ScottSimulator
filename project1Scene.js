// like the functions in game.js, this function builds a scene graph, this time for the clone of assignment 1
function buildProject1Scene (SGraph) {

    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec3.fromValues (0.0, 0.0, 0.0),
                              vec4.fromValues (0.6, 0.6, 0.6, 1.0),
                              vec4.fromValues (0.6, 0.6, 0.6, 1.0),
                              vec4.fromValues (0.6, 0.6, 0.6, 1.0)));

    SGraph.lightsManager.lightSources[0].tag = "light";
    SGraph.lightsManager.lightSources[0].shadows = false;

    var cam = new camera ([0,0,0], glMatrix.toRadian (0.0), glMatrix.toRadian (0.0));
    var rot = quat.create ();
    quat.setAxisAngle (rot, [0,1,0], glMatrix.toRadian (0.0));

    var player = new object (new transform (vec3.fromValues (0.0, 0.0, 40.0), vec3.fromValues (1.0, 1.0, 1.0), rot),
                         null, 
                         null, 
                         null,
                         new nullCollider (),
                         null);

    player.camera = cam;
    player.tag = "player";

    SGraph.playerController = new PlayerControllerFly (player);
    SGraph.push (player);

    generateCubeNormals (cubeVertices);
    generateCubeVertices (cubeVertices);
    generateCubeTexCoords (texCoords);

    var prismGeo = new geometry (pointsArray, normalsArray, textureArray);

    var cubes = new object ();
    cubes.children.push (new object (new transform (vec3.fromValues (-10.0, -10.0, -10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                     new material (vec4.fromValues (1.0, 0.0, 0.0, 1.0), vec4.fromValues (1.0, 0.0, 0.0, 1.0), vec4.fromValues (1.0, 0.0, 0.0, 1.0), 40.0),
                                     prismGeo,
                                     new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]),
                                     new nullCollider (),
                                     null
                                     ));

    cubes.children.push (new object (new transform (vec3.fromValues (-10.0, -10.0, 10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                     new material (vec4.fromValues (1.0, 1.0, 0.0, 1.0), vec4.fromValues (1.0, 1.0, 0.0, 1.0), vec4.fromValues (1.0, 1.0, 0.0, 1.0), 40.0),
                                     prismGeo,
                                     new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]),
                                     new nullCollider (),
                                     null 
                                     ));

    cubes.children.push (new object (new transform (vec3.fromValues (-10.0, 10.0, -10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                     new material (vec4.fromValues (1.0, 0.0, 1.0, 1.0), vec4.fromValues (1.0, 0.0, 1.0, 1.0), vec4.fromValues (1.0, 0.0, 1.0, 1.0), 40.0),
                                     prismGeo,
                                     new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]),
                                     new nullCollider (),
                                     null 
                                     ));

    cubes.children.push (new object (new transform (vec3.fromValues (-10.0, 10.0, 10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                     new material (vec4.fromValues (0.0, 1.0, 0.0, 1.0), vec4.fromValues (0.0, 1.0, 0.0, 1.0), vec4.fromValues (0.0, 1.0, 0.0, 1.0), 40.0),
                                     prismGeo,
                                     new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]),
                                     new nullCollider (),
                                     null 
                                     ));

    cubes.children.push (new object (new transform (vec3.fromValues (10.0, -10.0, -10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                     new material (vec4.fromValues (0.0, 1.0, 1.0, 1.0), vec4.fromValues (0.0, 1.0, 1.0, 1.0), vec4.fromValues (0.0, 1.0, 1.0, 1.0), 40.0),
                                     prismGeo,
                                     new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]),
                                     new nullCollider (),
                                     null 
                                     ));

    cubes.children.push (new object (new transform (vec3.fromValues (10.0, -10.0, 10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                     new material (vec4.fromValues (0.0, 0.0, 1.0, 1.0), vec4.fromValues (0.0, 0.0, 1.0, 1.0), vec4.fromValues (0.0, 0.0, 1.0, 1.0), 40.0),
                                     prismGeo,
                                     new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]),
                                     new nullCollider (),
                                     null 
                                     ));

    cubes.children.push (new object (new transform (vec3.fromValues (10.0, 10.0, -10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                     new material (vec4.fromValues (1.0, 0.5, 0.0, 1.0), vec4.fromValues (1.0, 0.5, 0.0, 1.0), vec4.fromValues (1.0, 0.5, 0.0, 1.0), 40.0),
                                     prismGeo,
                                     new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]),
                                     new nullCollider (),
                                     null 
                                     ));

    cubes.children.push (new object (new transform (vec3.fromValues (10.0, 10.0, 10.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                     new material (vec4.fromValues (0.0, 0.5, 1.0, 1.0), vec4.fromValues (0.0, 0.5, 1.0, 1.0), vec4.fromValues (0.0, 0.5, 1.0, 1.0), 40.0),
                                     prismGeo,
                                     new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]),
                                     new nullCollider (),
                                     null 
                                     ));

    for (var i = 0; i < cubes.children.length; i++) {
        var omega = 40 + 10 * i;
        var randX = Math.random ();
        var randY = Math.random ();
        var randZ = Math.random ();
        var axis = vec3.fromValues (randX, randY, randZ);
        vec3.normalize (axis, axis);
        cubes.children[i].addAnimation (new animationRotation (cubes.children[i], omega, axis));
    } 

    SGraph.push (cubes);
}
