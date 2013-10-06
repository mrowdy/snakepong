define(['app/core', 'game/math/vector2', 'game/collision/polygon'], function(core, Vector2, Polygon) {
    'use strict';

    return function(x, y, width, height){

        this.TYPE = 'RECT';
        this.size = new Vector2(width, height);
        this.position = new Vector2(x, y);

        var topRight = new Vector2();
        var bottomLeft = new Vector2();

        this.update = function(pos, size){
            this.position = pos;
            if(size){
                this.size = size;
            }
            this.updateCorners();
        };

        this.updateCorners = function(){
            topRight.reset(
                this.position.x + this.size.x / 2,
                this.position.y + this.size.y / 2
            );

            bottomLeft.reset(
                this.position.x - this.size.x / 2,
                this.position.y - this.size.y / 2
            );
        };

        this.set = function(v){
            this.position.copyFrom(v);
            this.updateCorners();
        };

        this.toPolygon = function(){
            return new Polygon(this.position.x, this.position.y, [
                new Vector2(-this.size.x / 2, -this.size.y /2),
                new Vector2( this.size.x / 2, -this.size.y /2),
                new Vector2(-this.size.x / 2,  this.size.y /2),
                new Vector2( this.size.x / 2,  this.size.y /2)
            ]);
        };

        this.getTopRight = function(){
            return topRight;
        };

        this.getBottomLeft = function(){
            return bottomLeft;
        };

        this.updateCorners();
    };
});