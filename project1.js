var gl;
var points;
var transX = 0.0;
var transY = 0.0;
var canvas;
var pointsArray = [];
var program;
var bufferId;
var vPosition;
var cBuffer;
var vColor;
var vertexColors = [
vec4( 0.0, 0.0, 0.0, 1.0 ), // black
vec4( 1.0, 0.0, 0.0, 1.0 ), // red
vec4( 1.0, 1.0, 0.0, 1.0 ), // yellow
vec4( 0.0, 0.0, 1.0, 1.0 ) // blue
];
var on = [0,0,0,0];
var time = 1;
var score = 0;
var timer_interval;

window.onload = function init(){
  //window size to make the game screen fit
  var window_w = window.innerWidth;
  var window_h = window.innerHeight;

  //timer init and moving the timer
  var timer = document.getElementById("timer");
  timer.style.left = window_w/2 + 50 + "px";
  timer_interval = setInterval("updateTime()", 1000);

  //moving score under the time
  var score_board = document.getElementById("score");
  score_board.style.left = window_w/2 + 50 + "px"

  //webgl stuff
  canvas = document.getElementById( "gl-canvas" );
  canvas.width = window_w/2;
  canvas.height = window_h - 40;

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }
  
  pointsArray = [
		vec2(-0.1, -0.1),
		vec2(-0.1, 0.1),
		vec2(0.1, 0.1),
		vec2(0.1, -0.1)];
	pointsArray2 = [
		vec2(-0.4, -0.4),
		vec2(-0.4, -0.2),
		vec2(-0.2, -0.2),
		vec2(-0.2, -0.4)];
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
  
  // Load the data into the GPU
  bufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
  // Associate our shader variables with our data buffer
  vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
  // Load the data into the GPU
  // Associate our shader variables with our data buffer
  
  cBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );
	vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	render();
	//render every 50 ms
	setInterval(toRender, 50);
  if (hasLost()) { newGame(); }
};

function toRender(){
	if(on[0] == 1){
		transX -= 0.03;
	}
	if(on[1] == 1){
		transX += 0.03;
	}
	if(on[2] == 1){
		transY += 0.03;
	}
	if(on[3] == 1){
		transY -= 0.03;
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
	bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
	vPosition = gl.getAttribLocation( program, 'vPosition' );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
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
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
}

//Starts a new game
function newGame() {
  if (time > score) { score = time; }
  clearInterval(timer_interval);
  time = 0;
  timer_interval = setInterval("updateTime()", 1000);
}

//Going to be collision detection
function hasLost() {
  return false;
}

function updateScore() {
  var score_board = document.getElementById("score");
  score_board.innerHTML = "<p>Score: " + score + "</p>";
  score++;
}

function updateTime() {
  var timer = document.getElementById("timer");
  timer.innerHTML = "<p>Time: " + time + "</p>";
  time++;
}
