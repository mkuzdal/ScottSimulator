var gravity = 10.0;

class rigidBody {
	constructor (_M, _r, _type) {
		this.mass = _M;
		this.inv_mass = 1 / this.mass;
		this.restitution = 0.7;
		this.type = _type || "static";
		this.frictionStatic = 10.0;
		this.frictionDynamic = 10.0;

		this.velocity = vec3.fromValues (0.0, 0.0, 0.0);
		if (this.type == "dynamic") {
			this.force = vec3.fromValues (0.0, -gravity * this.mass, 0.0);
		} else {
			this.force = vec3.create ();
		}

		this.force = vec3.create ();

		this.omega = vec3.fromValues (0.0, 0.0, 0.0);
		this.torque = vec3.fromValues (0.0, 0.0, 0.0);

		this.I = this.mass * _r * _r;
		this.inv_I = 1 / this.I;
		this.collisionPoint = null;
	}

	update (dTime) {
		if (this.type != "static") {
			var dt = dTime
			vec3.scaleAndAdd (this.velocity, this.velocity, this.force, dt * this.inv_mass);
			vec3.scaleAndAdd (this.object.transform.position, this.object.transform.position, this.velocity, dt);

			if (this.collisionPoint) {
				//var r = vec3.create ();
				//vec3.sub (r, this.collisionPoint, this.object.collider.currentCenter);
				//var T = vec3.create ();
				//vec3.cross (T, r, vec3.fromValues (0.0, gravity * this.mass, 0.0));
				//vec3.scaleAndAdd (this.omega, this.omega, T, dt * this.inv_I);
			} 

			vec3.scaleAndAdd (this.omega, this.omega, this.torque, dt * this.inv_I);
			var rotation = quat.create ();
			var angularVel = Math.sqrt (this.omega[0] * this.omega[0] + this.omega[1] * this.omega[1] + this.omega[2] * this.omega[2]);
			var axisOfRot = vec3.create ();
			if (angularVel > 0)
				vec3.scale (axisOfRot, this.omega, 1 / angularVel);
			else 
				axisOfRot = vec3.clone (this.omega);

			console.log (axisOfRot);

			quat.setAxisAngle (rotation, axisOfRot, angularVel * dt);
			quat.mul (this.object.transform.rotation, this.object.transform.rotation, rotation);

			this.collisionPoint = null;
		}
	}

	addForce (F) {
		vec3.add (this.force, this.force, F);
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
			vec3.negate (manifold.normal, manifold.normal);
		}

		var percent = 1.0;
  		vec3.scaleAndAdd (object1.transform.position, object1.transform.position, manifold.normal, percent * manifold.penetrationDistance);

		var dv = project (object1.rigidBody.velocity, manifold.normal);
		vec3.scaleAndAdd (object1.rigidBody.velocity, object1.rigidBody.velocity, dv, -2 * object1.rigidBody.restitution);

		object1.rigidBody.collisionPoint = manifold.collisionPoint;

		var rv = vec3.create ();
  		vec3.sub (rv, object2.rigidBody.velocity, object1.rigidBody.velocity);

		var velAlongNormal = vec3.dot (rv, manifold.normal);

  		var e = object1.rigidBody.restitution;

  		var j = -(1 + e) * velAlongNormal;

		var ratio = 1 / (object1.rigidBody.inv_mass + object2.rigidBody.inv_mass);

		var storage = vec3.create ();
		var tangentVelocity = vec3.create ();
		vec3.sub (tangentVelocity, rv, vec3.scale (storage, manifold.normal, vec3.dot (rv, manifold.normal)));
		vec3.normalize (tangentVelocity, tangentVelocity);

		var jt = -vec3.dot (rv, tangentVelocity);
		jt = jt * ratio;
		var mu = Math.sqrt (object1.rigidBody.frictionStatic * object1.rigidBody.frictionStatic + object2.rigidBody.frictionStatic * object2.rigidBody.frictionStatic);

		var frictionImpulse = vec3.create ();
		if (Math.abs (jt) < j * mu)
			vec3.scale (frictionImpulse, tangentVelocity, jt);
		else {
			var dynamicFriction = Math.sqrt (object1.rigidBody.frictionDynamic * object1.rigidBody.frictionDynamic + object2.rigidBody.frictionDynamic * object2.rigidBody.frictionDynamic);
			vec3.scale (frictionImpulse, tangentVelocity, -j * dynamicFriction);
		}

		//var contactVector = vec3.create ();
		//vec3.cross (contactVector, manifold.normal, frictionImpulse);

		vec3.scaleAndAdd (object1.rigidBody.velocity, object1.rigidBody.velocity, frictionImpulse, -object1.rigidBody.inv_mass);
		//vec3.scaleAndAdd (object1.rigidBody.omega, object1.rigidBody.omega, contactVector, object1.rigidBody.inv_I);

	} else if (object1.rigidBody.type == "dynamic" && object2.rigidBody.type == "dynamic") {
		var percent = 1.0 
  		var correction = vec3.create ();
  		vec3.scale (correction, manifold.normal, manifold.penetrationDistance * percent / (object1.rigidBody.inv_mass + object2.rigidBody.inv_mass));
  		vec3.scaleAndAdd (object1.transform.position, object1.transform.position, correction, object1.rigidBody.inv_mass);
  		vec3.scaleAndAdd (object2.transform.position, object2.transform.position, correction, -object2.rigidBody.inv_mass);

		// Calculate relative velocity
  		var rv = vec3.create ();
  		vec3.sub (rv, object2.rigidBody.velocity, object1.rigidBody.velocity);

 
  		// Calculate relative velocity in terms of the normal direction
  		var velAlongNormal = vec3.dot (rv, manifold.normal);
 
		// Calculate restitution
		var e = Math.min (object1.rigidBody.restitution, object2.rigidBody.restitution);
		 
		// Calculate impulse scalar
		var j = -(1 + e) * velAlongNormal;

		// Get the rotational inertia
		var r1 = vec3.create ();
		vec3.sub (r1, manifold.collisionPoint, object1.collider.center);

		var r2 = vec3.create ();
		vec3.sub (r2, manifold.collisionPoint, object2.collider.center);

		var cross1 = vec3.create ();
		vec3.cross (cross1, r1, manifold.normal);

		var cross2 = vec3.create ();
		vec3.cross (cross2, r2, manifold.normal);

		var angularInertia1 = vec3.squaredLength (cross1) * object1.rigidBody.inv_I;
		var angularInertia2 = vec3.squaredLength (cross2) * object2.rigidBody.inv_I;

		var ratio = 1 / (object1.rigidBody.inv_mass + object2.rigidBody.inv_mass + angularInertia1 + angularInertia2);

		j = j * ratio;
		var impulse = vec3.create ();
		vec3.scale (impulse, manifold.normal, j);

		var contactVector = vec3.create ();
		vec3.cross (contactVector, manifold.normal, impulse);

		// Apply impulse
		vec3.scaleAndAdd (object1.rigidBody.velocity, object1.rigidBody.velocity, impulse, -object1.rigidBody.inv_mass);
		vec3.scaleAndAdd (object2.rigidBody.velocity, object2.rigidBody.velocity, impulse, object2.rigidBody.inv_mass);
		//vec3.scaleAndAdd (object1.rigidBody.omega, object1.rigidBody.omega, contactVector, -object1.rigidBody.inv_I);
		//vec3.scaleAndAdd (object2.rigidBody.omega, object2.rigidBody.omega, contactVector, object2.rigidBody.inv_I);

		// Friction
		var storage = vec3.create ();
		var tangentVelocity = vec3.create ();
		vec3.sub (tangentVelocity, rv, vec3.scale (storage, manifold.normal, vec3.dot (rv, manifold.normal)));
		vec3.normalize (tangentVelocity, tangentVelocity);

		var jt = -vec3.dot (rv, tangentVelocity);
		jt = jt * ratio;
		var mu = Math.sqrt (object1.rigidBody.frictionStatic * object1.rigidBody.frictionStatic + object2.rigidBody.frictionStatic * object2.rigidBody.frictionStatic);

		var frictionImpulse = vec3.create ();
		if (Math.abs (jt) < j * mu)
			vec3.scale (frictionImpulse, tangentVelocity, jt);
		else {
			var dynamicFriction = Math.sqrt (object1.rigidBody.frictionDynamic * object1.rigidBody.frictionDynamic + object2.rigidBody.frictionDynamic * object2.rigidBody.frictionDynamic);
			vec3.scale (frictionImpulse, tangentVelocity, -j * dynamicFriction);
		}

		//vec3.cross (contactVector, manifold.normal, frictionImpulse);

		vec3.scaleAndAdd (object1.rigidBody.velocity, object1.rigidBody.velocity, frictionImpulse, -object1.rigidBody.inv_mass);
		vec3.scaleAndAdd (object2.rigidBody.velocity, object2.rigidBody.velocity, frictionImpulse, object2.rigidBody.inv_mass);
		//vec3.scaleAndAdd (object1.rigidBody.omega, object1.rigidBody.omega, contactVector, -object1.rigidBody.inv_I);
		//vec3.scaleAndAdd (object2.rigidBody.omega, object2.rigidBody.omega, contactVector, object2.rigidBody.inv_I);

	} 
}