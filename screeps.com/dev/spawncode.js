"use strict"; // Declaring Strict Mode to enforce better coding standards

const _ = require('lodash');
const log = require('./helper_logging');

module.exports = {

    run: function () {

        log.output('Debug', 'Begin - Spawncode routine', true);
        const timer1 = Game.cpu.getUsed();

        // Get the number of energy sources in the room from memory
        const nEnergySourcesInMemory = _.size(Game.spawns['Spawn1'].room.memory.sources);

        // Set the minimum number of each kind of creep that we want for production
        const nMinNumberOfHarvesters = 0;
        const nMinNumberOfBuilders = 2;
        let nMinNumberOfUpgraders = null;
        const nMinNumberOfDedicatedHarvesters = nEnergySourcesInMemory;
        const nMinNumberOfLogisticsShortRange = nEnergySourcesInMemory;
        const nMinNumberOflogisticsLocal = 1;

        // Adjust the number of Upgraders if we have enough energy stored - temporary until I start selling energy
        if (Game.spawns['Spawn1'].room.storage.store[RESOURCE_ENERGY] > 500000) {
            nMinNumberOfUpgraders = 5;
        } else {
            nMinNumberOfUpgraders = 3;
        };

        //Clear the deceased creeps from memory
        for (let creep in Memory.creeps) {
            if (!Game.creeps[creep]) {
                delete Memory.creeps[creep];
                // console.log('Clearing non-existing creep memory:', creep);                
                log.output("Event", "Clearing non-existing creep memory: " + creep, false, true);
            };
        };

        // Determine the total number of each role of creep we have alive this tick
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        const aDedicatedHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'dedicatedHarvester');
        const aLogisticsShortRange = _.filter(Game.creeps, (creep) => creep.memory.role == 'LogisticsShortRange');
        const alogisticsLocal = _.filter(Game.creeps, (creep) => creep.memory.role == 'logisticsLocal');

        // Spawn additional creeps if needed, including emergency code and 
        // prioritizing harvesters first.
        if (_.size(Game.creeps) < 2) {
            Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester' });

        } else {

            if (harvesters.length < nMinNumberOfHarvesters) {
                Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'harvester' });

            } else if (alogisticsLocal.length < nMinNumberOflogisticsLocal) {
                Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                    undefined, { role: 'logisticsLocal', hauling: false });

            } else if (aDedicatedHarvesters.length < nMinNumberOfDedicatedHarvesters) {
                Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], undefined, { role: 'dedicatedHarvester' });

            } else if (aLogisticsShortRange.length < nMinNumberOfLogisticsShortRange) {
                Game.spawns['Spawn1'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'LogisticsShortRange', hauling: false });

            } else if (upgraders.length < nMinNumberOfUpgraders) {
                Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'upgrader' });

            } else if (_.size(Game.constructionSites) > 0) {
                if (builders.length < nMinNumberOfBuilders) {
                    Game.spawns['Spawn1'].createCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'builder' });
                };
            };

        };

        //Add text to the screen indicating spawning process
        if (Game.spawns['Spawn1'].spawning) {
            const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            log.output("Event", "Spawning new creep named " + spawningCreep.name + " with the role " + spawningCreep.memory.role, false, true);
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                { align: 'left', opacity: 0.8 });
        };

        log.output('Debug', 'Spawncode routine took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time', false, true);
        log.output('Debug', 'End - Spawncode routine');

    },

};