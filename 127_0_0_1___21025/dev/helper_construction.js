"use strict"; // Declaring Strict Mode to enforce better coding standards

const log = require( "./helper_logging" );
let oSpawn = Game.spawns['Spawn1'];
const oRoom = oSpawn.room;
const debug = true; // Turn logging for this module on and off


module.exports = {
    run: function ( roomName ) {

        // Declare Variables
        let path = [];
        let oLastPosition;
        let arrayOfSources = [];


        if ( debug ) { log.output( 'Debug', 'Begin - helper_construction RUN function', false, true ) };

        if ( debug ) { log.output( 'Debug', 'Spawn location ' + oSpawn.pos, false, true ) };

        arrayOfSources = oRoom.find( FIND_SOURCES );

        arrayOfSources.forEach( function ( oSource ) {
            if ( debug ) { log.output( 'Debug', 'Energy source location ' + oSource.pos, false, true ) };

            path = oRoom.findPath( oSpawn.pos, oSource.pos, { ignoreCreeps: true, range: 1 } );

            path.forEach( function ( oPosition ) {
                if ( debug ) { log.output( 'Debug', oPosition.x + ' ' + oPosition.y, false, true ) };
            } );

            oLastPosition = path[path.length - 1]

            if ( debug ) { log.output( 'Debug', 'Last step in the path cords ' + oLastPosition.x + ' ' + oLastPosition.y, false, true ) };

            // oRoom.createConstructionSite( oLastStep.x, oLastStep.y, STRUCTURE_CONTAINER );

        } );


        if ( debug ) { log.output( 'Debug', 'End - helper_construction RUN function', false, true ) };



    },

};