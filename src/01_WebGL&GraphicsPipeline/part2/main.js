window.onload = function init(){
  var canvas = document.getElementById("webGL_Canvas");

  /** @type {WebGLRenderingContext} */
  var gl = WebGLUtils.setupWebGL(canvas);

  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var vertices = [ vec2(0.0, 0.0), vec2(1.0, 0.0), vec2(1.0, 1.0) ];
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);   
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);   
  gl.enableVertexAttribArray(vPosition);

  gl.drawArrays(gl.POINTS, 0, vertices.length);
}