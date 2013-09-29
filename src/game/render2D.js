define(['app/core'], function(core) {
    return function($canvas){

        var context,
            world,
            camera,
            scale,
            offsetX = 0,
            offsetY = 0;

        var init = function(){
            context = $canvas.getContext('2d');
            clear();
        }

        this.initCanvas = function(){
            scale = false;
        }

        this.init = function(){
            init();
        }

        this.draw = function(objects){
            world = objects.world;
            camera = objects.camera;

            if(!scale){
                getScale();
            }

            clear();

            renderCamera();
            renderItem(world.ball);
            for(var i = 0; i < world.player.length; i++){
                renderItem(world.player[i]);
            }

            for(var i = 0; i < world.wall.length; i++){
                renderItem(world.wall[i]);
            }

        }

        var clear = function(){
            context.clearRect(0, 0, $canvas.width, $canvas.height);
            context.fillStyle = '#000000';
            context.fillRect(0, 0, $canvas.width, $canvas.height);
        }

        var getScale = function(){
            if(camera){
                var s1 = $canvas.width / camera.size.x;
                var s2 = $canvas.height / camera.size.y;
                scale = s1<s2?s1:s2;

                offsetX = $canvas.width / 2 - ( camera.size.x * scale) / 2;
                offsetY = $canvas.height / 2 - ( camera.size.y * scale) / 2;
            }
        }

        var worldToCanvas = function(value){
            return value * scale;
        }

        var renderCamera = function(){
            var width = worldToCanvas(camera.size.x, 'x');
            var height = worldToCanvas(camera.size.y, 'y');
            context.fillStyle = '#ffffff';
            context.fillRect(offsetX, offsetY, width, height);
        }

        var renderItem = function(item){
            if(!isVisible(item)){
                return;
            }
            var posX = worldToCanvas(item.position.x) + offsetX;
            var posY = worldToCanvas(item.position.y) + offsetY;
            var width = worldToCanvas(item.size.x);
            var height = worldToCanvas(item.size.y);

            if(item.bounds){
                renderBoundingBox(item.bounds);
            }


            context.translate(posX, $canvas.height - posY);
            context.fillStyle = getColor(item.TYPE);
            context.fillRect(-width / 2, -height / 2, width, height);
            context.translate(posX * -1, ($canvas.height - posY) * -1);

        }
        
        var isVisible = function(item){
            if((item.position.x - item.size.x / 2 > camera.size.x)
                || (item.position.x + item.size.x / 2 < 0 )
                || (item.position.y - item.size.y / 2 > camera.size.x )
                || (item.position.y + item.size.y / 2 < 0 )
                ){
                return false;
            }
            return true;
        }

        var getColor = function(type){
            var color;
            switch(type){
                case 'BALL':
                    color = '#ff0000';
                    break;
                case 'PLAYER':
                    color = '#0000ff';
                    break;
                case 'WALL':
                    color = '#00ff00';
                    break;
                default:
                    color = '#000000';
                    break;
            }
            return color;
        }

        var renderBoundingBox = function(bounds){
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = '#ff0000';
            var x = worldToCanvas(bounds.position.x) + offsetX;
            var y = worldToCanvas(bounds.position.y) + offsetY;

            switch(bounds.TYPE){
                case 'RECT':
                    var width = worldToCanvas(bounds.size.x);
                    var height = worldToCanvas(bounds.size.y);
                    context.rect(x - width / 2, $canvas.height - (y + height / 2), width, height);
                    break;
                case 'CIRCLE':
                    var radius = worldToCanvas(bounds.radius / 2);
                    context.arc(x, $canvas.height - y,  radius, 0, Math.PI*2, true);
                    break;
            }

            context.stroke();
        }

        init();
    }
});