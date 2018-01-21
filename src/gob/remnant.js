import Gob from './gob'

export default class Remnant extends Gob {
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin, xMove, yMove, rotation, lifetime}){
    // TODO: We currently remove the atlas we pass, because our obstacles don't use it - yet!
    // They will, and when they do this needs to be added back in
    // The atlas is still needed by marker, though
    super({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin})
    this.lifetime = lifetime
    this.rotation = rotation
    this.xMove = xMove
    this.yMove = yMove
    this.sprite.anchor.set(0.5)
  }

  update(){
    console.log('updating remnant, rotation '+this.sprite.rotation)
    this.moveTo(this.x + this.xMove, this.y + this.yMove)
    this.moveTo(Math.round(this.x - this.manager.level.velocity), this.y)
    this.sprite.rotation = this.sprite.rotation + this.rotation
    this.lifetime -= 1
    if(this.lifetime <= 0){
      this.manager.remove(this.id)
    }
    super.update()
  }
}
