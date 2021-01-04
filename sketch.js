//game state
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//to create the sprite objects
var monkey, monkey_running, monkey_collided;

var banana, bananaImage, foodGroup;

var obstacle, obstacleImage, obstacleGroup;

var ground;

var jungle, jungleImage;

var score = 0;

var survivalTime = 0;

var obstaclesHit = 0;

var gameover, gameoverImage;

var restart, restartImage;

//to preload images and animations
function preload(){
  
  monkey_running = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");
  
  monkey_collided = loadAnimation("Monkey_collided.png");
  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("stone.png");
  
  jungleImage = loadImage("jungle.jpg");
  
  gameoverImage = loadImage("gameover.png");
  
  restartImage = loadImage("restart.png");
  
}

function setup() {

  //to create the canvas
    createCanvas(800,400);

  //to create the monkey
    monkey = createSprite(80, 315, 20, 20);  
    monkey.addAnimation("running", monkey_running);
    monkey.addAnimation("collided", monkey_collided);
    monkey.scale = 0.1;

  //to create the ground
    ground = createSprite(400, 350, 800, 10);
    ground.visible = false;
  
  //to create the jungle
    jungle = createSprite(0,0,800,400);
    jungle.addImage("background",jungleImage);
    jungle.scale = 1.5;
    jungle.x = jungle.width/2;
  
  //to create the food and obstacle group
    foodGroup = new Group();
    obstacleGroup = new Group();
  
  //to create score
    score = 0;
  
  //to create survivalTime 
    survivalTIme = 0; 
  
  //to create obstaclesHit 
    obstaclesHit = 0;
  
  //to create gameover
    gameover = createSprite(400, 190);
    gameover.addImage("gameover", gameoverImage);
  
  //to create restart
    restart = createSprite(400, 250);
    restart.addImage("restart", restartImage);
  
  //to scale restart and gameover
    gameover.scale = 1.0;
    restart.scale = 1.0;
  
  //to change the invisibility to false 
    gameover.visible = false;
    restart.visible = false;
  
}

function draw(){ 
 
  //to give the background color
   background(255);
  
  //to increase the depth of the monkey
  monkey.depth = jungle.depth + 1;
  
  //game state PLAY
  if(gameState===PLAY){  
    
    //to make the monkey jump 
       if(keyDown("space") && monkey.y >= 159){
         monkey.velocityY = -12;
       }

    //to add gravity
       monkey.velocityY = monkey.velocityY + 0.8;

    //to give velocity to the ground and jungle
       jungle.velocityX = -(10 + Math.round(score / 4));
    
    //to spawn food and obstacle group 
       spawnFood();
       spawnObstacles();

    //to create infinite jungle  
       if(jungle.x < 400){
         jungle.x = jungle.width/2;
       }  
    
    //to increase the survivalTime 
       survivalTime += Math.round(frameCount / 100);
 
    //to increase the score
      if(foodGroup.isTouching(monkey)){
       foodGroup.destroyEach();
       score = score + 1;
      }
       switch(score){
         case 10: monkey.scale = 0.12;
                 break;
         case 20: monkey.scale = 0.14;
                 break;
         case 30: monkey.scale = 0.16;
                 break;
         case 40: monkey.scale = 0.18;
                 break;
         default: break;    
       }

    //to decrease the score
      if(obstacleGroup.isTouching(monkey)){
        obstacleGroup.destroyEach();
        obstaclesHit = obstaclesHit + 1;
        if (obstaclesHit === 1) {
         monkey.scale = 0.08;
        }
        if (obstaclesHit === 2) {
         gameState = END;
        } 
      }
   }
  
  else if(gameState===END){
    gameover.visible = true;
    restart.visible = true;
    
    monkey.velocityY = 0;
    
    jungle.velocityX = 0; 
    
    obstacleGroup.destroyEach();
    foodGroup.destroyEach();
    
    monkey.changeAnimation("collided", monkey_collided);
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  //to make the monkey collide with the ground
   monkey.collide(ground); 

  //to draw the objects
   drawSprites();

  //to display score
   stroke("white");
   textSize(20);
   textFont("Georgia");
   fill("white");
   text("Score : "+ score, 40, 30);
   text("Survival Time : "+ survivalTime, 300, 30 );
   text("Obtacles Hit : "+ obstaclesHit, 600, 30);
  
}

//function spawn food
function spawnFood(){  
  
  if(World.frameCount%80===0){
    banana = createSprite(800, Math.round(random(120,200)),10,30);
    banana.addImage("banana",bananaImage);
    banana.scale = 0.07;
    banana.velocityX = -(10 + 3 * score / 100);
    banana.lifetime = 100;
    foodGroup.add(banana);   
    banana.setCollider("rectangle", 0, 0, 100, 100);
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
  }
  
}

//function spawn obstacles 
function spawnObstacles(){
  
  if(World.frameCount%300===0){
    obstacle = createSprite(800,320,10,40);
    obstacle.addImage("obstacle",obstacleImage);
    obstacle.scale = 0.2;
    obstacle.velocityX = -(10 + 3 * score / 10);       
    obstacle.lifetime = 100;
    obstacleGroup.add(obstacle);
    obstacle.setCollider("rectangle", 0, 0, 300, 300);
  }
  
}

//function reset
function reset(){
  
  gameState = PLAY; 
  
  gameover.visible = false;
  restart.visible = false;
  
  foodGroup.destroyEach();
  obstacleGroup.destroyEach();
  
  monkey.changeAnimation("running", monkey_running);
  
  score = 0;
  obstaclesHit = 0;
  survivalTime = 0;
  
  monkey.scale = 0.1;
  
}