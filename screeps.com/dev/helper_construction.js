"use strict"; // Declaring Strict Mode to enforce better coding standards

const log = require( "./helper_logging" );
const oSpawn = Game.spawns['Spawn1'];
const oRoom = oSpawn.room;
const arrayOfSources = oRoom.find( FIND_SOURCES );
const debug = true; // Turn logging for this module on and off

module.exports = {
    run: function () {

        if ( !oRoom.memory.construction.RCL1 ) {
            f_addConstructionRCL1();
        };

    },

};

const f_addConstructionRCL1 = function () {

    if ( debug ) { log.output( 'Debug', 'Begin - helper_construction RUN function', false, true ) };
    if ( debug ) { var timer = Game.cpu.getUsed() };

    // Declare Variables
    let aPath = [];
    let oLastPosition;

    if ( debug ) { log.output( 'Debug', 'Spawn location ' + oSpawn.pos, false, true ) };

    arrayOfSources.forEach( function ( oSource ) {
        if ( debug ) { log.output( 'Debug', 'Energy source location ' + oSource.pos, false, true ) };

        aPath = oRoom.findPath( oSpawn.pos, oSource.pos, { ignoreCreeps: true, range: 1 } );

        aPath.forEach( function ( oPosition ) {
            if ( debug ) { log.output( 'Debug', oPosition.x + ' ' + oPosition.y, false, true ) };
        } );

        oLastPosition = aPath[aPath.length - 1]

        if ( debug ) { log.output( 'Debug', 'Last step in the path cords ' + oLastPosition.x + ' ' + oLastPosition.y, false, true ) };

        oRoom.createConstructionSite( oLastPosition.x, oLastPosition.y, STRUCTURE_CONTAINER );

    } );

    oRoom.memory.construction.RCL1 = true;

    if ( debug ) { log.output( 'Debug', 'helper_construction Run routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - helper_construction RUN function', false, true ) };

};