define(['app/core', 'game/vector2', 'game/collision/rectangle'], function(core, Vector2, bRect) {
    return function(x, y, width, height){

        this.TYPE = 'WALL';
        this.size = new Vector2(width, height);
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(1, 0);
        this.speed = 0;

        this.bounds = new bRect(x, y, width, height);

        this.update = function(deltaTime){

        }

        this.addForce = function(){

        }
    }
});