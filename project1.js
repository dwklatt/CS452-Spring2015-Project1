var gl;
var points;
var x = 0;
var y = 0;
var time = 1;
var score = 0;
var high_score = 0;
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

  //moving highscore under score
  var high_score_board = document.getElementById("high_score");
  high_score_board.style.left = window_w/2 + 50 + "px"

  //webgl stuff
  var canvas = document.getElementById( "gl-canvas" );
  canvas.width = window_w/2;
  canvas.height = window_h - 40;

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }
  //
  // Configure WebGL
  //
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.0, 1.0, 0.0, 1.0 );
  //document.onkeydown = handleKeyDown;
  //document.onkeyup = handleKeyUp;
  // Load shaders and initialize attribute buffers
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
  window.onkeydown = function( event ) {
    switch( event.keyCode ) {
      //up
      case 38:
        if(0.8 > y-0.1){
          y = y+0.1;
        }
        break;
      //down
      case 40:
        if(-0.8 < y-0.1){
          y = y-0.1;
        }
        break;
      //right
      case 39:
        if(0.79 > x-0.1){
          x = x+0.1;
        }
        break;
      //left
      case 37:
        if(-0.9 < x-0.1){
          x = x-0.1;
        }
        break;
    }
    var shape = new Float32Array([
      x, y,
      x-0.1, y-0.15,
      x+0.1, y-0.15,
      x, y-0.2,
      x+0.1, y-0.05
    ]);

    var shape2 = new Float32Array([
      x, y,
      x-0.1, y-0.15,
      x+0.1, y-0.15,
      x, y-0.2,
      x+0.1, y-0.05
    ]);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, shape, gl.STATIC_DRAW );
    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    // Load the data into the GPU
    // Associate our shader variables with our data buffer
    render();
    //not sure if this should go here or in render?
    if (!hasLost()) { updateScore(); }
    else { newGame(); }
  };
};

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );
  gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
}

//Starts a new game
function newGame() {
  if (score > high_score) { high_score = score; }
  score = 0;
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
