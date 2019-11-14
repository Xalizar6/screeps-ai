'use strict' // Declaring Strict Mode to enforce better coding standards

/* global _ */

const myFunctions = require('helper_myFunctions')
const log = require('./helper_logging')
const debug = false // Turn logging for this module on and off

module.exports = {

  /** @param {Creep} creep **/
  run: function (creep) {
    if (debug) {
      log.output('Debug', 'Begin - Role Dedicated Harvester for ' + creep.name, true)
    };
    if (debug) {
      var timer = Game.cpu.getUsed()
    };

    // Declare variables
    const aSourcesInMemory = creep.room.memory.sources
    let bCreepAlreadyAssigned = false
    let target = null

    /*
        11/14/2019 [DR]: deprecated but testing
        // Checking if the creep is about to die
        if (creep.ticksToLive > 5) {
          // Loop through the room sources stored in memory
          for (const i in aSourcesInMemory) {
            // Determine if the currently assigned harvester is alive - remove from memory if not alive.
            if (aSourcesInMemory[i].harvester && !Game.creeps[aSourcesInMemory[i].harvester]) {
              log.output('Event', 'Removing dead Harvester ' + aSourcesInMemory[i].harvester + ' from source.', false,
                true)
              delete aSourcesInMemory[i].harvester
            };

            // Determine if the creep is already assigned to a source
            if (aSourcesInMemory[i].harvester === creep.name) {
              // Give the creep the source object
              source = Game.getObjectById(aSourcesInMemory[i].id)
              bCreepAlreadyAssigned = true
            };
          };
     */

    // Checking if the creep is about to die
    if (creep.ticksToLive > 5) {
      // Loop through the room sources stored in memory
      _.forEach(aSourcesInMemory, (source, key) => {
        // Determine if the currently assigned harvester is alive - remove from memory if not alive.
        if (source.harvester && !Game.creeps[source.harvester]) {
          log.output('Event', 'Removing dead Harvester ' + source.harvester + ' from source.', false,
            true)
          delete source.harvester
        };

        // Determine if the creep is already assigned to a source
        if (source.harvester === creep.name) {
          // Give the creep the source object
          target = Game.getObjectById(key)
          bCreepAlreadyAssigned = true
        };
      })

      /*
            11/14/2019 [DR]: deprecated but testing
            // If the creep wasn't already assigned to a source, then find one to assign
            if (!bCreepAlreadyAssigned) {
              // Loop through the room sources stored in memory
              for (const i in aSourcesInMemory) {
                if (!aSourcesInMemory[i].harvester) {
                  // Assign the creep to the source
                  aSourcesInMemory[i].harvester = creep.name
                  log.output('Event', creep.name + ' is newly assigned to source ' + aSourcesInMemory[i].id, false, true)

                  // Give the creep the source object
                  target = Game.getObjectById(aSourcesInMemory[i].id)

                  // Exit the FOR loop so the creep isn't assigned to every available source
                  break
                };
              };
            };

       */

      // If the creep wasn't already assigned to a source, then find one to assign
      if (!bCreepAlreadyAssigned) {
        // Loop through the room sources stored in memory
        for (const key in aSourcesInMemory) {
          if (!aSourcesInMemory[key].harvester) {
            // Assign the creep to the source
            aSourcesInMemory[key].harvester = creep.name
            log.output('Event', creep.name + ' is newly assigned to source: ' + key, false, true)

            // Give the creep the source object
            target = Game.getObjectById(key)

            // Exit the FOR loop so the creep isn't assigned to every available source
            break
          };
        };
      };

      // Creep and Source are assigned, call the function to harvest energy
      myFunctions.harvestEnergy_v2(creep, target)
    } else {
      // Creep is about to die and we need to clear it's registration from the source.
      creep.say('dying')
      // Loop through the sources
      for (const i in aSourcesInMemory) {
        // Remove the creep's assignment to the source before it dies
        if (aSourcesInMemory[i].harvester === creep.name) {
          delete aSourcesInMemory[i].harvester
        };
      };
    };

    if (debug) {
      log.output('Debug', 'Role Dedicated Harvester took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false,
        true)
    };
    if (debug) {
      log.output('Debug', 'End - Role Dedicated Harvester')
    };
  }

}
