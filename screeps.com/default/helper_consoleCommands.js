'use strict' // Declaring Strict Mode to enforce better coding standards

/* global Memory _  */

module.exports = {

  // Use cc.lc() to show info about all of my living creeps
  lc: function () {
    console.log('\n')
    _.forEach(Game.creeps, function (creep, key) {
      console.log(creep.name + '(' + Game.creeps[key].memory.role + ') ' + Game.creeps[key].ticksToLive)
    })
    console.log('\n')
  },

  // Turn debug logging in the console on/off
  toggleDebug: function () {
    if (Memory.logging.showDebugMessages !== true) {
      Memory.logging.showDebugMessages = true
    } else {
      Memory.logging.showDebugMessages = false
    };
  },

  // Turn error logging in the console on/off
  toggleError: function () {
    if (Memory.logging.showErrorMessages !== true) {
      Memory.logging.showErrorMessages = true
    } else {
      Memory.logging.showErrorMessages = false
    };
  },

  // Turn event logging in the console on/off
  toggleEvent: function () {
    if (Memory.logging.showEventMessages !== true) {
      Memory.logging.showEventMessages = true
    } else {
      Memory.logging.showEventMessages = false
    };
  },

  // Turn info logging in the console on/off
  toggleInfo: function () {
    if (Memory.logging.showInfoMessages !== true) {
      Memory.logging.showInfoMessages = true
    } else {
      Memory.logging.showInfoMessages = false
    };
  },

  // Turn warning logging in the console on/off
  toggleWarning: function () {
    if (Memory.logging.showWarningMessages !== true) {
      Memory.logging.showWarningMessages = true
    } else {
      Memory.logging.showWarningMessages = false
    };
  }

}
