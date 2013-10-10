define(function() {
    'use strict';

    return {
        getWebglContext: function($canvas){
            var gl = null;
            try {
                gl = $canvas.getContext("webgl") || $canvas.getContext("experimental-webgl");
            }
            catch(e) {}
            if (!gl) {
                console.log('can\'t get webgl context');
            }
            return gl;
        },

        initShaders: function(gl, vshader, fshader){
            var program = this.createProgram(gl, vshader, fshader);
            gl.useProgram(program);
            gl.program = program;
            return true;
        },

        createProgram: function(gl, vshader, fshader){
            var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vshader);
            var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fshader);
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            return program;
        },

        loadShader: function(gl, type, string){
            var shader = gl.createShader(type);
            gl.shaderSource(shader, string);
            gl.compileShader(shader);
            return shader;
        }
    };

});