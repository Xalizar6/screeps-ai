var spawncode = {

    run: function() {
        
        //Set Variables
            // Set the minimum number of each kind that we want
            var nMinNumberOfHarvesters = 3;
            var nMinNumberOfUpgraders = 5;
            var nMinNumberOfBuilders = 3;

            // Determine the total number we have alive this tick
                var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
                var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
                var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

        //Clear the deceased creeps from memory
            for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    console.log('Clearing non-existing creep memory:', name);
                }
            } 

        //Spawn additional if needed
            if(harvesters.length < nMinNumberOfHarvesters) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'harvester'});
                console.log('Spawning new harvester: ' + newName);
            }
        
        //Spawn additional if needed
            if(upgraders.length < nMinNumberOfUpgraders) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
                console.log('Spawning new upgrader: ' + newName);
            }

        //Spawn additional if needed
            if( _.size(Game.constructionSites) > 0 ) {
                if(builders.length < nMinNumberOfBuilders) {
                    var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
                    console.log('Spawning new builder: ' + newName);
                }    
            }
        
        //add text to the screen indicating spawning process
            if(Game.spawns['Spawn1'].spawning) {
                var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
                Game.spawns['Spawn1'].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns['Spawn1'].pos.x + 1,
                    Game.spawns['Spawn1'].pos.y,
                    {align: 'left', opacity: 0.8});
            }
    }

}

module.exports = spawncode;