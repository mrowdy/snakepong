define(['app/core', 'game/math/vector2'], function(core, Vector2) {
    return function(){

        this.a = null;
        this.b = null;
        this.overlapN = new Vector2();
        this.overlapV = new Vector2();
        this.overlap = Number.MAX_VALUE;
        this.aInB = true;
        this.bInA = true;

        this.clear = function() {
            this.aInB = true;
            this.bInA = true;
            this.overlap = Number.MAX_VALUE;
            return this;
        };
    }
});