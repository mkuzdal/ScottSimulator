var gravity = 10.0;
var THRESHHOLD = 0.1;

class rigidBody {
	constructor (_M, _type) {
		this.type = _type || "static";

		this.mass = _M;
		this.inv_mass = 1 / this.mass;
		this.Ibody = mat4.create ();
		this.inv_Ibody = mat4.create ();
		this.CoM = vec3.fromValues (0.0, 0.0, 0.0);

		if (this.type == "dynamic") {
			this.force = vec3.fromValues (0.0, -gravity * this.mass, 0.0);
		} else {
			this.force = vec3.fromValues (0.0, 0.0, 0.0);
		}

		this.torque = vec3.fromValues (0.0, 0.0, 0.0);

		this.velocity = vec3.create ();
		this.omega = vec3.create ();

		this.P = vec3.create ();
		this.L = vec3.create ();

		this.restitution = 0.8;
		this.frictionStatic = 1.5;
		this.frictionDynamic = 1.0;

		this.inv_I = mat3.clone (this.inv_Ibody);
		this.f = vec3.fromValues (0.0, 0.0, 0.0);
		this.t = vec3.fromValues (0.0, 0.0, 0.0);

		this.object = null;

		this.angularRigidBody = true;
	}

	update (dTime) {
		if (this.type != "static") {
			var dt = dTime;

			vec3.scaleAndAdd (this.P, this.P, this.force, dt);
            vec3.scaleAndAdd (this.P, this.P, this.f, dt);
			vec3.scale (this.velocity, this.P, this.inv_mass);
			vec3.scaleAndAdd (this.object.transform.position, this.object.transform.position, this.velocity, dt);
			
			var R = mat3.create ();
			var RT = mat3.create ();
			mat3.fromQuat (R, this.object.transform.rotation);
			mat3.transpose (RT, R);

			this.inv_I = mat3.create ();
			var storage = mat3.create ();
			mat3.mul (storage, this.inv_Ibody, RT);
			mat3.mul (this.inv_I, R, storage);

			vec3.scaleAndAdd (this.L, this.L, this.torque, dt);
			vec3.scaleAndAdd (this.L, this.L, this.t, dt);
			vec3.transformMat3 (this.omega, this.L, this.inv_I);

			vec3.lerp (this.P, this.P, vec3.fromValues (0.0, 0.0, 0.0), Math.min (1.0, dt * this.frictionDynamic));

			if (this.angularRigidBody) {
				var rotation = quat.create ();
				var angularVel = Math.sqrt (this.omega[0] * this.omega[0] + this.omega[1] * this.omega[1] + this.omega[2] * this.omega[2]);
				var axisOfRot = vec3.create ();
				if (angularVel > 0)
					vec3.scale (axisOfRot, this.omega, 1 / angularVel);
				else 
					axisOfRot = vec3.clone (this.omega);

				quat.setAxisAngle (rotation, axisOfRot, angularVel * dt);
				quat.mul (this.object.transform.rotation, rotation, this.object.transform.rotation);

				vec3.lerp (this.L, this.L, vec3.fromValues (0.0, 0.0, 0.0), Math.min (dt * this.frictionDynamic));
			}

            if (this.object.tag == "player") {
                this.force = vec3.fromValues (0.0, -gravity * this.mass, 0.0);
                this.torque = vec3.fromValues (0.0, 0.0, 0.0);
            }

            this.f = vec3.fromValues (0.0, 0.0, 0.0);
            this.t = vec3.fromValues (0.0, 0.0, 0.0);
		} 
	}

	addForce (F) {
		vec3.add (this.force, this.force, F);
	}

	addImpulse (F) {
		vec3.add (this.f, this.f, F);
	}

	addTorque (T) {
		vec3.add (this.torque, this.torque, T);
	}

	addForceAtPoint (F, P) {
		vec3.add (this.force, this.force, F);
		var r = vec3.create ();
		var3.sub (r, p, this.object.collider.center);
		var T = vec3.create ();
		vec3.cross (T, r, F);
		vec3.add (this.torque, this.torque, T);
	}

	pointVelocity (P) {
		var v_p = vec3.create ();
		var r = vec3.create ();
		var v = vec3.create ();
		vec3.sub (r, P, this.object.collider.currentCenter);
		vec3.cross (v_p, this.omega, r);
		vec3.add (v, this.velocity, v_p);
		return v;
	}
}






