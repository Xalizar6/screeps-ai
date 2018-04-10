"use strict"; // Declaring Strict Mode to enforce better coding standards

const _ = require( 'lodash' );
const log = require( './helper_logging' );
const myConstants = require( './helper_constants' );
const debug = false; // Turn logging for this module on and off

module.exports = {

    run: function () {

        if ( debug ) { log.output( 'Debug', 'Begin - Spawncode routine', true ) };
        if ( debug ) { var timer = Game.cpu.getUsed() };

        //Clear the deceased creeps from memory
        for ( let creep in Memory.creeps ) {
            if ( !Game.creeps[creep] ) {
                delete Memory.creeps[creep];
                log.output( "Event", "Clearing non-existing creep memory: " + creep, true, true );
            };
        };

        // Get the number of energy sources in the room from memory to be used for creep count
        const nEnergySourcesInMemory = _.size( Game.spawns['Spawn1'].room.memory.sources );

        // Set the minimum number of each kind of creep that we want for production
        let nMinNumberOfUpgraders = null;
        let nMinNumberOfBuilders = null;
        const nMinNumberOfHarvesters = 0;
        const nMinNumberOfDedicatedHarvesters = nEnergySourcesInMemory;
        const nMinNumberOfLogisticsShortRange = nEnergySourcesInMemory;
        const nMinNumberOflogisticsLocal = 1;
        const nMinNumberOfMineralHarvester = 1;
        const nMinNumberOfMineralHaulers = 1;
        const nMinNumberOfTerminalManagers = 1;
        const spawn = Game.spawns['Spawn1'];
        const room = spawn.room;

        // Adjust the number of Upgraders if we have enough energy stored - temporary until I start selling energy
        if ( room.storage && room.storage.store[RESOURCE_ENERGY] > myConstants.STORAGE_ENERGY_STORAGE_TARGET ) {
            nMinNumberOfUpgraders = 5;
        } else if ( room.controller.level < 8 ) {
            nMinNumberOfUpgraders = 2;
        } else if ( room.controller.level === 8 ) {
            nMinNumberOfUpgraders = 1;
        };

        // Adjust the number of builders if there is more to build
        if ( _.size( Game.constructionSites ) > 2 ) {
            nMinNumberOfBuilders = 3;
        } else {
            nMinNumberOfBuilders = 1;
        };

        // Determine the total number of each role of creep we have alive this tick
        const harvesters = _.filter( Game.creeps, ( creep ) => creep.memory.role == 'harvester' );
        const upgraders = _.filter( Game.creeps, ( creep ) => creep.memory.role == 'upgrader' );
        const builders = _.filter( Game.creeps, ( creep ) => creep.memory.role == 'builder' );
        const aDedicatedHarvesters = _.filter( Game.creeps, ( creep ) => creep.memory.role == 'dedicatedHarvester' );
        const aLogisticsShortRange = _.filter( Game.creeps, ( creep ) => creep.memory.role == 'LogisticsShortRange' );
        const alogisticsLocal = _.filter( Game.creeps, ( creep ) => creep.memory.role == 'logisticsLocal' );
        const aMineralHarvesters = _.filter( Game.creeps, ( creep ) => creep.memory.role == 'Mineral Harvester' );
        const aMineralHaulers = _.filter( Game.creeps, ( creep ) => creep.memory.role == 'Mineral Hauler' );
        const aTerminalManagers = _.filter( Game.creeps, ( creep ) => creep.memory.role == 'Terminal Manager' );

        // Spawn additional creeps if needed, including emergency code and 
        // prioritizing harvesters first.
        if ( _.size( Game.creeps ) < 2 ) {
            spawn.createCreep( [WORK, CARRY, MOVE, MOVE], undefined, { role: 'harvester' } );

        } else {

            if ( harvesters.length < nMinNumberOfHarvesters ) {
                if ( room.energyCapacityAvailable < 800 ) {
                    spawn.createCreep( [WORK, CARRY, MOVE, MOVE], undefined, { role: 'harvester' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    spawn.createCreep( [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'harvester' } );
                };

            } else if ( aDedicatedHarvesters.length < nMinNumberOfDedicatedHarvesters ) {
                if ( room.energyCapacityAvailable < 800 ) {
                    spawn.createCreep( [WORK, WORK, MOVE], undefined, { role: 'dedicatedHarvester' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    spawn.createCreep( [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], undefined, { role: 'dedicatedHarvester' } );
                };

            } else if ( aLogisticsShortRange.length < nMinNumberOfLogisticsShortRange ) {
                if ( room.energyCapacityAvailable < 800 ) {
                    spawn.createCreep( [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, { role: 'LogisticsShortRange' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    spawn.createCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'LogisticsShortRange', hauling: false } );
                };

            } else if ( upgraders.length < nMinNumberOfUpgraders ) {
                if ( room.energyCapacityAvailable < 800 ) {
                    spawn.createCreep( [WORK, CARRY, MOVE, MOVE], undefined, { role: 'upgrader' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    spawn.createCreep( [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'upgrader' } );
                };

            } else if ( _.size( Game.constructionSites ) > 0 && builders.length < nMinNumberOfBuilders ) {
                if ( room.energyCapacityAvailable < 800 ) {
                    spawn.createCreep( [WORK, CARRY, MOVE, MOVE], undefined, { role: 'builder' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    spawn.createCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'builder' } );
                };

            } else if ( room.storage && alogisticsLocal.length < nMinNumberOflogisticsLocal ) {
                if ( room.energyCapacityAvailable < 800 ) {
                    spawn.createCreep( [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, { role: 'logisticsLocal', hauling: false } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    spawn.createCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'logisticsLocal', hauling: false } );
                };

            } else if ( aMineralHarvesters.length < nMinNumberOfMineralHarvester && checkMineralAmount( spawn ) > 0 ) {
                spawn.createCreep( [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], undefined, { role: 'Mineral Harvester' } );

            } else if ( aMineralHaulers.length < nMinNumberOfMineralHaulers && checkMineralAmount( spawn ) > 0 ) {
                spawn.createCreep( [CARRY, CARRY, MOVE, MOVE], undefined, { role: 'Mineral Hauler' } );

            } else if ( aTerminalManagers.length < nMinNumberOfTerminalManagers && checkStorageAmount() > 25000 ) {
                spawn.createCreep( [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, { role: 'Terminal Manager' } );
            };

        };

        //Add text to the screen indicating spawning process
        if ( spawn.spawning ) {
            const spawningCreep = Game.creeps[spawn.spawning.name];
            log.output( "Event", "Spawning new creep named " + spawningCreep.name + " with the role " + spawningCreep.memory.role, true, true );
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                { align: 'left', opacity: 0.8 } );
        };

        if ( debug ) { log.output( 'Debug', 'Spawncode routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
        if ( debug ) { log.output( 'Debug', 'End - Spawncode routine' ) };

    },

};

const checkMineralAmount = function ( spawn ) {
    return Game.getObjectById( spawn.room.memory.minerals[0].id ).mineralAmount;
};

const checkStorageAmount = function ( spawn ) {
    return spawn.room.storage.store[RESOURCE_ENERGY];
};