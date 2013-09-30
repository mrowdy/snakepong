define(['app/core', 'game/math/vector2'], function(core, Vector2) {
    return function(x, y, width, height){

        this.size = new Vector2(width, height);
        this.position = new Vector2(x, y);

        var init = function(){

        }

        init();
    }
});