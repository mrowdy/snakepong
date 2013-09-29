define(['app/core', 'game/vector2', 'game/collision/circle'], function(core, Vector2, bCircle) {
    return function(x, y, radius){

        this.TYPE = 'BALL';
        this.radius = radius;
        this.size = new Vector2(radius * 2, radius * 2);
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(5, 0);
        this.speed = 1;
        this.friction = 0.001;

        this.bounds = new bCircle(x, y, radius * 2, radius * 2);

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