import * as PIXI from 'pixi.js'

let stage = new PIXI.Container()
let renderer = PIXI.autoDetectRenderer(601, 401)

function initialize(){

  renderer.backgroundColor = 0xFFFFFF

  //Add the elements to the html
  document.getElementById('BackgroundBox').appendChild(renderer.view)

  PIXI.loader
    .add('ovalRun', '../assets/ovalrun.png')
    .add('ovalShadow', '../assets/ovalshadow.png')
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
  let ovalRunTiles = []
  for(let ii = 0; ii < 4; ii++){
    const texture = PIXI.loader.resources['ovalRun'].texture
    texture.frame = new PIXI.Rectangle(ii * 40, 0, 40, 40)
    ovalRunTiles.push(texture)
  }
  const oval = new PIXI.AnimatedSprite(ovalRunTiles)
  oval.position.set(20, 180)
  stage.addChild(oval)

  let ovalShadowTiles = []
  for(let ii = 0; ii < 4; ii++){
    const texture = PIXI.loader.resources['ovalShadow'].texture
    texture.frame = new PIXI.Rectangle(ii * 40, 0, 40, 10)
    ovalShadowTiles.push(texture)
  }
  const ovalShadow = new PIXI.AnimatedSprite(ovalShadowTiles)
  ovalShadow.position.set(20, 220)
  stage.addChild(ovalShadow)

  renderer.render(stage)
}

initialize()
