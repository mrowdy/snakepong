define(['app/core', 'game/math/vector2', 'game/collision/rectangle'], function(core, Vector2, bRectangle) {
    return function(x, y, radius){

        this.TYPE = 'BALL';
        this.radius = radius;
        this.size = new Vector2(radius * 2, radius * 2);
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.speed = 1;
        this.friction = 0.001;
        this.affectedByGravity = true;

        this.bounds = new bRectangle(x, y, radius*2, radius*2);

        this.update = function(deltaTime){
            var acceleration = new Vector2(this.velocity.x, this.velocity.y);
            acceleration.mulScalar(this.speed * deltaTime);
            this.position.add(acceleration);
            this.bounds.set(this.position);
            this.velocity.mulScalar( 1 - this.friction);
        }

        this.addForce = function(v){
            this.velocity.add(v);
        }
    }
});