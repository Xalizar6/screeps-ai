"use strict"; // Declaring Strict Mode to enforce better coding standards

// Be careful not to include any other modules here that will cause a circular reference.
// There shouldn't need to be any require statements here.


module.exports = {

    STATE_SPAWNING: 0,
    STATE_MOVING: 1,
    STATE_HARVESTING: 2,
    STATE_DEPOSIT_RESOURCE: 3,
    STATE_GRAB_RESOURCE: 4,

    TERMINAL_ENERGY_STORAGE_TARGET: 2000,
    TERMINAL_OXYGEN_STORAGE_TARGET: 1000,

};