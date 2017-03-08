function changeGravitationalCenter (center) {
	var objects = currentScene.getObjects ();

	for (var i = 0; i < objects.length; i++) {
		if (objects[i].rigidBody && objects[i].tag != "player") {
			var direction = vec3.create ();
			vec3.sub (direction, center, objects[i].transform.position);
			vec3.normalize (direction, direction);

			var force = vec3.create ();
			vec3.scale (force, direction, objects[i].rigidBody.mass * gravity);
			objects[i].rigidBody.force = vec3.clone (force);
		}
	}
}

function swapTextures (img) {
	var objects = currentScene.getObjects ();

	for (var i = 0; i < objects.length; i++) {
		if (objects[i].texture) {
			objects[i].texture = new texture (img, [ [gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]);
		}
	}
}