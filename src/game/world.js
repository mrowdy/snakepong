define(['app/core', 'game/vector2'], function(core, Vector2) {
    return function(x, y){

        var size = new Vector2(x, y),
            players = [],
            ball;


        this.getSize = function(){
            return size;
        }

        var init = function(){

        }

        this.update = function(deltaTime){

        }

        init();
    }
});