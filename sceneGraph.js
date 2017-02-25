
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
        this.drawType = gl.TRIANGLES;
        this.active = true;
        this.tag = "default";
        this.children = [];
    }

    /** update: event loop function. Calls the update function for the transform component.
     *  @param { float } dTime: the time since the last framce callback (in seconds).
     */
    update (dTime) {
        this.transform.update (dTime);
    }

    loadFromObj (ObjID, MatID, TexID) {
        var ObjEle = document.getElementById (ObjID);
        if (!ObjEle) { 
            alert ("Unable to load object file " + ObjID);
            return -1;
        }

        var MatEle = document.getElementById (MatID);
        if (!MatEle) { 
            alert ("Unable to load material file " + MatID);
            return -1;
        }

        var TexEle = document.getElementById (TexID);
        if (!TexEle) { 
            alert ("Unable to load texture file " + TexID);
            return -1;
        }

        var lines = ObjEle.text.split ("\n");
        var indexes = [];
        var vertices = [];
        var normals = [];
        var tex = [];

        var points_Array = [];
        var normals_Array = [];
        var texture_Array = [];

        for (var i = 0; i < lines.length; i++) {
            if (lines[i][0] == 'f') {
                indexes.push (lines[i].substr (2).split (' '));
            } else if (lines[i][0] == 'v' && lines[i][1] == ' ') {
                vertices.push (lines[i].substr (2).split (' '));
            } else if (lines[i][0] == 'v' && lines[i][1] == 't') {
                tex.push (lines[i].substr (3).split (' '));
            } else if (lines[i][0] == 'v' && lines[i][1] == 'n') {
                normals.push (lines[i].substr (3).split (' '));
            }
        }

        for (var i = 0; i < indexes.length; i++) {
            for (var j = 0; j < indexes[i].length; j++) {
                var line = indexes[i][j].split ('/');

                points_Array.push (vertices[line[0] - 1]);
                texture_Array.push (tex[line[1] - 1]);
                normals_Array.push (normals[line[2] - 1]);
            }
        }

        for (var i = 0; i < points_Array.length; i++) {
            points_Array[i] = vec4.fromValues (points_Array[i][0], points_Array[i][1], points_Array[i][2], 1.0);
        }

        for (var i = 0; i < points_Array.length; i++) {
            normals_Array[i] = vec3.fromValues (normals_Array[i][0], normals_Array[i][1], normals_Array[i][2]);
        }

        for (var i = 0; i < points_Array.length; i++) {
            texture_Array[i] = vec2.fromValues (texture_Array[i][0], texture_Array[i][1]);
        }


        lines = MatEle.text.split ("\n");

        var shininess;
        var ambient;
        var diffuse;
        var specular;

        for (var i = 0; i < lines.length; i++) {
            if (lines[i][0] == 'N' && lines[i][1] == 's') {
                shininess = lines[i].substr (3).split (' ');
            } else if (lines[i][0] == 'K' && lines[i][1] == 'a') {
                ambient = lines[i].substr (3).split (' ');
            } else if (lines[i][0] == 'K' && lines[i][1] == 'd') {
                diffuse = lines[i].substr (3).split (' ');
            } else if (lines[i][0] == 'K' && lines[i][1] == 's') {
                specular = lines[i].substr (3).split (' ');
            }
        }

        ambient = vec4.fromValues (ambient[0], ambient[1], ambient[2], 1.0);
        diffuse = vec4.fromValues (diffuse[0], diffuse[1], diffuse[2], 1.0);
        specular = vec4.fromValues (specular[0], specular[1], specular[2], 1.0);
        shininess = shininess[0];

        this.geometry = new geometry (points_Array, normals_Array);
        this.material = new material (ambient, diffuse, specular, shininess);
        this.texture = new texture (TexEle, texture_Array);
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
			this.__drawTree_AUX (dTime, this.root.children[i], CTM, PC, 1.0);
		}
	}

	__drawTree_AUX (dTime, root, CTM, PC, scaling) {
		if (!root.active)
			return;

		root.update (dTime);

		var CTM_prime = mat4.create ();
		mat4.mul (CTM_prime, CTM, root.transform.MVmatrix);
        var scaling_prime = scaling * root.transform.scale[0];

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
            var c = vec3.create ();
            vec3.transformMat4 (c, root.collider.center, CTM_prime);
            
            var r = root.collider.radius * scaling_prime;

            if (root.collider.inFustrum (PC, c, r)) {
                this.drawNode (root, CTM_prime);
            } else {
            	console.log ("HERE");
            }
        } 

        for (var i = 0; i < root.children.length; i++) {
			this.__drawTree_AUX (dTime, root.children[i], CTM_prime, PC, scaling_prime);
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

        gl.drawArrays (obj.drawType, 0, obj.geometry.Nvertices);
        gl.bindBuffer (gl.ARRAY_BUFFER, null);
	}

    getObjectsByTag (tag) {
        var objects = [];
        for (var i = 0; i < this.root.children.length; i++) {
            this.__getObjectsByTag_AUX (tag, this.root.children[i], objects);
        }

        return objects;
    }

    __getObjectsByTag_AUX (tag, root, objects) {
        if (root.tag == tag) {
            objects.push (root);
        }

        for (var i = 0; i < root.children.length; i++) {
            this.__getObjectsByTag_AUX (tag, root.children[i], objects);
        }
    }

    getObjectByTag (tag) {
        for (var i = 0; i < this.root.children.length; i++) {
            return this.__getObjectByTag_AUX (tag, this.root.children[i]);
        }
    }

    __getObjectByTag_AUX (tag, root) {
        if (root.tag == tag) {
            return root;
        }

        for (var i = 0; i < root.children.length; i++) {
            this.__getObjectByTag_AUX (tag, root.children[i]);
        }
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


