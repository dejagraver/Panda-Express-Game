//ACTION VARIABLES
var isLeft;
var isRight;
var isJumping;
var isPlummeting;

//ITEM VARIABLES
var gameChar_x;
var gameChar_y;
var gameChar_world_x;
var scrollPos;
var gameCharLives; 
var livesPanel;
var game_score;
var floorPos_y;
var canyon;
var sushiCollectable;
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
    jumpSound.setVolume(0.8);
	samuraiSound = loadSound('assets/samurai.wav');
	samuraiSound.setVolume(0.8);
	coinSound = loadSound('assets/coin.wav');
	coinSound.setVolume(0.8);
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
	gameCharLives = 5; //number of lives
	game_score = 0;
	collisionTimer = 0;
	gameChar_world_x = gameChar_x;

	//Enemies
	enemies = []; 
	enemies.push(new Enemy(500, floorPos_y, 100));


	//Game Character Movement
	isLeft = false;
	isRight = false;
	isJumping = false;
	isPlummeting = false;

	//Flagpole
	flagpole = {isReached: false, x_pos: 3000};
	scrollPos = 0; //Variable to controll help with collision

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

	// Canyon - draw a large Canyon at safe positions
	t_largeCanyon = [1500, 2600]; // Fixed positions away from small canyons

	//Floating Steps - position over large canyons
	stepsArray = [];
	for(var i = 0; i < t_largeCanyon.length; i++){
		var stepX = t_largeCanyon[i] + 20; 
		var stepY = 300;
		for(var j = 0; j < 3; j++){
			stepsArray.push({
				x_pos: stepX + (j * 180),
				y_pos: stepY - (j * 50),
				width: 50,
				height: 20,
			});
		}
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
	
	sushiCollectable = [];
	//Sushi collectables placed above canyons
	for(var i = 0; i < t_canyon.length; i++){
		sushiCollectable.push({
			x_pos: t_canyon[i] + 45,
			y_pos: canyon.y_pos - 110,
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

	//SUNSET RAYS
	noStroke();
	fill(255, 255, 150, 30);
	triangle(width/2 + 19500, floorPos_y - 800, width/2 + 6500, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 + 4500, floorPos_y - 800, width/2 + 2500, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 + 2100, floorPos_y - 800, width/2 + 1500, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 + 1350, floorPos_y - 800, width/2 + 1000, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 + 900, floorPos_y - 800, width/2 + 700, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 + 650, floorPos_y - 800, width/2 + 500, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 + 425, floorPos_y - 800, width/2 + 300, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 + 200, floorPos_y - 800, width/2 + 100, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 - 25 , floorPos_y - 800, width/2 + 50, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 - 200, floorPos_y - 800, width/2 - 100, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 - 425, floorPos_y - 800, width/2 - 300, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 - 650, floorPos_y - 800, width/2 - 500, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 - 900, floorPos_y - 800, width/2 - 700, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 - 1350, floorPos_y - 800, width/2 - 1000, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 - 2100, floorPos_y - 800, width/2 - 1500, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 - 4500, floorPos_y - 800, width/2 - 2500, floorPos_y - 800, width/2, floorPos_y);
	triangle(width/2 - 19500, floorPos_y - 800, width/2 - 6500, floorPos_y - 800, width/2, floorPos_y);

	//SUN 
	fill(255, 255, 150, 190);
	ellipse(width/2, floorPos_y + 60, 450, 370);

	//GROUND
	noStroke();
	fill(210,180,140);
	rect(0, floorPos_y, width, height - floorPos_y); 
	
	//GRASS 
	noStroke();
	fill(240, 240, 240, 200);
	rect(0, floorPos_y, width, 20);

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

	//CANYON
	drawCanyon(t_canyon);
	isTooCloseToCanyon();
	drawLargeCanyon(t_largeCanyon);

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
		game_score -= 1;
		deathSound.play();
	}
	//TOKEN/COLLECTABLE 
	drawCollectable(t_collectable);
	checkCollectable(t_collectable);


	//GAMECHARACTER
	drawGameChar();
	//Game Character in the center of the screen/scroling view
	cameraPosX = gameChar_x - width/4
	
	pop();

	//FLAGPOLE
	checkFlagPole();
	renderFlagpole();

	//ENEMIES
	for(var i = 0; i < enemies.length; i++){
		enemies[i].draw();
		if(enemies[i].checkCollision(gameChar_x, gameChar_y) && millis() > collisionTimer){
			gameCharLives -= 1;
			game_score -= 2;
			deathSound.play();
			gameChar_x = width/8;
			gameChar_y = floorPos_y;
			collisionTimer = millis() + 2000; //to prevent multiple collisions
		}
	}
	
	//"GAMEOVER" message if lives < 1
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
	
	//LIVES & SCORE PANEL (fixed on screen)
	livesPanel = {x_pos: 10, y_pos: 20, width: 100, height: 30};
	fill(255, 255, 255, 150);
	rect(livesPanel.x_pos, livesPanel.y_pos, livesPanel.width, livesPanel.height);
	fill(0);
	noStroke();
	textSize(10);
	text("LIVES: " + gameCharLives, livesPanel.x_pos + 15, livesPanel.y_pos + 25);
	noStroke();
	text("SCORE: " + game_score, livesPanel.x_pos + 15, livesPanel.y_pos + 12);

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
	// Control the animation of the character when moving LEFT AND RIGHT
	if(keyCode == 37)
	{
		isLeft = true;
	}
	else if(keyCode == 39)
	{
		isRight = true;
	}
	// JUMPING/PREVENT DOUBLE JUMPING
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
		//Measure the dist between each star and the centre of the canvas 
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
        fill(255, 250, 250, 190);
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
					stroke(154,205,50, 150);
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

function drawSushiCollectable(sushiCollectable){
	for(var i = 0; i < sushiCollectable.length; i++)
	{
		if(!sushiCollectable[i].isFound)
		{
			noStroke();
			fill(0);
			ellipse(sushiCollectable[i].x_pos, sushiCollectable[i].y_pos, 24, 20); // seaweed wrap base
			// sushi rice filling
			fill(255,245,238); // Off-white for sushi rice
			ellipse(sushiCollectable[i].x_pos, sushiCollectable[i].y_pos - 6, 20, 8.25); // Sushi rice base
			// black seaweed wrap
			fill(0); 
			ellipse(sushiCollectable[i].x_pos + 7, sushiCollectable[i].y_pos + 4, 8, 6); // Seaweed wrap
			rect(sushiCollectable[i].x_pos - 11.5, sushiCollectable[i].y_pos + 3, 22.75, 6); // Seaweed wrap
			ellipse(sushiCollectable[i].x_pos, sushiCollectable[i].y_pos + 9, 22.75, 5); // Seaweed wrap
			//toppings
			noStroke();
			fill(154, 205, 70, 200); // Green for wasabi
			ellipse(sushiCollectable[i].x_pos + 3.75, sushiCollectable[i].y_pos - 6, 2.75, 7); // Small wasabi detail
			fill(255,99,71); // Tomato color for salmon topping
			ellipse(sushiCollectable[i].x_pos, sushiCollectable[i].y_pos - 6, 2.75, 7); // Salmon topping
			fill(255,215,0); // Gold color for yellow fish
			ellipse(sushiCollectable[i].x_pos - 3.75, sushiCollectable[i].y_pos - 6, 2.75, 7); // Yellow fish base
		}
	}
}

function checkCollectable(t_collectable)
{
	//check samurai sword collectables
    for(var i = 0; i < t_collectable.length; i++) 
    {
        if(!t_collectable[i].isFound && dist(gameChar_x, gameChar_y, t_collectable[i].x_pos, t_collectable[i].y_pos) <= 40)
        {
            t_collectable[i].isFound = true;
            t_collectable[i].messageTimer = millis() + 1000; // Show message for 1 second
            game_score += 5;
			samuraiSound.play();
        }
    }

	//check sushi collectables
	for(var i = 0; i < sushiCollectable.length; i++){
		if(!sushiCollectable[i].isFound && dist(gameChar_x, gameChar_y, sushiCollectable[i].x_pos, sushiCollectable[i].y_pos) <= 40	)
		{
			sushiCollectable[i].isFound = true;
			sushiCollectable[i].messageTimer = millis() + 1000; // Show message for 1 second
			game_score += 10;
			coinSound.play();
		}
	}
    
    // Draw +5 "message" for collectables that were recently found
    for(var i = 0; i < t_collectable.length; i++) 
    {
        if(t_collectable[i].isFound && t_collectable[i].messageTimer && millis() < t_collectable[i].messageTimer)
        {
            fill(0);
            textSize(10);
            text("+5", t_collectable[i].x_pos, t_collectable[i].y_pos - 40);
        }
    }

	// Draw +10 "message" for sushi collectables that were recently found
	for(var i = 0; i < sushiCollectable.length; i++){
		if(sushiCollectable[i].isFound && sushiCollectable[i].messageTimer && millis() < sushiCollectable[i].messageTimer)
		{
			fill(0);
			textSize(10);
			text("+10", sushiCollectable[i].x_pos, sushiCollectable[i].y_pos - 40);
		}
	}
}

function drawCanyon(t_canyon){
	for(var i = 0; i < t_canyon.length; i++)
	{
		noStroke();
		fill(154,180,180); //water well
		rect(
			t_canyon[i], 
			canyon.y_pos, 
			canyon.width, 
			canyon.height
		);
		fill(135,206,250); // Position water slightly above the bottom
		rect(
			t_canyon[i], 
			canyon.y_pos + canyon.height + 20, 
			canyon.width, 
			- 100 // Water height
		);
		fill(160,122,85); 		//wooden well logs on the sides of the canyon
		rect(t_canyon[i], canyon.y_pos, 8, canyon.height);
		rect(t_canyon[i] + canyon.width - 8, canyon.y_pos, 8, canyon.height);
		if(gameChar_x > t_canyon[i] && gameChar_x < t_canyon[i] + canyon.width && gameChar_y >= floorPos_y)
		{
			isPlummeting = true;
			break;
		}
			//wooden striations
			stroke(139,69,19);
			strokeWeight(0.5);
			//left side
			line(t_canyon[i] + 2.75, canyon.y_pos + 5, t_canyon[i] + 2.75, canyon.y_pos + 40 );
			line(t_canyon[i] + 4.25, canyon.y_pos + 10, t_canyon[i] + 4.25, canyon.y_pos + 70 );
			line(t_canyon[i] + 2, canyon.y_pos + 50, t_canyon[i] + 2, canyon.y_pos + 90 );
			line(t_canyon[i] + 6.5, canyon.y_pos + 50, t_canyon[i] + 6.5, canyon.y_pos + 95 );
			line(t_canyon[i] + 3, canyon.y_pos + 100, t_canyon[i] + 3, canyon.y_pos + 175 );
			//right side
			line(t_canyon[i] + 85, canyon.y_pos + 5, t_canyon[i] + 85, canyon.y_pos + 40 );
			line(t_canyon[i] + 87.5, canyon.y_pos + 10, t_canyon[i] + 87.5, canyon.y_pos + 70 );
			line(t_canyon[i] + 85, canyon.y_pos + 50, t_canyon[i] + 85, canyon.y_pos + 90 );
			line(t_canyon[i] + 86, canyon.y_pos + 100, t_canyon[i] + 86, canyon.y_pos + 175 );
	}
	
	// Draw sushi collectables above regular canyons only
	drawSushiCollectable(sushiCollectable);
}

function isTooCloseToCanyon(x) {
    for(var i = 0; i < t_canyon.length; i++) {
        if(x > t_canyon[i] - 5 && x < t_canyon[i] + canyon.width + 5) {
            return true;
        }
    }
    return false;
}

function drawLargeCanyon(t_largeCanyon){
	for(var i = 0; i < t_largeCanyon.length; i++)
	{
		noStroke();
		fill(154,180,180);
		rect(
			t_largeCanyon[i], 
			canyon.y_pos, 
			canyon.width + 200, 
			canyon.height
		);
		if(gameChar_x > t_largeCanyon[i] && gameChar_x < t_largeCanyon[i] + canyon.width + 200 && gameChar_y >= floorPos_y)
		{
			isPlummeting = true;
			break;
		}
	}
	
	// Draw floating steps above large canyons only
	drawFloatingSteps();
}

function renderFlagpole(){
    // Adjust flagpole position to maintain 5px spacing from canyons
    for(var i = 0; i < t_canyon.length; i++) {
        if(flagpole.x_pos > t_canyon[i] - 5 && flagpole.x_pos < t_canyon[i] + canyon.width + 5) {
            flagpole.x_pos = t_canyon[i] + canyon.width + 5;
        }
    }
    
    push();
    stroke(0);
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
		isRight = false; 
		isLeft = false; 
		isJumping = false;
		isPlummeting = false; 
		gameChar_x = flagpole.x_pos; 
		gameChar_y = floorPos_y;
    }
    console.log(d);
}

function Enemy(x, y, range) {
	
		this.x = x;
		this.y = y;
		this.range = range;
		this.currentX = x;
		this.increment = 2; 
		this.update = function() {
			this.currentX += this.increment;
			// Check if the enemy has reached the range limits
			// Reverse direction if it has
			if(this.currentX >= this.x + this.range) {
				this.increment = -1.5; // Reverse direction
			}
			else if(this.currentX < this.x - this.range) {
				this.increment = 1.5; // Reverse direction
			}
		}
		this.draw = function() {
			this.update(); // Update position before drawing
			noStroke();
			//draw the samurai head
			//samurai bun
			fill(0,0,0);
			triangle(this.currentX - cameraPosX - 5, this.y - 65, this.currentX - cameraPosX + 5, this.y - 65, this.currentX - cameraPosX, this.y - 75); // Bun
			ellipse(this.currentX - cameraPosX, this.y - 65, 10, 10); // Bun
			//hair
			fill(0,0,0);
			ellipse(this.currentX - cameraPosX, this.y - 50, 30, 30); // Hair
			//bun scrunchie
			fill(255,250,240);
			ellipse(this.currentX - cameraPosX, this.y - 65, 6, 2); // Bun scrunchie
			//samurai face
			//face
			fill(255,228,196);
			ellipse(this.currentX - cameraPosX, this.y - 45, 25, 25); // Head
			//ears
			fill(255,228,196);
			ellipse(this.currentX - cameraPosX - 12, this.y - 46, 5, 7); // Left ear
			ellipse(this.currentX - cameraPosX + 12, this.y - 46, 5, 7); // Right ear
			//hait tendrils 
			fill(0,0,0);
			ellipse(this.currentX - cameraPosX - 10, this.y - 50, 3, 12); // Left tendril
			ellipse(this.currentX - cameraPosX + 10, this.y - 50, 3, 12); // Right
			//forhead hair
			fill(0,0,0);
			rect(this.currentX - cameraPosX - 10, this.y - 58, 20, 5); // Forehead hair
			//neck
			fill(255,228,196);
			rect(this.currentX - cameraPosX - 3, this.y - 39, 5, 8); // Neck
			//kamishimo clothing body
			fill(100,149,237);
			rect(this.currentX - cameraPosX - 13, this.y - 32, 25, 32); // Body
			//kashimono clothing sleeves
			fill(100,149,237);
			triangle(this.currentX - cameraPosX - 13, this.y - 29, this.currentX - cameraPosX - 19, this.y - 10, this.currentX - cameraPosX - 40, this.y); // Left sleeve
			triangle(this.currentX - cameraPosX + 12, this.y - 29, this.currentX - cameraPosX + 19, this.y - 10, this.currentX - cameraPosX + 40, this.y); // Right sleeve
			//kamishimo clothing sholders
			fill(100,149,237);
			triangle(this.currentX - cameraPosX - 13, this.y - 32, this.currentX - cameraPosX - 13, this.y - 22, this.currentX - cameraPosX - 20, this.y - 26); // Left shoulder
			triangle(this.currentX - cameraPosX + 12, this.y - 32, this.currentX - cameraPosX + 12, this.y - 22, this.currentX - cameraPosX + 20, this.y - 26); // Right shoulder
			//kamishimo shoes 
			fill(255);
			rect(this.currentX - cameraPosX - 7, this.y, 5, 3); // Left shoe
			rect(this.currentX - cameraPosX + 3, this.y, 5, 3); // Right shoe
			//wooden sandals
			fill(139,69,19);
			rect(this.currentX - cameraPosX - 7, this.y + 2, 5, 1); // Left sandal
			rect(this.currentX - cameraPosX + 3, this.y + 2, 5, 1); // Right sandal
			//kamishimo clothing belt white
			stroke(0);
			strokeWeight(0.5);
			fill(255);
			rect(this.currentX - cameraPosX - 13, this.y - 16, 25, 3);
			//kamishimo triangle robe lines centered below neck facing downwards
			stroke(0);
			strokeWeight(0.5);
			fill(255);
			//triangle in the middle of the body
			triangle(this.currentX - cameraPosX - 6, this.y - 32, this.currentX - cameraPosX + 6, this.y - 32, this.currentX - cameraPosX, this.y - 25); // Triangle
			//triangle neck appearance
			noStroke();
			fill(255, 228, 196);
			triangle(this.currentX - cameraPosX - 3, this.y - 32.5, this.currentX - cameraPosX + 2, this.y - 32.5, this.currentX - cameraPosX, this.y - 28); // Triangle neck appearance
			//kamishimo pant lines
			stroke(72,61,139);
			strokeWeight(0.5);
			line(this.currentX - cameraPosX - 11, this.y - 12, this.currentX - cameraPosX - 13, this.y );
			line(this.currentX - cameraPosX - 8, this.y - 12, this.currentX - cameraPosX - 10, this.y );
			line(this.currentX - cameraPosX - 5, this.y - 12, this.currentX - cameraPosX - 7, this.y );
			line(this.currentX - cameraPosX + 3 , this.y - 12, this.currentX - cameraPosX + 5, this.y );
			line(this.currentX - cameraPosX + 6, this.y - 12, this.currentX - cameraPosX + 8, this.y );
			line(this.currentX - cameraPosX + 9, this.y - 12, this.currentX - cameraPosX + 11, this.y );
			//kamishimo triangle leg part
			noStroke();
			fill(0, 0, 0, 140);
			triangle(this.currentX - cameraPosX - 1, this.y - 12, this.currentX - cameraPosX - 3, this.y, this.currentX - cameraPosX + 2, this.y); // Left leg triangle
			//draw eyes
			fill(0);
			ellipse(this.currentX - cameraPosX - 5, this.y - 48, 5, 6); // Left eye
			ellipse(this.currentX - cameraPosX + 5, this.y - 48, 5, 6); // Right eye
			//left eye pupil
			stroke(0);
			strokeWeight(0.5);
			fill(255);
			ellipse(this.currentX - cameraPosX - 5, this.y - 49, 2, 2); // Left eye pupil
			ellipse(this.currentX - cameraPosX - 4, this.y - 48, 2, 2); // Left eye pupil
			//right eye pupil
			fill(255);
			ellipse(this.currentX - cameraPosX + 5, this.y - 49, 2, 2); // Right eye pupil
			ellipse(this.currentX - cameraPosX + 6, this.y - 48, 2, 2); // Right
			//mouth
			fill(255,192,203);
			ellipse(this.currentX - cameraPosX, this.y - 40, 5, 3);		
		}
		this.checkCollision = function(gameChar_x, gameChar_y) {
			var d = dist(this.currentX, this.y, gameChar_x, gameChar_y);
			if(d < 50) { // Collision radius
				return true;
			} else {
				return false;
			}
		}
		this.reset = function() {
			this.currentX = this.x; // Reset to initial position
			this.increment = 3; // Reset increment
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

// Helper functions for character drawing
function drawCharacterHead(x, y, showEarLobes) {
	stroke(0);
	strokeWeight(1);
	
	// Ears
	fill(0);
	ellipse(x - 8, y - 55, 8, 9);
	ellipse(x + 8, y - 55, 8, 9);
	
	if(showEarLobes) {
		fill(255,192,203);
		ellipse(x - 8, y - 54, 5, 5);
		ellipse(x + 8, y - 54, 5, 5);
	}
	// Neck
	fill(0);
	rect(x - 2, y - 41, 4, 8);
	
	// Head
	fill(255);
	ellipse(x, y - 48, 17.5, 18);
	
	// Eyes
	fill(0);
	ellipse(x - 4, y - 49, 5, 6);
	ellipse(x + 4.5, y - 49, 5, 6);
	
	// Eye pupils
	stroke(0);
	strokeWeight(0.5);
	fill(255);
	ellipse(x - 4, y - 49, 2, 2);
	ellipse(x - 3, y - 48, 2, 2);
	ellipse(x + 5, y - 49, 2, 2);
	ellipse(x + 6, y - 48, 2, 2);
	
	// Mouth
	fill(255,192,203);
	ellipse(x, y - 44, 4, 2);
}

function drawCharacterBody(x, y) {
	fill(255);
	ellipse(x, y - 24.25, 24, 28);
	fill(0);
	ellipse(x, y - 30, 22, 16);
}

function drawCharacterLegs(x, y, state) {
	fill(0);
	if(state === 'jumping') {
		// Bent legs for jumping
		rect(x - 8, y - 14, 4, 8);
		rect(x - 8, y - 6, 8, 3);
		ellipse(x, y - 2, 4, 8);
		
		rect(x + 4, y - 14, 4, 8);
		rect(x + 4, y - 6, 8, 3);
		ellipse(x + 12, y - 2, 4, 8);
	} else if(state === 'walkingLeft') {
		rect(x - 8, y - 14, 4, 12);
		ellipse(x - 8, y - 2, 8, 4);
		rect(x + 4, y - 14, 4, 12);
		ellipse(x + 4, y - 2, 8, 4);
	} else if(state === 'walkingRight') {
		rect(x - 8, y - 14, 4, 12);
		ellipse(x - 4, y - 2, 8, 4);
		rect(x + 4, y - 14, 4, 12);
		ellipse(x + 8, y - 2, 8, 4);
	} else {
		// Standing
		rect(x - 8, y - 14, 4, 12);
		ellipse(x - 8, y - 2, 8, 4);
		rect(x + 4, y - 14, 4, 12);
		ellipse(x + 8, y - 2, 8, 4);
	}
}

function drawCharacterArms(x, y, state) {
	fill(0);
	if(state === 'jumpingLeft') {
		ellipse(x - 12, y - 27, 4, 8);
		ellipse(x - 15, y - 23, 9, 4);
		ellipse(x + 12, y - 25, 4, 14);
	} else if(state === 'jumpingRight') {
		ellipse(x - 12, y - 25, 4, 14);
		ellipse(x + 12, y - 27, 4, 8);
		ellipse(x + 15, y - 23, 9, 4);
	} else if(state === 'walkingLeft') {
		ellipse(x - 12, y - 27, 4, 8);
		ellipse(x - 15, y - 23, 9, 4);
		ellipse(x + 12, y - 25, 4, 14);
	} else if(state === 'walkingRight') {
		ellipse(x - 12, y - 25, 4, 14);
		ellipse(x + 12, y - 27, 4, 8);
		ellipse(x + 15, y - 23, 9, 4);
	} else if(state === 'jumping') {
		ellipse(x - 10, y - 37, 4, 14);
		ellipse(x + 10, y - 37, 4, 14);
	} else {
		// Standing
		ellipse(x - 14, y - 32, 10, 4);
		ellipse(x - 18, y - 36, 4, 10);
		ellipse(x + 14, y - 32, 10, 4);
		ellipse(x + 18, y - 36, 4, 10);
	}
}

function drawGameChar() {
	let state = 'standing';
	let showEarLobes = false;
	
	if(isLeft && isJumping) {
		state = 'jumpingLeft';
	} else if(isRight && isJumping) {
		state = 'jumpingRight';
	} else if(isLeft) {
		state = 'walkingLeft';
	} else if(isRight) {
		state = 'walkingRight';
	} else if(isJumping || isPlummeting) {
		state = 'jumping';
	} else {
		state = 'standing';
		showEarLobes = true;
	}
	drawCharacterHead(gameChar_x, gameChar_y, showEarLobes);
	drawCharacterBody(gameChar_x, gameChar_y);
	drawCharacterLegs(gameChar_x, gameChar_y, state === 'jumping' || state === 'jumpingLeft' || state === 'jumpingRight' ? 'jumping' : state);
	drawCharacterArms(gameChar_x, gameChar_y, state);
}