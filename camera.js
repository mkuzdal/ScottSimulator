

/** Camera Object: An abstraction for the camera object where given a position, rotation,
 *  field of view, aspect ratio, and far and near clipping planes, the camera can render images to
 *  the screen. The camera was implemented using a quaternion navigation system. 
 */
class camera {
    /** constructor: builds an instance of an object with given attributes.
     *  @param { vec3 } position: the default position of the camera.
     *  @param { vec4 } rotation: the default rotation of the camera.
     *  @param { float } speed: the speed of the camera movement and rotation.
     *  @param { float } fovy: the field of view for the camera.
     *  @param { float } aspect: the aspect ratio for the camera.
     *  @param { float } far: the far clipping plane.
     *  @param { float } near: the near clipping place.
     */
    constructor (_position, _rotation, _speed, _fovy, _aspect, _far, _near) {
        this.position = _position   || vec3.fromValues (0.0, 0.0, 15.0);
        this.rotation = _rotation   || quat.create ();
        this.speed = _speed         || 1.0;
        this.fovy = _fovy           || 50.0;
        this.aspect = _aspect       || canvas.width / canvas.height;
        this.far = _far             || 1000.0;
        this.near = _near           || 0.0001;

        this.matrix = mat4.create ();
        this.perspectiveProjectionMatrix = mat4.create ();
        this.orthoProjectionMatrix = mat4.create ();

        this.setPerspective ();
        this.setOrthographic ();
        this.setCameraMatrix ();
    }

    /** setPerspective: sets the perspective projection matrix.
     */
    setPerspective () {
        mat4.perspective (this.perspectiveProjectionMatrix, Math.PI * this.fovy / 180, this.aspect, this.near, this.far);
    }

    /** setOrthographic: sets the orthographic projection matrix.
     */
    setOrthographic () {
        mat4.ortho (this.orthoProjectionMatrix, -this.aspect, this.aspect, -1.0, 1.0, -1.0, 1.0);
    }

    /** setCameraMatrix: sets the camera view matrix.
     */
    setCameraMatrix () {
        var storage = vec3.create ();
        mat4.fromRotationTranslation (this.matrix, this.rotation, this.position);
        mat4.invert (this.matrix, this.matrix);

        gl.uniform3fv (gl.getUniformLocation (program, "fCameraPosition"), this.position);
    }

    /** camMoveForward: moves the camera in the forwards direction by 'speed' many units.
     */
    camMoveForward () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);
            
        var direction = vec3.fromValues (-storage[8], -storage[9], -storage[10]);
        vec3.scale (direction, direction, this.speed);

        this.position = vec3.add (this.position, this.position, direction);

        console.log ("Position: " + this.position);
        this.setCameraMatrix ();
    }

    /** camMoveForward: moves the camera in the forwards direction by 'speed' many units.
     */
    camMoveBackwards () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);
            
        var direction = vec3.fromValues (storage[8], storage[9], storage[10]);
        vec3.scale (direction, direction, this.speed);

        this.position = vec3.add (this.position, this.position, direction);

        this.setCameraMatrix ();
    }

    /** camPitchUp: pitches the camera in the upwards direction by speed many units.
     */
    camPitchUp () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);

        var direction = vec3.fromValues (storage[0], storage[1], storage[2]);

        var q = quat.create ();
        quat.setAxisAngle (q, direction, this.speed * Math.PI / 180.0)
        quat.mul (this.rotation, this.rotation, q);

        this.setCameraMatrix ();
    }

    /** camPitchDown: pitches the camera in the downwards direction by speed many units.
     */
    camPitchDown () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);

        var direction = vec3.fromValues (storage[0], storage[1], storage[2]);

        var q = quat.create ();
        quat.setAxisAngle (q, direction, -this.speed * Math.PI / 180.0)
        quat.mul (this.rotation, this.rotation, q);

        this.setCameraMatrix ();
    }

    /** camYawLeft: yaws the camera to the left by speed many units.
     */
    camYawLeft () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);

        var direction = vec3.fromValues (storage[4], storage[5], storage[6]);

        var q = quat.create ();
        quat.setAxisAngle (q, direction, this.speed * Math.PI / 180.0)
        quat.mul (this.rotation, this.rotation, q);

        this.setCameraMatrix ();
    }

    /** camYawLeft: yaws the camera to the right by speed many units.
     */
    camYawRight () {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);

        var direction = vec3.fromValues (storage[4], storage[5], storage[6]);

        var q = quat.create ();
        quat.setAxisAngle (q, direction, -this.speed * Math.PI / 180.0)
        quat.mul (this.rotation, this.rotation, q);

        this.setCameraMatrix ();
    }

    /** camSetSpeed: sets the camera speed.
     *  @param: { float } speed: the speed to set the camera to.
     */
    camSetSpeed (speed) {
        this.speed = speed;
    }
}

/** camReset: resets the global camera to its default state.
 */
function camReset () {
    cam = new camera ();
}


