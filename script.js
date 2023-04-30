// Space Invaderz programmed in p5.js
/* aliens is a 2-dimensional array that holds sets of data for each alien active:
- locationX
- locationY
- colour
- speed
- health

locationX: x-coordinate of the alien
locationY: y-coordinate of the alien
colour: colour of the window found on the alien's head
speed: movement speed of the alien
health: health points of the alien

e.g.
aliens = [
	[200, 300, ‘blue’, 8, 4],
	[300, 400, ‘red’, 20, 10]
]
*/
let aliens = []

// bullets is a 2-dimensional array that holds the x- and y-coordinates of every bullet
let bullets = []

// colours
let colours = [
  'green',
  'lime',
  'cyan',
  'blue',
  'indigo',
  'purple',
  'pink',
  'yellow',
  'orange',
  'red'
]

// point system
let alienPoints = {
  'green' : 1000,
  'lime' : 2000,
  'cyan' : 3000,
  'blue' : 4000,
  'indigo' : 5000,
  'purple' : 6000,
  'pink' : 7000,
  'yellow' : 8000,
  'orange' : 9000,
  'red' : 10000
}

// player starting position
let playerX = 600

// player score and game timer
let score = 0
let timer = 30

// game state
let gameState = 1

function setup(){
  createCanvas(1200, 500)
}

function draw(){
  background(0)
  strokeWeight(1)

  // title screen
  if(gameState == 1){
    // resetting all game statistics
    aliens = []
    bullets = []
    score = 0
    playerX = 600
    timer = 30
    
    fill(255)
    textSize(30)
    stroke(255)
    push()    
    fill(0)
    strokeWeight(5)
    rect(300, 100, 600, 300)
    pop()

    // player instructions
    textAlign(CENTER)
    textSize(30)
    text("Instructions!", 600, 135)
    textSize(20)
    text("OBJECTIVE: Get rid of all aliens and be victorious!",600, 170)
    textSize(15)
    text("1. Use the left and right arrow keys to move left and right respectively.", 600, 210)
    text("2. Click the spacebar to shoot bullets.", 600, 250)
    text("3. Beat the buzzer to win!", 600, 290)
    textSize(20)
    text("Press ENTER to start!", 600, 330)
    textSize(30)
    text("HAVE FUN!", 600, 380)
  }

  // gameplay screen
  else if(gameState == 2){
    // move the player to the right
    if(keyIsDown(39) && playerX < 1135){
      playerX += 10
    }

    // move the player to the left
    if(keyIsDown(37) && playerX > 65){
      playerX -= 10
    }

    // controls for the aliens and bullets
    alienControl()
    bulletControl()
    
    // draws the player
    push()
    fill(75, 0, 130)
    stroke(75, 0, 130)
    ellipse(playerX, 450, 130, 25)
    ellipse(playerX, 440, 45, 45)
    pop()

    // draws UI
    fill(255)
    textAlign(LEFT)
    textSize(25)
    text("SCORE: " + score, 25, 50)
    text("TIMER: " + timer, 25, 75)

    //controls the timer
    if(frameCount % 60 == 0){
      timer -= 1
    }

    // if the timer runs out, transition to game over screen
    if(timer <= 0){
      gameState = 0
    }
  }

  // game over screen
  else{
    fill(255)
    textSize(30)
    stroke(255)
    push()    
    fill(0)
    strokeWeight(5)
    rect(300, 100, 600, 300)
    pop()

    strokeWeight(1)
    textAlign(CENTER)   
    textSize(50)
    text("SCORE: " + score, 600, 220)
    text("Press 'R' to RESTART", 600, 280)
  }
}

// alienControl function controls the generation and drawing of aliens
function alienControl(){
    // generates aliens and pushes each into the aliens array
    if(aliens.length == 0){
      for(let alien = 0; alien < int(random(10, 15)); alien++){
        aliens.push([int(random(120, 1100)), int(random(50, 200)), colours[int(random(10))]])
        aliens[alien].push(alienPoints[aliens[alien][2]] / 1000 * 2)
        aliens[alien].push(alienPoints[aliens[alien][2]] / 1000)
      }
    }

    // draws all aliens contained in the aliens array and controls side-to-side movement
    for(let alien = 0; alien < aliens.length; alien++){
      aliensDraw(aliens[alien][0], aliens[alien][1], aliens[alien][2], aliens[alien][4])
      aliens[alien][0] += aliens[alien][3]

      if((aliens[alien][0] <= 0 && aliens[alien][3] < 0) || (aliens[alien][0] >= 1200 && aliens[alien][3] > 0)){
        aliens[alien][3] *= -1
      }
    }
}

// bulletControl funtion controls the collisions between the bullets and the aliens and the appropriate responses
function bulletControl(){
  for(let bullet = 0; bullet < bullets.length; bullet++){
      for(let alien = 0; alien < aliens.length; alien++){
        
        // checks if the bullet collides with the hitbox of an alien
        if(abs(bullets[bullet][0] - aliens[alien][0]) <= 75 && abs(bullets[bullet][1] - aliens[alien][1]) <= 10){

          // if so, delete the bullet, and subtract health points from the alien
          bullets.splice(bullet, 1)
          aliens[alien][4] -= 1

          // if the alien has 0 health points, let it be deleted and increase the player's points, 
          if(aliens[alien][4] == 0){
            score += alienPoints[aliens[alien][2]]
            aliens.splice(alien, 1)
          }
          
          return
        }
      }

      // move and draw the bullet in an upward motion
      if(bullets[bullet][1] > 0){
        bullets[bullet][1] -= 20
        fill('gold')
        stroke('gold')
        rect(bullets[bullet][0], bullets[bullet][1], 5, 50)
        stroke(0)
        fill(0)
      }

      // delete the bullet if it reaches the border of the canvas
      else{
        bullets.splice(bullet, 1)
      }
  }
}

/*
the aliensDraw function draws aliens onto the canvas
uses the following parameters:
- locationX
- locationY
- colour
- health

locationX: x-coordinate of the alien
locationY: y-coordinate of the alien
colour: colour of the "dome" of the alien
health: the amount of health points the alien contains

selection: if the alien is red, randomize the alien's body colour and set the dome to a unique shape
iteration: display the health points of the alien
*/
function aliensDraw(locationX, locationY, colour, health){
  // main body of the alien
  let bodyColour = color(192, 192, 192)
  fill(bodyColour)
  stroke(bodyColour)

  // if the alien is red, randomize the alien's body colour and change the dome shape to a rectangle
  if(colour == 'red'){
    bodyColour = colours[int(random(10))]
    fill(bodyColour)
    stroke(bodyColour)
    rect(locationX - 18, locationY - 35, 35, 25)
  }

  // else, keep the alien's body colour as static and set the dome shape to a circle 
  else{
    ellipse(locationX, locationY - 10, 45, 45)
  }
  
  ellipse(locationX, locationY, 130, 25)

  // dome window of the alien
  fill(colour)
  stroke(0)
  strokeWeight(5)
  ellipse(locationX, locationY - 15, 20,20)
  
  // accent design on the dome window of the alien
  strokeWeight(3)
  line(locationX - 20, locationY - 15, locationX + 40, locationY - 15)

  // draw a red ellipse for every health point the alien has
  for(let ellipseX = locationX; ellipseX < locationX + 10 * health; ellipseX += 10){
    fill(255,0,0)
    ellipse(ellipseX - 43, locationY + 2, 10, 10)
  } 
}

// key inputs
function keyPressed(){
  // ENTER key to start game
  if(keyCode == 13 && gameState == 1){
    gameState = 2
  }
  // R key to restart game
  if(keyCode == 82 && gameState == 0){
    gameState = 1
  }
  // SPACEBAR key to create a bullet and push to the bullets array
  if(keyCode == 32){
    bullets.push([playerX - 40, 425])
    bullets.push([playerX + 35, 425])
  }
}

