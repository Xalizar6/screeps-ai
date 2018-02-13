"use strict"; // Declaring Strict Mode to enforce better coding standards


var myFunctions = require('helper_myFunctions');

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

        // If creep is empty
        if (creep.memory.hauling == false) {

            // Find the dropped resources
            aResources = oSpawn1.room.find(FIND_DROPPED_RESOURCES);
            for (let i in aResources) {
                if (aResources[i].pos.isNearTo(oEnergySource)) {
                    target = aResources[i];
                };
            };

            // Go pick up the dropped resources
            myFunctions.pickupEnergy(creep,target);

        } else {

            // Creep is full so go drop off at Storage
            myFunctions.transferEnergy(creep, oStorage)

        };
    }
};