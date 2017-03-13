// like the functions in game.js, this function builds a scene graph, this time for the auxillary survival game in the testing facility
function buildSurvivalScene (SGraph) {

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
    var player = new object (new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                         null, 
                         null, 
                         null,
                         new boxCollider (vec3.fromValues (-1.0, -5.0, -1.0), vec3.fromValues (0.25, 0.0, 0.25), "dynamic"),
                         new rigidBody (100.0, "dynamic"));

    player.camera = cam;
    player.rigidBody.angularRigidBody = false;
    player.tag = "player";

    SGraph.playerController = new PlayerControllerSurvival (player);

    generateCubeNormals (cubeVertices);
    generateCubeVertices (cubeVertices);
    generateCubeTexCoords (texCoords);

    var prismGeo = new geometry (pointsArray, normalsArray, textureArray);

	// floor
    var floor = new object (new transform (vec3.fromValues (0.0, -4.0, 0.0), vec3.fromValues (1000.0, 3.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (10.0, "static"));
    floor.tag = "world";
    SGraph.push (floor);

    var roof = new object  (new transform (vec3.fromValues (0.0, 40.0, 0.0), vec3.fromValues (1000.0, 3.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (10.0, "static"));
    roof.tag = "world";
    SGraph.push (roof);

    var left = new object  (new transform (vec3.fromValues (-30.0, 0.0, 0.0), vec3.fromValues (3.0, 1000.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (10.0, "static"));
    left.tag = "world";
    SGraph.push (left);

    var right = new object (new transform (vec3.fromValues (30.0, 0.0, 0.0), vec3.fromValues (3.0, 1000.0, 1000.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (10.0, "static"));
    right.tag = "world";
    SGraph.push (right);

    var front = new object (new transform (vec3.fromValues (0.0, 0.0, 30.0), vec3.fromValues (1000.0, 1000.0, 3.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (10.0, "static"));
    front.tag = "world";
    SGraph.push (front);

    var back = new object  (new transform (vec3.fromValues (0.0, 0.0, -30.0), vec3.fromValues (1000.0, 1000.0, 3.0), quat.create ()),
                            new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                            prismGeo,
                            new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                            new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5)),
                            new rigidBody (10.0, "static"));
    back.tag = "world";
    SGraph.push (back);


    generateSphere (5);
    var sphereGeo = new geometry (pointsArray, normalsArray, textureArray);
    var sphere = new object (new transform (vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (1.0, 1.0, 1.0), quat.create ()),
                             new material (vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), vec4.fromValues (0.6, 0.6, 0.6, 1.0), 40.0),
                             sphereGeo,
                             new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                             new sphereCollider (vec3.fromValues (0.0, 0.0, 0.0), 1.0, "dynamic"),
                             new rigidBody (5.0, "dynamic"));
    sphere.tag = "sphere";

    player.addAnimation (new animationLaunchObject (player, sphere));
    player.animations[0].object = sphere;

    SGraph.push (player);

    var enemy = new object (new transform (vec3.fromValues (30.0, 30.0, 30.0), vec3.fromValues (2.0, 8.0, 2.0), quat.create ()),
                           new material (vec4.fromValues (0.8, 0.1, 0.1, 1.0), vec4.fromValues (0.8, 0.1, 0.1, 1.0), vec4.fromValues (0.8, 0.1, 0.1, 1.0), 40.0),
                           prismGeo,
                           new texture (document.getElementById ("whiteTEX"), [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]), 
                           new boxCollider (vec3.fromValues (-0.5, -0.5, -0.5), vec3.fromValues (0.5, 0.5, 0.5), "static"),
                           null);

    enemy.tag = "enemy";
    enemy.scene = SGraph;
    enemy.collider.collisionFunction = function (object1, object2) {
        if (object2.tag == "player") {
            currentScene.playerController.health--;
            if (currentScene.playerController.health <= 0) {
                document.getElementById('loser').textContent = "YOU DIED";
                StateManager.apply("deathEvent");
            }

            
            if(currentScene.playerController.health > -200) document.getElementById('health').textContent = 'Health: ' + currentScene.playerController.health;
            else document.getElementById('health').textContent = 'Health: '  + currentScene.playerController.health + '. Seriously? The programmers didn\'t even consider putting a cap at zero? You can go into negatives. Horrible design. Just horrible.';

        } else if (object2.tag == "sphere") {
            currentScene.remove (object1);
            currentScene.remove (object2);

            currentScene.playerController.score += 10;
            document.getElementById('score').textContent = 'Score: ' + currentScene.playerController.score + '        ';
        }
    }

    var enemySpawner = new object (new transform (), null, null, null, new nullCollider (), null);
    enemySpawner.tag = "enemySpanwer";
    enemySpawner.addAnimation (new animationEnemySpawner (enemySpawner, enemy));

    SGraph.push (enemySpawner);
}