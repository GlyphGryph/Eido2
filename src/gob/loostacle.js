import Obstacle from './obstacle'

export default class Loostacle extends Obstacle {
  handleCollisions(player){
    const level = this.manager.level
    if(this.active && this.checkCollisionWith(player)){
      if(!(player.state.powerMode && player.state.goLeft)){
        player.state.hitLoostacle = true
      }
      this.deactivate()
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
