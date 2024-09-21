var canvas: HTMLCanvasElement;
var gl: WebGLRenderingContext | null = null;
var index = 0;

var colorIndex = 0;
var colors: any[] = [];

// BUFFERS
var vertexBuffer: WebGLBuffer | null = null;
var colorBuffer: WebGLBuffer | null = null;

window.onload = function init(){
  canvas = document.getElementById("webGL_Canvas") as HTMLCanvasElement;

  /////////////////////////////////////////////////////////////////////
  //#region SETTING UP WEGBL
  gl = WebGLUtils.setupWebGL(canvas);
  if(!gl){
    const error = new Error("WebGL could not be setup");
    alert(error.message);
    throw error;
  }

  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  //#endregion

  /////////////////////////////////////////////////////////////////////
  //#region CREATING BUFFERS
  const maxVertices = 100;
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 6*maxVertices*sizeof['vec2'], gl.STATIC_DRAW); //Pre-allocate space for buffer

  const vertexPosition = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 6*maxVertices*sizeof['vec4'], gl.STATIC_DRAW);

  var vertexColor = gl.getAttribLocation(program, 'a_Color');
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexColor);

  //#endregion

  render();
  /////////////////////////////////////////////////////////////////////
  //#region MENUS

  const clearCanvasButton = document.getElementById('clearCanvasButton') as HTMLElement;
  clearCanvasButton.addEventListener('click', () => {
    if(!gl) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
    index = 0;
  });

  // COLORS
  const colorMenu = document.getElementById('color-selection') as HTMLSelectElement;
  colorMenu.addEventListener('click', () => {
    colorIndex = colorMenu.selectedIndex;
  });
  colors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 1.0, 1.0, 1.0), // cyan
  ];

  // DRAWING MODE
  const drawMode = document.getElementById('drawing-mode') as HTMLSelectElement;
  canvas.addEventListener('click', drawPoint); //Defaults to drawing points

  drawMode.addEventListener('click', () => {
    if(drawMode.selectedIndex === 0){
      removeAllDrawingFunctions();
      canvas.addEventListener('click', drawPoint);      
    }else if(drawMode.selectedIndex === 1){
      removeAllDrawingFunctions();
      canvas.addEventListener('click', drawTriangle); 
    }

  });

  //#endregion
}

function render(){
  if(!gl) return;

  gl.clear(gl.COLOR_BUFFER_BIT); //Clearing the canvas between animations

  gl.drawArrays(gl.TRIANGLES, 0, index);

  requestAnimationFrame(render);
}

/////////////////////////////////////////////////////////////////////
//#region DRAWING FUNCTIONS
function removeAllDrawingFunctions(){
  canvas.removeEventListener('click', drawPoint);
  canvas.removeEventListener('click', drawTriangle);
}

function drawPoint(event: MouseEvent){
  if(!gl) return;
  
  const color = colors[colorIndex];
  const pos = findPointClicked(event);

  // Draw point as two triangles
  const offset = 0.01;
  
  const pointTriangle = [
    vec2(pos[0] - offset, pos[1] - offset), vec2(pos[0] + offset, pos[1] - offset),
    vec2(pos[0] - offset, pos[1] + offset), vec2(pos[0] - offset, pos[1] + offset),
    vec2(pos[0] + offset, pos[1] - offset), vec2(pos[0] + offset, pos[1] + offset)
  ];

  const triangleColor = [
    color, color,
    color, color,
    color, color
  ];
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec2'], flatten(pointTriangle));
  
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(triangleColor));

  index += 6; //We increment the index by 6 to account for the six vertices
}

var trianglePoints: any[] = [];
var trianglePointColors: any[] = [];
function drawTriangle(event: MouseEvent){
  if(!gl) return;
  
  const color = colors[colorIndex];
  const pos = findPointClicked(event);
  trianglePoints.push(pos);
  trianglePointColors.push(color);

  if(trianglePoints.length === 3){
    index -= 12; //Remove reference points

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec2'], flatten(trianglePoints));
    
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(trianglePointColors));

    trianglePoints = [];
    trianglePointColors = [];
    index += 3; //Accounting for drawing three points
  }else{
    drawPoint(event);
  }
}

function findPointClicked(event: MouseEvent): typeof vec2{
  const bbox = canvas.getBoundingClientRect();

  const xPosition = 2*(event.clientX - bbox.left) / canvas.width - 1;
  const yPosition = 2*(canvas.height - event.clientY + bbox.top) / canvas.height - 1;
  
  return vec2(xPosition, yPosition);
}

//#endregion