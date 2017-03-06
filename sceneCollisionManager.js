
var collisionManager;

class collisionManifold {
	constructor (_vertexBody, _faceBody, _collisionPoint, _normal, _edgeA, _edgeB, _vf, _penetrationDistance) {
		this.vertexBody = _vertexBody;
		this.faceBody = _faceBody;
		this.collisionPoint = _collisionPoint;
		this.normal = _normal;
		this.edgeA = _edgeA;
		this.edgeB = _edgeB;
		this.vf = _vf;
		this.penetrationDistance = _penetrationDistance;
	}
}

class sceneCollisionManager {
	constructor () {
		this.objects = [];
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
					vertexBody = collider1.object;
					faceBody = collider2.object;
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
					vertexBody = collider1.object;
					faceBody = collider2.object;
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
					vertexBody = collider1.object;
					faceBody = collider2.object;					
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
					vertexBody = collider2.object;
					faceBody = collider1.object;					
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
					vertexBody = collider2.object;
					faceBody = collider1.object;
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
					vertexBody = collider2.object;
					faceBody = collider1.object;
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
		var player
		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].tag == "player") {
				player = this.objects[i];
				this.objects.splice (i, 1);
				break;
			}
		}

		for (var i = 0; i < this.objects.length; i++) {
			var manifold = this.detectCollision (player.collider, this.objects[i].collider);
			if (manifold) {
				resolveCollision (player, this.objects[i], manifold);
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

		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].collider.physics == "dynamic") {
				for (var j = 0; j < this.objects.length; j++) {
					if (i != j) {
						var manifold = this.detectCollision (this.objects[i].collider, this.objects[j].collider);
						if (manifold) {
							resolveCollision (this.objects[i], this.objects[j], manifold);
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





