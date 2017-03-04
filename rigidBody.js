var gravity = 10.0;

class rigidBody {
	constructor (_M, _type) {
		this.mass = _M;
		this.inv_mass = 1 / this.mass;
		this.restitution = 0.7;
		this.type = _type || "static";
		this.frictionStatic = 1.6;
		this.frictionDynamic = 0.8;

		this.velocity = vec3.fromValues (0.0, 0.0, 0.0);
		this.omega = vec3.fromValues (0.0, 0.0, 0.0);

		if (this.type == "dynamic") {
			this.force = vec3.fromValues (0.0, -gravity * this.mass, 0.0);
		} else {
			this.force = vec3.create ();
		}

		this.torque = vec3.fromValues (0.0, 0.0, 0.0);
	}

	update (dTime) {
		if (this.type != "static") {
			var dt = dTime
			vec3.scaleAndAdd (this.velocity, this.velocity, this.force, dt / this.mass);
			vec3.scaleAndAdd (this.object.transform.position, this.object.transform.position, this.velocity, dt);
		}
	}

	addForce (F) {
		vec3.add (this.force, this.force, F);
	}

	addTorque (T) {

	}

	addForceAtPoint (F) {

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
			vec3.negate (manifold.normal, manifold.normal)
		}
		var percent = 1.0 // usually 20% to 80%
  		var correction = vec3.create ();
  		vec3.scale (correction, manifold.normal, manifold.penetrationDistance * percent / (object1.rigidBody.inv_mass + object2.rigidBody.inv_mass));
  		vec3.scaleAndAdd (object1.transform.position, object1.transform.position, correction, object1.rigidBody.inv_mass);

		var dv = project (object1.rigidBody.velocity, manifold.normal);
		vec3.scaleAndAdd (object1.rigidBody.velocity, object1.rigidBody.velocity, dv, -2 * object1.rigidBody.restitution);

		// Friction
		var rv = vec3.create ();
  		vec3.sub (rv, object2.rigidBody.velocity, object1.rigidBody.velocity);

		var velAlongNormal = vec3.dot (rv, manifold.normal);

  		var e = object1.rigidBody.restitution;

  		var j = -(1 + e) * velAlongNormal;

		var storage = vec3.create ();
		var tangentVelocity = vec3.create ();
		vec3.sub (tangentVelocity, rv, vec3.scale (storage, manifold.normal, vec3.dot (rv, manifold.normal)));
		vec3.normalize (tangentVelocity, tangentVelocity);

		var jt = -vec3.dot (rv, tangentVelocity);
		jt = jt / (object1.rigidBody.inv_mass + object2.rigidBody.inv_mass);
		var mu = Math.sqrt (object1.rigidBody.frictionStatic * object1.rigidBody.frictionStatic + object2.rigidBody.frictionStatic * object2.rigidBody.frictionStatic);

		var frictionImpulse = vec3.create ();
		if (Math.abs (jt) < j * mu)
			vec3.scale (frictionImpulse, tangentVelocity, jt);
		else {
			var dynamicFriction = Math.sqrt (object1.rigidBody.frictionDynamic * object1.rigidBody.frictionDynamic + object2.rigidBody.frictionDynamic * object2.rigidBody.frictionDynamic);
			vec3.scale (frictionImpulse, tangentVelocity, -j * dynamicFriction);
		}
		vec3.scaleAndAdd (object1.rigidBody.velocity, object1.rigidBody.velocity, frictionImpulse, -object1.rigidBody.inv_mass);

	} else if (object1.rigidBody.type == "dynamic" && object2.rigidBody.type == "dynamic") {
		//vec3.scaleAndAdd (object1.transform.position, object1.transform.position, manifold.normal, manifold.penetrationDistance);
		//vec3.scaleAndAdd (object2.transform.position, object2.transform.position, manifold.normal, -manifold.penetrationDistance);

		var percent = 1.0 // usually 20% to 80%
  		var correction = vec3.create ();
  		vec3.scale (correction, manifold.normal, manifold.penetrationDistance * percent / (object1.rigidBody.inv_mass + object2.rigidBody.inv_mass));
  		vec3.scaleAndAdd (object1.transform.position, object1.transform.position, correction, object1.rigidBody.inv_mass);
  		vec3.scaleAndAdd (object2.transform.position, object2.transform.position, correction, -object2.rigidBody.inv_mass);

		// Calculate relative velocity
  		var rv = vec3.create ();
  		vec3.sub (rv, object2.rigidBody.velocity, object1.rigidBody.velocity);
 
  		// Calculate relative velocity in terms of the normal direction
  		var velAlongNormal = vec3.dot (rv, manifold.normal);
 
 		// Do not resolve if velocities are separating
  		//if (velAlongNormal > 0)
    	//	return;
 
		// Calculate restitution
		var e = Math.min (object1.rigidBody.restitution, object2.rigidBody.restitution);
		 
		// Calculate impulse scalar
		var j = -(1 + e) * velAlongNormal;
		var impulse = vec3.create ();
		vec3.scale (impulse, manifold.normal, j);

		// Apply impulse
		var mass_sum = object1.rigidBody.mass + object2.rigidBody.mass;

		var ratio = object1.rigidBody.mass / mass_sum;
		vec3.scaleAndAdd (object1.rigidBody.velocity, object1.rigidBody.velocity, impulse, -ratio);

		ratio = object2.rigidBody.mass / mass_sum;
		vec3.scaleAndAdd (object2.rigidBody.velocity, object2.rigidBody.velocity, impulse, ratio);


		// Friction
		var storage = vec3.create ();
		var tangentVelocity = vec3.create ();
		vec3.sub (tangentVelocity, rv, vec3.scale (storage, manifold.normal, vec3.dot (rv, manifold.normal)));
		vec3.normalize (tangentVelocity, tangentVelocity);

		var jt = -vec3.dot (rv, tangentVelocity);
		jt = jt / (object1.rigidBody.inv_mass + object2.rigidBody.inv_mass);
		var mu = Math.sqrt (object1.rigidBody.frictionStatic * object1.rigidBody.frictionStatic + object2.rigidBody.frictionStatic * object2.rigidBody.frictionStatic);

		var frictionImpulse = vec3.create ();
		if (Math.abs (jt) < j * mu)
			vec3.scale (frictionImpulse, tangentVelocity, jt);
		else {
			var dynamicFriction = Math.sqrt (object1.rigidBody.frictionDynamic * object1.rigidBody.frictionDynamic + object2.rigidBody.frictionDynamic * object2.rigidBody.frictionDynamic);
			vec3.scale (frictionImpulse, tangentVelocity, -j * dynamicFriction);
		}

		vec3.scaleAndAdd (object1.rigidBody.velocity, object1.rigidBody.velocity, frictionImpulse, -object1.rigidBody.inv_mass);
		vec3.scaleAndAdd (object2.rigidBody.velocity, object2.rigidBody.velocity, frictionImpulse, object2.rigidBody.inv_mass);
	} 
}