'use strict' // Declaring Strict Mode to enforce better coding standards

const initRoom = require('./helper_extendRoomPrototype')
const initCreep = require('./helper_extendCreepPrototype')
const initSource = require('./helper_extendSourcePrototype')
const initMineral = require('./helper_extendMineralPrototype')

exports.initPrototypes = function () {
  initRoom.initRoomPrototype()
  initCreep.initCreepPrototype()
  initSource.initSourcePrototype()
  initMineral.initMineralPrototype()
}
