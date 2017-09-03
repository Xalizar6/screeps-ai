"use strict"; // Declaring Strict Mode to enforce better coding standards

// Included module files. Executed on new global creation.
const log = require('./helper_logging');
const init = require('./helper_initializations');
const Empire = require('./class_Empire');



// Provide an info message to the console when the globals are reloaded.
// log.info("Refreshing Globals")

// Initializations to perform with every Global refresh
// init.initMemory(); // Not doing this right now until I need it


// Main loop that is executed every tick.
module.exports.loop = function () {

    // Create a new empire object
    var empire = new Empire("Xalizar's empire");


    // Post Operations actions and utilities below

    // Put my console commands into the Global scope so I can access from the command line
    init.initConsoleCommands();

};