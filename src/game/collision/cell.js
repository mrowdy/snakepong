define(function() {
    'use strict';

    return function(){

        this.objects = [];

        var index;

        this.add = function(actor){
            this.objects.push(actor);
        };

        this.remove = function(actor){
            index = this.objects.indexOf(actor);
            this.objects.splice(index, 1);
        };

        this.clear = function(){
            this.objects = [];
        };

        this.size = function(){
            return this.objects.length;
        };

        this.get = function(index){
            return this.objects[index];
        };
    };
});
