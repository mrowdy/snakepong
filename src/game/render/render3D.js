define(['app/core', 'game/render/canvas-helper', 'lib/cuon-matrix.js'], function(core, CanvasHelper) {
    'use strict';

    return function($canvas){

        if($canvas === null){
            return false;
        }

        var gl,
            n,
            xFormMatrix = new Matrix4(),
            u_xFormMatrix,
            u_Resolution,
            ratio,
            s1, s2,
            offsetX = 0,
            offsetY = 0,
            world,
            camera,
            i,
            VSHADER_SOURCE = document.querySelector('#shader-vs').innerHTML,
            FSHADER_SOURCE = document.querySelector('#shader-fs').innerHTML;


        var init = function(){
            gl = CanvasHelper.getWebglContext($canvas);
            CanvasHelper.initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
            u_xFormMatrix = gl.getUniformLocation(gl.program, 'u_xFormMatrix');
            u_Resolution = gl.getUniformLocation(gl.program, 'u_Resolution');
            clear();
        };

        this.initCanvas = function(){
            getRatio();
            gl.viewport(offsetX, offsetY, camera.size.x * ratio, camera.size.y * ratio);
        };

        this.toggleBoundingBoxes = function(){

        };

        this.init = function(){
            init();
        };

        this.draw = function(objects){
            world = objects.world;
            camera = objects.camera;

            if(!ratio){
                getRatio();
            }

            gl.uniform4f(u_Resolution, camera.size.x, camera.size.y, 1, 1);
            gl.uniformMatrix4fv(u_xFormMatrix, false, xFormMatrix.elements);

            drawBackground();
            for(i = 0; i < world.items.length; i++){
                drawItem(world.items[i]);
            }

        };

        var clear = function(){
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        var drawBackground = function(){
            drawRect(world.size.x / 2, world.size.y / 2, world.size.x, world.size.y, { r: 1.0, g: 1.0, b: 1.0 });
        };

        var drawItem = function(item){
            var color = { r: 1.0, g: 0.0, b: 0.0 };
            if(item.TYPE == 'SNAKE'){
                color = { r: 0.0, g: 1.0, b: 0.0 };
            } else if(item.TYPE == 'TAIL'){
                color = { r: 0.0, g: 0.9, b: 0.0 };
            } else if(item.TYPE == 'PLAYER'){
                color = { r: 0.0, g: 0.0, b: 1.0 };
            }

            drawRect(item.position.x, item.position.y, item.size.x, item.size.y, color);
        }

        var drawRect = function(x, y, w, h, color){
            var vertices = new Float32Array([
                x - w / 2, y + h / 2, color.r, color.g, color.b,
                x - w / 2, y - h / 2, color.r, color.g, color.b,
                x + w / 2, y + h / 2, color.r, color.g, color.b,
                x + w / 2, y - h / 2, color.r, color.g, color.b
            ]);
            n = 4;

            var FSIZE = vertices.BYTES_PER_ELEMENT;

            var vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
            var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
            gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
            gl.enableVertexAttribArray(a_Position);
            gl.enableVertexAttribArray(a_Color);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
        }

        var getRatio = function(){
            if(camera){
                s1 = $canvas.width / camera.size.x;
                s2 = $canvas.height / camera.size.y;
                ratio = s1<s2?s1:s2;

                offsetX = $canvas.width / 2 - ( camera.size.x * ratio) / 2;
                offsetY = $canvas.height / 2 - ( camera.size.y * ratio) / 2;
            }
        };


        init();
    };
});