"use strict"; // Declaring Strict Mode to enforce better coding standards


const constants = require('./helper_constants');


module.exports = {


    /**
     * @param {string} type - The type of output message you want this to be [Event, Info, Debug, Warning, Error]
     * @param {string} message - The message you want to display
     * @param {boolean} lineBreak - Indicate if you want a line break before the message
     * @param {boolean} tab - Indicate if you want to indent the message
     */
    output: function (type, message, lineBreak = false, tab = false) {
        var runCode = false;

        switch (type) {
            case 'Event':
                if (constants.showEventMessages) {
                    runCode = true;
                };
                break;

            case 'Info':
                if (constants.showInfoMessages) {
                    runCode = true;
                };
                break;

            case 'Debug':
                if (constants.showDebugMessages) {
                    runCode = true;
                };
                break;

            case 'Warning':
                if (constants.showWarningMessages) {
                    runCode = true;
                };
                break;

            case 'Error':
                if (constants.showErrorMessages) {
                    runCode = true;
                };
                break;
        };
        
        if (runCode) {
            if (lineBreak) {
                console.log('\n');
            };
            if (tab) {
                console.log(type + '[' + Game.time + ']: ' + "   " + message);
            } else {
                console.log(type + '[' + Game.time + ']: ' + message);
            };
        };
    },


};