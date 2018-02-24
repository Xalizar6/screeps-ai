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

        const arrayOfMinerals = Game.spawns['Spawn1'].room.find(FIND_MINERALS);

        if (arrayOfMinerals) {

            if (!Game.spawns['Spawn1'].room.memory.minerals) {
                Game.spawns['Spawn1'].room.memory.minerals = {};
            };

            for (let i in arrayOfMinerals) {

                if (!Game.spawns['Spawn1'].room.memory.minerals[i]) {
                    Game.spawns['Spawn1'].room.memory.minerals[i] = {};
                };

                if (!Game.spawns['Spawn1'].room.memory.minerals[i].id) {
                    Game.spawns['Spawn1'].room.memory.minerals[i].id = arrayOfMinerals[i].id;
                };

                if (!Game.spawns['Spawn1'].room.memory.minerals[i].pos) {
                    Game.spawns['Spawn1'].room.memory.minerals[i].pos = arrayOfMinerals[i].pos;
                };

            };

        }; 

        log.output('Info', 'Adding Minerals to Room Memory took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Info', 'End - Adding Minerals to Room Memory');
    },

    // Add all of the sources in a room to the Room object in memory
    addSourcesToMemory: function () {

        log.output('Info', 'Begin - Adding Sources to Room Memory', true);
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

        log.output('Info', 'Adding Sources to Room Memory took: ' + (Game.cpu.getUsed() - timer) + ' CPU Time', false, true);
        log.output('Info', 'End - Adding Sources to Room Memory');
    },

};