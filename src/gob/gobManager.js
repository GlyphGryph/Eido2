import {Gob, Player, Loostacle, Roughacle, Barrier, Remnant} from '.'

export default class GobManager{
  constructor({
    mainLayer,
    backgroundLayer,
    loader,
    level
  }){
    this.mainLayer = mainLayer
    this.backgroundLayer = backgroundLayer
    this.loader = loader
    this.spritesheet = loader.resources["spritesheet"]
    this.level = level
    this.gobs = []
    this.playerStartingX = 100
    this.nextObstacleId = 0
    this.obstacles = []
  }

  // Adds a gob from the manager
  // Arguments:
  // gob: A Gob instance.
  //  Can't have the same id as a gob already in the manager
  add(gob){
    if(this.gobs.filter(function(comp){return comp.id === gob.id}).length > 0){
      throw `Cannot add gob ${gob.id} with the same id as an already tracked object`
    }
    this.gobs = [...this.gobs, gob]
    gob.initialize(this)
    return this
  }

  addObstacle(gob){
    this.add(gob)
    this.obstacles = [...this.obstacles, gob]
    this.nextObstacleId += 1
  }

  // Removes a gob from the manager
  // Arguments:
  // id: Gob id
  remove(id){
    let removedGob = null
    this.obstacles = this.obstacles.filter( (gob) => {
      return gob.id !== id
    })
    this.gobs = this.gobs.filter( (gob) => {
      if(gob.id === id){
        removedGob = gob
        return false
      } else {
        return true
      }
    })
    // Make sure this gob is remove from reality, run it's teardown logic first
    removedGob.terminate()
    return removedGob
  }

  // Returns a gob from the manager
  // Arguments:
  // id: Gob id
  get(id){
    return this.gobs.find( (gob) => {
      return gob.id === id
    })
  }

  // Runs the update function on all gobs
  // Note: Updates should happen *after* all manipulations like moveTo are done to a sprite
  update(){
    for(const gob of this.obstacles){
      gob.handleCollisions(this.get('player'))
    }
    for(const gob of this.gobs){
      gob.update()
    }
    return this
  }
  
  createPlayer(){
    this.add(
      new Player({
        id: 'player',
        stage: this.mainLayer,
        x: this.playerStartingX,
        y: this.level.groundLevel,
        atlas: this.spritesheet,
        xMax: this.level.rightWall,
        xMin: this.level.leftWall
      })
    )
    let shadowBaseOffset = {
      x: -2,
      y: 30,
    }
    const shadow = new Gob({
      id: 'playerShadow',
      stage: this.mainLayer,
      x: this.playerStartingX + shadowBaseOffset.x,
      y: this.level.groundLevel + shadowBaseOffset.y,
      atlas: this.spritesheet,
      frames: [
        "oval/run/shadow/03",
      ],
      currentFrame: 0,
    })
    shadow.baseOffset = shadowBaseOffset
    this.add(shadow)
  }

  createFigment(){
    this.add(
      new Gob({
        id: 'figment',
        stage: this.mainLayer,
        x: 500,
        y: this.level.groundLevel,
        atlas: this.spritesheet,
        frames: [
          "figment/run/00",
          "figment/run/01",
          "figment/run/02",
          "figment/run/03",
          "figment/run/04",
          "figment/run/05",
          "figment/run/06",
          "figment/run/07"

        ],
        currentFrame: 0
      })
    )
  }

  createLoostacle(){
    const id = `obstacle${this.nextObstacleId}`
    this.addObstacle(
      new Loostacle({
        id,
        stage: this.backgroundLayer,
        x: 340,
        y: this.level.groundLevel+20,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/loostacle" ],
      })
    )
  }

  createBarrier(){
    const id = `obstacle${this.nextObstacleId}`
    this.addObstacle(
      new Barrier({
        id,
        stage: this.backgroundLayer,
        x: 340,
        y: this.level.groundLevel - 110,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/barrier" ],
      })
    )
  }

  createRoughacle(length){
    for(let ii=0; ii < length; ii++){
      const id = `obstacle${this.nextObstacleId}-roughacle${id}_${ii}`
      this.addObstacle(
        new Roughacle({
          id,
          stage: this.backgroundLayer,
          x: 340+(ii*20),
          y: this.level.groundLevel + 20,
          atlas: this.spritesheet,
          currentFrame: 0,
          frames: [ "obstacles/roughacle" ],
        })
      )
    }
  }

  createRemnant(id, x, y, xMove, yMove, rotation, frames){
    this.add(
      new Remnant({
        id,
        stage: this.backgroundLayer,
        x,
        y,
        xMove,
        yMove,
        lifetime: 10,
        atlas: this.spritesheet,
        rotation,
        currentFrame: 0,
        frames,
      })
    )
  }

  // Returns distance between two gobs
  // Arguments:
  // gob1, gob2: gob ids
  distance(gob1id, gob2id){
    let gob1 = this.get(gob1id)
    let gob2 = this.get(gob2id)
    return Math.sqrt( Math.pow(gob2.x-gob1.x, 2) + Math.pow(gob2.y-gob1.y, 2) )
  }
}
