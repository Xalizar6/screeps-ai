"use strict"; // Declaring Strict Mode to enforce better coding standards


const myFunctions = require( 'helper_myFunctions' );
const log = require( './helper_logging' );
const debug = false; // Turn logging for this module on and off
let timer = null;

module.exports = {

    /** @param {Creep} creep **/
    run: function ( creep ) {

        if ( debug ) { log.output( 'Debug', 'Begin - Role Logistics Short Range for ' + creep.name, true ) };
        if ( debug ) { timer = Game.cpu.getUsed() };

        // Declare Variables
        const aSourcesInMemory = creep.room.memory.sources;
        let target = null;
        let aResources = null;
        let oEnergySource = null;
        let bCreepAlreadyAssigned = false;

        // If hauling mode is on creep is empty, turn off hauling mode
        if ( creep.memory.hauling && creep.carry.energy == 0 ) {
            creep.memory.hauling = false;
            creep.say( '🔄 refill' );
        };

        // If hauling mode is off and creep is full, turn on hauling mode
        if ( !creep.memory.hauling && creep.carry.energy == creep.carryCapacity ) {
            creep.memory.hauling = true;
            creep.say( '🚧 hauling' );
        };

        // If creep is empty, identify the assigned source to pickup near
        if ( creep.memory.hauling == false ) {

            // Loop through the energy sources in the room's memory and see if this creep is assigned to one
            // Set the ID as the creep's Energy Source ID
            for ( let i in aSourcesInMemory ) {

                // Determine if the currently assigned hauler is alive - remove from memory if not.
                if ( aSourcesInMemory[i].harvester && !Game.creeps[aSourcesInMemory[i].hauler] ) {
                    log.output( "Event", "Removing dead Hauler " + aSourcesInMemory[i].hauler + " from source.", false, true );
                    delete aSourcesInMemory[i].hauler;
                };

                if ( aSourcesInMemory[i].hauler === creep.name ) {
                    // Give the creep the source object
                    oEnergySource = Game.getObjectById( aSourcesInMemory[i].id );
                    bCreepAlreadyAssigned = true;
                };

            };

            // If not already assigned to an energy source, loop through the energy sources until you
            // find one that needs a hauler
            // Set the ID as the creep's Energy Source ID.
            if ( !bCreepAlreadyAssigned ) {

                // Loop through the room sources stored in memory 
                for ( let i in aSourcesInMemory ) {

                    if ( !aSourcesInMemory[i].hauler ) {
                        // Assign the creep to the source
                        aSourcesInMemory[i].hauler = creep.name;

                        // Give the creep the source object
                        oEnergySource = Game.getObjectById( aSourcesInMemory[i].id );

                        // Exit the FOR loop so the creep isn't assigned to every available source
                        break;
                    };

                };

            };



            // oEnergySource = Game.getObjectById("5982fc6bb097071b4adbd5f7");

            // Once assigned to an energy source look for dropped resources nearby to it
            aResources = creep.room.find( FIND_DROPPED_RESOURCES );
            for ( let i in aResources ) {

                if ( aResources[i].pos.isNearTo( oEnergySource ) ) {
                    target = aResources[i];
                };

            };

            // Go pick up the dropped resources
            myFunctions.pickupEnergy( creep, target );

        } else {

            // Creep is full so go drop off at Storage
            myFunctions.transferEnergy( creep, creep.room.storage );

        };

        // Unregister the creep from the source in memory before it dies
        if ( creep.ticksToLive <= 2 ) {
            creep.say( "dying" );

            // Loop through the sources
            for ( let i in aSourcesInMemory ) {

                // Remove the creep's assignment to the source before it dies
                if ( aSourcesInMemory[i].hauler === creep.name ) {
                    delete aSourcesInMemory[i].hauler;
                };

            };

        };

        if ( debug ) { log.output( 'Debug', 'Role Logistics Short Range took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
        if ( debug ) { log.output( 'Debug', 'End - Role Logistics Short Range' ) };

    },
};