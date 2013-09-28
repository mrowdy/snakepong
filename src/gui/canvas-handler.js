define(["app/core"], function(core) {
    return function($canvas){

        var width,
            height,
            listener = [],
            resizeTimeout = 300,
            resizeCallback = null;


        this.registerListener = function(obj){
            listener.push(obj);
        }

        var init = function(){
            eventBindings();
        }

        var eventBindings = function(){
            core.event.add(window, 'resize', resizeCanvas);
        }

        var resizeCanvas = function(){
            if(resizeCallback != null){
                clearTimeout(resizeCallback);
            }

            resizeCallback = window.setTimeout( function(){
                getSize();
                setSize();
                notify();
            }, resizeTimeout);
        }

        var getSize = function(){
            width = $canvas.offsetWidth;
            height = $canvas.offsetHeight;
        }

        var setSize = function(){
            $canvas.setAttribute('width', width);
            $canvas.setAttribute('height', height);
        }

        var notify = function(){
            for(var i = 0; i < listener.length; i++){
                listener[i].canvasChange(width, height);
            }
        }

        init();
    }
});