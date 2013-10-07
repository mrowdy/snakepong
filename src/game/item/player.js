define(['app/core', 'game/math/vector2', 'game/collision/rectangle'], function(core, Vector2, Rectangle) {
    'use strict';

    return function(x, y, width, height){

        this.TYPE = 'PLAYER';

        this.size = new Vector2(width, height);
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);

        this.speed = 1;
        this.friction = 0.002;
        this.affectedByGravity = false;

        this.collidable = true;
        this.static = false;
        this.bounds = new Rectangle(x, y, width, height);

        this.ballTouches = 0;
        this.initX = x;

        var acceleration = new Vector2();

        this.update = function(deltaTime){
            acceleration = acceleration.copyFrom(this.velocity);
            acceleration.mul(this.speed * deltaTime);
            this.position.add(acceleration);
            this.bounds.set(this.position);
            this.velocity.mul( 1 - this.friction);
            this.position.x = this.initX;
        };

        this.addForce = function(v){
            this.velocity.add(v);
        };

        this.up = function(){
            this.velocity.y += this.speed;
        };

        this.down = function(){
            this.velocity.y -= this.speed;
        };

        this.collision = function(other){
            if(other.TYPE === 'SNAKE'){
                this.ballTouches++;
                //this.speed *= 1.1;
                //other.velocity.mul(1.1);
            }
        };
    };
});