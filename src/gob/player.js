import Gob from './gob'

export default class Player extends Gob {
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin, shadowFrames}){
    super({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin})
    this.readyMarkerText = new PIXI.Text('!', { font: '35px Snippet', fill: 'black', align: 'left' });
    this.readyMarkerVisible = false
    this.buffer = 10
    this.readyMarkerOffset = {
      x: 20,
      y: -30
    }
  }
  
  initialize(manager){
    super.initialize(manager)
  }

  terminate(){
    super.terminate()
  }

  showReadyMarker(){
    if(!this.readyMarkerVisible){
      this.readyMarkerVisible = true
      this.stage.addChild(this.readyMarkerText)
    }
  }

  hideReadyMarker(){
    if(this.readyMarkerVisible){
      this.readyMarkerVisible = false
      this.stage.removeChild(this.readyMarkerText)
    }
  }

  moveTo(x, y){
    super.moveTo(x, y)
    this.readyMarkerText.position.x = x + this.readyMarkerOffset.x;
    this.readyMarkerText.position.y = y + this.readyMarkerOffset.y;
  }
}
