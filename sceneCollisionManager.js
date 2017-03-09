
class collisionManifold {
	constructor (_vertexBody, _faceBody, _collisionPoint, _normal, _penetrationDistance) {
		this.vertexBody = _vertexBody;
		this.faceBody = _faceBody;
		this.collisionPoint = _collisionPoint;
		this.normal = _normal;
		this.penetrationDistance = _penetrationDistance;
	}
}

class sceneCollisionManager {
	constructor () {
		this.objects = [];
		this.contactCollisions = [];
		this.collisions = [];
	}

	detectCollision (collider1, collider2) {
		if (collider1.type == "box" && collider2.type == "box") {
	/*		var axis = vec3.create ();
			vec3.sub (axis, collider1.currentVertices[7], collider1.currentVertices[3]);

			var man = [];
			man.push (checkAxis (axis, collider1, collider2));
			if (!man[0])
				return false;

			axis = vec3.create ();
			vec3.sub (axis, collider1.currentVertices[7], collider1.currentVertices[5]);

			man.push (checkAxis (axis, collider1, collider2));
			if (!man[1])
				return false;

			axis = vec3.create ();
			vec3.sub (axis, collider1.currentVertices[7], collider1.currentVertices[6]);

			man.push (checkAxis (axis, collider1, collider2));
			if (!man[2])
				return false;

			axis = vec3.create ();
			vec3.sub (axis, collider2.currentVertices[7], collider2.currentVertices[3]);

			man.push (checkAxis (axis, collider1, collider2));
			if (!man[3])
				return false;

			axis = vec3.create ();
			vec3.sub (axis, collider2.currentVertices[7], collider2.currentVertices[5]);

			man.push (checkAxis (axis, collider1, collider2));
			if (!man[4])
				return false;

			axis = vec3.create ();
			vec3.sub (axis, collider2.currentVertices[7], collider2.currentVertices[6]);
			
			man.push (checkAxis (axis, collider1, collider2));
			if (!man[5])
				return false;
			
			var manifold = new collisionManifold ();
			manifold.penetrationDistance = 10000;
			manifold.normal = vec3.create ();
			manifold.collisionPoint = vec3.create ();
			for (var i = 0; i < 6; i++) {
				if (man[i].penetrationDistance < manifold.penetrationDistance) {
					manifold = man[i];
					if (0 < i < 3) {
						manifold.vertexBody = collider1.object;
						manifold.faceBody = collider2.object;
					} else {
						manifold.vertexBody = collider2.object;
						manifold.faceBody = collider1.object;
					}
				}
			}

			return manifold;
		*/
			var penetrationNormal = vec3.create ();
			var penetrationDistance = 10000;
			var collisionPoint = vec3.fromValues (0.0, 0.0, 0.0);
			var vertexBody = null;
			var faceBody = null;

			// axis 1
			var axis = vec3.create ();
			vec3.sub (axis, collider1.currentVertices[7], collider1.currentVertices[3]);

			var projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis));
			}
			var projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis));
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
				if (penetrationDistance >= d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
					vertexBody = collider1.object;
					faceBody = collider2.object;
				}
			} else {
				if (penetrationDistance >= d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
					vertexBody = collider1.object;
					faceBody = collider2.object;
				}
			}	

			// axis 2
			axis = vec3.create ();
			vec3.sub (axis, collider1.currentVertices[7], collider1.currentVertices[5]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis));
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis));
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
				if (penetrationDistance >= d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
					vertexBody = collider1.object;
					faceBody = collider2.object;
				}
			} else {
				if (penetrationDistance >= d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
					vertexBody = collider1.object;
					faceBody = collider2.object;					
				}
			}	

			// axis 3
			axis = vec3.create ();
			vec3.sub (axis, collider1.currentVertices[7], collider1.currentVertices[6]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis));
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis));
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
				if (penetrationDistance >= d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
					vertexBody = collider1.object;
					faceBody = collider2.object;					
				}
			} else {
				if (penetrationDistance >= d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
					vertexBody = collider1.object;
					faceBody = collider2.object;					
				}
			}

			// axis 4
			axis = vec3.create ();
			vec3.sub (axis, collider2.currentVertices[7], collider2.currentVertices[3]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis));
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis));
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
				if (penetrationDistance >= d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
					vertexBody = collider2.object;
					faceBody = collider1.object;					
				}
			} else {
				if (penetrationDistance >= d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
					vertexBody = collider2.object;
					faceBody = collider1.object;
				}
			}

			// axis 5
			axis = vec3.create ();
			vec3.sub (axis, collider2.currentVertices[7], collider2.currentVertices[5]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis));
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis));
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
				if (penetrationDistance >= d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
					vertexBody = collider2.object;
					faceBody = collider1.object;
				}
			} else {
				if (penetrationDistance >= d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
					vertexBody = collider2.object;
					faceBody = collider1.object;
				}
			}

			// axis 6
			axis = vec3.create ();
			vec3.sub (axis, collider2.currentVertices[7], collider2.currentVertices[6]);

			projection_points1 = [];
			for (var i = 0; i < collider1.currentVertices.length; i++) {
				projection_points1.push (project (collider1.currentVertices[i], axis));
			}
			projection_points2 = [];
			for (var i = 0; i < collider2.currentVertices.length; i++) {
				projection_points2.push (project (collider2.currentVertices[i], axis));
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
				if (penetrationDistance >= d1) {
					// d1 is the new penetration distance
					penetrationDistance = d1;
					if (v1 > 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (minPoint2);
					} else { 
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (maxPoint1);
					}
					vertexBody = collider2.object;
					faceBody = collider1.object;
				}
			} else {
				if (penetrationDistance >= d2) {
					// d2 is the new penetration distance
					penetrationDistance = d2;
					if (v2 < 0) {
						vec3.normalize (penetrationNormal, vec3.clone (vec3.negate (axis, axis)));
						collisionPoint = average (maxPoint2);
					} else {
						vec3.normalize (penetrationNormal, vec3.clone (axis));
						collisionPoint = average (minPoint1);
					}
					vertexBody = collider2.object;
					faceBody = collider1.object;
				}
			}
		
			var manifold = new collisionManifold ();
			if (penetrationDistance != 0) {
        		manifold.penetrationDistance = penetrationDistance;
        		manifold.normal = penetrationNormal;
        		manifold.collisionPoint = vec3.clone (collisionPoint);
        		manifold.vertexBody = vertexBody;
        		manifold.faceBody = faceBody;
        	} else {
        		manifold.penetrationDistance = 0.0;
        		manifold.normal = vec3.fromValues (0.0, 1.0, 0.0);
        		manifold.collisionPoint = vec3.clone (collisionPoint);
        		manifold.vertexBody = vertexBody;
        		manifold.faceBody = faceBody;
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
		var player = null;
		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].tag == "player") {
				player = this.objects[i];
				this.objects.splice (i, 1);
				break;
			}
		}

		if (player) {
			for (var i = 0; i < this.objects.length; i++) {
				var manifold = this.detectCollision (player.collider, this.objects[i].collider);
				if (manifold) {
					this.resolveCollision (player, this.objects[i], manifold);
					if (player.collider.collisionFunction) {
						player.collider.collisionFunction (player, this.objects[i]);
					}
					if (this.objects[i].collider.collisionFunction) {
						this.objects[i].collider.collisionFunction (this.objects[i], player);
					}
				}
				if (this.objects[i].collider.physics == "trigger") {
					this.objects.splice (i, 1);
					i--;
				}
			}
		} else {
			for (var i = 0; i < this.objects.length; i++) {
				if (this.objects[i].collider.physics == "trigger") {
					this.objects.splice (i, 1);
					i--;
				}
			}
		}

		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].collider.physics == "dynamic") {
				for (var j = 0; j < this.objects.length; j++) {
					if (i != j) {
						var manifold = this.detectCollision (this.objects[i].collider, this.objects[j].collider);
						if (manifold) {
							this.resolveCollision (this.objects[i], this.objects[j], manifold);
							if (this.objects[i].collider.collisionFunction) {
								this.objects[i].collider.collisionFunction (this.objects[i], this.objects[j]);
							}
							if (this.objects[j].collider.collisionFunction) {
								this.objects[j].collider.collisionFunction (this.objects[j], this.objects[i]);
							}
						}
					}
				}
				this.objects.splice (i, 1);
				i--;
			}
		}
		this.objects = [];
	}

	handleAllContactCollisions () {
		var amat = compute_a (this.contactCollisions);
		var b_vec = compute_b (this.contactCollisions);
		var f_vec = qp_solve (amat, b_vec);
		for (var i = 0; i < this.contactCollisions.length; i++) {
			var f = f_vec[i];
			var n = this.contactCollisions[i].normal;
			var a = this.contactCollisions[i].vertexBody;
			var b = this.contactCollisions[i].faceBody;
			var p = this.contactCollisions[i].collisionPoint;

			var ra = vec3.create ();
	  		var rb = vec3.create ();
	  		vec3.sub (ra, p, a.collider.currentCenter);
	  		vec3.sub (rb, p, b.collider.currentCenter);

			vec3.scaleAndAdd (a.rigidBody.f, a.rigidBody.f, n, -f);
			var storage = vec3.create ();
			vec3.scale (storage, n, f);
			vec3.cross (storage, ra, storage);
			vec3.add (a.rigidBody.t, a.rigidBody.t, storage);

			vec3.scaleAndAdd (b.rigidBody.f, b.rigidBody.f, n, f);
			var storage = vec3.create ();
			vec3.scale (storage, n, f);
			vec3.cross (storage, rb, storage);
			vec3.sub (b.rigidBody.t, b.rigidBody.t, storage);
		}

		this.contactCollisions = [];
	}

	resolveCollision (object1, object2, manifold) {
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
	        if (object1.tag == "player") {
		       percent = 1.0;
	        }

	  	    vec3.scaleAndAdd (object1.transform.position, object1.transform.position, manifold.normal, percent * manifold.penetrationDistance);

	  	    if (object1.tag == "player" && vec3.equals (manifold.normal, vec3.fromValues (0.0, 1.0, 0.0))) {
	            object1.rigidBody.force = vec3.fromValues (0.0, 0.0, 0.0);
	            object1.rigidBody.P = vec3.fromValues (0.0, 0.0, 0.0);
	            object1.rigidBody.velocity = vec3.fromValues (0.0, 0.0, 0.0);
	            return;
	        }   

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

	  		if (vrelNormal > THRESHHOLD) {
	  			return;
	  		}
	  		if (vrelNormal > -THRESHHOLD) {
	  			//this.contactCollisions.push (manifold);
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
	    		var dynamicFriction = Math.sqrt (object1.rigidBody.frictionDynamic * object1.rigidBody.frictionDynamic + object2.rigidBody.frictionDynamic * object2.rigidBody.frictionDynamic);
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

	        if (object1.tag == "player" && vec3.equals (manifold.normal, vec3.fromValues (0.0, 1.0, 0.0))) {
	            object1.rigidBody.force = vec3.fromValues (0.0, 0.0, 0.0);
	            object1.rigidBody.P = vec3.fromValues (0.0, 0.0, 0.0);
	            object1.rigidBody.velocity = vec3.fromValues (0.0, 0.0, 0.0);
	            return;
	        } else if (object2.tag == "player" && vec3.equals (manifold.normal, vec3.fromValues (0.0, 1.0, 0.0))) {
	            object2.rigidBody.force = vec3.fromValues (0.0, 0.0, 0.0);
	            object2.rigidBody.P = vec3.fromValues (0.0, 0.0, 0.0);
	            object2.rigidBody.velocity = vec3.fromValues (0.0, 0.0, 0.0);
	            return;
	        } 

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
	  			//this.contactCollisions.push (manifold);
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
	    		var dynamicFriction = Math.sqrt (object1.rigidBody.frictionDynamic * object1.rigidBody.frictionDynamic + object2.rigidBody.frictionDynamic * object2.rigidBody.frictionDynamic);
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
} 

function project (point, axis) {
	var axis_prime = vec3.create ();
	vec3.normalize (axis_prime, axis);
	return vec3.dot (point, axis_prime);
}

function project2 (point, axis) {
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

function checkAxis (axis, collider1, collider2) {
	var projection_points1 = [];
	for (var i = 0; i < collider1.currentVertices.length; i++) {
		projection_points1.push (project (collider1.currentVertices[i], axis));
	}
	var projection_points2 = [];
	for (var i = 0; i < collider2.currentVertices.length; i++) {
		projection_points2.push (project (collider2.currentVertices[i], axis));
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

	var manifold = new collisionManifold ();
	manifold.normal = vec3.create ();
	manifold.collisionPoint = vec3.create ();

	var v1 = max1 - min2;
	var v2 = max2 - min1;
	var d1 = Math.abs (v1);
	var d2 = Math.abs (v2);
	if (d1 < d2) {
		manifold.penetrationDistance = d1;
		if (v1 > 0) {
			vec3.normalize (manifold.normal, vec3.clone (vec3.negate (axis, axis)));
			manifold.collisionPoint = average (minPoint2);
		} else { 
			vec3.normalize (manifold.normal, vec3.clone (axis));
			manifold.collisionPoint = average (maxPoint1);
		}
	} else {
		manifold.penetrationDistance = d2;
		if (v2 > 0) {
			vec3.normalize (manifold.normal, vec3.clone (axis));
			manifold.collisionPoint = average (maxPoint2);
		} else {
			vec3.normalize (manifold.normal, vec3.clone (vec3.negate (axis, axis)));
			manifold.collisionPoint = average (minPoint1);
		}
	}	

	return manifold;
}

function compute_ndot (manifold) {
	var toReturn = vec3.create ();
	vec3.cross (toReturn, manifold.faceBody.rigidBody.omega, manifold.normal);
	return toReturn;
}

function compute_b (manifolds) {
	var b_ret = [];
	for (var i = 0; i < manifolds.length; i++) {
		var a = manifolds[i].vertexBody;
		var b = manifolds[i].faceBody;
		var n = manifolds[i].normal;
		var p = manifolds[i].collisionPoint;
	  	var ra = vec3.create ();
	  	var rb = vec3.create ();
	  	vec3.sub (ra, p, a.collider.currentCenter);
	  	vec3.sub (rb, p, b.collider.currentCenter);

	  	var f_ext_a = vec3.clone (a.rigidBody.force);
	  	var f_ext_b = vec3.clone (b.rigidBody.force);

	  	var t_ext_a = vec3.clone (a.rigidBody.force);
	  	var t_ext_b = vec3.clone (b.rigidBody.force);

	  	var a_ext_part = vec3.create ();
	  	var b_ext_part = vec3.create ();
	  	var a_vel_part = vec3.create ();
	  	var b_vel_part = vec3.create ();

	  	var term1 = vec3.create ();
	  	vec3.scale (term1, f_ext_a, a.rigidBody.inv_mass);
	  	var storage = vec3.create ();
	  	var term2 = vec3.create ();
	  	vec3.transformMat3 (storage, t_ext_a, a.rigidBody.inv_I);
	  	vec3.cross (term2, storage, ra); 

	  	vec3.add (a_ext_part, term1, term2);

	  	var term3 = vec3.create ();
	  	vec3.scale (term3, f_ext_b, b.rigidBody.inv_mass);
	  	storage = vec3.create ();
	  	var term4 = vec3.create ();
	  	vec3.transformMat3 (storage, t_ext_b, b.rigidBody.inv_I);
	  	vec3.cross (term4, storage, rb); 

	  	vec3.add (b_ext_part, term3, term4);

	  	term1 = vec3.create ();
	  	storage = vec3.create ();
	  	vec3.cross (storage, a.rigidBody.omega, ra);
	  	vec3.cross (term1, a.rigidBody.omega, storage);

	  	term2 = vec3.create ();
	  	storage = vec3.create ();
	  	vec3.cross (storage, a.rigidBody.L, a.rigidBody.omega);
	  	vec3.transformMat3 (storage, storage, a.rigidBody.inv_I);
	  	vec3.cross (term2, storage, ra);

	  	term3 = vec3.create ();
	  	storage = vec3.create ();
	  	vec3.cross (storage, b.rigidBody.omega, rb);
	  	vec3.cross (term3, b.rigidBody.omega, storage);

	  	term4 = vec3.create ();
	  	storage = vec3.create ();
	  	vec3.cross (storage, b.rigidBody.L, b.rigidBody.omega);
	  	vec3.transformMat3 (storage, storage, b.rigidBody.inv_I);
	  	vec3.cross (term4, storage, rb);

	  	var k1;
	  	var temp1 = vec3.create ();
	  	var temp2 = vec3.create ();
	  	storage = vec3.create ();
	  	vec3.add (temp1, a_ext_part, a_vel_part);
	  	vec3.add (temp2, b_ext_part, b_vel_part);
	  	vec3.sub (storage, temp1, temp2);
	  	k1 = vec3.dot (n, storage);

	  	var ndot = compute_ndot (manifolds[i]);

	  	var pt_1 = a.rigidBody.pointVelocity (p);
	  	var pt_2 = b.rigidBody.pointVelocity (p);
	  	storage = vec3.create ();
	  	vec3.sub (storage, pt_1, pt_2);
	  	var k2 = 2 * vec3.dot (ndot, storage);

	  	b_ret.push (k1 + k2);
	}

	return b_ret;
}

function compute_a (manifolds) {
	var a = [];
	for (var i = 0; i < manifolds.length; i++) {
		a.push ([]);
		for (var j = 0; j < manifolds.length; j++) {
			a[i].push (compute_aij (manifolds[i], manifolds[j]));
		}
	}

	return a;
}

function compute_aij (manifold1, manifold2) {
	if ((manifold1.vertexBody != manifold2.vertexBody) && (manifold1.faceBody != manifold2.faceBody) &&
		(manifold1.vertexBody != manifold2.faceBody) && (manifold1.vertexBody != manifold2.faceBody))
		return 0.0;

	var ni = manifold1.normal;
	var nj = manifold2.normal;
	var pi = manifold1.collisionPoint;
	var pj = manifold2.collisionPoint;
	var ai = manifold1.vertexBody;
	var bi = manifold1.faceBody;
	var aj = manifold2.vertexBody;
	var bj = manifold2.faceBody;

	var ra = vec3.create ();
  	var rb = vec3.create ();
  	vec3.sub (ra, pi, ai.collider.currentCenter);
  	vec3.sub (rb, pi, bi.collider.currentCenter);

  	var force_on_a = vec3.create ();
  	var torque_on_a = vec3.create ();

  	if (aj == ai) {
  		force_on_a = vec3.clone (nj);
  		var storage = vec3.create ();
  		vec3.sub (storage, pj, ai.collider.currentCenter);
  		vec3.cross (torque_on_a, storage, nj);
  	} else if (bj == ai) {
  		vec3.negate (force_on_a, nj);
  		var storage = vec3.create ();
  		vec3.sub (storage, pj, ai.collider.currentCenter);
  		vec3.cross (torque_on_a, storage, nj);
  	}

  	var force_on_b = vec3.create ();
  	var torque_on_b = vec3.create ();

  	if (aj == bi) {
  		force_on_b = vec3.clone (nj);
  		var storage = vec3.create ();
  		vec3.sub (storage, pj, bi.collider.currentCenter);
  		vec3.cross (torque_on_b, storage, nj);
  	} else if (bj == bi) {
  		vec3.negate (force_on_b, nj);
  		var storage = vec3.create ();
  		vec3.sub (storage, pj, bi.collider.currentCenter);
  		vec3.cross (torque_on_b, storage, nj);
  	}

  	var a_linear = vec3.create ();
  	vec3.scale (a_linear, force_on_a, ai.rigidBody.inv_mass);

  	var a_angular = vec3.create ();
  	var storage = vec3.create ();
  	vec3.transformMat3 (storage, torque_on_a, ai.rigidBody.inv_I);
  	vec3.cross (a_angular, storage, ra);

  	var b_linear = vec3.create ();
  	vec3.scale (b_linear, force_on_b, bi.rigidBody.inv_mass);

  	var b_angular = vec3.create ();
  	var storage = vec3.create ();
  	vec3.transformMat3 (storage, torque_on_b, bi.rigidBody.inv_I);
  	vec3.cross (b_angular, storage, rb);

  	var term1 = vec3.create ();
  	var term2 = vec3.create ();
  	vec3.add (term1, a_linear, a_angular);
  	vec3.add (term2, b_linear, b_angular);
  	storage = vec3.create ();
  	vec3.sub (storage, term1, term2);

  	return vec3.dot (ni, storage);
}

function qp_solve (a_mat, b_vec) {
	var force = [];
	for (var i = 0; i < b_vec.length; i++) {
		var term = 0.0;
		for (var j = 0; j < b_vec.length; j++) {
			term += a_mat[i][j] * b_vec[j];
		}
		force.push (term);
	}

	return force;
}





