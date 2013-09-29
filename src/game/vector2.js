define(['app/core'], function(core) {
    return function(x, y){
        this.x = x || 0;
        this.y = y || 0;

        this.reset = function(x, y ) {
            this.x = x;
            this.y = y;
            return this;
        }

        this.copyTo = function(v) {
            v.x = this.x;
            v.y = this.y;
        }

        this.copyFrom = function(v) {
            this.x = v.x;
            this.y = v.y;
        }

        this.add = function(v){
            this.x += v.x
            this.y += v.y
        }

        this.addX = function(x){
            this.x += x
        }

        this.addY = function(y){
            this.y += y
        }

        this.sub = function(v){
            this.x -= v.x
            this.y -= v.y
        }

        this.subX = function(x){
            this.x -= x
        }

        this.subY = function(y){
            this.y -= y
        }

        this.mul = function(v){
            this.x *= v.x;
            this.y *= v.y;
        }

        this.mulScalar = function(scalar){
            this.x *= scalar;
            this.y *= scalar;
        }

    }
});