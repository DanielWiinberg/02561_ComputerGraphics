/** @type {WebGLRenderingContext} */
var gl;
var canvas;

var points = [];
var normals = [];
var colors = [];
var subdivisions = 3;

var va = vec4(0.0, 0.0, 1.0, 1);
var vb = vec4(0.0, 0.942809, -0.333333, 1);
var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
var vd = vec4(0.816497, -0.471405, -0.333333, 1);

var orbit = true;
var orbitAngle = 0;
var orbitRadius = 6;

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
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  gl.program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(gl.program);

  var ext = gl.getExtension('OES_element_index_uint');
  if (!ext){ 
    console.log('Warning: Unable to use an extension');
  }

  //#endregion

  /////////////////////////////////////////////////////////////////////
  //#region BUFFERS

  // Vertex position
  gl.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);

  const vertexPosition = gl.getAttribLocation(gl.program, "vertex_position");
  gl.vertexAttribPointer(vertexPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  // Vertex normal
  gl.vertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexNormalBuffer);

  const vertexNormalLoc = gl.getAttribLocation(gl.program, "vertex_normal");
  gl.vertexAttribPointer(vertexNormalLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexNormalLoc);

  //#endregion

  /////////////////////////////////////////////////////////////////////
  //#region CAMERA PROJECTION
  var fov = 60; 
  var aspect = canvas.width / canvas.height; // Aspect ratio
  var near = 0.3; // Near clipping plane
  var far = 30.0; // Far clipping plane

  var perspectiveCamera = perspective(fov, aspect, near, far);

  var cameraProjectionMatrixLocation = gl.getUniformLocation(gl.program, 'cameraProjectionMatrix');
  gl.uniformMatrix4fv(cameraProjectionMatrixLocation, false, flatten(perspectiveCamera));

  //#endregion

  /////////////////////////////////////////////////////////////////////
  //#region MODEL PROJECTION
  var modelViewMatrix = new mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0.0, -4.5));
  var modelViewMatrixLocation = gl.getUniformLocation(gl.program, 'modelViewMatrix');
  gl.uniformMatrix4fv(modelViewMatrixLocation, false, flatten(modelViewMatrix));

  //#endregion

  /////////////////////////////////////////////////////////////////////
  //#region LIGHTING
  var lightDirection = vec4(0.0, 0.0, -1.0, 0.0);
  var lightPosLocation = gl.getUniformLocation(gl.program, 'lightPos');
  gl.uniform4fv(lightPosLocation, flatten(lightDirection));

  var kd = vec4(1.0, 0.0, 0.0, 1.0); // RED
  var kdLocation = gl.getUniformLocation(gl.program, "kd");
  gl.uniform4fv(kdLocation, flatten(kd));
  
  //#endregion

  /////////////////////////////////////////////////////////////////////
  // BUTTONS
  const incrementButton = document.getElementById('incrementSubdivisions');
  const decrementButton = document.getElementById('decrementSubdivisions');

  incrementButton.addEventListener('click', () => {
    subdivisions++;
    drawSphere();
  });
  decrementButton.addEventListener('click', () => {
    if(subdivisions === 1) return;

    subdivisions--;
    drawSphere();
  });

  const orbitToggleButton = document.getElementById('orbitToggle');

  orbitToggleButton.addEventListener('click', () => {
    orbit = !orbit;
  });

  /////////////////////////////////////////////////////////////////////
  // INITIAL DRAW CALL
  drawSphere();

  /////////////////////////////////////////////////////////////////////
  // RENDERING
  render();
};

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if(orbit){
    orbitAngle += 0.01;
  }

  var eye = vec3(orbitRadius * Math.sin(orbitAngle), 0.0, orbitRadius * Math.cos(orbitAngle));
  var at = vec3(0.0, 0.0, 0.0);
  var up = vec3(0.0, 1.0, 0.0);
  var modelViewMatrix = lookAt(eye, at, up);

  var modelViewMatrixLocation = gl.getUniformLocation(gl.program, 'modelViewMatrix');
  gl.uniformMatrix4fv(modelViewMatrixLocation, false, flatten(modelViewMatrix));

  gl.drawArrays(gl.TRIANGLES, 0, points.length);

  requestAnimationFrame(render);
}

/////////////////////////////////////////////////////////////////////
//#region SPHERE FUNCTIONS
function drawSphere(){
  points = [];
  normals = [];

  tetrahedron(va, vb, vc, vd, subdivisions); // Populates pointsArray
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);
}

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
  points.push(a);
  points.push(b);
  points.push(c);

  normals.push(a);
  normals.push(b);
  normals.push(c);
}

//#endregion