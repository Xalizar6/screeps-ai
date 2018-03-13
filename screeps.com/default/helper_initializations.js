"use strict"; // Declaring Strict Mode to enforce better coding standards

const consoleCommands = require('./helper_consoleCommands');
const log = require("./helper_logging");

// Declare Variables
const oRoom = Game.spawns['Spawn1'].room;
const arrayOfMinerals = oRoom.find(FIND_MINERALS);
const arrayOfContainers = oRoom.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
const arrayOfExtractors = oRoom.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTRACTOR } });
const arrayOfEnergySources = oRoom.find(FIND_SOURCES);

module.exports = {

    initConsoleCommands: function () {
        // @ts-ignore
        global.cc = consoleCommands; // Make my consoleCommands available globally via the console with cc alias.
    },

    initMemory: function () {


    },

    // Add all of the mineral locations in a room to the Room object in memory
    addMineralsToMemory: function () {
        
        if (arrayOfMinerals.length > 0) {

            if (!oRoom.memory.minerals) {
                oRoom.memory.minerals = {}; 
            };

            for (const i in arrayOfMinerals) {

                if (!oRoom.memory.minerals[i]) {
                    oRoom.memory.minerals[i] = {};
                };

                if (!oRoom.memory.minerals[i].id) {
                    oRoom.memory.minerals[i].id = arrayOfMinerals[i].id;
                };

                // Store the Extractor ID that is built on the Mineral Source in Memory so we can monitor the cooldown timer.
                if (arrayOfExtractors.length > 0) {
                    for (const i in arrayOfExtractors) {
                        if (arrayOfExtractors[i].pos = arrayOfMinerals[i].pos) {
                            oRoom.memory.minerals[i].extractorID = arrayOfExtractors[i].id;
                        };
                    };
                };

                if (arrayOfContainers.length > 0) {
                    for (const i in arrayOfContainers) {
                        // Will find a container within 1 space of the mineral
                        if (arrayOfContainers[i].pos.isNearTo(arrayOfMinerals[i])) {
                            oRoom.memory.minerals[i].containerID = arrayOfContainers[i].id;
                        };
                    };
                };

            };

        };

    },

    // Add all of the sources in a room to the Room object in memory
    addSourcesToMemory: function () {

        if (!oRoom.memory.sources) {
            oRoom.memory.sources = {};
        };

        for (const i in arrayOfEnergySources) {

            if (!oRoom.memory.sources[i]) {
                oRoom.memory.sources[i] = {};
            };

            if (!oRoom.memory.sources[i].id) {
                oRoom.memory.sources[i].id = arrayOfEnergySources[i].id;
            };

            if (arrayOfContainers.length > 0) {
                for (const i in arrayOfContainers) {
                    // Will find a container within 1 space of the Energy Source
                    if (arrayOfContainers[i].pos.isNearTo(arrayOfEnergySources[i])) {
                        oRoom.memory.sources[i].containerID = arrayOfContainers[i].id;
                    };
                };
            };

        };

    },

};