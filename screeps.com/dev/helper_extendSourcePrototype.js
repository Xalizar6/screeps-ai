'use strict' // Declaring Strict Mode to enforce better coding standards

/* global Source _  */

// TODO: Create the static location in memory where this shortcut should point to.
exports.initSourcePrototype = function () {
  Object.defineProperty(Source.prototype, 'memory', {
    get: function () {
      //   if (_.isUndefined(Memory.mySourcesMemory)) {
      if (_.isUndefined(this.room.memory.mySourcesMemory)) {
        this.room.memory.mySourcesMemory = {}
      }
      if (!_.isObject(this.room.memory.mySourcesMemory)) {
        return undefined
      }
      const result = this.room.memory.mySourcesMemory[this.id] = this.room.memory.mySourcesMemory[this.id] || {}
      return result
    },
    enumerable: false,
    configurable: true
  })
}
