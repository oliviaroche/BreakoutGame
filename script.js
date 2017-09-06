var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); /*The drawing context for the canvas*/

var x = canvas.width/2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var paddleWidth = 75;
var paddleHeight = 10;
var paddleX = (canvas.width - paddleWidth)/2; //position of paddle on x axis.
var paddleY = (canvas.height - paddleHeight);
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 5;

var bricks = [];
	for (var c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = {x: 0, y: 0, status: 1};
	}
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function drawBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				var brickX = (c * (brickWidth+brickPadding)) + brickOffsetLeft;
				var brickY = (r * (brickHeight+brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function keyDownHandler(event) {
	if (event.keyCode == 39) {
		rightPressed = true;
	} else if (event.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(event) {
	if (event.keyCode == 39) {
		rightPressed = false;
	} else if (event.keyCode == 37) {
		leftPressed = false;
	}
}

function drawBall() {
	//drawing code
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2); // x, y, radius, start angle, end angle (angles in radians). Math.PI*2 = 6.28 radians 360 degrees
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function collisionDetection() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r]; //b = position of ball
			//calculations
			if(b.status == 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					if (score == brickRowCount*brickColumnCount) {
						alert("YOU WIN!")
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "0095DD";
	ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "0095DD";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
	//drawing code
	ctx.clearRect(0, 0,  canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawBricks();
	collisionDetection();
	drawScore();
	drawLives();

	if (y + dy < ballRadius) {
		dy = -dy
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy
		} else {
			lives--;
			if (!lives) {
				alert("GAME OVER");
				document.location.reload();
			} else {
				x = canvas.width/2;
				y = canvas.height - 30;
				dx = ballSpeed;
				dy = -ballSpeed;
				paddleX = (canvas.width - paddleWidth)/2;

			}
		}	
	}

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx //if either statement is true, reverse movement of ball on x axis by setting dx = negative of itself. radius is subtracted from height and width of canvas so that ball bounces back when the edge hits the wall and not the centre.
	}

	x += dx; // add 2 to x every 10 milliseconds
	y += dy; // subtracts 2 from y every 10 milliseconds
	requestAnimationFrame(draw);

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}
}

document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(event) {
	var relativeX = event.clientX - canvas.offsetLeft;
	if (relativeX < 0 + paddleWidth/2) {
		paddleX = 0
	} else if (relativeX > canvas.width - paddleWidth/2) {
		paddleX = canvas.width - paddleWidth;
	} else {
		paddleX = relativeX - paddleWidth/2
	}
}

draw();