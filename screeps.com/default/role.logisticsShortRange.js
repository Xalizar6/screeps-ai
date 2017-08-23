// Declaring Strict Mode to enforce better coding standards
"use strict";

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // Variables
        var oSpawn1 = Game.spawns["Spawn1"]
        var oStorage = oSpawn1.room.storage
        var aExtensions = oSpawn1.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION }});        

        // If creep is empty
        if (creep.carry.energy == 0) {

            // Find the dropped resources
            var aDroppedResources = creep.room.find(FIND_DROPPED_RESOURCES);

            // Convert the array of dropped resources into a specific object to be used as the target
            var oTarget = Game.getObjectById(aDroppedResources[0].id);

            // Go pick up
            if (creep.pickup(oTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(oTarget, { visualizePathStyle: { stroke: '#f2f210' } });
            }

        } else {

            // If Spawner isn't full
            if (oSpawn1.energy < oSpawn1.energyCapacity) {

                // Drop off at the spawner
                if (creep.transfer(oSpawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(oSpawn1, { visualizePathStyle: { stroke: '#f2f210' } });
                }

                // If there is room in Storage
            } else if (creep.room.storage.store.energy < 250000) {

                // Drop off at Storage
                if (creep.transfer(oStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(oStorage, { visualizePathStyle: { stroke: '#f2f210' } });
                }
            }
        }
    }
};