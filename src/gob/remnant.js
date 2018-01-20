import Gob from './gob'

export default class Remnant extends Gob {
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin, xMove, yMove, lifetime}){
    // TODO: We currently remove the atlas we pass, because our obstacles don't use it - yet!
    // They will, and when they do this needs to be added back in
    // The atlas is still needed by marker, though
    super({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin})
    this.lifetime = lifetime
    this.xMove = xMove
    this.yMove = yMove
  }

  update(){
    console.log('updating remnant')
    this.moveTo(this.x + this.xMove, this.y + this.yMove)
    this.lifetime -= 1
    if(this.lifetime <= 0){
      this.manager.remove(this.id)
    }
    super.update()
  }
}
