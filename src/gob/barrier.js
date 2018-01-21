import Obstacle from './obstacle'

export default class Barrier extends Obstacle {
  handleCollisions(player){
    if(this.active && this.checkCollisionWith(player)){
      if(player.state.powerMode && player.state.goRight){
        console.log('obstacle eliminated')
        this.manager.createRemnant(this.id+"_top_remnant", this.x, this.y + 40, 10, -5, 0.3, ["obstacles/brokenBarrier/top"])
        this.manager.createRemnant(this.id+"_middle_remnant", this.x, this.y + 110, 20, 0, -0.2, ["obstacles/brokenBarrier/middle"])
        this.manager.createRemnant(this.id+"_bottom_remnant", this.x, this.y + 150, 0, 0, 0, ["obstacles/brokenBarrier/base"])
        this.manager.remove(this.id)
      }else{
        console.log('ouch! obstacle hit')
        player.state.hitLoostacle = true
        this.deactivate()
      }
    }
  }
}
