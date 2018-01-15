export default class GobManager{
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
