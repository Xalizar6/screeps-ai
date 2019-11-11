'use strict' // Declaring Strict Mode to enforce better coding standards

const initRoom = require('./helper_extendRoomPrototype')
const initCreep = require('./helper_extendCreepPrototype')

exports.initPrototypes = function () {
  initRoom.initRoomPrototype()
  initCreep.initCreepPrototype()
}
