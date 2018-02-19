"use strict"; // Declaring Strict Mode to enforce better coding standards

const consoleCommands = require('./helper_consoleCommands');

module.exports = {

    initConsoleCommands: function () {
        // @ts-ignore
        global.cc = consoleCommands; // Make my consoleCommands available globally via the console with cc alias.
    },

    initMemory: function () {


    },

};