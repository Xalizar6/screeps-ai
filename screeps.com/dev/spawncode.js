"use strict"; // Declaring Strict Mode to enforce better coding standards

const _ = require('lodash');

module.exports = {

    run: function () {

        // Declare Variables
        // Get the number of energy sources in the room from memory
        const nEnergySourcesInMemory = _.size(Game.spawns['Spawn1'].room.memory.sources);

        // Set the minimum number of each kind of creep that we want for production
        const nMinNumberOfHarvesters = 0;
        const nMinNumberOfUpgraders = 3;
        const nMinNumberOfBuilders = 2;
        const nMinNumberOfDedicatedHarvesters = nEnergySourcesInMemory;
        const nMinNumberOfLogisticsShortRange = nEnergySourcesInMemory;
        const nMinNumberOflogisticsLocal = 1;

        //Clear the deceased creeps from memory
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            };
        };

        // Determine the total number we have alive this tick
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var aDedicatedHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'dedicatedHarvester');
        var aLogisticsShortRange = _.filter(Game.creeps, (creep) => creep.memory.role == 'LogisticsShortRange');
        var alogisticsLocal = _.filter(Game.creeps, (creep) => creep.memory.role == 'logisticsLocal');

        // Spawn additional creeps if needed, including emergency code and 
        // prioritizing harvesters first.
        if (
            _.size(Game.creeps) < 2) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester' });
            console.log('Spawning new harvester: ' + newName);

        } else {

            if (harvesters.length < nMinNumberOfHarvesters) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'harvester' });
                console.log('Spawning new harvester: ' + newName);

            } else if (alogisticsLocal.length < nMinNumberOflogisticsLocal) {
                var newName = Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                    undefined, { role: 'logisticsLocal', hauling: false });
                console.log('Spawning new Logistics local: ' + newName);

            } else if (aDedicatedHarvesters.length < nMinNumberOfDedicatedHarvesters) {
                var sNewName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], undefined, { role: 'dedicatedHarvester' });
                console.log('Spawning new dedicated harvester: ' + sNewName);

            } else if (aLogisticsShortRange.length < nMinNumberOfLogisticsShortRange) {
                var sNewName = Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'LogisticsShortRange', hauling: false });
                console.log('Spawning new Logistics Short Range: ' + sNewName);

            } else if (upgraders.length < nMinNumberOfUpgraders) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'upgrader' });
                console.log('Spawning new upgrader: ' + newName);

            } else if (_.size(Game.constructionSites) > 0) {
                if (builders.length < nMinNumberOfBuilders) {
                    var newName = Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'builder' });
                    console.log('Spawning new builder: ' + newName);
                };
            };
        };

        //add text to the screen indicating spawning process
        if (Game.spawns['Spawn1'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                { align: 'left', opacity: 0.8 });
        };

    },

};