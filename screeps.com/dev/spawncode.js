"use strict"; // Declaring Strict Mode to enforce better coding standards


function findSources() {
    // Attemping to create the same number of dedicated harvesters as there are sources.
    // Find the sources in a room and add to an array.
        let aSources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
    // Return the size of the array
        return aSources.length;
    };
    
    module.exports = {
        
        run: function() {
            
            //Set Variables
            // Set the minimum number of each kind that we want for production
            // Create 1 dedicated harvester for each source
            var nMinNumberOfHarvesters = 4;
            var nMinNumberOfUpgraders = 3;
            var nMinNumberOfBuilders = 2;
            // let nMinNumberOfDedicatedHarvesters = findSources();
            var nMinNumberOfDedicatedHarvesters = 1;               
            var nMinNumberOfLogisticsShortRange = 1;
            var nMinNumberOflogisticsLocal = 1;

        //Clear the deceased creeps from memory
        for( var name in Memory.creeps ) {
            if( !Game.creeps[name] ) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            };
        };

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
        // @ts-ignore
        var alogisticsLocal = _.filter(Game.creeps, (creep) => creep.memory.role == 'logisticsLocal');
                
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
                    
                } else if ( alogisticsLocal.length < nMinNumberOflogisticsLocal ) {
                    var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
                                                        undefined, {role: 'logisticsLocal', hauling:false});
                    console.log('Spawning new Logistics local: ' + newName);
                
                } else if (aDedicatedHarvesters.length < nMinNumberOfDedicatedHarvesters) {
                    var sNewName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], undefined, {role: 'dedicatedHarvester'});
                    console.log('Spawning new dedicated harvester: ' + sNewName);
                
                } else if (aLogisticsShortRange.length < nMinNumberOfLogisticsShortRange) {
                    var sNewName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'LogisticsShortRange', hauling:false});
                    console.log('Spawning new Logistics Short Range: ' + sNewName);
                    
                } else if ( upgraders.length < nMinNumberOfUpgraders ) {
                    var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
                    console.log('Spawning new upgrader: ' + newName);
               
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