// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var labelscore;
var player;
var pipebody;
var pipetop;
var pipes = [];
var rotation = 1;
var jumpCount = 0
var labelJump
var height = 400
var width= 790
var gameSpeed = 250;
var gameGravity = 250;
var jumpPower = 150;
var gapSize = 100;
var gapMargin = 50;
var blockHeight = 50;
var balloons = []
var weight = []


/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
game.load.image("player","../assets/flappy-cropped.png");
game.load.image("pipeblock","../assets/pipe2-body.png")
game.load.image("pipetop","../assets/pipe2-end.png")
game.load.audio("score", "../assets/point.ogg");
game.load.image("bg", "../assets/bg1.jpg");
game.load.image("balloons", "../assets/balloons.png");
game.load.image("weight", "../assets/weight.png");
game.load.image("cloud", "../assets/Cloud.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
    game.add.sprite(0,0, "bg");
    game.stage.setBackgroundColor("#ABCDEF");

    player=game.add.sprite(50,50, "player");


    game.input.onDown.add(clickHandler);
    game.input
     .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
     .onDown.add(function(){
       player.body.velocity.y = -jumpPower
       jumpCount += 1;
       labelJump.setText(jumpCount.toString());

     });
     labelScore = game.add.text(20, 20, "0");
     labelJump = game.add.text(20, 50, "0");



    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);

    player.body.gravity.y=  gameGravity;
    var pipeInterval = 1  * Phaser.Timer.SECOND;
game.time.events.loop(pipeInterval, generate);


player.anchor.setTo(0.5,0.5)

player.angle = 2


}


/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

  game.physics.arcade.overlap(
 player,
 pipes,
 gameOver);

//  for(var i = balloons.length ‐ 1; i >= 0; i‐‐){
//  game.physics.arcade.overlap(player, balloons[i], function(){
//  changeGravity(‐50);
//  balloons[i].destroy();
//  balloons.splice(i, 1);
//  });
// }





//player.angle = player.angle * player.angle * player.angle;

player.rotation = Math.atan(player.body.velocity.y / 200);



 if (player.body.y < -50){
   gameOver();
 }

 if (player.body.y > 400){
   gameOver();
 }

}


function gameOver(){
 game.state.restart();
 score = 0
 jumpCount = 0
 gameGravity = 200

}

function clickHandler(event){

  player.y -= 500


}

function spaceHandler() {
  player.y = player.y - 10;
  changeScore();


  game.sound.play("score");
}


function changeScore(){

  score = score + 1;
  labelScore.setText(score.toString());
  game.sound.play("score");
}


function generatePipe(){
  var gapStart = game.rnd.integerInRange(1,4);
    for(var count= 0; count < 8; count += 1){
      if(count!= gapStart && count != gapStart +1  && count != gapStart +2 ) {
        addPipeBlock(800, count * 50 );

      }

    }





changeScore()

}

function addPipeBlock(x,y){

var block = game.add.sprite(x, y, "pipeblock");
pipes.push(block)
game.physics.arcade.enable(block);
block.body.velocity.x=- gameSpeed

}

function playerJump(){
  player.body.velocity.y =-jumpPower;
  //rotation += 1


  jumpCount += 1;
  labelJump.setText(jumpCount.toString());

}


function generateBalloons(){
  var bonus = game.add.sprite(game.rnd.integerInRange(1,width-50),game.rnd.integerInRange(1,height-50),"balloons");
  balloons.push(bonus);
  game.physics.arcade.enable(bonus);
  bonus.body.velocity.x  = - 200;
  bonus.body.velocity.y = game.rnd.integerInRange(6,10);
  changeScore()
}



function generate() {
 var diceRoll = game.rnd.integerInRange(1, 10);
 if(diceRoll==0) {
 generateBalloons();
 }else {
 generatePipe();
 }
}
