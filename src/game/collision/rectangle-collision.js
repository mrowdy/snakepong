define(function() {
    'use strict';

    return function(){

        var r1 = {},
            r2 = {};

        this.check = function(rect1, rect2){

            r1 = {
                left: rect1.position.x - (rect1.size.x / 2),
                right: rect1.position.x + (rect1.size.x / 2),
                top: rect1.position.y - (rect1.size.y / 2),
                bottom: rect1.position.y + (rect1.size.y / 2)
            };

            r2 = {
                left: rect2.position.x - (rect2.size.x / 2),
                right: rect2.position.x + (rect2.size.x / 2),
                top: rect2.position.y - (rect2.size.y / 2),
                bottom: rect2.position.y + (rect2.size.y / 2)
            };

            if(!(
                r2.left > r1.right ||
                    r2.right < r1.left ||
                    r2.top > r1.bottom ||
                    r2.bottom < r1.top
                ))
            {
                return true;
            }
            return false;
        };
    };
});
