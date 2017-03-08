function buildSceneGraph (SGraph) {

    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (0.0, 30.0, 0.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                              vec4.fromValues (0.4, 0.4, 0.4, 1.0),
                              vec4.fromValues (0.8, 0.8, 0.8, 1.0),
                              vec4.fromValues (1.0, 1.0, 1.0, 1.0)));

    SGraph.lightsManager.lightSources[0].tag = "red";

    var cam = new camera ([0,-1.85,-15.8], glMatrix.toRadian(180), glMatrix.toRadian(5));
    var player = new object (new transform (vec3.fromValues (0.0, 10.0, -15.8), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                         null, 
                         null, 
                         null,
                         new boxCollider (vec3.fromValues (-0.5, -7.5, -0.5), vec3.fromValues (0.5, 0.0, 0.5), "dynamic"),
                         new rigidBody (100.0, "dynamic"));

    player.camera = cam;
    player.rigidBody.angularRigidBody = false;
    player.tag = "player";

    SGraph.root.children.push (player);
    SGraph.playerController = new PlayerController (player);

	// room
	var room = new object ();
	room.loadFromObj ("roomOBJ", "roomMAT", "roomTEX");
	room.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (2.0, 2.0, 2.0), quat.create ());
	room.tag = "world";
	SGraph.root.children.push (room);
    room.collider = new nullCollider ();

    var roomColliders = [];

    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, -9.5, 0.0), vec3.fromValues (100.0, 3.0, 100.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    roomColliders.push ( new object (new transform (vec3.fromValues (17.5, 0.0, 0.0), vec3.fromValues (1.0, 30.0, 50.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    roomColliders.push ( new object (new transform (vec3.fromValues (-17.5, 0.0, 0.0), vec3.fromValues (1.0, 30.0, 50.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, 0.0, -17.5), vec3.fromValues (50.0, 30.0, 1.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, 0.0, -17.5), vec3.fromValues (50.0, 30.0, 1.0), quat.create ()),
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
    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, 9.0, 18.0), vec3.fromValues (50.0, 30.0, 1.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, 10.0, 12.0), vec3.fromValues (18.0, 8.0, 0.5), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );
    roomColliders.push ( new object (new transform (vec3.fromValues (0.0, 14.0, 0.0), vec3.fromValues (100.0, 3.0, 100.0), quat.create ()),
                            null, null, null,
                            new boxCollider (),
                            new rigidBody (1000.0, "static"))
                    );

    for (var i=0; i<roomColliders.length; i++) room.children.push (roomColliders[i]);

	var roof = new object ();
	roof.loadFromObj ("roofOBJ", "roofMAT", "roofTEX");
	roof.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
	room.children.push(roof);

	var speaker = new object ();
	var rotation = quat.create();
	quat.setAxisAngle(rotation, [0,1,0], glMatrix.toRadian(75));
	speaker.loadFromObj ("speakerOBJ", "speakerMAT", "speakerTEX");
	speaker.transform = new transform (vec3.fromValues (15, 11.3, -3), vec3.fromValues (2.0, 2.0, 2.0), quat.clone (rotation));
	room.children.push(speaker);

	var speaker2 = speaker.clone();
	speaker2.transform.position = vec3.fromValues (-15, 11.3, -3);
	quat.setAxisAngle(rotation, [0,1,0], glMatrix.toRadian(-75));
	speaker2.transform.rotation = quat.clone (rotation);
	room.children.push(speaker2);

	// desk
	var desk = new object ();
	desk.loadFromObj ("deskOBJ", "deskMAT", "deskTEX");
	var rotation = quat.create();
	quat.setAxisAngle(rotation, [0,1,0], glMatrix.toRadian(-90))
	desk.transform = new transform (vec3.fromValues (0.0, -6, -9), vec3.fromValues (1.4, 1.4, 1.4), quat.clone(rotation));
	room.children.push (desk);
    desk.addRigidBody (new rigidBody (50.0, "static"));

	//make all the chairs!
    var chair = new object ();
    chair.loadFromObj ("chairOBJ", "chairMAT", "chairTEX");
    chair.transform = new transform (vec3.fromValues (0, -3.8, -1.3), vec3.fromValues (1.2, 1.2, 1.2), quat.clone(rotation));
    var seat = new object ();
	seat.loadFromObj ("seatOBJ", "seatMAT", "seatTEX");
	var rotation = quat.create ();
	quat.setAxisAngle (rotation, [0,1,0], glMatrix.toRadian(-90));
    //var rotation2 = quat.create ();
    //quat.setAxisAngle (rotation2, [1,0,0], glMatrix.toRadian (105));
    //quat.mul (rotation, rotation, rotation2);
	seat.transform = new transform (vec3.fromValues(0.0,0.3,0.22), vec3.fromValues (1.0, 1.0, 1.0), quat.clone(rotation));

	chair.children.push (seat);
    chair.addRigidBody (new rigidBody (10.0, "static"));

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
    stool.loadFromObj("stoolOBJ", "stoolMAT", "stoolTEX");
	stool.transform = new transform (vec3.fromValues(-16, -7.48, -8.5), vec3.fromValues(0.4, 0.4, 0.4), quat.clone(rotation)); 
	room.children.push(stool); 
    stool.addRigidBody (new rigidBody (10.0, "dynamic"));
    stool.collider.physics = "dynamic";

    var button = new object ();
    button.loadFromObj ("buttonOBJ", "buttonMAT", "buttonTEX");
    button.transform = new transform (vec3.fromValues (0.0, 0.15, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    var buttonMount = new object ();
    buttonMount.loadFromObj ("buttonMountOBJ", "buttonMountMAT", "buttonMountTEX");
    buttonMount.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    buttonMount.children.push (button);
    
    rightButtonMount = buttonMount.clone(); rightButtonMount.transform.position = vec3.fromValues (-5,0,0);
    leftButtonMount = buttonMount.clone(); leftButtonMount.transform.position = vec3.fromValues (5,0,0);

    room.children.push (rightButtonMount);
    room.children.push (leftButtonMount);
    SGraph.root.children.push (room);
}

var rightButtonMount, leftButtonMount;

function buildStateMachine () {
    StateManager.addState("twobuttons");
    StateManager.addState("clickedRight1");
    StateManager.addState("clickedRight2");
    StateManager.addState("clickedRight3");
    StateManager.addState("clickedLeft");

    var lookedDown = new Event("lookDown", new Activity(null, function(){}, function(){console.log('Scott clicks the left button.')}));
    var clickedRight1 = new Event("clickedRight", new Activity(document.getElementById('AUDIOBRIBED'), function(){}, function(){console.log('You did not hear me. I said the left button')}));
    var clickedRight2 = new Event("clickedRight", new Activity(document.getElementById('AUDIOFOUNDOIL'), function(){}, function(){console.log('LEFT. As in your left')}));
    var clickedRight3 = new Event("clickedRight", new Activity(document.getElementById('AUDIODIE'), function(){}, function(){console.log('You have done it now Scott...')}));
    var clickedRight4 = new Event("clickedRight", new Activity(document.getElementById('AUDIOGIVEUP'), function(){}, function(){console.log('Alright, that is it. Game over...')}));
    var clickedLeft = new Event("clickedLeft", new Activity(document.getElementById('AUDIOSONAR'), function(){}, function(){console.log('Good job')}));

    StateManager.getState("root").addChild(lookedDown, StateManager.getState("twobuttons"));
    StateManager.getState("twobuttons").addChild(clickedRight1, StateManager.getState("clickedRight1"));
    StateManager.getState("clickedRight1").addChild(clickedRight2, StateManager.getState("clickedRight2"));
    StateManager.getState("clickedRight2").addChild(clickedRight3, StateManager.getState("clickedRight3"));
    StateManager.getState("clickedRight3").addChild(clickedRight4, StateManager.getState("root"));
    StateManager.getState("clickedRight1").addChild(clickedLeft, StateManager.getState("root"));
    StateManager.getState("clickedRight2").addChild(clickedLeft, StateManager.getState("root"));
    StateManager.getState("clickedRight3").addChild(clickedLeft, StateManager.getState("root"));
    StateManager.getState("twobuttons").addChild(clickedLeft, StateManager.getState("root"));

    rightButtonMount.children[0].addOnMouseClickTrigger(function(object) {
        StateManager.apply("clickedRight");
    });
    leftButtonMount.children[0].addOnMouseClickTrigger(function(object) {
        StateManager.apply("clickedLeft");
    }); 

    StateManager.apply("lookDown");
}