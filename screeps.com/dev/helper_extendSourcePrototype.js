'use strict' // Declaring Strict Mode to enforce better coding standards

/* global Source _  */

exports.initSourcePrototype = function () {
  Object.defineProperty(Source.prototype, 'memory', {
    get: function () {
      if (_.isUndefined(this.room.memory.sources)) {
        this.room.memory.sources = {}
      }
      if (!_.isObject(this.room.memory.sources)) {
        return undefined
      }
      const result = this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {}
      return result
    },
    enumerable: false,
    configurable: true
  })
}
