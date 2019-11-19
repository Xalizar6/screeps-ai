'use strict' // Declaring Strict Mode to enforce better coding standards

/* global RoomPosition */

const myFunctions = require('./helper_myFunctions')
const myConstants = require('./helper_constants')
const log = require('./helper_logging')
const debug = false // Turn logging for this module on and off
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
  };

  // Once the creep finishes spawning we transition to the next state
  if (!creep.spawning) {
    creep.memory.state = options.nextState
    // module.exports.run( creep ); // Call the main run function so that the next state function runs straight away
    this.main(creep)
    return
  };

  if (!creep.memory.initDone) {
    // Store the mineral source ID in the creep's memory. The source is taken from room memory.
    creep.memory.source = {}
    creep.memory.source.id = creep.room.memory.minerals[0].id

    // Store the target position of the container near the mineral source in creep memory OR
    // store the target position of the mineral source in creep memory.  Both are taken from the room memory.
    if (creep.room.memory.minerals[0].containerID) {
      creep.memory.source.containerID = creep.room.memory.minerals[0].containerID
      creep.memory.targetPos = Game.getObjectById(creep.room.memory.minerals[0].containerID).pos
    } else {
      creep.memory.targetPos = Game.getObjectById(creep.room.memory.minerals[0].id).pos
    };

    // Store the Extractor ID that is built on the Mineral Source in Memory so we can monitor the cooldown timer.
    if (creep.room.memory.minerals[0].extractorID) {
      creep.memory.source.extractorID = creep.room.memory.minerals[0].extractorID
    };

    // So that we know in the following ticks that it's already been initialized...
    creep.memory.initDone = true
  };

  if (debug) {
    log.output('Debug', 'Mineral Harvester Spawning routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time',
      false, true)
  };
  if (debug) {
    log.output('Debug', 'End - Mineral Harvester Spawning routine')
  };
}

const moving = function (creep, options) {
  if (debug) {
    log.output('Debug', 'Begin - Mineral Harvester Moving routine for ' + creep.name, true)
  };
  const timer = Game.cpu.getUsed()

  const pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName)

  // Sit on top of the container if there is one or within 1 of the mineral source if no container
  let range = null
  if (creep.memory.source.containerID) {
    range = 0
  } else {
    range = 1
  };

  // Has the creep arrived?
  if (creep.pos.getRangeTo(pos) <= range) {
    creep.memory.state = options.nextState
    module.exports.run(creep)
  } else {
    // It hasn't arrived, so we get it to move to target position
    creep.moveTo(pos)
  };

  if (debug) {
    log.output('Debug', 'Mineral Harvester Moving routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false,
      true)
  };
  if (debug) {
    log.output('Debug', 'End - Mineral Harvester Moving routine')
  };
}

const harvesting = function (creep, options) {
  if (debug) {
    log.output('Debug', 'Begin - Mineral Harvester Harvesting routine for ' + creep.name, true)
  };
  const timer = Game.cpu.getUsed()

  // Make sure the extractor is off cooldown when we try to extract from the mineral
  const extractor = Game.getObjectById(creep.memory.source.extractorID)
  if (extractor.cooldown === 0) {
    const source = Game.getObjectById(creep.memory.source.id)
    myFunctions.harvestEnergy(creep, source)
  };

  if (debug) {
    log.output('Debug', 'Mineral Harvester Harvesting routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time',
      false, true)
  };
  if (debug) {
    log.output('Debug', 'End - Mineral Harvester Harvesting routine')
  };
}
