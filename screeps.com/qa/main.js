/* global STRUCTURE_TOWER Memory _ */

// -------------------------------------------------------
// Including logging module first so it can be used below.
const log = require('./helper_logging')
log.init()
// -------------------------------------------------------

// -------------------------------------------------------
// Including modules, executed on new global creation
log.output('Info', 'Begin - Initializing Modules', true)
const timer1 = Game.cpu.getUsed()

const roleHarvester = require('./role.harvester')
const roleUpgrader = require('./role.upgrader')
const roleDedicatedHarvester = require('./role.dedicatedHarvester_v2')
const logisticsLocal = require('./role.logisticsLocal')
const roleEnergyHauler = require('./role.energyHauler')
const rolebuilder = require('./role.builder')
const spawnCode = require('./spawncode')
const towerCode = require('./towercode')
const marketCode = require('./marketCode')
const constructionCode = require('./helper_construction')
const mineralHarvester = require('./role.mineralHarvester')
const mineralHauler = require('./role.mineralHauler')
const terminalManager = require('./role.terminalManagerV3')
const init = require('./helper_initializations_v2')
const prototypes = require('./helper_initPrototypes')
const moduleName = 'Main'

log.output('Info', 'Initializing modules took: ' + (Game.cpu.getUsed() - timer1)
  .toFixed(2) + ' CPU Time', false, true)
log.output('Info', 'End - Initializing Modules')
// -------------------------------------------------------

log.output('Event', 'Initializing Memory', true, true)
init.initMemory()

// This loop is executed every tick
module.exports.loop = function () {
  log.output('Info', 'Begin - ' + moduleName, true)
  const mainLoop = Game.cpu.getUsed()

  // -------------------------------------------------------
  //   Remove these items from Memory at an interval to update for world changes.
  if (Game.time % 1000 === 0) {
    log.output('Event', 'Running the Clear Memory routine', true, true)
    for (const index in Memory.rooms) {
      delete Memory.rooms[index].construction
      delete Memory.rooms[index].extractor
      //   TODO: Cleanup these two items
      //   delete Memory.rooms[index].mineral // 5/22/2020 [DR]: shouldn't need anymore
      //   delete Memory.rooms[index].minerals // 5/22/2020 [DR]: shouldn't need anymore
      delete Memory.rooms[index].sources
    }
    log.output('Event', 'Initializing Memory', true, true)
    init.initMemory()
  }
  // -------------------------------------------------------

  // Initialize console commands with the alias of cc
  init.initConsoleCommands()

  // Initialize the prototype updates
  prototypes.initPrototypes()

  // Run the spawncode module
  spawnCode.run()

  // Run the Tower module
  const aTowers = _.filter(Game.structures, (s) => s.structureType ===
    STRUCTURE_TOWER)
  _.forEach(aTowers, function (oTower) {
    towerCode.run(oTower)
  })

  // Run the Market module
  marketCode.run()

  // Run the Construction module
  constructionCode.run()

  // Call the role based work module for each creep
  _.forEach(Game.creeps, function (oCreep) {
    if (oCreep.memory.role === 'harvester') {
      roleHarvester.run(oCreep)
    };

    if (oCreep.memory.role === 'upgrader') {
      roleUpgrader.run(oCreep)
    };

    if (oCreep.memory.role === 'builder') {
      rolebuilder.run(oCreep)
    };

    if (oCreep.memory.role === 'dedicatedHarvester') {
      roleDedicatedHarvester.main(oCreep)
    };

    if (oCreep.memory.role === 'Energy Hauler') {
      roleEnergyHauler.run(oCreep)
    };

    if (oCreep.memory.role === 'logisticsLocal') {
      logisticsLocal.run(oCreep)
    };

    if (oCreep.memory.role === 'Mineral Harvester') {
      mineralHarvester.main(oCreep)
    };

    if (oCreep.memory.role === 'Mineral Hauler') {
      //   mineralHauler.run(oCreep)
      mineralHauler.main(oCreep)
    };

    if (oCreep.memory.role === 'Terminal Manager') {
      terminalManager.run(oCreep)
    };
  })

  log.output('Info', 'Main took: ' + (Game.cpu.getUsed() - mainLoop).toFixed(2) + ' CPU Time with ' + Game.cpu
    .bucket + ' bucket remaining', true, true)
  log.output('Info', 'End - Main')
}
