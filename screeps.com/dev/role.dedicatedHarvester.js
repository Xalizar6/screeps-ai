"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');


module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.ticksToLive > 2) {
            
            // TEST - Locate the source
            let aSourcesInMemory = creep.room.memory.sources;
            for (let i in aSourcesInMemory) {
                log.output("Debug","Source IDs: " + aSourcesInMemory[i].id,true);
                log.output("Debug","Harvester: " + aSourcesInMemory[i].harvester);
                log.output("Debug","Hauler: " + aSourcesInMemory[i].hauler);

                if (aSourcesInMemory[i].harvester == creep.name) {
                    log.output("Debug",creep.name + " is assigned to a source")
                    // Locate the source
                    // let source = Game.getObjectById(aSourcesInMemory[i].id)
                };
            };

            // Locate the source
            let source = Game.getObjectById("5982fc6bb097071b4adbd5f7")

            // Call the function to harvest energy
            creep.say("mining")
            myFunctions.harvestEnergy(creep, source)


        } else {
            creep.say("dying")

        }

        
    },

};