require.config({
    baseUrl: 'src'
});

require(["app/core", "gui/canvas-handler", "game/snakepong"], function(core, CanvasHandler, Snakepong) {
    'use strict';
    /*global window */
    /*global document */

    var $game = core.dom.el('.game'),
        $canvas = core.dom.el('#main-canvas'),
        game,
        $debug = core.dom.el('#debug'),
        canvasHandler;

    var init = function(){
        if($canvas === null){
            return false;
        }

        eventBindings();

        game = new Snakepong($canvas);
        canvasHandler = new CanvasHandler($canvas);
        canvasHandler.registerListener(game);
    };

    var eventBindings = function(){
        var $btn = core.dom.el('.toggleFullscreen', $game);
        core.event.add($btn, 'click', toggleFullscreen);
        core.event.add(document, 'keydown', function(evt) {
            var key = (evt || window.evt).keyCode;
            if(key === 68){
                core.classlist.toggle($debug, 'show');
            } else if(key === 70){
                core.classlist.toggle($game, 'fullscreen');
                canvasHandler.update();
            }
        });
    };

    var toggleFullscreen = function(){
        canvasHandler.update();
        core.classlist.toggle($game, 'fullscreen');

    };
    init();
});