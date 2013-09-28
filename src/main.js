requirejs.config({
    baseUrl: 'src',
    paths: {
        foo: './app/core'
    }
});

requirejs(["app/core", "gui/debug", "gui/canvas-handler", "game/snakepong"], function(core, Debug, CanvasHandler, Snakepong) {

    var $canvas = core.dom.el('#main-canvas'),
        game,
        debug,
        canvasHandler;

    var init = function(){
        game = new Snakepong();
        debug = new Debug(core.dom.el('.debug'), core.dom.el('#debug'));
        canvasHandler = new CanvasHandler($canvas);
        canvasHandler.registerListener(game);
    }

    init();

});