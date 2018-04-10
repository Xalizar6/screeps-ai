"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require( 'helper_myFunctions' );
const log = require( './helper_logging' );
const debug = false; // Turn logging for this module on and off

module.exports = {

    /** @param {Creep} creep **/
    run: function ( creep ) {

        if ( debug ) { log.output( 'Debug', 'Begin - Role Harvester for ' + creep.name, true ) };
        let timer1 = Game.cpu.getUsed();

        // Variables
        let target = null;
        let source = null;
        const oSpawn = Game.spawns['Spawn1']

        if ( creep.room.storage ) {
            // Put energy into the storage
            target = creep.room.storage;
        } else {
            if ( oSpawn.energy < oSpawn.energyCapacity ) {
                // Put energy into the spawn
                target = oSpawn;
            };
        };

        // If you don't have full energy, go find a source and fill up.
        if ( creep.carry.energy < creep.carryCapacity ) {
            source = creep.pos.findClosestByPath( FIND_SOURCES_ACTIVE );
            myFunctions.harvestEnergy( creep, source );
        } else {
            myFunctions.transferEnergy( creep, target );
        };

        if ( debug ) { log.output( 'Debug', 'Role Harvester took: ' + ( Game.cpu.getUsed() - timer1 ) + ' CPU Time', true, true ) };
        if ( debug ) { log.output( 'Debug', 'End - Role Harvester' ) };

    },

};