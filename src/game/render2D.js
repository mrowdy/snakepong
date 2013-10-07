define(['app/core'], function(core) {
    'use strict';

    return function($canvas){

        if($canvas === null){
            return false;
        }

        var context,
            world,
            camera,
            scale,
            offsetX = 0,
            offsetY = 0,
            showBoundingBoxes = false,
            i,
            width, height,
            x, y,
            s1, s2,
            radius,
            color;


        var init = function(){
            context = $canvas.getContext('2d');
            clear();
        };

        this.initCanvas = function(){
            scale = false;
        };

        this.toggleBoundingBoxes = function(){
            showBoundingBoxes = !showBoundingBoxes;
        };

        this.init = function(){
            init();
        };

        this.draw = function(objects){
            world = objects.world;
            camera = objects.camera;

            if(!scale){
                getScale();
            }

            clear();
            renderCamera();
            for(i = 0; i < world.items.length; i++){
                renderItem(world.items[i]);
            }
        };

        var clear = function(){
            context.clearRect(0, 0, $canvas.width, $canvas.height);
            context.fillStyle = '#000000';
            context.fillRect(0, 0, $canvas.width, $canvas.height);
        };

        var getScale = function(){
            if(camera){
                s1 = $canvas.width / camera.size.x;
                s2 = $canvas.height / camera.size.y;
                scale = s1<s2?s1:s2;

                offsetX = $canvas.width / 2 - ( camera.size.x * scale) / 2;
                offsetY = $canvas.height / 2 - ( camera.size.y * scale) / 2;
            }
        };

        var worldToCanvas = function(value){
            return value * scale;
        };

        var renderCamera = function(){
            width = worldToCanvas(camera.size.x, 'x');
            height = worldToCanvas(camera.size.y, 'y');
            context.fillStyle = '#ffffff';
            context.fillRect(offsetX, offsetY, width, height);
        };

        var renderItem = function(item){
            if(!isVisible(item)){
                return;
            }
            x = worldToCanvas(item.position.x) + offsetX;
            y = worldToCanvas(item.position.y) + offsetY;
            width = worldToCanvas(item.size.x);
            height = worldToCanvas(item.size.y);

            if(showBoundingBoxes && item.bounds){
                renderBoundingBox(item.bounds);
            }

            context.translate(x, $canvas.height - y);
            context.fillStyle = getColor(item.TYPE);

            if(item.TYPE === 'SNAKE' || item.TYPE === 'TAIL' || item.TYPE == 'FOOD' ){
                context.beginPath();
                context.arc(0, 0,  worldToCanvas(item.radius), 0, Math.PI*2, true);
                context.fill();
                context.closePath();
            } else {
                context.fillRect(-width / 2, -height / 2, width, height);
            }
            context.translate(x * -1, ($canvas.height - y) * -1);
        };
        
        var isVisible = function(item){
            if((item.position.x - item.size.x / 2 > camera.size.x)
                || (item.position.x + item.size.x / 2 < 0 )
                || (item.position.y - item.size.y / 2 > camera.size.x )
                || (item.position.y + item.size.y / 2 < 0 )
                ){
                return false;
            }
            return true;
        };

        var getColor = function(type){
            switch(type){
                case 'SNAKE':
                    color = '#00ff00';
                    break;
                case 'PLAYER':
                    color = '#0000ff';
                    break;
                case 'WALL':
                    color = '#00ff00';
                    break;
                case 'TAIL':
                    color = '#00cc00';
                    break;
                case 'FOOD':
                    color = '#ff0000';
                    break;
                default:
                    color = '#000000';
                    break;
            }
            return color;
        };

        var renderBoundingBox = function(bounds){
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = '#ff0000';
            x = worldToCanvas(bounds.position.x) + offsetX;
            y = worldToCanvas(bounds.position.y) + offsetY;

            switch(bounds.TYPE){
                case 'RECT':
                    width = worldToCanvas(bounds.size.x);
                    height = worldToCanvas(bounds.size.y);
                    context.rect(x - width / 2, $canvas.height - (y + height / 2), width, height);
                    break;
                case 'CIRCLE':
                    radius = worldToCanvas(bounds.radius / 2);
                    context.arc(x, $canvas.height - y,  radius, 0, Math.PI*2, true);
                    break;
            }
            context.stroke();
        };
        init();
    };
});