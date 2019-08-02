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
        let sSpawnStatus = null;
        const nMinNumberOfHarvesters = 0;
        const nMinNumberOfDedicatedHarvesters = nEnergySourcesInMemory;
        const nMinNumberOfLogisticsShortRange = nEnergySourcesInMemory;
        const nMinNumberOflogisticsLocal = 1;
        const nMinNumberOfMineralHarvester = 1;
        const nMinNumberOfMineralHaulers = 1;
        const nMinNumberOfTerminalManagers = 1;
        const spawn = Game.spawns['Spawn1'];
        const room = spawn.room;
        const storage = room.storage;

        // Adjust the number of Upgraders if we have enough energy stored - temporary until I start selling energy
        if ( storage && storage.store[RESOURCE_ENERGY] > myConstants.STORAGE_ENERGY_STORAGE_TARGET ) {
            nMinNumberOfUpgraders = 7;
        } else if ( room.controller.level < 8 ) {
            nMinNumberOfUpgraders = 4;
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
        if ( _.size( Game.creeps ) < 4 ) {
            if ( debug ) { log.output( 'Debug', 'Running Emergency spawncode', false, true ) };
            spawn.createCreep( [WORK, CARRY, MOVE, MOVE], undefined, { role: 'harvester' } );

        } else {
            if ( debug ) { log.output( 'Debug', 'Running normal spawncode with room energy ' + room.energyAvailable + ' of ' + room.energyCapacityAvailable, false, true ) };

            if ( harvesters.length < nMinNumberOfHarvesters ) {
                if ( room.energyCapacityAvailable < 800 ) {
                    sSpawnStatus = spawn.createCreep( [WORK, CARRY, MOVE, MOVE], undefined, { role: 'harvester' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    sSpawnStatus = spawn.createCreep( [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'harvester' } );
                };

            } else if ( aLogisticsShortRange.length < nMinNumberOfLogisticsShortRange ) {
                if ( debug ) { log.output( 'Debug', 'Running Logistics Short Range spawncode', false, true ) };
                if ( room.energyCapacityAvailable < 800 ) {
                    sSpawnStatus = spawn.createCreep( [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, { role: 'LogisticsShortRange' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    sSpawnStatus = spawn.createCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'LogisticsShortRange', hauling: false } );
                };

            } else if ( aDedicatedHarvesters.length < nMinNumberOfDedicatedHarvesters ) {
                if ( debug ) { log.output( 'Debug', 'Running Dedicated Harvester spawncode', false, true ) };
                if ( room.energyCapacityAvailable < 800 ) {
                    sSpawnStatus = spawn.createCreep( [WORK, WORK, MOVE], undefined, { role: 'dedicatedHarvester' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    sSpawnStatus = spawn.createCreep( [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], undefined, { role: 'dedicatedHarvester' } );
                };

            } else if ( storage && alogisticsLocal.length < nMinNumberOflogisticsLocal ) {
                if ( debug ) { log.output( 'Debug', 'Running Logistics Local spawncode', false, true ) };
                if ( room.energyCapacityAvailable < 800 ) {
                    sSpawnStatus = spawn.createCreep( [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, { role: 'logisticsLocal', hauling: false } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    sSpawnStatus = spawn.createCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'logisticsLocal', hauling: false } );
                };

            } else if ( upgraders.length < nMinNumberOfUpgraders ) {
                if ( debug ) { log.output( 'Debug', 'Running Upgrader spawncode', false, true ) };
                if ( room.energyCapacityAvailable < 800 ) {
                    sSpawnStatus = spawn.createCreep( [WORK, CARRY, MOVE, MOVE], undefined, { role: 'upgrader' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    sSpawnStatus = spawn.createCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'upgrader' } );
                };

            } else if ( _.size( Game.constructionSites ) > 0 && builders.length < nMinNumberOfBuilders ) {
                if ( debug ) { log.output( 'Debug', 'Running Builder spawncode', false, true ) };
                if ( room.energyCapacityAvailable < 800 ) {
                    sSpawnStatus = spawn.createCreep( [WORK, CARRY, MOVE, MOVE], undefined, { role: 'builder' } );
                } else if ( room.energyCapacityAvailable >= 800 ) {
                    sSpawnStatus = spawn.createCreep( [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: 'builder' } );
                };

            } else if ( checkForExtractor( room ) && storage && aMineralHarvesters.length < nMinNumberOfMineralHarvester && checkMineralAmount( room ) > 0 ) {
                sSpawnStatus = spawn.createCreep( [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], undefined, { role: 'Mineral Harvester' } );

            } else if ( checkForExtractor( room ) && storage && aMineralHaulers.length < nMinNumberOfMineralHaulers && checkMineralAmount( room ) > 0 ) {
                sSpawnStatus = spawn.createCreep( [CARRY, CARRY, MOVE, MOVE], undefined, { role: 'Mineral Hauler' } );

            } else if ( room.terminal && aTerminalManagers.length < nMinNumberOfTerminalManagers && checkStorageAmount( room ) > myConstants.STORAGE_ENERGY_STORAGE_TARGET ) {
                sSpawnStatus = spawn.createCreep( [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, { role: 'Terminal Manager' } );
            };

        };

        //Add text to the screen indicating spawning process
        if ( spawn.spawning ) {
            const spawningCreep = Game.creeps[spawn.spawning.name];
            log.output( "Event", "Spawning new creep named " + spawningCreep.name + " with the role " + spawningCreep.memory.role, false, true );
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1,
                spawn.pos.y,
                { align: 'left', opacity: 0.8 } );
        } else {
            if ( sSpawnStatus ) {
                log.output( "Event", "Not Spawning new creep with a status of: " + sSpawnStatus, false, true );
            } else {
                if ( debug ) { log.output( "Debug", "No need for a new creep right now", false, true ) };
            };

        };

        if ( debug ) { log.output( 'Debug', 'Spawncode routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
        if ( debug ) { log.output( 'Debug', 'End - Spawncode routine' ) };

    },

};

const checkMineralAmount = function ( room ) {
    return Game.getObjectById( room.memory.minerals[0].id ).mineralAmount;
};

const checkStorageAmount = function ( room ) {
    if ( room.storage ) {
        return room.storage.store[RESOURCE_ENERGY];
    }
};

const checkForExtractor = function ( room ) {
    const aMinerals = room.find( FIND_MINERALS );
    let aStructures = null;

    // aMinerals.forEach( function ( oMineral ) {
    //     console.log(oMineral.pos);
    //     let aStructures = oMineral.pos.lookFor( LOOK_MINERALS )
    //     console.log(aStructures);
    //     if ( aStructures.length > 0 ) {
    //         return true;
    //     };

    // } );

    for ( let i in aMinerals ) {
        aStructures = aMinerals[i].pos.lookFor( LOOK_STRUCTURES );

        if ( aStructures.length > 0 ) {
            return true;
        } else {
            return false;
        };

    };
};