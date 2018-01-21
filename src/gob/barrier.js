import Obstacle from './obstacle'

export default class Barrier extends Obstacle {
  handleCollisions(player){
    if(this.active && this.checkCollisionWith(player)){
      if(player.state.powerMode && player.state.goRight){
        console.log('obstacle eliminated')
        this.manager.createRemnant(this.id+"_top_remnant", this.x, this.y, -10, -5, ["obstacles/brokenBarrier/top"])
        this.manager.createRemnant(this.id+"_middle_remnant", this.x, this.y + 80, 20, 0, ["obstacles/brokenBarrier/middle"])
        this.manager.createRemnant(this.id+"_bottom_remnant", this.x, this.y + 141, 0, 0, ["obstacles/brokenBarrier/base"])
        this.manager.remove(this.id)
      }else{
        console.log('ouch! obstacle hit')
        player.state.hitLoostacle = true
        this.deactivate()
      }
    }
  }
}
