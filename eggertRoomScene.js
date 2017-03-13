// like the functions in game.js, this function builds a scene graph, this time for the eggert lecture room
function buildEggertRoomSceneGraph (SGraph) {

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
    var player = new object (new transform (vec3.fromValues (0.0, 5.0, -7.9), vec3.fromValues (1.0, 1.0, 1.0), vec4.fromValues (0.0, 0.3827, 0.0, 0.9239)),
                         null, 
                         null, 
                         null,
                         new boxCollider (vec3.fromValues (-0.25, -5, -0.25), vec3.fromValues (0.25, 0.0, 0.25), "dynamic"),
                         new rigidBody (100.0, "dynamic"));

    player.camera = cam;
    player.rigidBody.angularRigidBody = false;
    player.tag = "player";

    SGraph.push (player);
    SGraph.playerController = new PlayerController (player);

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

    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, -9.5, 0.0), vec3.fromValues (100.0, 3.0, 100.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    roomColliders.push ( new object (new transform (vec3.fromValues (17.5, 0.0, 0.0), vec3.fromValues (3.0, 30.0, 50.0), quat.create ()),
                            null, null, null,                            
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    roomColliders.push ( new object (new transform (vec3.fromValues (-17.5, 0.0, 0.0), vec3.fromValues (3.0, 30.0, 50.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, 0.0, -17.5), vec3.fromValues (50.0, 30.0, 3.0), quat.create ()),
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

    // Hallway:
    var hallway = new object ();
    hallway.tag = "world"

    var hallwayleft = new object ();
    hallwayleft.tag = "hallwayleft";
    hallwayleft.loadFromObj ("hallwayleftOBJ", "hallwayleftMAT", "hallwayleftTEX");
    hallwayleft.transform = new transform (vec3.fromValues (0.5, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    hallway.children.push (hallwayleft);
    hallwayleft.addRigidBody (new rigidBody (10.0, "static"));
    hallwayleft.collider.physics = "static";

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
    hallwayright.addRigidBody (new rigidBody (10.0, "static"));
    hallwayright.collider.physics = "static";

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
    hallwaybot.addRigidBody (new rigidBody (10.0, "static"));
    hallwaybot.collider.physics = "static";

    var hallwaytop = new object ();
    hallwaytop.tag = "hallwaytop";
    hallwaytop.loadFromObj ("hallwaytopOBJ", "hallwaytopMAT", "hallwaytopTEX");
    hallwaytop.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    hallway.children.push (hallwaytop);
    hallwaytop.addRigidBody (new rigidBody (10.0, "static"));
    hallwaytop.collider.physics = "static";

    generateCubeNormals (cubeVertices);
    generateCubeVertices (cubeVertices);
    generateCubeTexCoords (texCoords);

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
        currentScene = physicsDemoScene;
    }

    var hallwayCapRight = hallwayCapLeft.clone ();
    hallwayCapRight.transform = new transform (vec3.fromValues (-155.0, 0.0, 0.0), vec3.fromValues (5.0, 20.0, 20.0), quat.create ());
    hallwayCapRight.tag = "hallwaycapR";
    hallway.children.push (hallwayCapRight);
    hallwayCapRight.collider.physics = "static";
    hallwayCapRight.collider.collisionFunction = function (object1, object2) {
        currentScene = project1Scene;
    }

    room.children.push(hallway);

    hallway.transform = new transform (vec3.fromValues (0.0, 9.4, 171.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    room.children.push (hallway);

    for (var i=0; i<roomColliders.length; i++) room.children.push (roomColliders[i]);



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
    //var rotation2 = quat.create ();
    //quat.setAxisAngle (rotation2, [1, 0, 0], glMatrix.toRadian (-105));
    //quat.mul (rotation, rotation, rotation2);
	seat.transform = new transform (vec3.fromValues(0.0,0.3,0.22), vec3.fromValues (1.0, 1.0, 1.0), quat.clone(rotation));

	chair.children.push (seat);
    chair.addRigidBody (new rigidBody (10.0, "static"));
    var person = new object ();
    person.loadFromObj ("personOBJ", "personMAT", "personTEX");
    person.transform = new transform (vec3.fromValues(0.0,0.5,0.0), vec3.fromValues (0.7, 0.7, 0.7), quat.create ());

    // chair.children[0].addOnMouseClickTrigger (function (object) {
    //     for (var i = 0; i < object.animations.length; i++) {
    //         var dist = vec3.squaredDistance (object.collider.currentCenter, currentScene.playerController.player.transform.position);
    //         if (dist > 225.0)
    //             return;

    //         if (object.animations[i].tag == "chair") {
    //             object.animations[i].open = !object.animations[i].open;
    //         }
    //     }
    // });

    //chair.children[0].addAnimation (new animationChair (chair.children[0]));

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
            var random = Math.random() * 5;
            if (random > 1.5)
                tempChair.children.push(person.clone());
    	}
    	//also create the chairs on the edges of the room, on the outside of the aisles
    	var rightChair = chair.clone();
    	var rightChairRotate = quat.create();
		quat.setAxisAngle(rightChairRotate, [0,1,0], glMatrix.toRadian(-105));
    	rightChair.transform.rotation = quat.clone(rightChairRotate);
    	rightChair.transform.position = vec3.fromValues(-15.5, -3.8+2.8*i, -1.8+4*i-1.2);
    	room.children.push(rightChair);
        var random = Math.random() * 5;
        if (random > 1.5)
            rightChair.children.push(person.clone());

    	var leftChair = chair.clone();
    	var leftChairRotate = quat.create();
    	quat.setAxisAngle(leftChairRotate, [0,1,0], glMatrix.toRadian(-75));
    	leftChair.transform.rotation = quat.clone(leftChairRotate);
    	leftChair.transform.position = vec3.fromValues(15.5, -3.8+2.8*i, -1.8+4*i-1.2);
    	room.children.push(leftChair); 
        var random = Math.random() * 5;
        if (random > 1.5)
            leftChair.children.push(person.clone());
    }

    //add a stool in the corner 
    var stool = new object();
    stool.tag = "stool";
    stool.loadFromObj ("stoolOBJ", "stoolMAT", "stoolTEX");
	stool.transform = new transform (vec3.fromValues(-16, -7.0, -8.5), vec3.fromValues(0.4, 0.4, 0.4), quat.clone(rotation)); 
	room.children.push (stool);
    stool.addRigidBody (new rigidBody (10.0, "dynamic"));
    stool.collider.physics = "dynamic";

    stool.addOnMouseClickTrigger (function (object) {
        object.rigidBody.P = vec3.fromValues (0.0, 0.0, 0.0);
        object.rigidBody.velocity = vec3.fromValues (0.0, 0.0, 0.0);
        currentScene.animationsManager.addAnimation (new animationHold (object));
    });

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

    SGraph.push (room);
}
