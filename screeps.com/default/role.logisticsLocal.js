"use strict"; // Declaring Strict Mode to enforce better coding standards

// Logic
//  Get Energy from Storage if available else get Energy from nearest Active Source
//  Fill Spawners
//  Fill Towers
//  Fill Extensions

// const _ = require( 'lodash' );
const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');
const debug = false; // Turn logging for this module on and off
let timer = null;

module.exports = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (debug) {
      log.output('Debug', 'Begin - Role Logistics Local for ' + creep.name, true)
    };
    if (debug) {
      timer = Game.cpu.getUsed()
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
      log.output('Debug', 'Role Logistics Local took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true)
    };
    if (debug) {
      log.output('Debug', 'End - Role Logistics Local')
    };

  },
};
