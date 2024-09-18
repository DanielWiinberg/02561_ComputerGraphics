var canvas: HTMLCanvasElement;
var gl: WebGLRenderingContext | null = null;
var index = 0;

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

  const maxVertices = 100;
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, maxVertices*sizeof['vec2'], gl.STATIC_DRAW); //Assigning space for buffer

  const vertexPosition = gl.getAttribLocation(program, "a_position");
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPosition);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, maxVertices*sizeof['vec4'], gl.STATIC_DRAW);

  var vertexColor = gl.getAttribLocation(program, 'a_Color');
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexColor);

  canvas.addEventListener('click', (event: MouseEvent) => {
    if(!gl) return;
    const bbox = canvas.getBoundingClientRect();

    const xPosition = 2*(event.clientX - bbox.left) / canvas.width - 1;
    const yPosition = 2*(canvas.height - event.clientY + bbox.top) / canvas.height - 1;
    
    const canvasPosition = vec2(xPosition, yPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec2'], flatten(canvasPosition));

    const color = colors[colorIndex];
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec4'], flatten(color));

    index++;
  });

  render();
  /////////////////////////////////////////////////////////////////////
  //#region BUTTONS
  const clearCanvasButton = document.getElementById('clearCanvasButton') as HTMLElement;
  clearCanvasButton.addEventListener('click', () => {
    if(!gl) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
    index = 0;
  });

  // COLORS
  var colorIndex = 0;
  var colors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 1.0, 1.0, 1.0), // cyan
  ];

  const colorMenu = document.getElementById('color-selection') as HTMLSelectElement;
  colorMenu.addEventListener('click', () => {
    colorIndex = colorMenu.selectedIndex;
  });

  //#endregion
}

function render(){
  if(!gl) return;

  gl.clear(gl.COLOR_BUFFER_BIT); //Clearing the canvas between animations

  gl.drawArrays(gl.POINTS, 0, index);

  requestAnimationFrame(render);
}