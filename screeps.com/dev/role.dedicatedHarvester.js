"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require('helper_myFunctions');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // test code
            console.log('Dedicated harvester: ' + 'Name: ' + creep.name + ' ' + 'Room: ' + creep.room.name)
            for (let i in creep.room.memory.sourceIds) {
                console.log('Source ID: ' + creep.room.memory.sourceIds[i]);
            };
            // console.log(creep.room.memory.sourceIds)

        // Locate the source
        let source = Game.getObjectById("5982fc6bb097071b4adbd5f7")
        
        // Call the function to harvest energy
        myFunctions.harvestEnergy(creep, source)
    }

};