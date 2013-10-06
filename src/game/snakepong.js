define(['app/core', 'game/loop', 'game/debug', 'game/world', 'game/render2D', 'game/camera', 'game/input/keyboard-controller'], function(core, Loop, Debug, World, Renderer, Camera, KeyboardController) {
    'use strict';

    return function($canvas){

        if($canvas === null){
            return;
        }

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
        };

        var initGame = function(){
            world = new World();
            camera = new Camera(150, 100, 300, 200);

            var  keyboardController = new KeyboardController({
                87 : function(){ world.inputHandler.inputs.player1Up(); },
                83 : function(){ world.inputHandler.inputs.player1Down(); },
                38 : function(){ world.inputHandler.inputs.player2Up(); },
                40 : function(){ world.inputHandler.inputs.player2Down(); },
            }, 100);
        };

        var update = function(deltaTime){
            world.update(deltaTime);
        };

        var render = function(){

            renderer.draw({
                camera: camera,
                world: world
            });
        };

        this.canvasChange = function(width, height){
            renderer.initCanvas();
        };

        var showFps = function(fps){
            $fps.innerHTML = fps.toFixed(2);
            debug.addFps(fps);
        };

        var initDebug = function(){
            var $start = core.dom.el('nav .start', $debug);
            if($start){
                $start.onclick = function(){
                    loop.start();
                };
            }

            var $pause = core.dom.el('nav .pause', $debug);
            if($pause){
                $pause.onclick = function(){
                    loop.pause();
                };
            }

            var $resume = core.dom.el('nav .resume', $debug);
            if($resume){
                $resume.onclick = function(){
                    loop.resume();
                };
            }

            var $stop = core.dom.el('nav .stop', $debug);
            if($stop){
                $stop.onclick = function(){
                    loop.stop();
                    initGame();
                    debug.reset();
                };
            }

            var $boundingToggle = core.dom.el('nav .boundingToggle', $debug);
            if($boundingToggle){
                $boundingToggle.onclick = function(){
                    renderer.toggleBoundingBoxes();
                };
            }

            debug = new Debug(core.dom.el('#debugFps', $debug));
        };
        init();
    };
});