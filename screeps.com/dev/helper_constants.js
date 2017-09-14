"use strict"; // Declaring Strict Mode to enforce better coding standards


const baseOperation = require('./class_ops_baseOperation');


module.exports = {


    // These are the different types of Operations that can be instantiated by putting the
    // property name in the name of the flag that is put on the map.
    operationClasses: {
        base: baseOperation,
    },

// These properties are used by the helper_logging module to control the level of output
// you want to see in the console.
    showDebugMessages: true,
    showErrorMessages: true,
    showEventMessages: true,
    showInfoMessages: true,
    showWarningMessages: true,
    

};