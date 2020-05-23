/* global _ ERR_NOT_IN_RANGE RESOURCE_ENERGY FIND_STRUCTURES STRUCTURE_CONTAINER FIND_DROPPED_RESOURCES FIND_SOURCES_ACTIVE */

'use strict' // Declaring Strict Mode to enforce better coding standards
// const _ = require('lodash')
const log = require('./helper_logging')
const myConstants = require('./helper_constants')
const debug = false // Turn logging for this module on and off

module.exports = {

  /** @param {Creep} creep **/
  harvestEnergy: function (creep, source) {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, {
        visualizePathStyle: {
          stroke: '#f2f210'
        }
      })
    };
  },

  /** @param {Creep} creep **/
  transferEnergy: function (creep, transferTarget) {
    if (creep.transfer(transferTarget, RESOURCE_ENERGY) ===
      ERR_NOT_IN_RANGE) {
      creep.moveTo(transferTarget, {
        visualizePathStyle: {
          stroke: '#f2f210'
        }
      })
    };
  },

  /** @param {Creep} creep **/
  withdrawEnergy: function (creep, energySource) {
    if (creep.withdraw(energySource, RESOURCE_ENERGY) ===
      ERR_NOT_IN_RANGE) {
      creep.moveTo(energySource, {
        visualizePathStyle: {
          stroke: '#2386ea'
        }
      })
    };
  },

  /** @param {Creep} creep **/
  pickupEnergy: function (creep, target) {
    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: {
          stroke: '#f2f210'
        }
      })
    };
  },

  /** @param {Creep} creep **/
  getEnergy_v3: function (creep) {
    if (debug) {
      log.output('Debug', 'Begin - getEnergy_v3 for ' + creep.name, false,
        true)
    };

    const oStorage = creep.room.storage
    const nMinEnergyInStorage = myConstants.STORAGE_ENERGY_STORAGE_TARGET
    let oEnergySource = null

    if (creep.memory.role === 'upgrader') {
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

      if (creep.memory.containerNearControllerID) {
        const container = Game.getObjectById(creep.memory
          .containerNearControllerID)
        if (container && container.store[RESOURCE_ENERGY] > 0) {
          oEnergySource = container
          this.withdrawEnergy(creep, oEnergySource)
        };
      };
    };

    if (oEnergySource == null) {
      if (oStorage && oStorage.store[RESOURCE_ENERGY] >
        nMinEnergyInStorage) {
        oEnergySource = oStorage
        if (debug) {
          log.output('Debug', 'Picking up energy from storage with ' + oStorage.store[RESOURCE_ENERGY] + ' energy', false, true)
        };
        this.withdrawEnergy(creep, oEnergySource)
      };
    };

    if (oEnergySource == null) {
      const aDroppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES,
        3)
      if (aDroppedEnergy.length > 0 && aDroppedEnergy[0].amount > creep
        .carryCapacity - _.sum(creep.carry)) {
        oEnergySource = aDroppedEnergy[0]
        if (debug) {
          log.output('Debug', 'Picking up energy from a pile of ' + oEnergySource.amount + ' at location ' +
            oEnergySource.pos, false, true)
        };
        this.pickupEnergy(creep, oEnergySource)
      };
    };

    if (oEnergySource === null) {
      // Locate the nearest active energy source
      oEnergySource = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)

      // If a source is found
      if (oEnergySource) {
        // Check if there is a container nearby
        const aContainers = oEnergySource.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: (i) => i.structureType === STRUCTURE_CONTAINER
        })

        // Grab the container from the array if there is one.
        let oPickupContainer = null
        if (aContainers.length > 0) {
          oPickupContainer = Game.getObjectById((_.first(aContainers)).id)
        };

        // If there is a container, withdraw energy from there, else draw directly from the source
        if (oPickupContainer !== null && oPickupContainer.store[RESOURCE_ENERGY] > creep.carryCapacity) {
          if (debug) {
            log.output('Debug', 'Getting energy from container ' +
              oPickupContainer.id + ' found near Source ' +
              oEnergySource.id, false, true)
          };
          this.withdrawEnergy(creep, oPickupContainer)
        } else {
          if (oEnergySource) {
            if (debug) {
              log.output('Debug', 'Harvesting energy from Source ' + oEnergySource.pos, false, true)
            };
            this.harvestEnergy(creep, oEnergySource)
          };
        }
      } else {
        if (debug) {
          log.output('Debug', 'No viable Source was found, waiting patiently...', false, true)
        };
      }
    };

    if (debug) {
      log.output('Debug', 'End - getEnergy_v3', false, true)
    };
  }

}
