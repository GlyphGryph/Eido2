export class Level{
  constructor(){
    // Speed
    this.initVelocity = 8
    this.velocity = this.initVelocity
    this.maxVelocity = 50
    this.targetVelocity = 10

    // Spawn
    this.spawnRate = 500
    this.lastSpawn = 0

    // Acceleration
    this.acceleration = 0.3

    // Distance
    this.initSpiritDistance = 200
    this.spiritDistance = 200

    // Time
    this.time = 0
    this.distanceTraveled = 0

    // Obstacles
    this.groundLevel = 280
    this.rightWall = 300
    this.leftWall = 20
  }

  update(player){
    this.time += 1
    //update dynamic parameters
    if(player.shouldAccelerate()){
      this.velocity = this.velocity + this.acceleration
      if(this.velocity > this.maxVelocity){
        this.velocity = this.maxVelocity
      }
    }

    this.spiritDistance = this.spiritDistance - (this.velocity - this.targetVelocity)/10
    if(this.spiritDistance < 0){
      this.spiritDistance = 0
    }

    this.distanceTraveled += this.velocity
  }
}
