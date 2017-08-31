"use strict"; // Declaring Strict Mode to enforce better coding standards


module.exports = {
    run: function (room) {    
        console.log("This is the GatherEnergy task logic for room: " + room.name);
    }

/*
    switch(room.energyCapacityAvailable) {
        case > 400 && < 600:
            code block
            break;
        case > 600:            
            for (let i in room.sources) {
                let source = room.sources[i];
                
                If assigned harvesters < x {
                    // Spawn a creep, designed for harvesting, of the appropriate size
                        var sNewName = room.spawns[0].createCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], undefined, {role: 'dedicatedHarvester'});
                        console.log('Spawning new dedicated harvester: ' + sNewName);

                    // Assign the guy to harvesting the source
                }

                // Call the function of the assigned creep to harvest the source
                

                // Spawn a creep, designed for hauling, of the appropriate size
                // Assign the guy to hauling from the source
                // Call the function of the creep to haul from the source

            }
            break;
        default:
            code block
        };
*/

};