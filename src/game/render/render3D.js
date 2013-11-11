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
            normalMatrix = new Matrix4(),

            vertices = new Float32Array(),
            colors = new Float32Array(),
            normals = new Float32Array(),
            indices = new Uint8Array(),
            buffer,
            bufferType,
            vertexBuffer,
            indexBuffer,

            u_MvpMatrix,
            u_ModelMatrix,
            u_NormalMatrix,
            a_Attribute,
            a_Position,
            a_Normal,
            a_Color,

            u_AmbientLight,

            u_LightPosition1,
            u_LightColor1,
            u_LightPosition2,
            u_LightColor2,
            u_LightPosition3,
            u_LightColor3;

        var VSHADER_SOURCE = document.querySelector('#shader-vs').innerHTML,
            FSHADER_SOURCE = document.querySelector('#shader-fs').innerHTML;

        var init = function(){
            gl = CanvasHelper.getWebglContext($canvas);
            CanvasHelper.initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

            u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
            u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
            u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

            u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');

            u_LightColor1 = gl.getUniformLocation(gl.program, 'u_LightColor1');
            u_LightPosition1 = gl.getUniformLocation(gl.program, 'u_LightPosition1');
            u_LightColor2 = gl.getUniformLocation(gl.program, 'u_LightColor2');
            u_LightPosition2 = gl.getUniformLocation(gl.program, 'u_LightPosition2');
            u_LightColor3 = gl.getUniformLocation(gl.program, 'u_LightColor3');
            u_LightPosition3 = gl.getUniformLocation(gl.program, 'u_LightPosition3');

            gl.uniform3f(u_LightColor1, 0.0, 0.0, 0,0);
            gl.uniform3f(u_LightPosition1, 150.0, 100.0, 100.0);
            gl.uniform3f(u_LightColor2, 1.0, 0.0, 0,0);
            gl.uniform3f(u_LightPosition2, 0.0, 100.0, 1.0);
            gl.uniform3f(u_LightColor3, 0.0, 0.0, 1,0);
            gl.uniform3f(u_LightPosition3, 300.0, 100.0, 1.0);

            gl.uniform3f(u_AmbientLight, 0.1, 0.1, 0.1);

            height = 100 / Math.tan(15 * (Math.PI/180));
            projMatrix.setPerspective(30, 300/200, 1, 1000);
            viewMatrix.setLookAt(
                150, 100, height,
                150, 100, 0,
                0, 1, 0
            );

            updateMvp();

            normalMatrix.setInverseOf(modelMatrix);
            normalMatrix.transpose();

            gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
            gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
            vertexBuffer = gl.createBuffer();
            n = initBallBuffer();

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

            if(item.TYPE === 'SNAKE' || item.TYPE === 'TAIL' || item.TYPE === 'FOOD'){
                if(bufferType !== 'ball'){
                    n = initBallBuffer();
                }
                modelMatrix.setTranslate(item.position.x, item.position.y, 1);
                modelMatrix.scale(item.size.x / 2, item.size.y / 2, 5);
                modelMatrix.rotate(90, 1, 0, 0);
            } else {
                if(bufferType !== 'cube'){
                    n = initCubeBuffer();
                }
                modelMatrix.setTranslate(item.position.x, item.position.y, 1);
                modelMatrix.scale(item.size.x / 2, item.size.y / 2, 5);
            }

            drawRect();
        };

        var initCubeBuffer = function(){
            bufferType = 'cube';
            vertices = new Float32Array([
                1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
                1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
                1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
               -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
               -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
                1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
            ]);

            colors = new Float32Array([
                1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v1-v2-v3 front(blue)
                1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v3-v4-v5 right(green)
                1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v5-v6-v1 up(red)
                1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v1-v6-v7-v2 left
                1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
                1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0   // v4-v7-v6-v5 back
            ]);

            normals = new Float32Array([
                0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
                1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
                0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
               -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
                0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
                0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
            ]);

            indices = new Uint8Array([
                0, 1, 2,   0, 2, 3,    // front
                4, 5, 6,   4, 6, 7,    // right
                8, 9,10,   8,10,11,    // up
                12,13,14,  12,14,15,    // left
                16,17,18,  16,18,19,    // down
                20,21,22,  20,22,23     // back
            ]);

            indexBuffer = gl.createBuffer();

            initArrayBuffer(normals,  3, 'a_Normal');
            initArrayBuffer(vertices, 3, 'a_Position');
            initArrayBuffer(colors,   3, 'a_Color');

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

            return indices.length;
        };

        var initBallBuffer = function(){
            bufferType = 'ball';
            var SPHERE_DIV = 20;

            var i, ai, si, ci;
            var j, aj, sj, cj;
            var p1, p2;

            var positions = [];
            var colors = [];
            var normals = [];
            var indices = [];

            for (j = 0; j <= SPHERE_DIV; j++) {
                aj = j * Math.PI / SPHERE_DIV;
                sj = Math.sin(aj);
                cj = Math.cos(aj);
                for (i = 0; i <= SPHERE_DIV; i++) {
                    ai = i * 2 * Math.PI / SPHERE_DIV;
                    si = Math.sin(ai);
                    ci = Math.cos(ai);

                    positions.push(si * sj);
                    positions.push(cj);
                    positions.push(ci * sj);

                    normals.push(si * sj);
                    normals.push(cj);
                    normals.push(ci * sj);

                    colors.push(1.0);
                    colors.push(1.0);
                    colors.push(1.0);
                }
            }



            for (j = 0; j < SPHERE_DIV; j++) {
                for (i = 0; i < SPHERE_DIV; i++) {
                    p1 = j * (SPHERE_DIV+1) + i;
                    p2 = p1 + (SPHERE_DIV+1);

                    indices.push(p1);
                    indices.push(p2);
                    indices.push(p1 + 1);

                    indices.push(p1 + 1);
                    indices.push(p2);
                    indices.push(p2 + 1);
                }
            }

            indexBuffer = gl.createBuffer();

            initArrayBuffer(new Float32Array(positions), 3, 'a_Position');
            initArrayBuffer(new Float32Array(normals),  3, 'a_Normal');
            initArrayBuffer(new Float32Array(colors),   3, 'a_Color');

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

            return indices.length;
        };

        var initArrayBuffer = function(data, num, attribute){
            buffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

            a_Attribute = gl.getAttribLocation(gl.program, attribute);

            gl.vertexAttribPointer(a_Attribute, num, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_Attribute);

            return true;
        };

        var drawRect = function(){
            updateMvp();

            gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
            gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
            gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
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
        };

        init();
    };
});