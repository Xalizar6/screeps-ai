'use strict' // Declaring Strict Mode to enforce better coding standards

/* global Room FIND_SOURCES */
// TODO: FIgure out how to write this getter code when using the ObjectID as the name of the object in memory.
exports.initRoomPrototype = function () {
  Object.defineProperty(Room.prototype, 'sources', {
    get: function () {
      // If we dont have the value stored locally
      if (!this._sources) {
        // If we dont have the value stored in memory
        if (!this.memory.sources) {
          // Find the sources and store their id's in memory,
          // NOT the full objects
          this.memory.sources = this.find(FIND_SOURCES)
            .map(source => source.id)
        }
        // Get the source objects from the id's in memory and store them locally
        console.log("Didn't run memory loop")
        // this._sources = this.memory.sources.map(id => Game.getObjectById(id))
        this._sources = this.memory.sources
      }
      // return the locally stored value
      return this._sources
    },
    enumerable: true,
    configurable: true
  })

  /*   Object.defineProperty(Room.prototype, 'sources', {
      get: function () {
        // If we dont have the value stored locally
        if (!this._sources) {
          // If we dont have the value stored in memory
          if (!this.memory.sourceIds) {
            // Find the sources and store their id's in memory,
            // NOT the full objects
            this.memory.sourceIds = this.find(FIND_SOURCES)
              .map(source => source.id)
          }
          // Get the source objects from the id's in memory and store them locally
          this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id))
        }
        // return the locally stored value
        return this._sources
      },
      // This makes it so the property shows up when enumerating the properties
      // of the object. If you arent sure, put false.
      enumerable: true,
      // This makes the characteristics of the property modifiable and also makes
      // the property deletable. if you arent sure, put true.
      configurable: true
    })
   */
}
