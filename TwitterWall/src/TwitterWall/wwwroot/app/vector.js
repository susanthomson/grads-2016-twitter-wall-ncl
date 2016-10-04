"use strict";
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.subtract = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);
    };
    Vector.prototype.divide = function (d) {
        return new Vector(this.x / d, this.y / d);
    };
    return Vector;
}());
exports.Vector = Vector;
//# sourceMappingURL=vector.js.map