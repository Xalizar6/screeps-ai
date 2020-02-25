'use strict' // Declaring Strict Mode to enforce better coding standards

/* global _ */

const myFunctions = require('./helper_myFunctions')
const myConstants = require('./helper_constants')
const log = require('./helper_logging')
const debug = false // Turn logging for this module on and off
const moduleName = 'Dedicated Harvester'

module.exports = {
  /** @param {Creep} creep **/
  main: function (creep) {
    let timer = null
    if (debug) {
      log.output('Debug', 'Begin - Role ' + moduleName + ' for ' + creep.name, true)
      timer = Game.cpu.getUsed()
    };

    if (!creep.memory.state) {
      creep.memory.state = myConstants.STATE_SPAWNING
    };

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
    }
  }
}

const spawning = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' Spawning routine for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  if (!creep.spawning) {
    creep.memory.state = options.nextState
    // Call the main function so that the next state happens immediately rather than next tick.
    module.exports.main(creep)
    return
  }

  if (!creep.memory.initDone) {
    assignEnergySource(creep)
    creep.memory.initDone = true
  }

  if (debug) {
    log.output('Debug', moduleName + ' Spawning routine took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' Spawning routine')
  }
}

const assignEnergySource = function (creep) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' assignEnergySource function for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  const roomSources = creep.room.sources
  const dedicatedHarvesters = _.filter(Game.creeps, function (e) {
    return e.memory.role === 'dedicatedHarvester'
  })

  for (const i in roomSources) {
    const sourceID = roomSources[i].id
    const sourceContainerID = roomSources[i].memory.containerID
    let bSourceAssignedToCreep = false

    dedicatedHarvesters.forEach(function (x) {
      const assignedEnergySourceID = x.memory.energySource
      if (sourceID === assignedEnergySourceID) {
        bSourceAssignedToCreep = true
      }
    })

    if (!bSourceAssignedToCreep) {
      creep.memory.energySource = sourceID
      log.output('Event', creep.name + ' is newly assigned to source: ' + sourceID, false, true)
      if (sourceContainerID) {
        creep.memory.containerID = sourceContainerID
      }
      break
    }
  }
  if (debug) {
    log.output('Debug', moduleName + ' assignEnergySource function took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' assignEnergySource')
  }
}

const moving = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' moving function for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  if (debug) {
    log.output('Debug', 'Creep memory energySource: ' + creep.memory.energySource, false, true)
  }

  const target = Game.getObjectById(creep.memory.energySource)

  if (debug) {
    log.output('Debug', 'target: ' + target, false, true)
  }

  let destination = null
  let range = null
  if (creep.memory.containerID) {
    const container = Game.getObjectById(creep.memory.containerID)
    destination = container.pos
    range = 0
  } else {
    destination = target.pos
    range = 1
  }

  // Has the creep arrived?
  if (creep.pos.getRangeTo(destination) <= range) {
    creep.memory.state = options.nextState
    module.exports.main(creep)
  } else {
    // It hasn't arrived, so we get it to move to target position
    creep.moveTo(destination)
  };

  if (debug) {
    log.output('Debug', moduleName + ' moving function took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' moving function')
  }
}

const harvesting = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' harvesting function for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  const target = Game.getObjectById(creep.memory.energySource)
  myFunctions.harvestEnergy(creep, target)

  if (debug) {
    log.output('Debug', moduleName + ' harvesting function took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' harvesting function')
  }
}
