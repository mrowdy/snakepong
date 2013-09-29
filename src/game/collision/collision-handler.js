define(['app/core', 'game/vector2', 'game/collision/sat', 'game/collision/response'], function(core, Vector2, Sat, Response) {
    return function(){

        var items,
            item,
            sat,
            response;

        var init = function(){
            sat = new Sat();
            response = new Response();
        }

        this.check = function(itemsToCheck){
            items = itemsToCheck;
            for(var i = 0; i < items.length; i++){
                item = items[i];
                if(item.static){
                    continue;
                }
                checkCollisionOfItem();
            }
        }

        var checkCollisionOfItem = function(){
            for(var i = 0; i < items.length; i++){
                var item2 = items[i];
                if(item === item2){
                    continue;
                }

                checkRectRectCollision(item, item2);

            }
        }

        var checkRectRectCollision = function(item1, item2){
            var rect1 = item1.bounds;
            var rect2 = item2.bounds;

            var r1 = {
                left: rect1.position.x - (rect1.size.x / 2),
                right: rect1.position.x + (rect1.size.x / 2),
                top: rect1.position.y - (rect1.size.y / 2),
                bottom: rect1.position.y + (rect1.size.y / 2)
            }

            var r2 = {
                left: rect2.position.x - (rect2.size.x / 2),
                right: rect2.position.x + (rect2.size.x / 2),
                top: rect2.position.y - (rect2.size.y / 2),
                bottom: rect2.position.y + (rect2.size.y / 2)
            }

            if(!(
                r2.left > r1.right ||
                r2.right < r1.left ||
                r2.top > r1.bottom ||
                r2.bottom < r1.top
                ))
            {
                resolveIntersection(item1, item2);
            }

        }

        var clamp = function(value, min ,max){
            return Math.min(Math.max(value, min), max);
        }

        var resolveIntersection = function(item1, item2){
            response.clear();

            intersecting = false;
            if(item1.bounds.TYPE == 'RECT' && item2.bounds.TYPE == 'RECT'){
                intersecting = sat.testPolygonPolygon(item1.bounds.toPolygon(), item2.bounds.toPolygon(), response);
            } else if(item1.bounds.TYPE == 'RECT' && item2.bounds.TYPE == 'CIRCLE'){
                intersecting = sat.testPolygonCircle(item1.bounds.toPolygon(), item2.bounds, response);
            } else if(item1.bounds.TYPE == 'CIRCLE' && item2.bounds.TYPE == 'RECT'){
                intersecting = sat.testCirclePolygon(item1.bounds, item2.bounds.toPolygon(), response);
            }

            if(intersecting){
                item1.position.sub(response.overlapV);
            }
        }

        init();
    }
});