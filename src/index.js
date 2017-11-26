import * as PIXI from 'pixi.js'
import {Gob, GobManager} from './gob'

const renderer = PIXI.autoDetectRenderer(601, 401)
const velocity = 10
let playerVX = 0
let a,d = {}
let playerStartingX = 100
let playerStartingY = 180
let playerShadowOffset = 30
let gobManager

let rightWall = 300
let leftWall = 20

let obstacleTracker = {
  sinceLastSpawn: 29,
  nextSpawnTime: 30,
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

  renderer.backgroundColor = 0xFFFFFF

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


  gobManager = new GobManager()

  const textures = PIXI.loader.resources["spritesheet"].textures;

  let ovalRunFrames = []
  for(let ii = 0; ii < 4; ii++){
    const frame = new PIXI.Rectangle(ii * 40, 0, 40, 40)
    ovalRunFrames.push(frame)
  }
  const ovalTexture = textures["ovalrun.png"]

  gobManager.add(
    new Gob({
      id: 'player',
      x: playerStartingX,
      y: playerStartingY,
      texture: ovalTexture,
      frames: ovalRunFrames,
      currentFrame: 0,
      xMax: rightWall,
      xMin: leftWall
    })
  )

  let ovalShadowFrames = []
  for(let ii = 0; ii < 4; ii++){
    const frame = new PIXI.Rectangle(ii * 40, 0, 40, 10)
    ovalShadowFrames.push(frame)
  }
  const ovalShadowTexture = textures["ovalshadow.png"]

  gobManager.add(
    new Gob({
      id: 'playerShadow',
      x: playerStartingX,
      y: playerStartingY + playerShadowOffset,
      texture: ovalShadowTexture,
      frames: ovalShadowFrames,
      currentFrame: 0
    })
  )

  renderer.render(gobManager.stage)
  startGame()
}

function startGame(){
  let gameInterval = setInterval(runGame, 90)
}

function runGame(){
  gobManager.update()
  const player = gobManager.get('player')
  player.moveTo(player.x + playerVX, player.y)
  const shadow = gobManager.get('playerShadow')
  shadow.moveTo(player.x, player.y+30)

  if(obstacleTracker.sinceLastSpawn > obstacleTracker.nextSpawnTime){
    const id = `obstacle${obstacleTracker.total}`
    console.log(`building obstacle #{id}`)
    obstacleTracker.ids = [
      ...obstacleTracker.ids,
      id
    ]
    const texture = PIXI.loader.resources['obstacle'].texture;
    gobManager.add(
      new Gob({
        id,
        x: 320,
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

  for(const obstacleId of obstacleTracker.ids){
    let gob = gobManager.get(obstacleId)
    gob.moveTo(gob.x - 6, gob.y)
    if(gob.x < 0){
      gobManager.remove(gob.id)
      obstacleTracker.ids = obstacleTracker.ids.filter( (trackerId) =>{
        return trackerId !== obstacleId
      })
    }
  }

  renderer.render(gobManager.stage)
}

initialize()
