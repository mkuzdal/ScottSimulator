
class PlayerController {
	constructor (_player) {
		this.player = _player;
        this.camera = _player.camera;

        this.jumpForce = vec3.fromValues (0.0, 5000.0, 0.0);

        this.movingforward = false;
        this.movingbackward = false;
        this.movingleft = false;
        this.movingright = false;
        this.movingup = false;
        this.movingdown = false;

        this.jumping = false;
	}

    /** moveForward: moves the player in the forwards direction by 'speed' many units.
     */
    moveForward (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.camera.rotation);
            
        var direction = vec3.fromValues (-storage[8], -storage[9], -storage[10]);
        vec3.scale (direction, direction, speed);
        direction = vec3.fromValues (direction[0], 0.0, direction[2]);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveBackward: moves the player in the backwards direction by 'speed' many units.
     */
    moveBackward (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.camera.rotation);
            
        var direction = vec3.fromValues (storage[8], storage[9], storage[10]);
        vec3.scale (direction, direction, speed);
        direction = vec3.fromValues (direction[0], 0.0, direction[2]);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveLeft: moves the player in the left direction by 'speed' many units
     */
    moveLeft (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.camera.rotation);
            
        var direction = vec3.fromValues (-storage[0], -storage[1], -storage[2]);
        vec3.scale (direction, direction, speed);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveRight: moves the player in the right direction by 'speed' many units
     */
    moveRight (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.camera.rotation);
            
        var direction = vec3.fromValues (storage[0], storage[1], storage[2]);
        vec3.scale (direction, direction, speed);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveUp: moves the player in the upwards direction by 'speed' many units
     */
    moveUp (speed) {
        var direction = vec3.fromValues (0.0, speed, 0.0);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveDown: moves the player in the downwards direction by 'speed' many units
     */
    moveDown (speed) {
        var direction = vec3.fromValues (0.0, -speed, 0.0);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    jump () {
        if (!this.jumping) {
            this.player.rigidBody.P = vec3.fromValues (0.0, 10 * this.player.rigidBody.mass, 0.0);
            this.jumping = true;
        } 
    }
}

class PlayerControllerFly {
    constructor (_player) {
        this.player = _player;
        this.camera = _player.camera;

        this.movingforward = false;
        this.movingbackward = false;
        this.movingleft = false;
        this.movingright = false;
        this.movingup = false;
        this.movingdown = false;
    }

    /** moveForward: moves the player in the forwards direction by 'speed' many units.
     */
    moveForward (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.camera.rotation);
            
        var direction = vec3.fromValues (-storage[8], -storage[9], -storage[10]);
        vec3.scale (direction, direction, speed);
        direction = vec3.fromValues (direction[0], 0.0, direction[2]);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveBackward: moves the player in the backwards direction by 'speed' many units.
     */
    moveBackward (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.camera.rotation);
            
        var direction = vec3.fromValues (storage[8], storage[9], storage[10]);
        vec3.scale (direction, direction, speed);
        direction = vec3.fromValues (direction[0], 0.0, direction[2]);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveLeft: moves the player in the left direction by 'speed' many units
     */
    moveLeft (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.camera.rotation);
            
        var direction = vec3.fromValues (-storage[0], -storage[1], -storage[2]);
        vec3.scale (direction, direction, speed);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveRight: moves the player in the right direction by 'speed' many units
     */
    moveRight (speed) {
        var storage = mat4.create ();
        mat4.fromQuat (storage, this.camera.rotation);
            
        var direction = vec3.fromValues (storage[0], storage[1], storage[2]);
        vec3.scale (direction, direction, speed);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveUp: moves the player in the upwards direction by 'speed' many units
     */
    moveUp (speed) {
        var direction = vec3.fromValues (0.0, speed, 0.0);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    /** moveDown: moves the player in the downwards direction by 'speed' many units
     */
    moveDown (speed) {
        var direction = vec3.fromValues (0.0, -speed, 0.0);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }

    jump (speed) {
        var direction = vec3.fromValues (0.0, speed, 0.0);

        vec3.add (this.player.transform.position, this.player.transform.position, direction);
    }
}

class PlayerControllerSurvival {
    constructor (_player) {
        this.player = _player;
        this.camera = _player.camera;

        this.health = 10;
        this.score = 0;

        this.movingforward = false;
        this.movingbackward = false;
        this.movingleft = false;
        this.movingright = false;
        this.movingup = false;
        this.movingdown = false;

        this.jumping = false;
    }

    /** moveForward: moves the player in the forwards direction by 'speed' many units.
     */
    moveForward (speed) {
        if (this.health > 0) {
            var storage = mat4.create ();
            mat4.fromQuat (storage, this.camera.rotation);
                
            var direction = vec3.fromValues (-storage[8], -storage[9], -storage[10]);
            vec3.scale (direction, direction, speed);
            direction = vec3.fromValues (direction[0], 0.0, direction[2]);

            vec3.add (this.player.transform.position, this.player.transform.position, direction);
        }
    }

    /** moveBackward: moves the player in the backwards direction by 'speed' many units.
     */
    moveBackward (speed) {
        if (this.health > 0) {
            var storage = mat4.create ();
            mat4.fromQuat (storage, this.camera.rotation);
                
            var direction = vec3.fromValues (storage[8], storage[9], storage[10]);
            vec3.scale (direction, direction, speed);
            direction = vec3.fromValues (direction[0], 0.0, direction[2]);

            vec3.add (this.player.transform.position, this.player.transform.position, direction);
        }
    }

    /** moveLeft: moves the player in the left direction by 'speed' many units
     */
    moveLeft (speed) {
        if (this.health > 0) {
            var storage = mat4.create ();
            mat4.fromQuat (storage, this.camera.rotation);
                
            var direction = vec3.fromValues (-storage[0], -storage[1], -storage[2]);
            vec3.scale (direction, direction, speed);

            vec3.add (this.player.transform.position, this.player.transform.position, direction);
        }
    }

    /** moveRight: moves the player in the right direction by 'speed' many units
     */
    moveRight (speed) {
        if (this.health > 0) {
            var storage = mat4.create ();
            mat4.fromQuat (storage, this.camera.rotation);
                
            var direction = vec3.fromValues (storage[0], storage[1], storage[2]);
            vec3.scale (direction, direction, speed);

            vec3.add (this.player.transform.position, this.player.transform.position, direction);
        }
    }

    /** moveUp: moves the player in the upwards direction by 'speed' many units
     */
    moveUp (speed) {
        if (this.health > 0) {
            var direction = vec3.fromValues (0.0, speed, 0.0);

            vec3.add (this.player.transform.position, this.player.transform.position, direction);
        }
    }

    /** moveDown: moves the player in the downwards direction by 'speed' many units
     */
    moveDown (speed) {
        if (this.health > 0) {
            var direction = vec3.fromValues (0.0, -speed, 0.0);

            vec3.add (this.player.transform.position, this.player.transform.position, direction);
        }
    }

    jump () {
        if (!this.jumping && this.health > 0) {
            this.player.rigidBody.P = vec3.fromValues (0.0, 10 * this.player.rigidBody.mass, 0.0);
            this.jumping = true;
        } 
    }
}

