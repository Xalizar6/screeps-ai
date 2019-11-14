"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require( 'helper_myFunctions' );
const log = require( './helper_logging' );
const debug = false; // Turn logging for this module on and off
let timer = null;

module.exports = {

    /** @param {Creep} creep **/
    run: function ( creep )
    {

        if ( debug ) { log.output( 'Debug', 'Begin - Role Upgrader for ' + creep.name, true ) };
        if ( debug ) { timer = Game.cpu.getUsed() };

        if ( creep.memory.upgrading && creep.carry.energy == 0 )
        {
            creep.memory.upgrading = false;
            creep.say( '🔄 refill' );
        };

        if ( !creep.memory.upgrading && creep.carry.energy === creep.carryCapacity )
        {
            creep.memory.upgrading = true;
            creep.say( '⚡ upgrade' );
        };

        if ( creep.memory.upgrading )
        {

            if ( debug ) { log.output( 'Debug', 'Upgrading Room Controller', false, true ) };
            if ( creep.upgradeController( creep.room.controller ) == ERR_NOT_IN_RANGE )
            {
                creep.moveTo( creep.room.controller, { visualizePathStyle: { stroke: '#f2f3f4' } } );
            };

        } else
        {

            if ( debug ) { log.output( 'Debug', 'Getting Energy', false, true ) };
            myFunctions.getEnergy_v3( creep );

        };

        if ( debug ) { log.output( 'Debug', 'Role Upgrader took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
        if ( debug ) { log.output( 'Debug', 'End - Role Upgrader' ) };

    },

};