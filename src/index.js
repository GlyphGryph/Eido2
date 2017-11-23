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
  const oval = new PIXI.Sprite(
    PIXI.loader.resources['ovalRun'].texture
  )
  stage.addChild(oval)
  const ovalShadow = new PIXI.Sprite(
    PIXI.loader.resources['ovalShadow'].texture
  )
  stage.addChild(ovalShadow)

  renderer.render(stage)
}

initialize()
