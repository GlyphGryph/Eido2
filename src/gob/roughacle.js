import Obstacle from './obstacle'

export default class Roughacle extends Obstacle {
  //TODO: Give this a better name
  doTheThing(player){
    const level = this.manager.level
    if(this.active){
      if(this.checkCollisionWith(player)){
        level.velocity = level.velocity / 2
        this.deactivate()
      }else if(
        player.attackLaunched &&
        player.attackType == this.attackType &&
        this.checkHitZoneCollision(player)
      ){
        this.deactivate()
      }else if(this.checkHitZoneCollision(player)){
        player.canHitObstacle = true
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
