
class animationHandler {
    constructor () {
        this.animations = [];
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

    togglByAnimationTag (tag) {
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
}


