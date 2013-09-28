define(['app/core', 'game/loop', 'game/world', 'game/render2D', 'game/camera'], function(core, Loop, World, Renderer, Camera) {
    return function($canvas){

        var loop,
            world,
            players,
            ball,
            renderer,
            camera;

        var init = function(){
            renderer = new Renderer($canvas);
            camera = new Camera(100, 100);
            world = new World(640, 480);

            loop = new Loop({
                updateCallback: update,
                renderCallback: render
            });

            loop.start();
        }

        var update = function(deltaTime){
            world.update(deltaTime);
        }

        var render = function(){

            renderer.draw({
                camera: camera,
                world: world
            });
        }

        this.canvasChange = function(width, height){
            renderer.initCanvas();
        }

        init();
    }
});