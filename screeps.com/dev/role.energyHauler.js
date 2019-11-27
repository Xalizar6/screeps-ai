/* global FIND_DROPPED_RESOURCES FIND_MY_STRUCTURES STRUCTURE_EXTENSION FIND_STRUCTURES STRUCTURE_CONTAINER RESOURCE_ENERGY */

'use strict' // Declaring Strict Mode to enforce better coding standards

// Purpose:
//  To move energy from near the Energy sources to the Spawners, Extensions, Container near the room controller, and Storage.

// Logic
//  Remove old haulers from Memory
//  Assign self to a Source to haul from
//  Pick up dropped resources else get from the container
//  Drop off energy at the locations mentioned above
//  Remove self as the hauler from the energy sources before death

// const _ = require('lodash')
const myFunctions = require('helper_myFunctions')
const log = require('./helper_logging')
const debug = false // Turn logging for this module on and off
let timer = null

module.exports = {

  /** @param {Creep} creep **/
  run: function (creep) {
    if (debug) {
      log.output('Debug', 'Begin - Role Logistics Short Range for ' + creep
        .name, true)
    };
    if (debug) {
      timer = Game.cpu.getUsed()
    };

    // Declare Variables
    const aSourcesInMemory = creep.room.memory.sources
    let target = null
    let aDroppedResources = null
    let oEnergySource = null
    let oPickupContainer = null
    let bCreepAlreadyAssigned = false
    const oSpawn = Game.spawns['Spawn1']

    // Clear dead creeps from Source assignments
    // To Do: Move to main? Move to Memory Initialization?
    _.forEach(aSourcesInMemory, function (oSource) {
      // If a hauler is assigned to the energy source but not found in the Game.creeps array then unassign
      if (oSource.hauler && !Game.creeps[oSource.hauler]) {
        log.output('Event', 'Removing dead Hauler ' + oSource.hauler +
          ' from source. ' + oSource.id, false, true)
        delete oSource.hauler
      };
    })

    // If hauling mode is on and creep is empty, turn off hauling mode
    if (creep.memory.hauling && creep.carry.energy === 0) {
      creep.memory.hauling = false
      creep.say('🔄 refill')
    };

    // If hauling mode is off and creep is full, turn on hauling mode
    if (!creep.memory.hauling && creep.carry.energy === creep
      .carryCapacity) {
      creep.memory.hauling = true
      creep.say('🚧 hauling')
    };

    // If creep is empty, identify the assigned source to pickup near
    if (!creep.memory.hauling) {
      if (debug) {
        log.output('Debug', 'In refill mode', false, true)
      };

      // Loop through the energy sources in the room's memory and see if this creep is assigned to one
      // Set the ID as the creep's Energy Source ID
      _.forEach(aSourcesInMemory, function (oSource, key) {
        if (oSource.hauler === creep.name) {
          // Give the creep the source object id
          oEnergySource = Game.getObjectById(key)
          bCreepAlreadyAssigned = true

          // Assign the container if there is one near the source
          if (oSource.containerID) {
            oPickupContainer = Game.getObjectById(oSource.containerID)
          };
        };
      })

      // If not already assigned to an energy source, loop through the energy sources until you find one that needs a hauler
      // Set the ID as the creep's Energy Source ID.
      if (!bCreepAlreadyAssigned) {
        // Loop through the room sources stored in memory
        for (const i in aSourcesInMemory) {
          if (!aSourcesInMemory[i].hauler) {
            // Assign the creep to the source
            aSourcesInMemory[i].hauler = creep.name

            // Give the creep the source object
            oEnergySource = Game.getObjectById(aSourcesInMemory[i].id)
            if (debug) {
              log.output('Debug', 'Assigned energy source: ' + oEnergySource
                .id, false, true)
            };

            // Assign the container if there is one near the source
            if (aSourcesInMemory[i].containerID) {
              oPickupContainer = Game.getObjectById(aSourcesInMemory[i]
                .containerID)
              if (debug) {
                log.output('Debug', 'Assigned pickup container: ' +
                  oPickupContainer.id, false, true)
              };
            };

            // Exit the FOR loop so the creep isn't assigned to every available source
            break
          };
        };
      };

      // Once assigned to an energy source look for dropped resources nearby to it
      aDroppedResources = creep.room.find(FIND_DROPPED_RESOURCES)
      for (const i in aDroppedResources) {
        if (aDroppedResources[i].pos.isNearTo(oEnergySource) &&
          aDroppedResources[i].amount > 20) {
          target = aDroppedResources[i]

          // Go pick up the dropped resources
          if (debug) {
            log.output('Debug', 'Picking up dropped resource at pos: ' +
              aDroppedResources[i].pos, false, true)
          };
          myFunctions.pickupEnergy(creep, target)
        };
      };

      if (target == null && oPickupContainer !== null) {
        if (debug) {
          log.output('Debug', 'Picking up from container: ' +
            oPickupContainer.id, false, true)
        };
        myFunctions.withdrawEnergy(creep, oPickupContainer)
      };
    } else {
      // Creep is full so go drop off
      if (debug) {
        log.output('Debug', 'In dropoff mode', false, true)
      };

      // Check if Spawn needs energy
      let drop = null
      if (drop == null) {
        if (oSpawn.energy < oSpawn.energyCapacity) {
          drop = oSpawn
          if (debug) {
            log.output('Debug', 'Dropping off at spawn', false, true)
          };
        };
      };

      // Check if extensions need energy
      if (drop == null) {
        let extensions = creep.room.find(FIND_MY_STRUCTURES, {
          // filter: { structureType: STRUCTURE_EXTENSION }
          filter: (i) => i.structureType === STRUCTURE_EXTENSION && i
            .energy < i.energyCapacity
        })
        if (extensions.length > 0) {
          extensions = _.sortByOrder(extensions, ['energy'], ['asc'])
          drop = extensions[0]
          if (debug) {
            log.output('Debug', 'Dropping off at extensions', false, true)
          };
        };
      };

      // Check if the container near the Room Controller needs energy
      if (drop == null) {
        // If there is no container near the controller in memory then add it if it exists.
        if (!creep.memory.containerNearControllerID) {
          const containersNearController = creep.room.controller.pos
            .findInRange(FIND_STRUCTURES, 3, {
              filter: {
                structureType: STRUCTURE_CONTAINER
              }
            })
          if (containersNearController.length) {
            creep.memory.containerNearControllerID =
              containersNearController[0].id
          } else {
            creep.memory.containerNearControllerID = null
          };
        };

        if (creep.memory.containerNearControllerID !== null) {
          const container = Game.getObjectById(creep.memory
            .containerNearControllerID)
          if (container && container.store[RESOURCE_ENERGY] < 1800) {
            drop = container
          };
        };
      };

      // Otherwise if there is Storage drop off there
      if (drop == null) {
        if (creep.room.storage) {
          if (debug) {
            log.output('Debug', 'Dropping off at storage', false, true)
          };
          drop = creep.room.storage
        };
      };

      // If a drop target was set then drop it there
      if (drop != null) {
        myFunctions.transferEnergy(creep, drop)
      } else {
        if (debug) {
          log.output('Debug', 'No drop target set', false, true)
        };
      };
    };

    // Unregister the creep from the source in memory before it dies
    if (creep.ticksToLive <= 5) {
      creep.say('dying')

      // Loop through the sources
      for (const i in aSourcesInMemory) {
        // Remove the creep's assignment to the source before it dies
        if (aSourcesInMemory[i].hauler === creep.name) {
          delete aSourcesInMemory[i].hauler
        };
      };
    };

    if (debug) {
      log.output('Debug', 'Role Logistics Short Range took: ' + (Game.cpu
        .getUsed() - timer) + ' CPU Time', false, true)
    };
    if (debug) {
      log.output('Debug', 'End - Role Logistics Short Range')
    };
  }
}
