/*
var CollisionManager;

class sceneCollisionManager {
	constructor () {
		this.objects = [];
	}

	detectCollision (collider1, collider2) {
		if (collider1.type == "box" && collider2.type == "box") {
			var max1 = vec3.create ();
			var max2 = vec3.create ();
			var min1 = vec3.create ();
			var min2 = vec3.create ();
			var max1 = vec3.transformMat4 (max1, collider1.max, collider1.matrix);
			var min1 = vec3.transformMat4 (min1, collider1.min, collider1.matrix);

			var max2 = vec3.transformMat4 (max2, collider2.max, collider2.matrix);
			var min2 = vec3.transformMat4 (min2, collider2.min, collider2.matrix);
			var t1 = (min1[0] <= max2[0] && max1[0] >= min2[0]) &&
         			 (min1[1] <= max2[1] && max1[1] >= min2[1]) &&
         			 (min1[2] <= max2[2] && max1[2] >= min2[2]);

			return  t1;

		} else if (collider1.type == "sphere" && collider2.type == "sphere") {
			var c1 = vec3.create ();
        	vec3.transformMat4 (c1, collider1.center, collider1.matrix);

        	var c2 = vec3.create ();
        	vec3.transformMat4 (c2, collider2.center, collider2.matrix);

        	var d2 = vec3.squaredDistance (c2, c1);
        	var r = (collider1.radius * collider1.scaling + collider2.radius * collider2.scaling);

        	if (r * r > d2)
            	return true;
        	else return false;

		} else if (collider1.type == "polygon" && collider2.type == "polygon") {

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

			var x = Math.max(min[0], Math.min(c[0], max[0]));
  			var y = Math.max(min[1], Math.min(c[1], max[1]));
  			var z = Math.max(min[2], Math.min(c[2], max[2]));
  			var d2 = (x - c[0]) * (x - c[0]) +
  					 (y - c[1]) * (y - c[1]) +
                     (z - c[2]) * (z - c[2]);

  			if (r * r < d2)
  				return true;
  			else return false;

		} else if (collider1.type == "sphere" && collider2.type == "polygon" ||
				   collider2.type == "sphere" && collider1.type == "polygon") {
			if (collider1.type == "polygon" && collider2.type == "sphere") {
				var temp = collider2;
				collider2 = collider1;
				collider1 = temp;
			}
			var c = vec3.create ();
        	vec3.transformMat4 (c, collider1.center, collider1.matrix);
        	var r = collider1.radius * collider1.scaling;

			var p_prime = [];
        	for (var i = 0; i < collider2.vertices.length; i++) {
        		var storage = vec4.create ();
            	p_prime.push (vec4.transformMat4 (storage, collider2.vertices[i], collider2.matrix));
        	}

        	for (var i = 0; i < p_prime.length; i++) {
				var d2 = (p_prime[i][0] - c[0]) * (p_prime[i][0] - c[0]) +
                		 (p_prime[i][1] - c[1]) * (p_prime[i][1] - c[1]) +
                         (p_prime[i][2] - c[2]) * (p_prime[i][2] - c[2]);
  				if (r * r > d2)
  					return true;
  			}
  			return false;

		} else if (collider1.type == "box" && collider2.type == "polygon" ||
				   collider2.type == "box" && collider1.type == "polygon") {

		} else {
			return false;
		}
	}

	detectAllColisions () {
		for (var i = 0; i < this.objects.length; i++) {
			for (var j = i + 1; j < this.objects.length; j++) {
				if (this.detectCollision (this.objects[i].collider, this.objects[j].collider))
					console.log (this.objects[i].collider.type, this.objects[j].collider.type);
			}
		}
	}
} */