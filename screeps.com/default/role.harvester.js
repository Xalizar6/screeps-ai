"use strict"; // Declaring Strict Mode to enforce better coding standards

// const _ = require( 'lodash' );
const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');
const debug = false; // Turn logging for this module on and off

module.exports = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (debug) {
      log.output('Debug', 'Begin - Role Harvester for ' + creep.name, true)
    };
    let timer1 = Game.cpu.getUsed();

    // Variables
    let target = null;
    let source = null;
    let drop = null;
    const oSpawn = Game.spawns['Spawn1']

    // Check if extensions need energy
    if (drop == null) {
      let extensions = creep.room.find(FIND_MY_STRUCTURES, {
        // filter: { structureType: STRUCTURE_EXTENSION }
        filter: (i) => i.structureType == STRUCTURE_EXTENSION && i.energy < i.energyCapacity
      });
      if (extensions.length > 0) {
        // @ts-ignore
        extensions = _.sortByOrder(extensions, ['energy'], ['asc']);
        drop = extensions[0];
        if (debug) {
          log.output('Debug', 'Dropping off at extensions', false, true)
        };
      };
    };

    // Check if Spawn needs energy
    if (drop == null) {
      if (oSpawn.energy < oSpawn.energyCapacity) {
        drop = oSpawn;
        if (debug) {
          log.output('Debug', 'Dropping off at spawn', false, true)
        };
      };
    };

    // Otherwise if there is Storage drop off there
    if (drop == null) {
      if (creep.room.storage) {
        if (debug) {
          log.output('Debug', 'Dropping off at storage', false, true)
        };
        drop = creep.room.storage;
      };
    };

    // If you don't have full energy, go find a source and fill up.
    if (creep.carry.energy < creep.carryCapacity) {
      source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
        maxOps: 500
      });
      myFunctions.harvestEnergy(creep, source);
    } else {
      // If a drop target was set then drop it there
      if (drop != null) {
        myFunctions.transferEnergy(creep, drop)
      } else {
        if (debug) {
          log.output('Debug', 'No drop target set', false, true)
        };
      };
    };

    if (debug) {
      log.output('Debug', 'Role Harvester took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time', true, true)
    };
    if (debug) {
      log.output('Debug', 'End - Role Harvester')
    };

  },

};
