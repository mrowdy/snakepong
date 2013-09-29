define(['app/core', 'game/vector2'], function(core, Vector2) {
    return function(x, y, width, height){

        this.TYPE = 'RECT';
        this.size = new Vector2(width, height);
        this.position = new Vector2(x, y);

        this.update = function(pos, size){
            this.position = pos;
            if(size){
                this.size = size;
            }
        }

        this.set = function(v){
            this.position.x = v.x;
            this.position.y = v.y;
        }
    }
});