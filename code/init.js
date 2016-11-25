//Force the canvas to be the right size. Adapted from: http://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function forceCanvasSize(canvas) {
	var displayWidth  = canvas.clientWidth,
		displayHeight = canvas.clientHeight
 
  // Check if the canvas is not the same size.
	if (canvas.width  != displayWidth ||
		canvas.height != displayHeight) {
			
		canvas.width  = displayWidth;
		canvas.height = displayHeight;
	}
}

function init() {
	var canvas = document.getElementById("glcanvas")

	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
	
	if(!gl) {
		alert('Error initializing OpenGL context!')
		
		return;
	}
	
	var v_shader = createShader( gl, gl.VERTEX_SHADER, v_shader_src )
	var f_shader2d = createShader( gl, gl.FRAGMENT_SHADER, f_shader2d_src )
	program2d = createProgram( gl, v_shader, f_shader2d )
	
	positionLoc = gl.getAttribLocation( program2d, "a_position" )
	uvLoc = gl.getAttribLocation( program2d, "a_uv")
	modelviewLoc = gl.getUniformLocation( program2d, "modelview" )
	
	gl.useProgram( program2d )
	
	var vertElems = 8;
	var vertSize = vertElems * 4;
	
	meshVerts = gl.createBuffer()
	gl.bindBuffer( gl.ARRAY_BUFFER, meshVerts )
	
	meshIndis = gl.createBuffer()
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, meshIndis )
	
	gl.vertexAttribPointer( positionLoc, 3, gl.FLOAT, false, vertSize, 0 )
	gl.vertexAttribPointer( uvLoc, 2, gl.FLOAT, false, vertSize, 16 )
	
	gl.enableVertexAttribArray(uvLoc)
	gl.enableVertexAttribArray(positionLoc)
	
	/*
	//position attribute buf parameters
	var size = 3,
		type = gl.FLOAT,
		normalize = false,
		stride = 0,
		offset = 0
	
	var vertElems = 8;
	var vertSize = vertElems * 4;
	
	
	//position attribute 
	gl.vertexAttribPointer( positionLoc, 3, gl.FLOAT, false, vertSize, 0 )
	gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, vertSize, 16 )

	//color attribute
	
	// three 2d points
	var positions = [
	  -0.5, -0.5, 0, 0, 1, 0, 0, 1,
	  0.5, -0.5, 0, 0, 1, 1, 0, 1,
	  0, 0.5, 0, 0, 0, 0, 1, 1,
	];
	
	var indis = [
		0, 1, 2
	]
	
	nVerts = positions.length / vertElems 
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indis), gl.STATIC_DRAW);*/
	
	update()
}

function update() {
	
	
	var modelview = mat4.create()
	/*
	mat4.set( modelview,  
		0.01, 0, 0, 0, 
		0, 0.01, 0, 0,
		0, 0, 0.01, 0,
		0, 0, 0,    1 );
	*/
	mat4.ortho( modelview, -10, 90, -10, 90, -100, 100 )
	gl.uniformMatrix4fv( modelviewLoc, false, modelview )
	
	
	//gl.enable( gl.DEPTH_TEST )
	//gl.depthFunc( gl.LEQUAL )
	gl.clearColor( 0, 0.25, 0, 1 )
	
	genAxisAlignedSlices2d( texData )
	nIndis = genMesh2d( texData, xyPlus2dSlices, meshVerts, meshIndis )
	
	//debug 
	//nIndis = 64000
	
	//meshVerts = vBuf 
	//meshIndis = iBuf
	
	renderScene()
}
