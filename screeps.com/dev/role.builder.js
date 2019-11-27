"use strict"; // Declaring Strict Mode to enforce better coding standards

// const _ = require( 'lodash' );
const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');
const debug = false; // Turn logging for this module on and off
let timer = null;

module.exports = {
  /** @param {Creep} creep **/
  run: function (creep) {

    if (debug) {
      log.output('Debug', 'Begin - Role Builder for ' + creep.name, true)
    };
    if (debug) {
      timer = Game.cpu.getUsed()
    };

    // Declare variables
    var aTargets;
    var energySource;
    var oSpawn = Game.spawns["Spawn1"]

    // If build mode is on and you are empty, turn off build mode
    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.say('🔄 refill');
    }

    // If build mode is off and you are full, turn on build mode
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
      creep.say('🚧 build');
    }

    // If build mode is on look for construction sites to build
    if (creep.memory.building) {
      aTargets = creep.room.find(FIND_CONSTRUCTION_SITES);

      // If you found construction sites work on the one furthest along
      if (aTargets.length > 0) {
        // let buildtarget = creep.pos.findClosestByPath( aTargets, { maxOps: 500 } );
        let buildtargets = _.sortByOrder(aTargets, ['progress'], ['desc']);
        if (debug) {
          log.output('Debug', 'Building at location ' + buildtargets[0].pos, false, true)
        };
        if (creep.build(buildtargets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(buildtargets[0], {
            visualizePathStyle: {
              stroke: '#2386ea'
            }
          });
        };

      } else {
        // If there are no more construction sites then
        // go hang out at the spawn point to be out of the way
        creep.moveTo(oSpawn);
      };

    } else {

      if (debug) {
        log.output('Debug', 'Getting Energy', false, true)
      };
      myFunctions.getEnergy_v3(creep);

      // If the room has a storage with enough energy, get energy from there
      // if ( creep.room.storage && creep.room.storage.store.energy > 5000 ) {
      //     energySource = creep.room.storage;
      //     myFunctions.withdrawEnergy( creep, energySource );

      // } else if ( creep.room.find( FIND_DROPPED_RESOURCES ).length > 0 ) {
      //     energySource = _.sortByOrder( creep.room.find( FIND_DROPPED_RESOURCES ), ['amount'], ['desc'] );
      //     if ( debug ) { log.output( 'Debug', 'Picking up energy on ground with ' + energySource[0].amount + ' energy', false, true ) };
      //     if ( debug ) { log.output( 'Debug', 'Energy source location ' + energySource[0].pos, false, true ) };
      //     myFunctions.pickupEnergy( creep, energySource[0] );

      // } else {
      //     // If there isn't a storage or the storage is low then get energy from a source
      //     energySource = creep.room.find( FIND_SOURCES_ACTIVE )[0];
      //     if ( debug ) { log.output( 'Debug', 'Picking up energy from source at ' + energySource.pos, false, false ) };
      //     myFunctions.harvestEnergy( creep, energySource );
      // };

    };

    if (debug) {
      log.output('Debug', 'Role Builder took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true)
    };
    if (debug) {
      log.output('Debug', 'End - Role Builder')
    };

  },
};
