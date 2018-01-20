import Gob from './gob'

export default class Obstacle extends Gob {
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin}){
    // TODO: We currently remove the atlas we pass, because our obstacles don't use it - yet!
    // They will, and when they do this needs to be added back in
    // The atlas is still needed by marker, though
    super({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin})
    
    this.active = true
  }

  deactivate(){
    this.active = false
  }

  terminate(){
    this.manager.level.obstacleIds = this.manager.level.obstacleIds.filter( (trackerId) =>{
      return trackerId !== this.id
    })
    super.terminate()
  }

  // These are calculated based on current and previous position
  // This prevents situations where players will skip through fast moving objects
  getHitZoneCollisionParameters(){
    const normalCollisionParameters = this.getCollisionParameters()
    const left = normalCollisionParameters.left - this.hitZoneWidth
    const right = normalCollisionParameters.left
    const top = Math.min(this.y, this.previous.y)
    const bottom = Math.max(this.y, this.previous.y) + this.sprite.height
    return {left, right, top, bottom}
  }

  handleCollisions(player){
    // Handled by subclasses
  }

  update(){
    this.moveTo(Math.round(this.x - this.manager.level.velocity), this.y)
    if(this.x < 0){
      this.manager.remove(this.id)
    }
    super.update()
  }
}
