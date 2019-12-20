"use strict"; // Declaring Strict Mode to enforce better coding standards

// Logic
//  Get Energy from Storage if available else get Energy from nearest Active Source
//  To Do: Update to pick up energy from the ground or from a Container near the source
//  Fill Spawners
//  Fill Towers
//  Fill Extensions
//  To Do: Fill the container near the Room Controller if one exists

// States
//  Determine which job to do
//  Grab Resources
//  Move to target
//  Deposit Resources

// Notes
// Each of the State functions are expecting the current Creep object and an 'Options' object with one of two properties (nextState or context)

// const _ = require('lodash');
const log = require('./helper_logging');
const myFunctions = require('helper_myFunctions');
const myConstants = require('./helper_constants');
const debug = false; // Turn logging for this module on and off
const moduleName = 'Logistics Local'
let timer = null;

module.exports = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (debug) {
      log.output('Debug', 'Begin - Role ' + moduleName + ' for ' + creep.name, true)
    };
    if (debug) {
      timer = Game.cpu.getUsed()
    };

    // Add starting transition state to the creep memory if it doesn't already exist
    if (!creep.memory.state) {
      creep.memory.state = myConstants.STATE_SPAWNING;
    };

    // Call the appropriate routine for the creep based on the current state
    switch (creep.memory.state) {
      case myConstants.STATE_SPAWNING:
        runSpawning(creep, {
          nextState: myConstants.STATE_MOVING
        });
        break;
      case myConstants.STATE_MOVING:
        runMoving(creep, {
          context: haulerContext
        });
        break;
      case myConstants.STATE_GRAB_RESOURCE:
        runGrabResource(creep, {
          nextState: myConstants.STATE_MOVING
        });
        break;
      case myConstants.STATE_DEPOSIT_RESOURCE:
        runDepositResource(creep, {
          nextState: myConstants.STATE_MOVING
        });
        break;
    };

    // Variables
    let energySource = null;
    let targets = null;
    let target = null;

    // If hauling mode is on and you are empty, turn off hauling mode
    if (creep.memory.hauling && creep.carry.energy == 0) {
      creep.memory.hauling = false;
      creep.say('🔄 refill');
    };

    // If hauling mode is off and you are full, turn on hauling mode
    if (!creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
      creep.memory.hauling = true;
      creep.say('🚧 hauling');
    };

    // If you are in refill mode, go get energy from Storage
    if (creep.memory.hauling == false) {
      if (creep.room.storage.store.energy > 5000) {
        energySource = creep.room.storage;
        myFunctions.withdrawEnergy(creep, energySource);

      } else {
        energySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        myFunctions.harvestEnergy(creep, energySource);

      };
    };

    // If you are in hauling mode go fill the spawner, extensions, and towers until you are empty
    if (creep.memory.hauling) {
      targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
      });

      if (targets.length > 0) {
        target = creep.pos.findClosestByPath(targets, {
          maxOps: 500
        });
        myFunctions.transferEnergy(creep, target)
      } else {
        creep.moveTo(Game.spawns["Spawn1"], {
          visualizePathStyle: {
            stroke: '#f2f210'
          }
        });
      };
    };

    if (debug) {
      log.output('Debug', 'Role ' + moduleName + ' took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false,
        true)
    };
    if (debug) {
      log.output('Debug', 'End - ' + moduleName)
    };

  },
};

/**
 * @param {Creep} creep
 * @param {object} options
 */
const runSpawning = function (creep, options) {
  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' Spawning routine for ' + creep.name, true)
  };
  const timer = Game.cpu.getUsed();

  // Once the creep finishes spawning we transition to the next state
  if (creep.spawning === false) {
    creep.memory.state = options.nextState;
    module.exports.run(creep); // Call the main run function so that the next state function runs straight away
    return; // We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
  };

  // Initialize the creep if that hasn't been done yet.
  if (!creep.memory.init) {
    // So that we know in the following ticks that it's already been initialized...
    creep.memory.init = true;
  };

  if (debug) {
    log.output('Debug', moduleName + ' Spawning routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false,
      true)
  };
  if (debug) {
    log.output('Debug', 'End - ' + moduleName + ' Spawning routine')
  };
};

const runMoving = function (creep, options) {

  if (debug) {
    log.output('Debug', 'Begin - ' + moduleName + ' Moving routine for ' + creep.name, true)
  };
  const timer = Game.cpu.getUsed();

  // This statement is shorthand for the function right below it. They are both here for clarity for now.
  // let transitionState = options.context ? haulerContext(creep, myConstants.STATE_MOVING).nextState : options.nextState;

  let transitionState = null;
  if (options.context) {
    transitionState = haulerContext(creep).nextState;
  } else {
    transitionState = options.nextState;
  };

  // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext().
  const destination = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos
    .roomName);

  // Has the creep arrived?
  if (creep.pos.getRangeTo(destination) <= 1) {
    creep.memory.state = transitionState;
    module.exports.run(creep);
  } else {
    // It hasn't arrived, so we get it to move to target position
    creep.moveTo(destination);
  };


  if (debug) {
    log.output('Debug', moduleName + ' Moving routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false,
      true)
  };
  if (debug) {
    log.output('Debug', 'End - ' + moduleName + ' Moving routine')
  };

};
