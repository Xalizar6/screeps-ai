"use strict"; // Declaring Strict Mode to enforce better coding standards


var myFunctions = require('helper_myFunctions');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // Variables
            var target;
            var source;

        // If you don't have full energy, go find a source and fill up.
        if (creep.carry.energy < creep.carryCapacity) {
            source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            myFunctions.harvestEnergy(creep, source)
        } else {
            // Put energy into the storage
            target = creep.room.storage
            myFunctions.transferEnergy(creep, target)
        };
    }
};