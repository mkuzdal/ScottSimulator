var player;
function buildSceneGraph (SGraph) {

    SGraph.lightsManager.addSource (new light (new transform (vec3.fromValues (0.0, 30.0, 0.0), vec3.fromValues(1.0, 1.0, 1.0), quat.create ()),
                                               // WHERE THE LIGHT IS LOOKING AT GOES HERE
                                               vec4.fromValues (0.2, 0.2, 0.2, 1.0),
                                               vec4.fromValues (0.6, 0.6, 0.6, 1.0),
                                               vec4.fromValues (0.4, 0.4, 0.4, 1.0)));

    SGraph.lightsManager.lightSources[0].tag = "red";

    var cam = new camera ([0,-1.85,-15.8], glMatrix.toRadian(180), glMatrix.toRadian(5));
    player = new object (new transform (vec3.fromValues (0.0, 10.0, -15.8), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
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
    returntrigger = new object (new transform (vec3.fromValues (0.0, 0.0, -8.0), vec3.fromValues (100.0, 100.0, 0.5), quat.create ()),
                            null, null, null,
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "trigger"),
                            null
                    );
    room.children.push (returntrigger);

    foundbugtrigger = new object (new transform (vec3.fromValues (0.0, -4.0, 10.0), vec3.fromValues (100.0, 5.0, 15.0), quat.create ()),
                            null, null, null,
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "trigger"),
                            null
                    );
    room.children.push (foundbugtrigger);



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
    stool.loadFromObj ("stoolOBJ", "stoolMAT", "stoolTEX");
	stool.transform = new transform (vec3.fromValues(-16, -7.0, -8.5), vec3.fromValues(0.4, 0.4, 0.4), quat.clone(rotation)); 
	room.children.push (stool);
    stool.addRigidBody (new rigidBody (10.0, "dynamic"));
    stool.collider.physics = "dynamic";

    var button = new object ();
    button.loadFromObj ("buttonOBJ", "buttonMAT", "buttonTEX");
    button.transform = new transform (vec3.fromValues (0.0, 0.15, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    var buttonMount = new object ();
    buttonMount.loadFromObj ("buttonMountOBJ", "buttonMountMAT", "buttonMountTEX");
    buttonMount.transform = new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ());
    buttonMount.children.push (button);
    
    rightButtonMount = buttonMount.clone(); rightButtonMount.transform.position = vec3.fromValues (-5,0,0); rightButtonMount.active = true;
    leftButtonMount = buttonMount.clone(); leftButtonMount.transform.position = vec3.fromValues (5,0,0); leftButtonMount.active = true;
    physicsButton = buttonMount.clone(); physicsButton.transform.position = vec3.fromValues(0,0,0); physicsButton.active = false;

    room.children.push (rightButtonMount);
    room.children.push (leftButtonMount);
    SGraph.root.children.push (room);
}

var leavetrigger1, leavetrigger2, leavetrigger3;
var returntrigger;
var foundbugtrigger;
var rightButtonMount, leftButtonMount, physicsButton;

var previousState = null; //used for when I leave a certain state into a branch but want to return. I could use something like stackframes but I'm too lazy and this is more than enough for my purposes;

function buildStateMachine () {
    StateManager.addState("intro1");
    StateManager.addState("intro2");
    StateManager.addState("intro3");
    StateManager.addState("leaving1");
    StateManager.addState("leaving2");
    StateManager.addState("leaving3");
    StateManager.addState("twobuttons");
    StateManager.addState("clickedRight1");
    StateManager.addState("clickedRight2");
    StateManager.addState("clickedRight3");
    StateManager.addState("clickedLeft");
    StateManager.addState("physicsDemo");
    StateManager.addState("saved");


    var clickedStart = new Event("clickStart", new Activity(null, function(){}, function(){console.log('Scott looked down.')}));
    var introWait1 = new Event("introWait1", new Activity(null, function(){}, function(){console.log('What are you waiting for? Nothing is going to happen if you just sit around.')}));
    var introWait2 = new Event("introWait2", new Activity(null, function(){}, function(){console.log('I am serious. You are just wasting your time at this point.')}));
    var leaving1 = new Event("leavetrigger1", new Activity(null, 
        function() {
            if (previousState) console.log('Something is wrong. We should never enter a different state while previous state is still set.');
            previousState = StateManager.getCurrentState();
        }, 
        function() {
            console.log('Scott... Where are you going?')
        }
    ));
    var leaving2 = new Event("leavetrigger2", new Activity(null, function(){}, function(){console.log('Don\'t make me do this!')}));
    var leaving3 = new Event("leavetrigger3", new Activity(null, function(){}, function(){console.log('Alright. That\'s the last straw. (play baby music)')}));
    var returning = new Event("returntrigger", new Activity(null, 
        function() {
            StateManager.setState(previousState);
            previousState = null;
        }, 
        function() {
            console.log('Thanks for coming back')
        }
    ));

    var lookedDown = new Event("lookDown", new Activity(null, function(){}, function(){console.log('Scott clicks the left button.')}));
    var clickedRight1 = new Event("clickedRight", new Activity(document.getElementById('AUDIOBRIBED'), 
        function() {
            rightButtonMount.transform.position = vec3.fromValues(0.0,0.75,-17.5); 
            rightButtonMount.transform.rotation = vec4.fromValues(0.7071, 0.0, 0.0, 0.7071);
        }, 
        function() {
            console.log('You might not have heard me. I said the left button')
        }
    ));
    var clickedRight2 = new Event("clickedRight", new Activity(document.getElementById('AUDIOFOUNDOIL'), 
        function() {
            //player.transform.position = vec3.fromValues(0.0, 10, -15.8);
            //player.transform.rotation = vec3.fromValues(-0.07094697654247284, -0.9180688858032227, -0.19179458916187286, 0.3396040201187134);
            rightButtonMount.transform.position = vec3.fromValues(3.0,0.75,-17.5); 
            leftButtonMount.transform.scale = vec3.fromValues(5.0, 5.0, 5.0);
        }, 
        function() {
            console.log('LEFT. As in your left');
        }
    ));
    var clickedRight3 = new Event("clickedRight", new Activity(document.getElementById('AUDIODIE'), 
        function() {
            rightButtonMount.children[0].texture = new texture (document.getElementById ("TEXfrance"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]);
        }, 
        function() {
            console.log('You have done it now Scott...');
        }
    ));
    var clickedRight4 = new Event("clickedRight", new Activity(document.getElementById('AUDIOGIVEUP'), 
        function() {
            rightButtonMount.active = false;
        }, 
        function() {console.log('Seriously? Again???')}
    ));
    var clickedLeft = new Event("clickedLeft", new Activity(document.getElementById('AUDIOSONAR'), 
        function() {
            rightButtonMount.active = false;
            leftButtonMount.active = false;
            physicsButton.active = true;
        }, 
        function() {
            console.log('Good job')
        }
    ));
    var changePhysics = new Event("physics", new Activity(null, function(){}, function(){console.log('Change gravity')}));
    var savedWorld = new Event("savedWorld", new Activity(null, function(){}, function(){console.log('Saved world!')}));

    StateManager.getState("root").addChild(clickedStart, StateManager.getState("intro1"));
    StateManager.getState("intro1").addChild(introWait1, StateManager.getState("intro2"));
    StateManager.getState("intro2").addChild(introWait2, StateManager.getState("intro3"));
    StateManager.getState("intro1").addChild(lookedDown, StateManager.getState("twobuttons"));
    StateManager.getState("intro2").addChild(lookedDown, StateManager.getState("twobuttons"));
    StateManager.getState("intro3").addChild(lookedDown, StateManager.getState("twobuttons"));
    StateManager.getState("twobuttons").addChild(clickedRight1, StateManager.getState("clickedRight1"));
    StateManager.getState("clickedRight1").addChild(clickedRight2, StateManager.getState("clickedRight2"));
    StateManager.getState("clickedRight2").addChild(clickedRight3, StateManager.getState("clickedRight3"));
    StateManager.getState("clickedRight3").addChild(clickedRight4, StateManager.getState("clickedRight3"));
    StateManager.getState("twobuttons").addChild(clickedLeft, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedRight1").addChild(clickedLeft, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedRight2").addChild(clickedLeft, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedRight3").addChild(clickedLeft, StateManager.getState("clickedLeft"));
    StateManager.getState("clickedLeft").addChild(changePhysics, StateManager.getState("physicsDemo"));
    StateManager.getState("physicsDemo").addChild(savedWorld, StateManager.getState("saved"));
    
    // add all the leaving triggers
    StateManager.getState("intro1").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("intro2").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("intro3").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("twobuttons").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("clickedRight1").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("clickedRight2").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("clickedRight3").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("clickedLeft").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("physicsDemo").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("saved").addChild(leaving1, StateManager.getState("leaving1"));
    StateManager.getState("leaving1").addChild(leaving2, StateManager.getState("leaving2"));
    StateManager.getState("leaving2").addChild(leaving3, StateManager.getState("leaving3"));
    StateManager.getState("leaving1").addChild(returning, StateManager.getState("root"));
    StateManager.getState("leaving2").addChild(returning, StateManager.getState("root"));
    StateManager.getState("leaving3").addChild(returning, StateManager.getState("root"));




    rightButtonMount.children[0].addOnMouseClickTrigger(function(object) {
        StateManager.apply("clickedRight");
    });
    leftButtonMount.children[0].addOnMouseClickTrigger(function(object) {
        StateManager.apply("clickedLeft");
    }); 
    physicsButton.children[0].addOnMouseClickTrigger(function(object) {
        applyChangedPhysics();
        StateManager.apply("physicsDemo");
    }); 

    setTimeout(function() {
        StateManager.apply("introWait1");
    }, 10000);
    setTimeout(function() {
        StateManager.apply("introWait2");
    }, 30000);

    leavetrigger1.collider.collisionFunction = function (object1, object2) {
        StateManager.apply("leavetrigger1");
    }
    leavetrigger2.collider.collisionFunction = function (object1, object2) {
        StateManager.apply("leavetrigger2");
    }
    leavetrigger3.collider.collisionFunction = function (object1, object2) {
        StateManager.apply("leavetrigger3");
    }
    returntrigger.collider.collisionFunction = function (object1, object2) {
        StateManager.apply("returntrigger");
    }
    foundbugtrigger.collider.collisionFunction = function (object1, object2) {
        // play the found bug audio. if the audio is already playing (if currentTime != 0) then don't play it again.
        console.log('Oh. Look at you. You found a bug! Congratulations. Wanna get out?... Umm. Good luck with that.');
        foundbugtrigger.collider.collisionFunction = null;
    }


    StateManager.apply("clickStart");
    StateManager.apply("lookDown");
}

function applyChangedPhysics() {
    // changed the gravity of select objects on the scene graph
}