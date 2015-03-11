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
vec4( 0.0, 0.0, 1.0, 1.0 ) // blue
];
var on = [0,0,0,0];
var time = 1;
var score = 0;
window.onload = function init()
{
// window size to make the game screen fit
var window_w = window.innerWidth;
var window_h = window.innerHeight;
// timer init
var timer = document.getElementById("timer");
timer.style.left = window_w/2 + 50 + "px";
setInterval("updateTime()", 1000);
// moving score under the time
var score_board = document.getElementById("score");
score_board.style.left = window_w/2 + 50 + "px"
canvas = document.getElementById( "gl-canvas" );
// canvas.width = window_w/2;
//canvas.height = window_h - 40;
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
// Associate out shader variables with our data buffer
vPosition = gl.getAttribLocation( program, 'vPosition' );
gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( vPosition );
cBuffer = gl.createBuffer();
gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );
vColor = gl.getAttribLocation( program, "vColor" );
gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
gl.enableVertexAttribArray( vColor );
//render();
//render every 50 ms
setInterval(toRender, 10);
// Set vertex coordinates and point sizes
// n = initVertexBuffers();
// if (n < 0) {
// console.log('Failed to set the vertex information');
// return;
// }
// Specify the color for clearing <canvas>
gl.clearColor(0.0, 1.0, 0.0, 1.0);
// Clear <canvas>
// gl.clear(gl.COLOR_BUFFER_BIT);
// Draw three points
// gl.drawArrays(gl.POINTS, 0, n);
render();
};
//This will be where we check to see if the score should be updated
function has_lost() {
return false;
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
if (has_lost()) { newGame(); }
// bufferId = gl.createBuffer();
// gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
// gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
// vPosition = gl.getAttribLocation( program, 'vPosition' );
// gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
// gl.enableVertexAttribArray( vPosition );
var verticesSizes = new Float32Array([
// Coordinate and size of points
transX, transY, 10.0, // the 1st point
-0.5, -0.5, 20.0, // the 2nd point
0.5, -0.5, 30.0, // the 3rd point
0.8, 0.0, 40.0, // the fourth
1.0, 1.0, 50 // ...
]);
//var n2 = 5; // The number of vertices
n = 5;
// Create a buffer object
var vertexSizeBuffer = gl.createBuffer();
if (!vertexSizeBuffer) {
console.log('Failed to create the buffer object');
//return -1;
}
// Bind the buffer object to target
gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
//Get the storage location of a_Position, assign and enable buffer
var vPosition = gl.getAttribLocation(program, 'vPosition');
if (vPosition < 0) {
console.log('Failed to get the storage location of vPosition');
//return -1;
}
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, FSIZE * 3, 0);
gl.enableVertexAttribArray(vPosition); // Enable the assignment of the buffer object
// Get the storage location of a_PointSize
var a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
if(a_PointSize < 0) {
console.log('Failed to get the storage location of a_PointSize');
//return -1;
}
gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
gl.enableVertexAttribArray(a_PointSize); // Enable buffer allocation
// Unbind the buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, null);
//return n2;
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
// gl.clear( gl.COLOR_BUFFER_BIT );
// gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
// Clear <canvas>
gl.clear(gl.COLOR_BUFFER_BIT);
// Draw three points
gl.drawArrays(gl.POINTS, 0, n);
}