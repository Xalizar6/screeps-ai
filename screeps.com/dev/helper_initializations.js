"use strict"; // Declaring Strict Mode to enforce better coding standards


var _ = require('lodash');
const consoleCommands = require('./helper_consoleCommands');
const Empire = require('./class_Empire');


module.exports = {
    
    /** @param {Empire} empire */
    getOperations: function (empire) {
        
    
    },


    initConsoleCommands: function () {
        // @ts-ignore
        global.cc = consoleCommands; // Make my consoleCommands available globally via the console with cc alias.
    },

    
    /** @param {string} empireName */
    initEmpire: function (empireName) {
        var empire = Empire.create(empireName);
        empire.init();
        // @ts-ignore
        global.empire = empire;
        return empire;
    },


    initMemory: function () {
        _.defaultsDeep(Memory, {
            stats: {},
            temp: {},
            playerConfig: {
                terminalNetworkRange: 6,
                muteSpawn: false,
                enableStats: false,
                creditReserveAmount: Number.MAX_VALUE,
                powerMinimum: 9000,
            },
            profiler: {},
            traders: {},
            powerObservers: {},
            notifier: [],
            cpu: {
                history: [],
                average: Game.cpu.getUsed(),
            },
        });
    },



};