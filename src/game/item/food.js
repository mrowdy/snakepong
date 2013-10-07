define(['app/core', 'game/math/vector2', 'game/collision/rectangle'], function(core, Vector2, Rectangle) {
    'use strict';

    return function(x, y, radius){

        this.TYPE = 'FOOD';
        this.radius = radius;

        this.size = new Vector2(radius * 2, radius * 2);
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);

        this.speed = 1;
        this.friction = 0.000;
        this.affectedByGravity = true;

        this.collidable = false;
        this.static = false;
        this.bounds = new Rectangle(x, y, radius*2, radius*2);

        var acceleration = new Vector2();

        this.update = function(deltaTime){
            acceleration = acceleration.copyFrom(this.velocity);
            acceleration.mul(this.speed * deltaTime);
            this.position.add(acceleration);
            this.bounds.set(this.position);
            this.velocity.mul( 1 - this.friction);
        };

        this.addForce = function(v){
            this.velocity.add(v);
        };
    };
});