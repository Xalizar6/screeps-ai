'use strict' // Declaring Strict Mode to enforce better coding standards

/* global Creep _ */

exports.initCreepPrototype = function () {
  Object.defineProperty(Creep.prototype, 'isFull', {
    get: function () {
      if (!this._isFull) {
        this._isFull = _.sum(this.store) === this.store.getCapacity()
      }
      return this._isFull
    },
    enumerable: true,
    configurable: true
  })
}
