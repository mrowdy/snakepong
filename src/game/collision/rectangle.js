define(['app/core', 'game/vector2', 'game/collision/polygon'], function(core, Vector2, Polygon) {
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

        this.toPolygon = function(){
            return new Polygon(this.position.x, this.position.y, [
                new Vector2(-this.size.x / 2, -this.size.y /2),
                new Vector2( this.size.x / 2, -this.size.y /2),
                new Vector2(-this.size.x / 2,  this.size.y /2),
                new Vector2( this.size.x / 2,  this.size.y /2)
            ]);
        }
    }
});