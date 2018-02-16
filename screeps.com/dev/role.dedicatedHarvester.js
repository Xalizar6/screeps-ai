"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // Declare variables
            const aSourcesInMemory = creep.room.memory.sources;
            let bCreepAlreadyAssigned = false;
            let source = null;

        // Checking if the creep is about to die
        if (creep.ticksToLive > 2) {
            
            // Loop through the room sources stored in memory
            for (let i in aSourcesInMemory) {
                log.output("Debug","Source IDs: " + aSourcesInMemory[i].id,true);
                log.output("Debug","Harvester: " + aSourcesInMemory[i].harvester);
                log.output("Debug","Hauler: " + aSourcesInMemory[i].hauler);

                // Determine if the creep is already assigned to a source
                if (aSourcesInMemory[i].harvester == creep.name) {
                    
                    // Give the creep the source object
                    // source = Game.getObjectById(aSourcesInMemory[i].id);

                    bCreepAlreadyAssigned = true;

                };
            };

            // If the creep wasn't already assigned to a source, then find one to assign
            if (!bCreepAlreadyAssigned) {
                
                // Loop through the room sources stored in memory 
                for (let i in aSourcesInMemory) {
                    if (!aSourcesInMemory[i].harvester) {
                    
                        // Assign the creep to the source
                        aSourcesInMemory[i].harvester = creep.name;
                        log.output("Debug",creep.name + " is newly assigned to source " + aSourcesInMemory[i].id)
                    
                        // Give the creep the source object
                        // source = Game.getObjectById(aSourcesInMemory[i].id);
                        
                        // Exit the FOR loop so the creep isn't assigned to every available source
                        break;

                    };
                };
            };

            // Give the creep the source object - old method
            source = Game.getObjectById("5982fc6bb097071b4adbd5f7")

            // Call the function to harvest energy
            myFunctions.harvestEnergy(creep, source);


        } else {
            
            creep.say("dying");

            // Loop through the sources
            for (let i in aSourcesInMemory) {
                
                // Remove the creep's assignment to the source before it dies
                if (aSourcesInMemory[i].harvester = creep.name) {
                    delete aSourcesInMemory[i].harvester;
                };
            };
        };

        
    },

};