import Obstacle from './obstacle'

export default class Barrier extends Obstacle {
  handleCollisions(player){
    if(this.active && this.checkCollisionWith(player)){
      if(player.state.powerMode && player.state.goRight){
        console.log('obstacle eliminated')
        this.manager.createRemnant(this.id+"_top_remnant", this.x, this.y, -10, -5, this.frames)
        this.manager.createRemnant(this.id+"_bottom_remnant", this.x, this.y, 20, 0, this.frames)
        this.manager.remove(this.id)
      }else{
        console.log('ouch! obstacle hit')
        player.state.hitLoostacle = true
        this.deactivate()
      }
    }
  }
}
