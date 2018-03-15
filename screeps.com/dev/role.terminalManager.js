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
        Loading the Terminal with resources
            Set a memory value as to whether we are in loading or unloading mode?
            This would allow the moving function to set the target easily
        Unloading the Terminal of resources
*/

"use strict"; // Declaring Strict Mode to enforce better coding standards

const log = require( './helper_logging' );
const myConstants = require( './helper_constants' );
const debug = true; // Turn logging for this module on and off


module.exports = {

    run: function ( creep ) {

        if ( debug ) { log.output( 'Debug', 'Begin - Terminal Manager Run routine for ' + creep.name, true ) };
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

        if ( debug ) { log.output( 'Debug', 'Terminal Manager Run routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
        if ( debug ) { log.output( 'Debug', 'End - Terminal Manager Run routine' ) };

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
    let transitionState = options.context ? getDestination( creep ).nextState : options.nextState;
    /*
        // This is the full code that the statement above stands for
        let transitionState = null;
        if ( options.context ) {
            transitionState = getDestination( creep ).nextState;
        } else {
            transitionState = options.nextState;
        };
    */

    // Get the Destination from memory that was set in getDestination
    const destination = new RoomPosition( creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName );

    // Check if you've arrived at the destination and transition to the next state
    //   or
    // Move closer to the Destination
    if ( creep.pos.getRangeTo( destination ) <= 1 ) {
        creep.memory.state = transitionState;
        module.exports.run( creep );
    } else {
        creep.moveTo( destination );
    };

};

const runGrabResource = function ( creep, options ) {
    // Determine your pickup target

    // Determine which resource to pick up

    // Pick up the resource

};

const runDepositResource = function ( creep, options ) {
    // Determine your deposit target

    // Determine which resource to deposit

    // Deposit the resource

};

const getDestination = function ( creep, options ) {

    // If Energy in the terminal is low then set TargetPOS to Storage and transition to Grab Resources
    if ( creep.room.terminal.store[RESOURCE_ENERGY] < myConstants.TERMINAL_STORED_ENERGY ) {
        creep.memory.targetPos = creep.room.storage.pos;
        return { nextState: myConstants.STATE_GRAB_RESOURCE };
    };

    // If Energy in the terminal is low and carrying energy set Destination to Terminal and transition to Deposit Resources
    // return { nextState: myConstants.STATE_DEPOSIT_RESOURCE };

    // If Oxygen in the terminal is low then set Destination to Storage and transition to Grab Resources   
    // return { nextState: myConstants.STATE_GRAB_RESOURCE };

    // If Oxygen in the terminal is low and carrying Oxygen set Destination to Terminal and transition to Deposit Resources
    // return { nextState: myConstants.STATE_DEPOSIT_RESOURCE };

};