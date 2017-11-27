import * as PIXI from 'pixi.js'

export class GobManager{
  constructor(){
    this.gobs = []
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
    gob.initialize()
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
  constructor({id, stage, x, y, texture, frames, currentFrame, xMax, xMin}){
    this.id = id
    this.stage = stage
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

  initialize(){
    console.log(`intializing gob ${this.id}`)
    console.log(this)
    this.stage.addChild(this.sprite)
  }

  terminate(){
    console.log(`terminating gob ${this.id}`)
    this.stage.removeChild(this.sprite)
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
    if(this.frames.length > 0){
      this.currentFrame = (this.currentFrame + 1) % this.frames.length
      this.sprite.texture.frame = this.frames[this.currentFrame]
    }
  }
}
