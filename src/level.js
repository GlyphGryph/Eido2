export class Level{
  constructor(){
    // Speed
    this.initVelocity = 6
    this.velocity = this.initVelocity
    this.maxVelocity = 50
    this.targetVelocity = 10

    // Spawn
    this.spawnRate = 30
    this.minSpawnRate = 10
    this.lastSpawn = 0

    // Acceleration
    this.acceleration = 0.4
    
    // Distance
    this.initSpiritDistance = 100
    this.spiritDistance = 100

    // Time
    this.time = 0

    // Obstacles
    this.obstacleIds = []
    this.totalObstacles = 0
  }

  update(step){
    this.time += 1
    //update dynamic parameters
    this.velocity = this.velocity + (step * this.acceleration)
    if(this.velocity > this.axVelocity){
      this.velocity = this.maxVelocity
    }

    this.spiritDistance = this.spiritDistance - (step * (this.velocity - this.targetVelocity)/10)
    if(this.spiritDistance < 0){
      this.spiritDistance = 0
    }
  }
}
