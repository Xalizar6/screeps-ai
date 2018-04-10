"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require( 'helper_myFunctions' );
const log = require( './helper_logging' );
const debug = false; // Turn logging for this module on and off
let timer = null;

module.exports = {

    /** @param {Creep} creep **/
    run: function ( creep ) {

        if ( debug ) { log.output( 'Debug', 'Begin - Role Upgrader for ' + creep.name, true ) };
        if ( debug ) { timer = Game.cpu.getUsed() };

        if ( creep.memory.upgrading && creep.carry.energy == 0 ) {
            creep.memory.upgrading = false;
            creep.say( '🔄 refill' );
        }
        if ( !creep.memory.upgrading && creep.carry.energy === creep.carryCapacity ) {
            creep.memory.upgrading = true;
            creep.say( '⚡ upgrade' );
        }

        if ( creep.memory.upgrading ) {
            if ( creep.upgradeController( creep.room.controller ) == ERR_NOT_IN_RANGE ) {
                creep.moveTo( creep.room.controller, { visualizePathStyle: { stroke: '#f2f3f4' } } );
            };

        } else {

            if ( creep.room.storage && creep.room.storage.store.energy > 5000 ) {
                const energySource = creep.room.storage;
                myFunctions.withdrawEnergy( creep, energySource );

            } else {
                const energySource = creep.pos.findClosestByPath( FIND_SOURCES_ACTIVE );
                myFunctions.harvestEnergy( creep, energySource );
            };
        };

        if ( debug ) { log.output( 'Debug', 'Role Upgrader took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
        if ( debug ) { log.output( 'Debug', 'End - Role Upgrader' ) };

    },

};