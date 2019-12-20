'use strict' // Declaring Strict Mode to enforce better coding standards

/* global _ */

const log = require('./helper_logging')
const myConstants = require('./helper_constants')
const debug = false // Turn logging for this module on and off
const moduleName = 'Mineral Hauler'

module.exports = {

  main: function (creep) {
    let timer = null
    if (debug) {
      log.output('Debug', 'Begin - Role ' + moduleName + ' for ' + creep.name, true)
      timer = Game.cpu.getUsed()
    };

    // Add starting transition state to the creep memory if it doesn't already exist
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
          context: haulerContext(creep)
        })
        break
      case myConstants.STATE_GRAB_RESOURCE:
        grabResource(creep, {
          nextState: myConstants.STATE_MOVING
          //   context: haulerContext(creep)
        })
        break
      case myConstants.STATE_DEPOSIT_RESOURCE:
        depositResource(creep, {
          nextState: myConstants.STATE_MOVING
          //   context: haulerContext(creep)
        })
        break
    };

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
    module.exports.main(creep)
    return
  }

  if (!creep.memory.initDone) {
    if (creep.room.mineral.container) {
      creep.memory.containerId = creep.room.mineral.container.id
      creep.memory.destination = creep.room.mineral.container.pos
    } else {
      creep.memory.destination = creep.room.mineral.pos
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
  }

  // This statement is shorthand for the if statement right below it. They are both here for clarity for now.
  // let transitionState = options.context ? haulerContext(creep, myConstants.STATE_MOVING).nextState : options.nextState;
  let transitionState = null
  if (options.context) {
    transitionState = options.context.nextState
  } else {
    transitionState = options.nextState
  }

  // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext().
  const destination = creep.memory.destination

  // Has the creep arrived?
  if (creep.pos.getRangeTo(destination) <= 1) {
    creep.memory.state = transitionState
    module.exports.main(creep)
  } else {
    // It hasn't arrived, so we get it to move to target position
    creep.moveTo(destination)
  }

  if (debug) {
    log.output('Debug', moduleName + ' moving function took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' moving routine')
  }
}

const grabResource = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' grabResource function for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  const container = Game.getObjectById(creep.memory.containerId)
  if (container.store.getUsedCapacity() >= creep.store.getCapacity()) {
    _.forOwn(container.store, function (value, key) {
      if (debug) {
        log.output('Debug', 'Amount of ' + key + ' in the container: ' + value, false, true)
      }
      const withdrawStatus = creep.withdraw(container, key)
      if (debug) {
        log.output('Debug', 'Creep.Withdraw() status: ' + withdrawStatus, false, true)
      }
    })
  }

  if (creep.isFull) {
    if (debug) {
      log.output('Debug', 'Creep going to unload', false, true)
    }
    creep.memory.state = options.nextState
    module.exports.main(creep)
  }

  if (debug) {
    log.output('Debug', moduleName + ' grabResource routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time',
      false, true)
    log.output('Debug', 'End - ' + moduleName + 'grabResource routine')
  }
}

const depositResource = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' depositResource routine for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  if (creep.room.storage) {
    const storage = creep.room.storage
    for (const resourceType in creep.store) {
      creep.transfer(storage, resourceType)
      if (debug) {
        log.output('Debug', 'Transferred ' + creep.store[resourceType] + ' ' + resourceType + ' to storage', false,
          true)
      }
    }
  }

  if (creep.isEmpty) {
    if (debug) {
      log.output('Debug', 'Creep going to pickup', false, true)
    }
    creep.memory.state = options.nextState
    module.exports.main(creep)
  }

  if (debug) {
    log.output('Debug', moduleName + ' depositResource routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time',
      false, true)
    log.output('Debug', 'End - ' + moduleName + ' depositResource routine')
  }
}

const haulerContext = function (creep) {
  if (creep.store.getUsedCapacity() > 0) {
    creep.memory.destination = creep.room.storage.pos
    return {
      nextState: myConstants.STATE_DEPOSIT_RESOURCE
    }
  } else {
    if (creep.memory.containerId) {
      creep.memory.destination = creep.room.mineral.container.pos
    } else {
      creep.memory.destination = creep.room.mineral.pos
    }
    return {
      nextState: myConstants.STATE_GRAB_RESOURCE
    }
  }
}
