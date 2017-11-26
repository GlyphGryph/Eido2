import * as PIXI from 'pixi.js'

export class GobManager{
  constructor(){
    this.gobs = []
    this.stage = new PIXI.Container()
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
    gob.initialize(this.stage)
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
  update(){
    for(const gob of this.gobs){
      gob.update()
    }
  }
}

export class Gob{
  constructor({id, x, y, texture, frames, currentFrame, xMax, xMin}){
    this.id = id
    this.x = x
    this.y = y
    texture.frame = frames[currentFrame]
    this.sprite = new PIXI.Sprite(texture)
    this.frames = frames
    this.currentFrame = currentFrame
    this.sprite.position.set(this.x, this.y)
    this.xLimit
    if(xMax){
      this.xMax = xMax
    }
    if(xMin){
      this.xMin = xMin
    }
  }

  initialize(stage){
    this.stage = stage
    stage.addChild(this.sprite)
    console.log(`intialized gob ${this.id}`)
  }

  terminate(){
    this.stage.removeChild(this.sprite)
    console.log(`terminated gob ${this.id}`)
  }

  moveTo(x, y){
    this.x = x
    this.y = y
    if(this.xMin){
      if (this.x < this.xMin){
        this.x = this.xMin
      }
    }
    if(this.xMax){
      if (this.x + this.sprite.width > this.xMax){
        this.x = this.xMax - this.sprite.width
      }
    }
    this.sprite.x = x
    this.sprite.y = y
  }

  update(){
    this.currentFrame = (this.currentFrame + 1) % this.frames.length
    this.sprite.texture.frame = this.frames[this.currentFrame]
  }
}
