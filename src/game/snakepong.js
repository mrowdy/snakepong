define(function() {
    return function(){

        var init = function(){

        }

        this.canvasChange = function(width, height){
            console.log('canvas change received: ' + width + ':' + height);
        }

        init();
    }
});