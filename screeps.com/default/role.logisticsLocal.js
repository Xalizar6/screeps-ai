"use strict"; // Declaring Strict Mode to enforce better coding standards


const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        log.output('Debug', 'Begin - Role Logistics Local', true);
        let timer1 = Game.cpu.getUsed();

        // Variables
        var energySource;
        var targets;
        var target;

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

        // If you are in refill mode, go get energy from Storage
        if (creep.memory.hauling == false) {
            if (creep.room.storage.store.energy > 5000) {
                energySource = creep.room.storage;
                myFunctions.withdrawEnergy(creep, energySource);

            } else {
                energySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                myFunctions.harvestEnergy(creep, energySource);
            };
        };

        // If you are in hauling mode go fill the spawner, extensions, and towers until you are empty
        if (creep.memory.hauling) {
            targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });

            if (targets.length) {
                target = creep.pos.findClosestByPath(targets);
                myFunctions.transferEnergy(creep, target)
            }
            else {
                creep.moveTo(Game.spawns["Spawn1"], { visualizePathStyle: { stroke: '#f2f210' } });
            };
        };

        log.output('Debug', 'Role Logistics Local took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time', true, true);
        log.output('Debug', 'End - Role Logistics Local');

    },
};