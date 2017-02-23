
var SGraph;

/** object: an abstraction for a object. Objects contain a material, geometry,
 *  and transform object to define it. Objects can also be deactivated, causing
 *  their motion to still be upated, but they won't be drawn to the screen.
 */
class object {
    /** constructor: builds an instance of an object with given attributes.
     *  @param { transform } transform: the orientation and position of the object.
     *  @param { material } material: the material that defines an object.
     *  @param { geometry } geometry: the object's geometry to define it.
     */
    constructor (_transform, _material, _geometry, _texture, _collider) {
        this.transform = _transform || new transform ();
        this.material = _material;
        this.geometry = _geometry;
        this.texture = _texture
        this.collider = _collider;
        this.active = true;
        this.children = [];
    }

    /** update: event loop function. Calls the update function for the transform component.
     *  @param { float } dTime: the time since the last framce callback (in seconds).
     */
    update (dTime) {
        this.transform.update (dTime);
    }
}


class sceneGraph {
	constructor () {
		this.root = new object ();
		this.root.children = [];
	}

	drawTree (dTime) {
		var CTM = mat4.create ();
		var PC = mat4.create ();

		mat4.mul (PC, cam.perspectiveProjectionMatrix, cam.matrix);
		for (var i = 0; i < this.root.children.length; i++) {
			this.__drawTree_AUX (dTime, this.root.children[i], CTM, PC);
		}
	}

	__drawTree_AUX (dTime, root, CTM, PC) {
		if (!root.active)
			return;

		root.update (dTime);

		var CTM_prime = mat4.create ();
		mat4.mul (CTM_prime, CTM, root.transform.MVmatrix);

		var toDraw = false;
		if (root.collider == null) {
            this.drawNode (root, CTM_prime);
        }

        else if (root.collider.type == "box") {
            if (root.collider.inFustrum (PC, CTM_prime)) {
                this.drawNode (root, CTM_prime);
            } else {
            	console.log ("HERE");
            }
        } 

        else if (root.collider.type == "sphere") {
            if (root.collider.inFustrum (PC, CTM_prime)) {
                this.drawNode (root, CTM_prime);
            } else {
            	console.log ("HERE");
            }
        } 

        for (var i = 0; i < root.children.length; i++) {
			this.__drawTree_AUX (dTime, root.children[i], CTM_prime, PC);
		}
	}

	drawNode (obj, CTM) {
		obj.geometry.setup ();
        obj.material.setup ();
        obj.texture.setup ();

        gl.uniformMatrix4fv (modelViewMatrixLoc, false, CTM);
        gl.uniformMatrix4fv (cameraMatrixLoc, false, cam.matrix);
        gl.uniformMatrix4fv (projectionMatrixLoc, false, cam.perspectiveProjectionMatrix); 

        var CTMN = mat3.create ();
        mat3.normalFromMat4 (CTMN, CTM);
        gl.uniformMatrix3fv (normalMatrixLoc, false, CTMN);

        gl.drawArrays (gl.TRIANGLES, 0, obj.geometry.Nvertices);
        gl.bindBuffer (gl.ARRAY_BUFFER, null);
	}
}


function buildSceneGraph () {
	SGraph = new sceneGraph ();
	SGraph.root.children.push (cubes[0]);
	SGraph.root.children.push (cubes[1]);
	SGraph.root.children[1].children.push (cubes[2]);
    SGraph.root.children[1].children[0].children.push (cubes[3]);
}

function drawSceneGraph (dTime) {
	SGraph.drawTree (dTime);
}




