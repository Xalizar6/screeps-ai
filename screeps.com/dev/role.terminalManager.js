"use strict"; // Declaring Strict Mode to enforce better coding standards

/* 
    Logic
        Should only spawn if the terminal has more or less resources than it needs
        Once spawned it should move resources between the terminal and room storage
        Values for how much should be in the terminal are stored in the Constants file

    States
        Spawning
        Moving (to terminal / to storage)
        Grab Resources
        Deposit Resources
*/

const log = require( './helper_logging' );
const myConstants = require( './helper_constants' );

module.exports = {

    run: function ( creep ) {

        log.output( 'Debug', 'Begin - Terminal Manager Run routine for ' + creep.name, true );
        const timer = Game.cpu.getUsed();

        if ( !creep.memory.state ) {
            creep.memory.state = myConstants.STATE_SPAWNING;
        };

        switch ( creep.memory.state ) {
            case myConstants.STATE_SPAWNING:
                runSpawning( creep, { nextState: myConstants.STATE_MOVING } );
                break;
            case myConstants.STATE_MOVING:
                runMoving( creep, { context: getDestination } );
                break;
            case myConstants.STATE_GRAB_RESOURCE:
                runGrabResource( creep, { nextState: myConstants.STATE_MOVING } );
                break;
            case myConstants.STATE_DEPOSIT_RESOURCE:
                runDepositResource( creep, { nextState: myConstants.STATE_MOVING } );
                break;
        };

        log.output( 'Debug', 'Terminal Manager Run routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true );
        log.output( 'Debug', 'End - Terminal Manager Run routine' );

    },
};

const runSpawning = function ( creep, options ) {

    // Once the creep finishes spawning we transition to the next state
    if ( creep.spawning === false ) {
        creep.memory.state = options.nextState;
        module.exports.run( creep );	// Call the main run function so that the next state function runs straight away
        return;		// We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
    };

    // Initialize the creep if that hasn't been done yet.
    if ( !creep.memory.init ) {
        // Nothing to store in memory at this point

        // So that we know in the following ticks that it's already been initialized...
        creep.memory.init = true;
    };

};

const runMoving = function ( creep, options ) {

    // Determine the next transition state

    // Get the Destination from memory

    // Check if you've arrived at the destination and transition to the next state or Move closer to the Destination

};

const runGrabResource = function ( creep, options ) {

};

const runDepositResource = function ( creep, options ) {

};

const getDestination = function ( creep, options ) {

    // If Energy in the terminal is low then set target to Storage and transition to Grab Resources

    // If Oxygen in the terminal is low then set target to Storage and transition to Grab Resources   

};