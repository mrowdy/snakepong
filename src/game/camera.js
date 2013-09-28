define(['app/core', 'game/vector2'], function(core, Vector2) {
    return function(x, y){

        var size = new Vector2(16, 10);
        var position = new Vector2(x,y);

        this.getSize = function(){
            return size;
        }

        this.getPosition = function(){
            return position;
        }

        this.setPosition = function(x, y){
            position.x = x;
            position.y = y;
        }

        var init = function(){

        }

        init();
    }
});