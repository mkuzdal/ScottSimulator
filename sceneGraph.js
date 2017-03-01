
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
        this.texture = _texture;
        this.collider = _collider || new nullCollider ();
        this.mouseTriggers = [];

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

    setup (CTM) {
        if (this.material) {
            this.material.setup ();
        } if (this.geometry) {
            this.geometry.setup ();
        } if (this.texture) {
            this.texture.setup (); 
        }

        if (this.mouseTriggers.length) {
            this.mouseTriggers[0].setup ();
        } else {
            gl.uniform4fv (gl.getUniformLocation (program, "fTriggerID"), vec4.fromValues (0.0, 0.0, 0.0, 1.0));   
        }

        gl.uniformMatrix4fv (modelMatrixLoc, false, this.collider.matrix);
        gl.uniformMatrix4fv (cameraMatrixLoc, false, cam.matrix);
        gl.uniformMatrix4fv (projectionMatrixLoc, false, cam.perspectiveProjectionMatrix); 
        //gl.uniformMatrix4fv (cameraMatrixLoc, false, lightsManager.lightSources[0].matrix);
        //gl.uniformMatrix4fv (projectionMatrixLoc, false, lightsManager.lightSources[0].projectionMatrix); 
        gl.uniformMatrix4fv (lightProjectionMatrixLoc, false, lightsManager.lightSources[0].projectionMatrix);
        gl.uniformMatrix4fv (lightMatrixLoc, false, lightsManager.lightSources[0].matrix);

        var CTMN = mat3.create ();
        mat3.normalFromMat4 (CTMN, this.collider.matrix);
        gl.uniformMatrix3fv (normalMatrixLoc, false, CTMN);
    }

    draw () {
        if (this.geometry)
            gl.drawArrays (this.drawType, 0, this.geometry.Nvertices);
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

        var min_X = 10000;
        var min_Y = 10000;
        var min_Z = 10000;
        var max_X = -10000;
        var max_Y = -10000;
        var max_Z = -10000;

        for (var i = 0; i < points_Array.length; i++) {
            points_Array[i] = vec4.fromValues (points_Array[i][0], points_Array[i][1], points_Array[i][2], 1.0);
            min_X = Math.min (min_X, points_Array[i][0]);
            min_Y = Math.min (min_Y, points_Array[i][1]);
            min_Z = Math.min (min_Z, points_Array[i][2]);

            max_X = Math.max (max_X, points_Array[i][0]);
            max_Y = Math.max (max_Y, points_Array[i][1]);
            max_Z = Math.max (max_Z, points_Array[i][2]);
        }

        var collider = [];
        collider.push (vec4.fromValues (min_X, min_Y, min_Z, 1.0));
        collider.push (vec4.fromValues (min_X, min_Y, max_Z, 1.0));
        collider.push (vec4.fromValues (min_X, max_Y, min_Z, 1.0));
        collider.push (vec4.fromValues (min_X, max_Y, max_Z, 1.0));
        collider.push (vec4.fromValues (max_X, min_Y, min_Z, 1.0));
        collider.push (vec4.fromValues (max_X, min_Y, max_Z, 1.0));
        collider.push (vec4.fromValues (max_X, max_Y, min_Z, 1.0));
        collider.push (vec4.fromValues (max_X, max_Y, max_Z, 1.0));
        this.collider = new polygonCollider (collider);

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

    addOnMouseClickTrigger (_function) {
        this.mouseTriggers.push (new mouseTrigger (this, _function, "click"));
    }

    addOnMouseHoverTrigger (_function) {
        this.mouseTriggers.push (new mouseTrigger (this, _function, "hover"));
    }

    addOnMouseEnterTrigger (_function) {
        this.mouseTriggers.push (new mouseTrigger (this, _function, "enter"));
    }

    addOnMouseExitTrigger (_function) {
        this.mouseTriggers.push (new mouseTrigger (this, _function, "exit"));
    }

    clone () {
        var newTransform = new transform (vec3.clone (this.transform.position), 
                                          vec3.clone (this.transform.scale),
                                          quat.clone (this.transform.rotation));

        var newMaterial = new material (vec4.clone (this.material.ambient),
                                        vec4.clone (this.material.diffuse),
                                        vec4.clone (this.material.specular),
                                        this.material.shininess);

        var newGeometry = this.geometry;
        var newTexture = this.texture;
        var newCollider = this.collider;
        var newObject = new object (newTransform, newMaterial, newGeometry, newTexture, newCollider);
        newObject.drawType = this.drawType;
        newObject.tag = this.tag;
        newObject.active = this.active;

        for (var i = 0; i < this.mouseTriggers.length; i++) {
            if (this.mouseTriggers[i].type == "click") {
                newObject.addOnMouseClickTrigger (this.mouseTriggers[i].func);
            } else if (this.mouseTriggers[i].type == "hover") {
                newObject.addOnMouseHoverTrigger (this.mouseTriggers[i].func);
            } else if (this.mouseTriggers[i].type == "enter") {
                newObject.addOnMouseEnterTrigger (this.mouseTriggers[i].func);
            } else if (this.mouseTriggers[i].type == "exit") {
                newObject.addOnMouseExitTrigger (this.mouseTriggers[i].func);
            } 
        }

        for (var i = 0; i < this.children.length; i++) {
            newObject.children.push (this.children[i].clone ());
        }

        return newObject;
    }
}


class sceneGraph {
	constructor () {
		this.root = new object ();
		this.root.children = [];

        this.root.tag = "root";
	}

	drawTree (type) {
		var CTM = mat4.create ();
		var PC = mat4.create ();
        var PL = mat4.create ();

        if (type == "shadow") {
            mat4.mul (PC, lightsManager.lightSources[0].projectionMatrix, lightsManager.lightSources[0].matrix);
            mat4.mul (PL, lightsManager.lightSources[0].projectionMatrix, lightsManager.lightSources[0].matrix);
        } else {
            mat4.mul (PC, cam.perspectiveProjectionMatrix, cam.matrix);
            mat4.mul (PL, lightsManager.lightSources[0].projectionMatrix, lightsManager.lightSources[0].matrix);
        }
		mat4.mul (PC, cam.perspectiveProjectionMatrix, cam.matrix);

		for (var i = 0; i < this.root.children.length; i++) {
			this.__drawTree_AUX (this.root.children[i], CTM, PC, PL, 1.0, type);
		}
	}

	__drawTree_AUX (root, CTM, PC, PL, scaling, type) {
		if (!root.active)
			return;

        if (type == "shadow") {
            var CTM_prime = mat4.create ();
            mat4.mul (CTM_prime, CTM, root.transform.matrix);
            var scaling_prime = scaling * root.transform.scale[0];
            root.collider.matrix = mat4.clone (CTM_prime);
            if (root.collider.type == "null") {
                this.drawNode (root);
            } else if (root.collider.type == "box") {
                if (root.collider.inFustrum (PC) || root.collider.inFustrum (PL)) {
                    this.drawNode (root);
                } else {
                    //console.log ("HERE");
                }
            } else if (root.collider.type == "sphere") {
                root.collider.scaling = scaling_prime;
                if (root.collider.inFustrum (PC) || root.collider.inFustrum (PL)) {
                    this.drawNode (root);
                } else {
                    //console.log ("HERE");
                }
            } else if (root.collider.type == "polygon") {
                if (root.collider.inFustrum (PC) || root.collider.inFustrum (PL)) {
                    this.drawNode (root);
                } else {
                    //console.log ("HERE");
                }
            }
            //CollisionManager.objects.push (root);
            for (var i = 0; i < root.children.length; i++) {
                this.__drawTree_AUX (root.children[i], CTM_prime, PC, PL, scaling_prime);
            }
       } else if (type != "color" || root.tag != "world") {
    		if (root.collider.type == "null") {
                this.drawNode (root);
            } else if (root.collider.type == "box") {
                if (root.collider.inFustrum (PC) || root.collider.inFustrum (PL)) {
                    this.drawNode (root);
                } else {
                    //console.log ("HERE");
                }
            } else if (root.collider.type == "sphere") {
                if (root.collider.inFustrum (PC) || root.collider.inFustrum (PL)) {
                    this.drawNode (root);
                } else {
                    //console.log ("HERE");
                }
            } else if (root.collider.type == "polygon") {
                if (root.collider.inFustrum (PC) || root.collider.inFustrum (PL)) {
                    this.drawNode (root);
                } else {
                    //console.log ("HERE");
                }
            }
        }

        for (var i = 0; i < root.children.length; i++) {
            this.__drawTree_AUX (root.children[i], CTM_prime, PC, PL, scaling_prime, type);
        }
	}

	drawNode (obj) {
        obj.setup ();
        obj.draw ();
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

    updateTree (dTime) {
        for (var i = 0; i < this.root.children.length; i++) {
            this.__updateTree_AUX (dTime, this.root.children[i]);
        }
    }

    __updateTree_AUX (dTime, root) {
        if (!root.active)
            return;

        root.update (dTime);

        for (var i = 0; i < root.children.length; i++) {
            this.__updateTree_AUX (dTime, root.children[i]);
        }
    }
}


function buildSceneGraph () {
	SGraph.root.children.push (cubes[0]);
	SGraph.root.children.push (cubes[1]);
    //SGraph.root.children.push (cubes[4]);
    SGraph.root.children.push (cubes[5]);

	SGraph.root.children[1].children.push (cubes[2]);
    SGraph.root.children[1].children[0].children.push (cubes[3]);
}

function drawSceneGraph (dTime) {
   
    //CollisionManager.detectAllColisions ();
    SGraph.updateTree (dTime);
    lightsManager.setupAll ();
    //CollisionManager.objects = [];

    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable (gl.CULL_FACE);
    gl.cullFace (gl.FRONT);
    gl.bindFramebuffer (gl.FRAMEBUFFER, frameBufferObject);
    gl.viewport (0, 0, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT);
    gl.uniform1i (gl.getUniformLocation (program, "uShadow"), true); 
    gl.uniform1i (gl.getUniformLocation (program, "fShadow"), true); 

    SGraph.drawTree ("shadow");

    gl.disable (gl.CULL_FACE);
    gl.clear (gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer (gl.FRAMEBUFFER, null);
    gl.uniform1i (gl.getUniformLocation (program, "uShadow"), null); 
    gl.uniform1i (gl.getUniformLocation (program, "fShadow"), null); 

    gl.viewport (0, 0, canvas.width, canvas.height);
    gl.bindFramebuffer (gl.FRAMEBUFFER, colorFramebuffer);
    gl.uniform1i (gl.getUniformLocation (program, "fOffscreen"), true);

    SGraph.drawTree ("color");

    gl.readPixels (canvas.width / 2, canvas.height / 2, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, clickManager.pixel);
    clickManager.handleMouseEvents ();

    gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1i (gl.getUniformLocation (program, "fOffscreen"), null);
    gl.bindFramebuffer (gl.FRAMEBUFFER, null);

    gl.activeTexture (gl.TEXTURE1);
    gl.uniform1i (gl.getUniformLocation (program, "shadowMap"), 1);
    gl.bindTexture (gl.TEXTURE_2D, frameBufferObject.texture);

    SGraph.drawTree ("main");
}


