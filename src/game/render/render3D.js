define(['app/core', 'game/render/canvas-helper', 'game/math/vector2', 'lib/cuon-matrix.js', ], function(core, CanvasHelper, Vector2) {
    'use strict';

    /*global document */
    /*global Matrix4 */

    return function($canvas){

        if($canvas === null){
            return false;
        }

        var height,
            gl,
            n,
            ratio,
            s1, s2,
            offsetX = 0,
            offsetY = 0,
            world,
            camera,
            i;

        var mvpMatrix = new Matrix4(),
            viewMatrix = new Matrix4(),
            projMatrix = new Matrix4(),
            modelMatrix = new Matrix4(),

            FSIZE,
            vertices = new Float32Array(),
            vertexBuffer,

            u_MvpMatrix,
            a_Position,
            a_Color;

        var VSHADER_SOURCE = document.querySelector('#shader-vs').innerHTML,
            FSHADER_SOURCE = document.querySelector('#shader-fs').innerHTML;

        var init = function(){
            gl = CanvasHelper.getWebglContext($canvas);
            CanvasHelper.initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

            u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
            a_Position = gl.getAttribLocation(gl.program, 'a_Position');
            a_Color = gl.getAttribLocation(gl.program, 'a_Color');

            height = 100 / Math.tan(15 * (Math.PI/180));
            projMatrix.setPerspective(30, 300/200, 1, 1000);
            viewMatrix.setLookAt(
                150, 100, height,
                150, 100, 0,
                0, 1, 0
            );

            updateMvp();

            gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
            vertexBuffer = gl.createBuffer();
            initVertexBuffer();

            gl.enable(gl.DEPTH_TEST);
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
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

            viewMatrix.setLookAt(
                150, 100, height,
                150, 100, 0,
                0, 1, 0
            );

            updateMvp();
            gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

            clear();
            //drawBackground();

            for(i = 0; i < world.items.length; i++){
               drawItem(world.items[i]);
            }
        };

        var clear = function(){
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        };

        var drawBackground = function(){
            drawRect(world.size.x / 2, world.size.y / 2, 0, world.size.x, world.size.y, { r: 1.0, g: 1.0, b: 1.0 });
        };

        var drawItem = function(item){
            modelMatrix.setTranslate(item.position.x, item.position.y, 1);
            modelMatrix.scale(item.size.x / 2, item.size.y / 2, 5);
            drawRect();
        };

        var initVertexBuffer = function(){
            vertices = new Float32Array([
                -1.0,  1.0, 1, 1, 0, 0,
                -1.0, -1.0, 1, 1, 0, 0,
                1.0,  1.0, 1, 1, 0, 0,
                1.0, -1.0, 1, 1, 0, 0
            ]);
            n = 4;

            FSIZE = vertices.BYTES_PER_ELEMENT;

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
            gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
            gl.enableVertexAttribArray(a_Position);
            gl.enableVertexAttribArray(a_Color);

            return n;
        }

        var drawRect = function(){
            updateMvp();
            gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
        };

        var getRatio = function(){
            if(camera){
                s1 = $canvas.width / camera.size.x;
                s2 = $canvas.height / camera.size.y;
                ratio = s1<s2?s1:s2;

                offsetX = $canvas.width / 2 - ( camera.size.x * ratio) / 2;
                offsetY = $canvas.height / 2 - ( camera.size.y * ratio) / 2;
            }
        };

        var updateMvp = function(){
            mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        }

        init();
    };
});