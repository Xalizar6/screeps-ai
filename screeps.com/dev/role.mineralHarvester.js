"use strict"; // Declaring Strict Mode to enforce better coding standards

const myFunctions = require('helper_myFunctions');
const log = require('./helper_logging');
const myConstants = require('./helper_constants');

module.exports = {

    run: function (creep) {

        log.output('Debug', 'Begin - Role Mineral Harvester Run routine for ' + creep.name, true);
        const timer1 = Game.cpu.getUsed();

        // Add transition state information to the creep memory
        if (!creep.memory.state) {
            creep.memory.state = myConstants.STATE_SPAWNING;
        };

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

        log.output('Debug', 'Role Mineral Harvester Run routine took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Harvester Run routine');

    },

    runSpawning: function (creep, transitionState) {

        log.output('Debug', 'Begin - Role Mineral Harvester Spawning routine for ' + creep.name, true);
        const timer1 = Game.cpu.getUsed();

        // Once the creep spawns we transition to the next state
        if (creep.spawning === false) {
            creep.memory.state = myConstants.STATE_MOVING;	// Set the creeps new state
            this.run(creep);	// Call the main run function so that the next state function runs straight away
            return;		// We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
        };

        // "needs to be initialized" -> we initialize the creep if that hasn't been done yet.
        if (!creep.memory.init) {

            // We might need to evaluate something, register the creep with some other code we have, do some work based on the memory that the creep was spawned with...
            // Set up the creep's memory... Ideally you want to cache as much info as possible so that the work is only done in 1 tick of the creep's life, not all 1500 of them plus spawning time!
            // For this example, we probably want to figure out which source the creep should harvest and store that in memory (the objectId, or it's position, or maybe both, or maybe not at all... it depends on your code!).

            // Store the mineral source ID in creep memory. The source is taken from room memory.
            if (!creep.memory.source) {
                creep.memory.source = {};
                creep.memory.source.id = creep.room.memory.minerals[0].id;
            };

            // Store the target position of the mineral source in creep memory.  The target position is taken from the room memory.
            if (!creep.memory.targetPos) {
                creep.memory.targetPos = {};
                creep.memory.targetPos.x = creep.room.memory.minerals[0].pos.x;
                creep.memory.targetPos.y = creep.room.memory.minerals[0].pos.y;
                creep.memory.targetPos.roomName = creep.room.memory.minerals[0].pos.roomName;
            };

            // Store the Extractor ID that is built on the Mineral Source in Memory so we can monitor the cooldown.
            let extractor = creep.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTRACTOR } });
            if (extractor) {
                if (!creep.memory.extractorID) {
                    for (let i in extractor) {
                        creep.memory.extractorID = extractor[i].id;
                    };
                };
            };

            // So that we know in the following ticks that it's already been initialized...
            creep.memory.init = true;

        };

        log.output('Debug', 'Role Mineral Harvester Spawning routine took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Harvester Spawning routine');

    },

    runMoving: function (creep, transitionState) {

        log.output('Debug', 'Begin - Role Mineral Harvester Moving routine for ' + creep.name, true);
        const timer1 = Game.cpu.getUsed();

        const pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);

        // Has the creep arrived?
        if (creep.pos.getRangeTo(pos) <= 1) {
            creep.memory.state = myConstants.STATE_HARVESTING;
            this.run(creep);
            return;
        };

        // It hasn't arrived, so we get it to move to targetPos
        creep.moveTo(pos);

        log.output('Debug', 'Role Mineral Harvester Moving routine took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Harvester Moving routine');

    },

    runHarvesting: function (creep, transitionState) {
        log.output('Debug', 'Begin - Role Mineral Harvester Harvesting routine for ' + creep.name, true);
        const timer1 = Game.cpu.getUsed();

        // Make sure the extractor is off cooldown when we try to extract from the mineral
        const extractor = Game.getObjectById(creep.memory.extractorID);
        if (extractor.cooldown === 0) {
            const source = Game.getObjectById(creep.memory.source.id);
            myFunctions.harvestEnergy(creep, source);
        };

        log.output('Debug', 'Role Mineral Harvester Harvesting routine took: ' + (Game.cpu.getUsed() - timer1) + ' CPU Time', false, true);
        log.output('Debug', 'End - Role Mineral Harvester Harvesting routine');

    },

};