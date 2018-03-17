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
                runMoving( creep, { context: getNext } );
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

    if ( options.context ) {
        getNext( creep );
    } else {

    };


    // Determine the next transition state
    // const transitionState = options.context ? getNext( creep ).nextState : options.nextState;
    /*
        // This is the full code that the statement above stands for
        let transitionState = null;
        if ( options.context ) {
            transitionState = getNext( creep ).nextState;
        } else {
            transitionState = options.nextState;
        };
    */

    const creepMemory = creep.memory.command;
    const destination = Game.getObjectById( creepMemory.destinationID );
    const range = creepMemory.range;
    const transitionState = creepMemory.nextState;
    if ( debug ) { log.output( "Debug", "Destination Position: " + destination.pos, false, true ) };
    if ( debug ) { log.output( "Debug", "Range: " + range, false, true ) };
    if ( debug ) { log.output( "Debug", "TransitionState: " + transitionState, false, true ) };

    // Check if you've arrived at the destination and transition to the next state
    //   or
    // Move closer to the Destination
    if ( creep.pos.getRangeTo( destination.pos ) <= range + 1 ) {
        creep.memory.state = transitionState;
        creep.moveTo( destination.pos );
    } else {
        creep.moveTo( destination.pos );
    };

};

const runGrabResource = function ( creep, options ) {

    const creepMemory = creep.memory.command;

    // Determine your pickup target
    let origin = Game.getObjectById( creepMemory.destinationID );

    // Determine which resource to pick up
    let resource = creepMemory.resourceType;

    // Pick up the resource
    if ( origin.store[resource] >= creep.carryCapacity && _.sum( creep.carry ) < creep.carryCapacity ) {
        const withdrawStatus = creep.withdraw( origin, resource );
        if ( debug ) { log.output( "Debug", "Creep.withdraw() status: " + withdrawStatus, false, true ) };
    };

    if ( _.sum( creep.carry ) == creep.carryCapacity ) {
        if ( debug ) { log.output( "Debug", "Creep is full, going to deposit", false, true ) };
        creep.memory.state = options.nextState;
    };

};

const runDepositResource = function ( creep, options ) {

    const creepMemory = creep.memory.command;

    // Determine your deposit target
    const destination = Game.getObjectById( creepMemory.destinationID );

    // Determine which resource to deposit
    const resource = creepMemory.resourceType;

    // Deposit the resource
    creep.transfer( destination, resource );
    if ( debug ) { log.output( "Debug", "Transferred " + resource + " to " + destination, false, true ) };
    creep.memory.state = options.nextState;

};

const getNext = function ( creep, options ) {

    // Declare Variables
    const terminal = creep.room.terminal;
    const storage = creep.room.storage;
    const energyInTerminal = terminal.store[RESOURCE_ENERGY];
    const desiredEnergyInTerminal = myConstants.TERMINAL_ENERGY_STORAGE_TARGET;
    const oxygenInTerminal = terminal.store[RESOURCE_OXYGEN];
    const desiredOxygenInTerminal = myConstants.TERMINAL_OXYGEN_STORAGE_TARGET;

    // If Energy in the terminal is low and the creep is not full then set TargetPOS to Storage and transition to Grab Resources
    if ( energyInTerminal < desiredEnergyInTerminal && _.sum( creep.carry ) < creep.carryCapacity ) {
        if ( debug ) { log.output( "Debug", "Adding energy to Terminal", false, true ) };
        creep.memory.command = { destinationID: storage.id, resourceType: RESOURCE_ENERGY, nextState: myConstants.STATE_GRAB_RESOURCE, range: 1 };
    };

    // If Energy in the terminal is low and carrying energy set Destination to Terminal and transition to Deposit Resources
    if ( energyInTerminal < desiredEnergyInTerminal && _.sum( creep.carry ) === creep.carryCapacity ) {
        creep.memory.command = { destinationID: terminal.id, resourceType: RESOURCE_ENERGY, nextState: myConstants.STATE_DEPOSIT_RESOURCE, range: 1 };
    };

    // If Oxygen in the terminal is low and the creep is not full then set Destination to Storage and transition to Grab Resources   
    if ( oxygenInTerminal < desiredOxygenInTerminal && _.sum( creep.carry ) < creep.carryCapacity ) {
        creep.memory.command = { destinationID: storage.id, resourceType: RESOURCE_OXYGEN, nextState: myConstants.STATE_GRAB_RESOURCE, range: 1 };
    };

    // If Oxygen in the terminal is low and carrying Oxygen set Destination to Terminal and transition to Deposit Resources
    if ( oxygenInTerminal < desiredOxygenInTerminal && _.sum( creep.carry ) === creep.carryCapacity ) {
        creep.memory.command = { destinationID: terminal.id, resourceType: RESOURCE_OXYGEN, nextState: myConstants.STATE_DEPOSIT_RESOURCE, range: 1 };
    };
};