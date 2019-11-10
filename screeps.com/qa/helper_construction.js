"use strict"; // Declaring Strict Mode to enforce better coding standards

//To Do: Check if storage exists in the room and place the containers in reference to Storage instead of Spawn

const log = require( "./helper_logging" );
const g_oSpawn = Game.spawns['Spawn1'];
const g_oRoom = g_oSpawn.room;
const g_aSources = g_oRoom.find( FIND_SOURCES );
const debug = true; // Turn logging for this module on and off

module.exports = {
    run: function () {

        if ( !g_oRoom.memory.construction.RCL1 ) {
            f_AddConstructionRCL1();
        };

    },

};

const f_AddConstructionRCL1 = function () {

    if ( debug ) { log.output( 'Debug', 'Begin - Add Construction for RCL1', false, true ) };
    if ( debug ) { var timer = Game.cpu.getUsed() };

    // Declare local Variables
    let aPath = [];
    let oLastPosition;
    let aControllerPath;
    let oTargetContainerPosition;

    if ( debug ) { log.output( 'Debug', 'Spawn location ' + g_oSpawn.pos, false, true ) };

    g_aSources.forEach( function ( oSource ) {
        if ( debug ) { log.output( 'Debug', 'Energy source location ' + oSource.pos, false, true ) };

        aPath = g_oRoom.findPath( g_oSpawn.pos, oSource.pos, { ignoreCreeps: true, range: 1 } );

        aPath.forEach( function ( oPosition ) {
            if ( debug ) { log.output( 'Debug', oPosition.x + ' ' + oPosition.y, false, true ) };
        } );

        oLastPosition = aPath[aPath.length - 1]

        if ( debug ) { log.output( 'Debug', 'Last step in the path cords ' + oLastPosition.x + ' ' + oLastPosition.y, false, true ) };

        g_oRoom.createConstructionSite( oLastPosition.x, oLastPosition.y, STRUCTURE_CONTAINER );

    } );

    // Put a container near the Room controller for the upgraders to use.
    aControllerPath = g_oRoom.findPath( g_oSpawn.pos, g_oRoom.controller.pos, { ignoreCreeps: true, range: 2 } );
    oTargetContainerPosition = aControllerPath[aControllerPath.length - 1];
    g_oRoom.createConstructionSite( oTargetContainerPosition.x, oTargetContainerPosition.y, STRUCTURE_CONTAINER );

    // Record in the memory that this function has run so it doesn't use CPU every cycle.
    g_oRoom.memory.construction.RCL1 = true;

    if ( debug ) { log.output( 'Debug', 'Add Construction for RCL1 routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Add Construction for RCL1', false, true ) };

};