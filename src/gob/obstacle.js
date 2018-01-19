import Gob from './gob'

export default class Obstacle extends Gob {
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin}){
    // TODO: We currently remove the atlas we pass, because our obstacles don't use it - yet!
    // They will, and when they do this needs to be added back in
    // The atlas is still needed by marker, though
    super({id, stage, x, y, texture, frames, currentFrame, xMax, xMin})
    
    this.active = true
    /*
    this.hitZoneWidth = 100
    this.attackType = Math.random() > 0.5 ? "k" : "o"
    this.markerOffset = {
      x: 12,
      y: -30
    }
    this.marker = new Gob({
      id: `${id}Marker`,
      stage,
      x: this.x + this.markerOffset.x,
      y: this.y + this.markerOffset.y,
      atlas,
      frames: [
        `keys/${this.attackType}`
      ],
      currentFrame
    }) */
  }

  initialize(manager){
    super.initialize(manager)
    //this.manager.add(this.marker)
  }

  terminate(){
    super.terminate()
    //this.manager.remove(this.marker.id)
  }

  moveTo(x, y){
    super.moveTo(x, y)
    /*this.marker.moveTo(
      x + this.markerOffset.x,
      y + this.markerOffset.y
    )*/
  }

  //hideMarker(){
  //  this.marker.hide()
  //}
  
  deactivate(){
    //this.hideMarker()
    console.log('ouch! obstacle hit')
    this.active = false
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

  // Returns whether or not a zone in front of this obstacle overlaps passed object,
  /*checkHitZoneCollision(gob){
    const ourParams = this.getHitZoneCollisionParameters()
    const theirParams = gob.getCollisionParameters()

    // Basic rectangular collision detector
    return (
      ourParams.left < theirParams.right &&
      ourParams.right > theirParams.left &&
      ourParams.top < theirParams.bottom &&
      ourParams.bottom > theirParams.top
    )
  }*/
  
  handleCollisions(player){
    const level = this.manager.level
    if(this.active){
      if(this.checkCollisionWith(player)){
        level.velocity = level.velocity / 2
        this.deactivate()
      /*
      }else if(
        player.attackLaunched &&
        player.attackType == this.attackType &&
        this.checkHitZoneCollision(player)
      ){
        this.deactivate()
      }else if(this.checkHitZoneCollision(player)){
        player.canHitObstacle = true
      */
      }
    }
    
    // Clean up destroyed obstacles
    if(!this.active){
      // TODO: Don't remove, just change the sprite when deactivate
      this.manager.remove(this.id)
      level.obstacleIds = level.obstacleIds.filter( (trackerId) =>{
        return trackerId !== this.id
      })
      console.log('obstacle destroyed!')
    }
  }
}
