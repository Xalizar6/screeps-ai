'use strict' // Declaring Strict Mode to enforce better coding standards

/* global _ RESOURCE_ENERGY RESOURCE_UTRIUM OK */
const log = require('./helper_logging')
const myConstants = require('./helper_constants')
const myFunctions = require('./helper_myFunctions')
const debug = true // Turn logging for this module on and off
const moduleName = 'Terminal Manager V3'

module.exports = {

  run: function (creep) {
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
        runSpawning(creep)
        break
      case myConstants.STATE_DISPATCH:
        runDispatch(creep)
        break
      case myConstants.STATE_MOVING:
        runMoving(creep)
        break
      case myConstants.STATE_GRAB_RESOURCE:
        runGrabResource(creep)
        break
      case myConstants.STATE_DEPOSIT_RESOURCE:
        runDepositResource(creep)
        break
      case myConstants.STATE_IDLE:
        runIdle(creep)
    };

    if (debug) {
      log.output('Debug', 'Role ' + moduleName + ' took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false,
        true)
      log.output('Debug', 'End - Role ' + moduleName)
    };
  }
}

const runSpawning = function (creep) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' Spawning routine for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  // Once the creep finishes spawning we transition to the next state
  if (checkIfFinalSpawnTick(creep) || !creep.spawning) {
    creep.memory.state = myConstants.STATE_DISPATCH
    // module.exports.run(creep) // Call the main run function so that the next state function runs straight away
    return // We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
  };

  // Initialize the creep if that hasn't been done yet.
  if (!creep.memory.initDone) {
    creep.memory.command = {}
    creep.memory.initDone = true
  };

  if (debug) {
    log.output('Debug', moduleName + ' Spawning routine took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' Spawning routine')
  }
}

const runDispatch = (creep) => {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' Dispatch routine for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  // Declare Variables
  const terminal = creep.room.terminal
  const storage = creep.room.storage
  const energyInTerminal = terminal.store[RESOURCE_ENERGY]
  const energyInStorage = storage.store[RESOURCE_ENERGY]
  const desiredEnergyInTerminal = myConstants.TERMINAL_ENERGY_STORAGE_TARGET
  const desiredUtriumInTerminal = myConstants.TERMINAL_UTRIUM_STORAGE_TARGET
  const desiredEnergyInStorage = myConstants.STORAGE_ENERGY_STORAGE_TARGET
  const creepMemory = creep.memory.command
  let utriumInTerminal = null
  let bTaskAssigned = false

  if (terminal.store[RESOURCE_UTRIUM]) {
    utriumInTerminal = terminal.store[RESOURCE_UTRIUM]
  } else {
    utriumInTerminal = 0
  };

  // If Energy in the terminal is low and the creep is not full then set destinationID to Storage and transition to Grab Resources
  if (!bTaskAssigned && energyInTerminal < desiredEnergyInTerminal && energyInStorage > desiredEnergyInStorage && creep.isEmpty) {
    if (debug) {
      log.output('Debug', 'Setting task to pick up Energy to add to Terminal', false, true)
    };
    creepMemory.destinationID = storage.id
    creepMemory.range = 1
    creepMemory.resourceType = RESOURCE_ENERGY
    creepMemory.nextState = myConstants.STATE_GRAB_RESOURCE
    creep.memory.state = myConstants.STATE_MOVING
    bTaskAssigned = true
  };

  // If Energy in the terminal is low and carrying energy set Destination to Terminal and transition to Deposit Resources
  if (!bTaskAssigned && energyInTerminal < desiredEnergyInTerminal && creep.carry[RESOURCE_ENERGY]) {
    if (debug) {
      log.output('Debug', 'Setting task to add Energy to Terminal', false, true)
    };
    creepMemory.destinationID = terminal.id
    creepMemory.range = 1
    creepMemory.resourceType = RESOURCE_ENERGY
    creepMemory.nextState = myConstants.STATE_DEPOSIT_RESOURCE
    creep.memory.state = myConstants.STATE_MOVING
    bTaskAssigned = true
  };

  // If Utrium in the terminal is low and the creep is not full then set Destination to Storage and transition to Grab Resources
  if (!bTaskAssigned && utriumInTerminal < desiredUtriumInTerminal && creep.isEmpty) {
    if (debug) {
      log.output('Debug', 'Setting task to pick up Utrium to add to Terminal', false, true)
    };
    creepMemory.destinationID = storage.id
    creepMemory.range = 1
    creepMemory.resourceType = RESOURCE_UTRIUM
    creepMemory.nextState = myConstants.STATE_GRAB_RESOURCE
    creep.memory.state = myConstants.STATE_MOVING
    bTaskAssigned = true
  };

  // If Utrium in the terminal is low and carrying Utrium set Destination to Terminal and transition to Deposit Resources
  if (!bTaskAssigned && utriumInTerminal < desiredUtriumInTerminal && creep.carry[RESOURCE_UTRIUM]) {
    if (debug) {
      log.output('Debug', 'Setting task to add Utrium to Terminal', false, true)
    };
    creepMemory.destinationID = terminal.id
    creepMemory.range = 1
    creepMemory.resourceType = RESOURCE_UTRIUM
    creepMemory.nextState = myConstants.STATE_DEPOSIT_RESOURCE
    creep.memory.state = myConstants.STATE_MOVING
    bTaskAssigned = true
  };

  // Do nothing
  if (!bTaskAssigned) {
    creepMemory.destinationID = terminal.id
    creepMemory.range = 1
    creepMemory.resourceType = null
    creepMemory.nextState = myConstants.STATE_DISPATCH
    creep.memory.state = myConstants.STATE_IDLE
  }

  if (debug) {
    log.output('Debug', moduleName + ' Dispatch routine took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' Dispatch routine', false, true)
  }
}

const runMoving = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' Moving routine for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  // Declare Variables
  let destination = null
  let range = null
  let transitionState = null
  let result = null

  // Fill variables from info in the memory
  destination = Game.getObjectById(creep.memory.command.destinationID)
  range = creep.memory.command.range
  transitionState = creep.memory.command.nextState

  if (debug) {
    log.output('Debug', 'Destination = ' + destination, false, true)
    log.output('Debug', 'Range = ' + range, false, true)
    log.output('Debug', 'TransitionState = ' + transitionState, false, true)
  };

  // Check if you've arrived at the destination and transition to the next state
  //   or
  // Move closer to the Destination
  switch (creep.pos.getRangeTo(destination.pos)) {
    case range + 1:
      result = creep.moveTo(destination.pos)

      if (result === OK) {
        creep.memory.state = transitionState
        if (debug) {
          log.output('Debug', 'Status: Will be in range of destination next tick, transitioning to next STATE', false, true)
        };
      } else {
        if (debug) {
          log.output('Debug', 'Status: Failed move command: (' + myFunctions.getGlobalKeyByValue(result) + ')', false, true)
        };
      }
      break

    case range:
      creep.memory.state = transitionState
      if (debug) {
        log.output('Debug', 'Status: Already in range of destination, transitioning to next STATE', false, true)
      };
      break

    default:
      result = creep.moveTo(destination.pos)

      if (result === OK) {
        if (debug) {
          log.output('Debug', 'Status: Moving closer to destination', false, true)
        };
      } else {
        if (debug) {
          log.output('Debug', 'Status: Failed move command: (' + myFunctions.getGlobalKeyByValue(result) + ')', false, true)
        };
      }
      break
  }

  if (debug) {
    log.output('Debug', moduleName + ' Moving routine took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' Moving function', false, true)
  }
}

const runGrabResource = function (creep) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' GrabResource routine for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  const creepMemory = creep.memory.command

  // Determine your pickup target
  const source = Game.getObjectById(creepMemory.destinationID)

  // Determine which resource to pick up
  const resource = creepMemory.resourceType

  // Pick up the resource
  if (source.store[resource] >= creep.carryCapacity && _.sum(creep.carry) < creep.carryCapacity) {
    const result = creep.withdraw(source, resource)
    if (debug) {
      log.output('Debug', 'Creep withdrew ' + resource + ' with a status of ' + myFunctions.getGlobalKeyByValue(result), false, true)
    };
    creep.memory.state = myConstants.STATE_DISPATCH
  };

  if (debug) {
    log.output('Debug', moduleName + ' GrabResource routine took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' GrabResource routine')
  }
}

const runDepositResource = function (creep) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' DepositResource routine for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  const creepMemory = creep.memory.command

  // Determine your deposit target
  const destination = Game.getObjectById(creepMemory.destinationID)

  // Determine which resource to deposit
  const resource = creepMemory.resourceType

  // Deposit the resource
  const result = creep.transfer(destination, resource)
  creep.memory.state = myConstants.STATE_DISPATCH

  if (debug) {
    log.output('Debug', 'Transferred ' + resource + ' to ' + destination + ' with a status of ' + myFunctions.getGlobalKeyByValue(result),
      false, true)
  };

  if (debug) {
    log.output('Debug', moduleName + ' DepositResource routine took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' DepositResource routine')
  }
}

const runIdle = function (creep) {
  if (debug) {
    log.output('Debug', 'Idle, waiting for work', false, true)
  };
  if (Game.time % 25 === 0) {
    creep.memory.state = creep.memory.command.nextState
  }
}

/** Allows us to transition to the next STATE immediately upon spawning rather than 1 tick after spawning
 * @param {Creep} creep - The creep being spawned
 */
function checkIfFinalSpawnTick (creep) {
  let bReturnValue = false
  _.forOwn(Game.spawns, function (spawn, key) {
    if (spawn.room.name === creep.room.name && spawn.spawning) {
      if (spawn.spawning.name === creep.name && spawn.spawning.remainingTime === 1) {
        bReturnValue = true
      }
    }
  })
  return bReturnValue
}
