// Declaring Strict Mode to enforce better coding standards
"use strict";

var myFunctions = require('myFunctions');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // If you don't have full energy, go find a source and fill up.
        if (creep.carry.energy < creep.carryCapacity) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            myFunctions.harvestEnergy(creep, source)
        }

        // Find an Extension, Spawn, or Tower to put the energy in.
        else {
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });

            // If you don't find any structures that need filling then look for storage to fill.
            if (!targets.length) {
                var targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        // return structure.structureType == STRUCTURE_STORAGE && structure.store.energy < structure.storeCapacity;
                        return structure.structureType == STRUCTURE_STORAGE && structure.store.energy < 250000;
                    }
                });
            }

            if (targets.length) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#f2f210' } });
                }
            }
            else {
                creep.moveTo(Game.spawns["Spawn1"], { visualizePathStyle: { stroke: '#f2f210' } });
            }
        }
    }
};