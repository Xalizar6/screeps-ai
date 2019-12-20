"use strict" // Declaring Strict Mode to enforce better coding standards
/* global Memory */
module.exports = {

  init: function () {
    //Add the Memory.logging object to hold logging state
    if (!Memory.logging) {
      Memory.logging = {}
    };
    if (Memory.logging.showDebugMessages === undefined) {
      Memory.logging.showDebugMessages = true
    };
    if (Memory.logging.showErrorMessages === undefined) {
      Memory.logging.showErrorMessages = true
    };
    if (Memory.logging.showEventMessages === undefined) {
      Memory.logging.showEventMessages = true
    };
    if (Memory.logging.showInfoMessages === undefined) {
      Memory.logging.showInfoMessages = true
    };
    if (Memory.logging.showWarningMessages === undefined) {
      Memory.logging.showWarningMessages = true
    };
  },


  /**
   * @param {string} type - The type of output message you want this to be [Event, Info, Debug, Warning, Error]
   * @param {string} message - The message you want to display
   * @param {boolean} [lineBreak] - Indicate if you want a line break before the message
   * @param {boolean} [tab] - Indicate if you want to indent the message
   */
  output: function (type, message, lineBreak = false, tab = false) {
    let runCode = false

    switch (type) {
      case 'Debug':
        if (Memory.logging.showDebugMessages === true) {
          runCode = true
        };
        break
      case 'Error':
        if (Memory.logging.showErrorMessages === true) {
          runCode = true
        };
        break
      case 'Event':
        if (Memory.logging.showEventMessages === true) {
          runCode = true
        };
        break
      case 'Info':
        if (Memory.logging.showInfoMessages === true) {
          runCode = true
        };
        break
      case 'Warning':
        if (Memory.logging.showWarningMessages === true) {
          runCode = true
        };
        break
    };

    if (runCode) {
      if (lineBreak) {
        console.log('\n')
      };
      if (tab) {
        console.log("\t" + type + '[' + Game.time + ']: ' + message)
      } else {
        console.log(type + '[' + Game.time + ']: ' + message)
      };
    };
  },


}
