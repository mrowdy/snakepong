define(['app/core', 'game/math/vector2'], function(core, Vector2) {
    'use strict';

    return function(x, y, points){

        this.TYPE = 'POLYGON';
        this.position = new Vector2(x, y);
        this.points = points || [];
        this.edges = [];
        this.normals = [];

        this.set = function(v, points){
            this.position.x = v.x;
            this.position.y = v.y;

            if(points){
                this.points = points;
            }

            this.calc();
        };

        this.calc = function(){

            var points = this.points;
            var len = points.length;
            this.edges = [];
            this.normals = [];
            for (var i = 0; i < len; i++) {
                var p1 = points[i];
                var p2 = i < len - 1 ? points[i + 1] : points[0];
                var e = new Vector2().copyFrom(p2).sub(p1);
                var n = new Vector2().copyFrom(e).perp().nor();
                this.edges.push(e);
                this.normals.push(n);
            }
        };

        this.calc();
    };
});