"use strict"; // Declaring Strict Mode to enforce better coding standards


module.exports = {

    // Show info about all of my living creeps
    listCreeps: function () {
        for (let creep in Game.creeps) {
            console.log(creep + "    " + Game.creeps[creep].memory.role + "   " + Game.creeps[creep].ticksToLive)
        };
    },

    // Turn debug logging in the console on/off
    toggleDebug: function () {
        if (Memory.logging.showDebugMessages != true) {
            Memory.logging.showDebugMessages = true;
        } else {
            Memory.logging.showDebugMessages = false;
        };
    },


};