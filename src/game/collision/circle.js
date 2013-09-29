define(['app/core', 'game/vector2'], function(core, Vector2) {
    return function(x, y, rad){

        this.TYPE = 'CIRCLE';
        this.radius = rad;
        this.position = new Vector2(x, y);

        this.update = function(pos, rad){
            this.position = pos;
            if(rad){
                this.radius = radius;
            }
        }

        this.set = function(v){
            this.position.x = v.x;
            this.position.y = v.y;
        }
    }
});