define(function() {
    return {
        add: function add(el, eventType, handler) {
            if (el.addEventListener) {
                el.addEventListener(eventType, handler, false);
            } else if (el.attachEvent) {
                el.attachEvent('on' + eventType, handler);
            } else {
                el['on' + eventType] = handler;
            }
        },

        remove: function(){
            console.log('remove');
        },

        preventDefault: function(evt){
            evt.preventDefault();
        }
    }
});