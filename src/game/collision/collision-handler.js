define(['app/core', 'game/math/vector2', 'game/collision/sat', 'game/collision/response', 'game/collision/rectangle-collision', 'game/collision/spatial-hash-grid'], function(core, Vector2, Sat, Response, RectangleCollision, Grid) {
    'use strict';

    return function(width, height, cellsize){

        var items,
            item,
            sat,
            rectangleCollision,
            response,
            grid,
            potColliders = [],
            i = 0;

        var init = function(){
            sat = new Sat();
            grid = new Grid(width, height, cellsize, 10);
            rectangleCollision = new RectangleCollision();
            response = new Response();
        };

        this.check = function(itemsToCheck){
            items = itemsToCheck;
            grid.reset();
            for(i = 0; i < items.length; i++){
                item = items[i];
                if(item.collidable === true){
                    if(item.static === true){
                        grid.registerStaticActor(item);
                    } else {
                        grid.registerDynamicActor(item);
                    }
                }
            }

            for(i = 0; i < items.length; i++){
                if(items[i].TYPE === 'BALL'){
                    item = items[i];
                    potColliders = grid.getPotentialColliders(items[i]);
                    checkAgainstPotentialColliders();
                }
            }
        };

        var checkAgainstPotentialColliders = function(){
            for(var i = 0; i < potColliders.length; i++){
                var item2 = potColliders[i];
                if(item === item2){
                    continue;
                }
                if(rectangleCollision.check(item.bounds, item2.bounds)){
                    resolveIntersection(item, item2);
                }
            }
        };

        var clamp = function(value, min ,max){
            return Math.min(Math.max(value, min), max);
        };

        var resolveIntersection = function(item1, item2){
            response.clear();

            var intersecting = false;
            intersecting = sat.testPolygonPolygon(item1.bounds.toPolygon(), item2.bounds.toPolygon(), response);

            if(intersecting){
                if(!item2.noCollision){
                    item1.position.sub(response.overlapV);
                    item1.velocity.reflect(response.overlapN.perp());
                }

                if(item1.hasOwnProperty('collision')){
                    item1.collision(item2);
                }
                if(item2.hasOwnProperty('collision')){
                    item2.collision(item1);
                }
            }
        };

        init();
    };
});