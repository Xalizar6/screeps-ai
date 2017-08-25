// Declaring Strict Mode to enforce better coding standards
"use strict";

var myFunctions = require('myFunctions');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // Variables
        var target;
        var aResources;
        var oSpawn1 = Game.spawns["Spawn1"];
        var oStorage = oSpawn1.room.storage;
        var aExtensions = oSpawn1.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION }});
        var oEnergySource = Game.getObjectById("5982fc6bb097071b4adbd5f7");
        

        // If creep is empty
        if (creep.carry.energy == 0) {

            // Find the dropped resources
            aResources = oSpawn1.room.find(FIND_DROPPED_RESOURCES);
            for (let i in aResources) {
                if (aResources[i].pos.isNearTo(oEnergySource)) {
                    target = aResources[i];
                }
            }

            // Go pick up
            myFunctions.pickupEnergy(creep,target);

        } else {

            // If Spawner isn't full
            if (oSpawn1.energy < oSpawn1.energyCapacity) {

                // Drop off at the spawner
                myFunctions.transferEnergy(creep, oSpawn1)

                // If there is room in Storage
            } else if (oStorage.store.energy < 250000) {

                // Drop off at Storage
                myFunctions.transferEnergy(creep, oStorage)
            }
        }
    }
};