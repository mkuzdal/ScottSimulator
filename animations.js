
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
    constructor (_object, _theta, _omega, _axis) {
        this.object = _object;
        this.theta = _theta;
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

        this.theta += this.omega * dTime;
        var to_rot = quat.create ();
        quat.setAxisAngle (to_rot, this.axis, this.theta * Math.PI / 180);
        quat.slerp (this.object.transform.rotation, this.object.transform.rotation, to_rot, 1.0);
        quat.normalize (this.object.transform.rotation, this.object.transform.rotation);
    }

    clone () {
        var newAnimation = new animationRotation (this.object, this.theta, this.omega, this.axis);
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
    constructor (_object) {
        this.object = _object;
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
            this.currentHold = this.object.clone ();
            currentScene.push (this.currentHold);
            this.currentHold.collider.physics = "trigger";
            this.currentHold.material = new material (vec4.fromValues (0.3, 0.0, 0.0, 0.1),
                                                      vec4.fromValues (0.3, 0.0, 0.0, 0.1),
                                                      vec4.fromValues (0.3, 0.0, 0.0, 0.1),
                                                      80.0);
        } 

        if (this.currentHold) {
            this.scale += 1.0 * dTime;
            if (this.scale > 10.0)
                this.scale = 10.0;

            this.currentHold.material.ambient[0] = 0.3 + this.scale / 20.0;
            this.currentHold.material.specular[0] = 0.3 + this.scale / 20.0;
            this.currentHold.material.diffuse[0] = 0.3 +  this.scale / 20.0;

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
                

                this.scale = 0.0;
                this.currentHold = null;
            }
        }
    }

    clone () {
        var newAnimation = new animationScaleObject (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}

class animationLaunchObject {
    constructor (_object) {
        this.object = _object;
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
            this.currentHold = this.object.clone ();
            currentScene.push (this.currentHold);
            this.currentHold.collider.physics = "trigger";
            this.currentHold.material = new material (vec4.fromValues (0.0, 0.3, 0.0, 0.1),
                                                      vec4.fromValues (0.0, 0.3, 0.0, 0.1),
                                                      vec4.fromValues (0.0, 0.3, 0.0, 0.1),
                                                      80.0);
        } 

        if (this.currentHold) {
            this.scale += 1.0 * dTime;
            if (this.scale > 10.0)
                this.scale = 10.0;

            this.currentHold.material.ambient[1] = 0.3 + this.scale / 20.0;
            this.currentHold.material.specular[1] = 0.3 + this.scale / 20.0;
            this.currentHold.material.diffuse[1] = 0.3 + this.scale / 20.0;

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

                this.scale = 0.0;
                this.currentHold = null;
            }
        }
    }

    clone () {
        var newAnimation = new animationLaunchObject (this.object);
        newAnimation.active = this.active;
        return newAnimation;
    }
}