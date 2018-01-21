import * as PIXI from 'pixi.js'

// Gobs come in two forms:
// Texture Mode:
//  - Pass in a 'texture' spritesheet and a set of 'frames'
//  - The texture is a regular PIXI texture
//  - The frames are an array of PIXI rectangles representing part of the texture
// Atlas Mode:
//  - Pass in an 'atlas' spritesheet and a set of 'frames'
//  - The atlas spritesheet is a regular PIXI atlas
//  - The frames are an array of atlas frame names
export default class Gob{
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin}){
    this.id = id
    this.stage = stage
    this.x = x
    this.y = y
    this.previous = {}
    this.previous.x = this.x
    this.previous.y = this.y
    this.buffer = 0

    // We have different paths for whether we are passed an atlas or a texture
    this.frames = frames
    this.currentFrame = currentFrame
    if(atlas){
      this.useAtlas = true
      this.atlas = atlas
      this.texture = this.atlas.textures[this.frames[this.currentFrame]]
    } else {
      // If we don't have an atlas, we must have a texture
      this.useAtlas = false
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

  initialize(manager){
    this.manager = manager
    this.stage.addChild(this.sprite)
  }

  terminate(){
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

  // This method should always be called on a sprite before immediately before rendering
  update(){
    if(this.frames.length > 0){
      this.currentFrame = (this.currentFrame + 1) % this.frames.length

      if(this.useAtlas){
        this.sprite.texture = this.atlas.textures[this.frames[this.currentFrame]]
      } else {
        this.sprite.texture.frame = this.frames[this.currentFrame]
      }
    }
    this.previous.x = this.x
    this.previous.y = this.y
  }

  setFrames(frames){
    if(this.frames !== frames){
      this.frames = frames
      this.currentFrame = 0
    }
  }

  // These are calculated based on current and previous position
  // This prevents situations where players will skip through fast moving objects
  getCollisionParameters(){
    // Buffers are for objects that we want to overlap a bit before colliding
    // Weird shit will probably happen if the object is smaller than 2x its buffer, don't do that
    const left = Math.min(this.x, this.previous.x) + this.buffer
    const right = Math.max(this.x, this.previous.x) + this.sprite.width - this.buffer
    const top = Math.min(this.y, this.previous.y) + this.buffer
    const bottom = Math.max(this.y, this.previous.y) + this.sprite.height - this.buffer
    return {left, right, top, bottom}
  }

  // Returns whether or not this overlaps passed object,
  // or the space between where they are and where they were last frame
  checkCollisionWith(gob){
    const ourParams = this.getCollisionParameters()
    const theirParams = gob.getCollisionParameters()

    // Basic rectangular collision detector
    return (
      ourParams.left < theirParams.right &&
      ourParams.right > theirParams.left &&
      ourParams.top < theirParams.bottom &&
      ourParams.bottom > theirParams.top
    )
  }

  show(){
    this.sprite.alpha = 1
  }

  hide(){
    this.sprite.alpha = 0
  }
}

