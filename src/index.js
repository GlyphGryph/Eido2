import * as PIXI from 'pixi.js'
import {Gob, GobManager, Player, Obstacle} from './gob'
import {Level} from './level'

const renderer = new PIXI.WebGLRenderer(601, 401)
const fps = 11
let DEBUG = true // toggle by pressing Q
let debugInfo = ""
let left,right,up,q,power = {}
let gobManager
let level
let attackTimer
let attackTimeout = 4
let nextObstacle = 'rough'

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
  const player = gobManager.get('player')

  //keyboard handlers
  left = keyboard(65)
  right = keyboard(68)
  up = keyboard(87)
  q = keyboard(81)
  power = keyboard(79)

  left.press = function(){ player.state.goLeft = true }
  left.release = function(){ player.state.goLeft = false }
  right.press = function(){ player.state.goRight = true }
  right.release = function(){ player.state.goRight = false }
  up.press = function(){ player.state.goUp = true }
  up.release = function(){ player.state.goUp = false }
  power.press = function(){ player.state.goPower = true }
  power.release = function(){ player.state.goPower = false }

  q.press = function(){
    DEBUG = !DEBUG
  }

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
  
  const player = gobManager.get('player')

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
    if(nextObstacle === 'rough'){
      gobManager.createRoughacle()
      nextObstacle = 'default'
    } else {
      gobManager.createObstacle()
      nextObstacle = 'rough'
    }
    level.lastSpawn = level.distanceTraveled
  }
  
  let mode = ''
  if(player.state.jumping){
    mode += 'jumping '
  }
  if(player.state.powerMode){
    mode += 'powerMode '
  }
  if(player.state.grounded){
    mode += 'running '
  }else{
    if(player.state.fallSpeed >= 0){
      mode += 'falling '
    }else{
      mode += 'floating '
    }
  }

  // Obstacle state management
  for(const obstacleId of level.obstacleIds){
    let obstacle = gobManager.get(obstacleId)
    obstacle.handleCollisions(player)
  }
  if(player.canHitObstacle){
    player.showReadyMarker()
  } else {
    player.hideReadyMarker()
  }
 
  gobManager.update()
  // Update shadow to match player
  const shadow = gobManager.get('playerShadow')
  const playerDistanceFromGround = level.groundLevel - player.y
  let shadowOffset = {
    x: shadow.baseOffset.x - playerDistanceFromGround/4,
    y: shadow.baseOffset.y,
  }
  shadow.moveTo(player.x + shadowOffset.x, level.groundLevel + shadowOffset.y)

  level.update(step, player)

  // Debug
  if(DEBUG){
    let debugText = "Debug info (press Q to toggle):\n"
    debugText += `FPS: ${fps}\n`
    debugText += `Position: ${player.x}/${player.y} \n`
    debugText += `Actions: ${mode}\n`
    debugText += `Is grounded? ${player.state.grounded} | jumpTimer: ${player.state.jumpTimer} | Fall speed: ${Math.round(player.state.fallSpeed)}\n`
    debugText += `Power pressed?: ${player.state.goPower}\n`
    debugText += `Game time: ${Math.round(level.time/fps)}s \n`
    debugText += `Level speed: ${Math.round(level.velocity)}\n`
    debugText += `Obstacle next spawn: ${Math.round((level.spawnRate+level.lastSpawn)-level.distanceTraveled)}\n`
    debugText += `Distance traveled: ${Math.round(level.distanceTraveled)}\n`
    debugText += `Distance from spirit: ${Math.round(level.spiritDistance)}\n`
    debugInfo.text = debugText
  } else {
    debugInfo.text = ""
  }

  renderer.render(stage)
}

initialize()
