define(['app/core', 'game/math/vector2', 'game/collision/rectangle', 'game/math/spring'], function(core, Vector2, bRectangle, Spring) {
    return function(x, y, radius){

        this.TYPE = 'BALL';
        this.radius = radius;
        this.size = new Vector2(radius * 2, radius * 2);
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.speed = 1;
        this.friction = 0.000;
        this.affectedByGravity = true;
        this.noCollision = false;
        this.springs = [];

        this.childs = [];

        this.bounds = new bRectangle(x, y, radius*2, radius*2);

        this.update = function(deltaTime){
            var acceleration = new Vector2(this.velocity.x, this.velocity.y);
            acceleration.mulScalar(this.speed * deltaTime);
            for(var i = 0; i < this.springs.length; i++){
                this.springs[i].update();
            }
            this.position.add(acceleration);
            this.bounds.set(this.position);
            this.velocity.mulScalar( 1 - this.friction);
        }

        this.addForce = function(v){
            this.velocity.add(v);
        }

        this.addChild = function(child){
            this.childs.push(child);
            var spring = new Spring(this, child, 0.99, 0.1, child.radius + this.radius + 1);
            this.springs.push(spring);
        }

        this.resting = function() {
            return this.static || this.velocity.isZero();
        }

    }
});