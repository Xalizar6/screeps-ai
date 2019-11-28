'use strict' // Declaring Strict Mode to enforce better coding standards

/* global Creep */

exports.initCreepPrototype = function () {
  Object.defineProperty(Creep.prototype, 'isFull', {
    get: function () {
      if (!this._isFull) {
        this._isFull = this.store.getFreeCapacity() === 0
      }
      return this._isFull
    },
    enumerable: true,
    configurable: true
  })

  Object.defineProperty(Creep.prototype, 'isEmpty', {
    get: function () {
      if (!this._isEmpty) {
        this._isEmpty = this.store.getUsedCapacity() === 0
      }
      return this._isEmpty
    },
    enumerable: true,
    configurable: true
  })
}
