"use strict"; // Declaring Strict Mode to enforce better coding standards


const log = require('./helper_logging');
log.output('Info', "Begin - Initializing Globals", true);
const init = require('./helper_initializations');
// init.initMemory(); // Not doing this right now until I need it
log.output('Info', "End - Initializing Globals");


module.exports.loop = function () { // Main loop that is executed every tick.


    log.output('Info', "Begin - Main", true);


    log.output('Info', "Begin - Creating Empire Object", true, true);
    let empire = init.initEmpire("Xalizar's Empire");
    log.output('Info', "End - Creating Empire Object", false, true);
    log.output('Debug', "Name of Empire object: " + empire.name, false, true);


    log.output('Info', "Begin - Getting all Operations by flags", true, true);
    let operations = init.getOperations(empire);
    log.output('Info', "End - Getting all Operations by flags", false, true);

    log.output('Info', "Begin - Initiating Operations", true, true);
    for (let operation in operations) {
        log.output('Debug',
            'Operation name: ' + operations[operation].name + "    " +
            'Operation type: ' + operations[operation].type + "    " +
            'Operation flag: ' + operations[operation].flag.name + "    " +
            'Operation room: ' + operations[operation].flag.room.name, false, true
        )

        operations[operation].init();

    };
    log.output('Info', "End - Initiating Operations", false, true);
    

    log.output('Info', "Begin - Getting all visible rooms for the Empire Object", true, true);
    empire.getVisibleRooms();
    log.output('Info', "End - Getting all visible rooms for the Empire Object", false, true);


    // Post Operations actions and utilities below
    log.output('Info', "Begin - Initializing console commands and adding to global", true, true);
    init.initConsoleCommands();
    log.output('Info', "End - Initializing console commands and adding to global", false, true);


    log.output('Info', "End - Main", true);
    
};