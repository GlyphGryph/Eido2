import Gob from './gob'

export default class Player extends Gob {
  constructor({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin, shadowFrames}){
    super({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin})
    this.readyMarkerText = new PIXI.Text('!', { font: '35px Snippet', fill: 'black', align: 'left' });
    this.readyMarkerVisible = false
    this.buffer = 10
    this.standardStep = 10
    this.initialJumpSpeed = 15
    this.maxJumpDuration = 6
    this.maxFallSpeed = 15
    this.weight = 3
    this.state = {
      goLeft: false,
      goRight: false,
      goUp: false,
      goPower: false,
      powerMode: false,
      jumping: false,
      grounded: true,
      jumpTimer: 0,
      fallSpeed: 0,
    }
    this.attackLaunched = false
    this.canHitObstacle = false
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

  shouldAccelerate(){
    return this.state.grounded && !this.state.powerMode
  }

  update(){
    this.handlePower()
    this.handleJump()
    this.handleFall()
    this.handleMoveVertical()
    this.handleMoveHorizontal()
    super.update()
  }

  handlePower(){
    if(this.state.powerMode){
      if(!this.state.goPower){
        this.state.powerMode = false
      }
    }else{
      if(this.state.goPower){
        this.state.powerMode = true
        if(this.state.jumping){
          this.cancelJump()
        }
      }
    }
  }

  cancelJump(){
    this.state.jumping = false
    this.state.jumpTimer = 0
  }

  handleJump(){
    // If we are in the goUp state while on the ground, jump
    if(this.state.goUp && this.state.grounded && !this.state.powerMode){
      this.state.grounded = false
      this.state.jumping = true
      this.state.jumpTimer = 0
      this.state.fallSpeed = -this.initialJumpSpeed
    }

    // Stop jumping if we leave the goUp state
    if(!this.state.goUp && this.state.jumping){
      this.cancelJump()
    }

    // If the player is jumping...
    if(this.state.jumping){
      this.state.fallSpeed = -this.initialJumpSpeed
      this.state.jumpTimer += 1
    }

    if(this.state.jumpTimer >= this.maxJumpDuration){
      this.cancelJump()
    }
  }
  
  handleFall(){
    if(!this.state.jumping && this.manager.level.groundLevel <= this.y){
      this.state.grounded = true
    }
    if(this.state.grounded){
      this.state.fallSpeed = 0
    }else{
      if(this.state.fallSpeed > this.maxFallSpeed){
        this.state.fallSpeed = this.maxFallSpeed
      }
      this.state.fallSpeed += this.weight
    }
  }
  
  // Handle Left/Right movement
  handleMoveHorizontal(){
    if(this.state.goLeft && this.state.goRight){
      // Do nothing
    } else if(this.state.goLeft){
      this.moveTo(this.x - this.standardStep, this.y)
    } else if(this.state.goRight){
      this.moveTo(this.x + this.standardStep, this.y)
    }
  }
  
  handleMoveVertical(){
    this.moveTo(this.x, this.y + this.state.fallSpeed)
    if(this.manager.level.groundLevel < this.y){
      this.moveTo(this.x, this.manager.level.groundLevel)
    }
  }
}
