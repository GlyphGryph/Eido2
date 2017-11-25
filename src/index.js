import * as PIXI from 'pixi.js'

const stage = new PIXI.Container()
const renderer = PIXI.autoDetectRenderer(601, 401)
const spriteManager = {}
const velocity = 10
let playerVX = 0
let a,d = {}

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
    .add("assets/eidolonSpritesheet.json")
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

  const id = PIXI.loader.resources["assets/eidolonSpritesheet.json"].textures;

  let ovalRunFrames = []
  for(let ii = 0; ii < 4; ii++){
    const frame = new PIXI.Rectangle(ii * 40, 0, 40, 40)
    ovalRunFrames.push(frame)
  }
  const ovalTexture = id["ovalrun.png"]
  ovalTexture.frame = ovalRunFrames[0]
  const oval = new PIXI.Sprite(ovalTexture)
  oval.position.set(20, 180)
  stage.addChild(oval)
  spriteManager.oval = {
    sprite: oval,
    frames: ovalRunFrames,
    currentFrame: 0
  }

  let ovalShadowFrames = []
  for(let ii = 0; ii < 4; ii++){
    const frame = new PIXI.Rectangle(ii * 40, 0, 40, 10)
    ovalShadowFrames.push(frame)
  }
  const ovalShadowTexture = id["ovalshadow.png"]
  ovalShadowTexture.frame = ovalShadowFrames[0]
  const ovalShadow = new PIXI.Sprite(ovalShadowTexture)
  ovalShadow.position.set(20, 210)
  stage.addChild(ovalShadow)
  spriteManager.ovalShadow = {
    sprite: ovalShadow,
    frames: ovalShadowFrames,
    currentFrame: 0
  }

  renderer.render(stage)
  startGame()
}

function startGame(){
  let gameInterval = setInterval(runGame, 90)
}

function collideWithBounds(sprite){
  //clip sprite X coordinate to world bounds
  if (sprite.x < 0){
    sprite.x = 0
  }
  if (sprite.x+sprite.width > renderer.width){
    sprite.x = renderer.width - sprite.width
  }
}

function runGame(){

  const oval = spriteManager.oval
  oval.currentFrame = (oval.currentFrame + 1) % oval.frames.length
  oval.sprite.texture.frame = oval.frames[oval.currentFrame]
  oval.sprite.x += playerVX
  collideWithBounds(oval.sprite)

  const ovalShadow = spriteManager.ovalShadow
  ovalShadow.currentFrame = (ovalShadow.currentFrame + 1) % ovalShadow.frames.length
  ovalShadow.sprite.texture.frame = ovalShadow.frames[ovalShadow.currentFrame]
  ovalShadow.sprite.x += playerVX
  collideWithBounds(ovalShadow.sprite)

  renderer.render(stage)
}

initialize()
