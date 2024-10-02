/** @type {WebGLRenderingContext} */
var gl;
var canvas;

var index = 0;

var pointsArray = [];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

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

  gl.clearColor(0.8, 0.8, 0.8, 1.0); //Setting background to grey
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);

  const program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var ext = gl.getExtension('OES_element_index_uint');
  if (!ext){ 
    console.log('Warning: Unable to use an extension');
  }

  //#endregion

  /////////////////////////////////////////////////////////////////////
  //#region BUFFERS
  gl.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);

  const vertexPosition = gl.getAttribLocation(program, "vertex_position");
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  gl.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.colorBuffer);

  var vertexColor = gl.getAttribLocation(program, "a_Color");
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexColor);

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

  tetrahedron(va, vb, vc, vd, 2);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  // var cube_indices = new Uint32Array([
  //   1, 0, 3, 3, 2, 1, // front
  //   2, 3, 7, 7, 6, 2, // right
  //   3, 0, 4, 4, 7, 3, // down
  //   6, 5, 1, 1, 2, 6, // up
  //   4, 5, 6, 6, 7, 4, // back
  //   5, 4, 0, 0, 1, 5 // left
  // ]);
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cube_indices, gl.STATIC_DRAW);

  //#endregion

  /////////////////////////////////////////////////////////////////////
  // CAMERA PROJECTION
  var fov = 60; 
  var aspect = canvas.width / canvas.height; // Aspect ratio
  var near = 0.3; // Near clipping plane
  var far = 30.0; // Far clipping plane

  var perspectiveCamera = perspective(fov, aspect, near, far);

  var cameraProjectionMatrixLocation = gl.getUniformLocation(program, 'cameraProjectionMatrix');
  gl.uniformMatrix4fv(cameraProjectionMatrixLocation, false, flatten(perspectiveCamera));

  // /////////////////////////////////////////////////////////////////////
  // // MODEL PROJECTION

  // var modelViewMatrix_onePoint = new mat4();
  // modelViewMatrix_onePoint = mult(modelViewMatrix_onePoint, translate(0.0, 0.0, -3.0));
  // drawCube(gl, program, modelViewMatrix_onePoint);
};

// function drawCube(gl, program, transformationMatrix){
//   var modelViewMatrixLocation = gl.getUniformLocation(program, 'modelViewMatrix');
//   gl.uniformMatrix4fv(modelViewMatrixLocation, false, flatten(transformationMatrix));
//   gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);
// }

/////////////////////////////////////////////////////////////////////
//#region SPHERE FUNCTIONS

function tetrahedron(a, b, c, d, n){
  divideTriangle(a, b, c, n);
  divideTriangle(d, c, b, n);
  divideTriangle(a, d, b, n);
  divideTriangle(a, c, d, n);
}

function divideTriangle(a, b, c, count) {
  if ( count > 0 ) {

      var ab = mix( a, b, 0.5);
      var ac = mix( a, c, 0.5);
      var bc = mix( b, c, 0.5);

      ab = normalize(ab, true);
      ac = normalize(ac, true);
      bc = normalize(bc, true);

      divideTriangle( a, ab, ac, count - 1 );
      divideTriangle( ab, b, bc, count - 1 );
      divideTriangle( bc, c, ac, count - 1 );
      divideTriangle( ab, bc, ac, count - 1 );
  }
  else {
      triangle( a, b, c );
  }
}

function triangle(a, b, c){
  pointsArray.push(a);
  pointsArray.push(b);
  pointsArray.push(c);
}

//#endregion