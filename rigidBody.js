var gravity = 10.0;
var THRESHHOLD = 0.15;

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
		this.frictionStatic = 0.5;
		this.frictionDynamic = 0.2;

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

            if (this.type == "dynamic") {
                this.force = vec3.fromValues (0.0, -gravity * this.mass, 0.0);
            } else {
                this.force = vec3.fromValues (0.0, 0.0, 0.0);
            }
            this.torque = vec3.fromValues (0.0, 0.0, 0.0);
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

function resolveCollision (object1, object2, manifold) {
	if (object1.rigidBody == null || object2.rigidBody == null)
		return;
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

  		var padot = object1.rigidBody.pointVelocity (manifold.collisionPoint);
  		var pbdot = object2.rigidBody.pointVelocity (manifold.collisionPoint);
  		var n = manifold.normal;
  		var ra = vec3.create ();
  		var rb = vec3.create ();
  		vec3.sub (ra, manifold.collisionPoint, object1.collider.currentCenter);
  		vec3.sub (rb, manifold.collisionPoint, object2.collider.currentCenter);

  		var vrel = vec3.create ();
  		vec3.sub (vrel, padot, pbdot);

  		var vrelNormal = vec3.dot (n, vrel);

        if (object1.tag == "player") {
            object1.rigidBody.force = vec3.fromValues (0.0, 0.0, 0.0);
            object1.rigidBody.P = vec3.fromValues (0.0, 0.0, 0.0);
            object1.rigidBody.velocity = vec3.fromValues (0.0, 0.0, 0.0);
        }  

  		if (vrelNormal > THRESHHOLD) {
  			return;
  		}
  		if (vrelNormal > -THRESHHOLD) {
  			//collisionManager.collisions.push (manifold);
  			return;
  		}  

  		var epsilon = Math.min (object1.rigidBody.restitution, object2.rigidBody.restitution);
  		var numerator = -(1 + epsilon) * vrelNormal;

  		var term1 = object1.rigidBody.inv_mass;
  		var term2 = object2.rigidBody.inv_mass;
  		var storage = vec3.create ();
  		vec3.cross (storage, ra, n);
  		vec3.transformMat3 (storage, storage, object1.rigidBody.inv_I);
  		vec3.cross (storage, storage, ra);
  		var term3 = vec3.dot (n, storage);
  		storage = vec3.create ();
  		vec3.cross (storage, rb, n);
  		vec3.transformMat3 (storage, storage, object2.rigidBody.inv_I);
  		vec3.cross (storage, storage, rb);
  		var term4 = vec3.dot (n, storage);
  		var ratio = 1 / (term1 + term2 + term3 + term4);

  		var j = numerator * ratio;
  		var impulse = vec3.create ();
  		vec3.scale (impulse, n, j);

  		vec3.add (object1.rigidBody.P, object1.rigidBody.P, impulse);
  		vec3.sub (object2.rigidBody.P, object2.rigidBody.P, impulse);

  		var angularImpulse1 = vec3.create ();
  		var angularImpulse2 = vec3.create ();
  		vec3.cross (angularImpulse1, ra, impulse);
  		vec3.cross (angularImpulse2, rb, impulse);

  		vec3.add (object1.rigidBody.L, object1.rigidBody.L, angularImpulse1);
    	vec3.sub (object2.rigidBody.L, object2.rigidBody.L, angularImpulse2);

    	// friction:	
    	var tangent = vec3.create ();
    	vec3.sub (tangent, vrel, vec3.scale (storage, manifold.normal, vec3.dot (vrel, manifold.normal)));
    	vec3.normalize (tangent, tangent);
    	var jt = -vec3.dot (vrel, tangent);

    	jt = jt * ratio;
    	var mu = Math.sqrt (object1.rigidBody.frictionStatic * object1.rigidBody.frictionStatic + object2.rigidBody.frictionStatic * object2.rigidBody.frictionStatic);
    	var frictionImpulse = vec3.create ();
    	if (Math.abs (jt) < j * mu) {
    		vec3.scale (frictionImpulse, tangent, jt);
    	} else {
    		dynamicFriction = Math.sqrt (object1.rigidBody.frictionDynamic * object1.rigidBody.frictionDynamic + object2.rigidBody.frictionDynamic * object2.rigidBody.frictionDynamic);
    		vec3.scale (frictionImpulse, tangent, -j * dynamicFriction);
    	}

    	vec3.add (object1.rigidBody.P, object1.rigidBody.P, frictionImpulse);
  		vec3.sub (object2.rigidBody.P, object2.rigidBody.P, frictionImpulse);   

	} else if (object1.rigidBody.type == "dynamic" && object2.rigidBody.type == "dynamic") {
		object1 = manifold.vertexBody;
		object2 = manifold.faceBody;

		var percent = 0.8; 
  		var correction = vec3.create ();
  		vec3.scale (correction, manifold.normal, manifold.penetrationDistance * percent / (object1.rigidBody.inv_mass + object2.rigidBody.inv_mass));
  		vec3.scaleAndAdd (object1.transform.position, object1.transform.position, correction, object1.rigidBody.inv_mass);
  		vec3.scaleAndAdd (object2.transform.position, object2.transform.position, correction, -object2.rigidBody.inv_mass);

  		var padot = object1.rigidBody.pointVelocity (manifold.collisionPoint);
  		var pbdot = object2.rigidBody.pointVelocity (manifold.collisionPoint);
  		var n = manifold.normal;
  		var ra = vec3.create ();
  		var rb = vec3.create ();
  		vec3.sub (ra, manifold.collisionPoint, object1.collider.currentCenter);
  		vec3.sub (rb, manifold.collisionPoint, object2.collider.currentCenter);

  		var vrel = vec3.create ();
  		vec3.sub (vrel, padot, pbdot);

  		var vrelNormal = vec3.dot (n, vrel);

  		if (vrel > THRESHHOLD) {
  			return;
  		}
  		if (vrel > -THRESHHOLD) {
  			//collisionManager.collisions.push (manifold);
  			return;
  		}

  		var epsilon = Math.min (object1.rigidBody.restitution, object2.rigidBody.restitution);
  		var numerator = -(1 + epsilon) * vrelNormal;

  		var term1 = object1.rigidBody.inv_mass;
  		var term2 = object2.rigidBody.inv_mass;
  		var storage = vec3.create ();
  		vec3.cross (storage, ra, n);
  		vec3.transformMat3 (storage, storage, object1.rigidBody.inv_I);
  		vec3.cross (storage, storage, ra);
  		var term3 = vec3.dot (n, storage);
  		storage = vec3.create ();
  		vec3.cross (storage, rb, n);
  		vec3.transformMat3 (storage, storage, object2.rigidBody.inv_I);
  		vec3.cross (storage, storage, rb);
  		var term4 = vec3.dot (n, storage);
  		var ratio = 1 / (term1 + term2 + term3 + term4);

  		var j = numerator * ratio;
  		var impulse = vec3.create ();
  		vec3.scale (impulse, n, j);

  		vec3.add (object1.rigidBody.P, object1.rigidBody.P, impulse);
  		vec3.sub (object2.rigidBody.P, object2.rigidBody.P, impulse);

  		var angularImpulse1 = vec3.create ();
  		var angularImpulse2 = vec3.create ();
  		vec3.cross (angularImpulse1, ra, impulse);
  		vec3.cross (angularImpulse2, rb, impulse);

  		vec3.add (object1.rigidBody.L, object1.rigidBody.L, angularImpulse1);
    	vec3.sub (object2.rigidBody.L, object2.rigidBody.L, angularImpulse2);
   
    	// friction:
    	var tangent = vec3.create ();
    	vec3.sub (tangent, vrel, vec3.scale (storage, manifold.normal, vec3.dot (vrel, manifold.normal)));
    	vec3.normalize (tangent, tangent);

    	var jt = -vec3.dot (vrel, tangent);
    	jt = jt * ratio;

    	var mu = Math.sqrt (object1.rigidBody.frictionStatic * object1.rigidBody.frictionStatic + object2.rigidBody.frictionStatic * object2.rigidBody.frictionStatic);
    	var frictionImpulse = vec3.create ();
    	if (Math.abs (jt) < j * mu) {
    		vec3.scale (frictionImpulse, tangent, jt);
    	} else {
    		dynamicFriction = Math.sqrt (object1.rigidBody.frictionDynamic * object1.rigidBody.frictionDynamic + object2.rigidBody.frictionDynamic * object2.rigidBody.frictionDynamic);
    		vec3.scale (frictionImpulse, tangent, -j * dynamicFriction);
    	}

    	vec3.add (object1.rigidBody.P, object1.rigidBody.P, frictionImpulse);
  		vec3.sub (object2.rigidBody.P, object2.rigidBody.P, frictionImpulse);

  		var angularFrictionImpulse1 = vec3.create ();
  		var angularFrictionImpulse2 = vec3.create ();
  		vec3.cross (angularFrictionImpulse1, ra, frictionImpulse);
  		vec3.cross (angularFrictionImpulse2, rb, frictionImpulse);

  		vec3.add (object1.rigidBody.L, object1.rigidBody.L, angularFrictionImpulse1);
    	vec3.sub (object2.rigidBody.L, object2.rigidBody.L, angularFrictionImpulse2);  
	} 
}






