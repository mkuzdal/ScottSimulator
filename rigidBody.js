class linearRigidBody {
	constructor (_object, _M, _restition) {
		this.object = _object;
		this.mass = _M;
		this.inv_mass = 1 / this.mass;
		this.restitution = _restition || 0.8;

		this.velocity = vec3.fromValues (0.0, 0.0, 0.0);
		this.force = vec3.fromValues (0.0, -1.0 * this.mass, 0.0);
	}

	update (dTime) {

		var dt = dTime
		vec3.scaleAndAdd (this.velocity, this.velocity, this.force, dt / this.mass);
		vec3.scaleAndAdd (this.position, this.position, this.velocity, dt);
		// f dt = m (vf - v0)
		// vf = f * dt / m + v0
		// xf - x0 = v dt
		// xf = v * dt + x0
	}

	resolveCollision (bodyA, bodyB) {
		//m1v1 + m2v2 = m1v1f + m2v2f
		//m1 (dv) = -m2 (dv)
	}
}

class angularRigidBody {
	constructor (_I, _CoM) {
		this.I = _I;
		this.CoM = _CoM;

		this.angularVelocity;
	}
}