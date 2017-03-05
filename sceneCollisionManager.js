
var collisionManager;

class collisionManifold {
	constructor (_contact, _normal, _penetrationDistance, _center, _collisionPoint) {
		this.normal = _normal;
		this.penetrationDistance = _penetrationDistance;
		this.collisionPoint = _collisionPoint;
	}
}

class sceneCollisionManager {
	constructor () {
		this.objects = [];
	}

	detectCollision (collider1, collider2) {
		if (collider1.type == "box" && collider2.type == "box") {
			var penetrationNormal = vec3.create ();
			var penetrationDistance = 10000;
			var collisionPoint = vec3.fromValues (0.0, 0.0, 0.0);

			// axis 1
			var axis = vec3.create ();
			vec3.sub (axis, collider1.currentVertices[7], collider1.currentVertices[3]);

			var projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis)[0]);
			}
			var projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis)[0]);
			}

			var min1 = 1000000.0;
			var min2 = 1000000.0;
			var max1 = -1000000.0;
			var max2 = -1000000.0;
			var minPoint1 = [];
			var minPoint2 = [];
			var maxPoint1 = [];
			var maxPoint2 = [];

			for (var i = 0; i < projection_points1.length; i++) {
				if (projection_points1[i] <= min1) {
					if (projection_points1[i] == min1) {
						minPoint1.push (collider1.currentVertices[i]);
					} else {
						minPoint1 = [ collider1.currentVertices[i] ];
					}
					min1 = projection_points1[i];
				}
				if (projection_points1[i] >= max1) {
					if (projection_points1[i] == max1) {
						maxPoint1.push (collider1.currentVertices[i]);
					} else {
						maxPoint1 = [ collider1.currentVertices[i] ];
					}
					max1 = projection_points1[i];
				}
			}
			for (var i = 0; i < projection_points2.length; i++) {
				if (projection_points2[i] <= min2) {
					if (projection_points2[i] == min2) {
						minPoint2.push (collider2.currentVertices[i]);
					} else {
						minPoint2 = [ collider2.currentVertices[i] ];
					}
					min2 = projection_points2[i];
				}
				if (projection_points2[i] >= max2) {
					if (projection_points2[i] == max2) {
						maxPoint2.push (collider2.currentVertices[i]);
					} else {
						maxPoint2 = [ collider2.currentVertices[i] ];
					}
					max2 = projection_points2[i];
				}
			}

			if (min2 > max1 || max2 < min1) 
				return false;

			var v1 = max1 - min2;
			var v2 = max2 - min1;
			var d1 = Math.abs (v1);
			var d2 = Math.abs (v2);
			if (d1 < d2) {
				if (penetrationDistance > d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
				}
			} else {
				if (penetrationDistance > d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
				}
			}	

			// axis 2
			axis = vec3.create ();
			vec3.sub (axis, collider1.currentVertices[7], collider1.currentVertices[5]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis)[1]);
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis)[1]);
			}

			min1 = 1000000.0;
			min2 = 1000000.0;
			max1 = -1000000.0;
			max2 = -1000000.0;
			minPoint1 = [];
			minPoint2 = [];
			maxPoint1 = [];
			maxPoint2 = [];

			for (var i = 0; i < projection_points1.length; i++) {
				if (projection_points1[i] <= min1) {
					if (projection_points1[i] == min1) {
						minPoint1.push (collider1.currentVertices[i]);
					} else {
						minPoint1 = [ collider1.currentVertices[i] ];
					}
					min1 = projection_points1[i];

				}
				if (projection_points1[i] >= max1) {
					if (projection_points1[i] == max1) {
						maxPoint1.push (collider1.currentVertices[i]);
					} else {
						maxPoint1 = [ collider1.currentVertices[i] ];
					}
					max1 = projection_points1[i];
				}
			}
			for (var i = 0; i < projection_points2.length; i++) {
				if (projection_points2[i] <= min2) {
					if (projection_points2[i] == min2) {
						minPoint2.push (collider2.currentVertices[i]);
					} else {
						minPoint2 = [ collider2.currentVertices[i] ];
					}
					min2 = projection_points2[i];
				}
				if (projection_points2[i] >= max2) {
					if (projection_points2[i] == max2) {
						maxPoint2.push (collider2.currentVertices[i]);
					} else {
						maxPoint2 = [ collider2.currentVertices[i] ];
					}
					max2 = projection_points2[i];
				}
			}

			if (min2 > max1 || max2 < min1) 
				return false;

			var v1 = max1 - min2;
			var v2 = max2 - min1;
			var d1 = Math.abs (v1);
			var d2 = Math.abs (v2);
			if (d1 < d2) {
				if (penetrationDistance > d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
				}
			} else {
				if (penetrationDistance > d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
				}
			}	

			// axis 3
			axis = vec3.create ();
			vec3.sub (axis, collider1.currentVertices[7], collider1.currentVertices[6]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis)[2]);
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis)[2]);
			}

			min1 = 1000000.0;
			min2 = 1000000.0;
			max1 = -1000000.0;
			max2 = -1000000.0;
			minPoint1 = [];
			minPoint2 = [];
			maxPoint1 = [];
			maxPoint2 = [];

			for (var i = 0; i < projection_points1.length; i++) {
				if (projection_points1[i] <= min1) {
					if (projection_points1[i] == min1) {
						minPoint1.push (collider1.currentVertices[i]);
					} else {
						minPoint1 = [ collider1.currentVertices[i] ];
					}
					min1 = projection_points1[i];

				}
				if (projection_points1[i] >= max1) {
					if (projection_points1[i] == max1) {
						maxPoint1.push (collider1.currentVertices[i]);
					} else {
						maxPoint1 = [ collider1.currentVertices[i] ];
					}
					max1 = projection_points1[i];
				}
			}
			for (var i = 0; i < projection_points2.length; i++) {
				if (projection_points2[i] <= min2) {
					if (projection_points2[i] == min2) {
						minPoint2.push (collider2.currentVertices[i]);
					} else {
						minPoint2 = [ collider2.currentVertices[i] ];
					}
					min2 = projection_points2[i];
				}
				if (projection_points2[i] >= max2) {
					if (projection_points2[i] == max2) {
						maxPoint2.push (collider2.currentVertices[i]);
					} else {
						maxPoint2 = [ collider2.currentVertices[i] ];
					}
					max2 = projection_points2[i];
				}
			}

			if (min2 > max1 || max2 < min1)
				return false;

			v1 = max1 - min2;
			v2 = max2 - min1;
			d1 = Math.abs (v1);
			d2 = Math.abs (v2);
			if (d1 < d2) {
				if (penetrationDistance > d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
				}
			} else {
				if (penetrationDistance > d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
				}
			}

			// axis 4
			axis = vec3.create ();
			vec3.sub (axis, collider2.currentVertices[7], collider2.currentVertices[3]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis)[0]);
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis)[0]);
			}

			min1 = 1000000.0;
			min2 = 1000000.0;
			max1 = -1000000.0;
			max2 = -1000000.0;
			minPoint1 = [];
			minPoint2 = [];
			maxPoint1 = [];
			maxPoint2 = [];

			for (var i = 0; i < projection_points1.length; i++) {
				if (projection_points1[i] <= min1) {
					if (projection_points1[i] == min1) {
						minPoint1.push (collider1.currentVertices[i]);
					} else {
						minPoint1 = [ collider1.currentVertices[i] ];
					}
					min1 = projection_points1[i];

				}
				if (projection_points1[i] >= max1) {
					if (projection_points1[i] == max1) {
						maxPoint1.push (collider1.currentVertices[i]);
					} else {
						maxPoint1 = [ collider1.currentVertices[i] ];
					}
					max1 = projection_points1[i];
				}
			}
			for (var i = 0; i < projection_points2.length; i++) {
				if (projection_points2[i] <= min2) {
					if (projection_points2[i] == min2) {
						minPoint2.push (collider2.currentVertices[i]);
					} else {
						minPoint2 = [ collider2.currentVertices[i] ];
					}
					min2 = projection_points2[i];
				}
				if (projection_points2[i] >= max2) {
					if (projection_points2[i] == max2) {
						maxPoint2.push (collider2.currentVertices[i]);
					} else {
						maxPoint2 = [ collider2.currentVertices[i] ];
					}
					max2 = projection_points2[i];
				}
			}

			if (min2 > max1 || max2 < min1)
				return false;

			v1 = max1 - min2;
			v2 = max2 - min1;
			d1 = Math.abs (v1);
			d2 = Math.abs (v2);
			if (d1 < d2) {
				if (penetrationDistance > d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
				}
			} else {
				if (penetrationDistance > d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
				}
			}

			// axis 5
			axis = vec3.create ();
			vec3.sub (axis, collider2.currentVertices[7], collider2.currentVertices[5]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis)[1]);
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis)[1]);
			}

			min1 = 1000000.0;
			min2 = 1000000.0;
			max1 = -1000000.0;
			max2 = -1000000.0;
			minPoint1 = [];
			minPoint2 = [];
			maxPoint1 = [];
			maxPoint2 = [];

			for (var i = 0; i < projection_points1.length; i++) {
				if (projection_points1[i] <= min1) {
					if (projection_points1[i] == min1) {
						minPoint1.push (collider1.currentVertices[i]);
					} else {
						minPoint1 = [ collider1.currentVertices[i] ];
					}
					min1 = projection_points1[i];

				}
				if (projection_points1[i] >= max1) {
					if (projection_points1[i] == max1) {
						maxPoint1.push (collider1.currentVertices[i]);
					} else {
						maxPoint1 = [ collider1.currentVertices[i] ];
					}
					max1 = projection_points1[i];
				}
			}
			for (var i = 0; i < projection_points2.length; i++) {
				if (projection_points2[i] <= min2) {
					if (projection_points2[i] == min2) {
						minPoint2.push (collider2.currentVertices[i]);
					} else {
						minPoint2 = [ collider2.currentVertices[i] ];
					}
					min2 = projection_points2[i];
				}
				if (projection_points2[i] >= max2) {
					if (projection_points2[i] == max2) {
						maxPoint2.push (collider2.currentVertices[i]);
					} else {
						maxPoint2 = [ collider2.currentVertices[i] ];
					}
					max2 = projection_points2[i];
				}
			}

			if (min2 > max1 || max2 < min1) 
				return false;

			v1 = max1 - min2;
			v2 = max2 - min1;
			d1 = Math.abs (v1);
			d2 = Math.abs (v2);
			if (d1 < d2) {
				if (penetrationDistance > d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
				}
			} else {
				if (penetrationDistance > d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
				}
			}

			// axis 6
			axis = vec3.create ();
			vec3.sub (axis, collider2.currentVertices[7], collider2.currentVertices[6]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis)[2]);
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis)[2]);
			}

			min1 = 1000000.0;
			min2 = 1000000.0;
			max1 = -1000000.0;
			max2 = -1000000.0;
			minPoint1 = [];
			minPoint2 = [];
			maxPoint1 = [];
			maxPoint2 = [];

			for (var i = 0; i < projection_points1.length; i++) {
				if (projection_points1[i] <= min1) {
					if (projection_points1[i] == min1) {
						minPoint1.push (collider1.currentVertices[i]);
					} else {
						minPoint1 = [ collider1.currentVertices[i] ];
					}
					min1 = projection_points1[i];

				}
				if (projection_points1[i] >= max1) {
					if (projection_points1[i] == max1) {
						maxPoint1.push (collider1.currentVertices[i]);
					} else {
						maxPoint1 = [ collider1.currentVertices[i] ];
					}
					max1 = projection_points1[i];
				}
			}
			for (var i = 0; i < projection_points2.length; i++) {
				if (projection_points2[i] <= min2) {
					if (projection_points2[i] == min2) {
						minPoint2.push (collider2.currentVertices[i]);
					} else {
						minPoint2 = [ collider2.currentVertices[i] ];
					}
					min2 = projection_points2[i];
				}
				if (projection_points2[i] >= max2) {
					if (projection_points2[i] == max2) {
						maxPoint2.push (collider2.currentVertices[i]);
					} else {
						maxPoint2 = [ collider2.currentVertices[i] ];
					}
					max2 = projection_points2[i];
				}
			}

			if (min2 > max1 || max2 < min1)
				return false;

			v1 = max1 - min2;
			v2 = max2 - min1;
			d1 = Math.abs (v1);
			d2 = Math.abs (v2);
			if (d1 < d2) {
				if (penetrationDistance > d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
				}
			} else {
				if (penetrationDistance > d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
				}
			}
		
			var manifold = new collisionManifold ();
			if (penetrationDistance != 0) {
        		manifold.penetrationDistance = penetrationDistance;
        		manifold.normal = penetrationNormal;
        		manifold.collisionPoint = vec3.clone (collisionPoint);
        	} else {
        		manifold.penetrationDistance = 0.0;
        		manifold.normal = vec3.fromValues (0.0, 1.0, 0.0);
        		manifold.collisionPoint = vec3.clone (collisionPoint);
        	}

			return manifold; 
			
		} else if (collider1.type == "sphere" && collider2.type == "sphere") {
			var c1 = vec3.create ();
        	vec3.transformMat4 (c1, collider1.center, collider1.matrix);
        	var c2 = vec3.create ();
        	vec3.transformMat4 (c2, collider2.center, collider2.matrix);

        	var n = vec3.create ();
        	vec3.sub (n, c1, c2);
        	var r = (collider1.radius * collider1.scaling + collider2.radius * collider2.scaling);
        	r *= r;

        	var d = vec3.squaredLength (n);
        	if (d > r) {
        		return false;
        	}

        	d = Math.sqrt (d);
        	var manifold = new collisionManifold ();
        	if (d != 0) {
        		manifold.penetrationDistance = r - d;
        		manifold.normal = n / d;
        	} else {
        		manifold.penetrationDistance = 0.0;
        		manifold.normal = vec3.fromValues (0.0, 1.0, 0.0);
        	}
        	return manifold;

		} else if (collider1.type == "sphere" && collider2.type == "box" ||
				   collider2.type == "sphere" && collider1.type == "box") {
			if (collider1.type == "box" && collider2.type == "sphere") {
				var temp = collider2;
				collider2 = collider1;
				collider1 = temp;
			}

			var storage = vec4.create ();
        	var c = vec3.transformMat4 (storage, collider1.center, collider1.matrix);
        	var r = collider1.radius * collider1.scaling;

			var max = vec4.transformMat4 (storage, collider2.max, collider2.matrix);
			var min = vec4.transformMat4 (storage, collider2.min, collider2.matrix);

			var x = Math.max (min[0], Math.min (c[0], max[0]));
  			var y = Math.max (min[1], Math.min (c[1], max[1]));
  			var z = Math.max (min[2], Math.min (c[2], max[2]));
  			var d2 = (x - c[0]) * (x - c[0]) +
  					 (y - c[1]) * (y - c[1]) +
                     (z - c[2]) * (z - c[2]);

  			if (r * r < d2)
  				return true;
  			else return false;
		} else {
			return false;
		}
	}

	detectAllCollisions () {
		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].collider.physics == "dynamic") {
				for (var j = 0; j < this.objects.length; j++) {
					if (i != j) {
						var manifold = this.detectCollision (this.objects[i].collider, this.objects[j].collider);
						if (manifold) {
							resolveCollision (this.objects[i], this.objects[j], manifold);
						}
					}
				}
				this.objects.splice (i, 1);
				i--;
			}
		}
		this.objects = [];
	}
} 


function project (point, axis) {
	var mag = (point[0] * axis[0] + point[1] * axis[1] + point[2] * axis[2]) / (axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
	var projection = vec3.create ();
	vec3.scale (projection, axis, mag);

	return projection;

}

function average (points) {
	var x = 0;
	var y = 0; 
	var z = 0;
	for (var i = 0; i < points.length; i++) {
		x += points[i][0];
		y += points[i][1];
		z += points[i][2];
	}

	return vec3.fromValues (x / points.length, y / points.length, z / points.length);
}

function checkAxis (axis, collider1, collider2, collisionPoint, penetrationDistance, penetrationNormal) {
	var projection_points1 = [];
	for (var i = 0; i < collider1.currentVertices.length; i++) {
		projection_points1.push (project (collider1.currentVertices[i], axis)[1]);
	}
	var projection_points2 = [];
	for (var i = 0; i < collider2.currentVertices.length; i++) {
		projection_points2.push (project (collider2.currentVertices[i], axis)[1]);
	}

	var min1 = 1000000.0;
	var min2 = 1000000.0;
	var max1 = -1000000.0;
	var max2 = -1000000.0;
	var minPoint1 = [];
	var minPoint2 = [];
	var maxPoint1 = [];
	var maxPoint2 = [];

	for (var i = 0; i < projection_points1.length; i++) {
		if (projection_points1[i] <= min1) {
			if (projection_points1[i] == min1) {
				minPoint1.push (collider1.currentVertices[i]);
			} else {
				minPoint1 = [ collider1.currentVertices[i] ];
			}
			min1 = projection_points1[i];

		}
		if (projection_points1[i] >= max1) {
			if (projection_points1[i] == max1) {
				maxPoint1.push (collider1.currentVertices[i]);
			} else {
				maxPoint1 = [ collider1.currentVertices[i] ];
			}
			max1 = projection_points1[i];
		}
	}
	for (var i = 0; i < projection_points2.length; i++) {
		if (projection_points2[i] <= min2) {
			if (projection_points2[i] == min2) {
				minPoint2.push (collider2.currentVertices[i]);
			} else {
				minPoint2 = [ collider2.currentVertices[i] ];
			}
			min2 = projection_points2[i];
		}
		if (projection_points2[i] >= max2) {
			if (projection_points2[i] == max2) {
				maxPoint2.push (collider2.currentVertices[i]);
			} else {
				maxPoint2 = [ collider2.currentVertices[i] ];
			}
			max2 = projection_points2[i];
		}
	}

	if (min2 > max1 || max2 < min1) 
		return false;

	var v1 = max1 - min2;
	var v2 = max2 - min1;
	var d1 = Math.abs (v1);
	var d2 = Math.abs (v2);

	if (d1 < d2) {
		if (penetrationDistance > d1) {
			// d1 is the new penetration distance
			penetrationDistance = d1;
			if (v1 > 0) {
				vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
				collisionPoint = average (minPoint2);
			} else { 
				vec3.normalize (penetrationNormal, vec3.clone (axis));
				collisionPoint = average (maxPoint1);
			}
		}
	} else {
		if (penetrationDistance > d2) {
			// d2 is the new penetration distance
			penetrationDistance = d2;
			if (v2 < 0) {
				vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
				collisionPoint = average (maxPoint2);
			} else {
				vec3.normalize (penetrationNormal, vec3.clone (axis));
				collisionPoint = average (minPoint1);
			}
		}
	}
	return;	
}





