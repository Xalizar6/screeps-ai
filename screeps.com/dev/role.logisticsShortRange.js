"use strict"; // Declaring Strict Mode to enforce better coding standards


const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        log.output('Debug', 'Begin - Role Logistics Short Range', true);
        let timer1 = Game.cpu.getUsed();

        // Variables
            let target;
            let aResources;
            const oSpawn1 = Game.spawns["Spawn1"];
            const oStorage = oSpawn1.room.storage;

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

            // Loop through the energy sources in the room's memory and see if this creep is assigned to one
            // Set the ID as the creep's Energy Source ID

            // If not already assigned to an energy source, loop through the energy sources until you
            // find one that needs a hauler and assign yourself
            // Set the ID as the creep's Energy Source ID.

            // Once assigned to an energy source look for dropped resources nearby
            let oEnergySource = Game.getObjectById("5982fc6bb097071b4adbd5f7");

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
            myFunctions.transferEnergy(creep, oStorage);

        };

        log.output('Debug', 'Role Logistics Short Range took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time',false,true);
        log.output('Debug', 'End - Role Logistics Short Range');

    },
};