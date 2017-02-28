
var MAX_LIGHT_COUNT = 5;


class lightHandler {
    constructor () {
        this.lightCount = 0;
        this.lightSources = [];
    }

    addSource (light) {
        if (this.lightCount >= MAX_LIGHT_COUNT)
            return;

        for (var i = 0; i < this.lightCount; i++) {
            if (this.lightSources[i] === light) {
                return;
            }
        }

        light.lightID = this.lightCount;
        this.lightCount++;
        this.lightSources.push (light);
    }

    removeSource (light) {
        for (var i = 0; i < this.lightCount; i++) {
            if (this.lightSources[i] === light) {
                this.lightSources.splice (i, 1);
                this.lightCount--;
                return;
            }
        }
    }

    setupAll () {
        for (var i = 0; i < this.lightCount; i++) {
            this.lightSources[i].setup ();
        }
    }

    setupByTag (tag) {
        for (var i = 0; i < this.lightCount; i++) {
            if (this.lightSources[i].tag == tag) {
                this.lightSources[i].setup ();
            }
        }
    }

    activateAll () {
        for (var i = 0; i < this.lightCount; i++) {
            this.lightSources[i].active = true;
        }
    }

    activateByTag (tag) {
        for (var i = 0; i < this.lightCount; i++) {
            if (this.lightSources[i].tag == tag) {
                this.lightSources[i].active = true;
            }
        }
    }

    deactivateAll () {
        for (var i = 0; i < this.lightCount; i++) {
            this.lightSources[i].active = false;
        }
    }

    deactivateByTag (tag) {
        for (var i = 0; i < this.lightCount; i++) {
            if (this.lightSources[i].tag == tag) {
                this.lightSources[i].active = false;
            }
        }
    }

    toggleAll () {
        for (var i = 0; i < this.lightCount; i++) {
            this.lightSources[i].active = !this.lightSources[i].active;
        }
    }

    toggleByTag (tag) {
        for (var i = 0; i < this.lightCount; i++) {
            if (this.lightSources[i].tag == tag) {
                this.lightSources[i].active = !this.lightSources[i].active;
            }
        }
    }
}

/** light: an abstraction for a light object. Lights have a transform component defining
 *  its orientation and position in space as well as the ambient, diffuse and specular values
 *  that define it.
 */
class light {
    /** constructor: builds an instance of a light object with given attributes.
     *  @param { transform } transform: the orientation and position of the light source.
     *  @param { vec4 } ambient: the ambient value for the light
     *  @param { vec4 } diffuse: the diffuse value for the light.
     *  @param { vec4 } specular: the specular value for the light.
     */
    constructor (_transform, _ambient, _diffuse, _specular) {
        this.transform = _transform || new transform ();
        this.ambient = _ambient     || vec4.fromValues (0.2, 0.2, 0.2, 1.0);
        this.diffuse = _diffuse     || vec4.fromValues (0.4, 0.4, 0.4, 1.0);
        this.specular = _specular   || vec4.fromValues (0.6, 0.6, 0.6, 1.0);

        this.tag = "light"
        this.active = true;

        this.projectionMatrix = mat4.create ();
        this.matrix = mat4.create ();
    }   

    /** setup: sets up the lightposition uniform in the vertex shader.
     */
    setup () {
        var pos = [ this.transform.position[0], this.transform.position[1], this.transform.position[2], 1.0 ];

        gl.uniform4fv (gl.getUniformLocation (program, "fLightPosition[" + this.lightID + "]"), pos);
        gl.uniform4fv (gl.getUniformLocation (program, "fAmbientLight["  + this.lightID + "]"), this.ambient);

        if (this.active) {
            gl.uniform4fv (gl.getUniformLocation (program, "fDiffuseLight["  + this.lightID + "]"), this.diffuse);
            gl.uniform4fv (gl.getUniformLocation (program, "fSpecularLight[" + this.lightID + "]"), this.specular);
        } else {
            gl.uniform4fv (gl.getUniformLocation (program, "fDiffuseLight["  + this.lightID + "]"), vec4.fromValues (0.0, 0.0, 0.0, 0.0));
            gl.uniform4fv (gl.getUniformLocation (program, "fSpecularLight[" + this.lightID + "]"), vec4.fromValues (0.0, 0.0, 0.0, 0.0));
        }

        this.setPerspective ();
        this.setLightMatrix ();
    }

    /** setPerspective: sets the perspective projection matrix.
     */
    setPerspective () {
        //mat4.ortho (this.projectionMatrix, -10.0, 10.0, -10.0, 10.0, 1.0, 100.0);
        mat4.perspective (this.projectionMatrix, Math.PI * 70.0 / 180, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 1000.0);
    }

    /** setLightMatrix: sets the light view matrix.
     */
    setLightMatrix () {
        mat4.lookAt (this.matrix, this.transform.position, vec3.fromValues (0.0, 0.0, 0.0), vec3.fromValues (0.0, 1.0, 0.0));
    }
}

