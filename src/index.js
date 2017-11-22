import * as PIXI from 'pixi.js'

function initialize(){
  //Create the renderer and stage
  let renderer = PIXI.autoDetectRenderer(601, 401)
  let stage = new PIXI.Container()

  //Add the elements to the html
  document.getElementById('BackgroundBox').appendChild(renderer.view)
  renderer.render(stage)

  //startLoading()
}

initialize()
