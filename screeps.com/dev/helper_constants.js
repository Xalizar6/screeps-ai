"use strict"; // Declaring Strict Mode to enforce better coding standards


const baseOperation = require('./class_ops_baseOperation');


module.exports = {

    OPERATION_CLASSES: {
        base: baseOperation,
    },

// These properties are used by the helper_logging module to control the level of output
// you want to see in the console.
    showDebugMessages: false,
    showErrorMessages: true,
    showEventMessages: true,
    showInfoMessages: true,
    showWarningMessages: true,
    

};