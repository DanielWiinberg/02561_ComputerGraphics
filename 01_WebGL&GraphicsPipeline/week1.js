/**
* @param {Element} canvas. The canvas element to create a context from.
* @return {WebGLRenderingContext} The created context.
*/
function setupWebGL(canvas) {
  return WebGLUtils.setupWebGL(canvas);
}

window.onload = function init(){
  var canvas = document.getElementById("webGL_Canvas");
  var gl = canvas.getContext("webgl");
  var gl = setupWebGL(canvas);
  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}