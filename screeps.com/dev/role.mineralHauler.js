"use strict"; // Declaring Strict Mode to enforce better coding standards

const log = require( './helper_logging' );
const myConstants = require( './helper_constants' );
const debug = false;

module.exports = {

    run: function ( creep ) {

        if ( debug ) { log.output( 'Debug', 'Begin - Mineral Hauler Run routine for ' + creep.name, true ) };
        const timer = Game.cpu.getUsed();

        // Add starting transition state to the creep memory if it doesn't already exist
        if ( !creep.memory.state ) {
            creep.memory.state = myConstants.STATE_SPAWNING;
        };

        // Call the appropriate routine for the creep based on the current state
        switch ( creep.memory.state ) {
            case myConstants.STATE_SPAWNING:
                runSpawning( creep, { nextState: myConstants.STATE_MOVING } );
                break;
            case myConstants.STATE_MOVING:
                runMoving( creep, { context: haulerContext } );
                break;
            case myConstants.STATE_GRAB_RESOURCE:
                runGrabResource( creep, { nextState: myConstants.STATE_MOVING } );
                break;
            case myConstants.STATE_DEPOSIT_RESOURCE:
                runDepositResource( creep, { nextState: myConstants.STATE_MOVING } );
                break;
        };

        if ( debug ) { log.output( 'Debug', 'Mineral Hauler Run routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
        if ( debug ) { log.output( 'Debug', 'End - Mineral Hauler Run routine' ) };

    },

};

const runSpawning = function ( creep, options ) {

    if ( debug ) { log.output( 'Debug', 'Begin - Mineral Hauler Spawning routine for ' + creep.name, true ) };
    const timer = Game.cpu.getUsed();

    // Once the creep finishes spawning we transition to the next state
    if ( creep.spawning === false ) {
        creep.memory.state = options.nextState;
        module.exports.run( creep );	// Call the main run function so that the next state function runs straight away
        return;		// We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
    };

    // Initialize the creep if that hasn't been done yet.
    if ( !creep.memory.init ) {

        // Store the target position of the container near the mineral source in creep memory OR
        // Store the target position of the mineral source in creep memory.  Both are taken from the room memory.
        if ( creep.room.memory.minerals[0].containerID ) {
            creep.memory.pickupContainer = creep.room.memory.minerals[0].containerID;
            creep.memory.pickupLoc = Game.getObjectById( creep.room.memory.minerals[0].containerID ).pos;
        } else {
            creep.memory.pickupLoc = Game.getObjectById( creep.room.memory.minerals[0].id ).pos;
        };

        // So that we know in the following ticks that it's already been initialized...
        creep.memory.init = true;

    };

    if ( debug ) { log.output( 'Debug', 'Mineral Hauler Spawning routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Mineral Hauler Spawning routine' ) };

};

const runMoving = function ( creep, options ) {

    if ( debug ) { log.output( 'Debug', 'Begin - Mineral Hauler Moving routine for ' + creep.name, true ) };
    const timer = Game.cpu.getUsed();

    // This statement is shorthand for the function right below it. They are both here for clarity for now.
    // let transitionState = options.context ? haulerContext(creep, myConstants.STATE_MOVING).nextState : options.nextState;

    let transitionState = null;
    if ( options.context ) {
        transitionState = haulerContext( creep ).nextState;
    } else {
        transitionState = options.nextState;
    };

    // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext().
    const destination = new RoomPosition( creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName );

    // Has the creep arrived?
    if ( creep.pos.getRangeTo( destination ) <= 1 ) {
        creep.memory.state = transitionState;
        module.exports.run( creep );
    } else {
        // It hasn't arrived, so we get it to move to target position
        creep.moveTo( destination );
    };


    if ( debug ) { log.output( 'Debug', 'Mineral Hauler Moving routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Mineral Hauler Moving routine' ) };

};

const runGrabResource = function ( creep, options ) {
    if ( debug ) { log.output( 'Debug', 'Begin - Mineral Hauler Grab Resource routine for ' + creep.name, true ) };
    const timer = Game.cpu.getUsed();

    const pickupContainer = Game.getObjectById( creep.memory.pickupContainer );
    if ( pickupContainer.store[RESOURCE_OXYGEN] >= creep.carryCapacity ) {
        const withdrawStatus = creep.withdraw( pickupContainer, RESOURCE_OXYGEN );
        if ( debug ) { log.output( "Debug", "Creep.Withdraw() status: " + withdrawStatus, false, true ) };
    };

    if ( _.sum( creep.carry ) == creep.carryCapacity ) {
        if ( debug ) { log.output( "Debug", "Creep is full, going to unload", false, true ) };
        creep.memory.state = options.nextState;
    };

    if ( debug ) { log.output( 'Debug', 'Mineral Hauler Grab Resource routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Mineral Hauler Grab Resource routine' ) };

};

const runDepositResource = function ( creep, options ) {
    if ( debug ) { log.output( 'Debug', 'Begin - Mineral Hauler Deposit routine for ' + creep.name, true ) };
    const timer = Game.cpu.getUsed();

    creep.transfer( creep.room.storage, RESOURCE_OXYGEN );
    if ( debug ) { log.output( "Debug", "Transferred Oxygen to storage", false, true ) };
    creep.memory.state = options.nextState;

    if ( debug ) { log.output( 'Debug', 'Mineral Hauler Deposit routine took: ' + ( Game.cpu.getUsed() - timer ) + ' CPU Time', false, true ) };
    if ( debug ) { log.output( 'Debug', 'End - Mineral Hauler Deposit routine' ) };

};

const haulerContext = function ( creep ) {

    if ( _.sum( creep.carry ) > 0 ) {
        creep.memory.targetPos = creep.room.storage.pos;
        return { nextState: myConstants.STATE_DEPOSIT_RESOURCE };
    } else {
        creep.memory.targetPos = creep.memory.pickupLoc;
        return { nextState: myConstants.STATE_GRAB_RESOURCE };
    };

};