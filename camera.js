

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
    constructor (_position, _yaw, _pitch, _sensitivity, _smoothness, _fovy, _aspect, _far, _near) {
        this.position = _position   || vec3.fromValues (0.0, 0.0, 15.0);
        this.yaw = _yaw 			|| 0.0;
        this.pitch = _pitch			|| 0.0;
        this.fovy = _fovy           || 50.0;
        this.aspect = _aspect       || canvas.width / canvas.height;
        this.far = _far             || 1000;
        this.near = _near           || 0.1;
        this.up = [0,1,0];
        this.sensitivity = _sensitivity || 0.2;
        this.smoothness = _smoothness || 10;

        this.rotation = quat.create();
        this.desRotation = quat.create();

        this.view = mat4.create ();
        this.perspectiveProjectionMatrix = mat4.create ();
        this.orthoProjectionMatrix = mat4.create ();

        var yawQuat = quat.create();
        var pitchQuat = quat.create();
        quat.setAxisAngle(yawQuat, this.up, this.yaw);
        quat.setAxisAngle(pitchQuat, [1,0,0], this.pitch);
        quat.mul(this.desRotation, yawQuat, pitchQuat);
        quat.normalize(this.desRotation, this.desRotation);
        this.rotation = quat.clone(this.desRotation);

        this.updatePerspective ();
        this.updateOrthographic ();
        this.updateCameraMatrix ();
    }

    /** updatePerspective: sets the perspective projection matrix.
     */
    updatePerspective () {
        mat4.perspective (this.perspectiveProjectionMatrix, Math.PI * this.fovy / 180, this.aspect, this.near, this.far);
    }

    /** updateOrthographic: sets the orthographic projection matrix.
     */
    updateOrthographic () {
        mat4.ortho (this.orthoProjectionMatrix, -this.aspect, this.aspect, -1.0, 1.0, -1.0, 1.0);
    }

    /** updateRotation: updates the camera rotations with a slerp
     */
    updateRotation (dTime) {
	    var yawQuat = quat.create();
		var pitchQuat = quat.create();
		quat.setAxisAngle(yawQuat, this.up, this.yaw);
		quat.setAxisAngle(pitchQuat, [1,0,0], this.pitch);
		quat.mul(this.desRotation, yawQuat, pitchQuat);
		quat.normalize(this.desRotation, this.desRotation);
		quat.slerp(this.rotation, this.rotation, this.desRotation, dTime * this.smoothness);

        this.updateCameraMatrix ();
    }

    /** updateCameraMatrix: sets the camera view matrix.
     */
    updateCameraMatrix () {
        mat4.fromRotationTranslation (this.view, this.rotation, this.position);
        mat4.invert (this.view, this.view);
    }

    /** camMoveForward: moves the camera in the forwards direction by 'speed' many units.
     */
    camMoveForward (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);
            
        var direction = vec3.fromValues (-storage[8], -storage[9], -storage[10]);
        vec3.scale (direction, direction, speed);

        vec3.add (this.position, this.position, direction);
        //console.log (this.position);
    }

    /** camMoveBackward: moves the camera in the backwards direction by 'speed' many units.
     */
    camMoveBackward (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);
            
        var direction = vec3.fromValues (storage[8], storage[9], storage[10]);
        vec3.scale (direction, direction, speed);

        vec3.add (this.position, this.position, direction);
    }

    /** camMoveLeft: moves the camera in the left direction by 'speed' many units
     */
    camMoveLeft (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);
            
        var direction = vec3.fromValues (-storage[0], -storage[1], -storage[2]);
        vec3.scale (direction, direction, speed);

  		vec3.add (this.position, this.position, direction);
    }

    /** camMoveRight: moves the camera in the right direction by 'speed' many units
     */
    camMoveRight (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.rotation);
            
        var direction = vec3.fromValues (storage[0], storage[1], storage[2]);
        vec3.scale (direction, direction, speed);

  		vec3.add (this.position, this.position, direction);
    }

    /** camMoveUp: moves the camera in the upwards direction by 'speed' many units
     */
    camMoveUp (speed) {
        var direction = vec3.fromValues (0.0, speed, 0.0);

        vec3.add (this.position, this.position, direction);
    }

    /** camMoveDown: moves the camera in the downwards direction by 'speed' many units
     */
    camMoveDown (speed) {
        var direction = vec3.fromValues (0.0, -speed, 0.0);

        vec3.add (this.position, this.position, direction);
    }

    mouseLook (deltaX, deltaY) {
	   this.yaw += glMatrix.toRadian(-deltaX * this.sensitivity);
	   this.pitch += glMatrix.toRadian(-deltaY * this.sensitivity);
	   if (this.pitch > glMatrix.toRadian(90))
		  this.pitch = glMatrix.toRadian(90);
	   if (this.pitch < glMatrix.toRadian(-90))
		  this.pitch = glMatrix.toRadian(-90);
    }
}
