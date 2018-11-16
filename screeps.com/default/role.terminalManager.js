/* 
    Logic
        Should only spawn if the terminal has more or less resources than it needs
            To Do: Build this into Spawncode
        Once spawned it should move resources between the terminal and room storage
        Values for how much should be in the terminal are stored in the Constants file

    States
        Spawning
        Moving (to terminal / to storage)
        Grab Resources
        Deposit Resources
        Idle
        
    Modes
        Loading Terminal
        Unloading Terminal
*/

"use strict"; // Declaring Strict Mode to enforce better coding standards

const _ = require( 'lodash' );
const log = require( './helper_logging' );
const myConstants = require( './helper_constants' );
const debug = false; // Turn logging for this module on and off

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
                runMoving( creep, { getContext: true } );
                break;
            case myConstants.STATE_GRAB_RESOURCE:
                runGrabResource( creep, { nextState: myConstants.STATE_MOVING } );
                break;
            case myConstants.STATE_DEPOSIT_RESOURCE:
                runDepositResource( creep, { nextState: myConstants.STATE_MOVING } );
                break;
            case myConstants.STATE_IDLE:
                runIdle( creep );
        };

        if ( debug ) { log.output( 'Debug', 'Terminal Manager Run routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
        if ( debug ) { log.output( 'Debug', 'End - Terminal Manager Run routine' ) };

    },
};

const runSpawning = function ( creep, options ) {

    if ( debug ) { log.output( 'Debug', 'Begin - Run Spawning routine for ' + creep.name, true ) };
    const timer = Game.cpu.getUsed();

    // Once the creep finishes spawning we transition to the next state
    if ( !creep.spawning ) {
        creep.memory.state = options.nextState;
        module.exports.run( creep );	// Call the main run function so that the next state function runs straight away
        return;		// We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
    };

    // Initialize the creep if that hasn't been done yet.
    if ( !creep.memory.init ) {
        creep.memory.command = {};
        creep.memory.init = true;
    };

    if ( debug ) { log.output( 'Debug', 'Run Spawning routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Run Spawning routine' ) };

};

const runMoving = function ( creep, options ) {

    if ( debug ) { log.output( 'Debug', 'Begin - Run Moving routine for ' + creep.name, true ) };
    const timer = Game.cpu.getUsed();

    // Declare Variables
    let destination = null;
    let range = null;
    let transitionState = null;
    let command = null;

    if ( debug ) { log.output( "Debug", "Options.getContext value = " + options.getContext, false, true ) };

    if ( options.getContext ) {

        if ( debug ) { log.output( "Debug", "Running Get Next Routine", false, true ) };
        command = getNext( creep );
        creep.memory.command = command;
        destination = Game.getObjectById( command.destinationID );
        range = command.range;
        transitionState = command.nextState;

    } else {

        if ( debug ) { log.output( "Debug", "Skipping Get Next Routine", false, true ) };
        transitionState = options.nextState;

    };

    if ( debug ) { log.output( "Debug", "Destination = " + destination, false, true ) };
    if ( debug ) { log.output( "Debug", "Range = " + range, false, true ) };
    if ( debug ) { log.output( "Debug", "TransitionState = " + transitionState, false, true ) };

    // Check if you've arrived at the destination and transition to the next state
    //   or
    // Move closer to the Destination
    if ( creep.pos.getRangeTo( destination.pos ) === range + 1 ) {

        if ( debug ) { log.output( "Debug", "Will be in range of destination next tick", false, true ) };
        let status = creep.moveTo( destination.pos );
        console.log( "MoveTo status = " + status );
        creep.memory.state = transitionState;

    } else if ( creep.pos.getRangeTo( destination.pos ) === range ) {
        if ( debug ) { log.output( "Debug", "Already in range of destination", false, true ) };
        creep.memory.state = transitionState;

    } else {

        let status = creep.moveTo( destination.pos );
        if ( debug ) { log.output( "Debug", "Moving closer to destination", false, true ) };
        console.log( "MoveTo status = " + status );

    };

    if ( debug ) { log.output( 'Debug', 'Run Moving routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Run Moving routine' ) };

};

const runGrabResource = function ( creep, options ) {

    if ( debug ) { log.output( 'Debug', 'Begin - Run Grab Resources routine for ' + creep.name, true ) };
    const timer = Game.cpu.getUsed();

    const creepMemory = creep.memory.command;

    // Determine your pickup target
    let source = Game.getObjectById( creepMemory.destinationID );

    // Determine which resource to pick up
    let resource = creepMemory.resourceType;

    // Pick up the resource
    if ( source.store[resource] >= creep.carryCapacity && _.sum( creep.carry ) < creep.carryCapacity ) {
        const withdrawStatus = creep.withdraw( source, resource );
        if ( debug ) { log.output( "Debug", "Creep withdrew " + resource + " with a status of " + withdrawStatus, false, true ) };
        creep.memory.state = options.nextState;
    };

    if ( debug ) { log.output( 'Debug', 'Run Grab Resources routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Run Grab Resources routine' ) };

};

const runDepositResource = function ( creep, options ) {

    if ( debug ) { log.output( 'Debug', 'Begin - Run Deposit Resources routine for ' + creep.name, true ) };
    const timer = Game.cpu.getUsed();

    const creepMemory = creep.memory.command;

    // Determine your deposit target
    const destination = Game.getObjectById( creepMemory.destinationID );

    // Determine which resource to deposit
    const resource = creepMemory.resourceType;

    // Deposit the resource
    let depositStatus = creep.transfer( destination, resource );
    creep.memory.state = options.nextState;
    if ( debug ) { log.output( "Debug", "Transferred " + resource + " to " + destination + " with a status of " + depositStatus, false, true ) };

    if ( debug ) { log.output( 'Debug', 'Run Deposit Resources routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Run Deposit Resources routine' ) };

};

const getNext = function ( creep ) {

    if ( debug ) { log.output( 'Debug', 'Begin - Run Get Next routine for ' + creep.name, true ) };
    const timer = Game.cpu.getUsed();

    // Declare Variables
    const terminal = creep.room.terminal;
    const storage = creep.room.storage;
    const energyInTerminal = terminal.store[RESOURCE_ENERGY];
    const desiredEnergyInTerminal = myConstants.TERMINAL_ENERGY_STORAGE_TARGET;
    const desiredOxygenInTerminal = myConstants.TERMINAL_OXYGEN_STORAGE_TARGET;
    let oxygenInTerminal = null;

    if ( terminal.store[RESOURCE_OXYGEN] ) {
        oxygenInTerminal = terminal.store[RESOURCE_OXYGEN];
    } else {
        oxygenInTerminal = 0
    };

    // If Energy in the terminal is low and the creep is not full then set destinationID to Storage and transition to Grab Resources
    if ( energyInTerminal < desiredEnergyInTerminal && _.sum( creep.carry ) === 0 ) {
        if ( debug ) { log.output( "Debug", "Picking up Energy to add to Terminal", false, true ) };
        return { destinationID: storage.id, range: 1, resourceType: RESOURCE_ENERGY, nextState: myConstants.STATE_GRAB_RESOURCE };
    };

    // If Energy in the terminal is low and carrying energy set Destination to Terminal and transition to Deposit Resources
    if ( energyInTerminal < desiredEnergyInTerminal && creep.carry[RESOURCE_ENERGY] ) {
        if ( debug ) { log.output( "Debug", "Adding Energy to Terminal", false, true ) };
        return { destinationID: terminal.id, range: 1, resourceType: RESOURCE_ENERGY, nextState: myConstants.STATE_DEPOSIT_RESOURCE };
    };

    // If Oxygen in the terminal is low and the creep is not full then set Destination to Storage and transition to Grab Resources   
    if ( oxygenInTerminal < desiredOxygenInTerminal && _.sum( creep.carry ) === 0 ) {
        if ( debug ) { log.output( "Debug", "Picking up Oxygen to add to Terminal", false, true ) };
        return { destinationID: storage.id, range: 1, resourceType: RESOURCE_OXYGEN, nextState: myConstants.STATE_GRAB_RESOURCE };
    };

    // If Oxygen in the terminal is low and carrying Oxygen set Destination to Terminal and transition to Deposit Resources
    if ( oxygenInTerminal < desiredOxygenInTerminal && creep.carry[RESOURCE_OXYGEN] ) {
        if ( debug ) { log.output( "Debug", "Adding Oxygen to Terminal", false, true ) };
        return { destinationID: terminal.id, range: 1, resourceType: RESOURCE_OXYGEN, nextState: myConstants.STATE_DEPOSIT_RESOURCE };
    };

    // Do nothing
    if ( debug ) { log.output( 'Debug', 'Run Get Next routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Get Next routine' ) };
    return { destinationID: storage.id, range: 1, nextState: myConstants.STATE_MOVING };

};



const runIdle = function ( creep ) {
    if ( debug ) { log.output( "Debug", "Idle, waiting for work", false, true ) };
    getNext( creep );
};