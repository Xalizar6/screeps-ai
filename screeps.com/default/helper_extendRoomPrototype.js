'use strict' // Declaring Strict Mode to enforce better coding standards

/* global Room FIND_SOURCES FIND_MY_STRUCTURES STRUCTURE_EXTRACTOR FIND_MINERALS _ */

exports.initRoomPrototype = function () {
  Object.defineProperty(Room.prototype, 'sources', {
    get: function () {
      // If we don't have the value stored locally from a previous call this game loop.
      if (!this._sources) {
        // If we don't have the value stored in memory
        if (!this.memory.sources) {
          // Find the sources and store their ids, not the full object, in memory,
          this.memory.sources = this.find(FIND_SOURCES).map(source => source.id)
        }
        // Get the source objects from the ids in memory and store them locally
        this._sources = _.keys(this.memory.sources).map(source => Game.getObjectById(source))
      }
      // return the locally stored values
      return this._sources
    },
    enumerable: true,
    configurable: true
  })

  Object.defineProperty(Room.prototype, 'mineral', {
    get: function () {
      // If we don't have the value stored locally from a previous call this game loop.
      if (!this._mineral) {
        // If we dont have the value stored in memory
        if (!this.memory.mineral) {
          // Find the mineral and store the id in memory
          this.memory.mineral = this.find(FIND_MINERALS).map(mineral => mineral.id)
        }
        // Get the mineral object from the id in memory and store  locally
        this._mineral = Game.getObjectById(this.memory.mineral)
      }
      // return the locally stored values
      return this._mineral
    },
    enumerable: true,
    configurable: true
  })

  Object.defineProperty(Room.prototype, 'extractor', {
    get: function () {
      // If we don't have the value stored locally from a previous call this game loop.
      if (!this._extractor) {
        // If we dont have the value stored in memory
        if (!this.memory.extractor) {
          // Find the extractor and store the id in memory
          this.memory.extractor = this.find(FIND_MY_STRUCTURES, {
            filter: {
              structureType: STRUCTURE_EXTRACTOR
            }
          }).map(extractor => extractor.id)
        }
        // Get the extractor object from the id's in memory and store them locally
        // this._extractor = _.keys(this.memory.extractor).map(extractor => Game.getObjectById(extractor))
        this._extractor = Game.getObjectById(this.memory.extractor)
      }
      // return the locally stored values
      return this._extractor
    },
    enumerable: true,
    configurable: true
  })
}
