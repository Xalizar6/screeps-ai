"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');
const myConstants = require('./helper_constants');

module.exports = {

    run: function (creep) {

        log.output('Debug', 'Begin - Mineral Hauler Run routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        // Add transition state to the creep memory if it doesn't already exist
        if (!creep.memory.state) {
            creep.memory.state = myConstants.STATE_SPAWNING;
        };

        // Call the appropriate routine for the creep based on the current state
        switch (creep.memory.state) {
            case myConstants.STATE_SPAWNING:
                this.runSpawning(creep, { nextState: myConstants.STATE_MOVING });
                break;
            case myConstants.STATE_MOVING:
                this.runMoving(creep, { context: haulerContext });
                break;
            case myConstants.STATE_GRAB_RESOURCE:
                this.runGrabResource(creep, { nextState: myConstants.STATE_MOVING });
                break;
            case myConstants.STATE_DEPOSIT_RESOURCE:
                this.runDepositResource(creep, { nextState: myConstants.STATE_MOVING });
                break;

        };

        log.output('Debug', 'Mineral Hauler Run routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Mineral Hauler Run routine');

    },

    runSpawning: function (creep, options) {

        log.output('Debug', 'Begin - Mineral Hauler Spawning routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        // Once the creep finishes spawning we transition to the next state
        if (creep.spawning === false) {
            creep.memory.state = options.nextState;
            this.run(creep);	// Call the main run function so that the next state function runs straight away
            return;		// We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
        };

        // Initialize the creep if that hasn't been done yet.
        if (!creep.memory.init) {

            // Store the mineral source ID in the creep's memory. The source is taken from room memory.
            // creep.memory.sourceid = creep.room.memory.minerals[0].id;

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

        log.output('Debug', 'Mineral Hauler Spawning routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Mineral Hauler Spawning routine');

    },

    runMoving: function (creep, options) {

        log.output('Debug', 'Begin - Mineral Hauler Moving routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        // This statement is shorthand for the function right below it. They are both here for clarity for now.
        // let transitionState = options.context ? haulerContext(creep, myConstants.STATE_MOVING).nextState : options.nextState;

        let transitionState = null;
        if (options.context) {
            transitionState = haulerContext(creep, myConstants.STATE_MOVING).nextState;
        } else {
            transitionState = options.nextState;
        }

        // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext().
        const pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);

        // Has the creep arrived?
        if (creep.pos.getRangeTo(pos) <= 1) {
            creep.memory.state = transitionState;
            this.run(creep);
            return;
        };

        // It hasn't arrived, so we get it to move to target position
        creep.moveTo(pos);

        log.output('Debug', 'Mineral Hauler Moving routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Mineral Hauler Moving routine');

    },

    runGrabResource: function (creep, transitionState) {
        log.output('Debug', 'Begin - Mineral Hauler Grab Resource routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        // Find nearby structures
        let structures = creep.pos.findInRange(FIND_STRUCTURES, 1);
        if (structures.length > 0) {
            log.output("Debug", "Found nearby structures", false, true);
            // log.output("Debug", creep.pos.findInRange(FIND_STRUCTURES, 1), false, true);

            // Determine if the structure is a container
            for (let i in structures) {
                if (structures[i].structureType === STRUCTURE_CONTAINER) {
                    log.output("Debug", "At lease one structure is a container", false, true);

                    // Determine if the structure contains Oxygen
                    if (structures[i].store[RESOURCE_OXYGEN]) {
                        log.output("Debug", "At lease one container is storing Oxygen", false, true);
                        log.output("Debug", "There is this much Oxygen in the container: " + structures[i].store[RESOURCE_OXYGEN], false, true);

                        // Witihdraw Oxygen from the container
                        if (creep.withdraw(structures[i], RESOURCE_OXYGEN) == OK) {
                            log.output("Debug", "Creep withdrew Oxygen from the container", false, true);
                            creep.memory.state = myConstants.STATE_MOVING;
                            this.run(creep);
                        };
                    };

                };

            };

        };

        /*
                if (creep.pos.findInRange(FIND_CREEPS, 1).length > 0) {
                    console.log("Found nearby creep");
                    console.log(creep.pos.findInRange(FIND_CREEPS, 1));
                };
        */

        log.output('Debug', 'Mineral Hauler Grab Resource routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Mineral Hauler Grab Resource routine');

    },

    runDepositResource: function (creep, transitionState) {
        log.output('Debug', 'Begin - Mineral Hauler Deposit routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        creep.transfer(creep.room.storage, RESOURCE_OXYGEN);
        log.output("Debug", "Transferred Oxygen to storage", false, true);
        creep.memory.state = myConstants.STATE_MOVING;
        this.run(creep);

        log.output('Debug', 'Mineral Hauler Deposit routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Mineral Hauler Deposit routine');

    },

};

const getHaulerDepositTarget = function (creep) {
    // We work out where to put the resources...
    // Perhaps we fill the spawn/extensions...
    // Perhaps we deposit into the storage/terminal...
    // Perhaps we fill towers, labs, nukers, power spawn, etc...
    // It depends on your code!
    if (creep.room.storage) {
        return creep.room.storage.pos;
    };

};

const getHaulerSourceTarget = function (creep) {

    if (creep.room.memory.minerals[0].container) {
        return Game.getObjectById(creep.room.memory.minerals[0].container).pos;
    } else {
        return Game.getObjectById(creep.room.memory.minerals[0].id).pos;
    };

};

const haulerContext = function (creep, currentState) {

    switch (currentState) {
        case myConstants.STATE_MOVING:
            if (_.sum(creep.carry) > 0) {
                creep.memory.targetPos = getHaulerDepositTarget(creep);
                return { nextState: myConstants.STATE_DEPOSIT_RESOURCE };
            } else {
                creep.memory.targetPos = getHaulerSourceTarget(creep);
                return { nextState: myConstants.STATE_GRAB_RESOURCE };
            };
    };

};