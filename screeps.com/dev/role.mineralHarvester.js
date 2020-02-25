'use strict' // Declaring Strict Mode to enforce better coding standards

/* global */

const myFunctions = require('./helper_myFunctions')
const myConstants = require('./helper_constants')
const log = require('./helper_logging')
const debug = true // Turn logging for this module on and off
const moduleName = 'Mineral Harvester'

module.exports = {
  /** @param {Creep} creep **/
  main: function (creep) {
    let timer = null
    if (debug) {
      log.output('Debug', 'Begin - Role ' + moduleName + ' for ' + creep.name, true)
      timer = Game.cpu.getUsed()
    };

    // Add transition state information to the creep memory if it doesn't already exist
    if (!creep.memory.state) {
      creep.memory.state = myConstants.STATE_SPAWNING
    };

    // Call the appropriate routine for the creep based on the current state
    switch (creep.memory.state) {
      case myConstants.STATE_SPAWNING:
        spawning(creep, {
          nextState: myConstants.STATE_MOVING
        })
        break
      case myConstants.STATE_MOVING:
        moving(creep, {
          nextState: myConstants.STATE_HARVESTING
        })
        break
      case myConstants.STATE_HARVESTING:
        harvesting(creep, {})
        break
    }

    if (debug) {
      log.output('Debug', 'Role ' + moduleName + ' took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false,
        true)
      log.output('Debug', 'End - Role ' + moduleName)
    };
  }
}

const spawning = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' Spawning routine for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  // Once the creep finishes spawning we transition to the next state
  if (!creep.spawning) {
    creep.memory.state = options.nextState
    // Call the main run function so that the next state function runs straight away
    module.exports.main(creep)
    return
  }

  if (!creep.memory.initDone) {
    creep.memory.mineralId = creep.room.mineral.id
    creep.memory.extractorId = creep.room.extractor.id

    if (creep.room.mineral.container) {
      const container = creep.room.mineral.container
      creep.memory.containerId = container.id
    } else {
      creep.memory.destination = (Game.getObjectById(creep.memory.mineralId)).pos
    }

    creep.memory.initDone = true
  }

  if (debug) {
    log.output('Debug', moduleName + ' Spawning routine took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' Spawning routine')
  }
}

const moving = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' moving function for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  };

  const target = Game.getObjectById(creep.memory.mineralId)

  // Sit on top of the container if there is one or within 1 of the mineral source if no container
  let destination = null
  let range = null
  if (creep.memory.containerId) {
    const container = Game.getObjectById(creep.memory.containerId)
    destination = container.pos
    range = 0
  } else {
    destination = target.pos
    range = 1
  };

  // Has the creep arrived?
  if (creep.pos.getRangeTo(destination) <= range) {
    creep.memory.state = options.nextState
    module.exports.main(creep)
  } else {
    // It hasn't arrived, so we get it to move to target position
    creep.moveTo(destination)
  }

  if (debug) {
    log.output('Debug', moduleName + ' moving function took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' moving routine')
  };
}

const harvesting = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' harvesting function for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  };

  // Make sure the extractor is off cooldown when we try to extract from the mineral
  const extractor = Game.getObjectById(creep.memory.extractorId)
  if (extractor.cooldown === 0) {
    if (debug) {
      log.output('Debug', 'Extracting minerals', false, true)
    }
    const source = Game.getObjectById(creep.memory.mineralId)
    myFunctions.harvestEnergy(creep, source)
  } else {
    if (debug) {
      log.output('Debug', 'Extractor is on cooldown for ' + extractor.cooldown + ' more ticks.', false, true)
    }
  }

  if (debug) {
    log.output('Debug', moduleName + ' harvesting function took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - Mineral Harvester Harvesting routine')
  };
}
