define(['app/core', 'game/vector2'], function(core, Vector2) {
    return function(x, y, radius){

        this.TYPE = 'CIRCLE';
        this.radius = radius;
        this.size = new Vector2(radius * 2, radius * 2);
        this.position = new Vector2(x, y);

        this.set = function(v){
            this.position.x = v.x;
            this.position.y = v.y;
        }
    }
});