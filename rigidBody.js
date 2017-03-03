class rigidBody {
	constructor (_M, _restition, _type) {
		this.mass = _M;
		this.inv_mass = 1 / this.mass;
		this.restitution = _restition || 0.8;
		this.type = _type || "static";

		this.velocity = vec3.fromValues (0.0, 0.0, 0.0);
		if (this.type == "dynamic")
			this.force = vec3.fromValues (0.0, -4.0 * this.mass, 0.0);
		else this.force = vec3.create ();

		this.object;
	}

	update (dTime) {
		var dt = dTime
		vec3.scaleAndAdd (this.object.transform.position, this.object.transform.position, this.velocity, dt);
		vec3.scaleAndAdd (this.velocity, this.velocity, this.force, dt / this.mass);
		// f dt = m (vf - v0)
		// vf = f * dt / m + v0
		// xf - x0 = v dt
		// xf = v * dt + x0
	}

	addForce (F) {
		vec3.add (this.force, this.force, F);
	}
}

class angularRigidBody {
	constructor (_I, _CoM) {
		this.I = _I;
		this.CoM = _CoM;

		this.angularVelocity;
	}
}

function resolveCollision (object1, object2, manifold) {
	if (object1.rigidBody == null || object2.rigidBody == null)
		return
	if (object1.rigidBody.type == "static" && object2.rigidBody.type == "static")
		return;
	else if ((object1.rigidBody.type == "static" && object2.rigidBody.type == "dynamic") ||
			 (object1.rigidBody.type == "dynamic" && object2.rigidBody.type == "static")) {
		if (object1.rigidBody.type == "static") {
			var temp = object2;
			object2 = object1;
			object1 = temp;
		}

		vec3.scaleAndAdd (object1.transform.position, object1.transform.position, manifold.normal, manifold.penetrationDistance);
		vec3.scale (object1.rigidBody.velocity, object1.rigidBody.velocity, -object1.rigidBody.restitution);
		return;
	} else if (object1.rigidBody.type == "dynamic" && object2.rigidBody.type == "dynamic") {

	} 
}