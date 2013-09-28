define(['app/core'], function(core) {
    return function($canvas){

        var context,
            world,
            camera,
            scale;

        var init = function(){
            context = $canvas.getContext('2d');
            clear();
        }

        this.initCanvas = function(){
            scale = false;
        }

        this.init = function(){
            init();
        }

        this.draw = function(objects){
            world = objects.world;
            camera = objects.camera;

            if(!scale){
                getScale();
            }

            var camSize = camera.getSize();
            var width = worldToCanvas(camSize.x, 'x');
            var height = worldToCanvas(camSize.y, 'y');

            clear();
            context.fillStyle = '#ffffff';
            context.fillRect($canvas.width / 2 - width / 2, $canvas.height / 2 - height / 2, width, height);
        }

        var clear = function(){
            context.clearRect(0, 0, $canvas.width, $canvas.height);
            context.fillStyle = '#000000';
            context.fillRect(0, 0, $canvas.width, $canvas.height);
        }

        var getScale = function(){
            if(camera){
                var size = camera.getSize();
                var s1 = $canvas.width / size.x;
                var s2 = $canvas.height / size.y;
                scale = s1<s2?s1:s2;
            }
        }

        var worldToCanvas = function(value){
            return value * scale;
        }

        init();
    }
});