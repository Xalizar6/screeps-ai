"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');
const myConstants = require('./helper_constants');

module.exports = {

    run: function (creep) {

        log.output('Debug', 'Begin - Role Mineral Harvester Run routine for ' + creep.name, true);
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
                this.runMoving(creep, myConstants.STATE_HARVESTING);
                break;
            case myConstants.STATE_HARVESTING:
                this.runHarvesting(creep, myConstants.STATE_HARVESTING);
                break;
        };

        log.output('Debug', 'Role Mineral Harvester Run routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Harvester Run routine');

    },

    runSpawning: function (creep, transitionState) {

        log.output('Debug', 'Begin - Role Mineral Harvester Spawning routine for ' + creep.name, true);
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

            // Store the Extractor ID that is built on the Mineral Source in Memory so we can monitor the cooldown timer.
            let extractor = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTRACTOR } });
            if (extractor) {
                for (let i in extractor) {
                    creep.memory.extractorID = extractor[i].id;
                };
            };

            // So that we know in the following ticks that it's already been initialized...
            creep.memory.init = true;

        };

        log.output('Debug', 'Role Mineral Harvester Spawning routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Harvester Spawning routine');

    },

    runMoving: function (creep, transitionState) {

        log.output('Debug', 'Begin - Role Mineral Harvester Moving routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        const pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);

        // Sit on top of the container if there is one or within 1 of the mineral source if no container
        let range = null;
        if (creep.room.memory.minerals[0].container) {
            range = 0
        } else {
            range = 1
        };

        // Has the creep arrived?
        if (creep.pos.getRangeTo(pos) <= range) {
            creep.memory.state = myConstants.STATE_HARVESTING;
            this.run(creep);
            return;
        };

        // It hasn't arrived, so we get it to move to target position
        creep.moveTo(pos);

        log.output('Debug', 'Role Mineral Harvester Moving routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Harvester Moving routine');

    },

    runHarvesting: function (creep, transitionState) {
        log.output('Debug', 'Begin - Role Mineral Harvester Harvesting routine for ' + creep.name, true);
        const timer = Game.cpu.getUsed();

        // Make sure the extractor is off cooldown when we try to extract from the mineral
        const extractor = Game.getObjectById(creep.memory.extractorID);
        if (extractor.cooldown === 0) {
            const source = Game.getObjectById(creep.memory.source.id);
            myFunctions.harvestEnergy(creep, source);
        };

        log.output('Debug', 'Role Mineral Harvester Harvesting routine took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Harvester Harvesting routine');

    },

};