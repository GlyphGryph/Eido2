import * as PIXI from 'pixi.js'
import {Gob, GobManager, Player, Obstacle} from './gob'
import {Level} from './level'

const renderer = new PIXI.WebGLRenderer(601, 401)
const fps = 11
const velocity = 10
let DEBUG = true // toggle by pressing Q
let debugInfo = ""
let playerVelocityX = 0
let playerVelocityY = 0.0
let left,right,up,q,o,k = {}
let gobManager
let level
let attackLaunched = false
let attackType
let attackTimer
let attackTimeout = 4
let jumping = false
let isGrounded = true

const fallSpeed = 15
const weight = 3
const initialJumpSpeed = -10.0
const maxJumpDuration = 3
let jumpDuration = 0
const stage = new PIXI.Container()
const backgroundLayer = new PIXI.Container()
const mainLayer = new PIXI.Container()

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

function initialize(){

  //renderer.backgroundColor = 0xFFFFFF
  renderer.backgroundColor = 0xFF8888

  //Add the elements to the html
  document.getElementById('BackgroundBox').appendChild(renderer.view)

  PIXI.loader
    .add('spritesheet', "assets/eidolonSpritesheet.json")
    .add('obstacle', "assets/src/obstacle.png")
    .on("progress", loadProgressHandler)
    .load(setup)
}

function loadProgressHandler(loader, resource) {

  //Display the file `url` currently being loaded
  console.log("loading: " + resource.name);

  //Display the percentage of files currently loaded
  console.log("progress: " + loader.progress + "%");
}

function setup(){

  //keyboard handlers
  left = keyboard(65)
  right = keyboard(68)
  up = keyboard(87)
  q = keyboard(81)
  o = keyboard(79)
  k = keyboard(75)

  left.press = function(){
    playerVelocityX = -1*velocity
  }

  left.release = function(){
    if(!right.isDown){
      playerVelocityX = 0
    }
  }

  right.press = function(){
    playerVelocityX = velocity
  }

  right.release = function(){
    if(!left.isDown){
      playerVelocityX = 0
    }
  }

  up.press = function(){
    if(isGrounded){
      jumping = true
      playerVelocityY = initialJumpSpeed
      jumpDuration = 0
      isGrounded = false
    }
  }

  up.release = function(){
    jumping = false
  }

  o.press = function(){
    attackLaunched = true
    attackTimer = attackTimeout
    attackType = "o"
  }

  k.press = function(){
    attackLaunched = true
    attackTimer = attackTimeout
    attackType = "k"
  }

  q.press = function(){
    DEBUG = !DEBUG
  }

  stage.addChild(backgroundLayer)
  stage.addChild(mainLayer)
  const atlas = PIXI.loader.resources["spritesheet"]
  level = new Level()

  gobManager = new GobManager({
    mainLayer,
    backgroundLayer,
    loader: PIXI.loader,
    level
  })


  // Create player
  gobManager.createPlayer()

  // Create figment
  gobManager.createFigment()

  // Create mask
   var canvas = document.createElement('canvas');
  canvas.width  = 300;
  canvas.height = 400;
  var ctx = canvas.getContext('2d');
  var gradient1 = ctx.createLinearGradient(0, 0, 75, 0);
  gradient1.addColorStop(0, "#000000");
  gradient1.addColorStop(1, "#FFFFFF");
  ctx.fillStyle = gradient1;
  ctx.fillRect(0, 0, 150, 400);

  var gradient2 = ctx.createLinearGradient(225, 0, 300, 0);
  gradient2.addColorStop(0, "#FFFFFF");
  gradient2.addColorStop(1, "#000000");
  ctx.fillStyle = gradient2;
  ctx.fillRect(150, 0, 150, 400);
  let visibleMaskTexture = PIXI.Texture.fromCanvas(canvas)
  let maskTexture = PIXI.Texture.fromCanvas(canvas)

  gobManager.add(
    new Gob({
      id: 'objectMask',
      stage: backgroundLayer,
      x: 40,
      y: 0,
      texture: maskTexture,
      frames: [ new PIXI.Rectangle(0, 0, 300, 400) ],
      currentFrame: 0
    })
  )

  const mask = gobManager.get('objectMask').sprite
  backgroundLayer.mask = mask

  debugInfo = new PIXI.Text('Setup', {
    fontSize: 15,
    fill: 0xffffff,
    stroke: 0x000000,
    strokeThickness: 3
  })
  debugInfo.x = 5;
  debugInfo.y = 5;
  stage.addChild(debugInfo)

  renderer.render(stage)
  startGame()
}

function startGame(){
  let gameInterval = setInterval(runGame, 1000/fps)
}

function runGame(){
  const step = 1/fps
  level.update(step)

  const player = gobManager.get('player')

  // Player Movement
  player.moveTo(player.x + playerVelocityX, player.y)
  // If the player is jumping...
  if(jumping){
    playerVelocityY = initialJumpSpeed
    player.moveTo(player.x, player.y + playerVelocityY)
    if(jumpDuration >= maxJumpDuration){
      jumping = false
    }
    jumpDuration += 1
  }

  // If the player is not in contact with the ground, then fall...
  if(player.y < level.groundLevel){
    if(playerVelocityY > fallSpeed){
      playerVelocityY = fallSpeed
    }
    console.log('moving vertically')
    player.moveTo(player.x, player.y + playerVelocityY)
    playerVelocityY += weight
  }
  if(player.y > level.groundLevel){
    player.moveTo(player.x, level.groundLevel)
  }
  // If player still isn't in contac
  isGrounded = player.y >= level.groundLevel
  // Update shadow to match player
  const shadow = gobManager.get('playerShadow')
  const playerDistanceFromGround = level.groundLevel - player.y
  let shadowOffset = {
    x: shadow.baseOffset.x - playerDistanceFromGround/4,
    y: shadow.baseOffset.y,
  }
  shadow.moveTo(player.x + shadowOffset.x, level.groundLevel + shadowOffset.y)

  // Figment Update
  const figment = gobManager.get('figment')
  figment.moveTo(level.rightWall + level.spiritDistance, figment.y)

  // Move Obstacles
  for(const obstacleId of level.obstacleIds){
    let gob = gobManager.get(obstacleId)
    gob.moveTo(Math.round(gob.x - level.velocity), gob.y)
    if(gob.x < 0){
      gobManager.remove(gob.id)
      level.obstacleIds = level.obstacleIds.filter( (trackerId) =>{
        return trackerId !== obstacleId
      })
    }
  }

  // Spawn obstacle
  if(level.distanceTraveled > (level.lastSpawn + level.spawnRate)){
    // randomize type
    gobManager.createObstacle()
    level.lastSpawn = level.distanceTraveled
  }

  // Debug
  if(DEBUG){
    let debugText = "Debug info (press Q to toggle):\n"
    debugText += `FPS: ${fps}\n`
    debugText += `Position: ${player.x}/${player.y} \n`
    debugText += `Is jumping?: ${jumping} | Is grounded? ${isGrounded} | jumpDuration: ${jumpDuration}\n`
    debugText += `Vertical velocity: ${Math.round(playerVelocityY)}\n`
    debugText += `Game time: ${Math.round(level.time/fps)}s \n`
    debugText += `Level speed: ${Math.round(level.velocity)}\n`
    debugText += `Obstacle next spawn: ${Math.round((level.spawnRate+level.lastSpawn)-level.distanceTraveled)}\n`
    debugText += `Distance traveled: ${Math.round(level.distanceTraveled)}\n`
    debugText += `Distance from spirit: ${Math.round(level.spiritDistance)}\n`
    debugInfo.text = debugText
  } else {
    debugInfo.text = ""
  }

  // time out the attack
  if(attackTimer > 0){
    attackTimer--
  } else {
    attackLaunched = false
  }
  
  let playerCanHitObstacle = false
  // Obstacle state management
  for(const obstacleId of level.obstacleIds){
    let obstacle = gobManager.get(obstacleId)

    if(obstacle.active){
      if(obstacle.checkCollisionWith(player)){
        level.velocity = level.velocity / 2
        obstacle.deactivate()
      }else if(
        attackLaunched &&
        attackType == obstacle.attackType &&
        obstacle.checkHitZoneCollision(player)
      ){
        obstacle.deactivate()
      }else if(obstacle.checkHitZoneCollision(player)){
        playerCanHitObstacle = true
      }
    }
    
    // Clean up destroyed obstacles
    if(!obstacle.active){
      // TODO: Don't remove, just change the sprite when deactivate
      gobManager.remove(obstacle.id)
      level.obstacleIds = level.obstacleIds.filter( (trackerId) =>{
        return trackerId !== obstacleId
      })
      console.log('obstacle destroyed!')
    }
  }

  if(playerCanHitObstacle){
    player.showReadyMarker()
  } else {
    player.hideReadyMarker()
  }
  
  // Reset attack launched, even if we didn't destroy anything
  attackLaunched = false

  gobManager.update()
  renderer.render(stage)
}

initialize()
