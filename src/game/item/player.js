define(['app/core', 'game/math/vector2', 'game/collision/rectangle'], function(core, Vector2, bRect) {
    return function(x, y, width, height){

        this.TYPE = 'PLAYER';
        this.size = new Vector2(width, height);
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.speed = 1;
        this.friction = 0.0011;
        this.affectedByGravity = false;
        this.static = true;
        this.ballTouches = 0;

        this.bounds = new bRect(x, y, width, height);

        this.update = function(deltaTime){
            var acceleration = new Vector2(this.velocity.x, this.velocity.y);
            acceleration.mulScalar(this.speed * deltaTime);
            this.position.add(acceleration);
            this.bounds.set(this.position);
            this.velocity.mul( 1 - this.friction);
        }

        this.addForce = function(v){
            this.velocity.add(v);
        }

        this.collision = function(other){
            if(other.TYPE == 'BALL'){
                this.ballTouches++;
            }
        }
    }
});