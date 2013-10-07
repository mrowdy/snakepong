define(['app/core', 'game/math/vector2', 'game/collision/rectangle'], function(core, Vector2, Rectangle) {
    'use strict';

    return function(x, y, width, height){

        this.TYPE = 'WALL';
        this.size = new Vector2(width, height);
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);

        this.speed = 0;
        this.friction = 0;
        this.affectedByGravity = false;
        this.initPosition = new Vector2(x, y);

        this.collidable = true;
        this.static = true;
        this.bounds = new Rectangle(x, y, width, height);

        var acceleration = new Vector2();

        this.update = function(deltaTime){
            acceleration = acceleration.copyFrom(this.velocity);
            acceleration.mul(this.speed * deltaTime);
            this.position.add(acceleration);
            this.bounds.set(this.position);
            this.velocity.mul( 1 - this.friction);

            this.position.copyFrom(this.initPosition);
        };

        this.addForce = function(v){
            this.velocity.add(v);
        };
    };
});