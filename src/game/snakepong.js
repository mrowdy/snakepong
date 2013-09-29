define(['app/core', 'game/loop', 'game/debug', 'game/world', 'game/render2D', 'game/camera'], function(core, Loop, Debug, World, Renderer, Camera) {
    return function($canvas){

        var loop,
            world,
            players,
            ball,
            renderer,
            camera,
            debug;

        var $debug = core.dom.el('#debug');
        var $fps = core.dom.el('.fps', $debug);

        var init = function(){
            renderer = new Renderer($canvas);
            initGame();

            loop = new Loop({
                updateCallback: update,
                renderCallback: render,
                fpsCallback: showFps
            });

            initDebug();
            loop.start();
        }

        var initGame = function(){
            world = new World();
            camera = new Camera(150, 100, 300, 200);
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

        var showFps = function(fps){
            $fps.innerHTML = fps.toFixed(2);
            debug.addFps(fps);
        }

        var initDebug = function(){
            $start = core.dom.el('nav .start', $debug);
            $start.onclick = function(){
                loop.start();
            }

            $pause = core.dom.el('nav .pause', $debug);
            $pause.onclick = function(){
                loop.pause();
            }

            $resume = core.dom.el('nav .resume', $debug);
            $resume.onclick = function(){
                loop.resume();
            }

            $stop = core.dom.el('nav .stop', $debug);
            $stop.onclick = function(){
                loop.stop();
                initGame();
            }

            $boundingToggle = core.dom.el('nav .boundingToggle', $debug);
            $boundingToggle.onclick = function(){
                renderer.toggleBoundingBoxes();
            }

            debug = new Debug(core.dom.el('#debugFps', $debug));
        }

        init();
    }
});