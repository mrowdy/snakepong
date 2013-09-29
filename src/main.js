require.config({
    baseUrl: 'src'
});

require(["app/core", "gui/debug", "gui/canvas-handler", "game/snakepong"], function(core, Debug, CanvasHandler, Snakepong) {

    var $game = core.dom.el('.game'),
        $canvas = core.dom.el('#main-canvas'),
        game,
        debug,
        canvasHandler;

    var init = function(){
        eventBindings();

        game = new Snakepong($canvas);
        debug = new Debug(core.dom.el('.debug'), core.dom.el('#debug'));
        canvasHandler = new CanvasHandler($canvas);
        canvasHandler.registerListener(game);
    }

    var eventBindings = function(){
        var $btn = core.dom.el('.toggleFullscreen', $game);
        core.event.add($btn, 'click', toggleFullscreen);
    }

    var toggleFullscreen = function(){
        core.classlist.toggle($game, 'fullscreen');
        canvasHandler.update();
    }

    init();

});