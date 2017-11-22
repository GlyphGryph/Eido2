import * as PIXI from 'pixi.js'

let stage = null;
let renderer = null;

function initialize(){
  //Create the renderer and stage
  renderer = PIXI.autoDetectRenderer(601, 401)
  renderer.backgroundColor = 0xFFFFFF

  stage = new PIXI.Container()

  //Add the elements to the html
  document.getElementById('BackgroundBox').appendChild(renderer.view)

  PIXI.loader
    .add("../assets/ovalrun.gif")
    .load(setup)

}

function setup(){

  let oval = new PIXI.Sprite(
    PIXI.loader.resources["../assets/ovalrun.gif"].texture
  )

  stage.addChild(oval)

  renderer.render(stage)
}

initialize()
