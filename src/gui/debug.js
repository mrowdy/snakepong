define(["app/core"], function(core) {
    return function($button, $el){

        var init = function(){
            clickBindings();
        }

        var clickBindings = function(){
            core.event.add($button, 'click', toggleDebug);
        }

        var toggleDebug = function(evt){
            core.event.preventDefault(evt);
            core.classlist.toggle($el, 'show');
        }

        init();
    }
});