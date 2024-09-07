var gl;

var theta = 0.0;
var thetaLoc;

window.onload = function init(){
  var canvas = document.getElementById("webGL_Canvas");

  /////////////////////////////////////////////////////////////////////
  //#region SETTING UP WEGBL
  /** @type {WebGLRenderingContext} */
  gl = WebGLUtils.setupWebGL(canvas);

  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  //#endregion

  // VERTICES
  var vertices = [
    vec2(0, 0.5),
    vec2(0.5, 0),
    vec2(-0.5, 0),
    vec2(0, -0.5)
  ];
  
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);   
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);   
  gl.enableVertexAttribArray(vPosition);

  // COLORS
  var colors = [
    vec3(1.0, 1.0, 1.0),
    vec3(1.0, 1.0, 1.0),
    vec3(1.0, 1.0, 1.0),
    vec3(1.0, 1.0, 1.0)
  ];
  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, 'a_Color');
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  thetaLoc = gl.getUniformLocation( program, "theta" );

  render();
}

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT); //Clearing the canvas between animations

  theta += 0.1;
  gl.uniform1f(thetaLoc, theta);

  var numberOfVertices = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, numberOfVertices);

  requestAnimationFrame(render);
}