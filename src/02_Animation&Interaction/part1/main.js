"use strict";
var canvas;
var gl = null;
var index = 0;
window.onload = function init() {
    canvas = document.getElementById("webGL_Canvas");
    /////////////////////////////////////////////////////////////////////
    //#region SETTING UP WEGBL
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        const error = new Error("WebGL could not be setup");
        alert(error.message);
        throw error;
    }
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    //#endregion
    const maxVertices = 100;
    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, maxVertices * sizeof['vec2'], gl.STATIC_DRAW);
    canvas.addEventListener('click', (event) => {
        if (!gl)
            return;
        const bbox = canvas.getBoundingClientRect();
        const xPosition = 2 * (event.clientX - bbox.left) / canvas.width - 1;
        const yPosition = 2 * (canvas.height - event.clientY + bbox.top) / canvas.height - 1;
        const canvasPosition = vec2(xPosition, yPosition);
        gl.bufferSubData(gl.ARRAY_BUFFER, index * sizeof['vec2'], flatten(canvasPosition));
        index++;
    });
    const vPosition = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render();
};
function render() {
    if (!gl)
        return;
    gl.clear(gl.COLOR_BUFFER_BIT); //Clearing the canvas between animations
    gl.drawArrays(gl.POINTS, 0, index);
    requestAnimationFrame(render);
}
