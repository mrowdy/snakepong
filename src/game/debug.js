define(['app/core', 'game/loop'], function(core, Loop) {
    return function($canvas){

        var fpsList = [],
            loop,
            context,
            length = $canvas.width;

        this.addFps = function(fps){
            fpsList = fpsList.splice((length * -1), length);
            fpsList.push(fps);
        }

        this.reset = function(){
            fpsList = [];
        }

        var init = function(){
            loop = new Loop({
                renderCallback: render
            });

            context = $canvas.getContext('2d');

            loop.start();
        }

        var render = function(){
            context.clearRect(0, 0, $canvas.width, $canvas.height);
            context.fillStyle = '#000000';
            context.fillRect(0, 0, $canvas.width, $canvas.height);
            context.fillStyle = '#00ff00';

            var pos = 1;
            fpsList.map( function(item) {
                context.fillRect(pos, 100-item, 1, item);
                pos++;
            })

            context.fillStyle = '#ff0000';
            context.fillRect(0, 40, $canvas.width, 1);

            context.fillStyle = '#cccccc';
            context.fillRect(0, 0, $canvas.width, 1);
            context.fillRect(0, 25, $canvas.width, 1);
            context.fillRect(0, 50, $canvas.width, 1);
            context.fillRect(0, 75, $canvas.width, 1);
            context.fillRect(0, 99, $canvas.width, 1);

        }

        init();
    }
});