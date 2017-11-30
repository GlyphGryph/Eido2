import * as PIXI from 'pixi.js'
import {Gob, GobManager} from './gob'

const renderer = PIXI.autoDetectRenderer(601, 401)
const fps = 11
const velocity = 10
const obstacleVelocity = 6 // obstacle initial velocity
const obstacleMaxVelocity = 50
const obstacleSpawnRate = 30
const obstacleMinSpawnRate = 10
const obstacleAccRate = 0.2 // obstacle velocity increase per second
const spiritInitDistance = 100
let DEBUG = true // toggle by pressing Q
let debugInfo = ""
let levelTimer = 0
let playerVX = 0
let obstacleVX = obstacleVelocity
let spiritDistance = spiritInitDistance
let a,d,q = {}
let playerStartingX = 100
let playerStartingY = 180
let playerShadowOffset = 30
let gobManager
const stage = new PIXI.Container()
const backgroundLayer = new PIXI.Container()
const mainLayer = new PIXI.Container()

let rightWall = 300
let leftWall = 20

let obstacleTracker = {
  sinceLastSpawn: obstacleSpawnRate-1,
  nextSpawnTime: obstacleSpawnRate,
  ids: [],
  total: 0
}


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
  a = keyboard(65)
  d = keyboard(68)
  q = keyboard(81)

  a.press = function(){
    playerVX = -1*velocity
  }

  a.release = function(){
    if(!d.isDown){
      playerVX = 0
    }
  }

  d.press = function(){
    playerVX = velocity
  }

  d.release = function(){
    if(!a.isDown){
      playerVX = 0
    }
  }

  q.press = function(){
    DEBUG = !DEBUG
  }

  stage.addChild(backgroundLayer)
  stage.addChild(mainLayer)
  gobManager = new GobManager()

  const textures = PIXI.loader.resources["spritesheet"].textures;

  // Create player

  const ovalRunFrames = [
  ]

  gobManager.add(
    new Gob({
      id: 'player',
      stage: mainLayer,
      x: playerStartingX,
      y: playerStartingY,
      atlas: PIXI.loader.resources["spritesheet"],
      frames: [
        "oval/run/00",
        "oval/run/01",
        "oval/run/02",
        "oval/run/03"
      ],
      currentFrame: 0,
      xMax: rightWall,
      xMin: leftWall
    })
  )

  gobManager.add(
    new Gob({
      id: 'playerShadow',
      stage: mainLayer,
      x: playerStartingX,
      y: playerStartingY + playerShadowOffset,
      atlas: PIXI.loader.resources["spritesheet"],
      frames: [
        "oval/run/shadow/00",
        "oval/run/shadow/01",
        "oval/run/shadow/02",
        "oval/run/shadow/03"
      ],
      currentFrame: 0
    })
  )

  // Create figment
  let figmentFrames = []
  for(let ii = 0; ii < 8; ii++){
    const frame = new PIXI.Rectangle(ii * 40, 0, 40, 40)
    figmentFrames.push(frame)
  }
  const figmentTexture = textures["figment"]

  gobManager.add(
    new Gob({
      id: 'figment',
      stage: mainLayer,
      x: 500,
      y: playerStartingY,
      atlas: PIXI.loader.resources["spritesheet"],
      frames: [
        "figment/run/00",
        "figment/run/01",
        "figment/run/02",
        "figment/run/03",
        "figment/run/04",
        "figment/run/05",
        "figment/run/06",
        "figment/run/07"

      ],
      currentFrame: 0
    })
  )

  // Create mask
  const rectangle = new PIXI.Graphics();
  rectangle.beginFill(0x66CCFF);
  rectangle.drawRect(0, 0, 300, 400);
  rectangle.endFill();
  rectangle.x = 0;
  rectangle.y = 0;

  gobManager.add(
    new Gob({
      id: 'objectMask',
      stage: backgroundLayer,
      x: 40,
      y: 0,
      texture: renderer.generateTexture(rectangle),
      frames: [ new PIXI.Rectangle(0, 0, 300, 400) ],
      currentFrame: 0
    })
  )

  debugInfo = new PIXI.Text('Setup', {
    fontSize: 15,
    fill: 0xffffff,
    stroke: 0x000000,
    strokeThickness: 3});
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

  levelTimer += 1/fps

  gobManager.update()

  const player = gobManager.get('player')
  player.moveTo(player.x + playerVX, player.y)
  const shadow = gobManager.get('playerShadow')
  shadow.moveTo(player.x, player.y+30)
  const figment = gobManager.get('figment')
  figment.moveTo(figment.x, figment.y)

  if(obstacleTracker.sinceLastSpawn > obstacleTracker.nextSpawnTime){
    const id = `obstacle${obstacleTracker.total}`
    console.log(`building obstacle #{id}`)
    obstacleTracker.ids = [
      ...obstacleTracker.ids,
      id
    ]
    const texture = PIXI.loader.resources['obstacle'].texture
    gobManager.add(
      new Gob({
        id,
        stage: backgroundLayer,
        x: 340,
        y: playerStartingY,
        texture,
        frames: [ new PIXI.Rectangle(0, 0, 40, 40) ],
        currentFrame: 0
      })
    )
    obstacleTracker.total += 1
    obstacleTracker.sinceLastSpawn = 0
  }
  obstacleTracker.sinceLastSpawn = obstacleTracker.sinceLastSpawn + 1

  //update dynamic parameters
  if(obstacleVX < obstacleMaxVelocity){
    obstacleVX = obstacleVelocity + Math.round(levelTimer * obstacleAccRate)
  }

  if(obstacleTracker.nextSpawnTime > obstacleMinSpawnRate){
    obstacleTracker.nextSpawnTime = obstacleSpawnRate - Math.round(levelTimer * obstacleAccRate)
  }

  if(spiritDistance>0){
    spiritDistance = spiritInitDistance - Math.round(levelTimer * obstacleAccRate)
  }

  for(const obstacleId of obstacleTracker.ids){
    let gob = gobManager.get(obstacleId)
    gob.moveTo(gob.x - obstacleVX, gob.y)
    if(gob.x < 0){
      gobManager.remove(gob.id)
      obstacleTracker.ids = obstacleTracker.ids.filter( (trackerId) =>{
        return trackerId !== obstacleId
      })
    }
  }

  if(DEBUG){
    let debugText = "Debug info (press Q to toggle):\n"
    debugText += `FPS: ${fps}\n`
    let lvlTimerDebug = Math.round(levelTimer)
    debugText += `Game time: ${lvlTimerDebug}s \n`
    debugText += `Obstacle speed: ${obstacleVX}\n`
    debugText += `Obstacle spawn rate: ${obstacleTracker.nextSpawnTime}\n`
    debugText += `Distance: ${spiritDistance}\n`
    debugInfo.text = debugText
  } else {
    debugInfo.text = ""
  }


  renderer.render(stage)
}

initialize()
