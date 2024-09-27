/** @type {WebGLRenderingContext} */
var gl;

var canvas;
var colors;

// BUFFERS
var indexBuffer;
var vertexBuffer;
var colorBuffer;

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

  gl.clearColor(0.8, 0.8, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var ext = gl.getExtension('OES_element_index_uint');
  if (!ext){ 
    console.log('Warning: Unable to use an extension');
  }

  //#endregion

  /////////////////////////////////////////////////////////////////////
  //#region BUFFERS
  indexBuffer = gl.createBuffer();

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  const vertexPosition = gl.getAttribLocation(program, "vertex_position");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  // colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // var vertexColor = gl.getAttribLocation(program, "a_Color");
  // gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
  // gl.enableVertexAttribArray(vertexColor);

  //#endregion

  /////////////////////////////////////////////////////////////////////
  //#region COLORS
  colors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 1.0, 1.0, 1.0), // cyan
  ];
  //#endregion

  /////////////////////////////////////////////////////////////////////
  //#region BUILDING A CUBE

  var vertices = [
    vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ),
    vec3(  0.5,  0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 )
  ];

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var wire_indices = new Uint32Array([
    0, 1, 1, 2, 2, 3, 3, 0, // front
    2, 3, 3, 7, 7, 6, 6, 2, // right
    0, 3, 3, 7, 7, 4, 4, 0, // down
    1, 2, 2, 6, 6, 5, 5, 1, // up
    4, 5, 5, 6, 6, 7, 7, 4, // back
    0, 1, 1, 5, 5, 4, 4, 0 // left
  ]);


  var cube_indices = new Uint32Array([
    1, 0, 3, 3, 2, 1, // front
    2, 3, 7, 7, 6, 2, // right
    3, 0, 4, 4, 7, 3, // down
    6, 5, 1, 1, 2, 6, // up
    4, 5, 6, 6, 7, 4, // back
    5, 4, 0, 0, 1, 5 // left
  ]);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, wire_indices, gl.STATIC_DRAW);
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube_indices, gl.STATIC_DRAW);

  //#endregion

  var modelViewMatrix = new mat4(); //Identity matrix
  
  modelViewMatrix = mult(modelViewMatrix, rotateX(-35));
  modelViewMatrix = mult(modelViewMatrix, rotateY(35));

  var modelViewMatrixLocation = gl.getUniformLocation(program, 'modelViewMatrix');
  gl.uniformMatrix4fv(modelViewMatrixLocation, false, flatten(modelViewMatrix));

  /////////////////////////////////////////////////////////////////////
  // DRAW CALL
  gl.drawElements(gl.LINES, wire_indices.length, gl.UNSIGNED_INT, 0);
  // gl.drawElements(gl.TRIANGLES, cube_indices.length, gl.UNSIGNED_INT, 0);
};