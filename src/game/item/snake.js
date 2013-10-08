define(['app/core', 'game/math/vector2', 'game/collision/rectangle', 'game/math/spring'], function(core, Vector2, Rectangle, Spring) {
    'use strict';

    return function(x, y, radius){

        this.TYPE = 'SNAKE';
        this.radius = radius;

        this.size = new Vector2(radius * 2, radius * 2);
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);

        this.speed = 3;
        this.friction = 0.000;
        this.affectedByGravity = true;

        this.collidable = true;
        this.static = false;
        this.bounds = new Rectangle(x, y, radius*2, radius*2);
        this.lastPlayerTouched;

        this.childs = [];
        this.springs = [];

        var acceleration = new Vector2(),
            i;

        this.update = function(deltaTime){
            if(this.TYPE == 'SNAKE'){
                this.velocity.nor().mul(this.speed);
            }

            this.correctDirection();
            acceleration = acceleration.copyFrom(this.velocity);
            acceleration.mul(this.speed * deltaTime);
            for(i = 0; i < this.springs.length; i++){
                this.springs[i].update();
            }

            this.position.add(acceleration);
            this.bounds.set(this.position);
            this.velocity.mul( 1 - this.friction);
        };

        this.addForce = function(v){
            this.velocity.add(v);
        };

        this.correctDirection = function(){
            if(this.TYPE == 'SNAKE'){
                if(Math.abs(this.velocity.x / this.velocity.y) < 1){
                    if(this.velocity.x >= 0){
                        this.velocity.x += 0.1;
                    } else {
                        this.velocity.x -= 0.1;
                    }
                }
            }
        }

        this.addChild = function(child){
            this.childs.push(child);
            var spring = new Spring(this, child, 0.40, 0.1, child.radius + this.radius );
            this.springs.push(spring);
        };

        this.resting = function() {
            return this.static || this.velocity.isZero();
        };
    };
});