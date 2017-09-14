"use strict"; // Declaring Strict Mode to enforce better coding standards


var _ = require('lodash');
const consoleCommands = require('./helper_consoleCommands');
const constants = require('./helper_constants');
const log = require('./helper_logging');
const Empire = require('./class_Empire');
const baseOperation = require('./class_ops_baseOperation');


module.exports = {
    

    /** @param {Empire} empire */
    getOperations: function (empire) {
        let operationList = {};
        let operation;
        for (let flagName in Game.flags) {
            for (let operationType in constants.operationClasses){
                if (flagName.substring(0, operationType.length) === operationType) {
                    let operationClass = constants.operationClasses[operationType];
                    let flag = Game.flags[flagName];
                    let name = flagName.substring(flagName.indexOf("_") + 1);
                    if (operationList.hasOwnProperty(name)) {
                        log.output('Warning','An operation with the name ' + name + ' already exists on the operation list, use a different name.',true)
                    };
                    operation = new operationClass(flag, name, operationType, empire);
                    operationList[name] = operation;
                } else {
                    log.output('Warning','Flag ' + flagName + ' could not be matched to an operation type.');
                };
            };
        };
        return operationList
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