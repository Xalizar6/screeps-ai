"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');
const myConstants = require('./helper_constants');

module.exports = {

    run: function (creep) {

        log.output('Debug', 'Begin - Role Mineral Hauler Run routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        // Add transition state information to the creep memory if it doesn't already exist
        if (!creep.memory.state) {
            creep.memory.state = myConstants.STATE_SPAWNING;
        };

        // Call the appropriate routine for the creep based on the current state
        switch (creep.memory.state) {
            case myConstants.STATE_SPAWNING:
                this.runSpawning(creep, myConstants.STATE_MOVING);
                break;
            case myConstants.STATE_MOVING:
                this.runMoving(creep, myConstants.STATE_PICKUP);
                break;
            case myConstants.STATE_GRAB_RESOURCE:
                this.runGrabResource(creep, myConstants.STATE_MOVING);
                break;
            case myConstants.STATE_DEPOSIT_RESOURCE:
                this.runDepositResource(creep, myConstants.STATE_MOVING);
                break;
            
        };

        log.output('Debug', 'Role Mineral Hauler Run routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Hauler Run routine');

    },

    runSpawning: function (creep, transitionState) {

        log.output('Debug', 'Begin - Role Mineral Hauler Spawning routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        // Once the creep finishes spawning we transition to the next state
        if (creep.spawning === false) {
            creep.memory.state = myConstants.STATE_MOVING;
            this.run(creep);	// Call the main run function so that the next state function runs straight away
            return;		// We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
        };

        // Initialize the creep if that hasn't been done yet.
        if (!creep.memory.init) {

            // Store the mineral source ID in the creep's memory. The source is taken from room memory.
            creep.memory.source = {};
            creep.memory.source.id = creep.room.memory.minerals[0].id;

            // Store the target position of the container near the mineral source in creep memory OR
            // store the target position of the mineral source in creep memory.  Both are taken from the room memory.
            if (creep.room.memory.minerals[0].container) {
                creep.memory.targetPos = Game.getObjectById(creep.room.memory.minerals[0].container).pos;
            } else {
                creep.memory.targetPos = Game.getObjectById(creep.room.memory.minerals[0].id).pos;
            };

            // So that we know in the following ticks that it's already been initialized...
            creep.memory.init = true;

        };

        log.output('Debug', 'Role Mineral Hauler Spawning routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Hauler Spawning routine');

    },

    runMoving: function (creep, transitionState) {

        log.output('Debug', 'Begin - Role Mineral Hauler Moving routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        const pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);

        // Has the creep arrived?
        if (creep.pos.getRangeTo(pos) <= 1) {
            creep.memory.state = myConstants.STATE_PICKUP;
            this.run(creep);
            return;
        };

        // It hasn't arrived, so we get it to move to target position
        creep.moveTo(pos);

        log.output('Debug', 'Role Mineral Hauler Moving routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Hauler Moving routine');

    },

    runGrabResource: function (creep, transitionState) {
        log.output('Debug', 'Begin - Role Mineral Hauler Pickup routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();


        log.output('Debug', 'Role Mineral Hauler Pickup routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Hauler Pickup routine');

    },

    runDepositResource: function (creep, transitionState) {
        log.output('Debug', 'Begin - Role Mineral Hauler Pickup routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();


        log.output('Debug', 'Role Mineral Hauler Pickup routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Hauler Pickup routine');

    },

};