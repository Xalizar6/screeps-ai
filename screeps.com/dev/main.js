"use strict"; // Declaring Strict Mode to enforce better coding standards


const log = require('./helper_logging');
log.output('Info', "Initializing Globals", true);
const init = require('./helper_initializations');


// Initializations to perform with every Global refresh
// init.initMemory(); // Not doing this right now until I need it


module.exports.loop = function () { // Main loop that is executed every tick.


    log.output('Info', "Initializing Main", true);


    log.output('Info', "Begin - Creating Empire Object", false, true);
    let empire = init.initEmpire("Xalizar's Empire");
    log.output('Info', "End - Creating Empire Object", false, true);
    log.output('Debug', "Name of Empire object: " + empire.name, false, true);


    log.output('Info', "Begin - Getting all Operations by flags", false, true);
    let operations = init.getOperations(empire);
    log.output('Info', "End - Getting all Operations by flags", false, true);

    
    log.output('Info', "Getting all visible rooms for the Empire Object", false, true);
    empire.getVisibleRooms();


    // Post Operations actions and utilities below
    log.output('Info', "Initializing console commands and adding to global", false, true);
    init.initConsoleCommands();

    // test

};