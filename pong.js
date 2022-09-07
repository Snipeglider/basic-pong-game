"use strict"; // for future-proof error-fixing

// define global variable here
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;

// Sets the position for the paddles where player 1 is on the left and player 2 is on the right, additionally, positioning them in line with the middle of the y axis
var player_1 = new Paddle(10, 0);
player_1.y_position = (height * 0.5) - (player_1.height/2);
var player_2 = new Paddle(785, 0);
player_2.y_position = (height * 0.5) - (player_2.height/2);

// Default value for the score set to 0 for both players
var Player1_Score = 0;
var Player2_Score = 0;

// paddle constructor function
function Paddle(x_position, y_position){
	this.width = 5; // width in pixels
	this.height = 50; // height in pixels
	this.x_position = x_position; // position in pixels
	this.y_position = y_position; // position in pixels
}

// method to draw paddle
Paddle.prototype.render = function(){
	context.fillRect(this.x_position, this.y_position, this.width, this.height); // draw paddle
};

// Method to detect collision of the ball with the paddles, this checks the position of the ball in conjunction to the position of the paddles in order to detect if there is a collision.
Paddle.prototype.collision = function()
{
	if ((ball.x_position + 5 > this.x_position && ball.x_position - 5 < this.x_position + this.width) && (ball.y_position > this.y_position && ball.y_position < this.y_position + this.height))
	{
		ball.x_speed = -ball.x_speed;	//Reverses the speed when a collision is identified		
	}
}
// Method to control movement of the paddles
Paddle.prototype.movement = function(x, y)
{
	this.x_position += x;
	this.y_position += y;
	// Checks if the paddle is in contact with the bounds of the render window
	if (this.y_position - 5 < 0)
		{
			this.y_position = 5; // Sets the position of the paddle in line with the top boundary
		}
	else if (this.y_position + 50 > 400)	// Checks if the position of the paddle + the height is greater than the size of the Y axis of the window
		{
			this.y_position = 345;	// Sets the position of the paddle in line with the bottom boundary
		}
}

// ball constructor function
function Ball(){
	this.x_speed = 1; //pixels per second (change to desired speed)
	this.y_speed = 1; //pixels per second (change to desired speed)
	this.ball_radius = 5; // pixels
	this.x_position = width * 0.5; // position in pixels
	this.y_position = height * 0.5; // position in pixels
}

// method to draw ball
Ball.prototype.render = function(){
	context.beginPath();
	context.arc(this.x_position, this.y_position, this.ball_radius, 0, Math.PI * 2); // draw ball
	context.fill();
}
var ball = new Ball();

// Top and bottom boundaries
function Boundaries(x_position, y_position)
{
	this.width = 800;
	this.height = 5;
	this.x_position = x_position; // position in pixels
	this.y_position = y_position; // position in pixels
}
// Method for drawing the boundaries
Boundaries.prototype.render = function()
{
	context.fillRect(this.x_position, this.y_position, this.width, this.height);
}
// New instances of the object
var TopBoundary = new Boundaries(0, 0);
var BottomBoundary = new Boundaries(0, 0);

function render(){
	context.fillStyle = 'tomato'; // set colour of components within the canvas
	context.clearRect(0, 0, width, height); // clear the canvas
	
	// Draw the ball 
	ball.render();
	
	// Draw player_1 paddle
	
	player_1.render();
	
	// Draw player_2 paddle

	player_2.render();
	
	// Draw boundaries
	TopBoundary.y_position = 0;
	TopBoundary.render();
	BottomBoundary.y_position = 395;
	BottomBoundary.render();
	// Renders the score for each player in their respective locations on the canvas
	context.font = "20px Arial";
	context.fillText (Player1_Score, 10,30);
	context.fillText (Player2_Score, 780,30);
	// Check if either Player 1 or Player 2 have a total of 5 points which then calls for the "Game Over" text to display
	if (Player1_Score == 5 || Player2_Score == 5)
	{
		context.font = "40px Arial";
		context.fillText ("GAME OVER", 275, 200);
	}
}

function update(t_elapsed){
	// Updates the ball position with a diagonal starting direction
	ball.y_position += ball.y_speed;	// Moves the ball up vectically
	ball.x_position -= ball.x_speed;	//Adjusts the movement horizontally to cause the ball to move diagonally
	// Checks if the position comes in contact with the top boundary with an additional 10 pixel value to prevent the ball from overlapping with the rectangle object
	if(ball.y_position < TopBoundary.y_position + 10)
	{
		//When in contact with the boundary, the speed of the ball is reversed to rebound off the object
		ball.y_speed = -ball.y_speed;
	}
	// Same as the top boundary except with negative 5 pixels to smooth out the collision
	if(ball.y_position > BottomBoundary.y_position - 5)
	{
		ball.y_speed = -ball.y_speed;
	}
	
  	// The function is called for each paddle on the canvas to obtain the collision parameters
	player_1.collision();
	player_2.collision();
	
	// Checks if the ball exits the bounds of the canvas by identifying if the position of the ball is less than 0, the left side of the canvas
	if (ball.x_position < 0 )
	{
		// Ball position is reset to the static starting position
		ball.x_position = 400;
		ball.y_position = 200;
		// Paddles are reset along with the ball
		player_1.y_position = (height * 0.5) - (player_1.height/2);
		player_2.y_position = (height * 0.5) - (player_2.height/2);
		// player_2 receives 1 point
		Player2_Score = Player2_Score + 1;	// The counter is updated for Player 2
	}
	// Checks if the ball exits the bounds of the canvas by identifying if the position of the ball is greater than 800, the right side of the canvas
	if (ball.x_position > 800)
	{
		ball.x_position = 400;
		ball.y_position = 200;
		player_2.y_position = (height * 0.5) - (player_1.height/2);
		player_2.y_position = (height * 0.5) - (player_2.height/2);
		// player_1 receives 1 point
		Player1_Score = Player1_Score + 1;	// The counter is updated for Player 1
	}
	// Checks if either player_1 or player_2 have reached a total of 5 points
	if (Player1_Score == 5 || Player2_Score == 5)
	{
		// Ball is reset
		ball.x_position = 400;
		ball.y_position = 200;
		// Paddles are reset
		player_1.y_position = (height * 0.5) - (player_1.height/2);
		player_2.y_position = (height * 0.5) - (player_2.height/2);
	}
}

// Keyboard Inputs for both players


function keyboard_input(event)
{
	// Controls player_1 on the left
	if (event.keyCode == '87')	// W
	{
		player_1.movement(0, -10);	// Paddle is moved -10 pixels in the Y axis
	}
	else if (event.keyCode == '83')	// S
	{
		player_1.movement(0, 10);	// Paddle is moved 10 pixels
	}
		if (event.keyCode == '38')	// UP Arrow
	{
		player_2.movement(0, -10);
	}
	else if (event.keyCode == '40')	// DOWN Arrow
	{
		player_2.movement(0, 10);
	}
	
	console.log(event.keyCode); // use this to view key codes
}

window.addEventListener("keydown", keyboard_input); // listen to keyboard button press

// main game loop
var previous; 
function main(timestamp){
	if (!previous) previous = timestamp; //start with no elapsed time
  	var t_elapsed = (timestamp - previous) / 1000;  //work out the elapsed time
  	update(t_elapsed); //update the game based on elapsed time
  	
		
  	render();	// Calls the render function
	
  	previous = timestamp;  //set the previous timestamp ready for next time
	window.requestAnimationFrame(main); //ask browser to call this function again, when it's ready
}

main();	// Calls the main function
window.requestAnimationFrame(main); // Starts the game loop


