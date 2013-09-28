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

    }
});