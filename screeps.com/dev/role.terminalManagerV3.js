/*
    Logic
        Should only spawn if the terminal has more or less resources than it needs
            To Do: Build this into Spawncode
        Once spawned it should move resources between the terminal and room storage
        Values for how much should be in the terminal are stored in the Constants file

    States
        Spawning
        Dispatch
        Moving (to terminal / to storage)
        Grab Resources
        Deposit Resources
        Idle

*/

'use strict' // Declaring Strict Mode to enforce better coding standards

/* global _ RESOURCE_ENERGY RESOURCE_UTRIUM */

const log = require('./helper_logging')
const myConstants = require('./helper_constants')
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
  if (!creep.spawning) {
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
  if (!bTaskAssigned && energyInTerminal < desiredEnergyInTerminal && creep.isEmpty) {
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
  if (debug) {
    log.output('Debug', moduleName + ' Dispatch routine took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' Dispatch routine')
  }
}

const runMoving = function (creep, options) {
  let timer = null
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' moving function for ' + creep.name, true)
    timer = Game.cpu.getUsed()
  }

  // Declare Variables
  let destination = null
  let range = null
  let transitionState = null

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
  if (creep.pos.getRangeTo(destination.pos) === range + 1) {

    const status = creep.moveTo(destination.pos)
    if (debug) {
      log.output('Debug', 'MoveTo status = ' + status, false, true)
    };

    if (status === 0) {
      if (debug) {
        log.output('Debug', 'Will be in range of destination next tick', false, true)
      };
      creep.memory.state = transitionState
    } else {
      log.output('Debug', 'Unable to move this tick.', false, true)
    }

  } else if (creep.pos.getRangeTo(destination.pos) === range) {
    if (debug) {
      log.output('Debug', 'Already in range of destination', false, true)
    };
    creep.memory.state = transitionState
  } else {
    const status = creep.moveTo(destination.pos)

    if (debug) {
      log.output('Debug', 'MoveTo status = ' + status, false, true)
    };
    if (status === 0) {

      if (debug) {
        log.output('Debug', 'Moving closer to destination', false, true)
      };
    } else {
      if (debug) {
        log.output('Debug', 'Unable to move this tick.', false, true)
      };
    }
  };

  if (debug) {
    log.output('Debug', moduleName + ' moving function took: ' + (Game.cpu.getUsed() - timer) +
      ' CPU Time', false, true)
    log.output('Debug', 'End - ' + moduleName + ' moving function')
  }
}

const runGrabResource = function (creep) {
  if (debug) {
    log.output('Debug', 'Begin - Run Grab Resources routine for ' + creep.name, true)
  };
  const timer = Game.cpu.getUsed()

  const creepMemory = creep.memory.command

  // Determine your pickup target
  const source = Game.getObjectById(creepMemory.destinationID)

  // Determine which resource to pick up
  const resource = creepMemory.resourceType

  // Pick up the resource
  if (source.store[resource] >= creep.carryCapacity && _.sum(creep.carry) < creep.carryCapacity) {
    const withdrawStatus = creep.withdraw(source, resource)
    if (debug) {
      log.output('Debug', 'Creep withdrew ' + resource + ' with a status of ' + withdrawStatus, false, true)
    };
    creep.memory.state = myConstants.STATE_DISPATCH
  };

  if (debug) {
    log.output('Debug', 'Run Grab Resources routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true)
  };
  if (debug) {
    log.output('Debug', 'End - Run Grab Resources routine')
  };
}

const runDepositResource = function (creep) {
  if (debug) {
    log.output('Debug', 'Begin - Run Deposit Resources routine for ' + creep.name, true)
  };
  const timer = Game.cpu.getUsed()

  const creepMemory = creep.memory.command

  // Determine your deposit target
  const destination = Game.getObjectById(creepMemory.destinationID)

  // Determine which resource to deposit
  const resource = creepMemory.resourceType

  // Deposit the resource
  const depositStatus = creep.transfer(destination, resource)
  creep.memory.state = myConstants.STATE_DISPATCH

  if (debug) {
    log.output('Debug', 'Transferred ' + resource + ' to ' + destination + ' with a status of ' + depositStatus,
      false, true)
  };

  if (debug) {
    log.output('Debug', 'Run Deposit Resources routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false,
      true)
  };
  if (debug) {
    log.output('Debug', 'End - Run Deposit Resources routine')
  };
}

const runIdle = function (creep) {
  if (debug) {
    log.output('Debug', 'Idle, waiting for work', false, true)
  };
}
