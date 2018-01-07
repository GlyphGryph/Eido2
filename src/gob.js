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

  // Returns distance between two gobs
  // Arguments:
  // gob1, gob2: gob ids
  distance(gob1id, gob2id){
    let gob1 = this.get(gob1id)
    let gob2 = this.get(gob2id)
    return Math.sqrt( Math.pow(gob2.x-gob1.x, 2) + Math.pow(gob2.y-gob1.y, 2) )
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

export class Player extends Gob {
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin, shadowFrames}){
    super({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin})
    this.readyMarkerText = new PIXI.Text('!', { font: '35px Snippet', fill: 'black', align: 'left' });
    this.readyMarkerVisible = false
    this.buffer = 10
    this.readyMarkerOffset = {
      x: 20,
      y: -30
    }
  }
  
  initialize(manager){
    super.initialize(manager)
  }

  terminate(){
    super.terminate()
  }

  showReadyMarker(){
    if(!this.readyMarkerVisible){
      this.readyMarkerVisible = true
      this.stage.addChild(this.readyMarkerText)
    }
  }

  hideReadyMarker(){
    if(this.readyMarkerVisible){
      this.readyMarkerVisible = false
      this.stage.removeChild(this.readyMarkerText)
    }
  }

  moveTo(x, y){
    super.moveTo(x, y)
    this.readyMarkerText.position.x = x + this.readyMarkerOffset.x;
    this.readyMarkerText.position.y = y + this.readyMarkerOffset.y;
  }
}

export class Obstacle extends Gob {
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin}){
    // TODO: We currently remove the atlas we pass, because our obstacles don't use it - yet!
    // They will, and when they do this needs to be added back in
    // The atlas is still needed by marker, though
    super({id, stage, x, y, texture, frames, currentFrame, xMax, xMin})
    
    this.active = true
    this.hitZoneWidth = 100
    this.attackType = Math.random() > 0.5 ? "k" : "o"
    this.markerOffset = {
      x: 12,
      y: -30
    }
    this.marker = new Gob({
      id: `${id}Marker`,
      stage,
      x: this.x + this.markerOffset.x,
      y: this.y + this.markerOffset.y,
      atlas,
      frames: [
        `keys/${this.attackType}`
      ],
      currentFrame
    })
  }

  initialize(manager){
    super.initialize(manager)
    this.manager.add(this.marker)
  }

  terminate(){
    super.terminate()
    this.manager.remove(this.marker.id)
  }

  moveTo(x, y){
    super.moveTo(x, y)
    this.marker.moveTo(
      x + this.markerOffset.x,
      y + this.markerOffset.y
    )
  }

  hideMarker(){
    this.marker.hide()
  }
  
  deactivate(){
    this.hideMarker()
    console.log('ouch! obstacle hit')
    this.active = false
  }

  // These are calculated based on current and previous position
  // This prevents situations where players will skip through fast moving objects
  getHitZoneCollisionParameters(){
    const normalCollisionParameters = this.getCollisionParameters()
    const left = normalCollisionParameters.left - this.hitZoneWidth
    const right = normalCollisionParameters.left
    const top = Math.min(this.y, this.previous.y)
    const bottom = Math.max(this.y, this.previous.y) + this.sprite.height
    return {left, right, top, bottom}
  }

  // Returns whether or not a zone in front of this obstacle overlaps passed object,
  checkHitZoneCollision(gob){
    const ourParams = this.getHitZoneCollisionParameters()
    const theirParams = gob.getCollisionParameters()

    // Basic rectangular collision detector
    return (
      ourParams.left < theirParams.right &&
      ourParams.right > theirParams.left &&
      ourParams.top < theirParams.bottom &&
      ourParams.bottom > theirParams.top
    )
  }
}
