define(['app/core', 'game/math/vector2', 'game/collision/sat', 'game/collision/response', 'game/collision/rectangle-collision', 'game/collision/spatial-hash-grid'], function(core, Vector2, Sat, Response, RectangleCollision, Grid) {
    'use strict';

    return function(width, height, cellsize){

        var items,
            item,
            item2,
            sat,
            rectangleCollision,
            response,
            grid,
            potColliders = [],
            i = 0, y = 0,
            intersecting;

        var init = function(){
            sat = new Sat();
            grid = new Grid(width, height, cellsize, 10);
            rectangleCollision = new RectangleCollision();
            response = new Response();
        };

        this.initStatic = function(itemsToCheck){
            grid.clearStatic();
            items = itemsToCheck;
            for(i = 0; i < items.length; i++){
                item = items[i];
                if(item.collidable === true){
                    if(item.static === true){
                        grid.registerStaticActor(item);
                    }
                }
            }
        };

        this.check = function(itemsToCheck){
            grid.clearDynamic();
            items = itemsToCheck;
            for(i = 0; i < items.length; i++){
                item = items[i];
                if(item.collidable === true){
                    if(item.static === false){
                        grid.registerDynamicActor(item);
                    }
                }
            }

            for(i = 0; i < items.length; i++){
                if(items[i].static === false){
                    item = items[i];
                    potColliders = grid.getPotentialColliders(items[i]);
                    checkAgainstPotentialColliders();
                }
            }
        };

        var checkAgainstPotentialColliders = function(){
            for(y = 0; y < potColliders.length; y++){
                item2 = potColliders[y];
                if(item.semiStatic === true){
                    continue;
                }
                if(rectangleCollision.check(item.bounds, item2.bounds)){
                    resolveIntersection(item, item2);
                }
            }
        };

        var resolveIntersection = function(item1, item2){
            response.clear();
            intersecting = sat.testPolygonPolygon(item1.bounds.toPolygon(), item2.bounds.toPolygon(), response);
            if(intersecting){

                if(item2.collidable){
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