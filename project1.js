var gl;
var points;
var transX = 0.0;
var transY = 0.0;
var canvas;

var verticesSizes = new Float32Array([
	0,0,10,
	-.25,-.25,10,
	.25,.25,10,
	.5,-.5,10,
	-2,-2,10,
	-2,-2,10,
	-2,-2,10,
	-2,-2,10,
	-2,-2,10,
	-2,-2,10,
	-2,-2,10
]);

var program;
var bufferId;
var vPosition;
var cBuffer;
var vColor;
var n = 0;
var vertexColors = [
vec4( 0.0, 0.0, 0.0, 1.0 ), // black
vec4( 1.0, 0.0, 0.0, 1.0 ), // red
vec4( 1.0, 1.0, 0.0, 1.0 ), // yellow
vec4( 0.0, 0.0, 1.0, 1.0 ), // blue
vec4( 1.0, 0.0, 0.0, 1.0 ), // red
vec4( 1.0, 1.0, 0.0, 1.0 ), // yellow
vec4( 0.0, 0.0, 1.0, 1.0 ), // blue
vec4( 1.0, 0.0, 0.0, 1.0 ), // red
vec4( 1.0, 1.0, 0.0, 1.0 ), // yellow
vec4( 0.0, 0.0, 1.0, 1.0 ), // blue
vec4( 1.0, 0.0, 0.0, 1.0 ) // red

];
var on = [0,0,0,0];
var time = 1;
var score = 0;
var timer_interval;
var render_interval;

window.onload = function init()
{
// window size to make the game screen fit
var window_w = window.innerWidth;
var window_h = window.innerHeight;
// timer init
var timer = document.getElementById("timer");
timer.style.left = window_w/2 + 50 + "px";
timer_interval = setInterval("updateTime()", 1000);
// moving score under the time
var score_board = document.getElementById("score");
score_board.style.left = window_w/2 + 50 + "px"
canvas = document.getElementById( "gl-canvas" );
// canvas.width = window_w/2;
//canvas.height = window_h - 40;
gl = WebGLUtils.setupWebGL( canvas );
if ( !gl ) { alert( "WebGL isn't available" ); }
document.onkeydown = keypressed;
document.onkeyup = kup;
//
// Configure WebGL
//
gl.viewport( 0, 0, canvas.width, canvas.height );
gl.clearColor( 0.0, 1.0, 0.0, 1.0 );
// Load shaders and initialize attribute buffers
program = initShaders( gl, "vertex-shader", "fragment-shader" );
gl.useProgram( program );
cBuffer = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );
vColor = gl.getAttribLocation( program, "vColor" );
gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( vColor );


//render every 50 ms
render_interval = setInterval(toRender, 10);
};
//Starts a new game
function newGame() {
	if (time > score) { 
		score = time;
		var highscore = document.getElementById("score");
		highscore.innerHTML = "<p>High Score: " + score + "</p>"; 
	}
	time = 0;
	verticesSizes[0] = 0;
	verticesSizes[1] = 0;
	transX = 0.0;
	transY = 0.0;
	on[0] = 0;
	on[1] = 0;
	on[2] = 0;
	on[3] = 0;
	//render();
	timer_interval = setInterval("updateTime()", 1000);
	render_interval = setInterval(toRender, 10);
}
//Going to be collision detection
function hasLost() {	
  for(var i = 3; i < verticesSizes.length; i+=3){
		var xdiff = verticesSizes[0] - verticesSizes[i];
		var ydiff = verticesSizes[1] - verticesSizes[i+1];
		if ((-0.0355 <= xdiff && xdiff <= 0) || (0 <= xdiff && xdiff <= 0.0355)) { 
			if ((-0.0355 <= ydiff && ydiff <= 0) || (0 <= ydiff && ydiff <= 0.0355)) { 
		  	clearInterval(render_interval);
				clearInterval(timer_interval);
		  	return true;
		  }
		}
  }
  return false;
}

function updateTime() {
var timer = document.getElementById("timer");
timer.innerHTML = "<p>Time: " + time + "</p>";
time++;
}
function toRender(){
	if(on[0] == 1){
		transX -= 0.01;
	}
	if(on[1] == 1){
		transX += 0.01;
	}
	if(on[2] == 1){
		transY += 0.01;
	}
	if(on[3] == 1){
		transY -= 0.01;
	}
	if(transX > 0.9)
		transX = 0.9;
	if(transX < -0.9)
		transX = -0.9;
	if(transY > 0.9)
		transY = 0.9;
	if(transY < -0.9)
		transY = -0.9;
	vertices = [
		vec2( -0.1 + transX, -0.1 + transY),
		vec2( -0.1 + transX, 0.1 + transY),
		vec2( 0.1 + transX, 0.1 + transY),
		vec2( 0.1 + transX, -0.1 + transY)];
		
	verticesSizes[0] = transX;
	verticesSizes[1] = transY;
	
	//var n2 = 5; // The number of vertices
	n = 5;
	// Create a buffer object
	var vertexSizeBuffer = gl.createBuffer();
	if (!vertexSizeBuffer) {
		console.log('Failed to create the buffer object');
	}
	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
	var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
	//Get the storage location of a_Position, assign and enable buffer
	var vPosition = gl.getAttribLocation(program, 'vPosition');
	if (vPosition < 0) {
		console.log('Failed to get the storage location of vPosition');
	}
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, FSIZE * 3, 0);
	gl.enableVertexAttribArray(vPosition); // Enable the assignment of the buffer object
	// Get the storage location of a_PointSize
	var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
	if(a_PointSize < 0) {
		console.log('Failed to get the storage location of a_PointSize');
	}
	gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
	gl.enableVertexAttribArray(a_PointSize); // Enable buffer allocation
	// Unbind the buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
  if (hasLost()) { newGame(); }
	render();
}
function keypressed(event) {
if(event.keyCode == '65')
on[0] = 1;
else if(event.keyCode == '68')
on[1] = 1;
else if(event.keyCode == '87')
on[2] = 1;
else if(event.keyCode == '83')
on[3] = 1;
};
function kup(event) {
if(event.keyCode == '65')
on[0] = 0;
else if(event.keyCode == '68')
on[1] = 0;
else if(event.keyCode == '87')
on[2] = 0;
else if(event.keyCode == '83')
on[3] = 0;
}
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	// Draw three points
	gl.drawArrays(gl.POINTS, 0, n);
}
