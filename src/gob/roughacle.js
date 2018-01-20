import Obstacle from './obstacle'

export default class Roughacle extends Obstacle {
  handleCollisions(player){
    const level = this.manager.level
    if(this.active && this.checkCollisionWith(player)){
      if(player.state.powerMode){
        // TODO: indicate player is powering through
      } else {
        player.state.hitRoughacle = true
      }
    }
  }
}
