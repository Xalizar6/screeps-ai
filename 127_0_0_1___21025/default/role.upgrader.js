"use strict"; // Declaring Strict Mode to enforce better coding standards


var myFunctions = require('helper_myFunctions');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // Declare variables
        var energySource;


        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 refill');
        }
        if (!creep.memory.upgrading && creep.carry.energy > 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#f2f3f4' } });
            }

        } else {

            if (creep.room.storage.store.energy > 5000) {
                energySource = creep.room.storage;
                myFunctions.withdrawEnergy(creep, energySource);

            } else {
                energySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                myFunctions.harvestEnergy(creep, energySource);
            }
        }

    },

};