import {Gob, Player, Loostacle, Roughacle} from '.'

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
  }

  // Adds a gob from the manager
  // Arguments:
  // gob: A Gob instance.
  //  Can't have the same id as a gob already in the manager
  add(gob){
    this.gobs = [
      ...this.gobs,
      gob
    ]
    // Also make this gob exist. Run it's initialize logic
    gob.initialize(this)
    // TODO: Throw error if gob has same id
    return this
  }

  // Removes a gob from the manager
  // Arguments:
  // id: Gob id
  remove(id){
    let removedGob = null
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
        frames: [
          "oval/run/00",
          "oval/run/01",
          "oval/run/02",
          "oval/run/03"
        ],
        currentFrame: 0,
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
        "oval/run/shadow/00",
        "oval/run/shadow/01",
        "oval/run/shadow/02",
        "oval/run/shadow/03"
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
    this.nextObstacleId += 1
    this.add(
      new Loostacle({
        id,
        stage: this.backgroundLayer,
        x: 340,
        y: this.level.groundLevel,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/loostacle" ],
      })
    )
    this.level.obstacleIds = [
      ...this.level.obstacleIds,
      id
    ]
  }

  createRoughacle(){
    const id = `obstacle${this.nextObstacleId}-roughacle`
    this.nextObstacleId += 1
    this.add(
      new Roughacle({
        id: id+'_1',
        stage: this.backgroundLayer,
        x: 340,
        y: this.level.groundLevel + 20,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/roughacle" ],
      })
    )
    this.add(
      new Roughacle({
        id: id+'_2',
        stage: this.backgroundLayer,
        x: 360,
        y: this.level.groundLevel + 20,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/roughacle" ],
      })
    )
    this.add(
      new Roughacle({
        id: id+'_3',
        stage: this.backgroundLayer,
        x: 380,
        y: this.level.groundLevel + 20,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/roughacle" ],
      })
    )
    this.add(
      new Roughacle({
        id: id+'_4',
        stage: this.backgroundLayer,
        x: 400,
        y: this.level.groundLevel + 20,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/roughacle" ],
      })
    )
    this.add(
      new Roughacle({
        id: id+'_5',
        stage: this.backgroundLayer,
        x: 420,
        y: this.level.groundLevel + 20,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/roughacle" ],
      })
    )
    this.add(
      new Roughacle({
        id: id+'_6',
        stage: this.backgroundLayer,
        x: 440,
        y: this.level.groundLevel + 20,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/roughacle" ],
      })
    )
    this.add(
      new Roughacle({
        id: id+'_7',
        stage: this.backgroundLayer,
        x: 460,
        y: this.level.groundLevel + 20,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/roughacle" ],
      })
    )
    this.add(
      new Roughacle({
        id: id+'_8',
        stage: this.backgroundLayer,
        x: 480,
        y: this.level.groundLevel + 20,
        atlas: this.spritesheet,
        currentFrame: 0,
        frames: [ "obstacles/roughacle" ],
      })
    )

    this.level.obstacleIds = [
      ...this.level.obstacleIds,
      id+'_1',
      id+'_2',
      id+'_3',
      id+'_4',
      id+'_5',
      id+'_6',
      id+'_7',
      id+'_8',
    ]
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
