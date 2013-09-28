requirejs.config({
    baseUrl: 'src',
    paths: {
        foo: './app/core'
    }
});

requirejs(["app/core", "gui/debug", "game/snakepong"], function(core, Debug, Snakepong) {

    var game,
        debug;

    var init = function(){
        game = new Snakepong();
        debug = new Debug(core.dom.el('.debug'), core.dom.el('#debug'));
    }

    init();

});