'use strict' // Declaring Strict Mode to enforce better coding standards

// TODO: Check if storage exists in the room and place the containers in reference to Storage instead of Spawn

/* global FIND_SOURCES STRUCTURE_CONTAINER */

const log = require('./helper_logging')
const oSpawn = Game.spawns['Spawn1']
const oRoom = oSpawn.room
const aSources = oRoom.find(FIND_SOURCES)
const debug = true // Turn logging for this module on and off

module.exports = {
  run: function () {
    if (!oRoom.memory.construction.RCL1) {
      addConstructionRCL1()
    };
  }

}

const addConstructionRCL1 = function () {
  let timer = null
  const functionName = 'Add Construction for RCL1'
  if (debug) {
    log.output('Debug', 'Begin - ' + functionName, true)
    timer = Game.cpu.getUsed()
  };

  // Declare local Variables
  let aPath = []
  let oLastPosition

  if (debug) {
    log.output('Debug', 'Spawn location ' + oSpawn.pos, false, true)
  };

  // Put a container near each Source for energy harvesting.
  aSources.forEach(function (oSource) {
    if (debug) {
      log.output('Debug', 'Energy source location ' + oSource.pos, false, true)
    };

    // get the path from the spawn point to the source
    aPath = oRoom.findPath(oSpawn.pos, oSource.pos, {
      ignoreCreeps: true,
      range: 1
    })

    // log the found path for double checking
    aPath.forEach(function (oPosition) {
      if (debug) {
        log.output('Debug', oPosition.x + ' ' + oPosition.y, false, true)
      };
    })

    // Grab the last position of the calculated path. This is where we will want to put the container.
    oLastPosition = aPath[aPath.length - 1]

    if (debug) {
      log.output('Debug', 'Last step in the path cords ' + oLastPosition.x + ' ' + oLastPosition.y, false, true)
    };

    // Create a container at the target location
    oRoom.createConstructionSite(oLastPosition.x, oLastPosition.y, STRUCTURE_CONTAINER)
  })

  // Put a container near the Room controller for the upgraders to use.
  const aControllerPath = oRoom.findPath(oSpawn.pos, oRoom.controller.pos, {
    ignoreCreeps: true,
    range: 2
  })
  const oTargetContainerPosition = aControllerPath[aControllerPath.length - 1]
  oRoom.createConstructionSite(oTargetContainerPosition.x, oTargetContainerPosition.y, STRUCTURE_CONTAINER)

  // Record in the memory that this function has run so it doesn't use CPU every cycle.
  oRoom.memory.construction.RCL1 = true

  if (debug) {
    log.output('Debug', 'Add Construction for RCL1 routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time',
      false, true)
    log.output('Debug', 'End - Add Construction for RCL1', false, true)
  };
}
