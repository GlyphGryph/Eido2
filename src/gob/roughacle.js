import Obstacle from './obstacle'

export default class Roughacle extends Obstacle {
  handleCollisions(player){
    const level = this.manager.level
    if(this.active && this.checkCollisionWith(player)){
      if(player.state.powerMode){
        // TODO: indicate player is powering through
      } else {
        level.velocity = level.velocity - level.velocity / 16
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
