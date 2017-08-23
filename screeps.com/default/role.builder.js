// Declaring Strict Mode to enforce better coding standards
"use strict";

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {

        // Declare variables
        var aTargets;
        var oEnergySource;
        var oSpawn = Game.spawns["Spawn1"]

        // If build mode is on and you are empty, turn off build mode
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 fill');
        }
        
        // If build mode is off and you are full, turn on build mode
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        // If build mode is on look for construction sites to build
        if (creep.memory.building) {
            aTargets = creep.room.find(FIND_CONSTRUCTION_SITES);

            // If you found construction sites go build the first one on the list
            if (aTargets.length > 0) {
                if (creep.build(aTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(aTargets[0], { visualizePathStyle: { stroke: '#2386ea' } });
                }
            } else {              
                // If there are no more construction sites then 
                // go hang out at the spawn point to be out of the way
                creep.moveTo(oSpawn)
            }

        } else {
            // If the room has a storage with enough energy, get energy from there
            if (creep.room.storage.store.energy > 5000) {
                oEnergySource = creep.room.storage
                if (creep.withdraw(oEnergySource, RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(oEnergySource, { visualizePathStyle: { stroke: '#2386ea' } });
                }

            } else {

                // If there isn't a storage or the storage is low then get energy from a source
                oEnergySource = creep.room.find(FIND_SOURCES_ACTIVE)[0];

                if (creep.harvest(oEnergySource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(oEnergySource, { visualizePathStyle: { stroke: '#2386ea' } });
                }

            }
        }
    }
};