"use strict"; // Declaring Strict Mode to enforce better coding standards


module.exports = {

    /** @param {Creep} creep **/
    harvestEnergy: function (creep, energySource) {
        if (creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(energySource, { visualizePathStyle: { stroke: '#f2f210' } });            
        };
    },

    /** @param {Creep} creep **/
    transferEnergy: function (creep, transferTarget) {
        if (creep.transfer(transferTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(transferTarget, { visualizePathStyle: { stroke: '#f2f210' } });
        }
    },

    /** @param {Creep} creep **/
    withdrawEnergy: function (creep, energySource) {
        if (creep.withdraw(energySource, RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
            creep.moveTo(energySource, { visualizePathStyle: { stroke: '#2386ea' } });
        }
    },

    /** @param {Creep} creep **/
    pickupEnergy: function (creep, target) {
        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#f2f210' } });
        }
    }

};