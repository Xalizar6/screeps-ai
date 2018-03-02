"use strict"; // Declaring Strict Mode to enforce better coding standards

const consoleCommands = require('./helper_consoleCommands');
const log = require("./helper_logging");

module.exports = {

    initConsoleCommands: function () {
        // @ts-ignore
        global.cc = consoleCommands; // Make my consoleCommands available globally via the console with cc alias.
    },

    initMemory: function () {


    },

    // Add all of the mineral locations in a room to the Room object in memory
    addMineralsToMemory: function () {
        log.output('Info', 'Begin - Adding Minerals to Room Memory', true);
        const timer = Game.cpu.getUsed();

        const oRoom = Game.spawns['Spawn1'].room;
        const arrayOfMinerals = oRoom.find(FIND_MINERALS);
        const arrayOfContainers = oRoom.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER
        });

        if (arrayOfMinerals) {

            if (!oRoom.memory.minerals) {
                oRoom.memory.minerals = {};
            };

            for (let i in arrayOfMinerals) {

                if (!oRoom.memory.minerals[i]) {
                    oRoom.memory.minerals[i] = {};
                };

                if (!oRoom.memory.minerals[i].id) {
                    oRoom.memory.minerals[i].id = arrayOfMinerals[i].id;
                };

                // Delete after 3/2/18
                // if (!oRoom.memory.minerals[i].pos) {
                //     oRoom.memory.minerals[i].pos = arrayOfMinerals[i].pos;
                // };

                if (arrayOfContainers) {

                    for (let i in arrayOfContainers) {

                        // Will find a container within 1 space of the mineral
                        if (arrayOfContainers[i].pos.isNearTo(arrayOfMinerals[i])) {

                            oRoom.memory.minerals[i].container = arrayOfContainers[i].id;

                        };

                    };

                };

            };

        };

        log.output('Info', 'Adding Minerals to Room Memory took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Info', 'End - Adding Minerals to Room Memory');
    },

    // Add all of the sources in a room to the Room object in memory
    addSourcesToMemory: function () {

        log.output('Info', 'Begin - Adding Energy sources to Room Memory', true);
        const timer = Game.cpu.getUsed();

        if (!Game.spawns['Spawn1'].room.memory.sources) {
            Game.spawns['Spawn1'].room.memory.sources = {};
        };

        const arrayOfSources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        for (let i in arrayOfSources) {

            if (!Game.spawns['Spawn1'].room.memory.sources[i]) {
                Game.spawns['Spawn1'].room.memory.sources[i] = {};
            };

            if (!Game.spawns['Spawn1'].room.memory.sources[i].id) {
                Game.spawns['Spawn1'].room.memory.sources[i].id = arrayOfSources[i].id;
            };

        };

        log.output('Info', 'Adding Energy sources to Room Memory took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Info', 'End - Adding Energy sources to Room Memory');
    },

};