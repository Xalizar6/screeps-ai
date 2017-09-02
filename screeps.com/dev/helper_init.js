"use strict"; // Declaring Strict Mode to enforce better coding standards

const consoleCommands = require('./helper_consoleCommands');


module.exports = {

    initConsoleCommands: function () {
        global.cc = consoleCommands; // Make my consoleCommands available in the console.
    },



};