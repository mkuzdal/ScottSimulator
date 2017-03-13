// This builds the scene graph for the main menu, which is just a big box and a start button
function buildMenuSceneGraph(SGraph) {

    // Adding a bunch of light sources to the world so it looks nice
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

    SGraph.lightsManager.lightSources[0].tag = "black";

    // Setting up the camera and attaching it to a player with a collider
    var cam = new camera ([0,0,0], glMatrix.toRadian(180), glMatrix.toRadian(5));
    var player = new object (new transform (vec3.fromValues (0.0, 5.0, -15.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                         null, 
                         null, 
                         null,
                         new boxCollider (vec3.fromValues (-0.25, -5, -0.25), vec3.fromValues (0.25, 0.0, 0.25), "dynamic"),
                         new rigidBody (100.0, "dynamic"));

    player.camera = cam;
    player.rigidBody.angularRigidBody = false;
    player.tag = "player";

    SGraph.playerController = new PlayerController (player);
    SGraph.push (player);

    generateCubeNormals (cubeVertices);
    generateCubeVertices (cubeVertices);
    generateCubeTexCoords (texCoords);

    var prismGeo = new geometry (pointsArray, normalsArray, textureArray);

    // Setting up planes and box colliders, just a big box
    var floor = new object (new transform (vec3.fromValues (0.0, -4.0, 0.0), vec3.fromValues (1000.0, 3.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    floor.tag = "world";
    SGraph.push (floor);

    var roof = new object  (new transform (vec3.fromValues (0.0, 40.0, 0.0), vec3.fromValues (1000.0, 3.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    roof.tag = "world";
    SGraph.push (roof);

    var left = new object  (new transform (vec3.fromValues (-30.0, 0.0, 0.0), vec3.fromValues (3.0, 1000.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    left.tag = "world";
    SGraph.push (left);

    var right = new object (new transform (vec3.fromValues (30.0, 0.0, 0.0), vec3.fromValues (3.0, 1000.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    right.tag = "world";
    SGraph.push (right);

    var front = new object (new transform (vec3.fromValues (0.0, 0.0, 30.0), vec3.fromValues (1000.0, 1000.0, 3.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    front.tag = "world";
    SGraph.push (front);

    var back = new object  (new transform (vec3.fromValues (0.0, 0.0, -30.0), vec3.fromValues (1000.0, 1000.0, 3.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), vec4.fromValues (0.6, 0.6, 0.6, 0.7), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (1000.0, "static"));
    back.tag = "world";
    SGraph.push (back);

    // Add a single button to the scene, this takes you into the main game
    var startButton = new object ();
    startButton.tag = "startButton";
    startButton.loadFromObj ("buttonOBJ", "buttonMAT", "buttonstartTEX");
    startButton.transform = new transform (vec3.fromValues (0.0, 0.15, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    var startButtonMount = new object ();
    startButtonMount.tag = "startButtonMount";
    startButtonMount.loadFromObj ("buttonMountOBJ", "buttonMountMAT", "buttonMountTEX");
    var rotation = quat.create();
    quat.rotateZ(rotation, rotation, glMatrix.toRadian(-90));
    quat.rotateX(rotation, rotation, glMatrix.toRadian(-90));
    startButtonMount.transform = new transform (vec3.fromValues (0.0, 3.0, 0.0), vec3.fromValues (4.0, 4.0, 4.0), quat.clone (rotation));
    startButtonMount.children.push (startButton);

    startButtonMount.children[0].addOnMouseClickTrigger(function(object) {
        StateManager.apply("clickStart");
    });

    SGraph.push(startButtonMount);
}

// This builds the scene graph for the main lecture room
function buildSceneGraph (SGraph) {

    generateCubeNormals (cubeVertices);
    generateCubeVertices (cubeVertices);
    generateCubeTexCoords (texCoords);
    // This function and all the similar scene graph generating function follow the general struction of:
    // add lights
    // add visible objects
    // add invisible objects (to be used as triggers for events)

    // Add a bunch of lights and a camera to the scene
    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (0.0, 40.0, -45.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                               vec3.fromValues (0.0, -4.0, 10.0),
                                               vec4.fromValues (0.1, 0.1, 0.1, 1.0),
                                               vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                                               vec4.fromValues (0.2, 0.2, 0.2, 1.0)));

    SGraph.lightsManager.lightSources[0].tag = "front";

    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (0.0, 12.0, 172.34034729003906), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                               vec3.fromValues (0.0, 0.0, 172.34034729003906),
                                               vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                                               vec4.fromValues (0.4, 0.4, 0.4, 1.0),
                                               vec4.fromValues (0.2, 0.2, 0.2, 1.0)));

    SGraph.lightsManager.lightSources[1].tag = "hallway";
    SGraph.lightsManager.lightSources[1].shadows = false;

    var cam = new camera ([0,0,0], glMatrix.toRadian(180), glMatrix.toRadian(5));
    var player = new object (new transform (vec3.fromValues (0.0, 5.0, -15), vec3.fromValues (1.0, 1.0, 1.0), vec4.fromValues (0.0, 0.3827, 0.0, 0.9239)),
                         null, 
                         null, 
                         null,
                         new boxCollider (vec3.fromValues (-0.25, -5, -0.25), vec3.fromValues (0.25, 0.0, 0.25), "dynamic"),
                         new rigidBody (100.0, "dynamic"));

    player.camera = cam;
    player.rigidBody.angularRigidBody = false;
    player.tag = "player";

    SGraph.push (player);
    // Attach a player controller to the player object
    SGraph.playerController = new PlayerController (player);
    // For a long section after this, just adding various objects to the scene
    // This includes adding invisible objects as triggers (on collide)
	// room
	room = new object ();
    room.tag = "world";
	room.loadFromObj ("roomOBJ", "roomMAT", "roomTEX");
	room.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    room.collider = new nullCollider ();

    var roomColliders = [];

    // Wall inbetween chairs and back door
    var rotation = quat.create ();
    quat.setAxisAngle (rotation, [1.0, 0.0, 0.0], glMatrix.toRadian (90));
    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, 10.0, 12.5), vec3.fromValues (21.0, 1.0, 10.0), rotation),
                            null, null, null, 
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    
    // roof
    var rotation = quat.create ();
    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, 15.0, 0.0), vec3.fromValues (100.0, 5.0, 100.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    ); 

    // back wall right
    var rotation = quat.create ();
    quat.setAxisAngle (rotation, [1.0, 0.0, 0.0], glMatrix.toRadian (90));
    roomColliders.push ( new object (new transform (vec3.fromValues (-14.5, 10.0, 22.5), vec3.fromValues (21.0, 10.0, 100.0), rotation),
                            null, null, null, 
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );

    // back wall left
    var rotation = quat.create ();
    quat.setAxisAngle (rotation, [1.0, 0.0, 0.0], glMatrix.toRadian (90));
    roomColliders.push ( new object (new transform (vec3.fromValues (14.5, 10.0, 22.5), vec3.fromValues (21.0, 10.0, 100.0), rotation),
                            null, null, null, 
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );

    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, -9.0, 0.0), vec3.fromValues (100.0, 3.0, 100.0), quat.create ()),
                            null, null, null, 
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    // Left wall
    roomColliders.push ( new object (new transform (vec3.fromValues (17.5, 0.0, 12.0), vec3.fromValues (3.0, 30.0, 50.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );

    roomColliders.push ( new object (new transform (vec3.fromValues (-17.5, 0.0, 0.0), vec3.fromValues (3.0, 30.0, 50.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );

    // Front wall
    roomColliders.push ( new object (new transform (vec3.fromValues (-16.0, 0.0, -17.5), vec3.fromValues (50.0, 30.0, 3.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    
    for(var i=0; i < 4; i++) {
        roomColliders.push ( new object (new transform (vec3.fromValues (0.0, -6.1+2.9*i, -2.5+i*4), vec3.fromValues (50.0, 1.0, 3.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    }
    for(var i=0; i < 5; i++){
        roomColliders.push ( new object (new transform (vec3.fromValues (-12.0, -7.55+2.9*i, -4.5+i*4), vec3.fromValues (4.0, 1.0, 3.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
        roomColliders.push ( new object (new transform (vec3.fromValues (12.0, -7.55+2.9*i, -4.5+i*4), vec3.fromValues (4.0, 1.0, 3.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    }
    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, 5.5, 15.3), vec3.fromValues (50.0, 1.0, 5.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );

    // broomCloset
    var broomCloset = new object ();
    broomCloset.tag = "broomCloset";
    broomCloset.loadFromObj ("broomClosetOBJ", "broomClosetMAT", "broomClosetTEX");
    broomCloset.collider.physics = "trigger";
    broomCloset.children.push (new object (new transform (vec3.fromValues (15.0, 0.0, -5.0), vec3.fromValues (20.0, 20.0, 20.0), quat.create ()),
                                        null, null, null, 
                                        new boxCollider (),
                                        new rigidBody (1000.0, "static")));
    broomCloset.children.push (new object (new transform (vec3.fromValues (-15.0, 0.0, -5.0), vec3.fromValues (20.0, 20.0, 20.0), quat.create ()),
                                        null, null, null,
                                        new boxCollider (),
                                        new rigidBody (1000.0, "static")));
    broomCloset.children.push (new object (new transform (vec3.fromValues (0.0, 0.0, -15.0), vec3.fromValues (20.0, 20.0, 20.0), quat.create ()),
                                        null, null, null,
                                        new boxCollider (),
                                        new rigidBody (1000.0, "static")));
    broomCloset.children.push (new object (new transform (vec3.fromValues (0.0, 15.0, -5.0), vec3.fromValues (20.0, 20.0, 20.0), quat.create ()),
                                        null, null, null,
                                        new boxCollider (),
                                        new rigidBody (1000.0, "static")));
    vec3.scale(broomCloset.collider.min, broomCloset.collider.min, 0.75);
    vec3.scale(broomCloset.collider.max, broomCloset.collider.max, 0.75);
    broomCloset.collider = new boxCollider(broomCloset.collider.min, broomCloset.collider.max);
    broomCloset.collider.collisionFunction = function (object1, object2) {
        if(object2.tag == "player") {
            StateManager.apply('broomcloset');
            object1.collider.collisionFunction = null;
        }
    }

    var rotation = quat.create ();
    quat.setAxisAngle (rotation, [0, 1, 0], glMatrix.toRadian (-30));
    broomCloset.transform = new transform (vec3.fromValues (15.8, -2.7, -19.6), vec3.fromValues (1.0, 1.0, 1.0), rotation);

    var bazooka = new object ();
    bazooka.tag = "bazooka";
    bazooka.loadFromObj ("bazookaOBJ", "bazookaMAT", "bazookaTEX");
    bazooka.collider.physics = "trigger";
    var rotation = quat.create ();
    quat.setAxisAngle (rotation, [0, 0, 1], glMatrix.toRadian (90));
    bazooka.transform = new transform (vec3.fromValues (0.0, -3.5, -4.0), vec3.fromValues (1.0, 1.0, 1.0), rotation);
    bazooka.addOnMouseClickTrigger(function(object) {
        var dist = vec3.squaredDistance (object.collider.currentCenter, currentScene.playerController.player.transform.position);
            if (dist > 100.0)
                return;

        currentScene.remove (object);
        currentScene.playerController.player.children.push (object);
        var rotation = quat.create ();
        quat.setAxisAngle (rotation, [0,1,0], glMatrix.toRadian (90.0));
        object.transform = new transform (vec3.fromValues (0.6, 0.0, -0.5), vec3.fromValues (1.0, 1.0, 1.0), rotation);
        object.rigidBody = null;
        object.collider = new nullCollider ();
    });
    broomCloset.children.push (bazooka);
    room.children.push (broomCloset);

    // Hallway:
    var hallway = new object ();
    hallway.tag = "world"

    var hallwayleft = new object ();
    hallwayleft.tag = "hallwayleft";
    hallwayleft.loadFromObj ("hallwayleftOBJ", "hallwayleftMAT", "hallwayleftTEX");
    hallwayleft.transform = new transform (vec3.fromValues (0.5, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    hallway.children.push (hallwayleft);
    hallwayleft.collider = new boxCollider (vec3.clone (hallwayleft.collider.min), vec3.fromValues (hallwayleft.collider.max[0] + 100.0, hallwayleft.collider.max[1], hallwayleft.collider.max[2]), "static");    
    hallwayleft.addRigidBody (new rigidBody (10.0, "static"));

    var hallwayleft2 = hallwayleft.clone ();
    var rotation2 = quat.create ();
    quat.setAxisAngle (rotation2, [0, 1, 0], glMatrix.toRadian (90.0));
    hallwayleft2.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), rotation2);
    hallway.children.push (hallwayleft2);

    var hallwayleft3 = hallwayleft.clone ();
    var rotation3 = quat.create ();
    quat.setAxisAngle (rotation3, [0, 1, 0], glMatrix.toRadian (180.0));
    hallwayleft3.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), rotation3);
    hallway.children.push (hallwayleft3);

    var hallwayleft4 = hallwayleft.clone ();
    var rotation4 = quat.create ();
    quat.setAxisAngle (rotation4, [0, 1, 0], glMatrix.toRadian (270.0));
    hallwayleft4.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), rotation4);
    hallway.children.push (hallwayleft4);

    var hallwayright = new object ();
    hallwayright.tag = "hallwayright";
    hallwayright.loadFromObj ("hallwayrightOBJ", "hallwayrightMAT", "hallwayrightTEX");
    hallwayright.transform = new transform (vec3.fromValues (-0.5, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    hallway.children.push (hallwayright);
    hallwayright.collider = new boxCollider (vec3.fromValues (hallwayright.collider.min[0] - 100.0, hallwayright.collider.min[1], hallwayright.collider.min[2]), vec3.clone (hallwayright.collider.max), "static");    
    hallwayright.addRigidBody (new rigidBody (10.0, "static"));

    var hallwayright2 = hallwayright.clone ();
    var rotation2 = quat.create ();
    quat.setAxisAngle (rotation2, [0, 1, 0], glMatrix.toRadian (90.0));
    hallwayright2.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), rotation2);
    hallway.children.push (hallwayright2);

    var hallwayright3 = hallwayright.clone ();
    var rotation3 = quat.create ();
    quat.setAxisAngle (rotation3, [0, 1, 0], glMatrix.toRadian (180.0));
    hallwayright3.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), rotation3);
    hallway.children.push (hallwayright3);

    var hallwayright4 = hallwayright.clone ();
    var rotation4 = quat.create ();
    quat.setAxisAngle (rotation4, [0, 1, 0], glMatrix.toRadian (270.0));
    hallwayright4.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), rotation4);
    hallway.children.push (hallwayright4);

    var hallwaybot = new object ();
    hallwaybot.tag = "hallwaybot";
    hallwaybot.loadFromObj ("hallwaybotOBJ", "hallwaybotMAT", "hallwaybotTEX");
    hallwaybot.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    hallway.children.push (hallwaybot);
    hallwaybot.collider = new boxCollider (vec3.fromValues (hallwaybot.collider.min[0], hallwaybot.collider.min[1] - 100.0, hallwaybot.collider.min[2]), vec3.clone (hallwaybot.collider.max), "static");    
    hallwaybot.addRigidBody (new rigidBody (10.0, "static"));

    var hallwaytop = new object ();
    hallwaytop.tag = "hallwaytop";
    hallwaytop.loadFromObj ("hallwaytopOBJ", "hallwaytopMAT", "hallwaytopTEX");
    hallwaytop.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    hallway.children.push (hallwaytop);
    hallwaytop.addRigidBody (new rigidBody (10.0, "static"));
    hallwaytop.collider.physics = "static";

    var hallwayCapLeft = new object (new transform (vec3.fromValues (155.0, 0.0, 0.0), vec3.fromValues (5.0, 20.0, 20.0), quat.create ()),
                                 new material (vec4.fromValues (0.05, 0.05, 0.05, 1.0), vec4.fromValues (0.05, 0.05, 0.05, 1.0), vec4.fromValues (0.05, 0.05, 0.05, 1.0), 40.0),
                                 new geometry (pointsArray, normalsArray, textureArray),
                                 new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                                 new boxCollider (),
                                 new rigidBody (1000.0, "static"));
    hallwayCapLeft.tag = "hallwaycapL";
    hallway.children.push (hallwayCapLeft);
    hallwayCapLeft.collider.physics = "static";
    hallwayCapLeft.collider.collisionFunction = function (object1, object2) {
        if(object2.tag == "player") {
            StateManager.apply('hallwayleft');
            object1.collider.collisionFunction = null;
        }
    }

    var hallwayCapRight = hallwayCapLeft.clone ();
    hallwayCapRight.transform = new transform (vec3.fromValues (-155.0, 0.0, 0.0), vec3.fromValues (5.0, 20.0, 20.0), quat.create ());
    hallwayCapRight.tag = "hallwaycapR";
    hallway.children.push (hallwayCapRight);
    hallwayCapRight.collider.physics = "static";
    hallwayCapRight.collider.collisionFunction = function (object1, object2) {
        if(object2.tag == "player") {
            StateManager.apply('hallwayright');
            object1.collider.collisionFunction = null;
        }
    }

    var hallwayCapEnd = hallwayCapLeft.clone ();
    hallwayCapEnd.transform = new transform (vec3.fromValues (0.0, 0.0, 155.0), vec3.fromValues (20.0, 20.0, 5.0), quat.create ());
    hallwayCapEnd.tag = "hallwaycapEnd";
    hallway.children.push (hallwayCapEnd);
    hallwayCapEnd.collider.physics = "static";
    hallwayCapEnd.collider.collisionFunction = function (object1, object2) {
        if(object2.tag == "player") {
            StateManager.apply('hallwayend');
            object1.collider.collisionFunction = null;
        }
    }


    var dangerDoorLeft = new object ();
    var doorRotation = quat.create ();
    quat.setAxisAngle (doorRotation, [0, 1, 0], glMatrix.toRadian (180.0));
    dangerDoorLeft.tag = "dangerDoorLeft";
    dangerDoorLeft.loadFromObj ("dangerDoorLeftOBJ", "dangerDoorLeftMAT", "dangerDoorLeftTEX");
    dangerDoorLeft.transform = new transform (vec3.fromValues (0.0, 0.0, 145.0), vec3.fromValues (1.0, 1.0, 1.0), doorRotation);
    hallway.children.push (dangerDoorLeft);
    dangerDoorLeft.addRigidBody (new rigidBody (10.0, "static"));
    dangerDoorLeft.collider.physics = "static";
    dangerDoorLeft.addOnMouseClickTrigger (function (object) {
        for (var i = 0; i < object.animations.length; i++) {
            var dist = vec3.squaredDistance (object.collider.currentCenter, currentScene.playerController.player.transform.position);
            if (dist > 225.0)
                return;

            if (object.animations[i].tag == "dangerDoorLeft") {
                if (object.animations[i].open) {
                    object.animations[i].open = false;
                    object.collider.physics = "static";
                } else {
                    object.animations[i].open = true;
                    object.collider.physics = "trigger";
                }
            } 
        }
        var otherDoor = currentScene.getObjectsByTag ("dangerDoorRight")[0];
        for (var i = 0; i < otherDoor.animations.length; i++) {
            var dist = vec3.squaredDistance (otherDoor.collider.currentCenter, currentScene.playerController.player.transform.position);
            if (dist > 225.0)
                return;

            if (otherDoor.animations[i].tag == "dangerDoorRight") {
                if (otherDoor.animations[i].open) {
                    otherDoor.animations[i].open = false;
                    otherDoor.collider.physics = "static";
                } else {
                    otherDoor.animations[i].open = true;
                    otherDoor.collider.physics = "trigger";
                }
            } 
        }

    });
    dangerDoorLeft.addAnimation (new animationDangerDoorLeft (dangerDoorLeft));

    var dangerDoorRight = new object ();
    dangerDoorRight.tag = "dangerDoorRight";
    dangerDoorRight.loadFromObj ("dangerDoorRightOBJ", "dangerDoorRightMAT", "dangerDoorRightTEX");
    dangerDoorRight.transform = new transform (vec3.fromValues (0.0, 0.0, 145.0), vec3.fromValues (1.0, 1.0, 1.0), doorRotation);
    hallway.children.push (dangerDoorRight);
    dangerDoorRight.addRigidBody (new rigidBody (10.0, "static"));
    dangerDoorRight.collider.physics = "static";
    dangerDoorRight.addOnMouseClickTrigger (function (object) {
        for (var i = 0; i < object.animations.length; i++) {
            var dist = vec3.squaredDistance (object.collider.currentCenter, currentScene.playerController.player.transform.position);
            if (dist > 225.0)
                return;

            if (object.animations[i].tag == "dangerDoorRight") {
                if (object.animations[i].open) {
                    object.animations[i].open = false;
                    object.collider.physics = "static";
                } else {
                    object.animations[i].open = true;
                    object.collider.physics = "trigger";
                }
            } 
        }
        var otherDoor = currentScene.getObjectsByTag ("dangerDoorLeft")[0];
        for (var i = 0; i < otherDoor.animations.length; i++) {
            var dist = vec3.squaredDistance (otherDoor.collider.currentCenter, currentScene.playerController.player.transform.position);
            if (dist > 225.0)
                return;

            if (otherDoor.animations[i].tag == "dangerDoorLeft") {
                if (otherDoor.animations[i].open) {
                    otherDoor.animations[i].open = false;
                    otherDoor.collider.physics = "static";
                } else {
                    otherDoor.animations[i].open = true;
                    otherDoor.collider.physics = "trigger";
                }
            } 
        }

    });
    dangerDoorRight.addAnimation (new animationDangerDoorRight (dangerDoorRight));

    hallway.transform = new transform (vec3.fromValues (0.0, 9.4, 171.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    room.children.push (hallway);

    for (var i=0; i<roomColliders.length; i++) room.children.push (roomColliders[i]);

    leavetrigger1 = new object (new transform (vec3.fromValues (0.0, 0.0, -3.5), vec3.fromValues (100.0, 100.0, 0.5), quat.create ()),
                            null, null, null,
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "trigger"),
                            null
                    );
    room.children.push (leavetrigger1);
    leavetrigger2 = new object (new transform (vec3.fromValues (0.0, 0.0, 3.5), vec3.fromValues (100.0, 100.0, 0.5), quat.create ()),
                            null, null, null,
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "trigger"),
                            null
                    );
    room.children.push (leavetrigger2);
    leavetrigger3 = new object (new transform (vec3.fromValues (0.0, 0.0, 12.5), vec3.fromValues (100.0, 100.0, 0.5), quat.create ()),
                            null, null, null,
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "trigger"),
                            null
                    );
    room.children.push (leavetrigger3);
    leavetrigger4 = new object (new transform (vec3.fromValues (0.0, 10.0, 24.0), vec3.fromValues (100.0, 100.0, 0.5), quat.create ()),
                            null, null, null,
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "trigger"),
                            null
                    );
    room.children.push (leavetrigger4);
    leavetrigger5 = new object (new transform (vec3.fromValues (0.0, 0.0, 100.0), vec3.fromValues (100.0, 100.0, 0.5), quat.create ()),
                            null, null, null,
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "trigger"),
                            null
                    );
    room.children.push (leavetrigger5);
    returntrigger = new object (new transform (vec3.fromValues (0.0, 0.0, -8.0), vec3.fromValues (100.0, 100.0, 0.5), quat.create ()),
                            null, null, null,
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "trigger"),
                            null
                    );
    room.children.push (returntrigger);

    foundbugtrigger = new object (new transform (vec3.fromValues (0.0, -5.0, 11.0), vec3.fromValues (100.0, 5.0, 15.0), quat.create ()),
                            null, null, null,
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "trigger"),
                            null
                    );
    room.children.push (foundbugtrigger);

	var roof = new object ();
    roof.tag = "roof";
	roof.loadFromObj ("roofOBJ", "roofMAT", "roofTEX");
	roof.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    room.children.push(roof);

    // speakers
	var speaker = new object ();
    speaker.tag = "speaker";
	var rotation = quat.create();
	quat.setAxisAngle(rotation, [0,1,0], glMatrix.toRadian (75));
	speaker.loadFromObj ("speakerOBJ", "speakerMAT", "speakerTEX");
	speaker.transform = new transform (vec3.fromValues (15, 11.3, -3), vec3.fromValues (2.0, 2.0, 2.0), quat.clone (rotation));
	room.children.push (speaker);

	var speaker2 = speaker.clone();
    speaker2.tag = "speaker";
	speaker2.transform.position = vec3.fromValues (-15, 11.3, -3);
	quat.setAxisAngle(rotation, [0,1,0], glMatrix.toRadian (-75));
	speaker2.transform.rotation = quat.clone (rotation);
	room.children.push (speaker2);

    // projector
    var projector = new object ();
    projector.tag = "projector";
    projector.loadFromObj ("projectorOBJ", "projectorMAT", "projectorTEX");
    var rotation = quat.create ();
    quat.setAxisAngle (rotation, [0, 1, 0], glMatrix.toRadian (0.0));
    projector.transform = new transform (vec3.fromValues (0.0, 7.2, -17.5), vec3.fromValues (0.8, 0.8, 0.8), quat.clone(rotation));
    projector.active = false;
    room.children.push (projector);

    var projector2 = projector.clone ();
    var rotation = quat.create ();
    quat.setAxisAngle (rotation, [0, 1, 0], glMatrix.toRadian (30.0));
    projector2.transform = new transform (vec3.fromValues (-13.6, 7.2, -14.9), vec3.fromValues (0.8, 0.8, 0.8), quat.clone(rotation));
    projector2.active = false;
    room.children.push (projector2);

    var projector3 = projector.clone ();
    var rotation = quat.create ();
    quat.setAxisAngle (rotation, [0, 1, 0], glMatrix.toRadian (-30.0));
    projector3.transform = new transform (vec3.fromValues (13.6, 7.2, -14.9), vec3.fromValues (0.8, 0.8, 0.8), quat.clone(rotation));
    projector3.active = false;
    room.children.push (projector3);

	// desk
	var desk = new object ();
    desk.tag = "desk";
	desk.loadFromObj ("deskOBJ", "deskMAT", "deskTEX");
	var rotation = quat.create();
	quat.setAxisAngle(rotation, [0,1,0], glMatrix.toRadian (-90));
	desk.transform = new transform (vec3.fromValues (0.0, -6, -9), vec3.fromValues (1.4, 1.4, 1.4), quat.clone(rotation));
	room.children.push (desk);
    desk.addRigidBody (new rigidBody (50.0, "static"));

	// make all the chairs!
    var chair = new object ();
    chair.tag = "chair";
    chair.loadFromObj ("chairOBJ", "chairMAT", "chairTEX");
    chair.transform = new transform (vec3.fromValues (0, -3.8, -1.3), vec3.fromValues (1.2, 1.2, 1.2), quat.clone(rotation));
    var seat = new object ();
    seat.tag = "seat";
	seat.loadFromObj ("seatOBJ", "seatMAT", "seatTEX");
	var rotation = quat.create ();
	quat.setAxisAngle (rotation, [0,1,0], glMatrix.toRadian(-90));
    var rotation2 = quat.create ();
    quat.setAxisAngle (rotation2, [1, 0, 0], glMatrix.toRadian (-105));
    quat.mul (rotation, rotation, rotation2);
	seat.transform = new transform (vec3.fromValues(0.0,0.3,0.22), vec3.fromValues (1.0, 1.0, 1.0), quat.clone(rotation));

	chair.children.push (seat);
    chair.addRigidBody (new rigidBody (10.0, "static"));
    chair.children[0].addOnMouseClickTrigger (function (object) {
        for (var i = 0; i < object.animations.length; i++) {
            var dist = vec3.squaredDistance (object.collider.currentCenter, currentScene.playerController.player.transform.position);
            if (dist > 225.0)
                return;

            if (object.animations[i].tag == "chair") {
                object.animations[i].open = !object.animations[i].open;
            }
        }
    });

    chair.children[0].addAnimation (new animationChair (chair.children[0]));

	var rows_of_chairs=4;
    var chairs_per_row=8;
    for(var i=0; i<rows_of_chairs; i++){
    	//create each large row of chairs
    	for(var j=0; j< chairs_per_row; j++){
    		var tempChair = chair.clone();
    		tempChair.transform.position = vec3.fromValues (2.61*j-9.2, -3.8+2.8*i, -1.9+0.7*Math.sin((j+1.3)/3)+4*i);
    		var rotation = quat.create();
    		quat.setAxisAngle(rotation, [0,1,0], glMatrix.toRadian(-90 - 10 + (2.5 * j)));
    		tempChair.transform.rotation = quat.clone(rotation);
    		room.children.push (tempChair);
    	}
    	//also create the chairs on the edges of the room, on the outside of the aisles
    	var rightChair = chair.clone();
    	var rightChairRotate = quat.create();
		quat.setAxisAngle(rightChairRotate, [0,1,0], glMatrix.toRadian(-105));
    	rightChair.transform.rotation = quat.clone(rightChairRotate);
    	rightChair.transform.position = vec3.fromValues(-15.5, -3.8+2.8*i, -1.8+4*i-1.2);
    	room.children.push(rightChair);

    	var leftChair = chair.clone();
    	var leftChairRotate = quat.create();
    	quat.setAxisAngle(leftChairRotate, [0,1,0], glMatrix.toRadian(-75));
    	leftChair.transform.rotation = quat.clone(leftChairRotate);
    	leftChair.transform.position = vec3.fromValues(15.5, -3.8+2.8*i, -1.8+4*i-1.2);
    	room.children.push(leftChair); 
    }

    //add a stool in the corner 
    var stool = new object();
    stool.tag = "stool";
    stool.loadFromObj ("stoolOBJ", "stoolMAT", "stoolTEX");
	stool.transform = new transform (vec3.fromValues(-16, 0.0, -8.5), vec3.fromValues(0.4, 0.4, 0.4), quat.clone(rotation)); 
	room.children.push (stool);
    stool.addRigidBody (new rigidBody (10.0, "dynamic"));
    stool.collider.physics = "dynamic";

    stool.addOnMouseClickTrigger (function (object) {
        object.rigidBody.P = vec3.fromValues (0.0, 0.0, 0.0);
        object.rigidBody.velocity = vec3.fromValues (0.0, 0.0, 0.0);
        currentScene.animationsManager.addAnimation (new animationHold (object));
    });

    spawnedStool = stool.clone();
    spawnedStool.transform = new transform (vec3.fromValues(0.0, 5.0, 0.0), vec3.fromValues(0.4, 0.4, 0.4), quat.create ()); 
    spawnedStool.active = false;
    room.children.push(spawnedStool);

    //add all 4 doors 
    var leftdoor = new object ();
    leftdoor.tag = "leftdoorFront";
    leftdoor.loadFromObj ("leftdoorOBJ", "leftdoorMAT", "doorTEX");
    var doorRotation = quat.create ();
    quat.setAxisAngle (doorRotation, [0, 1, 0], glMatrix.toRadian (-28.0));
    leftdoor.transform = new transform (vec3.fromValues (8.82, -8.05, -17.62), vec3.fromValues (1.0, 1.0, 1.0), quat.clone (doorRotation)); 
    room.children.push (leftdoor);
    leftdoor.addRigidBody (new rigidBody (10.0, "static"));
    leftdoor.collider.physics = "static";
    leftdoor.addOnMouseClickTrigger (function (object) {
        for (var i = 0; i < object.animations.length; i++) {
            var dist = vec3.squaredDistance (object.collider.currentCenter, currentScene.playerController.player.transform.position);
            if (dist > 225.0)
                return;

            if (object.animations[i].tag == "leftdoor") {
                if (object.animations[i].open) {
                    object.animations[i].open = false;
                    object.collider.physics = "static";
                } else {
                    object.animations[i].open = true;
                    object.collider.physics = "trigger";
                }
            }
        }
    });
    leftdoor.addAnimation (new animationLeftdoor (leftdoor));

    var rightdoor = new object ();
    rightdoor.tag = "rightdoorFront";
    rightdoor.loadFromObj ("rightdoorOBJ", "rightdoorMAT", "doorTEX");
    var doorRotation = quat.create ();
    quat.setAxisAngle (doorRotation, [0, 1, 0], glMatrix.toRadian (-28.0));
    rightdoor.transform = new transform (vec3.fromValues (17.62, -8.05, -12.83), vec3.fromValues (1.0, 1.0, 1.0), quat.clone (doorRotation)); 
    room.children.push (rightdoor);
    rightdoor.addRigidBody (new rigidBody (10.0, "static"));
    rightdoor.collider.physics = "static";
    rightdoor.addOnMouseClickTrigger (function (object) {
        for (var i = 0; i < object.animations.length; i++) {
            var dist = vec3.squaredDistance (object.collider.currentCenter, currentScene.playerController.player.transform.position);
            if (dist > 225.0)
                return;

            if (object.animations[i].tag == "rightdoor") {
                if (object.animations[i].open) {
                    object.animations[i].open = false;
                    object.collider.physics = "static";
                } else {
                    object.animations[i].open = true;
                    object.collider.physics = "trigger";
                }
            }
        }
    });
    rightdoor.addAnimation (new animationRightdoor (rightdoor));

    var leftdoor2 = leftdoor.clone ();
    leftdoor2.tag = "leftdoorBack";
    var doorRotation = quat.create ();
    quat.setAxisAngle (doorRotation, [0, 1, 0], glMatrix.toRadian (180.0));
    leftdoor2.transform = new transform (vec3.fromValues (3.89, 5.94, 17.67), vec3.fromValues (0.77, 0.77, 1.0), quat.clone (doorRotation)); 
    leftdoor2.animations[0].closedRotation = quat.clone (doorRotation);
    var doorRotation2 = quat.create ();
    quat.setAxisAngle (doorRotation2, [0, 1, 0], glMatrix.toRadian (65.0));
    quat.mul (doorRotation2, doorRotation, doorRotation2);
    leftdoor2.animations[0].openRotation = quat.clone (doorRotation2); 
    room.children.push (leftdoor2);

    var rightdoor2 = rightdoor.clone ();
    rightdoor2.tag = "rightdoorBack";
    var doorRotation = quat.create ();
    quat.setAxisAngle (doorRotation, [0, 1, 0], glMatrix.toRadian (180.0));
    rightdoor2.transform = new transform (vec3.fromValues (-3.85, 5.94, 17.63), vec3.fromValues (0.77, 0.77, 1.0), quat.clone (doorRotation)); 
    rightdoor2.animations[0].closedRotation = quat.clone (doorRotation);
    var doorRotation2 = quat.create ();
    quat.setAxisAngle (doorRotation2, [0, 1, 0], glMatrix.toRadian (-65.0));
    quat.mul (doorRotation2, doorRotation, doorRotation2);
    rightdoor2.animations[0].openRotation = quat.clone (doorRotation2); 
    room.children.push (rightdoor2);

    var button = new object ();
    button.tag = "button";
    button.loadFromObj ("buttonOBJ", "buttonMAT", "buttonTEX");
    var rotation = quat.create();
    quat.rotateY(rotation, rotation, glMatrix.toRadian(90));
    button.transform = new transform (vec3.fromValues (0.0, 0.15, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.clone (rotation));
    button.addAnimation (new animationButton (button));
    var buttonMount = new object ();
    buttonMount.tag = "buttonMount";
    buttonMount.loadFromObj ("buttonMountOBJ", "buttonMountMAT", "buttonMountTEX");
    buttonMount.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), vec4.fromValues (-0.7071, 0.0, 0.0, 0.7071));
    buttonMount.children.push (button);
    
    rightButtonPicture = new object ();
    rightButtonPicture.tag = "rightButtonPicture";
    rightButtonPicture.loadFromObj ("pictureOBJ", "pictureMAT", "pictureTEX");
    rightButtonPicture.transform = new transform (vec3.fromValues (-3.0,-5,-11.2), vec3.fromValues (1.0, 1.0, 1.0), vec4.fromValues (0.7071, 0.0, 0.0, 0.7071));
    rightButtonPicture.active = false;
    room.children.push (rightButtonPicture);

    rightButtonMount = buttonMount.clone(); rightButtonMount.transform.position = vec3.fromValues (-3,-5,-11.2); rightButtonMount.active = true; room.children.push (rightButtonMount);
    leftButtonMount = buttonMount.clone(); leftButtonMount.transform.position = vec3.fromValues (3,-5,-11.2); leftButtonMount.active = true; room.children.push (leftButtonMount);
    
    changeGravityCautionBox = new object(new transform (vec3.fromValues (3,-5,-11.2), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                                new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                                new geometry (pointsArray, normalsArray, textureArray),
                                new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                                new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                                new rigidBody (50.0, "static")); changeGravityCautionBox.active = false;
    room.children.push(changeGravityCautionBox);
    changeGravityButton = buttonMount.clone(); changeGravityButton.transform.position = vec3.fromValues(3,-5,-11.2); changeGravityButton.active = false; room.children.push (changeGravityButton);
    changeGravityButton.children[0].texture = new texture(document.getElementById("buttonpanicTEX"), changeGravityButton.texture.options)
    clickMeButton = buttonMount.clone(); clickMeButton.transform.position = vec3.fromValues(-3,-5,-11.2); clickMeButton.active = false; room.children.push (clickMeButton);
    clickMeButton.children[0].texture = new texture(document.getElementById("buttonclickmeTEX"), clickMeButton.texture.options)
    dontClickMeButton = buttonMount.clone(); dontClickMeButton.transform.position = vec3.fromValues(0,-5,-11.2); dontClickMeButton.active = false; room.children.push (dontClickMeButton);
    dontClickMeButton.children[0].texture = new texture(document.getElementById("buttondontclickmeTEX"), dontClickMeButton.texture.options)
    changeGravityCautionBox.texture = new texture(document.getElementById("buttonpanicTEX"), changeGravityCautionBox.texture.options)

    exitFoundBugButton = buttonMount.clone(); exitFoundBugButton.transform.position = vec3.fromValues(15,0,10); exitFoundBugButton.transform.rotation = vec4.fromValues(0.0, 0.0, 0.7071, 0.7071); exitFoundBugButton.active = false; room.children.push (exitFoundBugButton);
    exitFoundBugButton.children[0].texture = new texture(document.getElementById("buttongreenTEX"), exitFoundBugButton.texture.options)
    stayFoundBugButton = buttonMount.clone(); stayFoundBugButton.transform.position = vec3.fromValues(15,0,16); stayFoundBugButton.transform.rotation = vec4.fromValues(0.0, 0.0, 0.7071, 0.7071); stayFoundBugButton.active = false; room.children.push (stayFoundBugButton);

    rightButtonPicture.addOnMouseClickTrigger(function(object) {
        StateManager.apply("clickedRight");
    });
    rightButtonMount.children[0].addOnMouseClickTrigger(function(object) {
        object.animations[0].pressed = true;
        StateManager.apply("clickedRight");
    });
    leftButtonMount.children[0].addOnMouseClickTrigger(function(object) {
        object.animations[0].pressed = true;
        StateManager.apply("clickedLeft");
    }); 
    changeGravityCautionBox.addOnMouseClickTrigger(function(object) {
        changeGravityCautionBox.active = false;
        changeGravityButton.active = true;
    });
    
    changeGravityButton.children[0].addOnMouseClickTrigger(function(object) {
        object.animations[0].pressed = true;    
        StateManager.apply("changeGravity");
    }); 

    clickMeButton.children[0].addOnMouseClickTrigger(function(object) {
        object.animations[0].pressed = true;
        StateManager.apply("clickMe");
    }); 

    dontClickMeButton.children[0].addOnMouseClickTrigger(function(object) {
        object.animations[0].pressed = true;        
        StateManager.apply("dontClickMe");
    }); 

    leavetrigger1.collider.collisionFunction = function (object1, object2) {
        StateManager.apply("leavetrigger1");
    }
    leavetrigger2.collider.collisionFunction = function (object1, object2) {
        StateManager.apply("leavetrigger2");
    }
    leavetrigger3.collider.collisionFunction = function (object1, object2) {
        StateManager.apply("leavetrigger3");
    }
    leavetrigger4.collider.collisionFunction = function (object1, object2) {
        var leaving3audio = document.getElementById('A_leaving3');
        var currAudioTime = leaving3audio.currentTime;
        if(!leaving3audio.paused && leaving3audio.src != 'Audio/leaving3_short.mp3') {
            leaving3audio.src = 'Audio/leaving3_short.mp3';
            leaving3audio.load();
            leaving3audio.play();
            leaving3audio.currentTime = currAudioTime;
        } else if (leaving3audio.paused) {
            document.getElementById('A_leaving3').src = 'Audio/leaving3_short.mp3';
        }
        StateManager.apply("leavetrigger4");
    }
    leavetrigger5.collider.collisionFunction = function (object1, object2) {
        StateManager.apply("leavetrigger5");
    }
    returntrigger.collider.collisionFunction = function (object1, object2) {
        StateManager.apply("returntrigger");
    }
    foundbugtrigger.collider.collisionFunction = function (object1, object2) {
        StateManager.stopAll(); // doesn't do any pending functions or state changes either.
        var A_bug1 = document.getElementById('A_bug1');
        if(A_bug1.currentTime == 0) {
            A_bug1.play();
            A_bug1.addEventListener("ended", function() {
                setTimeout(function() {
                    currentScene.playerController.player.transform.position = vec3.fromValues(-7.317382554523647, -2.9981283240562004, 13.815474266186357);
                    currentScene.playerController.player.camera.rotation = vec4.fromValues(-0.01889348030090332, 0.6919060349464417, -0.018118197098374367, -0.7215129137039185);
                    var A_bug2 = document.getElementById('A_bug2');
                    A_bug2.play();
                    setTimeout(function() {
                        exitFoundBugButton.active = true;
                        stayFoundBugButton.active = true;
                    }, 2000);
                }, 5000);
            });
        }

        // play the found bug audio. if the audio is already playing (if currentTime != 0) then don't play it again.
        console.log('Oh. Look at you. You found a bug! Congratulations. Wanna get out?... Umm. Good luck with that.');
        foundbugtrigger.collider.collisionFunction = null;
        if(!previousState) {
            previousState = StateManager.getCurrentState();
        }

        setTimeout(function() {
            if(!exitedFindingBug) {
                document.getElementById('A_bugstay2').play();
                StateManager.setState(previousState);
                previousState = null;
                currentScene.playerController.player.transform.position = vec3.fromValues(0.0, 5.0, -7.9);
                currentScene.playerController.player.camera.rotation = vec4.fromValues(0,1,0,0);
            }
        }, 3600000);
    }
    exitFoundBugButton.children[0].addOnMouseClickTrigger(function(object) {
        exitFoundBugButton.active = false;
        stayFoundBugButton.active = false;
        exitedFindingBug = true;
        StateManager.setState(previousState);
        previousState = null;
        currentScene.playerController.player.transform.position = vec3.fromValues(0.0, 5.0, -7.9);
        currentScene.playerController.player.camera.rotation = vec4.fromValues(0,1,0,0);
    });
    stayFoundBugButton.children[0].addOnMouseClickTrigger(function(object) {
        var A_bug2 = document.getElementById('A_bug2');
        if(!A_bug2.paused) {
            A_bug2.addEventListener('ended', function() {document.getElementById('A_bugstay1').play();}); 
        } else {
            document.getElementById('A_bugstay1').play();
        }
        exitFoundBugButton.active = false;
        stayFoundBugButton.active = false;        
    });

    setTimeout(function() {
        StateManager.apply("introWait1");
    }, 20000);
    setTimeout(function() {
        StateManager.apply("introWait2");
    }, 30000);
    setTimeout(function() {
        StateManager.apply("introWait3");
    }, 45000);
    setTimeout(function() {
        StateManager.apply("introWait4");
    }, 60000);

    finishedLookDown = false; // for the inital look down check
    previousState = null;

    SGraph.push (room);
}

var room;
var leavetrigger1, leavetrigger2, leavetrigger3;
var returntrigger;
var rightButtonMount, leftButtonMount, rightButtonPicture;
var changeGravityCautionBox, changeGravityButton, clickMeButton, dontClickMeButton, numIncorrectClicks = 0;

var foundbugtrigger, exitedFindingBug = false;
var exitFoundBugButton, stayFoundBugButton;

var spawnedStool;

var previousState = null; //used for when I leave a certain state into a branch but want to return. I could use something like stackframes but I'm too lazy and this is more than enough for my purposes;

// This function builds the state machine, which controls which actions can hapen and when
function buildStateMachine () {
    StateManager.addState("intro1");
    StateManager.addState("intro2");
    StateManager.addState("intro3");
    StateManager.addState("intro4");
    StateManager.addState("intro5");
    StateManager.addState("leaving1");
    StateManager.addState("leaving2");
    StateManager.addState("leaving3");
    StateManager.addState("leaving4");
    StateManager.addState("leaving5");
    StateManager.addState("twobuttons");
    StateManager.addState("clickedRight1");
    StateManager.addState("clickedRight2");
    StateManager.addState("clickedRight3");
    StateManager.addState("clickedLeft");
    StateManager.addState("playingGame");


    var clickedStart = new Event("clickStart", new Activity('A_intro1', function() { mainScene.resetScene (); currentScene = mainScene; }, null));
    var introWait1 = new Event("introWait1", new Activity('A_intro2', null, null));
    var introWait2 = new Event("introWait2", new Activity('A_intro3', null, null));
    var introWait3 = new Event("introWait3", new Activity('A_intro4', null, function() {alert('YOU\'RE MUTED. TURN UP YOUR VOLUME!')}));
    var introWait4 = new Event("introWait4", new Activity('A_intro5', null, null));
    var broomclosetEvent = new Event("broomcloset", new Activity('A_broomcloset', null, null));

    var leaving1 = new Event("leavetrigger1", new Activity('A_leaving1', 
        function() {
            if (previousState) console.log('Something is wrong. We should never enter a different state while previous state is still set.');
            else previousState = StateManager.getCurrentState();
        }, 
        function() {
            console.log('Scott... Where are you going?')
        }
    ));
    var leaving2 = new Event("leavetrigger2", new Activity('A_leaving2', function(){}, function(){console.log('Don\'t make me do this!')}));
    var leaving3 = new Event("leavetrigger3", new Activity('A_leaving3', 
        function() {
            var projectors = currentScene.getObjectsByTag('projector');
            for (var i=0; i<projectors.length; i++) projectors[i].active = true;
        }, 
        function() {
            console.log('Alright. That\'s the last straw. (play baby music)')
        }
    ));
    var leaving4 = new Event("leavetrigger4", new Activity('A_leaving4', function(){}, function(){console.log('Ok. Seriously though. You really do not want to go here.')}));
    var leaving5 = new Event("leavetrigger5", new Activity('A_leaving5', function(){}, function(){console.log('I guess if you\'ve come this far you are really persistent. <insert shrimp facts>')}));
    var returning = new Event("returntrigger", new Activity(null, 
        function() {
            StateManager.setState(previousState);
            previousState = null;
        }, 
        function() {
            console.log('Thanks for coming back')
        }
    ));

    var lookedDown = new Event("lookDown", new Activity('A_lookdown', function(){}, function(){console.log('Scott clicks the left button.')}));
    
    var clickedRight1 = new Event("clickedRight", new Activity('A_rightbutton1', 
        function() {
            rightButtonMount.transform.scale = vec3.fromValues(0.2, 0.2, 0.2);
            rightButtonMount.children[0].animations[0].pressed = false;
        }, 
        function() {
            console.log('You might not have heard me. I said the left button')
        }
    ));
    var clickedRight2 = new Event("clickedRight", new Activity('A_rightbutton2', 
        function() {
            //currentScene.playerController.player.transform.position = vec3.fromValues(0.0, 10, -15.8);
            //currentScene.playerController.player.transform.rotation = vec3.fromValues(-0.07094697654247284, -0.9180688858032227, -0.19179458916187286, 0.3396040201187134);
            
            rightButtonMount.transform.position = vec3.fromValues(-3.0,-5,-17.5); 
            rightButtonMount.children[0].animations[0].pressed = false;
            quat.rotateY(rightButtonMount.transform.rotation, rightButtonMount.transform.rotation, glMatrix.toRadian(180));
            rightButtonPicture.active = true;
            leftButtonMount.transform.scale = vec3.fromValues(5.0, 5.0, 5.0);
        }, 
        function() {
            console.log('LEFT. As in your left');
        }
    ));
    var clickedRight3 = new Event("clickedRight", new Activity('A_rightbutton3', 
        function() {
            swapTextures(document.getElementById('projectorTEX'));
        }, 
        function() {
            console.log('You have done it now Scott...');
        }
    ));
    var clickedRight4 = new Event("clickedRight", new Activity('A_rightbutton4', 
        function() {
            rightButtonMount.active = false;
        }, 
        function() {
            currentScene = startMenuScene;
            StateManager.setState(StateManager.getState('root'));
            console.log('Seriously? Again???')
        }
    ));
    var clickedLeft = new Event("clickedLeft", new Activity('A_leftbutton', 
        function() {
            rightButtonMount.active = false;
            rightButtonPicture.active = false;
            leftButtonMount.active = false;
            clickMeButton.active = true;
            dontClickMeButton.active = true;
            changeGravityCautionBox.active = true;
        }, 
        function() {
            console.log('Good job');
        }
    ));
    var changeGravity = new Event("changeGravity", new Activity('A_physics', 
        function() {
            changeGravitationalCenter (vec3.fromValues (0.0, 1.0, 0.0));
        }, 
        function() {
            currentScene = startMenuScene;
            StateManager.setState(StateManager.getState('root'));
            console.log('Changed gravity');
        }
    ));
    var clickMe = new Event("clickMe", new Activity('A_spawnchair', 
        function() {
            // spawn a chair
            spawnedStool.active = true;
            clickMeButton.active = false;
        }, 
        function() {
            console.log('Clicked me!');
        }
    ));
    var dontClickMe = new Event("dontClickMe", new Activity(null, 
        function() {
            // swap position with click me button
            var temp = vec3.clone(dontClickMeButton.transform.position);
            dontClickMeButton.transform.position = vec3.clone(clickMeButton.transform.position);
            clickMeButton.transform.position = temp;
            numIncorrectClicks++;
            //add a switch case to play audio depending on how many times you've clicked it (make short because there's a possibility that they get 2 audios overlapping here)
        }, 
        function() {
            console.log('Don\'t clicked me!');
        }
    ));

    var hallwayleftEvent = new Event("hallwayleft", new Activity('A_testingIntro', 
        function() {
            currentScene = physicsDemoScene;
        }, 
        function() {
            console.log('Physics demo.');
            currentScene = survivalScene; // move player into survival scene
        }
    ));
    var hallwayrightEvent = new Event("hallwayright", new Activity('A_project1Intro', 
        function() {
            currentScene = project1Scene;
        }, 
        function() {    
            console.log('Assignment 1');
            currentScene = mainScene;
            currentScene.playerController.player.transform.position = vec3.fromValues (-130.0, 10.0, 170.0);
        }
    ));
    var hallwayendEvent = new Event("hallwayend", new Activity('A_eggertIntro', 
        function() {
            currentScene = eggertRoomScene;
        }, 
        function() {
            console.log('Eggert Room');
            // put them back in the OG room
            currentScene = mainScene;
            currentScene.playerController.player.transform.position = vec3.fromValues (0.0, 10.0, 300.0);
            currentScene.getObjectsByTag('dangerDoorLeft')[0].animations[0].open = false;
            currentScene.getObjectsByTag('dangerDoorRight')[0].animations[0].open = false;
        }
    ));

    var deathEvent = new Event("deathEvent", new Activity('A_death', function(){}, function() {currentScene = startMenuScene;}));


    var savedWorld = new Event("savedWorld", new Activity(null, function(){}, function(){console.log('Saved world!')}));

    StateManager.getState("root").addChild(clickedStart, StateManager.getState("intro1"));
    StateManager.getState("intro1").addChild(introWait1, StateManager.getState("intro2"));
    StateManager.getState("intro2").addChild(introWait2, StateManager.getState("intro3"));
    StateManager.getState("intro3").addChild(introWait3, StateManager.getState("intro4"));
    StateManager.getState("intro4").addChild(introWait4, StateManager.getState("intro5"));
    StateManager.getState("intro1").addChild(lookedDown, StateManager.getState("twobuttons"));
    StateManager.getState("intro2").addChild(lookedDown, StateManager.getState("twobuttons"));
    StateManager.getState("intro3").addChild(lookedDown, StateManager.getState("twobuttons"));
    StateManager.getState("intro4").addChild(lookedDown, StateManager.getState("twobuttons"));
    StateManager.getState("intro5").addChild(lookedDown, StateManager.getState("twobuttons"));
    StateManager.getState("twobuttons").addChild(clickedRight1, StateManager.getState("clickedRight1"));
    StateManager.getState("clickedRight1").addChild(clickedRight2, StateManager.getState("clickedRight2"));
    StateManager.getState("clickedRight2").addChild(clickedRight3, StateManager.getState("clickedRight3"));
    StateManager.getState("clickedRight3").addChild(clickedRight4, StateManager.getState("root"));
    StateManager.getState("twobuttons").addChild(clickedLeft, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedRight1").addChild(clickedLeft, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedRight2").addChild(clickedLeft, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedRight3").addChild(clickedLeft, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedLeft").addChild(changeGravity, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedLeft").addChild(clickMe, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedLeft").addChild(dontClickMe, StateManager.getState("clickedLeft"));
    
    // add all the leaving triggers
    StateManager.getState("intro1").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("intro2").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("intro3").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("intro4").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("intro5").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("twobuttons").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("clickedRight1").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("clickedRight2").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("clickedRight3").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("clickedLeft").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("leaving1").addChild(leaving2, StateManager.getState("leaving2"));
    StateManager.getState("leaving2").addChild(leaving3, StateManager.getState("leaving3"));
    StateManager.getState("leaving3").addChild(leaving4, StateManager.getState("leaving4"));
    StateManager.getState("leaving4").addChild(leaving5, StateManager.getState("leaving5"));
    StateManager.getState("leaving5").addChild(hallwayleftEvent, StateManager.getState("playingGame"));
    StateManager.getState("leaving5").addChild(hallwayrightEvent, StateManager.getState("leaving5"));
    StateManager.getState("leaving5").addChild(hallwayendEvent, StateManager.getState("leaving5"));
    StateManager.getState("playingGame").addChild(deathEvent, StateManager.getState("root"));
    StateManager.getState("leaving1").addChild(returning, StateManager.getState("root"));
    StateManager.getState("leaving2").addChild(returning, StateManager.getState("root"));
    StateManager.getState("leaving3").addChild(returning, StateManager.getState("root"));
    StateManager.getState("leaving4").addChild(returning, StateManager.getState("root"));
    StateManager.getState("leaving5").addChild(returning, StateManager.getState("root"));

    // add all the broom closet triggers
    StateManager.getState("intro1").addChild(broomclosetEvent, StateManager.getState("intro1"));
    StateManager.getState("intro2").addChild(broomclosetEvent, StateManager.getState("intro2"));
    StateManager.getState("intro3").addChild(broomclosetEvent, StateManager.getState("intro3"));
    StateManager.getState("intro4").addChild(broomclosetEvent, StateManager.getState("intro4"));
    StateManager.getState("intro5").addChild(broomclosetEvent, StateManager.getState("intro5"));
    StateManager.getState("twobuttons").addChild(broomclosetEvent, StateManager.getState("twobuttons"));
    StateManager.getState("clickedRight1").addChild(broomclosetEvent, StateManager.getState("clickedRight1"));
    StateManager.getState("clickedRight2").addChild(broomclosetEvent, StateManager.getState("clickedRight2"));
    StateManager.getState("clickedRight3").addChild(broomclosetEvent, StateManager.getState("clickedRight3"));
    StateManager.getState("clickedLeft").addChild(broomclosetEvent, StateManager.getState("clickedLeft"));
}


var finishedLookDown = false;
function gameChecks() {
    if(currentScene ==  mainScene && !finishedLookDown && currentScene.playerController.player.camera.pitch  < -0.2) {
        finishedLookDown = true;
        StateManager.apply("lookDown");
    }
}