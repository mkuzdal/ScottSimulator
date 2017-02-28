
class mouseTrigger {
    constructor (_object, _function, type) {
        this.func = _function;
        this.object = _object;
        this.type = type;

        clickManager.addTrigger (this);
    }

    setup () {
        var storage = vec4.create ();
        vec4.divide (storage, this.ID, vec4.fromValues (255.0, 255.0, 255.0, 255.0));
        gl.uniform4fv (gl.getUniformLocation (program, "fTriggerID"), storage);   
    }
}

class triggerHandler {
    constructor () {
        this.clicked = false;
        this.pixel = new Uint8Array (4);
        this.triggers = [];
        this.hover = [];
        this.currentID = vec4.fromValues (16.0, 0.0, 0.0, 255.0);
    }

    addTrigger (trigger) {
        for (var i = 0; i < this.triggers.length; i++) {
            if (this.triggers[i].object == trigger.object) {
                trigger.ID = this.triggers[i].ID;
                this.triggers.push (trigger);
                return;
            }
        }

        trigger.ID = vec4.clone (this.currentID);

        for (var i = 0; i < 3; i++) {
            if (this.currentID[i] == 255.0)
                continue;
            else {
                this.currentID[i] += 16;
                break;
            }
        }
        this.triggers.push (trigger);
    }

    handleMouseEvents () {
        
        for (var i = 0; i < this.triggers.length; i++) {
            if (vec4.equals(this.pixel, this.triggers[i].ID)) { 
                if (this.triggers[i].type == "click" && this.clicked == true) {
                    this.triggers[i].func (this.triggers[i].object);
                } else if (this.triggers[i].type == "hover") {
                    this.triggers[i].func (this.triggers[i].object);
                } else if (this.triggers[i].type == "enter" || this.triggers[i].type == "exit") {
                    var inHover = false;
                    for (var j = 0; j < this.hover.length; j++) {
                        if (this.hover[j] == this.triggers[i]) {
                            inHover = true;
                            break;
                        }
                    }
                    if (!inHover) {
                        if (this.triggers[i].type == "enter") {
                            this.triggers[i].func (this.triggers[i].object);
                        }
                        this.hover.push (this.triggers[i]);
                    }
                }
            } else {
                for (var j = 0; j < this.hover.length; j++) {
                    if (vec4.equals (this.hover[j].ID, this.triggers[i].ID)) {
                        if (this.hover[j].type == "exit") {
                            this.hover[j].func (this.hover[j].object);
                        }
                        this.hover.splice (j, 1);
                    }
                }
            }
        } 
        this.clicked = false;    
    }
}

class polygonCollider {
    constructor (_vertices) {
        this.vertices = _vertices;
        this.type = "polygon"
    }

    inFustrum (PC, M) {
        var PCM = mat4.create ();
        mat4.mul (PCM, PC, M);

        var p_prime = [];
        for (var i = 0; i < this.vertices.length; i++) {
            var storage = vec4.create ();
            p_prime.push (vec4.transformMat4 (storage, this.vertices[i], PCM));
        }

        var toDraw = false;

        // check right plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][0] < p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check left plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][0] > -p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check top plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][1] < p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check bottom plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][1] > -p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check far plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][2] < p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check near plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][2] > 0) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }

        return true;
    }

    intersectingBox (PC, other, M1, M2) {
        var PCM1 = mat4.create ();
        mat4.mul (PCM, PC, M1);

        var PCM2 = mat4.create ();
        mat4.mul (PCM, PC, M2);

        var p1_prime = [];
        for (var i = 0; i < this.vertices.length; i++) {
            var storage = vec4.create ();
            p1_prime.push (vec4.transformMat4 (storage, this.vertices[i], PCM1));
        }

        var other_maxX = 0;
        var other_minX = 10000;
        var other_maxY = 0;
        var other_minY = 10000;
        var other_maxZ = 0;
        var other_minZ = 10000;

        for (var i = 0; i < other.vertices.length; i++) {
            var p2_prime = vec4.create ();
            vec4.transformMat4 (p2_prime, other.vertices[i], PCM2);
            other_maxX = Math.max (other_maxX, p2_prime[0]);
            other_minX = Math.min (other_minX, p2_prime[0]);
            other_maxY = Math.max (other_maxY, p2_prime[1]);
            other_minY = Math.min (other_minY, p2_prime[1]);
            other_maxZ = Math.max (other_maxZ, p2_prime[2]);
            other_minZ = Math.min (other_minZ, p2_prime[2]);
        }

        for (var i = 0; i < p1_prime.length; i++) {
            if ((p1_prime[i][0] >= other_minX && p1_prime[i][0] <= other_maxX) &&
                (p1_prime[i][1] >= other_minY && p1_prime[i][1] <= other_maxY) &&
                (p1_prime[i][2] >= other_minZ && p1_prime[i][2] <= other_maxZ))
                return true;
        }

        return false;
    }
}

class boxCollider {
    constructor (_min, _max) {
        this.min = _min;
        this.max = _max;
        this.type = "box";

        this.min = vec4.fromValues (this.min[0], this.min[1], this.min[2], 1.0);
        this.max = vec4.fromValues (this.max[0], this.max[1], this.max[2], 1.0);

        this.vertices = [];
        this.vertices.push (vec4.fromValues (this.min[0], this.min[1], this.min[2], 1.0));
        this.vertices.push (vec4.fromValues (this.min[0], this.min[1], this.max[2], 1.0));
        this.vertices.push (vec4.fromValues (this.min[0], this.max[1], this.min[2], 1.0));
        this.vertices.push (vec4.fromValues (this.min[0], this.max[1], this.max[2], 1.0));
        this.vertices.push (vec4.fromValues (this.max[0], this.min[1], this.min[2], 1.0));
        this.vertices.push (vec4.fromValues (this.max[0], this.min[1], this.max[2], 1.0));
        this.vertices.push (vec4.fromValues (this.max[0], this.max[1], this.min[2], 1.0));
        this.vertices.push (vec4.fromValues (this.max[0], this.max[1], this.max[2], 1.0));
    }

    inFustrum (PC, M) {
        var PCM = mat4.create ();
        mat4.mul (PCM, PC, M);

        var p_prime = [];
        for (var i = 0; i < this.vertices.length; i++) {
            var storage = vec4.create ();
            p_prime.push (vec4.transformMat4 (storage, this.vertices[i], PCM));
        }

        var toDraw = false;

        // check right plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][0] < p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check left plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][0] > -p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check top plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][1] < p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check bottom plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][1] > -p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check far plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][2] < p_prime[i][3]) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }
        toDraw = false;

        // check near plane:
        for (var i = 0; i < p_prime.length; i++) {
            if (p_prime[i][2] > 0) {
                toDraw = true;
                break;
            }
        }
        if (!toDraw) {
            return false;
        }

        return true;
    }
}

class sphereCollider {
    constructor (_center, _radius) {
        this.center = _center;
        this.radius = _radius;
        this.type = "sphere"
    }

    inFustrum (PC, c, r) {
        var d, A, B, C, D;

        // check right plane:
        A = PC[3]  - PC[0];
        B = PC[7]  - PC[4];
        C = PC[11] - PC[8];
        D = PC[15] - PC[12];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check left plane:
        A = PC[3]  + PC[0];
        B = PC[7]  + PC[4];
        C = PC[11] + PC[8];
        D = PC[15] + PC[12];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check top plane:
        A = PC[3]  - PC[1];
        B = PC[7]  - PC[5];
        C = PC[11] - PC[9];
        D = PC[15] - PC[13];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check bottom plane:
        A = PC[3]  + PC[1];
        B = PC[7]  + PC[5];
        C = PC[11] + PC[9];
        D = PC[15] + PC[13];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check far plane:
        A = PC[3]  - PC[2];
        B = PC[7]  - PC[6];
        C = PC[11] - PC[10];
        D = PC[15] - PC[14];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        // check near plane:
        A = PC[2];
        B = PC[6];
        C = PC[10];
        D = PC[14];

        var mag = Math.sqrt (A * A + B * B + C * C);
        A = A / mag;
        B = B / mag;
        C = C / mag;
        D = D / mag;
        d = A * c[0] + B * c[1] + C * c[2] + D;

        if (d + r < 0) {
            return false;
        } 

        return true;
    }

    intersectingSphere (PC, other, T1, T2) {
        var c1 = vec3.create ();
        vec3.transformMat4 (c, this.center, T1);

        var c2 = vec3.create ();
        vec3.transformMat4 (c, this.center, T2);

        var d2 = vec3.squaredDistance (c2, c1);
        var r2 = (this.radius + other.radius) * (this.radius + other.radius);

        if (r2 > d2)
            return true;

        else return false;
    }

} 

/** geometry: an abstraction for a geometry object. Geometries manage and maintain
 *  all GLSL buffers, normals, and vertex attributes. 
 */
class geometry {
    /** constructor: builds an instance of a geometry object with given attributes.
     *  @param { vec3 [] } vertices: the array of vertices to represent the geometry.
     *  @param { vec4 [] } normals: the array of normals to represent the geometry.
     */
    constructor (_vertices, _normals) {
        this.Nvertices = _vertices.length;
        this.Nnormals = _normals.length;

        this.nBuffer = gl.createBuffer();
        gl.bindBuffer (gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, flattenArray (_normals), gl.STATIC_DRAW);

        this.vBuffer = gl.createBuffer ();
        gl.bindBuffer (gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, flattenArray (_vertices), gl.STATIC_DRAW);
    }

    /** setup: enables all buffers and sets the vertex and normal attributes.
     */
    setup () {
        gl.bindBuffer (gl.ARRAY_BUFFER, this.vBuffer);
        var vPosition = gl.getAttribLocation (program, "vPosition");
        gl.vertexAttribPointer (vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray (vPosition);

        gl.bindBuffer (gl.ARRAY_BUFFER, this.nBuffer);
        var vNormal = gl.getAttribLocation (program, "vNormal");
        gl.vertexAttribPointer (vNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray (vNormal); 
    }
}

/** material: an abstraction for a material object. Materials represent the color
 *  for a model and the type of shading to render the model with. Materials also handle
 *  setting up all gl uniforms having to do with shading.
 */
class material {
    /** constructor: builds an instance of a material object with given attributes.
     *  @param { vec4 } ambient: the effective RGB values for the materials ambient lighting.
     *  @param { vec4 } diffuse: the effective RGB values for the materials diffuse lighting.
     *  @param { vec4 } specular: the effective RGB values for the materials specular lighting.
     *  @param { float } shinines: defines the shininess of the material.
     *  @param { int } shader: the type of shading to use (see shading types above).
     */
    constructor (_ambient, _diffuse, _specular, _shininess) {
        this.ambient = _ambient     || vec4.fromValues (1.0, 0.0, 1.0, 1.0);
        this.diffuse = _diffuse     || vec4.fromValues (1.0, 0.8, 0.0, 1.0);
        this.specular = _specular   || vec4.fromValues (1.0, 1.0, 1.0, 1.0);
        this.shininess = _shininess || 50.0;
    }

    /** setup: enables all uniform variables to define the shading. 
     */
    setup () {
        gl.uniform4fv (gl.getUniformLocation (program, "fAmbientMaterial"), this.ambient);
        gl.uniform4fv (gl.getUniformLocation (program, "fDiffuseMaterial"), this.diffuse);
        gl.uniform4fv (gl.getUniformLocation (program, "fSpecularMaterial"), this.specular);   
        gl.uniform1f  (gl.getUniformLocation (program, "fShininess"), this.shininess);
    }
}

/** texture: holds a set of vertices and image to define a texture. Automatically 
 *  creates and loads buffers.
 */
class texture {
    constructor (_image, _texCoords, _options) {
        this.image = _image;
        this.nCoords = _texCoords.length;
        this.options = _options || [[gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR], [gl.TEXTURE_MAG_FILTER, gl.NEAREST], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]];

        this.texture = gl.createTexture();
        gl.bindTexture (gl.TEXTURE_2D, this.texture);
        
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);
        gl.generateMipmap (gl.TEXTURE_2D);

        this.tBuffer = gl.createBuffer ();
        gl.bindBuffer (gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, flattenArray (_texCoords), gl.STATIC_DRAW);
    }

    setup () {
        // bind textures
        gl.uniform1i (gl.getUniformLocation (program, "texture"), 0);
        gl.activeTexture (gl.TEXTURE0);
        gl.bindTexture (gl.TEXTURE_2D, this.texture);


        gl.bindBuffer (gl.ARRAY_BUFFER, this.tBuffer);

        for (var i = 0; i < this.options.length; i++) {
            gl.texParameteri (gl.TEXTURE_2D, this.options[i][0], this.options[i][1]);
        }

        var vTexCoord = gl.getAttribLocation (program, "vTexCoord");
        gl.vertexAttribPointer (vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray (vTexCoord);
    }

    bindCoordinates (texCoords) {
        gl.bindBuffer (gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData (gl.ARRAY_BUFFER, flattenArray (texCoords), gl.STATIC_DRAW);
    }
}

/** transform: an abstraction for a transform object. Transforms represent the rotation, 
 *  position and rotation for a model. Transforms handle all object motion and creating the 
 *  model view matrices and normal matrices.
 */
class transform {
    /** constructor: builds an instance of a transform object with given attributes.
     *  @param { vec3 } position: the position of the object.
     *  @param { vec3 } scale: the x, y and z scaling of the object.
     *  @param { vec4 } rotation: the rotation quaternion of the object.
     */
    constructor (_position, _scale, _rotation) {
        this.position = _position   || vec3.fromValues (0.0, 0.0, 0.0);
        this.scale = _scale         || vec3.fromValues (1.0, 1.0, 1.0);
        this.rotation = _rotation   || quat.create ();

        this.matrix = mat4.create ();

        this.setMatrix();
    }

    /** update: event loop function. Currently just sets the matrices for the object.
     *  @param { float } dTime: the time since the last framce callback (in seconds).
     */
    update (dTime) {
        this.setMatrix ();
    }
 
    /** setMatrices: sets the model and normal matrices for an object.
     */
    setMatrix () {
        mat4.fromRotationTranslationScale (this.matrix, this.rotation, this.position, this.scale);
    }
}

