declare function initShaders(
  gl: WebGLRenderingContext, 
  vertexShaderId: string, 
  fragmentShaderId: string
): WebGLProgram;

declare const WebGLUtils: {
  setupWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext | null;
};

//////////////////////////////////////////
//#region FUNCTIONS IN MV.js
declare const vec2: any;
declare const vec4: any;
declare var sizeof: any;
declare function flatten(v: any): Float32Array;
//#endregion