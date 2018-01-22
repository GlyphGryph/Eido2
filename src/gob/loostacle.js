import Obstacle from './obstacle'

export default class Loostacle extends Obstacle {
  handleCollisions(player){
    if(this.active && this.checkCollisionWith(player)){
      if(player.shouldPowerToss()){
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
      this.manager.createRemnant(this.id+"_left_remnant", this.x-5, this.y+12, 0, 0, 0, ["obstacles/brokenLoostacle/01"])
      this.manager.createRemnant(this.id+"_right_remnant", this.x+5, this.y+15, 0, 0, 0, ["obstacles/brokenLoostacle/02"])
      this.manager.remove(this.id)
    }else if(this.destroyedByPower){
      console.log(`obstacle ${this.id} eliminated`)
      this.manager.createRemnant(this.id+"_right_remnant", this.x, this.y, 10, -5, 0.5, ["obstacles/brokenLoostacle/02"])
      this.manager.createRemnant(this.id+"_left_remnant", this.x, this.y, 0, -10, -0.5, ["obstacles/brokenLoostacle/01"])
      this.manager.remove(this.id)
    }else{
      super.update()
    }
  }
}
