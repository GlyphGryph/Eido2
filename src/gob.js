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

// Gobs come in two forms:
// Texture Mode:
//  - Pass in a 'texture' spritesheet and a set of 'frames'
//  - The texture is a regular PIXI texture
//  - The frames are an array of PIXI rectangles representing part of the texture
// Atlas Mode:
//  - Pass in an 'atlas' spritesheet and a set of 'frames'
//  - The atlas spritesheet is a regular PIXI atlas
//  - The frames are an array of atlas frame names
export class Gob{
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin}){
    console.log(`Creating gob ${id}`)
    this.id = id
    this.stage = stage
    this.x = x
    this.y = y

    // We have different paths for whether we are passed an atlas or a texture
    this.frames = frames
    this.currentFrame = currentFrame
    if(atlas){
      this.hasAtlas = true
      this.atlas = atlas
      this.texture = this.atlas.textures[this.frames[this.currentFrame]]
    } else {
      // If we don't have an at least, we must have a texture
      this.hasAtlas = false
      this.texture = texture
      this.texture.frame = this.frames[this.currentFrame]
    }

    this.sprite = new PIXI.Sprite(this.texture)
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

      if(this.hasAtlas){
        this.sprite.texture = this.atlas.textures[this.frames[this.currentFrame]]
      } else {
        this.sprite.texture.frame = this.frames[this.currentFrame]
      }
    }
  }
}
