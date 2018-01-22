import Obstacle from './obstacle'

export default class Barrier extends Obstacle {
  handleCollisions(player){
    if(this.active && this.checkCollisionWith(player)){
      if(player.shouldPowerBreak()){
        this.destroyedByPower = true
      }else{
        this.destroyedByHit = true
        player.state.hitLoostacle = true
      }
    }
  }

  update(){
    if(this.destroyedByHit){
      console.log(`ouch! obstacle ${this.id} hit`)
      this.manager.createRemnant(this.id+"_top_remnant", this.x, this.y, 0, 1, 0.03, ["obstacles/brokenBarrier/top"])
      this.manager.createRemnant(this.id+"_middle_remnant", this.x, this.y + 80, 0, 0.5, -0.03, ["obstacles/brokenBarrier/middle"])
      this.manager.createRemnant(this.id+"_bottom_remnant", this.x, this.y + 141, 0, 0, 0, ["obstacles/brokenBarrier/base"])
      this.manager.remove(this.id)
    }else if(this.destroyedByPower){
      console.log(`obstacle ${this.id} eliminated`)
      this.manager.createRemnant(this.id+"_top_remnant", this.x, this.y, 10, 5, 0.2, ["obstacles/brokenBarrier/top"])
      this.manager.createRemnant(this.id+"_middle_remnant", this.x, this.y + 80, 20, 0, -0.2, ["obstacles/brokenBarrier/middle"])
      this.manager.createRemnant(this.id+"_bottom_remnant", this.x, this.y + 141, 0, 0, 0, ["obstacles/brokenBarrier/base"])
      this.manager.remove(this.id)
    }else{
      super.update()
    }
  }

}
