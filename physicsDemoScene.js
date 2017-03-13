// like the functions in game.js, this function builds a scene graph, this time for the physics testing room
function buildPhysicsScene (SGraph) {

    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (50.0, 40.0, 0.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec3.fromValues (0.0, 0.0, 0.0),
                              vec4.fromValues (0.1, 0.1, 0.1, 1.0),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.3, 0.3, 0.3, 1.0)));

    SGraph.lightsManager.lightSources[0].tag = "red";

    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (-50.0, 40.0, 0.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec3.fromValues (0.0, 0.0, 0.0),
                              vec4.fromValues (0.1, 0.1, 0.1, 1.0),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.3, 0.3, 0.3, 1.0)));

    SGraph.lightsManager.lightSources[1].tag = "blue";

    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (0.0, 40.0, 50.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec3.fromValues (0.0, 0.0, 0.0),
                              vec4.fromValues (0.1, 0.1, 0.1, 1.0),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.3, 0.3, 0.3, 1.0)));

    SGraph.lightsManager.lightSources[2].tag = "green";

    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (0.0, 40.0, -50.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec3.fromValues (0.0, 0.0, 0.0),
                              vec4.fromValues (0.1, 0.1, 0.1, 1.0),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.3, 0.3, 0.3, 1.0)));

    SGraph.lightsManager.lightSources[3].tag = "white";

    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (0.0, 40.0, 0.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec3.fromValues (0.0, 0.0, 0.0),
                              vec4.fromValues (0.1, 0.1, 0.1, 1.0),
                              vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                              vec4.fromValues (0.3, 0.3, 0.3, 1.0)));

    SGraph.lightsManager.lightSources[4].tag = "black";


    var cam = new camera ([0,0,0], glMatrix.toRadian(180), glMatrix.toRadian(5));
    var player = new object (new transform (vec3.fromValues (0.0, 10.0, -15.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                         null, 
                         null, 
                         null,
                         new boxCollider (vec3.fromValues (-0.25, -5, -0.25), vec3.fromValues (0.25, 0.0, 0.25), "dynamic"),
                         new rigidBody (100.0, "dynamic"));

    player.camera = cam;
    player.rigidBody.angularRigidBody = false;
    player.tag = "player";

    SGraph.playerController = new PlayerController (player);

    generateCubeNormals (cubeVertices);
    generateCubeVertices (cubeVertices);
    generateCubeTexCoords (texCoords);

    var prismGeo = new geometry (pointsArray, normalsArray, textureArray);

	// floor
    var floor = new object (new transform (vec3.fromValues (0.0, -10.0, 0.0), vec3.fromValues (1000.0, 3.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    floor.tag = "world";
    SGraph.push (floor);

    var roof = new object  (new transform (vec3.fromValues (0.0, 40.0, 0.0), vec3.fromValues (1000.0, 3.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    roof.tag = "world";
    SGraph.push (roof);

    var left = new object  (new transform (vec3.fromValues (-30.0, 0.0, 0.0), vec3.fromValues (3.0, 1000.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    left.tag = "world";
    SGraph.push (left);

    var right = new object (new transform (vec3.fromValues (30.0, 0.0, 0.0), vec3.fromValues (3.0, 1000.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    right.tag = "world";
    SGraph.push (right);

    var front = new object (new transform (vec3.fromValues (0.0, 0.0, 30.0), vec3.fromValues (1000.0, 1000.0, 3.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    front.tag = "world";
    SGraph.push (front);

    var back = new object  (new transform (vec3.fromValues (0.0, 0.0, -30.0), vec3.fromValues (1000.0, 1000.0, 3.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    back.tag = "world";
    SGraph.push (back);

    var stool = new object ();
    stool.tag = "tag";
    stool.loadFromObj ("stoolOBJ", "stoolMAT", "stoolTEX");
    stool.transform = new transform (vec3.fromValues (-1.0, 10.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    stool.addRigidBody (new rigidBody (50.0, "dynamic"));
    stool.collider.physics = "dynamic";

    SGraph.push (stool);

    var cube = new object (new transform (vec3.fromValues (0.0, 20.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                           new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                           prismGeo,
                           new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                           new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "dynamic"),
                           new rigidBody (5.0, "dynamic"));
    cube.tag = "cube";
    
    SGraph.push (cube);

    generateSphere (5);
    var sphereGeo = new geometry (pointsArray, normalsArray, textureArray);

    var sphere = new object (new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                             new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                             sphereGeo,
                             new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                             new sphereCollider (vec3.fromValues (0.0, 0.0, 0.0), 1.0, "dynamic"),
                             new rigidBody (10.0, "dynamic"));

    sphere.tag = "sphere";

    player.addAnimation (new animationScaleObject (player, cube));
    player.animations[0].object = cube;
    player.addAnimation (new animationLaunchObject (player, sphere));
    player.animations[1].object = sphere;

    SGraph.push (player);
}




