import * as PIXI from 'pixi.js'

const stage = new PIXI.Container()
const renderer = PIXI.autoDetectRenderer(601, 401)
const spriteManager = {}

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

function runGame(){
  const oval = spriteManager.oval
  oval.currentFrame = (oval.currentFrame + 1) % oval.frames.length
  oval.sprite.texture.frame = oval.frames[oval.currentFrame]

  const ovalShadow = spriteManager.ovalShadow
  ovalShadow.currentFrame = (ovalShadow.currentFrame + 1) % ovalShadow.frames.length
  ovalShadow.sprite.texture.frame = ovalShadow.frames[ovalShadow.currentFrame]

  renderer.render(stage)
}

initialize()
