
class animationHandler {
    constructor (_scene) {
        this.animations = [];

        this.scene = _scene;
    }

    addAnimation (_animation) {
        this.animations.push (_animation)
    }

    animateAll (dTime) {
        for (var i = 0; i < this.animations.length; i++) {
            this.animations[i].animate (dTime);
        }
    }

    animateByAnimationTag (tag, dTime) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].tag == tag) {
                this.animations[i].animate (dTime);
            }
        }
    }

    animateByObjectTag (tag, dTime) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].object.tag == tag) {
                this.animations[i].animate (dTime);
            }
        }
    }

    animateByObject (object, dTime) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].object === object) {
                this.animations[i].animate (dTime);
            }
        }
    }

    activateAll () {
        for (var i = 0; i < this.animations.length; i++) {
            this.animations[i].active = true;
        }
    }

    activateByAnimationTag (tag) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].tag == tag) {
                this.animations[i].active = true;
            }
        }
    }

    activateByObjectTag (tag) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].object.tag == tag) {
                this.animations[i].active = true;
            }
        }
    }

    activateByObject (object) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].object === object) {
                this.animations[i].active = true;
            }
        }
    }

    deactivateAll () {
        for (var i = 0; i < this.animations.length; i++) {
            this.animations[i].active = false;
        }
    }

    deactivateByAnimationTag (tag) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].tag == tag) {
                this.animations[i].active = false;
            }
        }
    }

    deactivateByObjectTag (tag) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].object.tag == tag) {
                this.animations[i].active = false;
            }
        }
    }

    deactivateByObject (object) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].object === object) {
                this.animations[i].active = false;
            }
        }
    }

    toggleAll () {
        for (var i = 0; i < this.animations.length; i++) {
            this.animations[i].active = !this.animations[i].active;
        }
    }

    toggleByAnimationTag (tag) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].tag == tag) {
                this.animations[i].active = !this.animations[i].active;
            }
        }
    }

    toggleByObjectTag (tag) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].object.tag == tag) {
                this.animations[i].active = !this.animations[i].active;
            }
        }
    }

    toggleByObject (object) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].object === object) {
                this.animations[i].active = !this.animation[i].active;
            }
        }
    }

    removeAnimation (animation) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i] === animation) {
                this.animations.splice (i, 1);
                return;
            }
        }
    }

    removeAnimationsByTag (tag) {
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i] == tag) {
                this.animations.splice (i, 1);
                i--;
            }
        }
    }
}

/** animationRotation: a class that defines a rotation for an object. When passed
 *  an object to rotate, and a frequency, the animation will rotate the object to 
 *  the proper orientation.
 */
class animationRotation {
    /** constructor: creates an instance of the animation
     *  @param { object } object: the object to apply the animation to.
     *  @param { float } theta: the initial rotation for the object
     *  @param { float } omega: the angular frequency of rotation for the object.
     *  @param { vec3 } axis: the axis to rotate around.
     */
    constructor (_object, _omega, _axis) {
        this.object = _object;
        this.omega = _omega;
        this.axis = _axis;
        this.active = true;
        this.tag = "rotate";
    }

    /** animate: event loop function. Applies the rotation animation to the object.
     *  @param { float } dTime: the time since the last framce callback (in seconds).
     */
    animate (dTime) {
        if (!this.active)
            return;

        var to_rot = quat.create ();
        quat.setAxisAngle (to_rot, this.axis, glMatrix.toRadian (this.omega * dTime));
        quat.mul (this.object.transform.rotation, this.object.transform.rotation, to_rot);
        quat.normalize (this.object.transform.rotation, this.object.transform.rotation);
    }

    clone () {
        var newAnimation = new animationRotation (this.object, this.omega, this.axis);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationHold {
    constructor (_object) {
        this.object = _object;

        var currentPos = vec3.create ();
        vec3.transformMat4 (currentPos, this.object.transform.position, this.object.worldView);

        var cameraPos = vec3.create ();
        vec3.transformMat4 (cameraPos, currentScene.playerController.player.transform.position, currentScene.playerController.player.worldView);

        this.distance = vec3.distance (currentPos, cameraPos);
        this.active = true;
        this.tag = "hold";
    }

    animate (dTime) {
        if (!this.active)
            return;

        var storage = mat4.create ();
        mat4.fromQuat (storage, currentScene.playerController.player.camera.rotation);
            
        var direction = vec3.fromValues (-storage[8], -storage[9], -storage[10]);
        vec3.normalize (direction, direction);
        vec3.scale (direction, direction, this.distance);

        if (this.object.scene.clickManager.leftclicked) {
            this.object.rigidBody.type = "dynamic";
            vec3.scale (this.object.rigidBody.P, vec3.clone (direction), 5.0);
            this.object.scene.animationsManager.removeAnimation (this);
        }

        vec3.add (direction, direction, currentScene.playerController.player.camera.position);
        this.object.transform.position = direction;
    }

    clone () {
        var newAnimation = new animationHold (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationChair {
    constructor (_object) {
        this.object = _object;

        this.open = true;
        this.active = true;
        this.tag = "chair";

        this.openRotation = quat.create ();
        quat.setAxisAngle (this.openRotation, [0, 1, 0], glMatrix.toRadian (-90));
        
        this.closedRotation = quat.create ();
        quat.setAxisAngle (this.closedRotation, [1, 0, 0], glMatrix.toRadian (-75));
        quat.mul (this.closedRotation, this.openRotation, this.closedRotation);

        this.openPosition = vec3.fromValues (0.0, 0.3, 0.22);
        this.closedPosition = vec3.fromValues (1.0, 0.3, 0.22);

        this.currentRotation = quat.clone (this.openRotation);
        this.currentPosition = vec3.clone (this.openPosition);
    }

    animate (dTime) {
        if (!this.active) 
            return;

        var destinationRot = quat.create ();
        var destinationPos = vec3.create ();

        if (this.open) {
            destinationRot = quat.clone (this.openRotation);
            destinationPos = vec3.clone (this.openPosition);
        } else {
            destinationRot = quat.clone (this.closedRotation);
            destinationPos = vec3.clone (this.closedPosition);
        }

        quat.slerp (this.currentRotation, this.currentRotation, destinationRot, 4 * dTime);
        vec3.lerp (this.currentPosition, this.currentPosition, destinationPos, 4 * dTime);

        this.object.transform.position = vec3.clone (this.currentPosition);
        this.object.transform.rotation = quat.clone (this.currentRotation);
    }

    clone () {
        var newAnimation = new animationChair (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationLeftdoor {
    constructor (_object) {
        this.object = _object;

        this.open = false;
        this.active = true;
        this.tag = "leftdoor";

        this.closedRotation = quat.clone (this.object.transform.rotation);
        
        this.openRotation = quat.create ();
        quat.setAxisAngle (this.openRotation, [0, 1, 0], glMatrix.toRadian (75));
        quat.mul (this.openRotation, this.closedRotation, this.openRotation);

        this.currentRotation = quat.clone (this.closedRotation);
    }

    animate (dTime) {
        if (!this.active) 
            return;

        var destinationRot = quat.create ();

        if (this.open) {
            destinationRot = quat.clone (this.openRotation);
        } else {
            destinationRot = quat.clone (this.closedRotation);
        }

        quat.slerp (this.currentRotation, this.currentRotation, destinationRot, 4 * dTime);

        this.object.transform.rotation = quat.clone (this.currentRotation); 
    }

    clone () {
        var newAnimation = new animationLeftdoor (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationRightdoor {
    constructor (_object) {
        this.object = _object;

        this.open = false;
        this.active = true;
        this.tag = "rightdoor";

        this.closedRotation = quat.clone (this.object.transform.rotation);
        
        this.openRotation = quat.create ();
        quat.setAxisAngle (this.openRotation, [0, 1, 0], glMatrix.toRadian (-75));
        quat.mul (this.openRotation, this.closedRotation, this.openRotation);

        this.currentRotation = quat.clone (this.closedRotation);
    }

    animate (dTime) {
        if (!this.active) 
            return;

        var destinationRot = quat.create ();

        if (this.open) {
            destinationRot = quat.clone (this.openRotation);
        } else {
            destinationRot = quat.clone (this.closedRotation);
        }

        quat.slerp (this.currentRotation, this.currentRotation, destinationRot, 4 * dTime);

        this.object.transform.rotation = quat.clone (this.currentRotation);
    }

    clone () {
        var newAnimation = new animationRightdoor (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationScaleObject {
    constructor (_object, _toScale) {
        this.object = _object;
        this.toScale = _toScale;

        this.currentHold = null;

        this.active = true;
        this.tag = "scale";

        this.distance = 5.0;
        this.scale = 0.0;
    }

    animate (dTime) {
        if (!this.active)
            return;

        if (currentScene.clickManager.rightclicked) {
            this.currentHold = this.toScale.clone ();
            currentScene.push (this.currentHold);
            this.currentHold.collider.physics = "trigger";
            this.currentHold.material = new material (vec4.fromValues (0.3, 0.0, 0.0, 0.4),
                                                      vec4.fromValues (0.3, 0.0, 0.0, 0.4),
                                                      vec4.fromValues (0.3, 0.0, 0.0, 0.4),
                                                      80.0);
        } 

        if (this.currentHold) {
            this.scale += 1.0 * dTime;
            if (this.scale > 5.0)
                this.scale = 5.0;

            this.currentHold.material.ambient[0] = 0.3 + this.scale / 2.5;
            this.currentHold.material.specular[0] = 0.3 + this.scale / 2.5;
            this.currentHold.material.diffuse[0] = 0.3 +  this.scale / 2.5;

            var storage = mat4.create ();
            mat4.fromQuat (storage, currentScene.playerController.player.camera.rotation);
            
            var direction = vec3.fromValues (-storage[8], -storage[9], -storage[10]);
            vec3.normalize (direction, direction);

            var pos = vec3.create ();
            vec3.scale (pos, direction, this.distance + this.scale);            

            vec3.add (pos, pos, currentScene.playerController.player.camera.position);
            this.currentHold.transform.position = pos;
            this.currentHold.transform.scale = vec3.fromValues (this.scale, this.scale, this.scale);

            if (currentScene.clickManager.rightreleased) {
                this.currentHold.collider.physics = "dynamic";
                this.currentHold.addRigidBody (new rigidBody (this.currentHold.rigidBody.mass * this.scale, "dynamic"));
                this.currentHold.material.ambient[3] = 1.0;
                this.currentHold.material.specular[3] = 1.0;
                this.currentHold.material.diffuse[3] = 1.0;
                
                this.currentHold.addAnimation (new animationLifetime (this.currentHold, 20.0));

                this.scale = 0.0;
                this.currentHold = null;
            }
        }
    }

    clone () {
        var newAnimation = new animationScaleObject (this.object, this.toScale);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationLaunchObject {
    constructor (_object, _toLaunch) {
        this.object = _object;
        this.toLaunch = _toLaunch;

        this.currentHold = null;

        this.active = true;
        this.tag = "launch";

        this.distance = 5.0;
        this.scale = 0.0;
    }

    animate (dTime) {
        if (!this.active)
            return;

        if (currentScene.clickManager.leftclicked) {
            this.currentHold = this.toLaunch.clone ();
            currentScene.push (this.currentHold);
            this.currentHold.collider.physics = "trigger";
            this.currentHold.material = new material (vec4.fromValues (0.0, 0.3, 0.0, 0.4),
                                                      vec4.fromValues (0.0, 0.3, 0.0, 0.4),
                                                      vec4.fromValues (0.0, 0.3, 0.0, 0.4),
                                                      80.0);
        } 

        if (this.currentHold) {
            this.scale += 1.0 * dTime;
            if (this.scale > 5.0)
                this.scale = 5.0;

            this.currentHold.material.ambient[1] = 0.3 + this.scale / 2.5;
            this.currentHold.material.specular[1] = 0.3 + this.scale / 2.5;
            this.currentHold.material.diffuse[1] = 0.3 + this.scale / 2.5;

            var storage = mat4.create ();
            mat4.fromQuat (storage, currentScene.playerController.player.camera.rotation);
            
            var direction = vec3.fromValues (-storage[8], -storage[9], -storage[10]);
            vec3.normalize (direction, direction);

            var pos = vec3.create ();
            vec3.scale (pos, direction, this.distance);            

            vec3.add (pos, pos, currentScene.playerController.player.camera.position);
            this.currentHold.transform.position = pos;

            if (currentScene.clickManager.leftreleased) {
                this.currentHold.collider.physics = "dynamic";
                this.currentHold.material.ambient[3] = 1.0;
                this.currentHold.material.specular[3] = 1.0;
                this.currentHold.material.diffuse[3] = 1.0;

                vec3.scale (this.currentHold.rigidBody.P, direction, this.scale * this.currentHold.rigidBody.mass * 40.0);                
                this.currentHold.rigidBody.velocity = vec3.fromValues (0.0, 0.0, 0.0);

                this.currentHold.addAnimation (new animationLifetime (this.currentHold, 20.0));
                this.scale = 0.0;
                this.currentHold = null;
            }
        }
    }

    clone () {
        var newAnimation = new animationLaunchObject (this.object, this.toLaunch);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationLifetime {
    constructor (_object, _lifeTime) {
        this.object = _object
        this.lifeTime = _lifeTime;

        this.tag = "lifetime"
        this.currentTime = 0.0;

        this.active = true;
    }

    animate (dTime) {
        if (!this.active)
            return;

        this.currentTime += dTime;

        if (this.currentTime > this.lifeTime) {
            currentScene.remove (this.object);
            this.active = false;
        }
    }

    clone () {
        var newAnimation = new animationLifetime (this.object, this.lifeTime);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationEnemy {
    constructor (_object) {
        this.object = _object

        this.tag = "enemy";
        this.speed = 0.3;
        this.active = true;
    }

    animate (dTime) {
        if (!this.active)
            return;

        this.seek = vec3.clone (currentScene.playerController.player.transform.position);
        this.seek[1] = 0.0;
        vec3.lerp (this.object.transform.position, this.object.transform.position, this.seek, this.speed * dTime);     
    }

    clone () {
        var newAnimation = new animationEnemy (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationEnemySpawner {
    constructor (_object, _toSpawn) {
        this.object = _object
        this.toSpawn = _toSpawn;
        
        this.tag = "enemySpawner";
        this.radius = 25.0;
        this.cooldown = 5.0;

        this.current_cooldown = 0.0;

        this.active = true;
    }

    animate (dTime) {
        if (!this.active)
            return;

        this.current_cooldown -= dTime;
        if (this.current_cooldown < 0.0) {
            console.log ("SPAWN");
            var angle = Math.random () * Math.PI * 2;

            var toSpawn = this.toSpawn.clone ();
            toSpawn.addAnimation (new animationEnemy (toSpawn));

            toSpawn.transform.position = vec3.fromValues (this.radius * Math.cos (angle), 0.0, this.radius * Math.sin (angle));

            currentScene.push (toSpawn);

            this.current_cooldown = this.cooldown;
            this.cooldown *= 0.9;
        }
    }

    clone () {
        var newAnimation = new animationEnemySpawner (this.object, this.toSpawn);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationDangerDoorRight {
    constructor (_object) {
        this.object = _object;

        this.open = false;
        this.active = true;
        this.tag = "dangerDoorRight";

        this.closedPosition = vec3.clone (this.object.transform.position);
        
        this.openPosition = vec3.clone (this.closedPosition);
        this.openPosition[0] -= 5.0;

        this.currentPosition = vec3.clone (this.closedPosition);
    }

    animate (dTime) {
        if (!this.active) 
            return;

        var destinationPos = vec3.create ();

        if (this.open) {
            destinationPos = vec3.clone (this.openPosition);
        } else {
            destinationPos = vec3.clone (this.closedPosition);
        }

        vec3.lerp (this.currentPosition, this.currentPosition, destinationPos, 1.0 * dTime);

        this.object.transform.position = vec3.clone (this.currentPosition); 
    }

    clone () {
        var newAnimation = new animationDangerDoorRight (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationDangerDoorLeft {
    constructor (_object) {
        this.object = _object;

        this.open = false;
        this.active = true;
        this.tag = "dangerDoorLeft";

        this.closedPosition = vec3.clone (this.object.transform.position);
        
        this.openPosition = vec3.clone (this.closedPosition);
        this.openPosition[0] += 5.0;
        
        this.currentPosition = vec3.clone (this.closedPosition);
    }

    animate (dTime) {
        if (!this.active) 
            return;

        var destinationPos = vec3.create ();

        if (this.open) {
            destinationPos = vec3.clone (this.openPosition);
        } else {
            destinationPos = vec3.clone (this.closedPosition);
        }

        vec3.lerp (this.currentPosition, this.currentPosition, destinationPos, 1.0 * dTime);

        this.object.transform.position = vec3.clone (this.currentPosition); 
    }

    clone () {
        var newAnimation = new animationDangerDoorLeft (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationButton {
    constructor (_object) {
        this.object = _object;

        this.pressed = false;
        this.active = true;
        this.tag = "button";

        this.normalPosition = vec3.clone (this.object.transform.position);
        
        this.pressedPosition = vec3.clone (this.normalPosition);
        this.pressedPosition[1] -= 0.3;
        
        this.currentPosition = vec3.clone (this.normalPosition);
    }

    animate (dTime) {
        if (!this.active) 
            return;

        var destinationPos = vec3.clone (this.normalPosition);

        if (this.pressed) {
            destinationPos = vec3.clone (this.pressedPosition);
        } 
    
        vec3.lerp (this.currentPosition, this.currentPosition, destinationPos, 4.0 * dTime);

        this.object.transform.position = vec3.clone (this.currentPosition); 
        
        if (Math.abs(this.currentPosition[1] - this.pressedPosition[1]) < 0.1) {
            this.pressed = false;
        }
    }

    clone () {
        var newAnimation = new animationButton (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

