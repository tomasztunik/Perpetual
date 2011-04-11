/*
 * set of static helper methods for 2d Vector math 
 */

var Vect2 = {}; 

Vect2.add = function(v1, v2) {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
}

Vect2.add$ = function(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
    return v1;
}

Vect2.dot = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

Vect2.divide = function(v, n) {
    return { x: v.x / n, y: v.y / n };
}

Vect2.divide$ = function(v, n) {
    v.x /= n;
    v.y /= n;
    return v;
}

Vect2.magnitude = function(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

Vect2.multiply = function(v, n) {
    return { x: v.x * n, y: v.y * n };
}

Vect2.multiply$ = function(v, n) {
    v.x *= n;
    v.y *= n;
    return v;
}

Vect2.normal = function(v) {
    return Vect2.divide(v, Vect2.magnitude(v));
}

Vect2.substract = function(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
}

Vect2.substract$ = function(v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
    return v1;
}