import Obstacle from './obstacle'

export default class Loostacle extends Obstacle {
  handleCollisions(player){
    if(this.active && this.checkCollisionWith(player)){
      if(player.state.powerMode && player.state.goLeft){
        console.log('obstacle eliminated')
        this.manager.createRemnant(this.id+"_right_remnant", this.x, this.y, 10, -5, this.frames)
        this.manager.createRemnant(this.id+"_left_remnant", this.x, this.y, 0, -10, this.frames)
        this.manager.remove(this.id)
      }else{
        console.log('ouch! obstacle hit')
        player.state.hitLoostacle = true
        this.manager.createRemnant(this.id+"_left_remnant", this.x-5, this.y+12, 0, 0, this.frames)
        this.manager.createRemnant(this.id+"_right_remnant", this.x+5, this.y+15, 0, 0, this.frames)
        this.manager.remove(this.id)
      }
    }
  }
}
