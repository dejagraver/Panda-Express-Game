//ACTION VARIABLES
var isLeft;
var isRight;
var isJumping;
var isPlummeting;

//ITEM VARIABLES
var gameChar_x;
var gameChar_y;
var gameChar_world_x
var scrollPos;
var gameCharLives; 
var livesPanel;
var game_score;
var floorPos_y;
var canyon;
var t_collectable;
var collectableY;
var mountain;
var cloud;
var cloudOffset;
var steps;
var onStep;
var bambooPos_y;
var numSnow;
var snowPositionsX;
var snowPositionsY;
var snowDirectionX;
var snowDirectionY;
var cameraPosX;
var flagpole;
var steps;
var onStep;
// var platforms;
var enemies;

//ARRAYS
var bamboosArray_x; //trees_x
var mountainArray_x;
var stepsArray;
var t_canyon;

var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/snowjump.wav');
    // jumpSound.setVolume(0.1);
	samuraiSound = loadSound('assets/samurai.wav');
	samuraiSound.setVolume(0.8);
	deathSound = loadSound('assets/lifetaken.wav');
	deathSound.setVolume(0.8);
}


function setup()
{
	// createCanvas(windowWidth, windowHeight);
	createCanvas(1024, 576);
	angleMode(DEGREES);

	//Clouds
	cloud = {x_pos: 100, y_pos: -30, size: 40};
	cloudOffset = 0;

	onStep = false;
	//Game Character
	cameraPosX = 0;
	floorPos_y = height * 3/4;
	gameChar_x = width/8;
	gameChar_y = floorPos_y;
	gameCharLives = 3;
	game_score = 0;
	enemies = []; 
	enemies.push(new Enemy(100, floorPos_y, 100));

	//Game Character Movement
	isLeft = false;
	isRight = false;
	isJumping = false;
	isPlummeting = false;

	//Flagpole
	flagpole = {isReached: false, x_pos: 3000};
	//Update the real position of gameChar for collision detection
	//variable to store the real position of the gameChar in the game
	// world. needed for collision detection
	gameChar_world_x = gameChar_x;
	scrollPos = 0; //Variable to controll help with collision

	// platforms = []; //Array to hold platform objects
	// platforms.push(createPlatform(100, floorPos_y - 50, 200, 20));

	//snows 
	snowPositionsX = [];
	snowPositionsY = [];
	snowDirectionX = [];
	snowDirectionY = [];
	numSnow = 1000;
	for(var i = 0; i < numSnow; i++)
	{
		snowPositionsX.push(random(0, width)); //x position of snows
		snowPositionsY.push(random(0, height)); //y position of snows
		snowDirectionX.push(random(-2, 2));
		snowDirectionY.push(random(0, 2));
	}

	//Bamboo Trees - draw multiple Trees of random amount
	var bambooX = -400;
	bamboosArray_x = [];
	for(var i = 0; i < 50; i++) 
	{
		bamboosArray_x.push(bambooX);
		bambooX += random(100, 300);
	}

	//Floating Steps - draw multiple Steps
	stepsArray = [];
	var stepX = 290; // Starting x position
	var stepY = 300; // Starting y position
	for(var i = 0; i < 3; i++){
		stepsArray.push({
			x_pos: stepX + (i * 185), // 185px apart on x-axis - for difficulty/challenge
			y_pos: stepY - (i * 50), // 30px higher each step
			width: 50,
			height: 20,
		});

	}

	//Mountains - draw multiple Mountains of random amount across the x-axis
	mountain = {x_pos: 600, y_pos: height * 1.13/4, size: 50};
	var mountainX = -400;
	mountainArray_x = [];
	for(var i = 0; i < 50; i++) 
	{
		mountainArray_x.push(mountainX);
		mountainX += random(400, 600);
	}
	
	//Canyons - draw multiple Canyons of random amount across the screen
	t_canyon = [];
	var currentX = 400;
	for(var i = 0; i < 40; i++) 
	{
		t_canyon.push(currentX);
		currentX += random(300, 600);
	}
	canyon = {x_pos: 400, y_pos: 432, width: 90, height: 200};
	

	// Canyon - draw a large Canyon
	t_largeCanyon = [];
	var largeCanyonX = 1000;
	for(var i = 0; i < 10; i++)
	{
		t_largeCanyon.push(largeCanyonX);
		largeCanyonX += random(400, 800);
	}

	//Collectables - place one at each step position and random ground positions
	t_collectable = [];
	
	// Step collectables
	for(var i = 0; i < stepsArray.length; i++){
		t_collectable.push({
			x_pos: stepsArray[i].x_pos + 25,
			y_pos: stepsArray[i].y_pos - 30,
			size: 1,
			isFound: false
		});
	}
	
	// Ground collectables
	var collectableX = 550;
	for(var i = 0; i < 20; i++){
		t_collectable.push({
			x_pos: collectableX,
			y_pos: floorPos_y - 15,
			size: 1,
			isFound: false
		});
		collectableX += random(100, 400);
	}

}

function draw()
{
	// Hue, Saturation, Brightness color mode
	// colorMode(HSB, 360, 100, 100);
	//SKY BACKGROUND
	var fromSunsetPink = color(255, 166, 252);
	var toSunsetOrange = color(255, 153, 19);
	noStroke();
	for(var i = 0; i < floorPos_y; i++) {
		var gradientAmount = i / floorPos_y;
		var gradientColor = lerpColor(fromSunsetPink, toSunsetOrange, gradientAmount);
		fill(gradientColor);
		rect(0, i, width, 1);
	}

	//GROUND
	noStroke();
	fill(210,180,140);
	rect(0, floorPos_y, width, height - floorPos_y); 
	
	//GRASS 
	noStroke();
	fill(240, 240, 240, 200);
	rect(0, floorPos_y, width, 20);

	//LIVES PANEL (fixed on screen)
	livesPanel = {x_pos: 10, y_pos: 20, width: 100, height: 30};
	fill(0, 0, 0, 150);
	rect(livesPanel.x_pos, livesPanel.y_pos, livesPanel.width, livesPanel.height);
	fill(255);
	textSize(10);
	text("Lives: " + gameCharLives, livesPanel.x_pos + 25, livesPanel.y_pos + 20);

	//SCROLLING
	push();
	translate(-cameraPosX, 0);
	
	//FALLING SNOW
	drawSnow();

	//CLOUD MOVEMENT
	cloudOffset += 0.8; // Slow cloud movement
	for(var i = 0; i < 40; i++)
	{
		drawClouds(800 + i * 200, -30, 40, 40);
	}
	//CLOUDS
	for(var i = 0; i < 40; i++)
	{
		drawClouds(800 + i * 200, -30, 40, 40);
	}
	
	// MOUNTAINS
	drawMountains();

	//BAMBOO TREE'S
	drawTrees();

	// FLOATING STEPS
	drawFloatingSteps();

	//CANYON
	drawCanyon(t_canyon);
	isTooCloseToCanyon();
	drawLargeCanyon(t_largeCanyon);

	//Draw Platforms
	// for(var i = 0; i < platforms.length; i++) {
	// 	platforms[i].draw();
	// 	if(gameChar_world_x > platforms[i].x && gameChar_world_x < platforms[i].x + platforms[i].length && 
	// 		gameChar_y >= platforms[i].y && gameChar_y <= platforms[i].y + 20) {
	// 		onStep = true;
	// 		gameChar_y = platforms[i].y;
	// 	}
	// }


	// Make character fall if plummeting
	if(isPlummeting == true)
	{
		gameChar_y += 10;
	}
	// Return to false for isJumping and isPlummeting when character is on the ground.
	if(gameChar_y >= floorPos_y && !isPlummeting)
	{
		isPlummeting = false;
		isJumping = false;
	}
	if(gameChar_y >= height)
	{
		isPlummeting = false;
		gameChar_x = width/8;
		gameChar_y = floorPos_y;
		gameCharLives -= 1;
		deathSound.play();
	}
	//TOKEN/COLLECTABLE 
	drawCollectable(t_collectable);
	checkCollectable(t_collectable);

	//the game character
	drawGameChar();
	//Game Character in the center of the screen/scroling view
	cameraPosX = gameChar_x - width/4
	
	pop();

	//FLAGPOLE
	checkFlagPole();
	renderFlagpole();

	//GAMEOVER MESSAGE if lives < 1
	if(gameCharLives < 1)
	{
		fill(0, 0, 0);
		rect(0, 0, width, height)
		fill(255, 255, 255);
		textSize(40);
		text("GAME OVER", width/3, height/2);
		gameChar_x = 0;
		gameChar_y = 0;
	}

	//draw score count (fixed on screen)
	fill(255);
	noStroke();
	text("score: " + game_score, width - 150, 40);

	//Moving Left or Right
	if(isLeft == true)
	{
		gameChar_x -= 8;
	}
	if(isRight == true)
	{
		gameChar_x += 5;
	}

	if(gameChar_y < floorPos_y)
	{
		gameChar_y += 2; //increments the speed in which you can see the character falling 
		isJumping = true; //ensures the falling/jumping image of the character appears
	}
	else
	{
		isJumping = false; //Stops the falling image from appearing once character touches the ground
	}

	// Check if character is on any step
	onStep = false;
	for(var i = 0; i < stepsArray.length; i++){
		if(gameChar_x > stepsArray[i].x_pos && gameChar_x < stepsArray[i].x_pos + stepsArray[i].width && 
		gameChar_y >= stepsArray[i].y_pos && gameChar_y <= stepsArray[i].y_pos + stepsArray[i].height) {
			onStep = true;
			gameChar_y = stepsArray[i].y_pos;
			break;
		}
	}

	// Only fall if not on ground AND not on step
	if(gameChar_y < floorPos_y && !onStep) {
		gameChar_y += 2;
		isJumping = true;
	} else {
		isJumping = false;
	}


	gameChar_world_x = gameChar_x - scrollPos;
}

function keyPressed()
{
	//control the animation of the character when moving LEFT AND RIGHT
	if(keyCode == 37)
	{
		isLeft = true;
	}
	else if(keyCode == 39)
	{
		isRight = true;
	}
	//JUMPING/PREVENT DOUBLE JUMPING
	if(keyCode == 32 && (gameChar_y == floorPos_y || onStep))
	{
		isJumping = true;
		gameChar_y -= 150;
		jumpSound.play();
	}
	else if(keyCode == 32)
	{
		isJumping = false;
	}
}

function keyReleased()
{
	//control the animation of the character when keys are released.
	if(keyCode == 37)
	{
		isLeft = false;
	}
	else if(keyCode == 39)
	{
		isRight = false;
	} 
}

function drawSnow(){
	for(var i = 0; i < numSnow; i++)
	{
		//measure the dist between each star and the centre of the canvas 
		var d = dist(width, height, snowPositionsX[i], snowPositionsY[i]);
		var r = d/450;
		fill(255)
		ellipse(snowPositionsX[i], snowPositionsY[i], r, r);
		snowPositionsX[i] += snowDirectionX[i];
		snowPositionsY[i] += snowDirectionY[i];

	}
}
function drawClouds(){
    // Calculate visible range based on camera position
    var startX = cameraPosX - width;
    var endX = cameraPosX + width * 8;
    
    // Generate clouds every 800 pixels
    for(var i = Math.floor(startX / 800) * 800; i < endX; i += 800) {
        // Draw multiple cloud groups at each position
        for(var j = 0; j < 3; j++) {
            var cloudX = i + (j * 800) + cloudOffset;
            
            fill(255, 255, 255, 225);
            ellipse(cloudX, cloud.y_pos + 170, cloud.size + 60, cloud.size + 30);
            ellipse(cloudX + 60, cloud.y_pos + 150, cloud.size + 60, cloud.size + 35);
            ellipse(cloudX + 80, cloud.y_pos + 170, cloud.size + 60, cloud.size + 30);
            ellipse(cloudX + 20, cloud.y_pos + 140, cloud.size, cloud.size);
            
            fill(255, 255, 255, 245);
            ellipse(cloudX + 290, cloud.y_pos + 120, cloud.size + 50, cloud.size + 20);
            ellipse(cloudX + 340, cloud.y_pos + 90, cloud.size + 50, cloud.size + 25);
            ellipse(cloudX + 360, cloud.y_pos + 120, cloud.size + 50, cloud.size + 20);
            ellipse(cloudX + 300, cloud.y_pos + 80, cloud.size, cloud.size);
            
            fill(255, 255, 255, 230);
            ellipse(cloudX + 600, cloud.y_pos + 190, cloud.size + 70, cloud.size + 1);
            ellipse(cloudX + 650, cloud.y_pos + 170, cloud.size + 70, cloud.size + 15);
            ellipse(cloudX + 670, cloud.y_pos + 190, cloud.size + 70, cloud.size + 10);
            ellipse(cloudX + 575, cloud.y_pos + 160, cloud.size + 90, cloud.size + 2);
            ellipse(cloudX + 610, cloud.y_pos + 150, cloud.size + 50, cloud.size + 5);
        }
    }
}


function drawFloatingSteps(){
    for(var i = 0; i < stepsArray.length; i++){
        noStroke();
        fill(255, 250, 250, 180);
        ellipse(stepsArray[i].x_pos, stepsArray[i].y_pos, stepsArray[i].width, stepsArray[i].height);
		ellipse(stepsArray[i].x_pos + 10, stepsArray[i].y_pos, stepsArray[i].width, stepsArray[i].height);
		ellipse(stepsArray[i].x_pos + 20, stepsArray[i].y_pos + 10, stepsArray[i].width, stepsArray[i].height);
		ellipse(stepsArray[i].x_pos + 30, stepsArray[i].y_pos + 5, stepsArray[i].width, stepsArray[i].height);
		ellipse(stepsArray[i].x_pos + 40, stepsArray[i].y_pos, stepsArray[i].width, stepsArray[i].height);
    }
}

function drawMountains()
{
	for(var i = 0; i < mountainArray_x.length; i++)
	{
		fill(169, 169, 169); //Light Grey 
		triangle(mountainArray_x[i] + 105, mountain.y_pos, //705
				mountainArray_x[i], mountain.y_pos + 270, //600
				mountainArray_x[i] + 225, mountain.y_pos + 270); //Background Mountain //825
				//  Background Mountain Snowy Peak
				fill(255, 255, 255);
				triangle(mountainArray_x[i] + 105.5, mountain.y_pos - 1, //705.5, 180
						mountainArray_x[i] + 90, mountain.y_pos + 38,		 //690, 203
						mountainArray_x[i] + 153, mountain.y_pos + 105);	 //653, 285
				triangle(mountainArray_x[i] + 105.5, mountain.y_pos - 1,  //705.5, 180
						mountainArray_x[i] + 120, mountain.y_pos + 38,		 //720, 203
						mountainArray_x[i] + 64, mountain.y_pos + 105);	 //664, 285
				triangle(mountainArray_x[i] + 90, mountain.y_pos + 50,    //690, 230
						mountainArray_x[i] + 80, mountain.y_pos + 100,		 //680, 280
						mountainArray_x[i] + 120, mountain.y_pos + 45);	 //720, 225

		fill(150,150,150); //Dark Grey
		triangle(mountainArray_x[i] + 175, mountain.y_pos + 56, //775
				mountainArray_x[i] + 25, mountain.y_pos + 270, //625
				mountainArray_x[i] + 350, mountain.y_pos + 270); //Middle Ground Mountain //950
				//  Middle Ground Mountain Snowy Peak
				fill(255, 255, 255);
				triangle(mountainArray_x[i] + 175.5, mountain.y_pos + 55,
						mountainArray_x[i] + 180, mountain.y_pos + 108,
						mountainArray_x[i] + 252.5, mountain.y_pos + 150);
				triangle(mountainArray_x[i] + 175.5, mountain.y_pos + 55,
						mountainArray_x[i] + 190, mountain.y_pos + 140,
						mountainArray_x[i] + 102.5, mountain.y_pos + 160);

	};
}

function drawTrees()
{
	bambooPos_y = floorPos_y/1.75;
	for(i = 0; i < bamboosArray_x.length; i++)
	{
		if(!isTooCloseToCanyon(bamboosArray_x[i]))
		{
			noStroke();
		fill(85,107,47);
		rect(bamboosArray_x[i], bambooPos_y, 8, 200);
			//Bamboo shutes at bambooPos_x & bambooPos_x + bambooWidth
			stroke(107,142,35)
			strokeWeight(2);
				//Left side
				line(bamboosArray_x[i], bambooPos_y + 50, bamboosArray_x[i] - 40, bambooPos_y);
				line(bamboosArray_x[i], bambooPos_y + 100, bamboosArray_x[i] - 40, bambooPos_y + 50);
				//Rigth side
				//Right side
				line(bamboosArray_x[i] + 8, bambooPos_y + 60, bamboosArray_x[i] + 48, bambooPos_y + 10);
				line(bamboosArray_x[i] + 8, bambooPos_y + 110, bamboosArray_x[i] + 48, bambooPos_y + 70);
					//Bamboo horizontal line detail 
					stroke(154,205,50);
					strokeWeight(1.5);
					line(bamboosArray_x[i], bambooPos_y, bamboosArray_x[i] + 8, bambooPos_y);
					line(bamboosArray_x[i], bambooPos_y + 25, bamboosArray_x[i] + 8, bambooPos_y + 25);
					line(bamboosArray_x[i], bambooPos_y + 50, bamboosArray_x[i] + 8, bambooPos_y + 50);
					line(bamboosArray_x[i], bambooPos_y + 75, bamboosArray_x[i] + 8, bambooPos_y + 75);
					line(bamboosArray_x[i], bambooPos_y + 100, bamboosArray_x[i] + 8, bambooPos_y + 100);
					line(bamboosArray_x[i], bambooPos_y + 125, bamboosArray_x[i] + 8, bambooPos_y + 125);
					line(bamboosArray_x[i], bambooPos_y + 150, bamboosArray_x[i] + 8, bambooPos_y + 150);
		}
	}
}

function drawCollectable(t_collectable){
	for(var i = 0; i < t_collectable.length; i++)
	{
		if(!t_collectable[i].isFound)
		{
			noStroke();
			fill(0);
			rect(t_collectable[i].x_pos, t_collectable[i].y_pos, t_collectable[i].size + 3, t_collectable[i].size + 15) //samurai sword black handle 
			//samurai sword blade
			fill(211, 211, 211);
			rect(t_collectable[i].x_pos, t_collectable[i].y_pos - 30, 4, 30)
			//samurai sword golden tsuba/guard
			fill(218, 165, 32);
			rect(t_collectable[i].x_pos - 6, t_collectable[i].y_pos, t_collectable[i].size + 14, t_collectable[i].size + 1)
			//samurai sword edge
			fill(211, 211, 211);
			triangle(t_collectable[i].x_pos, t_collectable[i].y_pos - 24, t_collectable[i].x_pos + 4, t_collectable[i].y_pos - 24, t_collectable[i].x_pos + 4, t_collectable[i].y_pos - 49)
			//samurai sword detail/edge pattern
			stroke(128, 128, 128);
			strokeWeight(0.1);
			line(t_collectable[i].x_pos + 1.5, t_collectable[i].y_pos - 25, t_collectable[i].x_pos + 1.5, t_collectable[i].y_pos - 5)
		}
	}
}

function checkCollectable(t_collectable)
{
    for(var i = 0; i < t_collectable.length; i++) 
    {
        if(!t_collectable[i].isFound && dist(gameChar_x, gameChar_y, t_collectable[i].x_pos, t_collectable[i].y_pos) <= 40)
        {
            t_collectable[i].isFound = true;
            game_score += 5;
			samuraiSound.play();
        }
    }
}

function drawCanyon(t_canyon){
	for(var i = 0; i < t_canyon.length; i++)
	{
		noStroke();
		fill(154,180,180);
		rect(
			t_canyon[i], 
			canyon.y_pos, 
			canyon.width, 
			canyon.height
		);
		if(gameChar_x > t_canyon[i] && gameChar_x < t_canyon[i] + canyon.width && gameChar_y >= floorPos_y)
		{
			isPlummeting = true;
			break;
		}
	}
}

function drawLargeCanyon(t_largeCanyon){
	for(var i = 0; i < t_largeCanyon.length; i++)
	{
		if(!isTooCloseToCanyon(t_largeCanyon[i])){
			noStroke();
			fill(154,180,180);
			rect(
				t_largeCanyon[i], 
				canyon.y_pos, 
				canyon.width + 200, 
				canyon.height
			);
			if(gameChar_x > t_largeCanyon[i] && gameChar_x < t_largeCanyon[i] + canyon.width && gameChar_y >= floorPos_y)
			{
				isPlummeting = true;
				break;
			}
		}
	}
}

function isTooCloseToCanyon(x) {
    for(var i = 0; i < t_canyon.length; i++) {
        if(x > t_canyon[i] - 10 && x < t_canyon[i] + canyon.width + 10) {
            return true;
        }
    }
    return false;
}

function renderFlagpole(){
    push();
    stroke(0); // Brown color
    strokeWeight(2);
	var screenX = flagpole.x_pos - cameraPosX;
    line(screenX, floorPos_y, screenX, floorPos_y - 200);
	if(flagpole.isReached == true)
	{
		fill(255, 255, 255);
		textSize(40);
		text("LEVEL COMPLETE", width/3, height/2);
		noStroke();
		fill(254);
		rect(screenX - 1, floorPos_y - 201, 70, 50);
		fill(255, 0, 0);
		ellipse(screenX + 32, floorPos_y - 175, 30);
	}
	else
	{
	
		noStroke();
		fill(254);
		rect(screenX - 1 , floorPos_y - 49, 70, 50);
		fill(255, 0, 0);
		ellipse(screenX + 32, floorPos_y - 26, 30);
	}
    pop();
}

function checkFlagPole(){
    var d = abs(gameChar_world_x - flagpole.x_pos); // Use abs() for absolute distance
    if(d < 15)
    {
        flagpole.isReached = true;
    }
    console.log(d);
}

// function enemies(x, y, range) {
	
// 		this.x = x;
// 		this.y = y;
// 		this.range = range;
// 		this.currentX = x;
// 		this.increment = 2; 
// 		this.update = function() {
// 			this.currentX += this.increment;
// 			if(this.currentX > this.x + this.range || this.currentX < this.x - this.range) {
// 				this.increment *= -1; // Reverse direction
// 			}
// 		}
// 		this.draw = function() {
// 			noStroke();
// 			fill(255, 0, 0);
// 			ellipse(this.currentX - cameraPosX, this.y, 20, 20); // Draw enemy as a red circle
// 		}
// 		this.isColliding = function(gameChar_x, gameChar_y) {
// 			var d = dist(this.currentX - cameraPosX, this.y, gameChar_x, gameChar_y);
// 			if(d < 20) { // Collision radius
// 				return true;
// 			} else {
// 				return false;
// 			}
// 		}
// 		this.reset = function() {
// 			this.currentX = this.x; // Reset to initial position
// 			this.increment = 2; // Reset increment
// 		}
	
// }

function Enemy(x, y, range) {
	
		this.x = x;
		this.y = y;
		this.range = range;
		this.currentX = x;
		this.increment = 2; 
		this.update = function() {
			if(this.currentX >= this.x + this.range) {
				this.increment = -1; // Reverse direction
			}
			else if(this.currentX < this.x - this.range) {
				this.increment = 1; // Reverse direction
			}
		}
		this.draw = function() {
			this.update(); // Update position before drawing
			noStroke();
			fill(255, 0, 0);
			ellipse(this.currentX - cameraPosX, this.y, 20, 20); // Draw enemy as a red circle
		}
		this.checkCollision = function(gameChar_x, gameChar_y) {
			var d = dist(this.currentX - cameraPosX, this.y, gameChar_x, gameChar_y);
			if(d < 20) { // Collision radius
				return true;
			} else {
				return false;
			}
		}
		this.reset = function() {
			this.currentX = this.x; // Reset to initial position
			this.increment = 2; // Reset increment
		}
		this.move = function() {
			this.currentX += this.increment;
			if(this.currentX > this.x + this.range || this.currentX < this.x - this.range) {
				this.increment *= -1; // Reverse direction
			}
		}
		this.isColliding = function(gameChar_x, gameChar_y) {
			var d = dist(this.currentX - cameraPosX, this.y, gameChar_x, gameChar_y);
			if(d < 20) { // Collision radius
				return true;
			} else {
				return false;
			}
		}
}
// function createPlatform(x, y, width, length) {

// 	var p = {
// 		x: x,
// 		y: y,
// 		length: length,
// 		draw: function() {
// 			noStroke();
// 			fill(150, 75, 0); // Brown color for the platform
// 			rect(this.x - cameraPosX, this.y, this.length, 20);
// 		},
// 		isColliding: function(gameChar_x, gameChar_y) {
// 			if(gameChar_x > this.x - cameraPosX && gameChar_x < this.x - cameraPosX + this.length &&
// 			   gameChar_y >= this.y && gameChar_y <= this.y + 20) {
// 				return true;
// 			} else {
// 				return false;
// 			}
// 		}
// 	}
// 	return p;
// }

function drawGameChar(){
	if(isLeft && isJumping)
	{
	// add your jumping-left code
		stroke(0);
		strokeWeight(1);
		//left ear
		fill(0);
		ellipse(gameChar_x - 8, gameChar_y - 55, 8, 9);

		//right ear
		fill(0);
		ellipse(gameChar_x + 8, gameChar_y - 55, 8, 9);

		//neck
		fill(0);
		rect(gameChar_x - 2, gameChar_y - 41, 4, 8);

		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 48, 17.5, 18);

		//Left Leg
		fill(0);
		rect(gameChar_x - 8, gameChar_y - 14, 4, 8);
			//Left Leg Bent
			fill(0);
			rect(gameChar_x - 8, gameChar_y -6, 8, 3);
				//Left Foot
				fill(0);
				ellipse(gameChar_x , gameChar_y -2, 4, 8);

		//Right Leg
		fill(0);
		rect(gameChar_x + 4, gameChar_y - 14, 4, 8);
			//Right Leg Bent
			fill(0);
			rect(gameChar_x + 4, gameChar_y -6, 8, 3);
				//Right Foot
				fill(0);
				ellipse(gameChar_x + 12, gameChar_y -2, 4, 8);

		//body
		fill(255);
		ellipse(gameChar_x, gameChar_y - 24.25, 24, 28);
				//body black chest
				fill(0);
				ellipse(gameChar_x, gameChar_y - 30, 22, 16);

		//Left Arm
		fill(0);
		ellipse(gameChar_x - 12, gameChar_y - 27, 4, 8);
				//Left Arm Bent
				fill(0);
				ellipse(gameChar_x - 15, gameChar_y - 23, 9, 4);

		//Right Arm 
		fill(0);
		ellipse(gameChar_x + 12, gameChar_y - 25, 4, 14);

	}
	else if(isRight && isJumping)
	{
	// add your jumping-right code
		stroke(0);
		strokeWeight(1);	
		//left ear
		fill(0); 
		ellipse(gameChar_x - 8, gameChar_y - 55, 8, 9);

		//right ear
		fill(0);
		ellipse(gameChar_x + 8, gameChar_y - 55, 8, 9);

		//neck
		fill(0);
		rect(gameChar_x - 2, gameChar_y - 41, 4, 8);

		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 48, 17.5, 18);
		
		//Left Leg
		fill(0);
		rect(gameChar_x - 8, gameChar_y - 14, 4, 8);
			//Left Leg Bent
			fill(0);
			rect(gameChar_x - 12, gameChar_y -6, 8, 3);
				//Left Foot
				fill(0);
				ellipse(gameChar_x -12, gameChar_y -2, 4, 8);

		//Right Leg
		fill(0);
		rect(gameChar_x + 4, gameChar_y - 14, 4, 8);
			//Right Leg Bent
			fill(0);
			rect(gameChar_x, gameChar_y -6, 8, 3);
				//Right Foot
				fill(0);
				ellipse(gameChar_x, gameChar_y -2, 4, 8);

		//body
		fill(255);
		ellipse(gameChar_x, gameChar_y - 24.25, 24, 28);
				//body black chest
				fill(0);
				ellipse(gameChar_x, gameChar_y - 30, 22, 16);

		//Left Arm
		fill(0);
		ellipse(gameChar_x - 12, gameChar_y - 25, 4, 14);

		//Right Arm 
		fill(0);
		ellipse(gameChar_x + 12, gameChar_y - 27, 4, 8);
			//Right Arm Bent
			fill(0);
			ellipse(gameChar_x + 15, gameChar_y - 23, 9, 4);

	}
	else if(isLeft)
	{
	// add your walking left code
		stroke(0);
		strokeWeight(1);

		//left ear
		fill(0);
		ellipse(gameChar_x - 8, gameChar_y - 55, 8, 9);

		//right ear
		fill(0);
		ellipse(gameChar_x + 8, gameChar_y - 55, 8, 9);

		//neck
		fill(0);
		rect(gameChar_x - 2, gameChar_y - 41, 4, 8);

		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 48, 17.5, 18);

		//Left Leg
		fill(0);
		rect(gameChar_x - 8, gameChar_y - 14, 4, 12);
			//Left Foot
			fill(0);
			ellipse(gameChar_x - 8, gameChar_y -2, 8, 4);

		//Right Leg
		fill(0);
		rect(gameChar_x + 4, gameChar_y - 14, 4, 12);
			//Right Foot 
			fill(0);
			ellipse(gameChar_x + 4, gameChar_y -2, 8, 4);

		//body
		fill(255);
		ellipse(gameChar_x, gameChar_y - 24.25, 24, 28);
				//body black chest
				fill(0);
				ellipse(gameChar_x, gameChar_y - 30, 22, 16);

		//Left Arm
		fill(0);
		ellipse(gameChar_x - 12, gameChar_y - 27, 4, 8);
				//Left Arm Bent
				fill(0);
				ellipse(gameChar_x - 15, gameChar_y - 23, 9, 4);

		//Right Arm 
		fill(0);
		ellipse(gameChar_x + 12, gameChar_y - 25, 4, 14);

	}
	else if(isRight)
	{
	// add your walking right code
		stroke(0);
		strokeWeight(1);
		//left ear
		fill(0);
		ellipse(gameChar_x - 8, gameChar_y - 55, 8, 9);
	
		//right ear
		fill(0);
		ellipse(gameChar_x + 8, gameChar_y - 55, 8, 9);
	
		//neck
		fill(0);
		rect(gameChar_x - 2, gameChar_y - 41, 4, 8);

		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 48, 17.5, 18);
	
		//Left Leg
		fill(0);
		rect(gameChar_x - 8, gameChar_y - 14, 4, 12);
			//Left Foot
			fill(0);
			ellipse(gameChar_x - 4, gameChar_y -2, 8, 4);
	
		//Right Leg
		fill(0);
		rect(gameChar_x + 4, gameChar_y - 14, 4, 12);
			//Right Foot 
			fill(0);
			ellipse(gameChar_x + 8, gameChar_y -2, 8, 4);

		//body
		fill(255);
		ellipse(gameChar_x, gameChar_y - 24.25, 24, 28);
				//body black chest
				fill(0);
				ellipse(gameChar_x, gameChar_y - 30, 22, 16);

		//Left Arm
		fill(0);
		ellipse(gameChar_x - 12, gameChar_y - 25, 4, 14);
	
		//Right Arm 
		fill(0);
		ellipse(gameChar_x + 12, gameChar_y - 27, 4, 8);
			//Right Arm Bent
			fill(0);
			ellipse(gameChar_x + 15, gameChar_y - 23, 9, 4);

	}
	else if(isJumping || isPlummeting)
	{
	//jumping facing forwards code
		//left ear
		stroke(0);	
		strokeWeight(1); 
		fill(0);
		ellipse(gameChar_x - 8, gameChar_y - 55, 9, 9);

		//right ear
		fill(0);
		ellipse(gameChar_x + 8, gameChar_y - 55, 9, 9);

		//neck
		fill(0);
		rect(gameChar_x - 2, gameChar_y - 41, 4, 8);

		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 48, 18, 18);

		//Left Leg
		fill(0);
		rect(gameChar_x - 8, gameChar_y - 14, 4, 8);
			//Left Leg Bent
			fill(0);
			rect(gameChar_x - 8, gameChar_y -6, 8, 3);
				//Left Foot
				fill(0);
				ellipse(gameChar_x , gameChar_y -2, 4, 8);

		//Right Leg
		fill(0);
		rect(gameChar_x + 4, gameChar_y - 14, 4, 8);
			//Right Leg Bent
			fill(0);
			rect(gameChar_x + 4, gameChar_y -6, 8, 3);
				//Right Foot
				fill(0);
				ellipse(gameChar_x + 12, gameChar_y -2, 4, 8);
		//body
		fill(255);
		ellipse(gameChar_x, gameChar_y - 24.25, 24, 28);
				//body black chest
				fill(0);
				ellipse(gameChar_x, gameChar_y - 30, 22, 16);

		//Left Arm
		fill(0);
		ellipse(gameChar_x - 10, gameChar_y - 37, 4, 14);

		//Right Arm 
		fill(0);
		ellipse(gameChar_x + 10, gameChar_y - 37, 4, 14);

	}
	else
	{
	//standing front facing code
		stroke(0);
		strokeWeight(1);
		//left ear
		fill(0);
		ellipse(gameChar_x - 8, gameChar_y - 55, 9, 9);

		//right ear
		fill(0);
		ellipse(gameChar_x + 8, gameChar_y - 55, 9, 9);

		//neck
		fill(0);
		rect(gameChar_x - 2, gameChar_y - 41, 4, 8);

		//Head
		fill(255);
		ellipse(gameChar_x, gameChar_y - 48, 18, 18);

		//Left Leg
		fill(0);
		rect(gameChar_x - 8, gameChar_y - 14, 4, 12);
			//Left Foot
			fill(0);
			ellipse(gameChar_x - 8, gameChar_y -2, 8, 4);

		//Right Leg
		fill(0);
		rect(gameChar_x + 4, gameChar_y - 14, 4, 12);
			//Right Foot 
			fill(0);
			ellipse(gameChar_x + 8, gameChar_y -2, 8, 4);

		//body
		fill(255);
		ellipse(gameChar_x, gameChar_y - 24.25, 24, 28);
			//body black chest
			fill(0);
			ellipse(gameChar_x, gameChar_y - 30, 22, 16);

		//Left Arm
		fill(0);
		ellipse(gameChar_x - 14, gameChar_y - 32, 10, 4);
				//Left Arm Bent
				fill(0);
				ellipse(gameChar_x - 18, gameChar_y - 36, 4, 10);
		
		//Right Arm 
		fill(0);
		ellipse(gameChar_x + 14, gameChar_y - 32, 10, 4);
				//Right Arm Bent
				fill(0);
				ellipse(gameChar_x + 18, gameChar_y - 36, 4, 10);
	}
	
	pop();

}