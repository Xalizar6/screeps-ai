"use strict"; // Declaring Strict Mode to enforce better coding standards

const consoleCommands = require( './helper_consoleCommands' );
const log = require( "./helper_logging" );

// Declare Variables
const oRoom = Game.spawns['Spawn1'].room;
const arrayOfContainers = oRoom.find( FIND_STRUCTURES, { filter: ( s ) => s.structureType == STRUCTURE_CONTAINER } );

module.exports = {

    initConsoleCommands: function () {
        // @ts-ignore
        global.cc = consoleCommands; // Make my consoleCommands available globally via the console with cc alias.
    },

    initMemory: function () {

        // Add construction tracking property to Room memory.
        if ( !oRoom.memory.construction ) {
            oRoom.memory.construction = {};
        };

    },

    // Add all of the mineral locations in a room to the Room object in memory
    addMineralsToMemory: function () {
        const arrayOfMinerals = oRoom.find( FIND_MINERALS );
        const arrayOfExtractors = oRoom.find( FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTRACTOR } } );


        if ( arrayOfMinerals.length > 0 ) {

            if ( !oRoom.memory.minerals ) {
                oRoom.memory.minerals = {};
            };

            for ( let i in arrayOfMinerals ) {

                if ( !oRoom.memory.minerals[i] ) {
                    oRoom.memory.minerals[i] = {};
                };

                if ( !oRoom.memory.minerals[i].id ) {
                    oRoom.memory.minerals[i].id = arrayOfMinerals[i].id;
                };

                // Store the Extractor ID that is built on the Mineral Source in Memory so we can monitor the cooldown timer.
                if ( arrayOfExtractors.length > 0 ) {
                    for ( let i in arrayOfExtractors ) {
                        if ( arrayOfExtractors[i].pos = arrayOfMinerals[i].pos ) {
                            oRoom.memory.minerals[i].extractorID = arrayOfExtractors[i].id;
                        };
                    };
                };

                if ( arrayOfContainers.length > 0 ) {
                    for ( let i in arrayOfContainers ) {
                        // Will find a container within 1 space of the mineral
                        if ( arrayOfContainers[i].pos.isNearTo( arrayOfMinerals[i] ) ) {
                            oRoom.memory.minerals[i].containerID = arrayOfContainers[i].id;
                        };
                    };
                };

            };

        };

    },

    // Add all of the sources in a room to the Room object in memory
    addSourcesToMemory: function () {
        const arrayOfEnergySources = oRoom.find( FIND_SOURCES );

        if ( !oRoom.memory.sources ) {
            oRoom.memory.sources = {};
        };

        for ( let i in arrayOfEnergySources ) {

            if ( !oRoom.memory.sources[i] ) {
                oRoom.memory.sources[i] = {};
            };

            if ( !oRoom.memory.sources[i].id ) {
                oRoom.memory.sources[i].id = arrayOfEnergySources[i].id;
            };

            if ( arrayOfContainers.length > 0 ) {
                for ( let i in arrayOfContainers ) {
                    // Will find a container within 1 space of the Energy Source
                    if ( arrayOfContainers[i].pos.isNearTo( arrayOfEnergySources[i] ) ) {
                        oRoom.memory.sources[i].containerID = arrayOfContainers[i].id;
                    };
                };
            };

        };

    },

};