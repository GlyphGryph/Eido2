import Gob from './gob'

export default class Player extends Gob {
  constructor({id, stage, x, y, atlas, texture, xMax, xMin}){
    const frames = [
      "oval/run/00",
      "oval/run/01",
      "oval/run/02",
      "oval/run/03",
    ]
    const currentFrame = 0
    super({id, stage, x, y, atlas, texture, frames, currentFrame, xMax, xMin})
    
    this.runFrames = frames
    this.powerFrames = [
      "oval/power/01",
      "oval/power/02",
    ],
    this.readyJumpFrames = [
      "oval/air/01",
    ]
    this.jumpFrames = [
      "oval/air/02",
    ]
    this.crestJumpFrames = [
      "oval/air/03",
    ]
    this.fallFrames = [
      "oval/air/04",
    ]

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
      hitRoughacle: false,
      hitLoostacle: false,
      hitBarrier: false,
      wasHit: false,
      knockedBack: false,
      knockbackTimer: 0,
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

  shouldPowerToss(){
    return this.state.powerMode && this.state.goLeft && !this.state.goRight
  }

  shouldPowerBreak(){
    return this.state.powerMode && this.state.goRight && !this.state.goLeft
  }

  knockback(){
    this.state.knockedBack = true
    this.state.knockbackTimer = 4
    this.state.grounded = false
    this.cancelJump()
    this.state.fallSpeed = -this.weight * 4
  }

  update(){
    this.handlePower()
    this.handleJump()
    this.handleFall()
    this.handleMoveVertical()
    this.handleMoveHorizontal()
    this.handleObstacles()
    this.handleKnockback()
    this.selectFrames()
    super.update()
  }
  
  handleKnockback(){
    if(this.state.knockedBack){
      this.state.knockbackTimer -= 1
    }
    if(this.state.knockbackTimer <= 0){
      this.state.knockedBack = false
    }
  }

  selectFrames(){
    if(this.state.powerMode){
      this.setFrames(this.powerFrames)
    }else if(this.state.grounded){
      this.setFrames(this.runFrames)
    }else{
      if(this.state.jumping){
        this.setFrames(this.jumpFrames)
      }else if(this.state.fallSpeed <= 0){
        this.setFrames(this.crestJumpFrames)
      }else{
        this.setFrames(this.fallFrames)
      }
    }
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
    if(!this.state.jumping && this.manager.level.groundLevel <= this.y && this.state.fallSpeed >= 0){
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
    if(this.state.knockedBack > 0){
      this.moveTo(this.x - this.standardStep/2, this.y)
    }else if(this.state.powerMode || (this.state.goLeft && this.state.goRight)){
      // Do nothing
    }else if(this.state.goLeft){
      this.moveTo(this.x - this.standardStep, this.y)
    }else if(this.state.goRight){
      this.moveTo(this.x + this.standardStep, this.y)
    }
  }
  
  handleMoveVertical(){
    this.moveTo(this.x, this.y + this.state.fallSpeed)
    if(this.manager.level.groundLevel < this.y){
      this.moveTo(this.x, this.manager.level.groundLevel)
    }
  }

  handleObstacles(){
    if(this.state.hitRoughacle){
      this.manager.level.velocity = this.manager.level.velocity - this.manager.level.velocity / 16
      this.state.hitRoughacle = false
    }
    if(this.state.hitLoostacle){
      this.knockback()
      this.manager.level.velocity = this.manager.level.velocity / 2
      this.state.hitLoostacle = false
    }
    if(this.state.hitBarrier){
      this.knockback()
      this.manager.level.velocity = this.manager.level.velocity / 2
      this.state.hitBarrier = false
    }
  }
}
