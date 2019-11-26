'use strict' // Declaring Strict Mode to enforce better coding standards

// There shouldn't need to be any require statements here.
// Be careful not to include any other modules here that will cause a circular reference.

module.exports = {

  STATE_SPAWNING: 0,
  STATE_MOVING: 1,
  STATE_HARVESTING: 2,
  STATE_DEPOSIT_RESOURCE: 3,
  STATE_GRAB_RESOURCE: 4,
  STATE_IDLE: 5,

  TERMINAL_ENERGY_STORAGE_TARGET: 10000,
  TERMINAL_OXYGEN_STORAGE_TARGET: 10000,

  STORAGE_ENERGY_STORAGE_TARGET: 100000

}
