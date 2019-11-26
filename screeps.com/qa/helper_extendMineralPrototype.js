'use strict' // Declaring Strict Mode to enforce better coding standards

/* global Mineral STRUCTURE_CONTAINER FIND_STRUCTURES _  */

exports.initMineralPrototype = function () {
  Object.defineProperty(Mineral.prototype, 'container', {
    get: function () {
      // If we dont have the value stored locally
      if (!this._container) {
        // Search for one nearby
        this._container = _.first(this.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: {
            structureType: STRUCTURE_CONTAINER
          }
        }))
      }
      // Return the locally stored values
      return this._container
    },
    enumerable: true,
    configurable: true
  })
}
