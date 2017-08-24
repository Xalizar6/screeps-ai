// Declaring Strict Mode to enforce better coding standards
"use strict";

module.exports = {

    run: function() {
        
        //Set Variables
            // Set the minimum number of each kind that we want for production
                var nMinNumberOfHarvesters = 3;
                var nMinNumberOfUpgraders = 4;
                var nMinNumberOfBuilders = 2;
                var nMinNumberOfDedicatedHarvesters = 1;
                var nMinNumberOfLogisticsShortRange = 2;

            // Set the minimum number of each kind that we want for the Simulator
                // var nMinNumberOfHarvesters = 4;
                // var nMinNumberOfUpgraders = 1;
                // var nMinNumberOfBuilders = 10;

            // Determine the total number we have alive this tick
                    // @ts-ignore
                var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');                    
                // @ts-ignore
                var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
                // @ts-ignore
                var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
                // @ts-ignore
                var aDedicatedHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'dedicatedHarvester');
                // @ts-ignore
                var aLogisticsShortRange = _.filter(Game.creeps, (creep) => creep.memory.role == 'LogisticsShortRange'); 

        //Clear the deceased creeps from memory
            for( var name in Memory.creeps ) {
                if( !Game.creeps[name] ) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }                
            }

        // Spawn additional creeps if needed, including emergency code and 
        // prioritizing harvesters first.
            if (
                // @ts-ignore
                _.size(Game.creeps) < 2) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
                console.log('Spawning new harvester: ' + newName);
                
            } else {

                if (harvesters.length < nMinNumberOfHarvesters) {
                    var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'harvester'});
                    console.log('Spawning new harvester: ' + newName);
                
                } else if ( upgraders.length < nMinNumberOfUpgraders ) {
                        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
                        console.log('Spawning new upgrader: ' + newName);
                
                } else if (aDedicatedHarvesters.length < nMinNumberOfDedicatedHarvesters) {
                    var sNewName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], undefined, {role: 'dedicatedHarvester'});
                    console.log('Spawning new harvester: ' + sNewName);
                
                } else if (aLogisticsShortRange.length < nMinNumberOfLogisticsShortRange) {
                    var sNewName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'LogisticsShortRange'});
                    console.log('Spawning new harvester: ' + sNewName);
                
                    // @ts-ignore
                } else if (_.size(Game.constructionSites) > 0) {
                    if ( builders.length < nMinNumberOfBuilders ) {
                        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
                        console.log('Spawning new builder: ' + newName);
                    }
                } 
            }
        
        //add text to the screen indicating spawning process
            if ( Game.spawns['Spawn1'].spawning ) {
                var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
                Game.spawns['Spawn1'].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns['Spawn1'].pos.x + 1,
                    Game.spawns['Spawn1'].pos.y,
                    {align: 'left', opacity: 0.8});
            }
    }

};