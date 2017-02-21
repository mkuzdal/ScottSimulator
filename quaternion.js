/** @file: quaternion.js:
 *  Bare-bone Quaternion library created by Matthew P. Kuzdal
 *  This library supports no exceptions so all paramaters sent must be 
 *  of the proper type.
 *  This library was created to be used in conjunction with MV.js
 */

/** quternionToMat: converts a quaternion into its matrix form.
 *  @prefix: the quaternion MUST be normalized!
 *  @param { vec4 } v: the quaternion to convert.
 *  @ret { mat4 } ret: the matrix representation of the quaternion.
 */
function quaternionToMat (v) {

    var mat0 = vec4 (1 - 2 * (Math.pow (v[1], 2) + Math.pow (v[2], 2)), 2 * (v[0] * v[1] - v[3] * v[2]), 2 * (v[0] * v[2] + v[3] * v[1]), 0);
    var mat1 = vec4 (2 * (v[0] * v[1] + v[3] * v[2]), 1 - 2 * (Math.pow (v[0], 2) + Math.pow (v[2], 2)), 2 * (v[1] * v[2] - v[3] * v[0]), 0);
    var mat2 = vec4 (2 * (v[0] * v[2] - v[3] * v[1]), 2 * (v[1] * v[2] + v[3] * v[0]), 1 - 2 * (Math.pow (v[0], 2) + Math.pow (v[1], 2)), 0);
    var mat3 = vec4 (0, 0, 0, 1);

    var ret = mat4 (mat0, mat1, mat2, mat3);
    return ret;
}

/** quatToAngle: gets the angle from a quaternion.
 *  @param { vec4 } quat: the quaternion to get the angle from.
 *  @ret { float } ret: the angle from the quaternion (in degrees).
 */
function quatToAngle (quat) {
    var angle = 180 / Math.PI * 2 * Math.acos (quat[3]);
    if (quat[0] < 0 || quat[1] < 0 || quat[2] < 0) {
        angle *= -1;
    }
    return angle;
}

/** quatToAxis: gets the axis from a quaternion.
 *  @param { vec4 } quat: the quaternion to get the axis from.
 *  @ret { vec3 } ret: the axis from the quaternion.
 */
function quatToAxis (quat) {
    var temp = Math.sqrt (1 - quat[3] * quat[3]);
    var x = quat[0] / temp;
    var y = quat[1] / temp;
    var z = quat[2] / temp;

    return normalize (vec3 (x, y, z));
}

/** eulerToQuat: converts the 3 euler angles into a quaternion.
 *  @param { float } yaw: the yaw angle (in degrees).
 *  @param { float } yaw: the yaw angle (in degrees).
 *  @param { float } yaw: the yaw angle (in degrees).
 *  @ret { vec4 } quat: the normalized quaternion vector in the form (x, y, z, w).
 */
function eulerToQuat (yaw, pitch, roll) {
 
    var c1 = Math.cos (yaw * Math.PI / 360);
    var c2 = Math.cos (roll * Math.PI / 360);
    var c3 = Math.cos (pitch * Math.PI / 360);
    var s1 = Math.sin (yaw * Math.PI / 360);
    var s2 = Math.sin (roll * Math.PI / 360);
    var s3 = Math.sin (pitch * Math.PI / 360);

    var quat = vec4 ();
    quat[0] = s1 * s2 * c3 + c1 * c2 * s3 // x
    quat[1] = s1 * c2 * c3 + c1 * s2 * s3 // y
    quat[2] = c1 * s2 * c3 - s1 * c2 * s3 // z
    quat[3] = c1 * c2 * c3 - s1 * s2 * s3 // w

    quat = normalize (quat);

    return quat;
}

/** angleAxisToQuat: converts an angle and an axis into a quaternion.
 *  @param { float } angle: the rotation angle to build the quaternion (in degrees).
 *  @param { vec3 } axis: the angle to rotate around.
 *  @ret { vec4 } ret: the quaternion variable.
 */
function angleAxisToQuat (angle, axis) {
    var s1 = Math.sin (angle * Math.PI / 360);

    var x = axis[0] * s1;
    var y = axis[1] * s1;
    var z = axis[2] * s1;
    var w = Math.cos (angle * Math.PI / 360);

    return normalize (vec4 (x, y, z, w));
}

/** conjugate: gets the conjugate of a quaternion.
 *  @param { vec4 } quat: the quaternion to get the conjugate of.
 *  @ret { vec4 } ret: the conjugate quaternion.
 */
function conjugate (quat) {
    return vec4 (-quat[0], -quat[1], -quat[2], quat[3]);
}

/** quatAdd: adds two quaternions using quaternion math.
 *  @param { vec4 } q1: the first quaternion to add.
 *  @param { vec4 } q2: the second quaternion to add.
 *  @ret { vec4 } ret: the resulting sum of the two quaternions.
 */
function quatAdd (q1, q2) {
    var a = q1[3];
    var b = q1[0];
    var c = q1[1];
    var d = q1[2];
    var e = q2[3];
    var f = q2[0];
    var g = q2[1];
    var h = q2[2];

    return normalize (vec4 (b + f, c + g, d + h, a + e));
}

/** quatSub: subtracts two quaternions using quaternion math.
 *  @param { vec4 } q1: the first quaternion to subtract.
 *  @param { vec4 } q2: the second quaternion to subtract.
 *  @ret { vec4 } ret: the resulting differece of the two quaternions.
 */
function quatSub (q1, a2) {
    var a = q1[3];
    var b = q1[0];
    var c = q1[1];
    var d = q1[2];
    var e = q2[3];
    var f = q2[0];
    var g = q2[1];
    var h = q2[2];

    return normalize (vec4 (b - f, c - g, d - h, a - e));
}

/** quatMult: multiplies two quaternions using quaternion math.
 *  @param { vec4 } q1: the first quaternion to multiply.
 *  @param { vec4 } q2: the second quaternion to multiply.
 *  @ret { vec4 } ret: the resulting product of the two quaternions.
 */
function quatMult (q1, q2) {
    var a = q1[3];
    var b = q1[0];
    var c = q1[1];
    var d = q1[2];
    var e = q2[3];
    var f = q2[0];
    var g = q2[1];
    var h = q2[2];

    var x = b * e + a * f + c * h - d * g;
    var y = a * g - b * h + c * e + d * f;
    var z = a * h + b * g - c * f + d * e;
    var w = a * e - b * f - c * g - d * h;

    return normalize (vec4 (x, y, z, w));
}

/** quatRight: returns the right direction given a quaternion.
 *  @param { vec4 } q: the quaternion to get the direction for.
 *  @ret { vec3 } ret: the right direction of the quaternion.
 */
function quatRight (q) {
    var temp = quaternionToMat (q);
    return normalize (vec3 (temp[0][0], temp[0][1], temp[0][2]));
}

/** quatUp: returns the upwards direction given a quaternion.
 *  @param { vec4 } q: the quaternion to get the direction for.
 *  @ret { vec3 } ret: the upwards direction of the quaternion.
 */
function quatUp (q) {
    var temp = quaternionToMat (q);
    return normalize (vec3 (temp[1][0], temp[1][1], temp[1][2]));
} 

/** quatFront: returns the forwards direction given a quaternion.
 *  @param { vec4 } q: the quaternion to get the direction for.
 *  @ret { vec3 } ret: the forwards direction of the quaternion.
 */
function quatFront (q) {
    var temp = quaternionToMat (q);
    return normalize (vec3 (-temp[2][0], -temp[2][1], -temp[2][2]));
}  

/** slerp: Spherical Linear Interpolation function.
 *  @param { vec4 } q1: the initial quaternion.
 *  @param { vec4 } q2: the quaternion to interpolate to.
 *  @param { float } u: the interpolation factor (0 <= u <= 1).
 *  @ret { vec4 } ret: the resulting quaternion.
 */
function slerp (q1, q2, u) {
    var omega = dot (q1, q2);
    var s1 = Math.sin ((1-u) * omega) / Math.sin (omega);
    var s2 = Math.sin (u * omega) / Math.sin (omega);

    var toLerp = add (scale2 (s1, q1), scale2 (s2, q2));

    return normalize (toLerp);
}

/** @endfile: quaternion.js */
